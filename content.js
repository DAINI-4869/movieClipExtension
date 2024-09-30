window.addEventListener('load', () => {
  // 定数の定義
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

  // 要素の作成
  const buttonMargin = createButtonMargin();
  const wrapButton = document.createElement('div');
  const recordButton = createRecordButton();
  const svgElement = document.createElementNS(SVG_NAMESPACE,"svg");

  // 状態管理変数
  let isRecording = false;
  let startTime;
  let endTime;
  let currentPath = window.location.pathname;

  // SVG属性の設定
  svgElement.setAttribute("id", "Layer_1");
  svgElement.setAttribute("data-name", "Layer 1");
  svgElement.setAttribute("xmlns", SVG_NAMESPACE);
  svgElement.setAttribute("viewBox", "0 0 24 24");
  svgElement.setAttribute("stroke-width", "1.5");
  svgElement.setAttribute("width", "120%");
  svgElement.setAttribute("height", "120%");
  svgElement.setAttribute("color", "#FFFFFF");

  // スタイル定義
  const style = document.createElementNS(SVG_NAMESPACE, "style");
  style.textContent = ".cls-637630c1c3a86d32eae6f029-1{fill:none;stroke:currentColor;stroke-miterlimit:10;}";
  svgElement.appendChild(style);

  // rect要素の作成
  const rectElement = document.createElementNS(SVG_NAMESPACE, "rect");
  rectElement.setAttribute("class", "cls-637630c1c3a86d32eae6f029-1");
  rectElement.setAttribute("x", "1.5");
  rectElement.setAttribute("y", "9.14");
  rectElement.setAttribute("width", "15.27");
  rectElement.setAttribute("height", "12.41");
  svgElement.appendChild(rectElement);

  // polygon要素の作成 (1つ目)
  const polygonElement1 = document.createElementNS(SVG_NAMESPACE, "polygon");
  polygonElement1.setAttribute("class", "cls-637630c1c3a86d32eae6f029-1");
  polygonElement1.setAttribute("points", "16.77 17.73 21.55 21.55 22.5 21.55 22.5 9.14 21.55 9.14 16.77 12.96 16.77 17.73");
  svgElement.appendChild(polygonElement1);

  // circle要素の作成 (1つ目)
  const circleElement1 = document.createElementNS(SVG_NAMESPACE, "circle");
  circleElement1.setAttribute("class", "cls-637630c1c3a86d32eae6f029-1");
  circleElement1.setAttribute("cx", "4.84");
  circleElement1.setAttribute("cy", "5.8");
  circleElement1.setAttribute("r", "3.34");
  svgElement.appendChild(circleElement1);

  // circle要素の作成 (2つ目)
  const circleElement2 = document.createElementNS(SVG_NAMESPACE, "circle");
  circleElement2.setAttribute("class", "cls-637630c1c3a86d32eae6f029-1");
  circleElement2.setAttribute("cx", "13.43");
  circleElement2.setAttribute("cy", "5.8");
  circleElement2.setAttribute("r", "3.34");
  svgElement.appendChild(circleElement2);

  // polygon要素の作成 (2つ目)
  const polygonElement2 = document.createElementNS(SVG_NAMESPACE, "polygon");
  polygonElement2.setAttribute("class", "cls-637630c1c3a86d32eae6f029-1");
  polygonElement2.setAttribute("points", "7.23 16.77 7.23 13.91 10.09 15.34 7.23 16.77");
  svgElement.appendChild(polygonElement2);

  // イベントリスナーの設定
  recordButton.addEventListener('click', handleRecordButtonClick);
  recordButton.addEventListener('mouseenter', () => {
    recordButton.style.transform = 'scale(1.3)';
  });
  recordButton.addEventListener('mouseleave', () => {
    recordButton.style.removeProperty('transform');
  });

  // MutationObserverの設定
  const observer = new MutationObserver(mutationCallback);
  observer.observe(document.body, { childList: true, subtree: true });

  // ページを離れたときにオブザーバーを停止
  window.addEventListener('beforeunload', () => {
    observer.disconnect();
  });

  // 関数定義
  function createButtonMargin() {
    const margin = document.createElement('div');
    margin.style.minWidth = '3rem';
    margin.style.width = '3rem';
    return margin;
  }

  function createRecordButton() {
    const button = document.createElement('button');
    button.id = BUTTON_ID;
    return button;
  }

  function handleRecordButtonClick() {
    const videoPlayer = document.querySelector(SELECTORS.videoPlayer);
    const allTitleName = document.querySelector(SELECTORS.videoTitle);

    if (!videoPlayer) {
      console.warn('ビデオプレーヤーが見つかりません。');
      return;
    }

    if (isRecording) {
      endTime = videoPlayer.currentTime;
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
        console.warn('タイトル要素が見つかりません。');
      }
      if(errorDataCheck()){
        return;
      }
      sendData(data);
      isRecording = false;
      svgElement.setAttribute("color", COLOR_DEFAULT);
    } else {
      svgElement.setAttribute("color", COLOR_RECORDING);
      isRecording = true;
      startTime = videoPlayer.currentTime;
    }
  }
  
  function errorDataCheck(){
    if(startTime > endTime){
      [startTime,endTime] = [endTime,startTime];
      console.log("時間入れ替え！！");
    }
    let checkSecond = endTime - startTime
    checkSecond = Math.abs(checkSecond);
    console.log(checkSecond);
    if(checkSecond < 1){
      svgElement.setAttribute("color", COLOR_RECORDING);
      console.log("短いデータは不可");
      recording = true;
      return true;
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
    mutationsList.forEach(mutation => {
      const newPath = window.location.pathname;
      if (currentPath !== newPath) {
        currentPath = newPath;
        console.log("URLの変更を検出しました。");
        svgElement.setAttribute("color", COLOR_DEFAULT);
        isRecording = false;
      }

      if (mutation.type === 'childList') {
        const controlsForward10Element = document.querySelector(SELECTORS.controlForward10);
        if (controlsForward10Element) {
          if (!document.getElementById(BUTTON_ID)) {
            addElements();
          }
        } else {
          if (document.getElementById(BUTTON_ID)) {
            buttonMargin.remove();
            recordButton.remove();
          }
        }
      }
    });
  }
});
function sendData(dataToSend) {
  console.log(dataToSend);
  fetch(window.url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(dataToSend),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log('Success:', data);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}