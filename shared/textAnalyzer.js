import { TEXT_ANALYSIS_PATTERNS, SCAM_CATEGORIES, HIGHLIGHT_CATEGORIES } from './scamPatterns.js';
import { analyzeUrl } from './urlAnalyzer.js';
import { BRANDS } from './brands.js';

/**
 * Detect language (Hindi, Hinglish, English)
 */
export function detectLanguage(text) {
  if (!text) return 'en';
  // Devanagari Unicode range: \u0900-\u097F
  const devanagariCount = (text.match(/[\u0900-\u097F]/g) || []).length;
  if (devanagariCount > 5) {
    return 'hi';
  }
  const hinglishWords = ['karein', 'hoga', 'aaj', 'turant', 'paisa', 'paise', 'karo', 'gaya', 'bhejo', 'khata', 'bijli', 'sampark'];
  const lower = text.toLowerCase();
  const matchedHinglish = hinglishWords.filter(w => new RegExp(`\\b${w}\\b`, 'i').test(lower));
  if (matchedHinglish.length >= 2) {
    return 'hi-Latn'; // Hinglish
  }
  return 'en';
}

/**
 * Extracts URLs from plain text
 */
export function extractUrls(text) {
  if (!text) return [];
  const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+|[a-zA-Z0-9-]+\.(?:com|in|co\.in|org|net|xyz|top|click|live|icu|site|club|app|biz|ru|cn|cc)[^\s]*)/gi;
  const matches = text.match(urlRegex) || [];
  return Array.from(new Set(matches.map(u => u.replace(/[.,;!?)]+$/, ''))));
}

/**
 * Analyzes plain message / SMS / WhatsApp / email text using Rule Engine
 */
export function analyzeText(rawText) {
  const text = (rawText || '').trim();
  if (!text) {
    return {
      isValid: false,
      error: 'Text input cannot be empty',
      riskScore: 0,
      verdict: 'SAFE',
      findings: [],
      highlights: [],
      tactics: [],
      scamType: null
    };
  }

  const lang = detectLanguage(text);
  const highlights = [];
  const findings = [];
  const tacticsSet = new Set();
  let scamCategoryCounts = {};
  let totalScore = 0;
  let impersonatedBrand = null;

  // 1. Scan against regex patterns with character offsets for precise UI highlighting
  for (const pattern of TEXT_ANALYSIS_PATTERNS) {
    const regex = new RegExp(pattern.regex.source, pattern.regex.flags);
    let match;
    let patternMatched = false;

    while ((match = regex.exec(text)) !== null) {
      patternMatched = true;
      const matchedStr = match[0];
      const start = match.index;
      const end = start + matchedStr.length;

      // Avoid overlapping duplicates
      const alreadyHighlighted = highlights.some(h => 
        (start >= h.start && start < h.end) || (end > h.start && end <= h.end)
      );

      if (!alreadyHighlighted) {
        highlights.push({
          start,
          end,
          text: matchedStr,
          category: pattern.category,
          severity: pattern.severity,
          explanation: pattern.explanation,
          color: HIGHLIGHT_CATEGORIES[pattern.category]?.color || '#F59E0B'
        });
      }

      if (pattern.scamType) {
        scamCategoryCounts[pattern.scamType] = (scamCategoryCounts[pattern.scamType] || 0) + 1;
      }
    }

    if (patternMatched) {
      totalScore += pattern.score;
      findings.push({
        id: pattern.id,
        title: pattern.explanation.split(':')[0] || 'Suspicious Pattern Detected',
        severity: pattern.severity,
        score: pattern.score,
        category: pattern.category,
        description: pattern.explanation
      });

      // Map tactics
      if (pattern.category === 'urgency') tacticsSet.add('Artificial Urgency');
      if (pattern.category === 'threat') tacticsSet.add('Legal & Coercion Threat');
      if (pattern.category === 'credential') tacticsSet.add('Credential & PIN Extraction');
      if (pattern.category === 'social_engineering') tacticsSet.add('Unrealistic Financial Reward');
    }
  }

  // 2. Check for Brand Impersonation in text
  const lowerText = text.toLowerCase();
  for (const brand of BRANDS) {
    const mentioned = brand.keywords.some(kw => new RegExp(`\\b${kw}\\b`, 'i').test(lowerText));
    if (mentioned) {
      // Check if text asks for action / urgency
      const hasAction = /update|blocked|verify|click|link|call|urgent|suspended|deactivated|kyc|pan/i.test(lowerText);
      if (hasAction) {
        impersonatedBrand = brand.name;
        tacticsSet.add(`Brand Impersonation (${brand.name})`);
        break;
      }
    }
  }

  // 3. Scan extracted URLs within the text
  const extractedLinks = extractUrls(text);
  const linkAnalyses = [];
  let hasSafeOfficialLinkOnly = false;

  if (extractedLinks.length > 0) {
    let allOfficial = true;
    for (const link of extractedLinks) {
      const linkResult = analyzeUrl(link);
      linkAnalyses.push(linkResult);

      if (linkResult.verdict === 'DANGEROUS' || linkResult.verdict === 'SUSPICIOUS') {
        allOfficial = false;
        totalScore += Math.round(linkResult.riskScore * 0.45);
        findings.push({
          id: `embedded_link_${link}`,
          title: `Malicious / Suspicious Link Embedded: ${linkResult.domain}`,
          severity: linkResult.verdict === 'DANGEROUS' ? 'critical' : 'high',
          score: Math.round(linkResult.riskScore * 0.45),
          category: 'suspicious_link',
          description: `The message embeds an unverified link (${linkResult.domain}) flagged as ${linkResult.verdict} with risk score ${linkResult.riskScore}/100.`
        });
        tacticsSet.add('Phishing Link Redirection');

        // Highlight link in text if not already highlighted
        const linkIndex = text.indexOf(link);
        if (linkIndex !== -1) {
          const already = highlights.some(h => linkIndex >= h.start && linkIndex < h.end);
          if (!already) {
            highlights.push({
              start: linkIndex,
              end: linkIndex + link.length,
              text: link,
              category: 'suspicious_link',
              severity: linkResult.verdict === 'DANGEROUS' ? 'critical' : 'high',
              explanation: `Embedded link (${linkResult.domain}) assessed as ${linkResult.verdict} [Risk: ${linkResult.riskScore}/100].`,
              color: HIGHLIGHT_CATEGORIES.suspicious_link.color
            });
          }
        }
      } else {
        // Link is safe / official
        if (!linkResult.findings.some(f => f.id.startsWith('official_'))) {
          allOfficial = false;
        }
      }
    }
    if (allOfficial && extractedLinks.length > 0) {
      hasSafeOfficialLinkOnly = true;
    }
  }

  // 3b. Legitimate Transactional Alert Detection (Discount False Positives)
  const isLegitimateDebitCredit = /\b(debited\s*from|credited\s*to)\b/i.test(text) && 
    /\b(a\/c|account)\s*(ending\s*with|\*\*|\bno\b)/i.test(text) &&
    /\b(available\s*balance|balance:?)\b/i.test(text);

  const isLegitimateBillNotice = /\b(monthly|generated|due\s*date|bill\s*of)\b/i.test(text) &&
    hasSafeOfficialLinkOnly && !/\b(disconnect|cut|block|suspend)\b/i.test(text);

  if ((isLegitimateDebitCredit || isLegitimateBillNotice) && totalScore <= 35) {
    totalScore = 0;
    findings.length = 0; // clear minor false triggers
    tacticsSet.clear();
  }

  // 4. Identify primary Scam Type
  let primaryScamType = null;
  let maxCount = 0;
  for (const [typeId, count] of Object.entries(scamCategoryCounts)) {
    if (count > maxCount) {
      maxCount = count;
      primaryScamType = typeId;
    }
  }

  // If no specific category matched but score is elevated
  if (!primaryScamType && totalScore >= 25) {
    primaryScamType = 'phishing_social_engineering';
  }

  const categoryMeta = primaryScamType ? (SCAM_CATEGORIES[primaryScamType.toUpperCase()] || {
    name: 'Suspicious Social Engineering',
    hindiName: 'संदिग्ध सोशल इंजीनियरिंग',
    description: 'Deceptive messaging intended to manipulate the recipient.'
  }) : null;

  // 5. Normalize Score
  const normalizedScore = Math.min(100, Math.max(0, totalScore));
  let verdict = 'SAFE';
  if (normalizedScore >= 60) {
    verdict = 'DANGEROUS';
  } else if (normalizedScore >= 20) {
    verdict = 'SUSPICIOUS';
  }

  // Sort highlights by character position for inline renderer
  highlights.sort((a, b) => a.start - b.start);

  // 6. Actionable recommendations
  const recommendedActions = [];
  if (verdict === 'DANGEROUS' || verdict === 'SUSPICIOUS') {
    recommendedActions.push('Do NOT click any links, open attachments, or dial phone numbers mentioned in the message.');
    recommendedActions.push('NEVER share OTP, UPI PIN, ATM PIN, or passwords with anyone, including bank staff or police.');
    if (primaryScamType === 'digital_arrest') {
      recommendedActions.push('IMPORTANT: Indian law enforcement and courts NEVER conduct online arrests or Skype interrogations. Hang up and report immediately.');
    }
    if (primaryScamType === 'electricity_cut') {
      recommendedActions.push('Check your genuine electricity bill status ONLY via your official Discom app/portal or local substation.');
    }
    if (primaryScamType === 'fake_kyc') {
      recommendedActions.push('Visit your local bank branch in person or use the official verified banking mobile app for any KYC updates.');
    }
    if (primaryScamType === 'upi_refund') {
      recommendedActions.push('Golden Rule: UPI PIN is entered ONLY to SEND money, never to receive cashback, lottery, or refunds.');
    }
    recommendedActions.push('Report online fraud immediately to the National Cyber Crime Helpline at 1930 or online at https://cybercrime.gov.in.');
    recommendedActions.push('Report suspicious mobile numbers or SMS senders on the Chakshu portal at https://sancharsaathi.gov.in.');
  } else {
    recommendedActions.push('No immediate phishing or coercion signals detected. Always maintain general vigilance before sharing personal information.');
  }

  // Plain language summary
  let explanation = '';
  if (verdict === 'DANGEROUS') {
    explanation = `High-confidence scam attempt detected! ${categoryMeta ? `Identified pattern: ${categoryMeta.name}. ` : ''}The text exhibits aggressive psychological manipulation, unauthorized authority claims, or hazardous link redirection designed to steal credentials or funds.`;
  } else if (verdict === 'SUSPICIOUS') {
    explanation = `Potential social engineering or unsolicited request detected. The text contains urgency triggers or unverified payment/account queries that warrant caution.`;
  } else {
    explanation = `The analyzed text displays typical safe patterns with no suspicious pressure tactics, financial traps, or impersonation detected.`;
  }

  // Hindi explanation for language toggle
  let explanationHi = '';
  if (verdict === 'DANGEROUS') {
    explanationHi = `उच्च जोखिम वाला फ्रॉड संदेश पकड़ा गया! ${categoryMeta ? `पहचान: ${categoryMeta.hindiName}। ` : ''}यह संदेश आपको डराकर, पैसे का लालच देकर या फर्जी लिंक के जरिए बैंक विवरण या ओटीपी चुराने के लिए बनाया गया है।`;
  } else if (verdict === 'SUSPICIOUS') {
    explanationHi = `संदिग्ध संदेश: इसमें जल्दबाजी में निर्णय लेने का दबाव या अनजान लिंक हो सकता है। कोई भी विवरण साझा न करें।`;
  } else {
    explanationHi = `विश्लेषण में कोई भी ठगी या संदिग्ध दबाव के लक्षण नहीं मिले। यह सुरक्षित प्रतीत होता है।`;
  }

  return {
    isValid: true,
    text,
    language: lang,
    riskScore: normalizedScore,
    ruleScore: normalizedScore,
    aiScore: null,
    verdict,
    scamType: primaryScamType,
    scamCategory: categoryMeta,
    impersonating: impersonatedBrand,
    tactics: Array.from(tacticsSet),
    findings,
    highlights,
    extractedLinks: linkAnalyses,
    recommendedActions,
    explanation,
    explanationHi,
    confidence: normalizedScore > 75 ? 0.94 : (normalizedScore > 30 ? 0.82 : 0.9)
  };
}
