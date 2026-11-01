import React, { useState } from 'react';
import { Layers, Play, Download, Trash2, ShieldAlert, ShieldCheck, AlertTriangle, FileSpreadsheet, Sparkles } from 'lucide-react';
import { analyzeUrl } from '@shared/urlAnalyzer.js';

const SAMPLE_BATCH = `http://onlinesbi.sbi-kyc-verify.top/login
https://www.onlinesbi.sbi
http://192.168.1.105/hdfc/netbanking/login.php
https://netbanking.hdfcbank.com
http://paytmm-cashback-reward.click/claim
https://paytm.com
http://uidai-aadhaar-download.icu/verify-otp
https://uidai.gov.in
http://icicibank.com@attacker-box.xyz/login
https://www.amazon.in
http://amazon-cancellation-order.live/dispute`;

export default function BatchScannerPage() {
  const [urlListText, setUrlListText] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [batchResults, setBatchResults] = useState(null);

  const handleRunBatch = async () => {
    const urls = urlListText
      .split('\n')
      .map(u => u.trim())
      .filter(u => u.length > 0);

    if (urls.length === 0) return;

    setIsScanning(true);
    try {
      let data = null;
      try {
        const res = await fetch('/api/analyze/batch', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ urls })
        });
        if (res.ok) {
          data = await res.json();
        }
      } catch (err) {
        console.warn('Backend batch endpoint unavailable, using client-side engine:', err);
      }

      if (!data) {
        const localResults = urls.map(u => analyzeUrl(u));
        localResults.sort((a, b) => b.riskScore - a.riskScore);
        data = {
          summary: {
            total: localResults.length,
            dangerous: localResults.filter(r => r.verdict === 'DANGEROUS').length,
            suspicious: localResults.filter(r => r.verdict === 'SUSPICIOUS').length,
            safe: localResults.filter(r => r.verdict === 'SAFE').length,
            avgScore: Math.round(localResults.reduce((acc, c) => acc + c.riskScore, 0) / localResults.length)
          },
          results: localResults
        };
      }

      setBatchResults(data);
    } catch (e) {
      console.error('Batch scan failed:', e);
    } finally {
      setIsScanning(false);
    }
  };

  const handleExportCsv = () => {
    if (!batchResults?.results) return;
    const headers = ['URL', 'Verdict', 'RiskScore', 'Domain', 'BrandImpersonation', 'FindingsCount'];
    const rows = batchResults.results.map(r => [
      `"${r.url || r.originalInput}"`,
      r.verdict,
      r.riskScore,
      `"${r.domain || ''}"`,
      `"${r.brandImpersonation?.brandName || 'None'}"`,
      r.findings?.length || 0
    ]);
    const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `phishshield_batch_report_${Date.now()}.csv`;
    link.click();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 mb-3">
          <Layers className="w-3.5 h-3.5" />
          <span>High-Throughput Threat Pipeline</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold font-heading text-white tracking-tight">
          Batch URL Threat Inspector
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
          Paste a list of links (up to 30) from SMS dumps, email logs, or web scrapers to compute risk scores and rank malicious domains.
        </p>
      </div>

      {/* Input Form Card */}
      <div className="glass-panel p-6 rounded-2xl border border-white/10 bg-[#0D1424] space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold font-heading uppercase tracking-wider text-slate-300">
            Enter Target URLs (One per line):
          </label>
          <button
            type="button"
            onClick={() => setUrlListText(SAMPLE_BATCH)}
            className="flex items-center gap-1 text-xs text-violet-400 hover:text-violet-300 font-semibold"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Load 11 Realistic Sample URLs</span>
          </button>
        </div>

        <textarea
          rows={6}
          value={urlListText}
          onChange={(e) => setUrlListText(e.target.value)}
          placeholder={`http://onlinesbi.sbi-kyc.top/login\nhttps://paytm.com\nhttp://192.168.1.1/login\n...`}
          className="w-full p-4 rounded-xl bg-slate-950 border border-white/10 text-slate-200 font-mono text-xs focus:outline-none focus:border-cyan-400"
          disabled={isScanning}
        />

        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => { setUrlListText(''); setBatchResults(null); }}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Input</span>
          </button>

          <button
            type="button"
            onClick={handleRunBatch}
            disabled={isScanning || !urlListText.trim()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-400 hover:to-violet-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <Play className="w-4 h-4 text-slate-950" />
            <span>{isScanning ? 'Processing Batch...' : 'Run Batch Analysis'}</span>
          </button>
        </div>
      </div>

      {/* Batch Results View */}
      {batchResults && (
        <div className="space-y-6">
          {/* Summary Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="glass-panel p-4 rounded-xl border border-white/10 bg-[#0D1424]/70">
              <span className="text-[11px] font-semibold text-slate-400 uppercase">Analyzed URLs</span>
              <div className="text-2xl font-bold font-heading text-white mt-1">
                {batchResults.summary.total}
              </div>
            </div>

            <div className="glass-panel p-4 rounded-xl border border-rose-500/20 bg-rose-500/5">
              <span className="text-[11px] font-semibold text-rose-400 uppercase">Dangerous</span>
              <div className="text-2xl font-bold font-heading text-rose-400 mt-1">
                {batchResults.summary.dangerous}
              </div>
            </div>

            <div className="glass-panel p-4 rounded-xl border border-amber-500/20 bg-amber-500/5">
              <span className="text-[11px] font-semibold text-amber-400 uppercase">Suspicious</span>
              <div className="text-2xl font-bold font-heading text-amber-400 mt-1">
                {batchResults.summary.suspicious}
              </div>
            </div>

            <div className="glass-panel p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5">
              <span className="text-[11px] font-semibold text-emerald-400 uppercase">Verified Safe</span>
              <div className="text-2xl font-bold font-heading text-emerald-400 mt-1">
                {batchResults.summary.safe}
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="glass-panel rounded-2xl border border-white/10 p-5 bg-[#0D1424]/80 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold font-heading text-white">
                Ranked Threat Table (Sorted by Severity)
              </h3>
              <button
                type="button"
                onClick={handleExportCsv}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-cyan-300 border border-cyan-500/30 text-xs font-semibold"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Export to CSV</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-white/10 text-slate-400 text-[10px] uppercase font-sans">
                    <th className="py-2.5 px-3"># Rank</th>
                    <th className="py-2.5 px-3">Verdict</th>
                    <th className="py-2.5 px-3">Risk Score</th>
                    <th className="py-2.5 px-3">Host Domain</th>
                    <th className="py-2.5 px-3">Targeted Brand</th>
                    <th className="py-2.5 px-3">Indicators</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {batchResults.results.map((r, idx) => {
                    const isDang = r.verdict === 'DANGEROUS';
                    const isSusp = r.verdict === 'SUSPICIOUS';

                    return (
                      <tr key={idx} className="hover:bg-white/5 transition-colors">
                        <td className="py-2.5 px-3 text-slate-400 font-bold">
                          #{idx + 1}
                        </td>
                        <td className="py-2.5 px-3">
                          <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border ${
                            isDang ? 'bg-rose-500/15 text-rose-400 border-rose-500/30' : (isSusp ? 'bg-amber-500/15 text-amber-400 border-amber-500/30' : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30')
                          }`}>
                            {r.verdict}
                          </span>
                        </td>
                        <td className={`py-2.5 px-3 font-bold ${
                          isDang ? 'text-rose-400' : (isSusp ? 'text-amber-400' : 'text-emerald-400')
                        }`}>
                          {r.riskScore}/100
                        </td>
                        <td className="py-2.5 px-3 text-slate-200">
                          {r.domain || r.url}
                        </td>
                        <td className="py-2.5 px-3 text-slate-300 font-sans">
                          {r.brandImpersonation?.brandName ? (
                            <span className="text-rose-300 font-semibold">{r.brandImpersonation.brandName}</span>
                          ) : 'None'}
                        </td>
                        <td className="py-2.5 px-3 text-slate-400 font-sans">
                          {r.findings?.length || 0} checks triggered
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

