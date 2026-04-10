document.getElementById('cleanBtn').addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  if (tab.url.includes("playentry.org")) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        window.postMessage({ type: "CLEAN_BLOCKS" }, "*");
      }
    });
  } else {
    alert("엔트리 사이트에서만 작동합니다.");
  }
});
