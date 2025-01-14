// カスタムイベントが実行されたら実行
window.addEventListener("clipListElementsRendered", () => {
    console.log("このclipを読み込みました！");
});
window.addEventListener("clipSelected", () => {
    console.log("このclipを選択しました！");
    //cookieを読み込む
    const cookies = getCookies();
    // 取得したCookieをコンソールに表示
    console.log("Cookies on video:", cookies);
    //データを変数に格納
    
    //再生機能を起動

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



