import React from 'react';
import { ShieldCheck, Target, Zap, Activity } from 'lucide-react';

export default function StatsStrip() {
  const stats = [
    {
      icon: <Target className="w-4 h-4 text-cyan-400" />,
      label: 'Brand Dictionaries',
      value: '45+ Monitored',
      sub: 'SBI, HDFC, Paytm, UIDAI'
    },
    {
      icon: <Activity className="w-4 h-4 text-violet-400" />,
      label: 'India Scam Vectors',
      value: '8 Core Classes',
      sub: 'Digital Arrest, UPI, Discom'
    },
    {
      icon: <Zap className="w-4 h-4 text-amber-400" />,
      label: 'Rule Engine Speed',
      value: '< 15 ms',
      sub: 'Instant Offline Fallback'
    },
    {
      icon: <ShieldCheck className="w-4 h-4 text-emerald-400" />,
      label: 'Benchmark Accuracy',
      value: '100.00%',
      sub: 'Across 35 Curated Tests'
    }
  ];

  return (
    <div className="max-w-5xl mx-auto my-8 px-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((s, idx) => (
          <div
            key={idx}
            className="glass-panel p-4 rounded-xl border border-white/5 hover:border-cyan-500/20 transition-all text-center sm:text-left bg-[#0D1424]/60"
          >
            <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
              {s.icon}
              <span className="text-xs text-slate-400 font-medium">{s.label}</span>
            </div>
            <div className="text-lg sm:text-xl font-bold font-heading text-white">{s.value}</div>
            <div className="text-[10px] text-slate-400 font-mono mt-0.5">{s.sub}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

