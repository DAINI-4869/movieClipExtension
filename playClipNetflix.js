  //再生機能
  //clip側でデータを受け取る起動
  //再生機能
  //繰り返し再生巻数
  //適当なclipを推奨し、再生
  window.addEventListener("load", () => {
    // ローカルストレージから "playClipSystemKey" データを取得
    chrome.storage.local.get(["playClipSystemKey","clip"], (result) => {
      const playClipSystemKey = result.playClipSystemKey; // 結果から取得
      if (playClipSystemKey === 1) {
        // "clip" データを取得
        chrome.storage.local.get(["clip"], (clipResult) => {
          if (chrome.runtime.lastError) {
            // エラーがある場合の処理
            console.error("データの取得に失敗しました:", chrome.runtime.lastError);
          } else if (clipResult.clip) {
            // データ取得成功時の処理
            //取得したデータをわける
            const clipData = clipResult.clip;
            console.log("取得したデータ:", clipResult.clip);
            console.log("取得するデータ:",clipData);

            const endtime = clipData.endtime;
            const name = clipData.name;
            const starttime = clipData.starttime;
            const title = clipData.title;
            const username = clipData.username;

            console.log(`タイトル: ${title}`);
            console.log(`ユーザー名: ${username}`);
            console.log(`クリップ名: ${name}`);
            console.log(`開始時間: ${starttime}`);
            console.log(`終了時間: ${endtime}`);
            playClipSystem(starttime,endtime);
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
  
  function playClipSystem(starttime, endtime) {
    const videoPlayer = document.querySelector('video');
    if (videoPlayer) {
      console.log('動画プレーヤーが見つかりました。');
      videoPlayer.addEventListener('play', function() {
        console.log(`再生が開始されました。${starttime}秒にスキップします。`);
        videoPlayer.currentTime = starttime; 
      });
    }
  }