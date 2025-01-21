  //再生機能
  //clip側でデータを受け取る起動
  //再生機能
  //繰り返し再生巻数
  //適当なclipを推奨し、再生
  window.addEventListener("load", () => {
    // ローカルストレージから "playClipSystemKey" データを取得
    chrome.storage.local.get(["playClipSystemKey"], (result) => {
      const playClipSystemKey = result.playClipSystemKey; // 結果から取得
  
      if (playClipSystemKey === 1) {
        // "clip" データを取得
        chrome.storage.local.get(["clip"], (clipResult) => {
          if (chrome.runtime.lastError) {
            // エラーがある場合の処理
            console.error("データの取得に失敗しました:", chrome.runtime.lastError);
          } else if (clipResult.clip) {
            // データ取得成功時の処理
            console.log("取得したデータ:", clipResult.clip);


          } else {
            // データが存在しない場合の処理
            console.warn("clip データが存在しません 起動を終了します。");
            chrome.storage.local.set({ playClipSystemKey: 0});
          }
        });
      } else {
        console.log("playClipSystemKey が 1 ではありません");
      }
    });
  });
  
  






  function playClipSystem(starttime,endtime){
    videoPlayer.currentTime =starttime;
    if(videoPlayer.currentTime == endtime){
      videoPlayer.currentTime =starttime;
    };


  }