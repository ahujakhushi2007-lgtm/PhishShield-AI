import React, { useState } from 'react';
import { Link, MessageSquare, Mail, Image, Sparkles, Send, Trash2, Upload, AlertCircle } from 'lucide-react';
import { DEMO_SAMPLES } from '@shared/samples.js';

export default function ScannerInput({ onAnalyze, isLoading, prefilledInput, prefilledType }) {
  const [activeTab, setActiveTab] = useState(prefilledType || 'url'); // 'url' | 'message' | 'email' | 'screenshot'
  const [inputText, setInputText] = useState(prefilledInput || '');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailHeaders, setEmailHeaders] = useState('');
  const [showHeaders, setShowHeaders] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  // Sync if prefilled changes from external trigger
  React.useEffect(() => {
    if (prefilledInput !== undefined && prefilledInput !== null) {
      setInputText(prefilledInput);
    }
    if (prefilledType) {
      setActiveTab(prefilledType);
    }
  }, [prefilledInput, prefilledType]);

  const handleSelectSample = (sample) => {
    if (sample.type === 'email') {
      setActiveTab('email');
      setInputText(sample.content);
    } else if (sample.inputType === 'url') {
      setActiveTab('url');
      setInputText(sample.content);
    } else {
      setActiveTab('message');
      setInputText(sample.content);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLoading) return;

    if (activeTab === 'screenshot') {
      if (!selectedFile) return;
      onAnalyze({
        type: 'screenshot',
        file: selectedFile
      });
      return;
    }

    if (!inputText.trim()) return;

    if (activeTab === 'url') {
      onAnalyze({
        type: 'url',
        url: inputText.trim()
      });
    } else if (activeTab === 'message') {
      onAnalyze({
        type: 'text',
        text: inputText.trim()
      });
    } else if (activeTab === 'email') {
      onAnalyze({
        type: 'email',
        subject: emailSubject,
        body: inputText.trim(),
        headers: emailHeaders
      });
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-6 px-4">
      {/* Sample Scam Chips */}
      <div className="mb-4">
        <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-2 font-medium">
          <Sparkles className="w-3.5 h-3.5 text-violet-400" />
          <span>Try a realistic sample threat (1-click test):</span>
        </div>
        <div className="flex flex-wrap gap-2 overflow-x-auto pb-1">
          {DEMO_SAMPLES.map((sample) => (
            <button
              key={sample.id}
              type="button"
              onClick={() => handleSelectSample(sample)}
              className="text-xs px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-500/40 text-slate-300 hover:text-white transition-all whitespace-nowrap flex items-center gap-1.5 group"
            >
              <span className={`w-1.5 h-1.5 rounded-full ${
                sample.verdict === 'DANGEROUS' ? 'bg-rose-500' : (sample.verdict === 'SUSPICIOUS' ? 'bg-amber-400' : 'bg-emerald-400')
              }`} />
              <span>{sample.tag}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Glass Input Card */}
      <div className="glass-panel rounded-2xl border border-white/10 shadow-2xl p-4 sm:p-6 bg-[#0D1424]/80 backdrop-blur-xl transition-all">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-slate-950/70 border border-white/5 mb-5">
          <button
            type="button"
            onClick={() => setActiveTab('url')}
            className={`flex-1 min-w-[100px] flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'url'
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <Link className="w-4 h-4" />
            <span>URL / Link</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('message')}
            className={`flex-1 min-w-[100px] flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'message'
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>SMS / Message</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('email')}
            className={`flex-1 min-w-[100px] flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'email'
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>Email</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('screenshot')}
            className={`flex-1 min-w-[100px] flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'screenshot'
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <Image className="w-4 h-4" />
            <span>Screenshot</span>
          </button>
        </div>

        {/* Dynamic Form Area */}
        <form onSubmit={handleSubmit}>
          {activeTab === 'url' && (
            <div className="space-y-3">
              <div className="relative">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Paste suspicious website, link, or short-URL (e.g., http://onlinesbi-kyc.top)..."
                  className="w-full px-4 py-3.5 pr-10 rounded-xl bg-slate-950/80 border border-white/10 text-slate-100 placeholder-slate-500 font-mono text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                  disabled={isLoading}
                />
                {inputText && (
                  <button
                    type="button"
                    onClick={() => setInputText('')}
                    className="absolute right-3 top-3.5 text-slate-500 hover:text-slate-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
              <p className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-cyan-400" />
                Evaluates Levenshtein typosquatting against 40+ brands, punycode, IP hosts, and deceptive subdomains.
              </p>
            </div>
          )}

          {activeTab === 'message' && (
            <div className="space-y-3">
              <div className="relative">
                <textarea
                  rows={4}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Paste WhatsApp message, SMS, Hinglish/Hindi power bill warning, or Digital Arrest threat..."
                  className="w-full p-4 rounded-xl bg-slate-950/80 border border-white/10 text-slate-100 placeholder-slate-500 font-sans text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all resize-y"
                  disabled={isLoading}
                />
                {inputText && (
                  <button
                    type="button"
                    onClick={() => setInputText('')}
                    className="absolute right-3 top-3 text-slate-500 hover:text-slate-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>Understands English, Hinglish, and Devanagari Hindi threat cues.</span>
                <span>{inputText.length} characters</span>
              </div>
            </div>
          )}

          {activeTab === 'email' && (
            <div className="space-y-3">
              <input
                type="text"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                placeholder="Email Subject (optional)"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-white/10 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 transition-all"
              />

              <div className="relative">
                <textarea
                  rows={4}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Paste email body text or HTML content here..."
                  className="w-full p-4 rounded-xl bg-slate-950/80 border border-white/10 text-slate-100 placeholder-slate-500 font-sans text-sm focus:outline-none focus:border-cyan-400 transition-all resize-y"
                  disabled={isLoading}
                />
              </div>

              {/* Optional Header Disclosure */}
              <div>
                <button
                  type="button"
                  onClick={() => setShowHeaders(!showHeaders)}
                  className="text-xs text-cyan-400 hover:text-cyan-300 font-medium underline flex items-center gap-1"
                >
                  {showHeaders ? '− Hide Raw Email Headers' : '+ Paste Raw Email Headers (From, SPF, Return-Path)'}
                </button>
                {showHeaders && (
                  <textarea
                    rows={3}
                    value={emailHeaders}
                    onChange={(e) => setEmailHeaders(e.target.value)}
                    placeholder="Paste email headers (e.g. From:..., Reply-To:..., Authentication-Results:...)"
                    className="mt-2 w-full p-3 rounded-lg bg-slate-950 border border-white/10 font-mono text-xs text-slate-300 focus:outline-none focus:border-cyan-400"
                  />
                )}
              </div>
            </div>
          )}

          {activeTab === 'screenshot' && (
            <div className="space-y-4">
              <div className="border-2 border-dashed border-cyan-500/30 hover:border-cyan-400/60 rounded-xl p-6 text-center transition-all bg-slate-950/40">
                {previewUrl ? (
                  <div className="space-y-3">
                    <img
                      src={previewUrl}
                      alt="Uploaded Scam Screenshot"
                      className="max-h-56 mx-auto rounded-lg border border-white/10 object-contain shadow-md"
                    />
                    <div className="flex items-center justify-center gap-3">
                      <span className="text-xs text-slate-300">{selectedFile?.name}</span>
                      <button
                        type="button"
                        onClick={() => { setSelectedFile(null); setPreviewUrl(null); }}
                        className="text-xs text-rose-400 hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <Upload className="w-10 h-10 text-cyan-400 mx-auto mb-2 opacity-80" />
                    <p className="text-sm font-semibold text-slate-200">
                      Upload or drag & drop a suspect screenshot
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      WhatsApp chat screenshot, SMS inbox, or scam notice (PNG, JPG, WEBP)
                    </p>
                    <label className="mt-4 inline-block px-4 py-2 rounded-lg bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 border border-cyan-500/40 text-xs font-semibold cursor-pointer transition-all">
                      Browse File
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Action Button Strip */}
          <div className="mt-5 flex items-center justify-end">
            <button
              type="submit"
              disabled={isLoading || (activeTab === 'screenshot' ? !selectedFile : !inputText.trim())}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-400 hover:to-violet-500 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/25 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-cyan-500/40 transition-all hover:scale-[1.01]"
            >
              <Send className="w-4 h-4 text-slate-950" />
              <span>{isLoading ? 'Analyzing Threat...' : 'Analyze Threat'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

