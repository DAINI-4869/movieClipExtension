chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'HISTORY_CHANGE') {
      console.log('URLが変更されました:', message.data.url);
    }
  });
