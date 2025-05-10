const targetSelector = "div.fmugii2.atvwebplayersdk-seekbar-container.show";


function waitForVideoAndWatch() {
  const checkInterval = setInterval(() => {
    const video = document.querySelector('video');
    if (video) {
      console.log('video要素が見つかりました。');
      clearInterval(checkInterval);

      video.addEventListener('play', () => {
        console.log('再生開始検知gill');
      });
    }

    const element = document.querySelector(targetSelector);
    if (element) {
      console.log("要素が存在します: ", element);
    } else {
      console.log("指定の要素は見つかりませんでした。");
    }

  }, 500);
}

waitForVideoAndWatch();
