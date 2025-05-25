(function() {
  
  const SVG_NAMESPACE = "http://www.w3.org/2000/svg";
  const BUTTON_ID = 'replay-button';
  const COLOR_DEFAULT = "#FFFFFF";
  const COLOR_ROOPING = "#FF0000";
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
    let isRooping = false;

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
      button.setAttribute('aria-label', '繰り返し再生ボタン');
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
      });

      const style = createSVGElement("style", {});
      style.textContent = ".cls-637630c1c3a86d32eae6f029-1{fill:none;stroke:currentColor;stroke-miterlimit:10;}";
      svg.appendChild(style);

      // SVG要素の追加
      svg.appendChild(createSVGElement("path", {
        d: "M3.57996 5.15991H17.42C19.08 5.15991 20.42 6.49991 20.42 8.15991V11.4799",
        stroke: "#292D32",
        "stroke-width": "1.5",
        "stroke-miterlimit": "10",
        "stroke-linecap": "round",
        "stroke-linejoin": "round"
      }));

      svg.appendChild(createSVGElement("path", {
        d: "M6.73996 2L3.57996 5.15997L6.73996 8.32001",
        stroke: "#292D32",
        "stroke-width": "1.5",
        "stroke-miterlimit": "10",
        "stroke-linecap": "round",
        "stroke-linejoin": "round"
      }));

      svg.appendChild(createSVGElement("path", {
        d: "M20.42 18.84H6.57996C4.91996 18.84 3.57996 17.5 3.57996 15.84V12.52",
        stroke: "#292D32",
        "stroke-width": "1.5",
        "stroke-miterlimit": "10",
        "stroke-linecap": "round",
        "stroke-linejoin": "round"
      }));

      svg.appendChild(createSVGElement("path", {
        d: "M17.26 21.9999L20.42 18.84L17.26 15.6799",
        stroke: "#292D32",
        "stroke-width": "1.5",
        "stroke-miterlimit": "10",
        "stroke-linecap": "round",
        "stroke-linejoin": "round"
      }));

      return svg;
    }

    function createSVGElement(type, attributes) {
      const elem = document.createElementNS(SVG_NAMESPACE, type);
      for (const [key, value] of Object.entries(attributes)) {
        elem.setAttribute(key, value);
      }
      return elem;
    }

    function handleRecordButtonClick() {
      try { // 関数内でエラーハンドリング
        const videoPlayer = document.querySelector(SELECTORS.videoPlayer);

        if (!videoPlayer) {
          throw new Error('ビデオプレーヤーが見つかりません。');
        }

        if (isRooping) {
            console.log('繰り返しを開始します。');
            isRooping = true;
            svgElement.setAttribute("color", COLOR_ROOPING);
        } else {
            console.log('繰り返しを停止します。');
            svgElement.setAttribute("color", COLOR_DEFAULT);
            isRooping = false;
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
    const controlSubtitleElement = document.querySelector('[data-uia="control-audio-subtitle"]');
    if (controlSubtitleElement && controlSubtitleElement.parentNode) {
      // クラスを既存ボタンと一致させる
      recordButton.className = controlSubtitleElement.className;
      wrapButton.className = controlSubtitleElement.parentNode.className;

      // 右マージンを追加
      wrapButton.style.marginRight = '12px';
      wrapButton.style.marginLeft = '12px';

      // SVG追加
      recordButton.appendChild(svgElement);
      wrapButton.appendChild(recordButton);

      // 音声・字幕ボタンの左に追加
      controlSubtitleElement.parentNode.before(buttonMargin);
      controlSubtitleElement.parentNode.before(wrapButton);
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
      isRooping = false;
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
