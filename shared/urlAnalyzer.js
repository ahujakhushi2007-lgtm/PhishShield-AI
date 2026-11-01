import { BRANDS, SUSPICIOUS_TLDS, URL_SHORTENERS } from './brands.js';

/**
 * Computes Levenshtein Distance between two strings
 */
export function levenshteinDistance(a, b) {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const matrix = [];
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

/**
 * Normalize character swaps (lookalikes / homoglyphs)
 */
export function normalizeLookalikes(str) {
  return str
    .replace(/rn/g, 'm')
    .replace(/vv/g, 'w')
    .replace(/0/g, 'o')
    .replace(/1/g, 'l')
    .replace(/3/g, 'e')
    .replace(/4/g, 'a')
    .replace(/5/g, 's')
    .replace(/7/g, 't')
    .replace(/8/g, 'b');
}

/**
 * Extract root domain and subdomain from hostname
 */
export function parseDomainParts(hostname) {
  if (!hostname) return { subdomain: '', domain: '', tld: '' };
  
  // IP address check
  const isIP = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(hostname);
  if (isIP) {
    return { subdomain: '', domain: hostname, tld: '' };
  }

  const parts = hostname.split('.');
  if (parts.length <= 1) {
    return { subdomain: '', domain: hostname, tld: '' };
  }

  // Handle common two-part TLDs like .co.in, .gov.in, .org.in, .ac.in, .co.uk
  let tld = parts[parts.length - 1];
  let domain = parts[parts.length - 2];
  let subdomainParts = parts.slice(0, -2);

  if (parts.length >= 3) {
    const secondLast = parts[parts.length - 2].toLowerCase();
    const last = parts[parts.length - 1].toLowerCase();
    if (['co', 'gov', 'org', 'ac', 'res', 'nic', 'edu', 'com'].includes(secondLast) && last.length === 2) {
      tld = `${secondLast}.${last}`;
      domain = parts[parts.length - 3];
      subdomainParts = parts.slice(0, -3);
    }
  }

  return {
    subdomain: subdomainParts.join('.'),
    domain: domain ? `${domain}.${tld}` : hostname,
    registeredName: domain,
    tld: `.${tld}`
  };
}

/**
 * Comprehensive URL Analysis Engine
 */
export function analyzeUrl(rawUrl) {
  let urlStr = (rawUrl || '').trim();
  if (!urlStr) {
    return {
      isValid: false,
      error: 'URL cannot be empty',
      riskScore: 0,
      verdict: 'SAFE',
      findings: []
    };
  }

  // Auto-prepend https:// if missing scheme for parsing
  let hasExplicitProtocol = /^https?:\/\//i.test(urlStr);
  let parsedUrl;
  try {
    parsedUrl = new URL(hasExplicitProtocol ? urlStr : `http://${urlStr}`);
  } catch (err) {
    return {
      isValid: false,
      error: 'Malformed URL structure',
      riskScore: 60,
      verdict: 'SUSPICIOUS',
      findings: [{
        id: 'malformed_url',
        title: 'Malformed URL Syntax',
        severity: 'high',
        score: 60,
        description: 'The URL syntax could not be resolved by standard parsers, a tactic often used to evade automated web crawlers.'
      }]
    };
  }

  const findings = [];
  let score = 0;
  const hostname = parsedUrl.hostname.toLowerCase();
  const pathname = parsedUrl.pathname.toLowerCase();
  const search = parsedUrl.search.toLowerCase();
  const fullHref = parsedUrl.href.toLowerCase();

  const domainParts = parseDomainParts(hostname);
  let brandImpersonation = null;

  // 1. IP Address as Hostname
  const isIP = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(hostname);
  if (isIP) {
    score += 45;
    findings.push({
      id: 'ip_hostname',
      title: 'Direct IP Hostname Used',
      severity: 'critical',
      score: 45,
      description: `The URL links directly to raw numerical IP address "${hostname}" instead of a registered domain name. Legitimate institutions almost never use raw IPs.`
    });
  }

  // 2. Punycode / Homograph (xn--)
  if (hostname.startsWith('xn--') || hostname.includes('.xn--')) {
    score += 40;
    findings.push({
      id: 'punycode_homograph',
      title: 'Punycode / Internationalized Domain (IDN)',
      severity: 'critical',
      score: 40,
      description: `Domain contains punycode "${hostname}", frequently leveraged in homoglyph attacks where Cyrillic/Greek characters visually imitate English letters.`
    });
  }

  // 3. '@' Symbol in URL (userinfo spoofing)
  if (urlStr.includes('@')) {
    score += 35;
    findings.push({
      id: 'at_symbol_trick',
      title: 'User-Info (@) Spoofing Trick',
      severity: 'critical',
      score: 35,
      description: 'The URL contains an "@" symbol. Modern browsers treat text before "@" as login credentials, redirecting you exclusively to the host following "@".'
    });
  }

  // 4. Suspicious TLD check
  const matchedSuspiciousTLD = SUSPICIOUS_TLDS.find(tld => hostname.endsWith(tld));
  if (matchedSuspiciousTLD) {
    score += 25;
    findings.push({
      id: 'suspicious_tld',
      title: `High-Risk TLD (${matchedSuspiciousTLD})`,
      severity: 'high',
      score: 25,
      description: `The top-level domain "${matchedSuspiciousTLD}" has very high prevalence in automated spam, disposable phishing kits, and botnets.`
    });
  }

  // 5. URL Shortener Detection
  const matchedShortener = URL_SHORTENERS.find(shortener => hostname === shortener || hostname.endsWith(`.${shortener}`));
  if (matchedShortener) {
    score += 20;
    findings.push({
      id: 'url_shortener',
      title: `URL Shortener Masking (${matchedShortener})`,
      severity: 'medium',
      score: 20,
      description: `URL uses shortening service "${matchedShortener}" which hides the true destination server from preview.`
    });
  }

  // 6. Protocol: Non-HTTPS
  if (parsedUrl.protocol === 'http:' && !isIP) {
    score += 15;
    findings.push({
      id: 'non_https',
      title: 'Insecure Protocol (HTTP)',
      severity: 'medium',
      score: 15,
      description: 'The destination does not enforce TLS encryption (HTTPS). Passwords and sensitive data entered here are transmitted in plaintext.'
    });
  }

  // 7. Excessive Subdomains
  const subdomainCount = domainParts.subdomain ? domainParts.subdomain.split('.').length : 0;
  if (subdomainCount >= 3) {
    score += 20;
    findings.push({
      id: 'excessive_subdomains',
      title: `Excessive Subdomain Stacking (${subdomainCount} levels)`,
      severity: 'medium',
      score: 20,
      description: `Host "${hostname}" stacks multiple subdomains to disguise the true registered parent domain from mobile screen view.`
    });
  }

  // 8. Excessive Hyphens in Hostname
  const hyphenCount = (hostname.match(/-/g) || []).length;
  if (hyphenCount >= 3) {
    score += 15;
    findings.push({
      id: 'excessive_hyphens',
      title: `Multiple Hyphens in Hostname (${hyphenCount})`,
      severity: 'low',
      score: 15,
      description: 'Phishers often combine authentic keywords with hyphens (e.g. "sbi-online-kyc-verify") to deceive viewers.'
    });
  }

  // 9. Brand Impersonation & Typosquatting Analysis
  const registeredName = (domainParts.registeredName || '').toLowerCase();
  const normalizedHost = normalizeLookalikes(hostname);

  for (const brand of BRANDS) {
    const isOfficialDomain = brand.domains.some(official => {
      return hostname === official || hostname.endsWith(`.${official}`);
    });

    if (isOfficialDomain) {
      // Legitimate official domain of the brand!
      findings.push({
        id: `official_${brand.id}`,
        title: `Official Domain: ${brand.name}`,
        severity: 'safe',
        score: -40,
        description: `Verified legitimate domain belonging to ${brand.name}.`
      });
      break;
    }

    // Check A: Subdomain Brand Impersonation (e.g., sbi.bank-login.xyz)
    const brandInSubdomain = brand.keywords.some(kw => domainParts.subdomain.includes(kw));
    if (brandInSubdomain && !isOfficialDomain) {
      score += 45;
      brandImpersonation = {
        detected: true,
        brandName: brand.name,
        targetDomain: domainParts.domain,
        method: 'Subdomain Deception'
      };
      findings.push({
        id: `subdomain_spoof_${brand.id}`,
        title: `Brand Deception: ${brand.name} in Subdomain`,
        severity: 'critical',
        score: 45,
        description: `Brand name "${brand.name}" appears inside the subdomain, but the real destination is "${domainParts.domain}". This is classic deceptive masking.`
      });
      break;
    }

    // Check B: Path Brand Impersonation on Unknown Domain (e.g., attacker.xyz/sbi/login)
    const brandInPath = brand.keywords.some(kw => pathname.includes(`/${kw}`));
    if (brandInPath && !isOfficialDomain && matchedSuspiciousTLD) {
      score += 25;
      findings.push({
        id: `path_spoof_${brand.id}`,
        title: `Brand Name in Path on Risky Domain`,
        severity: 'high',
        score: 25,
        description: `URL path targets "${brand.name}" endpoints on an unrelated high-risk domain "${domainParts.domain}".`
      });
    }

    // Check C: Levenshtein Distance & Typosquatting on Registered Domain
    for (const official of brand.domains) {
      const officialClean = official.replace(/\.[a-z.]+$/, ''); // e.g. 'onlinesbi', 'hdfcbank'
      if (officialClean.length >= 4 && registeredName.length >= 4) {
        const dist = levenshteinDistance(registeredName, officialClean);
        const normDist = levenshteinDistance(normalizeLookalikes(registeredName), officialClean);

        if ((dist === 1 || (dist === 2 && officialClean.length >= 7) || normDist === 0) && !isOfficialDomain) {
          score += 40;
          brandImpersonation = {
            detected: true,
            brandName: brand.name,
            targetDomain: domainParts.domain,
            method: 'Typosquatting'
          };
          findings.push({
            id: `typosquat_${brand.id}`,
            title: `Typosquatting Mimicking ${brand.name}`,
            severity: 'critical',
            score: 40,
            description: `Domain "${domainParts.domain}" is visually almost identical to the legitimate domain "${official}" (edit distance: ${dist}).`
          });
          break;
        }
      }
    }

    // Check D: Direct Typo Lists
    if (brand.typos && brand.typos.some(t => hostname.includes(t))) {
      score += 40;
      brandImpersonation = {
        detected: true,
        brandName: brand.name,
        targetDomain: domainParts.domain,
        method: 'Known Phishing Pattern'
      };
      findings.push({
        id: `known_typo_${brand.id}`,
        title: `Known Phishing Alias for ${brand.name}`,
        severity: 'critical',
        score: 40,
        description: `Hostname contains a known phishing keyword pattern commonly seen targeting ${brand.name} customers.`
      });
      break;
    }
  }

  // 10. Phishing / Credential Keywords in Path or Query
  const PHISH_KEYWORDS = [
    'login', 'signin', 'verify', 'verification', 'update', 'kyc', 'secure',
    'security', 'banking', 'account', 'password', 'credential', 'refund',
    'cashback', 'pan', 'aadhaar', 'otp', 'unlock', 'restore', 'suspend'
  ];
  const matchedKeywords = PHISH_KEYWORDS.filter(kw => pathname.includes(kw) || search.includes(kw));
  if (matchedKeywords.length > 0 && !findings.some(f => f.id.startsWith('official_'))) {
    const contribution = Math.min(25, matchedKeywords.length * 10);
    score += contribution;
    findings.push({
      id: 'credential_path_keywords',
      title: `Sensitive Action Keywords in URL: [${matchedKeywords.slice(0, 4).join(', ')}]`,
      severity: matchedKeywords.length >= 2 ? 'high' : 'medium',
      score: contribution,
      description: `URL path/query targets high-risk account actions (${matchedKeywords.join(', ')}) typical of credential harvesters.`
    });
  }

  // 11. Open Redirect or Nested URL in Query
  const hasRedirectParam = /[?&](next|redirect|url|return|return_to|dest|goto|r)=https?:\/\//i.test(fullHref);
  if (hasRedirectParam) {
    score += 25;
    findings.push({
      id: 'open_redirect',
      title: 'Potential Open Redirect Parameter',
      severity: 'high',
      score: 25,
      description: 'The query string contains a parameter redirecting onward to a secondary URL, commonly used to bypass email security filters.'
    });
  }

  // 12. Obfuscated / Encoded Characters in Path
  const encodedCount = (fullHref.match(/%[0-9a-f]{2}/gi) || []).length;
  if (encodedCount >= 3) {
    score += 15;
    findings.push({
      id: 'url_encoding',
      title: `High URL Encoding Density (${encodedCount} hex sequences)`,
      severity: 'medium',
      score: 15,
      description: 'Multiple percent-encoded characters detected, often used to bypass basic keyword matching filters.'
    });
  }

  // Normalize final score between 0 and 100
  const normalizedScore = Math.min(100, Math.max(0, score));

  // Determine verdict
  let verdict = 'SAFE';
  if (normalizedScore >= 65) {
    verdict = 'DANGEROUS';
  } else if (normalizedScore >= 25) {
    verdict = 'SUSPICIOUS';
  }

  // URL Breakdown for the Safe Preview Component
  const urlBreakdown = {
    protocol: parsedUrl.protocol.replace(':', ''),
    subdomain: domainParts.subdomain || null,
    domain: domainParts.domain,
    tld: domainParts.tld,
    path: parsedUrl.pathname !== '/' ? parsedUrl.pathname : '',
    query: parsedUrl.search || '',
    isDangerous: verdict === 'DANGEROUS',
    isSuspicious: verdict === 'SUSPICIOUS',
    dangerZone: isIP ? 'Direct IP Host' : (matchedSuspiciousTLD ? 'Risky TLD' : (brandImpersonation ? 'Impersonated Domain' : null))
  };

  return {
    isValid: true,
    url: parsedUrl.href,
    originalInput: rawUrl,
    riskScore: normalizedScore,
    verdict,
    findings,
    brandImpersonation,
    urlBreakdown,
    domain: domainParts.domain,
    isSafe: verdict === 'SAFE'
  };
}

