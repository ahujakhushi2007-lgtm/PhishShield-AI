/**
 * LocalStorage Scan History and Statistics Manager
 */

const STORAGE_KEY = 'phishshield_scan_history_v1';

export const INITIAL_SEEDS = [
  {
    id: 'seed-1',
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 mins ago
    type: 'message',
    target: 'Dear SBI User, your YONO NetBanking account has been suspended today...',
    verdict: 'DANGEROUS',
    riskScore: 92,
    scamType: 'fake_kyc',
    impersonating: 'State Bank of India',
    mode: 'Hybrid (Gemini 2.5 Flash)'
  },
  {
    id: 'seed-2',
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 mins ago
    type: 'url',
    target: 'http://onlinesbi.sbi-kyc-verify.top/login',
    verdict: 'DANGEROUS',
    riskScore: 95,
    scamType: 'fake_kyc',
    impersonating: 'State Bank of India',
    mode: 'Heuristics Engine'
  },
  {
    id: 'seed-3',
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2 hours ago
    type: 'message',
    target: 'PhonePe Cashback: You won Rs 4,999 refund. Scan QR code and enter UPI PIN...',
    verdict: 'DANGEROUS',
    riskScore: 96,
    scamType: 'upi_refund',
    impersonating: 'PhonePe',
    mode: 'Hybrid (Gemini 2.5 Flash)'
  },
  {
    id: 'seed-4',
    timestamp: new Date(Date.now() - 1000 * 60 * 240).toISOString(), // 4 hours ago
    type: 'message',
    target: 'Dear Customer, INR 1,500.00 debited from your HDFC Bank A/C ending with **4521...',
    verdict: 'SAFE',
    riskScore: 0,
    scamType: null,
    impersonating: null,
    mode: 'Heuristics Engine'
  },
  {
    id: 'seed-5',
    timestamp: new Date(Date.now() - 1000 * 60 * 480).toISOString(), // 8 hours ago
    type: 'message',
    target: 'CBI Crime Branch Notice: A parcel containing narcotics and fake passports was intercepted...',
    verdict: 'DANGEROUS',
    riskScore: 98,
    scamType: 'digital_arrest',
    impersonating: 'Central Bureau of Investigation (CBI)',
    mode: 'Hybrid (Gemini 2.5 Flash)'
  },
  {
    id: 'seed-6',
    timestamp: new Date(Date.now() - 1000 * 60 * 720).toISOString(), // 12 hours ago
    type: 'url',
    target: 'https://www.irctc.co.in/nget/train-search',
    verdict: 'SAFE',
    riskScore: 0,
    scamType: null,
    impersonating: null,
    mode: 'Heuristics Engine'
  },
  {
    id: 'seed-7',
    timestamp: new Date(Date.now() - 1000 * 60 * 1440).toISOString(), // 1 day ago
    type: 'email',
    target: 'Order Cancellation #8921-A Apple iPhone 15 Pro Confirmation',
    verdict: 'DANGEROUS',
    riskScore: 95,
    scamType: 'fake_kyc',
    impersonating: 'Amazon',
    mode: 'Heuristics Engine'
  },
  {
    id: 'seed-8',
    timestamp: new Date(Date.now() - 1000 * 60 * 2880).toISOString(), // 2 days ago
    type: 'message',
    target: 'Earn Rs 5,000 daily working from home! Just like YouTube videos and rate Google maps...',
    verdict: 'SUSPICIOUS',
    riskScore: 55,
    scamType: 'job_offer',
    impersonating: null,
    mode: 'Hybrid (Gemini 2.5 Flash)'
  }
];

export function getScanHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SEEDS));
      return INITIAL_SEEDS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_SEEDS;
  } catch (e) {
    console.error('Failed to read scan history from localStorage:', e);
    return INITIAL_SEEDS;
  }
}

export function saveScanResult(scan) {
  try {
    const history = getScanHistory();
    const newEntry = {
      id: `scan-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      timestamp: new Date().toISOString(),
      ...scan
    };
    const updated = [newEntry, ...history.filter(h => h.id !== newEntry.id)].slice(0, 100);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Failed to save scan to localStorage:', e);
    return [];
  }
}

export function clearScanHistory() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
  } catch (e) {
    console.error('Failed to clear history:', e);
  }
}

