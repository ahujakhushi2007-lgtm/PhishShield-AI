import React, { useEffect, useState } from 'react';
import { Shield, Check, Loader2 } from 'lucide-react';

const SCAN_STEPS = [
  'Inspecting syntax, character encodings & protocols…',
  'Querying 45+ Indian banking, fintech & brand registries…',
  'Executing Levenshtein distance & punycode analysis…',
  'Analyzing psychological manipulation & coercion cues…',
  'Running Gemini 2.5 Flash neural scam classification…',
  'Synthesizing dual-engine findings & defense advisory…'
];

export default function ScanningRadar({ inputType = 'url' }) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStepIndex(prev => {
        if (prev < SCAN_STEPS.length - 1) return prev + 1;
        return prev;
      });
    }, 450);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative p-8 rounded-2xl glass-panel border border-cyan-500/30 text-center overflow-hidden my-6">
      {/* Background Animated Radar Grid */}
      <div className="relative mx-auto w-36 h-36 flex items-center justify-center mb-6">
        {/* Concentric radar rings */}
        <div className="absolute inset-0 rounded-full border border-cyan-500/20" />
        <div className="absolute inset-4 rounded-full border border-cyan-500/30" />
        <div className="absolute inset-8 rounded-full border border-cyan-500/40" />
        
        {/* Radar Sweeping Beam */}
        <div className="absolute inset-0 rounded-full overflow-hidden">
          <div 
            className="w-full h-full animate-radar origin-center"
            style={{
              background: 'conic-gradient(from 0deg at 50% 50%, rgba(34, 211, 238, 0.4) 0deg, rgba(34, 211, 238, 0.05) 60deg, transparent 90deg)'
            }}
          />
        </div>

        {/* Central Shield Pulse */}
        <div className="relative z-10 w-12 h-12 rounded-full bg-cyan-950/80 border border-cyan-400 flex items-center justify-center shadow-lg shadow-cyan-500/40 animate-pulse">
          <Shield className="w-6 h-6 text-cyan-300" />
        </div>
      </div>

      {/* Main Status Text */}
      <h3 className="text-xl font-bold font-heading text-white tracking-tight mb-2">
        Scanning & Deconstructing Threats
      </h3>
      <p className="text-xs text-cyan-300 font-mono tracking-wide mb-6">
        PHISHSHIELD THREAT INTELLIGENCE RADAR ACTIVE
      </p>

      {/* Step Progress Checklist */}
      <div className="max-w-md mx-auto space-y-2 text-left">
        {SCAN_STEPS.map((step, idx) => {
          const isDone = idx < currentStepIndex;
          const isCurrent = idx === currentStepIndex;

          return (
            <div 
              key={idx}
              className={`flex items-center gap-3 text-xs transition-all duration-300 ${
                isDone 
                  ? 'text-emerald-400 font-medium' 
                  : (isCurrent ? 'text-cyan-300 font-bold scale-[1.02]' : 'text-slate-400')
              }`}
            >
              <div className="w-4 h-4 flex items-center justify-center shrink-0">
                {isDone ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : isCurrent ? (
                  <Loader2 className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
                ) : (
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                )}
              </div>
              <span className="truncate">{step}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

