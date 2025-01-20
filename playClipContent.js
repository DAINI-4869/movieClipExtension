// カスタムイベントが実行されたら実行
window.addEventListener("clipListElementsRendered", () => {
    console.log("このclipを読み込みました！");
});
window.addEventListener("clipSelected", () => {
    console.log("このclipを選択しました！");
    //cookieを読み込む
    // Clipの再生用データ
    const playClipData = getCookies();
    // 取得したCookieをコンソールに表示
    console.log("Cookies on video:", playClipData);
    chrome.storage.local.set({ clip: playClipData});
  
});


// Cookieを取得する関数
function getCookies() {
  const cookies = document.cookie.split("; ");
  const cookieObj = {};
  
  try {
    // Cookieをオブジェクト形式に変換
    cookies.forEach(cookie => {
      const [key, value] = cookie.split("=");
      cookieObj[key] = decodeURIComponent(value || "");
    });
  } catch (error) {
    console.error("Error parsing cookies:", error);
  }

  return cookieObj;
}




