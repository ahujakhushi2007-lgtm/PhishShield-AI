/**
 * Comprehensive Regex and Keyword Patterns for Phishing, Scam, and Social Engineering Detection
 * Specialized for India-first threat landscape (UPI, KYC, Digital Arrest, Discom, Job, Customs).
 */

export const SCAM_CATEGORIES = {
  DIGITAL_ARREST: {
    id: 'digital_arrest',
    name: 'Digital Arrest / Fake Law Enforcement',
    hindiName: 'डिजिटल अरेस्ट / फर्जी पुलिस या सीबीआई धमकी',
    badge: 'Dangerous',
    color: 'rose',
    description: 'Impersonation of Police, CBI, ED, Narcotics Control Bureau (NCB) or Customs demanding video calls and money transfer under threat of arrest.'
  },
  FAKE_KYC: {
    id: 'fake_kyc',
    name: 'Fake Bank & SIM KYC Suspension',
    hindiName: 'फर्जी बैंक या सिम केवाईसी निलंबन',
    badge: 'Dangerous',
    color: 'rose',
    description: 'Fraudulent warnings that bank account, YONO, or SIM card will be deactivated unless PAN/Aadhaar or details are submitted via a malicious link.'
  },
  UPI_REFUND: {
    id: 'upi_refund',
    name: 'UPI Cashback / Refund Phishing',
    hindiName: 'यूपीआई कैशबैक व रिफंड फ्रॉड',
    badge: 'Dangerous',
    color: 'amber',
    description: 'Tricking users into entering their secret UPI PIN or scanning a QR code to "receive" fake cashback, lottery, or refund money.'
  },
  ELECTRICITY_CUT: {
    id: 'electricity_cut',
    name: 'Electricity Bill Disconnection Scam',
    hindiName: 'बिजली कनेक्शन काटने की फर्जी चेतावनी',
    badge: 'Dangerous',
    color: 'rose',
    description: 'Urgent SMS warning that power supply will be cut tonight at 9:30 PM due to unpaid bill, prompting victim to call an unauthorized mobile number.'
  },
  COURIER_CUSTOMS: {
    id: 'courier_customs',
    name: 'Fake Courier / Customs Parcel Drugs',
    hindiName: 'फर्जी कूरियर / कस्टम्स पार्सल ड्रग्स फ्रॉड',
    badge: 'Dangerous',
    color: 'rose',
    description: 'Scammers claim FedEx/Blue Dart seized a package in your name containing passports or contraband drugs and threaten police arrest.'
  },
  JOB_OFFER: {
    id: 'job_offer',
    name: 'Part-Time Task & Telegram Job Scam',
    hindiName: 'वर्क फ्रॉम होम / यूट्यूब लाइक टास्क फ्रॉड',
    badge: 'Suspicious',
    color: 'amber',
    description: 'Promises of daily earnings (₹3,000–₹8,000) for rating Google maps or liking YouTube videos, leading to crypto/prepaid deposit extortion.'
  },
  LOTTERY_KBC: {
    id: 'lottery_kbc',
    name: 'KBC & Lottery Winner Fraud',
    hindiName: 'केबीसी व लकी ड्रा लॉटरी ठगी',
    badge: 'Suspicious',
    color: 'amber',
    description: 'Unsolicited messages announcing a ₹25–₹50 Lakh lottery prize asking for "registration / TDS fees" upfront.'
  },
  QR_CODE_SCAM: {
    id: 'qr_code',
    name: 'Reverse QR Code Payment Fraud',
    hindiName: 'रिवर्स क्यूआर कोड पेमेंट स्कैम',
    badge: 'Dangerous',
    color: 'rose',
    description: 'Sending a QR code claiming the victim will receive funds upon scanning and entering their PIN (PIN always debits money).'
  }
};

/**
 * Regex patterns with metadata for in-text highlight and explanation
 */
export const TEXT_ANALYSIS_PATTERNS = [
  // 1. Digital Arrest & High-Level Law Enforcement Threat
  {
    id: 'digital_arrest_keyword',
    category: 'threat',
    scamType: 'digital_arrest',
    severity: 'critical',
    score: 55,
    regex: /\b(digital\s*arrest|arrest\s*warrant|cbi(\s*crime\s*branch|\s*officer|\s*notice|\s*cyber)?|narcotics\s*control\s*bureau|ncb|customs\s*department|supreme\s*court\s*notice|non-bailable\s*warrant|money\s*laundering\s*case|police\s*interrogation|skype\s*(interrogation|call|investigation)|digital\s*custody|swat\s*(team|police\s*raid))\b/gi,
    explanation: 'Digital Arrest impersonation: Indian law enforcement and courts NEVER conduct online arrests or demand video interrogations.'
  },
  {
    id: 'hindi_arrest_threat',
    category: 'threat',
    scamType: 'digital_arrest',
    severity: 'critical',
    score: 55,
    regex: /(गिरफ्तारी\s*वारंट|सीबीआई|नारकोटिक्स|कस्टम्स|मनी\s*लॉन्ड्रिंग|डिजिटल\s*अरेस्ट|गैर-जमानती)/gi,
    explanation: 'हिंदी कानूनी धमकी: पुलिस या सीबीआई कभी भी फोन पर डिजिटल अरेस्ट या पैसे की मांग नहीं करती।'
  },

  // 2. Electricity Bill Disconnection Urgency
  {
    id: 'electricity_threat',
    category: 'threat',
    scamType: 'electricity_cut',
    severity: 'critical',
    score: 65,
    regex: /\b(electricity\s*(power|bill|connection)\s*(will\s*be\s*disconnected|cut|suspended)|disconnection\s*at\s*9[:.]30\s*pm|power\s*will\s*be\s*cut\s*tonight|call\s*electricity\s*officer|discom\s*officer)\b/gi,
    explanation: 'Fake Electricity Disconnection: State discoms never send disconnection notices via personal mobile numbers or give 2-hour ultimatums.'
  },
  {
    id: 'electricity_hindi',
    category: 'threat',
    scamType: 'electricity_cut',
    severity: 'critical',
    score: 65,
    regex: /(बिजली\s*(काट\s*दी\s*जाएगी|बिल|कनेक्शन\s*काट)|आज\s*रात\s*(9|नौ)[:.]30|बिजली\s*(अधिकारी|ऑफिसर)\s*से\s*संपर्क|पिछले\s*माह\s*का\s*बिल)/gi,
    explanation: 'बिजली कनेक्शन काटने का झांसा: बिजली विभाग व्यक्तिगत नंबर से ऐसे धमकी भरे संदेश नहीं भेजता।'
  },

  // 3. Fake Bank KYC / Account Blocking
  {
    id: 'kyc_threat',
    category: 'credential',
    scamType: 'fake_kyc',
    severity: 'critical',
    score: 40,
    regex: /\b(account\s*(has\s*been|will\s*be|is)\s*(blocked|suspended|deactivated|frozen)|yono\s*(account|sbi|user)?|update\s*(your\s*)?(pan|aadhaar|kyc)\s*(immediately|urgently|today)?|submit\s*kyc\s*documents|link\s*pan\s*with\s*aadhaar|card\s*has\s*been\s*deactivated)\b/gi,
    explanation: 'Fake KYC / Account Suspension scam: Banks never deactivate accounts without official postal notices or require clicking arbitrary links.'
  },
  {
    id: 'kyc_hindi_hinglish',
    category: 'credential',
    scamType: 'fake_kyc',
    severity: 'critical',
    score: 40,
    regex: /(खाता\s*(बंद|ब्लॉक|सस्पेंड)|केवाईसी\s*अपडेट\s*करें|पैन\s*कार्ड\s*(लिंक|अपडेट)|pan\s*card\s*update\s*karein|khata\s*block\s*hoga)/gi,
    explanation: 'फर्जी बैंक केवाईसी चेतावनी: बैंक कभी भी एसएमएस में दिए लिंक से पैन या दस्तावेज अपलोड करने को नहीं कहते।'
  },

  // 4. UPI PIN / Cashback / Refund Traps
  {
    id: 'upi_pin_fraud',
    category: 'credential',
    scamType: 'upi_refund',
    severity: 'critical',
    score: 65,
    regex: /\b(enter\s*(your\s*)?(secret\s*|4-digit\s*|6-digit\s*)?upi\s*pin\s*(to\s*(receive|get|claim)|and|to\s*get)|scan\s*qr\s*(code\s*)?(and\s*enter|to\s*receive|to\s*get)|cashback\s*of\s*(rs\.?|inr|₹)\s*[\d,]+|(won|claim|received)\s*(a\s*)?(pending\s*)?(cashback|refund)\s*(of\s*(rs\.?|inr|₹))?\s*[\d,]*|phonepe\s*reward\s*scratch\s*card|gpay\s*cashback\s*credited)\b/gi,
    explanation: 'Crucial UPI Golden Rule: UPI PIN is ONLY needed to SEND or DEBIT money, NEVER to receive funds or cashback!'
  },
  {
    id: 'upi_hinglish',
    category: 'credential',
    scamType: 'upi_refund',
    severity: 'critical',
    score: 65,
    regex: /(पैसे\s*पाने\s*के\s*लिए\s*पिन\s*दर्ज|रिफंड\s*स्वीकार\s*करें|upi\s*pin\s*dalein|paise\s*receive\s*karne\s*ke\s*liye\s*pin|scratch\s*card\s*claim)/gi,
    explanation: 'यूपीआई चेतावनी: पैसे प्राप्त करने के लिए कभी भी यूपीआई पिन दर्ज नहीं करना होता।'
  },

  // 5. Remote Access Software Demands
  {
    id: 'remote_access',
    category: 'threat',
    scamType: 'fake_kyc',
    severity: 'critical',
    score: 60,
    regex: /\b(anydesk|teamviewer|rustdesk|quicksupport|air\s*droid|screenshare\s*app|install\s*support\s*app)\b/gi,
    explanation: 'Remote Access Tool alert: Scammers use AnyDesk/TeamViewer to mirror and drain your bank accounts and read OTPs.'
  },

  // 6. Courier / Drug Contraband
  {
    id: 'courier_contraband',
    category: 'threat',
    scamType: 'courier_customs',
    severity: 'critical',
    score: 65,
    regex: /\b(parcel\s*(contains|seized|intercepted)|drugs|narcotics\s*found|illegal\s*substance|customs\s*clearance\s*fine|package\s*held\s*at\s*(mumbai|delhi)\s*airport|taiwan\s*consignment|fedex\s*customs)\b/gi,
    explanation: 'Courier Parcel Drug scam: Legitimate courier firms do not accuse customers of international narcotics smuggling over the phone.'
  },

  // 7. Part-Time Work / YouTube Like Scam
  {
    id: 'job_task_scam',
    category: 'social_engineering',
    scamType: 'job_offer',
    severity: 'high',
    score: 45,
    regex: /\b(earn\s*(rs\.?|inr|₹)\s*[\d,]+\s*daily|like\s*youtube\s*videos|rate\s*google\s*maps|part-time\s*(job|work\s*from\s*home|freelancer)|contact\s*hr\s*manager\s*on\s*telegram|prepaid\s*task|earn\s*from\s*home\s*30\s*mins|@earndaily|@priya_hr|freelancers\s*for\s*simple\s*online\s*tasks)\b/gi,
    explanation: 'Telegram Task / Rating Fraud: Fake jobs that pay tiny sums for initial tasks before demanding huge advance deposits.'
  },

  // 8. Lottery & KBC
  {
    id: 'lottery_kbc_scam',
    category: 'social_engineering',
    scamType: 'lottery_kbc',
    severity: 'high',
    score: 55,
    regex: /\b(kbc(\s*[0-9]{4})?\s*(lucky\s*draw|winner|lottery)?|won\s*(rs\.?|inr|₹)?\s*(25|50)\s*(lakh|crore)|(25|50)\s*(lakh|crore)\s*(ki\s*)?lottery|amitabh\s*bachchan\s*lottery|processing\s*fee\s*(rs\.?|to\s*claim)|lottery\s*winner\s*202[0-9]|prize\s*money\s*claim)\b/gi,
    explanation: 'Lottery Scam: You cannot win a lottery you never bought a ticket for. Demanding upfront "processing fees" is standard advance-fee fraud.'
  },

  // 9. High Urgency & Panic Induction
  {
    id: 'urgency_triggers',
    category: 'urgency',
    severity: 'medium',
    score: 15,
    regex: /\b(act\s*now|immediately|within\s*(24|12|2|1)\s*hours|urgent\s*notice|last\s*warning|final\s*reminder|today\s*itself|before\s*it\s*is\s*too\s*late|action\s*required|आज\s*ही|तुरंत|अंतिम\s*चेतावनी)\b/gi,
    explanation: 'Artificial Urgency: Attackers create high panic to bypass your logical thinking and force hasty decisions.'
  },

  // 10. Financial & Credential Probing
  {
    id: 'credential_probing',
    category: 'credential',
    severity: 'high',
    score: 20,
    regex: /\b(otp|one\s*time\s*password|cvv|atm\s*pin|netbanking\s*password|security\s*code|share\s*otp|never\s*share\s*your\s*otp\s*with\s*anyone\s*except|send\s*screenshot\s*of\s*sms)\b/gi,
    explanation: 'Sensitive Credential probe: Demanding OTP, CVV, or passwords is the ultimate goal of phishing attacks.'
  }
];

export const HIGHLIGHT_CATEGORIES = {
  threat: {
    color: '#F43F5E',
    label: 'Threat / Impersonation',
    bg: 'rgba(244, 63, 94, 0.15)',
    border: 'rgba(244, 63, 94, 0.4)'
  },
  credential: {
    color: '#EC4899',
    label: 'Credential / PIN Trap',
    bg: 'rgba(236, 72, 153, 0.15)',
    border: 'rgba(236, 72, 153, 0.4)'
  },
  urgency: {
    color: '#F59E0B',
    label: 'Artificial Urgency',
    bg: 'rgba(245, 158, 11, 0.15)',
    border: 'rgba(245, 158, 11, 0.4)'
  },
  social_engineering: {
    color: '#8B5CF6',
    label: 'Social Engineering',
    bg: 'rgba(139, 92, 246, 0.15)',
    border: 'rgba(139, 92, 246, 0.4)'
  },
  suspicious_link: {
    color: '#22D3EE',
    label: 'Suspicious Link',
    bg: 'rgba(34, 211, 238, 0.15)',
    border: 'rgba(34, 211, 238, 0.4)'
  }
};
