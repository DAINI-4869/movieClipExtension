// 再生と録画を切り替える値
let playClipSystemKey = "initialValue";
// Clipの再生用データ
let playClipData;

// onMessage リスナー
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'HISTORY_CHANGE') {
    // URL変更イベント
    console.log('URLが変更されました:', message.data.url);
    sendResponse({ status: 'URL received' });
  } else if (message.greeting === "こんにちは") {
    // playClipContent.js からのメッセージ
    console.log("playClipContent.jsからのメッセージを受信:", message.greeting);
    sendResponse({ reply: "メッセージを受け取りました!!" });
  } else if (message.action === "setGlobalValue") {
    // グローバル値の更新
    playClipSystemKey = message.value || playClipSystemKey;
    playClipData = message.data || playClipData;
    console.log("グローバル値を更新:", { playClipSystemKey, playClipData });
    sendResponse({ status: 'success', key: playClipSystemKey, data: playClipData });
  } else {
    console.warn("不明なメッセージを受信:", message);
    sendResponse({ status: 'unknown message' });
  }
});


