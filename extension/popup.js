document.addEventListener("DOMContentLoaded", async () => {
  const scanInput = document.getElementById("scanInput");
  const scanBtn = document.getElementById("scanBtn");
  const resultBox = document.getElementById("resultBox");
  const verdictBadge = document.getElementById("verdictBadge");
  const scoreDisplay = document.getElementById("scoreDisplay");
  const explanationText = document.getElementById("explanationText");

  // Load latest scan if available
  if (chrome.storage?.local) {
    const data = await chrome.storage.local.get("latestScan");
    if (data.latestScan?.data) {
      renderResult(data.latestScan.data);
    }
  }

  scanBtn.addEventListener("click", async () => {
    const text = scanInput.value.trim();
    if (!text) return;

    scanBtn.disabled = true;
    scanBtn.textContent = "Scanning...";

    const isUrl = /^https?:\/\//i.test(text) || (!text.includes(" ") && text.includes("."));
    const endpoint = isUrl ? "http://localhost:5001/api/analyze/url" : "http://localhost:5001/api/analyze/text";
    const body = isUrl ? { url: text } : { text };

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      const json = await res.json();
      if (json.data) {
        renderResult(json.data);
      }
    } catch (e) {
      alert("Could not connect to PhishShield API on http://localhost:5001. Ensure backend is running!");
    } finally {
      scanBtn.disabled = false;
      scanBtn.textContent = "Quick Scan";
    }
  });

  function renderResult(data) {
    resultBox.style.display = "block";
    verdictBadge.className = `badge ${data.verdict}`;
    verdictBadge.textContent = data.verdict;
    scoreDisplay.textContent = `${data.riskScore}/100`;
    scoreDisplay.style.color = data.verdict === 'DANGEROUS' ? '#F43F5E' : (data.verdict === 'SUSPICIOUS' ? '#F59E0B' : '#10B981');
    explanationText.textContent = data.explanation || "Scan completed.";
  }
});
