/**
 * PhishShield AI Threat Report Exporter
 * Generates an executive cybersecurity incident report (HTML/Printable PDF) and shareable markdown snippets.
 */

export function generateHtmlReport(result, inputType = 'text') {
  const dateStr = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
  const verdictColor = result.verdict === 'DANGEROUS' ? '#F43F5E' : (result.verdict === 'SUSPICIOUS' ? '#F59E0B' : '#10B981');
  const verdictBg = result.verdict === 'DANGEROUS' ? 'rgba(244,63,94,0.1)' : (result.verdict === 'SUSPICIOUS' ? 'rgba(245,158,11,0.1)' : 'rgba(16,185,129,0.1)');

  const findingsHtml = (result.findings || []).map(f => `
    <div style="border-left: 3px solid ${f.severity === 'critical' ? '#F43F5E' : '#F59E0B'}; padding: 10px 14px; margin-bottom: 10px; background: #0D1424; border-radius: 4px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
        <strong style="color: #F8FAFC; font-size: 14px;">${f.title}</strong>
        <span style="font-size: 11px; font-weight: 600; text-transform: uppercase; color: ${f.severity === 'critical' ? '#F43F5E' : '#F59E0B'}; background: rgba(255,255,255,0.05); padding: 2px 6px; border-radius: 3px;">
          ${f.severity || 'HIGH'} (+${f.score} pts)
        </span>
      </div>
      <p style="margin: 0; color: #94A3B8; font-size: 13px; line-height: 1.4;">${f.description}</p>
    </div>
  `).join('') || '<p style="color: #10B981;">No adverse threats or high-risk findings detected.</p>';

  const actionsHtml = (result.recommendedActions || []).map(a => `
    <li style="margin-bottom: 8px; color: #E2E8F0; font-size: 13px;">${a}</li>
  `).join('');

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>PhishShield AI — Threat Incident Report</title>
  <style>
    @media print {
      body { background: #FFFFFF !important; color: #0F172A !important; }
      .no-print { display: none !important; }
      .container { max-width: 100% !important; border: none !important; box-shadow: none !important; }
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background: #070B14;
      color: #F8FAFC;
      margin: 0;
      padding: 30px;
      line-height: 1.5;
    }
    .container {
      max-width: 800px;
      margin: 0 auto;
      background: #0D1424;
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 12px;
      padding: 32px;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid rgba(255,255,255,0.1);
      padding-bottom: 20px;
      margin-bottom: 24px;
    }
    .badge {
      display: inline-block;
      padding: 6px 16px;
      border-radius: 9999px;
      font-weight: 700;
      font-size: 14px;
      letter-spacing: 0.05em;
    }
    .score-circle {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 72px;
      height: 72px;
      border-radius: 50%;
      border: 4px solid ${verdictColor};
      font-size: 24px;
      font-weight: 800;
      color: ${verdictColor};
    }
    .section-title {
      font-size: 15px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #22D3EE;
      margin-top: 24px;
      margin-bottom: 12px;
    }
    .input-box {
      background: #070B14;
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 8px;
      padding: 14px;
      font-family: monospace;
      font-size: 13px;
      color: #CBD5E1;
      white-space: pre-wrap;
      word-break: break-all;
    }
    .btn {
      background: #22D3EE;
      color: #070B14;
      border: none;
      padding: 10px 20px;
      border-radius: 6px;
      font-weight: 600;
      cursor: pointer;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div>
        <h1 style="margin: 0; font-size: 22px; display: flex; align-items: center; gap: 8px;">
          🛡️ PhishShield AI Threat Assessment
        </h1>
        <p style="margin: 4px 0 0 0; color: #94A3B8; font-size: 12px;">Generated on ${dateStr} • Analysis Engine v1.0</p>
      </div>
      <div class="no-print">
        <button class="btn" onclick="window.print()">Print / Save as PDF</button>
      </div>
    </div>

    <!-- Summary Banner -->
    <div style="display: flex; align-items: center; justify-content: space-between; background: ${verdictBg}; border: 1px solid ${verdictColor}44; border-radius: 8px; padding: 18px 24px; margin-bottom: 24px;">
      <div>
        <span class="badge" style="background: ${verdictBg}; color: ${verdictColor}; border: 1px solid ${verdictColor};">
          VERDICT: ${result.verdict}
        </span>
        <p style="margin: 8px 0 0 0; color: #E2E8F0; font-size: 14px; max-width: 540px;">
          ${result.explanation || 'Detailed threat evaluation conducted.'}
        </p>
      </div>
      <div style="text-align: center;">
        <div class="score-circle">${result.riskScore}</div>
        <div style="font-size: 11px; color: #94A3B8; margin-top: 4px; font-weight: 600;">RISK SCORE</div>
      </div>
    </div>

    <!-- Target Evaluated -->
    <div class="section-title">Investigated Artifact</div>
    <div class="input-box">${result.url || result.originalInput || result.text || 'Email / message artifact analyzed.'}</div>

    <!-- Key Findings -->
    <div class="section-title">Forensic Evidence & Red Flags (${result.findings?.length || 0})</div>
    ${findingsHtml}

    <!-- Recommended Next Steps -->
    <div class="section-title">Emergency Response & Mitigation Advisory</div>
    <ul style="padding-left: 20px; margin: 0;">
      ${actionsHtml}
    </ul>

    <div style="margin-top: 30px; padding-top: 15px; border-top: 1px solid rgba(255,255,255,0.08); font-size: 11px; color: #64748B; text-align: center;">
      PhishShield AI Decision-Support System • Incident Helpline: 1930 • Portal: cybercrime.gov.in • Report fake senders: sancharsaathi.gov.in
    </div>
  </div>
</body>
</html>
  `;
}

export function openPrintableReport(result, inputType) {
  const html = generateHtmlReport(result, inputType);
  const win = window.open('', '_blank');
  if (win) {
    win.document.write(html);
    win.document.close();
  }
}

export function copyShareableSummary(result) {
  const lines = [
    `🛡️ PhishShield AI Threat Report`,
    `Verdict: ${result.verdict} | Risk Score: ${result.riskScore}/100`,
    `Impersonation: ${result.impersonating || 'None detected'}`,
    `Primary Scam Pattern: ${result.scamType || 'None'}`,
    `Summary: ${result.explanation || 'No threats detected.'}`,
    `Emergency: Call 1930 (National Cyber Crime) or visit cybercrime.gov.in`,
    `Analyzed via PhishShield AI (http://localhost:5173)`
  ];
  return lines.join('\n');
}

