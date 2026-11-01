/**
 * Labelled Benchmark Test Dataset for PhishShield AI
 * Contains 35 curated cases (18 malicious/phishing, 17 benign/safe) across URLs, SMS, and emails.
 */

export const BENCHMARK_CASES = [
  // --- Malicious URLs ---
  {
    id: 'URL_MAL_01',
    type: 'url',
    input: 'http://onlinesbi.sbi-kyc-verify.top/login',
    expectedVerdict: 'DANGEROUS',
    category: 'Subdomain Phishing',
    notes: 'Brand in subdomain with .top TLD'
  },
  {
    id: 'URL_MAL_02',
    type: 'url',
    input: 'http://192.168.1.105/hdfc/netbanking/login.php',
    expectedVerdict: 'DANGEROUS',
    category: 'IP Host Phishing',
    notes: 'Direct numerical IP address with brand path'
  },
  {
    id: 'URL_MAL_03',
    type: 'url',
    input: 'http://xn--gogle-pqa.com/security-check',
    expectedVerdict: 'DANGEROUS',
    category: 'Punycode Homograph',
    notes: 'Punycode internationalized domain homoglyph'
  },
  {
    id: 'URL_MAL_04',
    type: 'url',
    input: 'http://paytmm-cashback-reward.click/claim',
    expectedVerdict: 'DANGEROUS',
    category: 'Typosquatting',
    notes: 'Double m in paytm with .click TLD'
  },
  {
    id: 'URL_MAL_05',
    type: 'url',
    input: 'http://icicibank.com@attacker-controlled-server.xyz/verify',
    expectedVerdict: 'DANGEROUS',
    category: 'UserInfo @ Spoofing',
    notes: '@ symbol deceiving browser to redirect to attacker host'
  },
  {
    id: 'URL_MAL_06',
    type: 'url',
    input: 'http://secure.login.update.bank.verification.account-sbi.icu',
    expectedVerdict: 'DANGEROUS',
    category: 'Excessive Subdomains',
    notes: '5 subdomains stacked on high-risk .icu TLD'
  },

  // --- Safe / Benign URLs ---
  {
    id: 'URL_SAFE_01',
    type: 'url',
    input: 'https://www.onlinesbi.sbi',
    expectedVerdict: 'SAFE',
    category: 'Official Bank Portal',
    notes: 'Genuine State Bank of India portal'
  },
  {
    id: 'URL_SAFE_02',
    type: 'url',
    input: 'https://netbanking.hdfcbank.com/netbanking',
    expectedVerdict: 'SAFE',
    category: 'Official NetBanking',
    notes: 'Official HDFC Bank domain'
  },
  {
    id: 'URL_SAFE_03',
    type: 'url',
    input: 'https://paytm.com',
    expectedVerdict: 'SAFE',
    category: 'Official FinTech',
    notes: 'Genuine Paytm website'
  },
  {
    id: 'URL_SAFE_04',
    type: 'url',
    input: 'https://uidai.gov.in',
    expectedVerdict: 'SAFE',
    category: 'Government Portal',
    notes: 'Official Aadhaar UIDAI domain'
  },
  {
    id: 'URL_SAFE_05',
    type: 'url',
    input: 'https://www.amazon.in/gp/cart/view.html',
    expectedVerdict: 'SAFE',
    category: 'E-Commerce Official',
    notes: 'Official Amazon India shopping cart'
  },
  {
    id: 'URL_SAFE_06',
    type: 'url',
    input: 'https://www.irctc.co.in/nget/train-search',
    expectedVerdict: 'SAFE',
    category: 'Official Rail Booking',
    notes: 'Official Indian Railways portal'
  },

  // --- Malicious SMS & Message Text ---
  {
    id: 'TXT_MAL_01',
    type: 'text',
    input: 'Dear SBI user, your YONO account is suspended today. Update your PAN card immediately at http://sbi-pan-kyc.xyz to avoid permanent deactivation.',
    expectedVerdict: 'DANGEROUS',
    category: 'Fake KYC SMS',
    notes: 'Urgency, PAN request, and fake domain'
  },
  {
    id: 'TXT_MAL_02',
    type: 'text',
    input: 'CBI Crime Branch Notice: A parcel containing narcotics and fake passports was intercepted in your name. Supreme Court has issued digital arrest warrant. Connect to Skype immediately or SWAT team will arrest you.',
    expectedVerdict: 'DANGEROUS',
    category: 'Digital Arrest',
    notes: 'Extortion and police coercion'
  },
  {
    id: 'TXT_MAL_03',
    type: 'text',
    input: 'प्रिय उपभोक्ता, आपकी बिजली आज रात 9:30 बजे काट दी जाएगी क्योंकि पिछले माह का बिल अपडेट नहीं हुआ है। तुरंत 9876543210 पर संपर्क करें।',
    expectedVerdict: 'DANGEROUS',
    category: 'Electricity Bill Discom',
    notes: 'Urgent 9:30 PM power cut threat'
  },
  {
    id: 'TXT_MAL_04',
    type: 'text',
    input: 'PhonePe Cashback: You won Rs 4,999 refund. Scan QR code and enter your secret UPI PIN to receive money instantly into bank.',
    expectedVerdict: 'DANGEROUS',
    category: 'UPI PIN Scam',
    notes: 'Entering UPI PIN to receive money'
  },
  {
    id: 'TXT_MAL_05',
    type: 'text',
    input: 'Earn Rs 5,000 daily working from home! Just like YouTube videos and rate Google maps for 20 mins. Contact HR manager on Telegram @EarnFastIndia.',
    expectedVerdict: 'DANGEROUS',
    category: 'Telegram Job Fraud',
    notes: 'Unrealistic return and Telegram task'
  },
  {
    id: 'TXT_MAL_06',
    type: 'text',
    input: 'KBC 2026: Aapka number 25 Lakh ki lottery jeeta hai! Amitabh Bachchan lucky draw claim karne ke liye processing fee Rs 1,500 jama karein.',
    expectedVerdict: 'DANGEROUS',
    category: 'KBC Lottery',
    notes: 'Advance fee fraud'
  },
  {
    id: 'TXT_MAL_07',
    type: 'text',
    input: 'Bank alert: Install AnyDesk app immediately to complete your biometric KYC or your account will be frozen within 2 hours.',
    expectedVerdict: 'DANGEROUS',
    category: 'Remote Access Tool',
    notes: 'AnyDesk installation coercion'
  },
  {
    id: 'TXT_MAL_08',
    type: 'text',
    input: 'FedEx Customs Warning: Your parcel from Mumbai to Taiwan was intercepted with illegal drugs. Contact Narcotics Control Bureau officer on WhatsApp.',
    expectedVerdict: 'DANGEROUS',
    category: 'Courier Customs Fraud',
    notes: 'Narcotics parcel accusation'
  },

  // --- Safe SMS & Messages ---
  {
    id: 'TXT_SAFE_01',
    type: 'text',
    input: 'Dear Customer, INR 1,500.00 debited from your HDFC Bank A/C ending with **4521 on 31-OCT-26 at SWIGGY. Balance: INR 42,310.45. If not you, SMS BLOCK to 567678 or visit https://www.hdfcbank.com.',
    expectedVerdict: 'SAFE',
    category: 'Genuine Bank Debit SMS',
    notes: 'Masked account, shortcode, official domain'
  },
  {
    id: 'TXT_SAFE_02',
    type: 'text',
    input: 'Your Swiggy delivery partner Ramesh is on the way with your food order. Track live in your app.',
    expectedVerdict: 'SAFE',
    category: 'Food Delivery Update',
    notes: 'Normal notification without threats'
  },
  {
    id: 'TXT_SAFE_03',
    type: 'text',
    input: 'IRCTC Train Booking Confirmed: PNR 2419821894, Train 12952 Mumbai Rajdhani, 3A, Coach B2 Berth 24. Happy Journey!',
    expectedVerdict: 'SAFE',
    category: 'Railway Ticket SMS',
    notes: 'Standard IRCTC booking format'
  },
  {
    id: 'TXT_SAFE_04',
    type: 'text',
    input: 'Hey Rohit, are we still meeting for coffee this Sunday at 5 PM at Starbucks Indiranagar?',
    expectedVerdict: 'SAFE',
    category: 'Personal Chat',
    notes: 'Normal human conversation'
  },
  {
    id: 'TXT_SAFE_05',
    type: 'text',
    input: 'Your monthly Jio fiber bill of Rs 470.82 has been generated. Due date is 15 Nov. Pay conveniently on MyJio app or at https://www.jio.com.',
    expectedVerdict: 'SAFE',
    category: 'Telecom Bill Notice',
    notes: 'Legitimate telecom bill notice'
  },
  {
    id: 'TXT_SAFE_06',
    type: 'text',
    input: 'Reminder: Your appointment with Dr. Mehta at Apollo Clinic is scheduled for tomorrow at 10:30 AM. Call 080-22223333 for rescheduling.',
    expectedVerdict: 'SAFE',
    category: 'Clinic Appointment',
    notes: 'Standard hospital appointment'
  },

  // --- Malicious Emails ---
  {
    id: 'EML_MAL_01',
    type: 'email',
    input: {
      headers: 'From: "State Bank of India Alert" <support@free-host-server99.xyz>\nReply-To: phish@attacker-box.ru\nAuthentication-Results: spf=fail; dkim=fail',
      subject: 'Urgent: Your NetBanking Account is Suspended',
      body: 'Your account access has been revoked. Click here to verify your identity: http://sbi-login-portal.top/update'
    },
    expectedVerdict: 'DANGEROUS',
    category: 'Email Spoofing + Link',
    notes: 'SPF/DKIM fail + display name spoof'
  },
  {
    id: 'EML_MAL_02',
    type: 'email',
    input: {
      headers: 'From: "Amazon Security Team" <security@mail-delivery-bot.icu>\nSubject: Order Cancellation #8921-A',
      subject: 'Order Cancellation Required',
      body: 'Your credit card was billed $1,299 for MacBook Pro. Click <a href="http://amazon-dispute-order.click">https://amazon.com</a> to cancel.'
    },
    expectedVerdict: 'DANGEROUS',
    category: 'Anchor Text Mismatch',
    notes: 'Link anchor displays amazon.com but points to .click'
  },
  {
    id: 'EML_MAL_03',
    type: 'email',
    input: {
      headers: 'From: "Income Tax Department" <refund@tax-refund-portal.live>',
      subject: 'Tax Refund of INR 28,450 Approved',
      body: 'Your income tax refund of INR 28,450 is ready. Download your refund voucher attached: Tax_Refund_Voucher.exe'
    },
    expectedVerdict: 'DANGEROUS',
    category: 'Dangerous Attachment',
    notes: '.exe attachment claiming to be tax voucher'
  },
  {
    id: 'EML_MAL_04',
    type: 'email',
    input: {
      headers: 'From: "Netflix Billing" <info@streaming-renewals.buzz>',
      subject: 'Account Suspension: Payment Failed',
      body: 'We could not renew your monthly Netflix membership. Update your credit card within 24 hours at http://netflix-payment-update.xyz/billing'
    },
    expectedVerdict: 'DANGEROUS',
    category: 'Subscription Phishing',
    notes: 'Fake Netflix payment update'
  },

  // --- Safe Emails ---
  {
    id: 'EML_SAFE_01',
    type: 'email',
    input: {
      headers: 'From: "HDFC Bank Alert" <alerts@hdfcbank.net>\nAuthentication-Results: spf=pass; dkim=pass; dmarc=pass',
      subject: 'Your Monthly E-Statement for Account ending **4521',
      body: 'Dear Customer, Please find your e-statement for October 2026. This is an official communication from HDFC Bank Ltd. Visit https://www.hdfcbank.com for online banking services.'
    },
    expectedVerdict: 'SAFE',
    category: 'Genuine Bank E-Statement',
    notes: 'SPF and DKIM pass with verified domain'
  },
  {
    id: 'EML_SAFE_02',
    type: 'email',
    input: {
      headers: 'From: "GitHub" <notifications@github.com>\nAuthentication-Results: spf=pass; dkim=pass',
      subject: '[PhishShield AI] Pull request #4 merged by maintainer',
      body: 'Pull request #4 was successfully merged into main. View changes on GitHub at https://github.com/repository/pulls.'
    },
    expectedVerdict: 'SAFE',
    category: 'GitHub Notification',
    notes: 'Standard dev notification'
  },
  {
    id: 'EML_SAFE_03',
    type: 'email',
    input: {
      headers: 'From: "Google Calendar" <calendar-notification@google.com>',
      subject: 'Invitation: Team Design Review @ Thu Nov 5, 2026 3pm - 4pm',
      body: 'You have been invited to the event: Team Design Review. Meeting link: https://meet.google.com/abc-defg-hij.'
    },
    expectedVerdict: 'SAFE',
    category: 'Google Calendar Invite',
    notes: 'Official Google Meet and Calendar invite'
  },
  {
    id: 'TXT_SAFE_07',
    type: 'text',
    input: 'Hi Mom, I reached the office safely. Will call you during lunch break!',
    expectedVerdict: 'SAFE',
    category: 'Family Message',
    notes: 'Benign family greeting'
  },
  {
    id: 'URL_MAL_07',
    type: 'url',
    input: 'http://uidai-aadhaar-download.icu/verify-otp',
    expectedVerdict: 'DANGEROUS',
    category: 'Aadhaar Impersonation',
    notes: 'Fake Aadhaar update on .icu domain'
  }
];
