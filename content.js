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
  // SVG要素の作成
  const svgNS = "http://www.w3.org/2000/svg";
  const svgElement = document.createElementNS(svgNS, "svg");

  // SVG属性の設定
  svgElement.setAttribute("id", "Layer_1");
  svgElement.setAttribute("data-name", "Layer 1");
  svgElement.setAttribute("xmlns", svgNS);
  svgElement.setAttribute("viewBox", "0 0 24 24");
  svgElement.setAttribute("stroke-width", "1.5");
  svgElement.setAttribute("width", "120%");
  svgElement.setAttribute("height", "120%");
  svgElement.setAttribute("color", "#FFFFFF");

  // スタイル定義
  const style = document.createElementNS(svgNS, "style");
  style.textContent = ".cls-637630c1c3a86d32eae6f029-1{fill:none;stroke:currentColor;stroke-miterlimit:10;}";
  svgElement.appendChild(style);

  // rect要素の作成
  const rectElement = document.createElementNS(svgNS, "rect");
  rectElement.setAttribute("class", "cls-637630c1c3a86d32eae6f029-1");
  rectElement.setAttribute("x", "1.5");
  rectElement.setAttribute("y", "9.14");
  rectElement.setAttribute("width", "15.27");
  rectElement.setAttribute("height", "12.41");
  svgElement.appendChild(rectElement);

  // polygon要素の作成 (1つ目)
  const polygonElement1 = document.createElementNS(svgNS, "polygon");
  polygonElement1.setAttribute("class", "cls-637630c1c3a86d32eae6f029-1");
  polygonElement1.setAttribute("points", "16.77 17.73 21.55 21.55 22.5 21.55 22.5 9.14 21.55 9.14 16.77 12.96 16.77 17.73");
  svgElement.appendChild(polygonElement1);

  // circle要素の作成 (1つ目)
  const circleElement1 = document.createElementNS(svgNS, "circle");
  circleElement1.setAttribute("class", "cls-637630c1c3a86d32eae6f029-1");
  circleElement1.setAttribute("cx", "4.84");
  circleElement1.setAttribute("cy", "5.8");
  circleElement1.setAttribute("r", "3.34");
  svgElement.appendChild(circleElement1);

  // circle要素の作成 (2つ目)
  const circleElement2 = document.createElementNS(svgNS, "circle");
  circleElement2.setAttribute("class", "cls-637630c1c3a86d32eae6f029-1");
  circleElement2.setAttribute("cx", "13.43");
  circleElement2.setAttribute("cy", "5.8");
  circleElement2.setAttribute("r", "3.34");
  svgElement.appendChild(circleElement2);

  // polygon要素の作成 (2つ目)
  const polygonElement2 = document.createElementNS(svgNS, "polygon");
  polygonElement2.setAttribute("class", "cls-637630c1c3a86d32eae6f029-1");
  polygonElement2.setAttribute("points", "7.23 16.77 7.23 13.91 10.09 15.34 7.23 16.77");
  svgElement.appendChild(polygonElement2);

  // SVG要素をrecordButtonに追加
  recordButton.appendChild(svgElement);

  let recording = false;
  let Startgettime;
  let Endgettime;
  //urlを取得
  let path = window.location.pathname;

  recordButton.addEventListener('click', function() {
    const videoPlayer = document.querySelector('video'); 
    const allTitleName =  document.querySelector('[data-uia="video-title"]');    //titleの全情報を取得
    if (recording) {
      let titleName;
  
      if(allTitleName){
        const h4Element = allTitleName.querySelector('h4');

        if(h4Element){
          //シリーズ作品の場合
          titleName = allTitleName.querySelector('h4').textContent;//エピソード名を取得
          let episodeNumber = document.querySelector('div[data-uia="video-title"] span:nth-of-type(1)').textContent; //エピソード番号を取得
          let subtitle = document.querySelector('div[data-uia="video-title"] span:nth-of-type(2)').textContent;    //サブタイトルを取得
          Endgettime = videoPlayer.currentTime;
          sendData({ StartTime: Startgettime, EndTime: Endgettime ,URL: path , title: titleName , epnumber : episodeNumber}); 
        } else {
          //シリーズ作品ではない場合　
          titleName = allTitleName.textContent;//エピソード名を取得
          Endgettime = videoPlayer.currentTime;
          sendData({ StartTime: Startgettime, EndTime: Endgettime ,URL: path , title: titleName }); 
          
        }
      }else{
        //error時にも一応送れるだけ送れるようにしてある。
        console.warn('[data-uia="video-title"] 属性を持つ要素が存在しません。');
        Endgettime = videoPlayer.currentTime;
        sendData({ StartTime: Startgettime, EndTime: Endgettime ,URL: path }); 

      }

      svgElement.setAttribute("color", "#FFFFFF");

      recording = false;
    } else {
      recording = true;
      Startgettime = videoPlayer.currentTime;
      svgElement.setAttribute("color", "#FF0000");
    }
  });

  function createButton() {
    const controlsStandardElement = document.querySelector('[data-uia="controls-standard"]');
    if (controlsStandardElement) {
      const controlVolumeElement = document.querySelector('[data-uia="control-volume-high"]');
      recordButton.className = controlVolumeElement.className;
      wrapButton.className = controlVolumeElement.parentNode.className;
      controlVolumeElement.parentNode.after(wrapButton);
      wrapButton.appendChild(recordButton);
      controlVolumeElement.parentNode.after(buttonMargin);
    }
  }


  function mutationCallback(mutationsList) {
    mutationsList.forEach(mutation => {
      let nowpath = window.location.pathname;
      if(path != nowpath){
        path = nowpath;
        console.log("urlの変更を検出しました"); 
        //レコーディング中にurlの変更を検出した場合、レコーディング前に戻す

        svgElement.setAttribute("color", "#FFFFFF");
        recording = false;
      }
      if (mutation.type === 'childList') {
        const controlsForward10Element = document.querySelector('[data-uia="control-forward10"]'); // 広告時に表示しないため
        if (controlsForward10Element) {
          // 既にボタンが追加されていない場合のみ追加
          if (!document.getElementById('overlay-button')) {
              createButton();
              recordButton.style.backgroundColor = 'transparent';
              recordButton.style.color = 'transparent';
          }
        } else {
          if (document.getElementById('overlay-button')) {
            buttonMargin.remove();
            recordButton.remove();
          }
        }
      }
    });
  }

  const observerOptions = {
      childList: true,
      subtree: true
  };
  
  

  // body要素を監視対象に設定
  const observer = new MutationObserver(mutationCallback);
  observer.observe(document.body, observerOptions);

  // ページを離れたときにオブザーバーを停止
  window.addEventListener('beforeunload', function() {
    observer.disconnect();
  });
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
