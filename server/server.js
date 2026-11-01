import express from 'express';
import cors from 'cors';
import multer from 'multer';
import 'dotenv/config';

import { analyzeUrl } from '../shared/urlAnalyzer.js';
import { analyzeText } from '../shared/textAnalyzer.js';
import { analyzeEmail } from '../shared/emailAnalyzer.js';
import { runBenchmark } from '../tests/runBenchmark.js';
import { DEMO_SAMPLES } from '../shared/samples.js';
import { analyzeTextWithGemini, analyzeScreenshotWithGemini } from './geminiService.js';

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// File upload configuration for screenshots
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10 MB limit
});

/**
 * Health check & runtime status
 */
app.get('/api/health', (req, res) => {
  const hasGeminiKey = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim() !== '');
  res.json({
    status: 'online',
    product: 'PhishShield AI API',
    version: '1.0.0',
    mode: hasGeminiKey ? 'Hybrid (Rules + Gemini 2.5 Flash)' : 'Heuristics-Only Engine',
    hasGeminiKey,
    timestamp: new Date().toISOString()
  });
});

/**
 * Benchmark endpoint for mentor evaluation
 */
app.get('/api/benchmark', (req, res) => {
  try {
    const stats = runBenchmark();
    res.json({
      success: true,
      data: stats
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * Sample scams for 1-click Demo Mode
 */
app.get('/api/samples', (req, res) => {
  res.json({
    success: true,
    data: DEMO_SAMPLES
  });
});

/**
 * URL Analysis Endpoint
 */
app.post('/api/analyze/url', (req, res) => {
  try {
    const { url } = req.body;
    if (!url || typeof url !== 'string') {
      return res.status(400).json({ success: false, error: 'A valid URL string is required.' });
    }

    const result = analyzeUrl(url);
    res.json({
      success: true,
      mode: 'heuristics-only',
      dualScore: {
        rule: result.riskScore,
        ai: null,
        blended: result.riskScore
      },
      data: result
    });
  } catch (err) {
    console.error('URL analysis error:', err);
    res.status(500).json({ success: false, error: 'Internal server error analyzing URL' });
  }
});

/**
 * Text / SMS / WhatsApp Message Analysis (Hybrid: Rule Engine + Gemini AI)
 */
app.post('/api/analyze/text', async (req, res) => {
  try {
    const { text, language } = req.body;
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ success: false, error: 'Text content is required for analysis.' });
    }

    // 1. Run Core Deterministic Rule Engine
    const ruleResult = analyzeText(text);

    // 2. Attempt Gemini AI Enhancement
    const geminiRes = await analyzeTextWithGemini(text, ruleResult);

    if (geminiRes.success && geminiRes.data) {
      const aiData = geminiRes.data;
      const aiScore = typeof aiData.risk_score === 'number' ? aiData.risk_score : ruleResult.riskScore;

      // Weighted blend: 40% rule-based signals + 60% Gemini semantic comprehension
      const blendedScore = Math.min(100, Math.max(0, Math.round((ruleResult.riskScore * 0.4) + (aiScore * 0.6))));

      let finalVerdict = 'SAFE';
      if (blendedScore >= 60) {
        finalVerdict = 'DANGEROUS';
      } else if (blendedScore >= 25) {
        finalVerdict = 'SUSPICIOUS';
      }

      // Merge tactics and recommendations
      const combinedTactics = Array.from(new Set([...ruleResult.tactics, ...(aiData.manipulation_tactics || [])]));
      const combinedRecommendations = Array.from(new Set([...ruleResult.recommendedActions, ...(aiData.recommended_actions || [])]));

      res.json({
        success: true,
        mode: 'hybrid',
        dualScore: {
          rule: ruleResult.riskScore,
          ai: aiScore,
          blended: blendedScore
        },
        data: {
          ...ruleResult,
          riskScore: blendedScore,
          verdict: finalVerdict,
          scamType: aiData.scam_type || ruleResult.scamType,
          impersonating: aiData.impersonating || ruleResult.impersonating,
          tactics: combinedTactics,
          explanation: aiData.explanation || ruleResult.explanation,
          explanationHi: aiData.explanation_hi || ruleResult.explanationHi,
          recommendedActions: combinedRecommendations,
          aiRedFlags: aiData.red_flags || [],
          confidence: aiData.confidence || ruleResult.confidence
        }
      });
    } else {
      // Clean fallback to deterministic heuristics engine
      res.json({
        success: true,
        mode: 'heuristics-only',
        fallbackReason: geminiRes.reason || 'Gemini unavailable',
        dualScore: {
          rule: ruleResult.riskScore,
          ai: null,
          blended: ruleResult.riskScore
        },
        data: ruleResult
      });
    }
  } catch (err) {
    console.error('Text analysis error:', err);
    res.status(500).json({ success: false, error: 'Internal server error analyzing text' });
  }
});

/**
 * Email Analysis Endpoint
 */
app.post('/api/analyze/email', (req, res) => {
  try {
    const { subject, body, headers, attachments } = req.body;
    if (!body && !subject && !headers) {
      return res.status(400).json({ success: false, error: 'Email content or headers required.' });
    }

    const emailResult = analyzeEmail({ subject, body, headers, attachments });
    res.json({
      success: true,
      mode: 'heuristics-only',
      dualScore: {
        rule: emailResult.riskScore,
        ai: null,
        blended: emailResult.riskScore
      },
      data: emailResult
    });
  } catch (err) {
    console.error('Email analysis error:', err);
    res.status(500).json({ success: false, error: 'Internal server error analyzing email' });
  }
});

/**
 * Screenshot Analysis Endpoint (Gemini Vision + Pipeline Fallback)
 */
app.post('/api/analyze/image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No image file uploaded.' });
    }

    const mimeType = req.file.mimetype;
    const fileBuffer = req.file.buffer;

    // Try Gemini Vision
    const visionRes = await analyzeScreenshotWithGemini(fileBuffer, mimeType);

    if (visionRes.success && visionRes.data) {
      const vData = visionRes.data;
      const extractedText = vData.extracted_text || '';
      
      // Run through our rule engine to generate highlights and URL findings
      const ruleResult = analyzeText(extractedText);
      const blendedScore = Math.round((ruleResult.riskScore * 0.3) + ((vData.risk_score || 80) * 0.7));

      res.json({
        success: true,
        mode: 'vision-ai',
        dualScore: {
          rule: ruleResult.riskScore,
          ai: vData.risk_score,
          blended: blendedScore
        },
        data: {
          ...ruleResult,
          extractedText,
          extractedUrls: vData.extracted_urls || [],
          riskScore: blendedScore,
          verdict: vData.verdict || (blendedScore >= 60 ? 'DANGEROUS' : 'SUSPICIOUS'),
          scamType: vData.scam_type || ruleResult.scamType,
          impersonating: vData.impersonating || ruleResult.impersonating,
          explanation: vData.explanation || ruleResult.explanation,
          explanationHi: vData.explanation_hi || ruleResult.explanationHi,
          recommendedActions: vData.recommended_actions || ruleResult.recommendedActions
        }
      });
    } else {
      // Graceful offline fallback demo for screenshot upload
      const fallbackSample = DEMO_SAMPLES[1]; // Digital arrest sample
      res.json({
        success: true,
        mode: 'heuristics-fallback',
        note: 'Gemini Vision key not provided; simulated OCR extraction from sample suspect screenshot.',
        dualScore: {
          rule: fallbackSample.ruleScore,
          ai: null,
          blended: fallbackSample.riskScore
        },
        data: {
          ...analyzeText(fallbackSample.content),
          extractedText: fallbackSample.content,
          isSimulated: true
        }
      });
    }
  } catch (err) {
    console.error('Image analysis error:', err);
    res.status(500).json({ success: false, error: 'Internal server error analyzing screenshot' });
  }
});

/**
 * Batch URL Analysis Endpoint
 */
app.post('/api/analyze/batch', (req, res) => {
  try {
    const { urls } = req.body;
    if (!Array.isArray(urls)) {
      return res.status(400).json({ success: false, error: 'Input "urls" must be an array.' });
    }

    const cleanUrls = urls.map(u => (typeof u === 'string' ? u.trim() : '')).filter(Boolean).slice(0, 30);
    const results = cleanUrls.map(u => analyzeUrl(u));

    // Sort by riskScore descending
    results.sort((a, b) => b.riskScore - a.riskScore);

    const summary = {
      total: results.length,
      dangerous: results.filter(r => r.verdict === 'DANGEROUS').length,
      suspicious: results.filter(r => r.verdict === 'SUSPICIOUS').length,
      safe: results.filter(r => r.verdict === 'SAFE').length,
      avgScore: results.length ? Math.round(results.reduce((acc, cur) => acc + cur.riskScore, 0) / results.length) : 0
    };

    res.json({
      success: true,
      summary,
      results
    });
  } catch (err) {
    console.error('Batch analysis error:', err);
    res.status(500).json({ success: false, error: 'Internal server error running batch analysis' });
  }
});

// Start Express Server
app.listen(PORT, () => {
  console.log(`\n============================================================`);
  console.log(`🛡️  PhishShield AI API Server running on http://localhost:${PORT}`);
  console.log(`📡 Mode: ${process.env.GEMINI_API_KEY ? 'HYBRID (Gemini Flash + Rule Engine)' : 'HEURISTICS-ONLY ENGINE'}`);
  console.log(`============================================================\n`);
});
