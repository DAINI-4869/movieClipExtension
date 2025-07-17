import "../css/content_button.css";
import "../image/moreDetailSVG.js";
import "../image/recordSVG.js";
import "../config/config.js";
import "./playClipNetflix.js";
import "./replaybutton_mergeToplayClipNetflix.js";
import { getApiEndpoint } from './../utils.js';

(function() {
  const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';
  const BUTTON_ID = 'record-button';

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
    const svgElement = window.createSVG();

    // 状態管理変数
    let isRecording = false;
    let startTime;
    let endTime;
    let currentPath;

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
      button.setAttribute('aria-label', '録画ボタン');
      return button;
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
        const allTitleName = document.querySelector(SELECTORS.videoTitle);

        if (!videoPlayer) {
          throw new Error('ビデオプレーヤーが見つかりません。');
        }

        if (isRecording) {
          endTime = videoPlayer.currentTime;
          currentPath = window.location.pathname;
          if(startTime > endTime){
            throw new Error('録画終了時刻が開始時刻よりも早い値です');
          }
          const checkSecond = Math.abs(endTime - startTime);
          if(checkSecond < 1){
            svgElement.setAttribute('color', window.COLOR_RECORDING);
            throw new Error('録画範囲が短すぎます');
          }

          const data = {
            StartTime: startTime,
            EndTime: endTime,
            URL: currentPath,
          };
          data.service = detectService();
          data.user = 'test_user';


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
          svgElement.setAttribute('color', window.COLOR_RECORDING);
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
      svgElement.setAttribute('color', window.COLOR_DEFAULT);
    }
  });
  /**
   * 今いる動画サービスをホスト名から判定
   * @returns {string} サービス名
   */
  function detectService() {
    const host = window.location.hostname;
    if (host.includes('netflix.com')) return 'Netflix';
    if (host.includes('primevideo.com')) return 'Prime Video';
    if (host.includes('youtube.com')) return 'YouTube';
    if (host.includes('disneyplus.com')) return 'Disney+';
    if (host.includes('hulu.jp') || host.includes('hulu.com')) return 'Hulu';
    return 'Unknown';
  }


  /**
   * データをサーバーに送信する関数
   * @param {Object} dataToSend - 送信するデータ
   */
  function sendData(dataToSend) {
    fetch(getApiEndpoint('receive'), {
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
