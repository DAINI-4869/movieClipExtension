  //再生機能
  //clip側でデータを受け取る起動
  //再生機能
  //繰り返し再生巻数
  //適当なclipを推奨し、再生
  window.addEventListener('load', () => {
    // ローカルストレージから"clip"データを取得
    chrome.storage.local.get(["clip"], (result) => {
      if (chrome.runtime.lastError) {
        // エラーがある場合の処理
        console.error("データの取得に失敗しました:", chrome.runtime.lastError);
      } else {
        // データ取得成功時の処理
        console.log("取得したデータ:", result.clip);
      }
    });
  });
  






  function playClipSystem(starttime,endtime){
    videoPlayer.currentTime =starttime;
    if(videoPlayer.currentTime == endtime){
      videoPlayer.currentTime =starttime;
    };


  }