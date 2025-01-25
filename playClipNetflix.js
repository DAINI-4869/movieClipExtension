//再生機能
//clip側でデータを受け取る起動
//再生機能
//繰り返し再生巻数
//適当なclipを推奨し、再生
let starttime;
let endtime;

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

          endtime = clipData.endtime;
          const name = clipData.name;
          starttime = clipData.starttime;
          const title = clipData.title;
          const username = clipData.username;

          console.log(`タイトル: ${title}`);
          console.log(`ユーザー名: ${username}`);
          console.log(`クリップ名: ${name}`);
          console.log(`開始時間: ${starttime}`);
          console.log(`終了時間: ${endtime}`);
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

  const SELECTORS = {
    videoPlayer: 'video',
    currentTimeDisplay: '.current-time-display', // 再生時間を表示する要素のセレクタ
    // 他のセレクタ
  };

  function initializeVideoPlayer() {
    const videoPlayer = document.querySelector(SELECTORS.videoPlayer);
    if (videoPlayer) {
      // ビデオプレイヤーの現在の再生時間を取得
      const currentTime = videoPlayer.currentTime;
      console.log(`現在の再生時間: ${currentTime}`);
      if(starttime < currentTime){
        playClipSystem(starttime,endtime); //再生機能
      }
   
    } else {
      console.log("ビデオプレイヤーが見つかりません");
      //読み込み時最初はビデオプレイヤーが見つからない。
    }
  }

  // 初期化関数を呼び出し
  initializeVideoPlayer();

  // MutationObserverを使用してDOMの変更を監視
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.addedNodes.length > 0) {
        initializeVideoPlayer();
      }
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });

});

window.addEventListener('beforeunload', () => {
  //起動終了
});
  
//clip.resultを引数にする関数
function overLoadView(data){
  if (!data.name || !data.title || !data.username || !data.starttime || !data.endtime) {
    throw new Error("JSON オブジェクトに必要なプロパティがありません");
  }
  // コンソールに内容を出力
  console.log(`タイトル: ${data.title}`);
  console.log(`名前: ${data.name}`);
  console.log(`ユーザー名: ${data.username}`);
  console.log(`開始時間: ${data.starttime}`);
  console.log(`終了時間: ${data.endtime}`);

}

//再生機能
function playClipSystem(starttime, endtime) {

  const videoPlayer = document.querySelector('video');
  if (videoPlayer) {
    console.log('動画プレーヤーが見つかりました。');
    console.log(`再生開始 : ${starttime}`);
    video.currentTime = starttime;
    console.log(`終了時間 : ${endtimetime}`);
      
  }
}
/*
  const SELECTORS = {
    videoPlayer: 'video',
    videoTitle: '[data-uia="video-title"]',
    controlsStandard: '[data-uia="controls-standard"]',
    controlVolumeHigh: '[data-uia="control-volume-high"]',
    controlForward10: '[data-uia="control-forward10"]',
  };
*/