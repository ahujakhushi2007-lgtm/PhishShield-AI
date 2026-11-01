import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, ShieldCheck, AlertTriangle, Search, Trash2, 
  TrendingUp, BarChart2, PieChart as PieIcon, RefreshCw, ArrowUpRight 
} from 'lucide-react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, BarChart, Bar 
} from 'recharts';
import { getScanHistory, clearScanHistory } from '../utils/storage.js';

export default function DashboardPage({ onSelectHistoryItem }) {
  const [history, setHistory] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [verdictFilter, setVerdictFilter] = useState('ALL'); // 'ALL' | 'DANGEROUS' | 'SUSPICIOUS' | 'SAFE'

  useEffect(() => {
    setHistory(getScanHistory());
  }, []);

  const handleClear = () => {
    if (window.confirm('Are you sure you want to clear your local scan history?')) {
      clearScanHistory();
      setHistory([]);
    }
  };

  // Metrics computation
  const totalScans = history.length;
  const dangerousCount = history.filter(h => h.verdict === 'DANGEROUS').length;
  const suspiciousCount = history.filter(h => h.verdict === 'SUSPICIOUS').length;
  const safeCount = history.filter(h => h.verdict === 'SAFE').length;
  const avgRiskScore = totalScans > 0 
    ? Math.round(history.reduce((acc, h) => acc + (h.riskScore || 0), 0) / totalScans) 
    : 0;

  // 1. Donut Chart Data (Verdict Distribution)
  const pieData = [
    { name: 'Dangerous', value: dangerousCount, color: '#F43F5E' },
    { name: 'Suspicious', value: suspiciousCount, color: '#F59E0B' },
    { name: 'Safe', value: safeCount, color: '#10B981' }
  ].filter(d => d.value > 0);

  // 2. Trend Line Data (Last scans chronological)
  const trendData = [...history].reverse().slice(-10).map((h, idx) => ({
    scan: `#${idx + 1}`,
    score: h.riskScore || 0,
    type: h.type
  }));

  // 3. Category Breakdown Data
  const categoryCounts = {};
  history.forEach(h => {
    const cat = h.scamType ? h.scamType.replace(/_/g, ' ') : (h.verdict === 'SAFE' ? 'Genuine / Safe' : 'Other Suspicious');
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
  });
  const barData = Object.entries(categoryCounts)
    .map(([name, count]) => ({ name: name.toUpperCase(), count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Filtered History
  const filteredHistory = history.filter(item => {
    const matchesVerdict = verdictFilter === 'ALL' || item.verdict === verdictFilter;
    const matchesSearch = !searchQuery || 
      (item.target && item.target.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.impersonating && item.impersonating.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesVerdict && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-heading text-white tracking-tight">
            Security Intelligence Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time analytics and audit trail of analyzed URLs, messages, and email threats.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setHistory(getScanHistory())}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold border border-white/10 transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </button>
          <button
            onClick={handleClear}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-semibold border border-rose-500/30 transition-all"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-white/10 bg-[#0D1424]/70">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Total Scans</span>
            <span className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <BarChart2 className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-heading text-white mt-3">
            {totalScans}
          </div>
          <div className="text-[11px] text-slate-400 mt-1 font-mono">
            Stored in browser sandbox
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-white/10 bg-[#0D1424]/70">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Threats Blocked</span>
            <span className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <ShieldAlert className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-heading text-rose-400 mt-3">
            {dangerousCount}
          </div>
          <div className="text-[11px] text-slate-400 mt-1 font-mono">
            {totalScans ? Math.round((dangerousCount / totalScans) * 100) : 0}% High-risk rate
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-white/10 bg-[#0D1424]/70">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Suspicious Flagged</span>
            <span className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <AlertTriangle className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-heading text-amber-400 mt-3">
            {suspiciousCount}
          </div>
          <div className="text-[11px] text-slate-400 mt-1 font-mono">
            Requires caution
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-white/10 bg-[#0D1424]/70">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Avg Risk Score</span>
            <span className="p-2 rounded-xl bg-violet-500/10 text-violet-400 border border-violet-500/20">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-heading text-white mt-3">
            {avgRiskScore}<span className="text-xs text-slate-400 font-normal"> / 100</span>
          </div>
          <div className="text-[11px] text-emerald-400 mt-1 font-mono">
            {safeCount} Benign verified
          </div>
        </div>
      </div>

      {/* Visual Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Donut Chart: Verdict Breakdown */}
        <div className="lg:col-span-4 glass-panel p-5 rounded-2xl border border-white/10 bg-[#0D1424]/70 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold font-heading text-white flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-cyan-400" />
              <span>Verdicts Distribution</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Ratio of Safe vs Threat outcomes</p>
          </div>

          <div className="h-52 w-full my-2">
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip
                    contentStyle={{ backgroundColor: '#0F172A', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">
                No scan data recorded yet
              </div>
            )}
          </div>

          <div className="flex items-center justify-around text-xs border-t border-white/5 pt-3">
            <span className="flex items-center gap-1.5 text-rose-400 font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              {dangerousCount} Dangerous
            </span>
            <span className="flex items-center gap-1.5 text-amber-400 font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              {suspiciousCount} Suspicious
            </span>
            <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              {safeCount} Safe
            </span>
          </div>
        </div>

        {/* Trend Area Chart: Risk Score Over Scans */}
        <div className="lg:col-span-8 glass-panel p-5 rounded-2xl border border-white/10 bg-[#0D1424]/70">
          <div>
            <h3 className="text-sm font-bold font-heading text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-violet-400" />
              <span>Risk Score Volatility (Recent Scans)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Chronological threat score severity curve</p>
          </div>

          <div className="h-56 w-full mt-4">
            {trendData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="scan" stroke="#64748B" fontSize={11} />
                  <YAxis stroke="#64748B" fontSize={11} domain={[0, 100]} />
                  <RechartsTooltip
                    contentStyle={{ backgroundColor: '#0F172A', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px' }}
                  />
                  <Area type="monotone" dataKey="score" stroke="#8B5CF6" strokeWidth={2} fillOpacity={1} fill="url(#scoreGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">
                No recent scans available
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Audit Trail & History Table */}
      <div className="glass-panel rounded-2xl border border-white/10 p-5 bg-[#0D1424]/70 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold font-heading text-white">
              Scan Audit History
            </h3>
            <p className="text-xs text-slate-400">Filter and search through local threat assessments</p>
          </div>

          {/* Search & Filter Controls */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search target, brand..."
                className="pl-8 pr-3 py-1.5 rounded-lg bg-slate-950 border border-white/10 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-white/10 text-xs">
              {['ALL', 'DANGEROUS', 'SUSPICIOUS', 'SAFE'].map(v => (
                <button
                  key={v}
                  onClick={() => setVerdictFilter(v)}
                  className={`px-2 py-0.5 rounded font-semibold text-[11px] transition-all ${
                    verdictFilter === v ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* History Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-3">Verdict</th>
                <th className="py-3 px-3">Risk Score</th>
                <th className="py-3 px-3">Type</th>
                <th className="py-3 px-3">Target Artifact</th>
                <th className="py-3 px-3">Scam Category</th>
                <th className="py-3 px-3">Engine Mode</th>
                <th className="py-3 px-3 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono">
              {filteredHistory.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400 font-sans text-xs">
                    No matching scan history records found.
                  </td>
                </tr>
              ) : (
                filteredHistory.map((item, idx) => {
                  const isDang = item.verdict === 'DANGEROUS';
                  const isSusp = item.verdict === 'SUSPICIOUS';
                  const badgeColor = isDang
                    ? 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                    : (isSusp ? 'bg-amber-500/15 text-amber-400 border-amber-500/30' : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30');

                  return (
                    <tr
                      key={item.id || idx}
                      className="hover:bg-white/5 transition-colors cursor-pointer group"
                      onClick={() => onSelectHistoryItem && onSelectHistoryItem(item)}
                    >
                      <td className="py-3 px-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-bold ${badgeColor}`}>
                          {item.verdict}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-bold">
                        <span className={isDang ? 'text-rose-400' : (isSusp ? 'text-amber-400' : 'text-emerald-400')}>
                          {item.riskScore}
                        </span>
                        <span className="text-slate-400 text-[10px]">/100</span>
                      </td>
                      <td className="py-3 px-3 uppercase text-[10px] text-slate-400">
                        {item.type}
                      </td>
                      <td className="py-3 px-3 font-sans text-slate-300 max-w-xs truncate group-hover:text-cyan-300 transition-colors">
                        {item.target}
                      </td>
                      <td className="py-3 px-3 font-sans text-slate-400">
                        {item.scamType ? item.scamType.replace(/_/g, ' ') : (item.impersonating || 'None')}
                      </td>
                      <td className="py-3 px-3 text-[10px] text-slate-400 font-sans">
                        {item.mode || 'Heuristics'}
                      </td>
                      <td className="py-3 px-3 text-right text-slate-400 text-[10px]">
                        {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

