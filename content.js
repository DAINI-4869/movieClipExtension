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
    const alltitlename =  document.querySelector('[data-uia="video-title"]');    //titleの全情報を取得
    if (recording) {
      let titlename;
  
      if(alltitlename){
        const h4Element = alltitlename.querySelector('h4');

        if(h4Element){
          //シリーズ作品の場合
          titlename = alltitlename.querySelector('h4').textContent;//エピソード名を取得
          let episodenumber = document.querySelector('div[data-uia="video-title"] span:nth-of-type(1)').textContent; //エピソード番号を取得
          let subtitle = document.querySelector('div[data-uia="video-title"] span:nth-of-type(2)').textContent;    //サブタイトルを取得

          Endgettime = videoPlayer.currentTime;
          sendData({ StartTime: Startgettime, EndTime: Endgettime ,URL: path , title: titlename , epnumber : episodenumber}); 
        } else {
          //シリーズ作品ではない場合　
          titlename = alltitlename.textContent;//エピソード名を取得

          Endgettime = videoPlayer.currentTime;
          sendData({ StartTime: Startgettime, EndTime: Endgettime ,URL: path , title: titlename }); 
          
        }
      }else{
        //error時にも一応遅れるだけ送れるようにしてある。
        console.log('[data-uia="video-title"] 属性を持つ要素が存在しません。');
        Endgettime = videoPlayer.currentTime;
        sendData({ StartTime: Startgettime, EndTime: Endgettime ,URL: path }); 
      }
    
      recording = false;
      recordButton.style.borderRadius = '50%'

    } else {
      recording = true;
      recordButton.style.borderRadius = '0%'
      Startgettime = videoPlayer.currentTime;
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
        checkurl = true;
        console.log("urlの変更を検出しました",checkurl); 
      }

      

      if (mutation.type === 'childList') {
        const controlsForward10Element = document.querySelector('[data-uia="control-forward10"]'); // 広告時に表示しないため
        if (controlsForward10Element) {
          // 既にボタンが追加されていない場合のみ追加
          if (!document.getElementById('overlay-button')) {
              createButton();
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
