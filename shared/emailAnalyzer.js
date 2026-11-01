import { BRANDS } from './brands.js';
import { analyzeText } from './textAnalyzer.js';
import { analyzeUrl } from './urlAnalyzer.js';

/**
 * Parses raw email headers into key-value map
 */
export function parseEmailHeaders(headerBlock) {
  if (!headerBlock) return {};
  const headers = {};
  const lines = headerBlock.split(/\r?\n/);
  let currentKey = null;

  for (const line of lines) {
    if (/^\s/.test(line) && currentKey) {
      // Continuation line (RFC 822 folding)
      headers[currentKey] += ' ' + line.trim();
    } else {
      const match = line.match(/^([^:]+):\s*(.*)$/);
      if (match) {
        currentKey = match[1].toLowerCase().trim();
        headers[currentKey] = match[2].trim();
      }
    }
  }
  return headers;
}

/**
 * Extracts display name and email address from "Name <user@domain.com>"
 */
export function parseEmailAddress(raw) {
  if (!raw) return { name: '', email: '', domain: '' };
  const match = raw.match(/^(?:"?([^"]*)"?\s)?(?:<?([^\s<>@]+@[^\s<>@]+)>?)$/i);
  if (match) {
    const name = (match[1] || '').trim();
    const email = (match[2] || '').trim().toLowerCase();
    const domain = email.split('@')[1] || '';
    return { name, email, domain };
  }
  const clean = raw.trim().toLowerCase();
  const domain = clean.includes('@') ? clean.split('@')[1] : '';
  return { name: '', email: clean, domain };
}

/**
 * Comprehensive Email Analyzer
 */
export function analyzeEmail({ subject = '', body = '', headers = '', attachments = [] }) {
  const headerMap = typeof headers === 'string' ? parseEmailHeaders(headers) : (headers || {});
  const findings = [];
  let score = 0;

  // Extract core header fields
  const fromHeader = headerMap['from'] || '';
  const replyToHeader = headerMap['reply-to'] || '';
  const returnPathHeader = headerMap['return-path'] || '';
  const authResults = headerMap['authentication-results'] || '';
  const dkimHeader = headerMap['dkim-signature'] || '';

  const fromParsed = parseEmailAddress(fromHeader);
  const replyToParsed = parseEmailAddress(replyToHeader);
  const returnPathParsed = parseEmailAddress(returnPathHeader);

  // 1. Display Name Spoofing Check
  if (fromParsed.name && fromParsed.domain) {
    const lowerName = fromParsed.name.toLowerCase();
    for (const brand of BRANDS) {
      const brandMentioned = brand.keywords.some(kw => lowerName.includes(kw));
      if (brandMentioned) {
        const isLegitDomain = brand.domains.some(d => fromParsed.domain === d || fromParsed.domain.endsWith(`.${d}`));
        if (!isLegitDomain) {
          score += 45;
          findings.push({
            id: 'display_name_spoof',
            title: `Display Name Brand Spoofing (${brand.name})`,
            severity: 'critical',
            score: 45,
            description: `The sender display name claims to be "${fromParsed.name}", but the true originating email address is "${fromParsed.email}". Legitimate ${brand.name} communications only originate from verified domains (${brand.domains.join(', ')}).`
          });
          break;
        }
      }
    }
  }

  // 2. From vs Reply-To Mismatch
  if (replyToParsed.domain && fromParsed.domain && replyToParsed.domain !== fromParsed.domain) {
    score += 30;
    findings.push({
      id: 'reply_to_mismatch',
      title: 'Sender / Reply-To Domain Divergence',
      severity: 'high',
      score: 30,
      description: `Replies are redirected to an unrelated domain ("${replyToParsed.domain}"), differing from the display sender ("${fromParsed.domain}"). This is commonly configured to divert sensitive responses to an attacker inbox.`
    });
  }

  // 3. Return-Path Mismatch
  if (returnPathParsed.domain && fromParsed.domain && returnPathParsed.domain !== fromParsed.domain) {
    score += 20;
    findings.push({
      id: 'return_path_mismatch',
      title: 'Return-Path Address Divergence',
      severity: 'medium',
      score: 20,
      description: `Bounced messages will return to "${returnPathParsed.domain}" instead of "${fromParsed.domain}", indicating third-party mail forwarding or spoofed envelope addresses.`
    });
  }

  // 4. SPF / DKIM / DMARC Authentication Analysis
  const authLower = authResults.toLowerCase();
  if (authLower.includes('spf=fail') || authLower.includes('spf=softfail')) {
    score += 30;
    findings.push({
      id: 'spf_failure',
      title: 'SPF (Sender Policy Framework) Verification Failed',
      severity: 'critical',
      score: 30,
      description: 'The sending server IP address is not authorized in DNS records to send mail on behalf of this domain.'
    });
  }
  if (authLower.includes('dkim=fail')) {
    score += 30;
    findings.push({
      id: 'dkim_failure',
      title: 'DKIM Cryptographic Signature Mismatch',
      severity: 'critical',
      score: 30,
      description: 'The email body or headers were altered in transit, or the digital signature could not be verified by the sender public key.'
    });
  }
  if (authLower.includes('dmarc=fail')) {
    score += 35;
    findings.push({
      id: 'dmarc_failure',
      title: 'DMARC Policy Rejection',
      severity: 'critical',
      score: 35,
      description: 'DMARC alignment check failed; the originating domain explicitly instructs mail providers to treat this message as unauthorized.'
    });
  }

  // Trusted Authentication Verification (Pass Bonus)
  const isAllAuthPass = authLower.includes('spf=pass') && authLower.includes('dkim=pass');
  if (isAllAuthPass) {
    findings.push({
      id: 'auth_pass_verified',
      title: 'Cryptographic SPF & DKIM Verification Passed',
      severity: 'safe',
      score: -35,
      description: 'Originating server IP and cryptographic signatures are aligned with authoritative domain records.'
    });
  }

  // 5. HTML Link Text vs Href Mismatch
  // e.g. <a href="http://badsite.com">https://hdfcbank.com</a>
  const htmlLinkRegex = /<a\s+(?:[^>]*?\s+)?href=["']([^"']*)["'][^>]*>(.*?)<\/a>/gi;
  let linkMatch;
  while ((linkMatch = htmlLinkRegex.exec(body)) !== null) {
    const actualHref = linkMatch[1];
    const displayHtml = linkMatch[2].replace(/<[^>]+>/g, '').trim();

    // Check if display text looks like a URL
    if (/^https?:\/\//i.test(displayHtml) || /[a-z0-9-]+\.[a-z]{2,}/i.test(displayHtml)) {
      try {
        const hrefHost = new URL(actualHref.startsWith('http') ? actualHref : `http://${actualHref}`).hostname.toLowerCase();
        const displayClean = displayHtml.startsWith('http') ? displayHtml : `http://${displayHtml}`;
        const displayHost = new URL(displayClean).hostname.toLowerCase();

        if (hrefHost !== displayHost) {
          score += 45;
          findings.push({
            id: 'link_text_href_mismatch',
            title: 'Deceptive Link Text vs Actual Destination Mismatch',
            severity: 'critical',
            score: 45,
            description: `The visible link anchor text displays "${displayHost}", but the actual destination link navigates to "${hrefHost}". This is textbook visual phishing deception.`
          });
        }
      } catch (e) {
        // Ignore parse error
      }
    }
  }

  // 6. Dangerous Attachment Extensions (in attachments list or body reference)
  const DANGEROUS_EXTS = ['.exe', '.scr', '.vbs', '.js', '.iso', '.bat', '.cmd', '.apk', '.html', '.htm'];
  const attachList = Array.isArray(attachments) ? [...attachments] : [];
  
  // Also check if body explicitly mentions attached dangerous files (e.g. "attached: invoice.exe")
  const bodyAttachMatch = body.match(/\b([a-zA-Z0-9_-]+\.(?:exe|scr|vbs|js|iso|bat|cmd|apk))\b/gi);
  if (bodyAttachMatch) {
    for (const bAtt of bodyAttachMatch) {
      if (!attachList.includes(bAtt)) attachList.push(bAtt);
    }
  }

  for (const att of attachList) {
    const filename = (typeof att === 'string' ? att : att.filename || '').toLowerCase();
    const matchedExt = DANGEROUS_EXTS.find(ext => filename.endsWith(ext));
    if (matchedExt) {
      score += 45;
      findings.push({
        id: `dangerous_attachment_${matchedExt}`,
        title: `High-Risk Attachment / Payload Detected (${matchedExt})`,
        severity: 'critical',
        score: 45,
        description: `Identified dangerous executable payload "${filename}". Executables delivered via email are standard distribution vectors for malware and spyware.`
      });
    }
  }

  // 7. Analyze Subject & Body text with textAnalyzer
  const fullText = `${subject ? `Subject: ${subject}\n\n` : ''}${body}`;
  const textAnalysis = analyzeText(fullText);

  // Combine scores
  const combinedScore = Math.min(100, Math.max(0, score + Math.round(textAnalysis.riskScore * 0.6)));

  let verdict = 'SAFE';
  if (combinedScore >= 60) {
    verdict = 'DANGEROUS';
  } else if (combinedScore >= 25) {
    verdict = 'SUSPICIOUS';
  }

  return {
    isValid: true,
    subject,
    from: fromParsed,
    replyTo: replyToParsed,
    returnPath: returnPathParsed,
    riskScore: combinedScore,
    verdict,
    headerFindings: findings,
    textAnalysis,
    allFindings: [...findings, ...textAnalysis.findings],
    isSafe: verdict === 'SAFE'
  };
}
