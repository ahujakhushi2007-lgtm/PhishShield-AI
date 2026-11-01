import React from 'react';
import { ExternalLink, ShieldCheck, AlertTriangle, ShieldAlert } from 'lucide-react';

export default function UrlBreakdown({ breakdown, brandImpersonation, riskScore }) {
  if (!breakdown) return null;

  const isDangerous = riskScore >= 60;
  const isSuspicious = riskScore >= 20 && riskScore < 60;

  return (
    <div className="p-5 rounded-xl bg-[#050811] border border-white/10 space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold font-heading uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
          <ExternalLink className="w-4 h-4" />
          Safe URL Anatomy & Deception Inspection
        </h4>
        {breakdown.dangerZone && (
          <span className="text-[11px] font-bold text-rose-400 bg-rose-500/10 border border-rose-500/30 px-2.5 py-0.5 rounded-full">
            Danger Flag: {breakdown.dangerZone}
          </span>
        )}
      </div>

      {/* Visual Component Chips */}
      <div className="flex flex-wrap items-center gap-1.5 font-mono text-sm bg-slate-900/90 p-3 rounded-lg border border-white/5 overflow-x-auto">
        {/* Protocol */}
        <div className="flex flex-col items-center">
          <span className="text-[9px] uppercase font-sans font-bold text-slate-400 mb-0.5">Protocol</span>
          <span className={`px-2 py-1 rounded text-xs font-semibold ${
            breakdown.protocol === 'https' 
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
              : 'bg-rose-500/15 text-rose-400 border border-rose-500/30 animate-pulse'
          }`}>
            {breakdown.protocol}://
          </span>
        </div>

        {/* Subdomain (if exists) */}
        {breakdown.subdomain && (
          <div className="flex flex-col items-center">
            <span className="text-[9px] uppercase font-sans font-bold text-slate-400 mb-0.5">Subdomain</span>
            <span className={`px-2 py-1 rounded text-xs font-semibold ${
              brandImpersonation?.method === 'Subdomain Deception'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 ring-1 ring-rose-500'
                : 'bg-slate-800 text-slate-300 border border-white/10'
            }`}>
              {breakdown.subdomain}.
            </span>
          </div>
        )}

        {/* Registered Domain */}
        <div className="flex flex-col items-center">
          <span className="text-[9px] uppercase font-sans font-bold text-slate-400 mb-0.5">True Host Domain</span>
          <span className={`px-2.5 py-1 rounded text-xs font-bold ${
            isDangerous
              ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
              : (isSuspicious ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30')
          }`}>
            {breakdown.domain}
          </span>
        </div>

        {/* Path & Query */}
        {(breakdown.path || breakdown.query) && (
          <div className="flex flex-col items-center">
            <span className="text-[9px] uppercase font-sans font-bold text-slate-400 mb-0.5">Path & Query</span>
            <span className="px-2 py-1 rounded text-xs font-mono bg-slate-800/80 text-slate-400 border border-white/5 truncate max-w-xs">
              {breakdown.path}{breakdown.query}
            </span>
          </div>
        )}
      </div>

      {/* Brand Impersonation Alert Banner */}
      {brandImpersonation && (
        <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5">
          <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-white block font-heading">
              Brand Impersonation Detected: {brandImpersonation.brandName}
            </strong>
            <p className="mt-0.5 text-slate-300 text-[11px] leading-relaxed">
              This URL attempts to mimic <strong className="text-white">{brandImpersonation.brandName}</strong> via {brandImpersonation.method}. The genuine domain is completely unrelated to <span className="font-mono text-cyan-300">{breakdown.domain}</span>.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

