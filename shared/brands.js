/**
 * 45+ Known Indian and Global Brands with legitimate domains and keywords
 * Used for Levenshtein typo-squatting, brand spoofing, and subdomain impersonation checks.
 */
export const BRANDS = [
  // Indian Banking & Financial Institutions
  {
    name: 'State Bank of India',
    id: 'sbi',
    domains: ['sbi.co.in', 'onlinesbi.sbi', 'onlinesbi.com', 'bank.sbi'],
    keywords: ['sbi', 'onlinesbi', 'yono', 'yonosbi', 'sbicard'],
    typos: ['sbii', 'sbi-online', 'onlinesbii', 'sbibank', 'yonosbii', 'sbi-kyc', 'sbi-update', 'sbi-rewards']
  },
  {
    name: 'HDFC Bank',
    id: 'hdfc',
    domains: ['hdfcbank.com', 'hdfc.com', 'hdfcbank.net', 'netbanking.hdfcbank.com'],
    keywords: ['hdfc', 'hdfcbank', 'netbanking.hdfcbank'],
    typos: ['hdfc-bank', 'hdfcbnk', 'hdfclogin', 'hdfc-update', 'hdfc-kyc', 'hdfcbak']
  },
  {
    name: 'ICICI Bank',
    id: 'icici',
    domains: ['icicibank.com', 'icicibank.co.in', 'infinity.icicibank.com'],
    keywords: ['icici', 'icicibank', 'imobile'],
    typos: ['icic-bank', 'icicibankk', 'icici-secure', 'icici-kyc', 'icicibnk']
  },
  {
    name: 'Axis Bank',
    id: 'axis',
    domains: ['axisbank.com', 'axisbank.co.in'],
    keywords: ['axis', 'axisbank'],
    typos: ['axis-bank', 'axisbnk', 'axis-login', 'axis-kyc']
  },
  {
    name: 'Punjab National Bank',
    id: 'pnb',
    domains: ['pnbindia.in', 'netpnb.com'],
    keywords: ['pnb', 'pnbindia'],
    typos: ['pnb-bank', 'pnb-online', 'pnbkyc']
  },
  {
    name: 'Kotak Mahindra Bank',
    id: 'kotak',
    domains: ['kotak.com', 'kotakbank.com'],
    keywords: ['kotak', 'kotak811'],
    typos: ['kotak-bank', 'kotak811-kyc', 'kotaklogin']
  },
  {
    name: 'Bank of Baroda',
    id: 'bob',
    domains: ['bankofbaroda.in', 'bankofbaroda.com'],
    keywords: ['bankofbaroda', 'bobworld'],
    typos: ['bankofbaroda-kyc', 'bob-world', 'bobworld-login']
  },

  // Indian Payment Apps & FinTech
  {
    name: 'Paytm',
    id: 'paytm',
    domains: ['paytm.com', 'paytmbank.com'],
    keywords: ['paytm', 'paytmbank', 'paytmmoney'],
    typos: ['paytmm', 'paytm-cash', 'paytm-kyc', 'paytm-rewards', 'paytm-refund', 'paytm-wallet']
  },
  {
    name: 'PhonePe',
    id: 'phonepe',
    domains: ['phonepe.com'],
    keywords: ['phonepe'],
    typos: ['phone-pe', 'phonepee', 'phonepe-cashback', 'phonepe-rewards', 'phonepe-refund']
  },
  {
    name: 'Google Pay',
    id: 'gpay',
    domains: ['pay.google.com', 'google.com'],
    keywords: ['gpay', 'googlepay'],
    typos: ['g-pay', 'gpay-cashback', 'googlepay-rewards', 'gpay-refund']
  },
  {
    name: 'CRED',
    id: 'cred',
    domains: ['cred.club'],
    keywords: ['cred', 'credclub'],
    typos: ['cred-rewards', 'cred-cashback', 'cred-coins']
  },

  // Indian Government & Essential Services
  {
    name: 'Aadhaar / UIDAI',
    id: 'uidai',
    domains: ['uidai.gov.in', 'myaadhaar.uidai.gov.in'],
    keywords: ['uidai', 'aadhaar', 'myaadhaar'],
    typos: ['uidai-update', 'aadhaar-download', 'myaadhaar-login', 'aadhar-verification']
  },
  {
    name: 'Income Tax Department',
    id: 'incometax',
    domains: ['incometax.gov.in', 'tin-nsdl.com'],
    keywords: ['incometax', 'incometaxindia', 'efiling'],
    typos: ['incometax-refund', 'itr-refund', 'tax-refund-claim', 'pan-link']
  },
  {
    name: 'India Post',
    id: 'indiapost',
    domains: ['indiapost.gov.in', 'indiapostgdsonline.gov.in'],
    keywords: ['indiapost', 'speedpost', 'dak'],
    typos: ['india-post', 'indiapost-tracking', 'indiapost-customs', 'indiapost-delivery']
  },
  {
    name: 'IRCTC',
    id: 'irctc',
    domains: ['irctc.co.in'],
    keywords: ['irctc'],
    typos: ['irctcc', 'irctc-ticket', 'irctc-refund', 'irctc-booking']
  },
  {
    name: 'Reserve Bank of India',
    id: 'rbi',
    domains: ['rbi.org.in'],
    keywords: ['rbi', 'reservebank'],
    typos: ['rbi-notice', 'rbi-verification', 'rbi-approval']
  },
  {
    name: 'Central Bureau of Investigation',
    id: 'cbi',
    domains: ['cbi.gov.in'],
    keywords: ['cbi', 'centralbureau'],
    typos: ['cbi-arrest', 'cbi-notice', 'cbi-cybercell']
  },
  {
    name: 'TRAI / Telecom Department',
    id: 'trai',
    domains: ['trai.gov.in', 'sancharsaathi.gov.in'],
    keywords: ['trai', 'sancharsaathi', 'dot.gov.in'],
    typos: ['trai-notice', 'sim-verification', 'sancharsaathi-block']
  },

  // Indian Telecom & Utilities
  {
    name: 'Airtel',
    id: 'airtel',
    domains: ['airtel.in', 'airtel.com'],
    keywords: ['airtel', 'airtelthanks'],
    typos: ['airtel-5g', 'airtel-kyc', 'airtel-sim-update']
  },
  {
    name: 'Reliance Jio',
    id: 'jio',
    domains: ['jio.com'],
    keywords: ['jio', 'myjio'],
    typos: ['jio-5g-upgrade', 'jio-offer', 'jio-free-recharge', 'myjio-kyc']
  },
  {
    name: 'Electricity Board (Discom)',
    id: 'electricity',
    domains: ['mahadiscom.in', 'bescom.co.in', 'tnebnet.org', 'uppclonline.com', 'bsesdelhi.com'],
    keywords: ['bijli', 'electricity', 'discom', 'powerbill', 'uppcl', 'bescom'],
    typos: ['bijli-bill-payment', 'electricity-disconnection', 'power-cut-notice']
  },

  // E-Commerce & Couriers
  {
    name: 'Amazon',
    id: 'amazon',
    domains: ['amazon.in', 'amazon.com', 'amzn.to', 'amzn.in'],
    keywords: ['amazon', 'prime'],
    typos: ['amaz0n', 'amazn', 'amzon', 'amazon-order', 'amazon-refund', 'amazon-prime-renewal']
  },
  {
    name: 'Flipkart',
    id: 'flipkart',
    domains: ['flipkart.com'],
    keywords: ['flipkart', 'flipkartplus'],
    typos: ['flipkrt', 'flipkart-sale', 'flipkart-lucky-draw', 'flipkart-reward']
  },
  {
    name: 'FedEx / Blue Dart / DTDC',
    id: 'courier',
    domains: ['fedex.com', 'bluedart.com', 'dtdc.in', 'delhivery.com'],
    keywords: ['fedex', 'bluedart', 'dtdc', 'delhivery'],
    typos: ['fedex-parcel', 'courier-customs-clearance', 'bluedart-track']
  },

  // Global Tech & Social Media
  {
    name: 'Google',
    id: 'google',
    domains: ['google.com', 'google.co.in', 'accounts.google.com'],
    keywords: ['google', 'gmail'],
    typos: ['g00gle', 'googl', 'google-security', 'google-verification']
  },
  {
    name: 'Microsoft',
    id: 'microsoft',
    domains: ['microsoft.com', 'live.com', 'office.com', 'outlook.com'],
    keywords: ['microsoft', 'office365', 'outlook'],
    typos: ['micros0ft', 'microsoft-support', 'office365-verify']
  },
  {
    name: 'Apple',
    id: 'apple',
    domains: ['apple.com', 'icloud.com'],
    keywords: ['apple', 'icloud', 'appleid'],
    typos: ['appl', 'apple-id-verify', 'icloud-findmy']
  },
  {
    name: 'Netflix',
    id: 'netflix',
    domains: ['netflix.com'],
    keywords: ['netflix'],
    typos: ['netflx', 'netfllix', 'netflix-billing', 'netflix-subscription-renew']
  },
  {
    name: 'WhatsApp',
    id: 'whatsapp',
    domains: ['whatsapp.com', 'wa.me'],
    keywords: ['whatsapp'],
    typos: ['whats-app', 'whatsapp-web-login', 'whatsapp-gold']
  },
  {
    name: 'Instagram',
    id: 'instagram',
    domains: ['instagram.com'],
    keywords: ['instagram', 'ig.me'],
    typos: ['instagrarn', 'instagram-badge', 'instagram-copyright-appeal']
  },
  {
    name: 'Telegram',
    id: 'telegram',
    domains: ['telegram.org', 't.me'],
    keywords: ['telegram'],
    typos: ['telegram-bot', 'tele-gram', 'telegram-jobs']
  },
  {
    name: 'PayPal',
    id: 'paypal',
    domains: ['paypal.com', 'paypal.me'],
    keywords: ['paypal'],
    typos: ['paypa1', 'pay-pal', 'paypal-security-update', 'paypal-dispute']
  }
];

export const SUSPICIOUS_TLDS = [
  '.xyz', '.top', '.click', '.live', '.icu', '.buzz', '.rest', '.support',
  '.work', '.fit', '.online', '.club', '.site', '.cfd', '.vip', '.monster',
  '.tk', '.ml', '.ga', '.cf', '.gq', '.pw', '.cc', '.space', '.bid',
  '.stream', '.download', '.loan', '.racing', '.win', '.party', '.date'
];

export const URL_SHORTENERS = [
  'bit.ly', 'tinyurl.com', 'is.gd', 't.co', 'cutt.ly', 'rb.gy', 'shorturl.at',
  'tiny.cc', 'bl.ink', 'ow.ly', 'buff.ly', 'trib.al', 'soo.gd', 's.id'
];
