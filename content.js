window.addEventListener('load', function() {
  // ボタンとdivを一度作成しておく
  const buttonMargin = document.createElement('div');
  buttonMargin.style.minWidth = '3rem';
  buttonMargin.style.width = '3rem';
  const wrapButton = document.createElement('div');
  const recordButton = document.createElement('button');
  recordButton.id = 'record-button';
  recordButton.style.backgroundColor = '#FF0000';
  recordButton.style.color = '#FFFFFF';
  recordButton.style.width = '44px';
  recordButton.style.height = '44px';
  recordButton.style.borderRadius = '50%'
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
      recordButton.innerHTML = `<svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="1.5" width="120%" height="120%" color="#FFFFFF"><defs><style>.cls-637630c1c3a86d32eae6f029-1{fill:none;stroke:currentColor;stroke-miterlimit:10;}</style></defs><rect class="cls-637630c1c3a86d32eae6f029-1" x="1.5" y="9.14" width="15.27" height="12.41"></rect><polygon class="cls-637630c1c3a86d32eae6f029-1" points="16.77 17.73 21.55 21.55 22.5 21.55 22.5 9.14 21.55 9.14 16.77 12.96 16.77 17.73"></polygon><circle class="cls-637630c1c3a86d32eae6f029-1" cx="4.84" cy="5.8" r="3.34"></circle><circle class="cls-637630c1c3a86d32eae6f029-1" cx="13.43" cy="5.8" r="3.34"></circle><polygon class="cls-637630c1c3a86d32eae6f029-1" points="7.23 16.77 7.23 13.91 10.09 15.34 7.23 16.77"></polygon></svg>`;
      recording = false;
    } else {
      recording = true;
      Startgettime = videoPlayer.currentTime;
      recordButton.innerHTML =`<svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="2" width="120%" height="120%" color="#ff0000"><defs><style>.cls-637630c1c3a86d32eae6f029-1{fill:none;stroke:currentColor;stroke-miterlimit:10;}</style></defs><rect class="cls-637630c1c3a86d32eae6f029-1" x="1.5" y="9.14" width="15.27" height="12.41"></rect><polygon class="cls-637630c1c3a86d32eae6f029-1" points="16.77 17.73 21.55 21.55 22.5 21.55 22.5 9.14 21.55 9.14 16.77 12.96 16.77 17.73"></polygon><circle class="cls-637630c1c3a86d32eae6f029-1" cx="4.84" cy="5.8" r="3.34"></circle><circle class="cls-637630c1c3a86d32eae6f029-1" cx="13.43" cy="5.8" r="3.34"></circle><polygon class="cls-637630c1c3a86d32eae6f029-1" points="7.23 16.77 7.23 13.91 10.09 15.34 7.23 16.77"></polygon></svg>`;

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
        recordButton.innerHTML =`<svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="1.5" width="120%" height="120%" color="#FFFFFF"><defs><style>.cls-637630c1c3a86d32eae6f029-1{fill:none;stroke:currentColor;stroke-miterlimit:10;}</style></defs><rect class="cls-637630c1c3a86d32eae6f029-1" x="1.5" y="9.14" width="15.27" height="12.41"></rect><polygon class="cls-637630c1c3a86d32eae6f029-1" points="16.77 17.73 21.55 21.55 22.5 21.55 22.5 9.14 21.55 9.14 16.77 12.96 16.77 17.73"></polygon><circle class="cls-637630c1c3a86d32eae6f029-1" cx="4.84" cy="5.8" r="3.34"></circle><circle class="cls-637630c1c3a86d32eae6f029-1" cx="13.43" cy="5.8" r="3.34"></circle><polygon class="cls-637630c1c3a86d32eae6f029-1" points="7.23 16.77 7.23 13.91 10.09 15.34 7.23 16.77"></polygon></svg>`;
        recording = false;
      }
      if (mutation.type === 'childList') {
        const controlsForward10Element = document.querySelector('[data-uia="control-forward10"]'); // 広告時に表示しないため
        if (controlsForward10Element) {
          // 既にボタンが追加されていない場合のみ追加
          if (!document.getElementById('record-button')) {
              createButton();
              if(recording){
                recordButton.innerHTML =`<svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="1.5" width="120%" height="120%" color="#FF0000"><defs><style>.cls-637630c1c3a86d32eae6f029-1{fill:none;stroke:currentColor;stroke-miterlimit:10;}</style></defs><rect class="cls-637630c1c3a86d32eae6f029-1" x="1.5" y="9.14" width="15.27" height="12.41"></rect><polygon class="cls-637630c1c3a86d32eae6f029-1" points="16.77 17.73 21.55 21.55 22.5 21.55 22.5 9.14 21.55 9.14 16.77 12.96 16.77 17.73"></polygon><circle class="cls-637630c1c3a86d32eae6f029-1" cx="4.84" cy="5.8" r="3.34"></circle><circle class="cls-637630c1c3a86d32eae6f029-1" cx="13.43" cy="5.8" r="3.34"></circle><polygon class="cls-637630c1c3a86d32eae6f029-1" points="7.23 16.77 7.23 13.91 10.09 15.34 7.23 16.77"></polygon></svg>`;
              }else{
                recordButton.innerHTML =`<svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="1.5" width="120%" height="120%" color="#FFFFFF"><defs><style>.cls-637630c1c3a86d32eae6f029-1{fill:none;stroke:currentColor;stroke-miterlimit:10;}</style></defs><rect class="cls-637630c1c3a86d32eae6f029-1" x="1.5" y="9.14" width="15.27" height="12.41"></rect><polygon class="cls-637630c1c3a86d32eae6f029-1" points="16.77 17.73 21.55 21.55 22.5 21.55 22.5 9.14 21.55 9.14 16.77 12.96 16.77 17.73"></polygon><circle class="cls-637630c1c3a86d32eae6f029-1" cx="4.84" cy="5.8" r="3.34"></circle><circle class="cls-637630c1c3a86d32eae6f029-1" cx="13.43" cy="5.8" r="3.34"></circle><polygon class="cls-637630c1c3a86d32eae6f029-1" points="7.23 16.77 7.23 13.91 10.09 15.34 7.23 16.77"></polygon></svg>`;
              }
              recordButton.style.backgroundColor = 'transparent';
              recordButton.style.color = 'transparent';
          }
        } else {
          if (document.getElementById('record-button')) {
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
