import React from 'react';
import { ShieldCheck, PhoneCall, Globe, ExternalLink, Lock } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-white/10 dark:border-white/10 dark:bg-[#070B14] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Helpline Banner */}
        <div className="glass-panel rounded-2xl p-6 sm:p-8 mb-10 border border-cyan-500/20 bg-gradient-to-r from-cyan-950/30 via-slate-900/40 to-violet-950/30">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-cyan-400 font-semibold text-sm mb-1">
                <PhoneCall className="w-4 h-4" />
                <span>India National Cybercrime Helpline</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold font-heading text-white">
                Fallen victim to an online financial fraud?
              </h3>
              <p className="text-slate-300 text-sm mt-1 max-w-2xl">
                Immediately report within the golden hour to freeze fraudulent debit transactions before money leaves the banking system.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <a
                href="tel:1930"
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-base shadow-lg shadow-rose-600/30 transition-all"
              >
                <PhoneCall className="w-5 h-5 animate-bounce" />
                Dial 1930
              </a>
              <a
                href="https://cybercrime.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium text-sm border border-white/15 transition-all"
              >
                <span>cybercrime.gov.in</span>
                <ExternalLink className="w-4 h-4 text-slate-400" />
              </a>
              <a
                href="https://sancharsaathi.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium text-sm border border-white/15 transition-all"
              >
                <span>Sanchar Saathi (Chakshu)</span>
                <ExternalLink className="w-4 h-4 text-slate-400" />
              </a>
            </div>
          </div>
        </div>

        {/* Footer bottom metadata */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>PhishShield AI — Decision-support cybersecurity intelligence for Indian digital citizens.</span>
          </div>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-slate-400">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              Zero Telemetry • Privacy First
            </span>
            <span>Created for Mentor Presentation • v1.0 Production Ready</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

