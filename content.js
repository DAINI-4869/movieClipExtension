window.addEventListener('load', function() {
  // ボタンを一度作成しておく
  const button = document.createElement('button');
  button.id = 'overlay-button';
  button.textContent = '記録する';
  let recording = false;
  let Startgettime;
  let Endgettime;

//urlを取得
let path = window.location.pathname;
let nowpath ;
console.log(path);

  button.addEventListener('click', function() {
    const videoPlayer = document.querySelector('video');
    if (recording) {
      recording = false;
      button.textContent = '記録する';
      Endgettime = videoPlayer.currentTime;
      sendData({ StartTime: Startgettime, EndTime: Endgettime });

    } else {
      recording = true;
      button.textContent = '記録中';
      Startgettime = videoPlayer.currentTime;
    }
  });

  // ボタンのスタイルを設定
  const style = document.createElement('style');
  style.textContent = `
      #overlay-button {
          position: absolute;
          // top: 10px;
          // left: 10px;
          z-index: 1000;
          padding: 10px 20px;
          background-color: #ff0000;
          color: #ffffff;
          border: none;
          border-radius: 5px;
          cursor: pointer;
      }
  `;
  document.head.appendChild(style);

  function updateButtonPosition() {
    const timelineElement = document.querySelector('[data-uia="timeline"]');
    if (timelineElement) {
        const rect = timelineElement.getBoundingClientRect();
        button.style.top = rect.top + 100 + 'px';
        button.style.left = rect.left + 'px';
    }
  }

  function mutationCallback(mutationsList) {


    mutationsList.forEach(mutation => {
      nowpath = window.location.pathname;
          if(path === nowpath){
            return 
            //console.log("clear!!")
          }else{
            //console.log(path , nowpath);
            path = nowpath;
            console.log("urlの変更を検出しました");
          }
          //console.log("変化が検出されました: ", mutation);

          if (mutation.type === 'childList') {
              const timelineElement = document.querySelector('[data-uia="timeline"]');
              if (timelineElement) {
                  // 既にボタンが追加されていない場合のみ追加
                  if (!document.getElementById('overlay-button')) {
                      document.body.appendChild(button);
                      updateButtonPosition();
                  }
              } else {
                  if (document.getElementById('overlay-button')) {
                      button.remove();
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
