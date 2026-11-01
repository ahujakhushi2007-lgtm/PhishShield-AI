/**
 * PhishShield AI Browser Extension Background Service Worker (Manifest V3)
 * Registers right-click context menus to analyze selected text or links.
 */

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "phishshield_scan_link",
    title: "🛡️ Inspect Link with PhishShield AI",
    contexts: ["link"]
  });

  chrome.contextMenus.create({
    id: "phishshield_scan_selection",
    title: "🛡️ Analyze Text for Scams with PhishShield AI",
    contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  let targetUrl = "http://localhost:5001/api/analyze/url";
  let payload = {};

  if (info.menuItemId === "phishshield_scan_link" && info.linkUrl) {
    payload = { url: info.linkUrl };
  } else if (info.menuItemId === "phishshield_scan_selection" && info.selectionText) {
    targetUrl = "http://localhost:5001/api/analyze/text";
    payload = { text: info.selectionText };
  } else {
    return;
  }

  try {
    const res = await fetch(targetUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      const result = await res.json();
      await chrome.storage.local.set({ latestScan: result });
      chrome.action.openPopup?.();
    }
  } catch (err) {
    console.error("PhishShield scan error:", err);
  }
});
