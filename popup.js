// popup.js
function showStatus(message, type = 'success') {
  const statusDiv = document.getElementById('status');
  statusDiv.textContent = message;
  statusDiv.className = `status ${type}`;
  setTimeout(() => {
    statusDiv.textContent = '';
    statusDiv.className = '';
  }, 3000);
}

// Load existing data when popup opens
chrome.storage.sync.get(["formData"], ({ formData }) => {
  if (!formData) return;
  
  for (const key in formData) {
    const element = document.getElementById(key);
    if (element) {
      element.value = formData[key];
    }
  }
});

// Save data
document.getElementById("save").addEventListener("click", () => {
  const formData = {};
  
  // Get all input and select elements
  const inputs = document.querySelectorAll('input, select');
  inputs.forEach(input => {
    if (input.id && input.value) {
      formData[input.id] = input.value;
    }
  });

  chrome.storage.sync.set({ formData }, () => {
    showStatus("✅ Data saved successfully!", 'success');
  });
});

// Autofill current form
document.getElementById("autofill").addEventListener("click", async () => {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    if (!tab.url.includes('docs.google.com/forms/') && !tab.url.includes('forms.gle/')) {
      showStatus("❌ Please open a Google Form first", 'error');
      return;
    }

    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => window.postMessage({ type: 'AUTOFILL_FORM' }, '*')
    });
    
    showStatus("🔄 Autofilling form...", 'success');
  } catch (error) {
    showStatus("❌ Error: " + error.message, 'error');
  }
});