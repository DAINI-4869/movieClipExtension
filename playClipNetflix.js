//再生機能
//clip側でデータを受け取る起動
//再生機能
//繰り返し再生巻数
//適当なclipを推奨し、再生

//clipのデータ
let starttime;
let endtime;
let clipName; 
let title;
let username;

let videoPlayer; // スコープ内で保持するために追加
//条件を満たしたかどうか
let conditionLoadVideo = false;//ビデオが読み込まれたかどうか

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
          clipName = clipData.name;
          starttime = clipData.starttime;
          title = clipData.title;
          username = clipData.username;

          console.log(`タイトル: ${title}`);
          console.log(`ユーザー名: ${username}`);
          console.log(`クリップ名: ${clipName}`);
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
  const videoPlayer = document.querySelector(SELECTORS.videoPlayer);

  videoPlayer.addEventListener("loadedmetadata", () => {
    console.log("ビデオのメタデータが読み込まれました");
    console.log("ビデオの長さ:", videoPlayer.duration);
    console.log("ビデオの現在の再生時間:", videoPlayer.currentTime);
  });
  videoPlayer.addEventListener("error", (e) => {
    console.error("ビデオの読み込みに失敗しました:", e);
  });

  

  function initializeVideoPlayer() {
    
    if (videoPlayer) {
      // ビデオプレイヤーが見つかった場合の処理
      if(conditionLoadVideo === false){
        conditionLoadVideo = true;
        console.log("フラグが立ちました");
        console.log(conditionLoadVideo);
        console.log("再生機能を起動します");

      };

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
  if (videoPlayer) {
    console.log('動画プレーヤーが見つかりました。');
    console.log(`再生開始 : ${starttime}`);
    video.currentTime = starttime;
    console.log(`終了時間 : ${endtimetime}`);
      
  }
}

function checkConditionTime(starttime, endtime){
  //動作開始
  const interval = 1; 
  const intervalId = setInterval(() => {
    const video = document.querySelector('video');
    if (video) {
      const currentTime = video.currentTime;
      console.log(`現在の再生時間: ${currentTime}`);
      if (currentTime >= endtime) {
        console.log("再生終了");
        video.pause();
        clearInterval(intervalId); // インターバルを停止
      }
    } else {
      console.error("ビデオプレイヤーが見つかりません");
      clearInterval(intervalId); // インターバルを停止
    }
  }, interval);
}

function replayClip() {
  //他のclipをお勧めする画面を表示する処理
  // ページをリロードする処理
  location.reload();
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