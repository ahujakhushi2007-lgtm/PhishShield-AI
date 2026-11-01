import React, { useState } from 'react';
import { HIGHLIGHT_CATEGORIES } from '@shared/scamPatterns.js';
import { AlertCircle, Info } from 'lucide-react';

export default function TextHighlighter({ text, highlights = [] }) {
  const [activeTooltip, setActiveTooltip] = useState(null);

  if (!text) return null;

  // If no highlights, render plain text safely
  if (!highlights || highlights.length === 0) {
    return (
      <div className="p-4 rounded-xl bg-slate-950/60 border border-white/5 font-sans text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
        {text}
      </div>
    );
  }

  // Segment the text into plain segments and highlighted segments based on offsets
  const segments = [];
  let lastIndex = 0;

  // Filter and sort highlights
  const sortedHighlights = [...highlights].sort((a, b) => a.start - b.start);

  for (let i = 0; i < sortedHighlights.length; i++) {
    const hl = sortedHighlights[i];
    if (hl.start < lastIndex) continue; // Skip overlaps

    // Text prior to this highlight
    if (hl.start > lastIndex) {
      segments.push({
        isHighlight: false,
        text: text.slice(lastIndex, hl.start)
      });
    }

    // The highlighted text
    segments.push({
      isHighlight: true,
      data: hl,
      text: text.slice(hl.start, hl.end)
    });

    lastIndex = hl.end;
  }

  // Trailing text after the last highlight
  if (lastIndex < text.length) {
    segments.push({
      isHighlight: false,
      text: text.slice(lastIndex)
    });
  }

  return (
    <div className="space-y-3">
      <div className="relative p-5 rounded-xl bg-[#050811] border border-white/10 font-sans text-sm text-slate-200 leading-relaxed whitespace-pre-wrap select-text">
        {segments.map((seg, idx) => {
          if (!seg.isHighlight) {
            return <span key={idx}>{seg.text}</span>;
          }

          const hl = seg.data;
          const config = HIGHLIGHT_CATEGORIES[hl.category] || {
            color: '#F59E0B',
            bg: 'rgba(245, 158, 11, 0.15)',
            border: 'rgba(245, 158, 11, 0.4)',
            label: 'Suspicious Phrase'
          };

          return (
            <span
              key={idx}
              className="relative inline cursor-pointer font-medium rounded px-1 py-0.5 transition-all group"
              style={{
                backgroundColor: config.bg,
                borderBottom: `2px solid ${config.color}`,
              }}
              onMouseEnter={() => setActiveTooltip(idx)}
              onMouseLeave={() => setActiveTooltip(null)}
            >
              {seg.text}

              {/* Tooltip Popup on Hover */}
              {activeTooltip === idx && (
                <span className="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-72 p-3 rounded-xl bg-slate-900/95 border border-cyan-500/30 text-white text-xs shadow-2xl backdrop-blur-md pointer-events-none transition-opacity animate-in fade-in zoom-in-95">
                  <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[10px] mb-1" style={{ color: config.color }}>
                    <AlertCircle className="w-3.5 h-3.5" />
                    {config.label}
                  </span>
                  <span className="block text-slate-300 text-xs leading-normal">
                    {hl.explanation}
                  </span>
                  <span className="block mt-1.5 text-[10px] text-slate-400 font-mono">
                    Severity: <strong className="text-slate-200 uppercase">{hl.severity}</strong>
                  </span>
                </span>
              )}
            </span>
          );
        })}
      </div>

      {/* Highlighter Color Legend */}
      <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 px-1">
        <span className="font-semibold text-slate-300">Highlight Legend:</span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#F43F5E]" />
          Threat / Impersonation
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#EC4899]" />
          Credential / PIN Trap
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
          Urgency
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#22D3EE]" />
          Suspicious Link
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#8B5CF6]" />
          Social Engineering
        </span>
      </div>
    </div>
  );
}

