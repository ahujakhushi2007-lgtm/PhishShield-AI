import React from 'react';
import { Shield, BarChart3, BookOpen, Layers, Info, Moon, Sun, ShieldAlert, Sparkles } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, isDark, setIsDark, apiStatus, onSelectDemo }) {
  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-white/10 dark:border-white/10 dark:bg-[#070B14]/85 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            onClick={() => setActiveTab('scanner')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-violet-600/30 border border-cyan-500/40 group-hover:border-cyan-400 shadow-lg shadow-cyan-500/10 transition-all">
              <Shield className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-cyan-400 rounded-full animate-ping" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-cyan-400 rounded-full" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-heading font-bold text-lg tracking-tight text-white dark:text-white">
                  PhishShield<span className="text-cyan-400">.AI</span>
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-semibold tracking-wider uppercase rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                  v1.0
                </span>
              </div>
              <p className="text-[10px] text-slate-400 hidden sm:block tracking-wide">
                India Threat Intelligence & Scam Detector
              </p>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => setActiveTab('scanner')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'scanner'
                  ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 shadow-sm shadow-cyan-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Shield className="w-4 h-4" />
              Scanner
            </button>

            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 shadow-sm shadow-cyan-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              Dashboard
            </button>

            <button
              onClick={() => setActiveTab('library')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'library'
                  ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 shadow-sm shadow-cyan-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              Scam Library
            </button>

            <button
              onClick={() => setActiveTab('batch')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'batch'
                  ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 shadow-sm shadow-cyan-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Layers className="w-4 h-4" />
              Batch Scan
            </button>

            <button
              onClick={() => setActiveTab('about')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'about'
                  ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 shadow-sm shadow-cyan-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Info className="w-4 h-4" />
              About & Benchmarks
            </button>
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-2.5">
            {/* Engine Status Indicator */}
            <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{apiStatus?.hasGeminiKey ? 'Hybrid (Gemini 2.5 Flash)' : 'Engine Online (Heuristics)'}</span>
            </div>

            {/* Quick Demo Trigger */}
            <button
              onClick={() => onSelectDemo && onSelectDemo('sbi_kyc_sms')}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-500 hover:to-indigo-500 shadow-md shadow-violet-500/20 transition-all"
              title="Instantly run demo sample"
            >
              <Sparkles className="w-3.5 h-3.5 text-violet-200" />
              Demo Sample
            </button>

            {/* Theme Toggle */}
            <button
              onClick={() => setIsDark(!isDark)}
              className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 border border-white/5 transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation bar */}
      <div className="flex md:hidden border-t border-white/5 px-2 py-1.5 justify-around bg-[#070B14]/95 text-xs">
        <button
          onClick={() => setActiveTab('scanner')}
          className={`flex flex-col items-center py-1 px-2 rounded ${activeTab === 'scanner' ? 'text-cyan-400' : 'text-slate-400'}`}
        >
          <Shield className="w-4 h-4" />
          <span>Scan</span>
        </button>
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center py-1 px-2 rounded ${activeTab === 'dashboard' ? 'text-cyan-400' : 'text-slate-400'}`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Dashboard</span>
        </button>
        <button
          onClick={() => setActiveTab('library')}
          className={`flex flex-col items-center py-1 px-2 rounded ${activeTab === 'library' ? 'text-cyan-400' : 'text-slate-400'}`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Library</span>
        </button>
        <button
          onClick={() => setActiveTab('batch')}
          className={`flex flex-col items-center py-1 px-2 rounded ${activeTab === 'batch' ? 'text-cyan-400' : 'text-slate-400'}`}
        >
          <Layers className="w-4 h-4" />
          <span>Batch</span>
        </button>
        <button
          onClick={() => setActiveTab('about')}
          className={`flex flex-col items-center py-1 px-2 rounded ${activeTab === 'about' ? 'text-cyan-400' : 'text-slate-400'}`}
        >
          <Info className="w-4 h-4" />
          <span>About</span>
        </button>
      </div>
    </header>
  );
}

