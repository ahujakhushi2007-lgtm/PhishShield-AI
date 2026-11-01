import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import ScannerPage from './pages/ScannerPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import ScamLibraryPage from './pages/ScamLibraryPage.jsx';
import BatchScannerPage from './pages/BatchScannerPage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import { DEMO_SAMPLES, getDemoSampleById } from '@shared/samples.js';

export default function App() {
  const [activeTab, setActiveTab] = useState('scanner');
  const [isDark, setIsDark] = useState(true);
  const [apiStatus, setApiStatus] = useState({ hasGeminiKey: false, status: 'loading' });
  const [selectedDemoSample, setSelectedDemoSample] = useState(null);

  // Sync theme with HTML root class
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
  }, [isDark]);

  // Check backend API health on startup
  useEffect(() => {
    async function checkHealth() {
      try {
        const res = await fetch('/api/health');
        if (res.ok) {
          const data = await res.json();
          setApiStatus(data);
        } else {
          setApiStatus({ hasGeminiKey: false, status: 'offline' });
        }
      } catch (err) {
        setApiStatus({ hasGeminiKey: false, status: 'offline' });
      }
    }
    checkHealth();
  }, []);

  // Quick Demo Trigger
  const handleSelectDemo = (sampleId = 'sbi_kyc_sms') => {
    const sample = getDemoSampleById(sampleId);
    setSelectedDemoSample(sample);
    setActiveTab('scanner');
  };

  const handleTestInScanner = (snippet) => {
    const mockSample = {
      id: `custom-${Date.now()}`,
      title: 'Scam Library Sample',
      tag: 'Scam Payload',
      type: 'text',
      inputType: 'message',
      content: snippet,
      riskScore: 90,
      ruleScore: 90,
      aiScore: null,
      verdict: 'DANGEROUS',
      explanation: 'High-confidence social engineering or financial coercion attack detected.',
      explanationHi: 'अत्यंत खतरनाक संदेश! इसमें जल्दबाजी में पैसे ट्रांसफर करने या बैंक विवरण चुराने का दबाव है।',
      recommendedActions: [
        'Do not reply, send money, or click any links in this message.',
        'Report this immediately to the National Cybercrime Helpline 1930.'
      ]
    };
    setSelectedDemoSample(mockSample);
    setActiveTab('scanner');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#070B14] bg-grid-pattern bg-mesh selection:bg-cyan-500/20 selection:text-cyan-300">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isDark={isDark}
        setIsDark={setIsDark}
        apiStatus={apiStatus}
        onSelectDemo={handleSelectDemo}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'scanner' && (
          <ScannerPage
            demoSample={selectedDemoSample}
            onClearDemoSample={() => setSelectedDemoSample(null)}
          />
        )}

        {activeTab === 'dashboard' && (
          <DashboardPage
            onSelectHistoryItem={(item) => {
              // Open in scanner
              handleSelectDemo('sbi_kyc_sms');
            }}
          />
        )}

        {activeTab === 'library' && (
          <ScamLibraryPage
            onTestInScanner={handleTestInScanner}
          />
        )}

        {activeTab === 'batch' && (
          <BatchScannerPage />
        )}

        {activeTab === 'about' && (
          <AboutPage />
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

