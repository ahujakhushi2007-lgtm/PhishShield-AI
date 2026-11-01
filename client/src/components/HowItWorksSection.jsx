import React from 'react';
import { Search, BrainCircuit, ShieldCheck, ArrowRight } from 'lucide-react';

export default function HowItWorksSection() {
  const steps = [
    {
      step: '01',
      title: 'Feed Suspect Artifact',
      description: 'Paste any suspicious URL, raw email, Hinglish/Hindi SMS, or upload a WhatsApp screenshot directly into the unified scanner.',
      icon: <Search className="w-5 h-5 text-cyan-400" />
    },
    {
      step: '02',
      title: 'Dual-Layer Triangulation',
      description: 'The deterministic rule engine checks brand typosquatting, punycode, and urgent threats in 15ms; Gemini 2.5 Flash analyzes linguistic deception.',
      icon: <BrainCircuit className="w-5 h-5 text-violet-400" />
    },
    {
      step: '03',
      title: 'Explainable Defense & Advisory',
      description: 'Receive an animated risk score, in-text forensic highlights, plain-language Hindi/English explanation, and one-click 1930 reporting.',
      icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />
    }
  ];

  return (
    <div className="max-w-5xl mx-auto my-16 px-4">
      <div className="text-center mb-10">
        <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-white">
          How PhishShield AI Works
        </h2>
        <p className="text-slate-400 text-sm mt-2 max-w-xl mx-auto">
          Combining sub-millisecond deterministic heuristics with state-of-the-art multimodal generative AI.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
        {steps.map((s, idx) => (
          <div
            key={idx}
            className="glass-panel p-6 rounded-2xl border border-white/10 hover:border-cyan-500/30 transition-all relative group bg-[#0D1424]/70"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-cyan-500/40 transition-all">
                {s.icon}
              </div>
              <span className="text-2xl font-black font-heading text-slate-800 group-hover:text-cyan-500/20 transition-all">
                {s.step}
              </span>
            </div>

            <h3 className="text-base font-bold font-heading text-white mb-2">
              {s.title}
            </h3>

            <p className="text-xs text-slate-300 leading-relaxed">
              {s.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

