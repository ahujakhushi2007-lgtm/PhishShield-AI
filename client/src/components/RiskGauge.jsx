import React, { useEffect, useState } from 'react';
import { ShieldCheck, ShieldAlert, AlertTriangle } from 'lucide-react';

export default function RiskGauge({ score = 0, verdict = 'SAFE', dualScore, mode }) {
  const [displayedScore, setDisplayedScore] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1200; // 1.2s smooth animation
    const stepTime = 16;
    const totalSteps = duration / stepTime;
    const increment = score / totalSteps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= score) {
        setDisplayedScore(Math.round(score));
        clearInterval(timer);
      } else {
        setDisplayedScore(Math.round(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [score]);

  // Color selection
  let strokeColor = '#10B981'; // Emerald
  let badgeColor = 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
  let glowColor = 'rgba(16, 185, 129, 0.25)';
  let verdictIcon = <ShieldCheck className="w-5 h-5 text-emerald-400" />;

  if (score >= 60 || verdict === 'DANGEROUS') {
    strokeColor = '#F43F5E'; // Rose
    badgeColor = 'bg-rose-500/15 text-rose-400 border-rose-500/30';
    glowColor = 'rgba(244, 63, 94, 0.3)';
    verdictIcon = <ShieldAlert className="w-5 h-5 text-rose-400" />;
  } else if (score >= 20 || verdict === 'SUSPICIOUS') {
    strokeColor = '#F59E0B'; // Amber
    badgeColor = 'bg-amber-500/15 text-amber-400 border-amber-500/30';
    glowColor = 'rgba(245, 158, 11, 0.3)';
    verdictIcon = <AlertTriangle className="w-5 h-5 text-amber-400" />;
  }

  // Gauge SVG calculations
  const radius = 68;
  const circumference = 2 * Math.PI * radius;
  // Arc angle (270 degrees sweep)
  const arcLength = circumference * 0.75;
  const strokeDashoffset = arcLength - (arcLength * (displayedScore / 100));

  return (
    <div className="flex flex-col items-center justify-center p-4">
      {/* Circular Gauge */}
      <div className="relative w-44 h-44 flex items-center justify-center">
        {/* Glow backdrop */}
        <div 
          className="absolute inset-4 rounded-full filter blur-xl transition-all duration-700 pointer-events-none"
          style={{ background: glowColor }}
        />

        <svg className="w-full h-full -rotate-135 transform" viewBox="0 0 160 160">
          {/* Background Track */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="none"
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth="12"
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeLinecap="round"
          />
          {/* Animated Value Arc */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="none"
            stroke={strokeColor}
            strokeWidth="12"
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-500 ease-out"
            style={{
              filter: `drop-shadow(0 0 8px ${strokeColor}66)`
            }}
          />
        </svg>

        {/* Center Numbers */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span 
            className="text-4xl font-extrabold font-heading tracking-tight"
            style={{ color: strokeColor }}
          >
            {displayedScore}
          </span>
          <span className="text-[11px] font-bold tracking-widest text-slate-400 uppercase">
            Risk Score
          </span>
          <span className="text-[10px] text-slate-400">
            out of 100
          </span>
        </div>
      </div>

      {/* Prominent Verdict Badge */}
      <div className={`mt-2 flex items-center gap-2 px-4 py-1.5 rounded-full border ${badgeColor} font-bold text-sm tracking-wide uppercase shadow-sm`}>
        {verdictIcon}
        <span>{verdict}</span>
      </div>

      {/* Transparent Dual Score Breakdown */}
      {dualScore && (
        <div className="mt-3 flex items-center gap-3 text-[11px] font-mono text-slate-400 bg-white/5 px-3 py-1 rounded-lg border border-white/5">
          <span>Rule Engine: <strong className="text-slate-200">{dualScore.rule}</strong></span>
          <span className="text-slate-400">•</span>
          <span>Gemini AI: <strong className="text-slate-200">{dualScore.ai !== null ? dualScore.ai : 'Offline'}</strong></span>
        </div>
      )}
    </div>
  );
}

