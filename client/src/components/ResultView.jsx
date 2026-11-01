import React, { useState } from 'react';
import { 
  ShieldAlert, ShieldCheck, AlertTriangle, ArrowLeft, Download, 
  Share2, ExternalLink, Globe, PhoneCall, Copy, Check, Info, ShieldX 
} from 'lucide-react';
import RiskGauge from './RiskGauge.jsx';
import TextHighlighter from './TextHighlighter.jsx';
import UrlBreakdown from './UrlBreakdown.jsx';
import { openPrintableReport, copyShareableSummary } from '../utils/reportGenerator.js';

export default function ResultView({ result, inputType, onReset }) {
  const [language, setLanguage] = useState('en'); // 'en' | 'hi'
  const [copied, setCopied] = useState(false);

  if (!result) return null;

  const isDangerous = result.verdict === 'DANGEROUS';
  const isSuspicious = result.verdict === 'SUSPICIOUS';
  const isSafe = result.verdict === 'SAFE';

  const handleCopySummary = () => {
    const text = copyShareableSummary(result);
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    openPrintableReport(result, inputType);
  };

  return (
    <div className="w-full max-w-5xl mx-auto my-6 px-4 space-y-6 animate-in fade-in zoom-in-95 duration-300">
      {/* Top Navigation Strip */}
      <div className="flex items-center justify-between">
        <button
          onClick={onReset}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
        >
          <ArrowLeft className="w-4 h-4 text-cyan-400" />
          <span>Scan Another Artifact</span>
        </button>

        {/* Language Toggle */}
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-white/10 text-xs">
          <button
            onClick={() => setLanguage('en')}
            className={`px-2.5 py-1 rounded font-semibold transition-all ${
              language === 'en' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400 hover:text-white'
            }`}
          >
            English
          </button>
          <button
            onClick={() => setLanguage('hi')}
            className={`px-2.5 py-1 rounded font-semibold transition-all ${
              language === 'hi' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400 hover:text-white'
            }`}
          >
            हिंदी (Hindi)
          </button>
        </div>
      </div>

      {/* Main Verdict & Gauge Hero Card */}
      <div className="glass-panel rounded-2xl border border-white/10 p-6 sm:p-8 relative overflow-hidden bg-gradient-to-br from-[#0D1424] via-[#090E1A] to-[#0D1424]">
        {/* Ambient background glow according to risk */}
        <div className={`absolute top-0 right-0 w-96 h-96 rounded-full filter blur-3xl opacity-10 pointer-events-none ${
          isDangerous ? 'bg-rose-500' : (isSuspicious ? 'bg-amber-500' : 'bg-emerald-500')
        }`} />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Circular Gauge Column */}
          <div className="md:col-span-5 flex justify-center">
            <RiskGauge
              score={result.riskScore}
              verdict={result.verdict}
              dualScore={result.dualScore}
              mode={result.mode}
            />
          </div>

          {/* Verdict Description Column */}
          <div className="md:col-span-7 space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                {result.scamCategory && (
                  <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-violet-500/15 text-violet-300 border border-violet-500/30">
                    {language === 'hi' && result.scamCategory.hindiName ? result.scamCategory.hindiName : result.scamCategory.name}
                  </span>
                )}
                {result.impersonating && (
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 border border-rose-500/20">
                    Target: {result.impersonating}
                  </span>
                )}
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-white">
                {isDangerous && 'Critical Threat Detected'}
                {isSuspicious && 'Suspicious Signals Detected'}
                {isSafe && 'Legitimate & Safe Artifact'}
              </h2>
            </div>

            <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
              {language === 'hi' && result.explanationHi ? result.explanationHi : result.explanation}
            </p>

            {/* Manipulation Tactics Tag Strip */}
            {result.tactics && result.tactics.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 pt-2">
                <span className="text-xs text-slate-400 font-semibold mr-1">Tactics:</span>
                {result.tactics.map((tactic, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-slate-300 font-medium"
                  >
                    {tactic}
                  </span>
                ))}
              </div>
            )}

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5 pt-4">
              <button
                onClick={handleDownload}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-semibold transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Download Report (PDF/HTML)</span>
              </button>

              <button
                onClick={handleCopySummary}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 text-xs font-semibold transition-all"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
                <span>{copied ? 'Summary Copied!' : 'Copy Summary'}</span>
              </button>

              <a
                href="https://cybercrime.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 text-xs font-semibold transition-all"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Report to 1930 Portal</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Safe URL Breakdown Component (if URL) */}
      {result.urlBreakdown && (
        <UrlBreakdown
          breakdown={result.urlBreakdown}
          brandImpersonation={result.brandImpersonation}
          riskScore={result.riskScore}
        />
      )}

      {/* Highlighted Evidence Text (if Text / SMS / Email) */}
      {result.highlights && result.highlights.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-xs font-bold font-heading uppercase tracking-wider text-cyan-400">
            Deconstructed Message & In-Text Forensic Highlights (Hover to inspect reasons):
          </h3>
          <TextHighlighter
            text={result.text}
            highlights={result.highlights}
          />
        </div>
      )}

      {/* Key Forensic Findings Breakdown */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold font-heading uppercase tracking-wider text-cyan-400 flex items-center justify-between">
          <span>Identified Threat Indicators & Red Flags ({result.findings?.length || 0})</span>
          <span className="text-slate-400 text-[11px] font-normal">Score contributions summed by rule engine</span>
        </h3>

        {(!result.findings || result.findings.length === 0) ? (
          <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5 text-xs text-emerald-400 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" />
            <span>Zero suspicious red flags detected. Conforms to baseline legitimate standards.</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-2.5">
            {result.findings.map((f, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-[#090E1A] border border-white/10 hover:border-cyan-500/30 transition-all flex items-start justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${
                      f.severity === 'critical' ? 'bg-rose-500' : (f.severity === 'high' ? 'bg-amber-400' : 'bg-sky-400')
                    }`} />
                    <h4 className="text-sm font-bold text-white font-heading">{f.title}</h4>
                    <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-white/5 text-slate-400 border border-white/10">
                      {f.severity || 'Medium'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed pl-4">
                    {f.description}
                  </p>
                </div>
                {f.score !== undefined && (
                  <span className={`text-xs font-mono font-bold shrink-0 px-2 py-1 rounded ${
                    f.score > 0 ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  }`}>
                    {f.score > 0 ? `+${f.score}` : f.score}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recommended Actions & Mitigation Advisory */}
      <div className="p-5 rounded-2xl glass-panel border border-cyan-500/20 bg-gradient-to-r from-slate-950 via-[#0D1424] to-slate-950 space-y-4">
        <h3 className="text-sm font-bold font-heading text-white flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-cyan-400" />
          <span>Recommended Defense Actions & Safety Guidelines</span>
        </h3>

        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-200">
          {(result.recommendedActions || []).map((action, idx) => (
            <li key={idx} className="flex items-start gap-2 p-2.5 rounded-lg bg-white/5 border border-white/5">
              <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0 text-[10px] font-bold">
                {idx + 1}
              </span>
              <span className="leading-relaxed">{action}</span>
            </li>
          ))}
        </ul>

        {/* Important Limitations Disclosure */}
        <div className="pt-2 text-[11px] text-slate-400 border-t border-white/5 flex items-start gap-2">
          <Info className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
          <span>
            <strong>Limitations Disclosure:</strong> PhishShield AI is an intelligent decision-support tool powered by pattern-matching heuristics and neural LLMs. While highly accurate, threat actors continually evolve techniques. Always verify high-stakes financial queries directly with official bank branches or verified institutional apps.
          </span>
        </div>
      </div>
    </div>
  );
}

