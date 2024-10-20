<<<<<<< HEAD
window.addEventListener('load', function() {
  // ボタンとdivを一度作成しておく
  const buttonMargin = document.createElement('div');
  buttonMargin.style.minWidth = '3rem';
  buttonMargin.style.width = '3rem';
  const wrapButton = document.createElement('div');
  const recordButton = document.createElement('button');
  recordButton.id = 'overlay-button';
  recordButton.style.backgroundColor = '#FF0000';
  recordButton.style.color = '#FFFFFF';
  recordButton.style.width = '44px';
  recordButton.style.height = '44px';
  recordButton.style.borderRadius = '50%'

  let recording = false;
  let Startgettime;
  let Endgettime;
  //urlを取得
  let path = window.location.pathname;// このデータは　netflixの場合 /watch/00000000 のような出力をする。
  //urlの変更をチェックするキー
  let checkurl = false; //　変更時、trueになります。使用後にfalseに戻しておいてください
  

  recordButton.addEventListener('click', function() {
    const videoPlayer = document.querySelector('video');
    if (recording) {
      recording = false;
      recordButton.style.borderRadius = '50%'
      Endgettime = videoPlayer.currentTime;
      sendData({ StartTime: Startgettime, EndTime: Endgettime ,URL: path});
    } else {
      recording = true;
      recordButton.style.borderRadius = '0%'
      Startgettime = videoPlayer.currentTime;
=======
(function() {
  const SVG_NAMESPACE = "http://www.w3.org/2000/svg";
  const BUTTON_ID = 'record-button';
  const COLOR_DEFAULT = "#FFFFFF";
  const COLOR_RECORDING = "#FF0000";
  const SELECTORS = {
    videoPlayer: 'video',
    videoTitle: '[data-uia="video-title"]',
    controlsStandard: '[data-uia="controls-standard"]',
    controlVolumeHigh: '[data-uia="control-volume-high"]',
    controlForward10: '[data-uia="control-forward10"]',
  };

  window.addEventListener('load', () => {
    // インジェクションスクリプトの注入
    injectScript('history_change.js');

    // 要素の作成
    const buttonMargin = createButtonMargin();
    const wrapButton = document.createElement('div');
    const recordButton = createRecordButton();
    const svgElement = createSVG();

    // 状態管理変数
    let isRecording = false;
    let startTime;
    let endTime;
    let currentPath = window.location.pathname;

    // イベントリスナーの設定
    recordButton.addEventListener('click', handleRecordButtonClick);

    // MutationObserverの設定
    const observer = new MutationObserver(mutationCallback);
    observer.observe(document.body, { childList: true, subtree: true });

    // ページを離れたときにオブザーバーを停止
    window.addEventListener('beforeunload', () => {
      observer.disconnect();
    });

    window.addEventListener('historyChange', function(e) {
      const detail = e.detail;
      console.log('History changed:', detail);
      init();

      // 必要に応じてバックグラウンドスクリプトにメッセージを送信
      chrome.runtime.sendMessage({
        type: 'HISTORY_CHANGE',
        data: detail
      });
    });

    // 関数定義

    function injectScript(file, tag) {
      const script = document.createElement('script');
      script.src = chrome.runtime.getURL(file);
      script.onload = function() {
        this.remove();
      };
      (tag || document.head).appendChild(script);
>>>>>>> bbe0bc8022055c26db5ccb3fdaa161eaed662326
    }

    function createButtonMargin() {
      const margin = document.createElement('div');
      margin.style.minWidth = '3rem';
      margin.style.width = '3rem';
      return margin;
    }

    function createRecordButton() {
      const button = document.createElement('button');
      button.id = BUTTON_ID;
      button.setAttribute('aria-label', '録画ボタン');
      return button;
    }

    function createSVG() {
      const svg = createSVGElement("svg", {
        id: "Layer_1",
        "data-name": "Layer 1",
        xmlns: SVG_NAMESPACE,
        viewBox: "0 0 24 24",
        "stroke-width": "1.5",
        width: "120%",
        height: "120%",
        color: COLOR_DEFAULT
      });

      const style = createSVGElement("style", {});
      style.textContent = ".cls-637630c1c3a86d32eae6f029-1{fill:none;stroke:currentColor;stroke-miterlimit:10;}";
      svg.appendChild(style);

      // SVG要素の追加
      svg.appendChild(createSVGElement("rect", {
        class: "cls-637630c1c3a86d32eae6f029-1",
        x: "1.5",
        y: "9.14",
        width: "15.27",
        height: "12.41"
      }));
      
      svg.appendChild(createSVGElement("polygon", {
        class: "cls-637630c1c3a86d32eae6f029-1",
        points: "16.77 17.73 21.55 21.55 22.5 21.55 22.5 9.14 21.55 9.14 16.77 12.96 16.77 17.73"
      }));

      svg.appendChild(createSVGElement("circle", {
        class: "cls-637630c1c3a86d32eae6f029-1",
        cx: "4.84",
        cy: "5.8",
        r: "3.34"
      }));

      svg.appendChild(createSVGElement("circle", {
        class: "cls-637630c1c3a86d32eae6f029-1",
        cx: "13.43",
        cy: "5.8",
        r: "3.34"
      }));

      svg.appendChild(createSVGElement("polygon", {
        class: "cls-637630c1c3a86d32eae6f029-1",
        points: "7.23 16.77 7.23 13.91 10.09 15.34 7.23 16.77"
      }));

      return svg;
    }

<<<<<<< HEAD

  function mutationCallback(mutationsList) {
    mutationsList.forEach(mutation => {
      let nowpath = window.location.pathname;
      if(path != nowpath){
        path = nowpath;
        checkurl = true;
        console.log("urlの変更を検出しました",checkurl); 
=======
    function createSVGElement(type, attributes) {
      const elem = document.createElementNS(SVG_NAMESPACE, type);
      for (const [key, value] of Object.entries(attributes)) {
        elem.setAttribute(key, value);
>>>>>>> bbe0bc8022055c26db5ccb3fdaa161eaed662326
      }
      return elem;
    }

    function handleRecordButtonClick() {
      try { // 関数内でエラーハンドリング
        const videoPlayer = document.querySelector(SELECTORS.videoPlayer);
        const allTitleName = document.querySelector(SELECTORS.videoTitle);

        if (!videoPlayer) {
          throw new Error('ビデオプレーヤーが見つかりません。');
        }

<<<<<<< HEAD
      

      if (mutation.type === 'childList') {
        const controlsForward10Element = document.querySelector('[data-uia="control-forward10"]'); // 広告時に表示しないため
        if (controlsForward10Element) {
          // 既にボタンが追加されていない場合のみ追加
          if (!document.getElementById('overlay-button')) {
              createButton();
=======
        if (isRecording) {
          endTime = videoPlayer.currentTime;

          if(startTime > endTime){
            throw new Error("録画終了時刻が開始時刻よりも早い値です");
>>>>>>> bbe0bc8022055c26db5ccb3fdaa161eaed662326
          }
          const checkSecond = Math.abs(endTime - startTime);
          if(checkSecond < 1){
            svgElement.setAttribute("color", COLOR_RECORDING);
            throw new Error("録画範囲が短すぎます");
          }

          const data = {
            StartTime: startTime,
            EndTime: endTime,
            URL: currentPath,
          };

          if (allTitleName) {
            const h4Element = allTitleName.querySelector('h4');
            if (h4Element) {
              // シリーズ作品の場合
              data.title = h4Element.textContent;
              const episodeNumberElement = allTitleName.querySelector('span:nth-of-type(1)');
              if (episodeNumberElement) {
                data.epnumber = episodeNumberElement.textContent;
              }
            } else {
              // シリーズ作品ではない場合
              data.title = allTitleName.textContent;
            }
          } else {
            throw new Error('タイトル要素が見つかりません。');
          }

          sendData(data);
          init();
        } else {
          svgElement.setAttribute("color", COLOR_RECORDING);
          isRecording = true;
          startTime = videoPlayer.currentTime;
        }
      } catch (error) {
        console.error(error);
        // ユーザーにエラーを通知するUIをここに追加可能
        alert(error.message); // 例: アラートで通知
        init();
      }
    }

    function addElements() {
      const controlsStandardElement = document.querySelector(SELECTORS.controlsStandard);
      if (controlsStandardElement) {
        const controlVolumeElement = document.querySelector(SELECTORS.controlVolumeHigh);
        if (controlVolumeElement) {
          recordButton.className = controlVolumeElement.className;
          recordButton.appendChild(svgElement);
          wrapButton.className = controlVolumeElement.parentNode.className;
          controlVolumeElement.parentNode.after(wrapButton);
          wrapButton.appendChild(recordButton);
          controlVolumeElement.parentNode.after(buttonMargin);
        }
      }
    }

    function mutationCallback(mutationsList) {

      const controlsForward10Element = document.querySelector(SELECTORS.controlForward10);
      if (controlsForward10Element && !document.getElementById(BUTTON_ID)) {
        addElements();
      } else if (!controlsForward10Element && document.getElementById(BUTTON_ID)) {
        buttonMargin.remove();
        recordButton.remove();
      }
    }

    function init() { // 必要なリセット処理があればここに追加
      isRecording = false;
      startTime = null;
      endTime = null;
      svgElement.setAttribute("color", COLOR_DEFAULT);
    }
  });

  /**
   * データをサーバーに送信する関数
   * @param {Object} dataToSend - 送信するデータ
   */
  function sendData(dataToSend) {
    fetch(window.url, { // window.urlは別ファイルに定義済み
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dataToSend),
    })
    .then((response) => response.json())
    .then((data) => {
      console.log('Success:', data);
      // ユーザーに成功を通知するUIを追加可能
    })
    .catch((error) => {
      console.error('Error:', error);
      // ユーザーにエラーを通知するUIを追加可能
    });
  }
})();
