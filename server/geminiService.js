/**
 * Gemini AI Integration Service with automatic graceful fallback to Heuristics Engine.
 * Supports text analysis and vision (screenshot OCR + threat intelligence).
 */

const GEMINI_MODEL = 'gemini-2.5-flash';

export async function analyzeTextWithGemini(text, ruleResult) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === '') {
    return {
      success: false,
      reason: 'No API key configured (operating in heuristics-only mode)'
    };
  }

  const systemInstruction = `You are PhishShield AI, an elite cybersecurity and threat intelligence model specialized in detecting phishing, scams, social engineering, impersonation, and fraud targeting Indian and international users (including UPI frauds, fake KYC, Digital Arrest, electricity discom scams, Telegram jobs, KBC lottery, customs contraband, and bank SMS).
Analyze the user-provided text. Return ONLY a strict valid JSON object (no markdown, no backticks, no wrapping text) with the following structure:
{
  "verdict": "SAFE" | "SUSPICIOUS" | "DANGEROUS",
  "risk_score": integer from 0 to 100,
  "scam_type": "digital_arrest" | "fake_kyc" | "upi_refund" | "electricity_cut" | "courier_customs" | "job_offer" | "lottery_kbc" | "phishing_social_engineering" | null,
  "impersonating": "string brand name" | null,
  "manipulation_tactics": ["string tactic 1", "string tactic 2"],
  "red_flags": ["detailed bullet 1", "detailed bullet 2"],
  "explanation": "Clear, plain-language 2-3 sentence explanation of the threat",
  "explanation_hi": "हिंदी में 2-3 वाक्यों में स्पष्ट व्याख्या",
  "recommended_actions": ["Actionable safety advice 1", "Actionable advice 2"],
  "confidence": float between 0.0 and 1.0
}`;

  const prompt = `Analyze this message/text for scams, phishing, or threats:
"""
${text}
"""

Rule-engine detected keywords:
- Preliminary Rule Score: ${ruleResult.riskScore}/100
- Detected Tactics: ${ruleResult.tactics.join(', ') || 'None'}
- Impersonated entity: ${ruleResult.impersonating || 'None'}`;

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          role: 'user',
          parts: [{ text: `${systemInstruction}\n\n${prompt}` }]
        }],
        generationConfig: {
          temperature: 0.1,
          responseMimeType: 'application/json'
        }
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      return { success: false, reason: `Gemini API returned status ${response.status}: ${errText}` };
    }

    const data = await response.json();
    const rawContent = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawContent) {
      return { success: false, reason: 'Empty candidate text from Gemini' };
    }

    const cleanJson = rawContent.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleanJson);
    return {
      success: true,
      data: parsed
    };
  } catch (err) {
    return {
      success: false,
      reason: err.message || 'Error communicating with Gemini API'
    };
  }
}

/**
 * Screenshot analysis using Gemini Vision
 */
export async function analyzeScreenshotWithGemini(fileBuffer, mimeType) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === '') {
    return {
      success: false,
      reason: 'No API key configured for Vision processing'
    };
  }

  const base64Data = fileBuffer.toString('base64');
  const prompt = `You are PhishShield AI. Inspect this screenshot of a suspected scam message, WhatsApp chat, SMS, or email.
1. Extract all visible text accurately.
2. Extract any visible URLs, phone numbers, or account names.
3. Analyze if this is a phishing, social engineering, or extortion scam (e.g. UPI fraud, Digital Arrest, fake KYC, electricity cut, fake job, courier drug notice).

Return ONLY a strict valid JSON object:
{
  "extracted_text": "all extracted text from screenshot",
  "extracted_urls": ["url1", "url2"],
  "extracted_phones": ["phone1"],
  "verdict": "SAFE" | "SUSPICIOUS" | "DANGEROUS",
  "risk_score": integer 0 to 100,
  "scam_type": "string" | null,
  "impersonating": "string" | null,
  "manipulation_tactics": ["tactic1"],
  "red_flags": ["flag1"],
  "explanation": "concise explanation",
  "explanation_hi": "हिंदी में व्याख्या",
  "recommended_actions": ["action1"]
}`;

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          role: 'user',
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType: mimeType || 'image/jpeg',
                data: base64Data
              }
            }
          ]
        }],
        generationConfig: {
          temperature: 0.1,
          responseMimeType: 'application/json'
        }
      })
    });

    if (!response.ok) {
      return { success: false, reason: `Vision API error status ${response.status}` };
    }

    const data = await response.json();
    const rawContent = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawContent) {
      return { success: false, reason: 'No output from Gemini Vision' };
    }

    const cleanJson = rawContent.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleanJson);
    return {
      success: true,
      data: parsed
    };
  } catch (err) {
    return {
      success: false,
      reason: err.message || 'Vision analysis exception'
    };
  }
}

