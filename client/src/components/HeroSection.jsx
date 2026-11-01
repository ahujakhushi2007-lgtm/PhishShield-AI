import React from 'react';
import { ShieldAlert, Zap, Lock, Award, CheckCircle } from 'lucide-react';

export default function HeroSection() {
  return (
    <div className="relative pt-6 pb-4 sm:pt-10 sm:pb-8 text-center max-w-4xl mx-auto px-4">
      {/* Top Tagline Pill */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-cyan-500/10 via-violet-500/10 to-cyan-500/10 border border-cyan-500/30 text-cyan-300 mb-6 shadow-sm shadow-cyan-500/10">
        <Zap className="w-3.5 h-3.5 text-cyan-400" />
        <span>India-First Threat Intelligence • Instant Plain-Language Verdict</span>
      </div>

      {/* Main Bold Headline */}
      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-heading tracking-tight text-white dark:text-white leading-[1.15]">
        Stop scams <br className="hidden sm:inline" />
        <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-violet-400 bg-clip-text text-transparent">
          before they stop you.
        </span>
      </h1>

      {/* Subtitle */}
      <p className="mt-5 text-base sm:text-lg text-slate-300 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
        Paste a link, an SMS, an email, or upload a screenshot. Within seconds, get a clear
        <span className="text-emerald-400 font-semibold"> Safe</span> /
        <span className="text-amber-400 font-semibold"> Suspicious</span> /
        <span className="text-rose-400 font-semibold"> Dangerous</span> verdict, an animated risk score, exact red flags highlighted, and plain-language advice.
      </p>

      {/* Feature Badges */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-400">
        <span className="flex items-center gap-1.5">
          <CheckCircle className="w-4 h-4 text-cyan-400" />
          UPI & Reverse QR Protection
        </span>
        <span className="flex items-center gap-1.5">
          <CheckCircle className="w-4 h-4 text-cyan-400" />
          Digital Arrest & CBI Coercion Radar
        </span>
        <span className="flex items-center gap-1.5">
          <CheckCircle className="w-4 h-4 text-cyan-400" />
          Hindi & Hinglish Comprehension
        </span>
        <span className="flex items-center gap-1.5">
          <CheckCircle className="w-4 h-4 text-cyan-400" />
          Offline-Ready Heuristics Fallback
        </span>
      </div>
    </div>
  );
}

