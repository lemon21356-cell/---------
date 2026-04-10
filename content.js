// inject.js를 페이지에 직접 주입하여 Entry 객체에 접근 가능하게 함
const script = document.createElement('script');
script.src = chrome.runtime.getURL('inject.js');
(document.head || document.documentElement).appendChild(script);

// 팝업의 메시지를 inject.js로 전달
window.addEventListener("message", (event) => {
  if (event.data.type === "CLEAN_BLOCKS") {
    window.dispatchEvent(new CustomEvent('ExecuteCleanUp'));
  }
});
