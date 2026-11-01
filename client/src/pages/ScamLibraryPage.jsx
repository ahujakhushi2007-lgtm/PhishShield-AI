import React, { useState } from 'react';
import { 
  ShieldAlert, AlertTriangle, ArrowRight, BookOpen, 
  ExternalLink, PhoneCall, CheckCircle, HelpCircle, Sparkles 
} from 'lucide-react';

export const SCAM_KNOWLEDGE_BASE = [
  {
    id: 'digital_arrest',
    title: 'Digital Arrest / CBI Video Interrogation',
    hindiTitle: 'डिजिटल अरेस्ट / फर्जी पुलिस या सीबीआई वीडियो कॉल',
    severity: 'CRITICAL',
    badge: 'Coercion & Extortion',
    color: 'rose',
    summary: 'Fraudsters impersonate CBI, Police, or Customs officers, accusing victims of money laundering or contraband parcel seizure, keeping them in 24/7 video custody until millions are transferred.',
    howItWorks: [
      'Victim receives an automated call claiming a FedEx/customs parcel in their name was seized with drugs and fake passports.',
      'Call is transferred to a fake "CBI Officer" on Skype or WhatsApp wearing police uniforms with official-looking backdrops and fake warrants.',
      'Scammers declare the victim is placed under "Digital Arrest" and forbid disconnecting the video call under threat of immediate physical SWAT raid.',
      'Victim is coerced into transferring all liquid savings to a "Secret Supreme Court Verification Account" to prove financial innocence.'
    ],
    redFlags: [
      'Demand for 24/7 video monitoring on Skype, WhatsApp, or Zoom.',
      'Claims that the Supreme Court or CBI conducts online "Digital Arrests".',
      'Threats of immediate arrest if family members or lawyers are notified.',
      'Instructions to transfer money into personal bank accounts for "verification".'
    ],
    whatToDo: [
      'REMEMBER: Digital Arrest DOES NOT EXIST in Indian law. No court or police agency operates online arrests.',
      'Immediately disconnect the video call and block the caller on WhatsApp/Skype.',
      'Never transfer funds to any account promised as a "clearing account".',
      'Report immediately to National Cybercrime Helpline 1930 and file a complaint at cybercrime.gov.in.'
    ],
    sampleSnippet: 'CBI CRIME BRANCH NOTICE: Consignment intercepted at Mumbai Airport containing 250g MDMA narcotics. Digital arrest warrant issued. Connect to Skype Inspector Vikram Sharma immediately.'
  },
  {
    id: 'upi_refund',
    title: 'UPI Cashback & Reverse QR Code Fraud',
    hindiTitle: 'यूपीआई कैशबैक व रिवर्स क्यूआर कोड फ्रॉड',
    severity: 'HIGH',
    badge: 'Financial Trap',
    color: 'amber',
    summary: 'Tricking users into entering their secret UPI PIN or scanning a merchant QR code under the illusion of receiving pending cashback or refund money.',
    howItWorks: [
      'Scammers send SMS/WhatsApp claiming pending cashback of ₹4,999 from PhonePe, GPay, or Paytm.',
      'Victim clicks link and is prompted to "Receive Payment" by entering their 4-digit or 6-digit UPI PIN.',
      'Alternatively, scammer sends a QR code claiming "Scan to receive money directly into your account".',
      'The moment the victim enters their PIN, funds are instantly DEBITED from their bank account.'
    ],
    redFlags: [
      'Any prompt asking you to enter your UPI PIN to RECEIVE or CLAIM money.',
      'Phrases like "1 Rupee test transaction" to verify your UPI account.',
      'Links with unverified domains like phonepe-reward.click or gpay-cashback.top.',
      'Requests to scan a QR code to accept an incoming payment.'
    ],
    whatToDo: [
      'GOLDEN RULE: UPI PIN is entered ONLY to SEND money, NEVER to receive funds!',
      'Scanning a QR code always debits your account; you do not scan to receive money.',
      'If you accidentally entered your PIN, immediately open your banking app and freeze UPI access.',
      'Report the transaction within the golden hour to Helpline 1930.'
    ],
    sampleSnippet: 'PhonePe Rewards: You won Rs 4,999 cashback! Scan QR code and enter your UPI PIN to claim money directly to bank.'
  },
  {
    id: 'fake_kyc',
    title: 'Fake Bank & SIM KYC Suspension',
    hindiTitle: 'फर्जी बैंक या सिम कार्ड केवाईसी निलंबन',
    severity: 'CRITICAL',
    badge: 'Credential Phishing',
    color: 'rose',
    summary: 'Urgent notices warning that bank accounts (SBI YONO, HDFC, ICICI) or SIM cards will be permanently blocked today unless PAN/Aadhaar is submitted on a phishing link.',
    howItWorks: [
      'Victim receives an SMS: "Dear SBI customer, your YONO account is blocked today. Update your PAN card immediately at http://onlinesbi-kyc.top".',
      'The link opens a pixel-perfect replica of the authentic NetBanking login portal.',
      'The victim inputs their username, password, and PAN card number.',
      'The attacker triggers an authentic fund transfer, prompting the victim to input the OTP received on SMS, draining the account.'
    ],
    redFlags: [
      'Sender number is an ordinary 10-digit mobile number instead of an authorized 6-character bank alphanumeric header (e.g., AD-HDFCBK).',
      'Ultimatums giving 12 or 24 hours before account deactivation.',
      'URLs ending in suspicious domains (.top, .xyz, .click, .icu) instead of .sbi, .co.in, or official bank domains.'
    ],
    whatToDo: [
      'Never click links in SMS claiming your bank account is blocked.',
      'Log in only through official banking mobile apps or directly typing the official URL.',
      'Banks never ask you to update KYC over third-party web forms or WhatsApp.',
      'Report fake sender numbers to the Chakshu portal at sancharsaathi.gov.in.'
    ],
    sampleSnippet: 'Dear SBI user, your YONO account has been suspended today. Update PAN card at http://onlinesbi-kyc.top within 24 hours to avoid deactivation.'
  },
  {
    id: 'electricity_cut',
    title: 'Electricity Disconnection Tonight at 9:30 PM',
    hindiTitle: 'बिजली कनेक्शन काटने की रात 9:30 बजे की फर्जी चेतावनी',
    severity: 'CRITICAL',
    badge: 'Discom Impersonation',
    color: 'rose',
    summary: 'High-panic SMS claiming the household electricity connection will be severed at 9:30 PM tonight due to unpaid dues, instructing victims to call a personal mobile number.',
    howItWorks: [
      'Victim receives an alarming SMS late in the afternoon or evening.',
      'SMS gives a 2-hour deadline stating power will be cut tonight at 9:30 PM.',
      'Victim panics and dials the 10-digit mobile number given for the "Discom Officer".',
      'Scammer instructs the victim to download a "bill verification app" (AnyDesk/TeamViewer) or pay a nominal ₹10 test fee through a phishing link.'
    ],
    redFlags: [
      'Notice arrives from a personal 10-digit mobile number, not a state Discom header.',
      'Threat of power cut within hours (9:30 PM tonight).',
      'Caller insists on installing remote access software like AnyDesk or QuickSupport.',
      'Official Discom portals are never mentioned.'
    ],
    whatToDo: [
      'Do not panic. Genuine electricity boards issue written notices weeks in advance.',
      'Never dial numbers provided inside unsolicited SMS notices.',
      'Check your actual bill status on your state Discom portal (BESCOM, Mahavitaran, UPPCL, TNEB).',
      'Never install AnyDesk or TeamViewer at the instruction of an unknown caller.'
    ],
    sampleSnippet: 'प्रिय उपभोक्ता, आपकी बिजली आज रात 9:30 बजे काट दी जाएगी क्योंकि पिछले माह का बिल अपडेट नहीं हुआ है। तुरंत 9876543210 पर संपर्क करें।'
  },
  {
    id: 'job_offer',
    title: 'Part-Time YouTube Like & Telegram Task Scam',
    hindiTitle: 'यूट्यूब लाइक व गूगल रिव्यू वर्क फ्रॉम होम स्कैम',
    severity: 'HIGH',
    badge: 'Prepaid Task Fraud',
    color: 'amber',
    summary: 'Luring students and jobseekers with promises of ₹3,000–₹8,000 daily earnings for liking videos and rating hotels, leading to cryptocurrency extortion.',
    howItWorks: [
      'Victim receives a WhatsApp blast offering part-time work: "Earn ₹5,000 daily liking YouTube videos for 20 mins".',
      'Victim performs 2 initial tasks (liking videos) and actually receives ₹150–₹300 into their UPI as bait.',
      'Victim is added to a VIP Telegram group and introduced to "prepaid investment tasks" promising 40% guaranteed returns.',
      'Victim deposits ₹10,000, then ₹50,000, then ₹2,00,000. When they attempt to withdraw, scammers demand "tax clearance deposits" until victim is broke.'
    ],
    redFlags: [
      'Recruitment conducted via WhatsApp blasts or Telegram coordinators.',
      'Promises of exorbitant pay (₹3,000 to ₹8,000 daily) for menial tasks like liking videos.',
      'Requirements to pay money upfront to "unlock" higher salary levels or withdraw earnings.'
    ],
    whatToDo: [
      'Legitimate corporate companies never recruit via random WhatsApp or Telegram messages.',
      'Never deposit money to get a job or unlock task commissions.',
      'If you have sent money, document the Telegram handles and bank account numbers and file an FIR immediately on 1930.'
    ],
    sampleSnippet: 'Earn Rs 5,000 daily working from home! Just like YouTube videos and rate Google maps for 20 mins. Contact HR manager on Telegram @EarnFastIndia.'
  },
  {
    id: 'courier_customs',
    title: 'Courier Parcel Interception & Customs Fine',
    hindiTitle: 'कूरियर पार्सल जब्ती व कस्टम्स जुर्माना फ्रॉड',
    severity: 'CRITICAL',
    badge: 'Authority Impersonation',
    color: 'rose',
    summary: 'Scammers claim FedEx or Blue Dart intercepted a shipment in your name containing passports or contraband drugs and threaten immediate police intervention.',
    howItWorks: [
      'Caller claims to be FedEx/Blue Dart customer service reporting a parcel sent from Mumbai to Taiwan/Dubai containing contraband.',
      'When the victim denies sending it, caller claims their identity has been stolen and offers to connect them to "Cyber Police".',
      'Fake police officer threatens arrest unless the victim pays a "Customs Clearance Guarantee Deposit".'
    ],
    redFlags: [
      'Calls from courier companies claiming you are involved in international narcotics smuggling.',
      'Urgent demands to transfer funds to resolve criminal customs cases.'
    ],
    whatToDo: [
      'Hang up immediately. Courier agencies have no authority to conduct police investigations.',
      'Courier tracking can only be verified directly on official carrier sites (fedex.com, bluedart.com).'
    ],
    sampleSnippet: 'FedEx Customs Warning: Your parcel from Mumbai to Taiwan was intercepted with illegal drugs. Contact Narcotics Control Bureau officer immediately.'
  },
  {
    id: 'kbc_lottery',
    title: 'KBC 25 Lakh Lucky Draw & WhatsApp Lottery',
    hindiTitle: 'केबीसी 25 लाख लकी ड्रा व व्हाट्सएप लॉटरी ठगी',
    severity: 'HIGH',
    badge: 'Advance-Fee Fraud',
    color: 'amber',
    summary: 'Congratulatory WhatsApp messages claiming your mobile number won ₹25–₹50 Lakh in a KBC draw, demanding advance processing fees to release the prize.',
    howItWorks: [
      'Victim receives an audio note or image banner featuring Amitabh Bachchan claiming their SIM won ₹25 Lakh.',
      'Victim contacts the "KBC Manager" on WhatsApp who asks for an upfront "GST and Processing Fee" of ₹1,500 to ₹25,000.',
      'Victim pays the fee, after which the scammer asks for further "currency conversion fees" before disappearing.'
    ],
    redFlags: [
      'Winning a lottery for a contest you never entered or purchased a ticket for.',
      'Demands to pay upfront processing fees or taxes to release prize money.'
    ],
    whatToDo: [
      'KBC and Sony TV never organize lottery contests based on random mobile numbers.',
      'Never pay advance fees to claim prizes or lottery winnings.'
    ],
    sampleSnippet: 'KBC 2026: Aapka number 25 Lakh ki lottery jeeta hai! Prize claim karne ke liye processing fee Rs 1,500 jama karein.'
  },
  {
    id: 'remote_access',
    title: 'Remote Access App Screen Mirroring Trap',
    hindiTitle: 'रिमोट एक्सेस ऐप (AnyDesk) स्क्रीन मिररिंग ठगी',
    severity: 'CRITICAL',
    badge: 'Device Takeover',
    color: 'rose',
    summary: 'Convincing victims to install AnyDesk, TeamViewer, or RustDesk to solve a minor banking/telecom issue, allowing scammers to view bank OTPs and drain accounts.',
    howItWorks: [
      'Scammer poses as customer support (bank, broadband, or courier).',
      'Caller claims a "technical verification error" requires installing a helper app from the Play Store (AnyDesk, QuickSupport).',
      'Scammer asks for the 9-digit remote access code displayed on the victim screen.',
      'Once connected, the scammer watches as the victim opens their banking app, recording passwords and intercepting OTP notifications in real-time.'
    ],
    redFlags: [
      'Any caller asking you to download AnyDesk, TeamViewer, RustDesk, or QuickSupport to fix an issue.',
      'Asking you to read out a 9-digit connection code.'
    ],
    whatToDo: [
      'NEVER install remote control applications at the request of an incoming caller.',
      'If you have already installed it, immediately turn off Wi-Fi/Mobile Data and uninstall the application.',
      'Contact your bank immediately to block NetBanking and debit cards.'
    ],
    sampleSnippet: 'Bank alert: Install AnyDesk app immediately to complete your biometric KYC or your account will be frozen within 2 hours.'
  }
];

export default function ScamLibraryPage({ onTestInScanner }) {
  const [selectedScam, setSelectedScam] = useState(SCAM_KNOWLEDGE_BASE[0]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-violet-500/10 border border-violet-500/30 text-violet-300 mb-3">
          <BookOpen className="w-3.5 h-3.5" />
          <span>India Scam Intelligence Encyclopedia</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold font-heading text-white tracking-tight">
          Common Indian Scam Blueprints
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
          Learn how cyber criminals engineer high-pressure tactics, spot subtle red flags, and test suspect messages directly in PhishShield AI.
        </p>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Scam Cards Grid */}
        <div className="lg:col-span-5 space-y-3">
          <h3 className="text-xs font-bold font-heading uppercase tracking-wider text-slate-400 mb-2">
            Select a Threat Vector ({SCAM_KNOWLEDGE_BASE.length}):
          </h3>
          {SCAM_KNOWLEDGE_BASE.map((scam) => {
            const isSelected = selectedScam.id === scam.id;
            const isCritical = scam.severity === 'CRITICAL';

            return (
              <div
                key={scam.id}
                onClick={() => setSelectedScam(scam)}
                className={`p-4 rounded-xl cursor-pointer transition-all border ${
                  isSelected
                    ? 'glass-panel border-cyan-400 shadow-lg shadow-cyan-500/10 bg-[#0E1527]'
                    : 'glass-panel border-white/5 hover:border-white/20 bg-[#090E1A]/80'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full mb-1.5 border ${
                      isCritical ? 'bg-rose-500/15 text-rose-400 border-rose-500/30' : 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                    }`}>
                      {scam.badge}
                    </span>
                    <h4 className="text-sm font-bold text-white font-heading">
                      {scam.title}
                    </h4>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                      {scam.summary}
                    </p>
                  </div>
                  <ArrowRight className={`w-4 h-4 shrink-0 transition-transform ${
                    isSelected ? 'text-cyan-400 translate-x-1' : 'text-slate-600'
                  }`} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Deep-Dive Card */}
        <div className="lg:col-span-7 sticky top-24">
          <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/10 bg-[#0D1424] space-y-6 shadow-2xl">
            {/* Header */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                  selectedScam.severity === 'CRITICAL' 
                    ? 'bg-rose-500/15 text-rose-400 border-rose-500/30' 
                    : 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                }`}>
                  {selectedScam.severity} RISK
                </span>
                <span className="text-xs text-slate-400 font-hindi">
                  {selectedScam.hindiTitle}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold font-heading text-white">
                {selectedScam.title}
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm mt-2 leading-relaxed">
                {selectedScam.summary}
              </p>
            </div>

            {/* How the Scam Unfolds */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold font-heading uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4" />
                How This Scam Unfolds Step-by-Step
              </h4>
              <div className="space-y-2">
                {selectedScam.howItWorks.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                    <span className="w-5 h-5 rounded-full bg-cyan-500/15 text-cyan-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{step}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Red Flags */}
            <div className="space-y-2.5 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20">
              <h4 className="text-xs font-bold font-heading uppercase tracking-wider text-rose-300 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                Dead Giveaway Red Flags
              </h4>
              <ul className="space-y-1.5">
                {selectedScam.redFlags.map((flag, idx) => (
                  <li key={idx} className="text-xs text-slate-200 flex items-start gap-2">
                    <span className="text-rose-400 font-bold">•</span>
                    <span>{flag}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* What to Do Immediately */}
            <div className="space-y-2.5 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <h4 className="text-xs font-bold font-heading uppercase tracking-wider text-emerald-300 flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                What to Do If You Encounter This
              </h4>
              <ul className="space-y-1.5">
                {selectedScam.whatToDo.map((todo, idx) => (
                  <li key={idx} className="text-xs text-slate-200 flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>{todo}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Sample Snippet & One-click Test */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-white/5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400 uppercase font-mono">
                  Live Phishing Sample Payload:
                </span>
                <button
                  type="button"
                  onClick={() => onTestInScanner && onTestInScanner(selectedScam.sampleSnippet)}
                  className="flex items-center gap-1 text-xs font-bold text-cyan-400 hover:text-cyan-300 hover:underline"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Test This In Scanner →</span>
                </button>
              </div>
              <p className="font-mono text-xs text-slate-300 bg-slate-900 p-3 rounded-lg border border-white/5 whitespace-pre-wrap select-all">
                {selectedScam.sampleSnippet}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

