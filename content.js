// inject.js 주입
const s = document.createElement('script');
s.src = chrome.runtime.getURL('inject.js');
s.onload = function() { this.remove(); };
(document.head || document.documentElement).appendChild(s);

// 팝업으로부터 메시지 수신
window.addEventListener("message", (event) => {
  if (event.data.type === "CLEAN_BLOCKS") {
    window.dispatchEvent(new CustomEvent('ExecuteCleanUp'));
  }
});
