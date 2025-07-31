(() => {
  'use strict';

  // ---------------------------------------------------------------------------
  // グローバル変数の定義
  // ---------------------------------------------------------------------------
  let videoPlayer = null;   // <video> element reference
  let clipData    = null;   // { starttime, endtime, name, title, username }
  let isScriptReloading = false;// スクリプトによるリロードフラグ

  //デバッグ用変数定義
  let togglekey = 0; // トグルキーの状態を管理する変数

  // End-time detection tolerance (seconds)
  const EPSILON = 0.05;
  let countdownIntervalId = null;

  // ---------------------------------------------------------------------------
  // URLに "clip=1" が含まれていない場合は追加し、ページをリロード
  // 理由：SPAのURL状態管理用フラグとして使用するため
  // clipDataの判断を行う　別関数化を検討中
  // ---------------------------------------------------------------------------
  function ensureClipTagInURL() {
    //clipdataの有無を取得
    chrome.storage.local.get(["playClipSystemKey"], (result) => {
    console.log("再生機能の起動キー:", result.playClipSystemKey);
    });

  }

  // ---------------------------------------------------------------------------
  // Chrome拡張のローカルストレージからclipデータを読み込む関数
  // playClipSystemKeyが1かつclipデータが存在する時だけ有効
  // ---------------------------------------------------------------------------
  function loadClipFromStorage() {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get(['playClipSystemKey', 'clip'], res => {
        if (chrome.runtime.lastError) {
          return reject(chrome.runtime.lastError);// 読み取りエラー処理
        }

        if (res.playClipSystemKey === 1 && res.clip) {
          clipData = res.clip;
          console.info('[Clip] loaded:', clipData);
          resolve(); // 読み込み成功
        } else {
          console.log('[Clip] No clip data or playClipSystemKey is not 1');
        }
      });
    });
  }

  // ---------------------------------------------------------------------------
  // Netflixの<video>タグが出現するまで待つ（SPAなので後からDOMに追加される）
  // DOM変更を監視して、<video>が現れたらresolve
  // ---------------------------------------------------------------------------
  function waitForVideoElement() {
    return new Promise(resolve => {
      const existing = document.querySelector('video');
      if (existing) return resolve(existing);

      const observer = new MutationObserver(() => {
        const v = document.querySelector('video');
        if (v) {
          observer.disconnect();
          resolve(v);
        }
      });

      observer.observe(document.body, { childList: true, subtree: true });
    });
  }

  // ---------------------------------------------------------------------------
  // メイン処理の開始：URL・clipデータ・video要素の準備ができたら再生処理へ
  // ---------------------------------------------------------------------------
  async function init() {
    // URLにclip=1が付いていなければ追加してリロード
    ensureClipTagInURL();

    try {
      await loadClipFromStorage();
      videoPlayer = await waitForVideoElement();
      setupPlayer();
    } catch (err) {
      console.error('[Clip] Initialization failed:', err);
      return;
    }
  }

  // ---------------------------------------------------------------------------
  // videoの再生が始まったら、endtimeまで監視し、到達したら停止・リロード
  // ---------------------------------------------------------------------------
  function setupPlayer() {
    const end = Number(clipData.endtime);

    if (videoPlayer.readyState >= 1) {
      console.info('[Video] metadata already available, skipping wait.');
      monitorClipEnd(end);
      startCountdownLogger(end);
    } else {
      videoPlayer.addEventListener('loadedmetadata', () => {
        console.info('[Video] metadata loaded. duration =', videoPlayer.duration);
        monitorClipEnd(end);
        startCountdownLogger(end);
      });
    }
    // エラー発生時のログ出力
    videoPlayer.addEventListener('error', e => {
      console.error('[Video] error:', e);
    });
  }

  // ---------------------------------------------------------------------------
  // 終了時間を監視し、達したらvideoを停止・イベント解除・リロード
  // ---------------------------------------------------------------------------
  function monitorClipEnd(end) {
    function onTimeUpdate() {
      if (videoPlayer.currentTime + EPSILON >= end) {
        console.info('[Clip] Reached end, pausing and reloading.');
        videoPlayer.pause();
        videoPlayer.removeEventListener('timeupdate', onTimeUpdate);

        clearInterval(countdownIntervalId);
        //ifで場合分けするbool値で管理
        // クリップモード終了
        if (togglekey === 1 ){
          // クリップモード終了
          console.log("クリップモード終了");
          // ストレージのplayClipSystemKeyを0に設定
          chrome.storage.local.set({ playClipSystemKey: 0 }, () => {
            console.log("playClipSystemKeyを0に設定しました。");
            window.location.href = "http://localhost:3000/site_data/my_video"; //遷移先URL
          });
        }else {
          console.log("クリップ再度再生");
          reloadPageFromScript ();
        }
      }
    }
    videoPlayer.addEventListener('timeupdate', onTimeUpdate);
  }
  // ---------------------------------------------------------------------------
  //毎秒、残り時間をログ出力する（開発・デバッグ用）
  // ---------------------------------------------------------------------------
  function startCountdownLogger(end) {
    if (countdownIntervalId !== null) clearInterval(countdownIntervalId);

    countdownIntervalId = setInterval(() => {
      if (!videoPlayer) return;
      const remaining = Math.max(0, end - videoPlayer.currentTime);
      console.log(`[Countdown] ${remaining.toFixed(1)} seconds remaining until end.`);
    }, 1000);
  }

  // ---------------------------------------------------------------------------
  // Netflix apiを使用　（規約上　おそらくアウト）　後で消せ　機能不全
  // ---------------------------------------------------------------------------
  function getNetflixApi(time) {
  // 非公式：playerオブジェクト取得とseek（規約NG）
  const player = netflix.appContext.state.playerApp.getAPIPlayerBySessionId(0);
  if (!player) {
    console.error('[Netflix API] Player not found');
    return;
  }
  console.log('[Netflix API] Player found:', player);
  player.seek(time);  // timeへ
  player.play();     // 再生
  }


  // ---------------------------------------------------------------------------
  // リロード周りでのsystem終了処理
  //-----------------------------------------------------------------------------
  //リロードイベントのスクリプト
  function reloadPageFromScript() {
    isScriptReloading = true;
    location.reload();
  }
  window.addEventListener('beforeunload', (event) => {
  if (!isScriptReloading) {
    console.log('ユーザー操作など、スクリプト以外による再読み込みまたはページ遷移');
    // ここでスクリプト以外による再読み込み時の処理を行う
    chrome.storage.local.set({ playClipSystemKey: 0 }, () => {
      console.log("playClipSystemKeyを0に設定しました。");
    });
  } else {
    console.log('スクリプトによる再読み込み');
    // スクリプトによる再読み込み後の処理が必要な場合は、
    // localStorage や sessionStorage にフラグを保存し、
    // load イベントなどで確認する方法を検討してください。
    isScriptReloading = false; // フラグをリセット
  }
  });
  // ---------------------------------------------------------------------------
  // ページの読み込みが完了したらinit()を実行
  // ---------------------------------------------------------------------------
  window.addEventListener('load', init);

})();
