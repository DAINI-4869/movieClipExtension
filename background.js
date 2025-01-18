chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'HISTORY_CHANGE') {
      console.log('URLが変更されました:', message.data.url);
    }
  });

//再生と録画を切り替える値
  let playClipSystemKey = "initialValue";
//Clipの再生用データ
  let playClipData ;
