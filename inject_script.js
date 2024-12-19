(function() {
  function injectScript(file, tag) {
    const script = document.createElement('script');
    script.src = chrome.runtime.getURL(file);
    script.onload = function() {
      this.remove();
    };
    (tag || document.head).appendChild(script);
  }

  injectScript("history_change.js");
})();