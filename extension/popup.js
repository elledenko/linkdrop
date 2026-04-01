// LinkDrop Chrome Extension - Popup
const APP_URL = "https://linkdrop-inky.vercel.app";

async function init() {
  const content = document.getElementById("content");

  // Get the current tab
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  if (!tab || !tab.url) {
    content.innerHTML = '<div class="status error">Cannot read this page</div>';
    return;
  }

  // Check if we have a stored session
  const stored = await chrome.storage.local.get(["linkdrop_session"]);

  if (!stored.linkdrop_session) {
    content.innerHTML = `
      <div class="login-prompt">
        <p style="margin-bottom: 12px; color: #7A6B5D; font-size: 13px;">
          Log in to LinkDrop to start saving links
        </p>
        <a href="${APP_URL}/login" target="_blank">Log in →</a>
        <p style="margin-top: 16px; font-size: 11px; color: #7A6B5D;">
          After logging in, come back here and click the extension again.
        </p>
      </div>
    `;
    return;
  }

  // Show save UI
  const pageTitle = tab.title || "Untitled";
  const pageUrl = tab.url;

  content.innerHTML = `
    <div class="page-title">${escapeHtml(pageTitle)}</div>
    <div class="page-url">${escapeHtml(pageUrl)}</div>
    <div class="note-label">Your take (optional)</div>
    <textarea id="note" rows="3" placeholder="What's interesting about this?"></textarea>
    <button id="saveBtn">Save to Today's Drop</button>
    <div id="status" class="status" style="display:none;"></div>
  `;

  document.getElementById("saveBtn").addEventListener("click", async () => {
    const btn = document.getElementById("saveBtn");
    const status = document.getElementById("status");
    const note = document.getElementById("note").value.trim();

    btn.disabled = true;
    btn.textContent = "Saving...";

    try {
      const response = await fetch(`${APP_URL}/api/links`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${stored.linkdrop_session}`,
        },
        body: JSON.stringify({
          url: pageUrl,
          user_note: note || null,
          date: new Date().toISOString().split("T")[0],
        }),
      });

      if (response.ok) {
        status.style.display = "block";
        status.className = "status success";
        status.textContent = "✓ Saved! Summarizing in background...";
        btn.textContent = "Saved!";
        setTimeout(() => window.close(), 1500);
      } else {
        throw new Error("Failed to save");
      }
    } catch (err) {
      status.style.display = "block";
      status.className = "status error";
      status.textContent = "Failed to save. Try logging in again.";
      btn.disabled = false;
      btn.textContent = "Try Again";
      // Clear session on auth failure
      await chrome.storage.local.remove(["linkdrop_session"]);
    }
  });
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

init();
