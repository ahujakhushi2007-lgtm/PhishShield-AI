import { analyzeText } from './textAnalyzer.js';
import { analyzeUrl } from './urlAnalyzer.js';
import { analyzeEmail } from './emailAnalyzer.js';

export const DEMO_SAMPLES = [
  {
    id: 'sbi_kyc_sms',
    title: 'SBI YONO KYC Block Notice',
    tag: 'Fake Bank KYC',
    type: 'text',
    inputType: 'message',
    language: 'Hinglish / English',
    description: 'Deceptive SMS claiming SBI YONO account will be deactivated unless PAN card is uploaded immediately.',
    content: `Dear SBI User, your YONO NetBanking account has been suspended today due to pending KYC verification. To restore access immediately, update your PAN Card within 24 hours at http://onlinesbi-kyc-verify.top/login. Failing which your account will be permanently blocked. - State Bank of India`,
    riskScore: 92,
    ruleScore: 90,
    aiScore: 94,
    verdict: 'DANGEROUS',
    scamType: 'fake_kyc',
    impersonating: 'State Bank of India',
    tactics: ['Brand Impersonation (State Bank of India)', 'Artificial Urgency', 'Credential & PIN Extraction', 'Phishing Link Redirection'],
    explanation: 'High-confidence banking phishing attempt! State Bank of India never sends SMS alerts from personal numbers or directs users to non-official domains (.top TLD). Legitimate YONO services operate exclusively on onlinesbi.sbi or sbi.co.in.',
    explanationHi: 'अत्यंत खतरनाक फर्जी बैंक संदेश! स्टेट बैंक ऑफ इंडिया (SBI) कभी भी .top जैसी अनजान वेबसाइटों पर पैन या पासवर्ड दर्ज करने को नहीं कहता। यह आपके खाते से पैसे चुराने की साजिश है।',
    recommendedActions: [
      'Do NOT click the link http://onlinesbi-kyc-verify.top or submit PAN/login credentials.',
      'Banks never suspend accounts over SMS without prior formal physical notices.',
      'Login only via the verified official YONO app or https://onlinesbi.sbi.',
      'Report the phishing number and URL to 1930 and Chakshu (sancharsaathi.gov.in).'
    ]
  },
  {
    id: 'digital_arrest_whatsapp',
    title: 'CBI & Supreme Court "Digital Arrest"',
    tag: 'Digital Arrest Threat',
    type: 'text',
    inputType: 'message',
    language: 'English',
    description: 'Threat message impersonating CBI Crime Branch demanding immediate Skype video interrogation under threat of arrest.',
    content: `CENTRAL BUREAU OF INVESTIGATION (CBI) - CYBER CRIME CELL
CRIME DOCKET NO: CBI/DEL/2026/8941
NOTICE OF DIGITAL ARREST & NON-BAILABLE WARRANT

A consignment destined for Taiwan containing 16 fake passports, 58 ATM cards, and 250 grams of MDMA contraband was intercepted at Mumbai Cargo Terminal registered under your Aadhaar number.

A non-bailable arrest warrant has been approved by the Supreme Court of India. You are placed under DIGITAL ARREST immediately. You must connect to our Skype Investigation Officer within 15 minutes for digital custody interrogation. Failure to comply will result in an immediate tactical SWAT police raid at your residential address.

Contact Duty Officer: Inspector Vikram Sharma (Badge #CBI-9821)`,
    riskScore: 98,
    ruleScore: 95,
    aiScore: 100,
    verdict: 'DANGEROUS',
    scamType: 'digital_arrest',
    impersonating: 'Central Bureau of Investigation (CBI)',
    tactics: ['Legal & Coercion Threat', 'Authority Impersonation', 'Fear Induction', 'Artificial Urgency'],
    explanation: 'Dangerous extortion scam! "Digital Arrest" is a complete fabrication. No Indian law enforcement agency (CBI, ED, Police, NCB) or Court has any legal provision to arrest citizens via video calls, Skype, or WhatsApp, nor do they demand money to dismiss warrants.',
    explanationHi: 'यह कुख्यात "डिजिटल अरेस्ट" फ्रॉड है! भारतीय कानून में वीडियो कॉल या स्काइप पर किसी को गिरफ्तार करने का कोई प्रावधान नहीं है। तुरंत कॉल काटें और 1930 पर शिकायत करें।',
    recommendedActions: [
      'Do NOT join any Skype/WhatsApp video call and do NOT transfer any "verification deposit" funds.',
      'Indian police and CBI NEVER issue arrest warrants via WhatsApp or conduct online interrogations.',
      'Report immediately to the Cyber Crime Helpline 1930 or file a complaint at https://cybercrime.gov.in.',
      'Block and report the sender number on WhatsApp.'
    ]
  },
  {
    id: 'electricity_bill_sms',
    title: 'Electricity Disconnection Tonight at 9:30 PM',
    tag: 'Discom Power Cut',
    type: 'text',
    inputType: 'message',
    language: 'Hindi / Hinglish',
    description: 'Urgent notice claiming home power supply will be cut at 9:30 PM due to an unpaid bill, urging a call to an unauthorized mobile.',
    content: `प्रिय उपभोक्ता, आपकी बिजली आज रात 9:30 बजे पावर सबस्टेशन से काट दी जाएगी क्योंकि आपका पिछले माह का बिल अपडेट नहीं हुआ है।

बिजली कटने से बचने के लिए तुरंत हमारे बिजली अधिकारी से संपर्क करें: 9876543210 या बिल का तुरंत भुगतान करें http://bijli-bill-payment.top/pay.

- राज्य विद्युत बोर्ड (Electricity Department)`,
    riskScore: 94,
    ruleScore: 92,
    aiScore: 96,
    verdict: 'DANGEROUS',
    scamType: 'electricity_cut',
    impersonating: 'Electricity Board (Discom)',
    tactics: ['Artificial Urgency', 'Threat / Disconnection', 'Phishing Link Redirection'],
    explanation: 'Classic Electricity Bill scam! State power discoms NEVER send disconnection warnings giving 2-hour deadlines with personal 10-digit mobile numbers or third-party links.',
    explanationHi: 'बिजली कनेक्शन काटने की धोखाधड़ी! बिजली विभाग कभी भी पर्सनल मोबाइल नंबर देकर तुरंत बिजली काटने की धमकी नहीं देता। किसी अनजान नंबर पर बात न करें न ही कोई ऐप डाउनलोड करें।',
    recommendedActions: [
      'Do NOT call the 10-digit mobile number provided in the SMS.',
      'Check your genuine electricity bill status only on the official state Discom portal or mobile app (e.g., BESCOM, Mahavitaran, UPPCL, TNEB).',
      'Never install remote-sharing apps (AnyDesk, TeamViewer) if prompted by callers.',
      'Report the scam number to Sanchar Saathi Chakshu portal.'
    ]
  },
  {
    id: 'upi_phonepe_refund',
    title: 'PhonePe ₹4,999 Cashback Refund',
    tag: 'UPI Cashback Trap',
    type: 'text',
    inputType: 'message',
    language: 'English',
    description: 'Phishing message promising pending cashback refund requiring the victim to enter their UPI PIN.',
    content: `PhonePe Rewards: Congratulations! You have received a pending cashback refund of Rs 4,999.00 from your recent merchant transaction.

Click below to claim your cashback instantly. Scan QR code and enter your secret UPI PIN to receive money directly into your bank account:
http://phonepe-rewards-claim.click/cashback?user=9821

Valid only for 30 minutes!`,
    riskScore: 96,
    ruleScore: 94,
    aiScore: 98,
    verdict: 'DANGEROUS',
    scamType: 'upi_refund',
    impersonating: 'PhonePe',
    tactics: ['Brand Impersonation (PhonePe)', 'Credential & PIN Extraction', 'Greed Appeal', 'Phishing Link Redirection'],
    explanation: 'Dangerous UPI Credential trap! Golden Rule of UPI: Entering your UPI PIN will ALWAYS DEBIT money from your account. You NEVER need to enter a PIN or scan a QR code to RECEIVE money or refunds.',
    explanationHi: 'यूपीआई पिन चोरी का गंभीर फ्रॉड! ध्यान रखें: पैसे पाने के लिए कभी भी यूपीआई पिन डालने की जरूरत नहीं होती। पिन डालने पर आपके खाते से पैसे कट जाएंगे।',
    recommendedActions: [
      'NEVER enter your UPI PIN to claim money, rewards, or refunds.',
      'PhonePe and Google Pay do not process refunds through unverified web links.',
      'If you have already entered your PIN, immediately freeze your UPI via your bank app and call 1930.',
      'Report the link to CERT-In and national cybercrime portal.'
    ]
  },
  {
    id: 'amazon_spoofed_email',
    title: 'Fake Amazon Order Confirmation Email',
    tag: 'Email Header Spoofing',
    type: 'email',
    inputType: 'email',
    language: 'English',
    description: 'Phishing email with display-name spoofing and SPF/DKIM header failures claiming an unauthorized $899 charge.',
    content: `From: "Amazon Support Security" <alert@amazon-security-billing.ru>
Reply-To: support@fraudulent-collector.xyz
Return-Path: bounce@botnet-node44.net
Subject: Urgent: Unauthorized Order Placed - Apple iPhone 15 Pro (Order #702-88129-91827)
Authentication-Results: spf=fail (sender IP not authorized); dkim=fail; dmarc=fail

Dear Customer,

Your order #702-88129-91827 for 1x Apple iPhone 15 Pro 256GB has been confirmed. A charge of $899.99 will appear on your card within 24 hours.

Shipping Address: 14 King St, St Petersburg, Russia.

If you did NOT authorize this purchase, cancel the transaction immediately by clicking the secure link below or downloading the attached invoice:
http://amazon-cancellation-order.live/dispute?id=70291

Amazon Customer Protection Team`,
    riskScore: 95,
    ruleScore: 94,
    aiScore: 96,
    verdict: 'DANGEROUS',
    scamType: 'fake_kyc',
    impersonating: 'Amazon',
    tactics: ['Display Name Brand Spoofing', 'Header Authentication Failure (SPF/DKIM/DMARC)', 'Artificial Urgency', 'Phishing Link Redirection'],
    explanation: 'Critical email phishing & header spoofing attack! The display name says "Amazon Support Security", but the originating domain is an unauthorized Russian server (.ru), with SPF, DKIM, and DMARC checks all failing.',
    explanationHi: 'फर्जी ईमेल फ्रॉड! देखने में यह अमेज़न का लगता है लेकिन भेजने वाले का असली ईमेल रूस (.ru) के सर्वर से है और सभी सुरक्षा जांचें (SPF/DKIM) फेल हैं।',
    recommendedActions: [
      'Do not click the dispute link or open invoice attachments.',
      'Log into your real Amazon account directly via amazon.in or amazon.com to verify your order history.',
      'Mark the email as Phishing/Spam in your email client.',
      'Forward the raw email headers to stop-spoofing@amazon.com.'
    ]
  },
  {
    id: 'telegram_job_scam',
    title: 'Work From Home YouTube Like & Earn ₹5000/day',
    tag: 'Telegram Task Scam',
    type: 'text',
    inputType: 'message',
    language: 'English',
    description: 'Part-time job fraud promising ₹3000 to ₹8000 daily for liking YouTube videos and rating hotels on Google.',
    content: `Greetings from Global Media Marketing! We are hiring part-time freelancers for simple online tasks.

Earn Rs 3,000 to Rs 8,000 daily from home.
Task: Simply like YouTube videos and rate hotels on Google Maps. No experience required. Each task pays Rs 150 instantly into your UPI.
Flexible timing: 20-30 minutes daily.

Limited vacancies available. Contact our HR manager immediately on Telegram: @Priya_HR_Coordinator to get your daily welcome bonus of Rs 500!`,
    riskScore: 78,
    ruleScore: 75,
    aiScore: 82,
    verdict: 'DANGEROUS',
    scamType: 'job_offer',
    impersonating: 'Global Media Marketing',
    tactics: ['Unrealistic Financial Reward', 'Prepaid Task Funnel', 'Telegram Social Engineering'],
    explanation: 'Part-Time Task & Telegram Job Scam! Scammers pay tiny amounts (₹150–₹500) for the first 2 tasks to build trust, then trap victims into "prepaid VIP tasks" demanding deposits of ₹10,000 to ₹5,00,000 that can never be withdrawn.',
    explanationHi: 'यूट्यूब लाइक और रेटिंग जॉब स्कैम! शुरू में छोटे पैसे देकर झांसे में लेते हैं, फिर वीआईपी टास्क के नाम पर लाखों रुपये की ठगी करते हैं। टेलीग्राम पर ऐसे लोगों से बात न करें।',
    recommendedActions: [
      'Do NOT message recruiters on Telegram or pay any security deposit/prepaid fee.',
      'Legitimate corporate companies never hire via random WhatsApp/SMS blasts.',
      'Never send money to "unlock" your earned salary or commissions.',
      'Report the Telegram handle to Telegram abuse and Sanchar Saathi.'
    ]
  },
  {
    id: 'kbc_lottery_winner',
    title: 'KBC 2026 Kaun Banega Crorepati ₹25 Lakh Winner',
    tag: 'Lottery Fraud',
    type: 'text',
    inputType: 'message',
    language: 'Hindi / Hinglish',
    description: 'WhatsApp lottery notice claiming customer SIM card won ₹25 Lakh in KBC Lucky Draw.',
    content: `KBC LUCKY DRAW 2026! Badhai ho!

Aapka mobile number KBC aur Reliance Jio ki taraf se 25 Lakh Rupaye ki lottery jeet chuka hai!
Lottery Number: KBC-9844-WIN

Apna 25 Lakh prize money claim karne ke liye KBC Head Office Manager Rana Pratap Singh se WhatsApp par sampark karein: +91-9123456789.
Kripya dhyan dein: Prize release ke liye registration fee Rs 1,500 jama karni hogi.`,
    riskScore: 85,
    ruleScore: 82,
    aiScore: 88,
    verdict: 'DANGEROUS',
    scamType: 'lottery_kbc',
    impersonating: 'Kaun Banega Crorepati (KBC)',
    tactics: ['Greed Appeal', 'Authority Impersonation', 'Advance-Fee Fraud'],
    explanation: 'Classic Advance-Fee Lottery Fraud! KBC does not conduct lottery draws based on random mobile numbers. Any request to pay "registration fees", "GST", or "TDS" upfront to release prize money is 100% fraudulent.',
    explanationHi: 'केबीसी लॉटरी ठगी! कौन बनेगा करोड़पति कभी भी किसी लॉटरी का आयोजन नहीं करता। लॉटरी का पैसा पाने के लिए पहले फीस या टैक्स जमा करने की मांग शुद्ध ठगी है।',
    recommendedActions: [
      'Do NOT send any "processing fee" or registration money.',
      'Never send copies of your Aadhaar card or bank passbook to claim fake lotteries.',
      'Block the phone number immediately.',
      'Report the incident to the National Cyber Crime Helpline at 1930.'
    ]
  },
  {
    id: 'legitimate_bank_sms',
    title: 'Legitimate HDFC Bank Transaction Alert',
    tag: 'Legitimate / Safe',
    type: 'text',
    inputType: 'message',
    language: 'English',
    description: 'Authentic debit notification from HDFC Bank with standard security masking and official verified contact information.',
    content: `Dear Customer, INR 1,500.00 has been debited from your HDFC Bank A/C ending with **4521 on 31-OCT-26 at SWIGGY BANGALORE. Available Balance: INR 42,310.45. If not done by you, SMS BLOCK to 567678 or visit https://www.hdfcbank.com. - HDFC Bank`,
    riskScore: 0,
    ruleScore: 0,
    aiScore: 0,
    verdict: 'SAFE',
    scamType: null,
    impersonating: null,
    tactics: [],
    explanation: 'Legitimate banking notification. The message originates with typical bank transaction syntax, masks sensitive account digits (**4521), includes official 6-digit shortcode (567678), and references verified domain (hdfcbank.com).',
    explanationHi: 'यह एक वैध बैंक लेन-देन सूचना है। इसमें सुरक्षा के सभी मानक मौजूद हैं और आधिकारिक वेबसाइट (hdfcbank.com) का उल्लेख है।',
    recommendedActions: [
      'This message conforms to RBI banking notification standards.',
      'If you do not recognize the transaction amount (INR 1,500.00), immediately contact HDFC Bank via the official phone banking number on the back of your card.'
    ]
  }
];

export function getDemoSampleById(id) {
  return DEMO_SAMPLES.find(s => s.id === id) || DEMO_SAMPLES[0];
}

