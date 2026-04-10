document.getElementById('cleanAction').addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    world: "MAIN",
    func: () => {
      // content.js에 정의된 커스텀 이벤트를 트리거함
      window.dispatchEvent(new CustomEvent('EXECUTE_ENTRY_CLEANUP'));
    }
  });
});
