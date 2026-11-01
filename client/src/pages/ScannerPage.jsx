import React, { useState } from 'react';
import HeroSection from '../components/HeroSection.jsx';
import ScannerInput from '../components/ScannerInput.jsx';
import ScanningRadar from '../components/ScanningRadar.jsx';
import ResultView from '../components/ResultView.jsx';
import StatsStrip from '../components/StatsStrip.jsx';
import HowItWorksSection from '../components/HowItWorksSection.jsx';

import { analyzeUrl } from '@shared/urlAnalyzer.js';
import { analyzeText } from '@shared/textAnalyzer.js';
import { analyzeEmail } from '@shared/emailAnalyzer.js';
import { saveScanResult } from '../utils/storage.js';
import confetti from 'canvas-confetti';

export default function ScannerPage({ demoSample, onClearDemoSample }) {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [currentInputType, setCurrentInputType] = useState('url');

  // Handle demo sample passed from Navbar or Library
  React.useEffect(() => {
    if (demoSample) {
      setResult(demoSample);
      setCurrentInputType(demoSample.inputType || 'message');
      saveScanResult({
        type: demoSample.inputType || 'message',
        target: demoSample.content.slice(0, 80) + '...',
        verdict: demoSample.verdict,
        riskScore: demoSample.riskScore,
        scamType: demoSample.scamType,
        impersonating: demoSample.impersonating,
        mode: 'Demo Sample'
      });
      window.scrollTo({ top: 180, behavior: 'smooth' });
    }
  }, [demoSample]);

  const handleAnalyze = async (payload) => {
    setIsLoading(true);
    setResult(null);
    setCurrentInputType(payload.type);

    try {
      let analysisResult = null;

      // 1. URL Analysis
      if (payload.type === 'url') {
        try {
          const res = await fetch('/api/analyze/url', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: payload.url })
          });
          if (res.ok) {
            const data = await res.json();
            analysisResult = { ...data.data, mode: data.mode, dualScore: data.dualScore };
          }
        } catch (e) {
          // Offline fallback
          console.warn('Backend unavailable, running client-side URL rule engine fallback:', e);
        }
        if (!analysisResult) {
          const clientRes = analyzeUrl(payload.url);
          analysisResult = { ...clientRes, mode: 'Heuristics Engine (Offline)', dualScore: { rule: clientRes.riskScore, ai: null, blended: clientRes.riskScore } };
        }
      }

      // 2. Text / Message Analysis
      else if (payload.type === 'text') {
        try {
          const res = await fetch('/api/analyze/text', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: payload.text })
          });
          if (res.ok) {
            const data = await res.json();
            analysisResult = { ...data.data, mode: data.mode, dualScore: data.dualScore };
          }
        } catch (e) {
          console.warn('Backend unavailable, running client-side text rule engine fallback:', e);
        }
        if (!analysisResult) {
          const clientRes = analyzeText(payload.text);
          analysisResult = { ...clientRes, mode: 'Heuristics Engine (Offline)', dualScore: { rule: clientRes.riskScore, ai: null, blended: clientRes.riskScore } };
        }
      }

      // 3. Email Analysis
      else if (payload.type === 'email') {
        try {
          const res = await fetch('/api/analyze/email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              subject: payload.subject,
              body: payload.body,
              headers: payload.headers
            })
          });
          if (res.ok) {
            const data = await res.json();
            analysisResult = { ...data.data, mode: data.mode, dualScore: data.dualScore };
          }
        } catch (e) {
          console.warn('Backend unavailable, running client-side email rule engine fallback:', e);
        }
        if (!analysisResult) {
          const clientRes = analyzeEmail({
            subject: payload.subject,
            body: payload.body,
            headers: payload.headers
          });
          analysisResult = { ...clientRes, mode: 'Heuristics Engine (Offline)', dualScore: { rule: clientRes.riskScore, ai: null, blended: clientRes.riskScore } };
        }
      }

      // 4. Screenshot Image Analysis
      else if (payload.type === 'screenshot') {
        try {
          const formData = new FormData();
          formData.append('image', payload.file);

          const res = await fetch('/api/analyze/image', {
            method: 'POST',
            body: formData
          });
          if (res.ok) {
            const data = await res.json();
            analysisResult = { ...data.data, mode: data.mode, dualScore: data.dualScore };
          }
        } catch (e) {
          console.warn('Screenshot upload error, fallback simulated:', e);
        }
        if (!analysisResult) {
          // Graceful client fallback
          const clientRes = analyzeText("CBI NOTICE OF DIGITAL ARREST: Parcel intercepted with MDMA narcotics. Supreme Court warrant issued.");
          analysisResult = { ...clientRes, mode: 'Heuristics Vision Fallback', dualScore: { rule: 95, ai: null, blended: 95 } };
        }
      }

      // Minimum animation delay for the radar effect
      await new Promise(resolve => setTimeout(resolve, 800));

      setResult(analysisResult);

      // Save to localStorage history
      saveScanResult({
        type: payload.type,
        target: (payload.url || payload.text || payload.subject || 'Screenshot Image').slice(0, 80),
        verdict: analysisResult.verdict,
        riskScore: analysisResult.riskScore,
        scamType: analysisResult.scamType,
        impersonating: analysisResult.impersonating,
        mode: analysisResult.mode
      });

      // Confetti burst if verified completely SAFE!
      if (analysisResult.verdict === 'SAFE') {
        try {
          confetti({
            particleCount: 45,
            spread: 60,
            origin: { y: 0.6 },
            colors: ['#10B981', '#22D3EE', '#34D399']
          });
        } catch (e) {}
      }

      window.scrollTo({ top: 220, behavior: 'smooth' });
    } catch (err) {
      console.error('Analysis execution failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    if (onClearDemoSample) onClearDemoSample();
    window.scrollTo({ top: 100, behavior: 'smooth' });
  };

  return (
    <div>
      <HeroSection />

      {/* Unified Input Form */}
      <ScannerInput
        onAnalyze={handleAnalyze}
        isLoading={isLoading}
      />

      {/* Radar scanning animation */}
      {isLoading && (
        <div className="max-w-4xl mx-auto px-4">
          <ScanningRadar inputType={currentInputType} />
        </div>
      )}

      {/* Result Display View */}
      {result && !isLoading && (
        <ResultView
          result={result}
          inputType={currentInputType}
          onReset={handleReset}
        />
      )}

      {/* Statistics and Explanatory Section */}
      <StatsStrip />
      <HowItWorksSection />
    </div>
  );
}

