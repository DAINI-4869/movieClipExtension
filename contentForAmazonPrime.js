// 動画上にオーバーレイボタンを追加する関数
function addOverlayButtonToVideo(video, disappearanceTime = 5000) {
  // video の親要素を relative に設定（絶対配置用）
  const parent = video.parentElement;
  if (getComputedStyle(parent).position === "static") {
    parent.style.position = "relative";
  }

  // オーバーレイ用のコンテナを作成
  const overlayContainer = document.createElement("div");
  overlayContainer.style.position = "absolute";
  overlayContainer.style.top = "10px";       // 調整可能（例：動画の上部から10px）
  overlayContainer.style.right = "10px";     // 調整可能（例：動画の右端から10px）
  overlayContainer.style.zIndex = "9999";      // 動画より上に表示するため高い値
  // ボタンに対してマウス操作が有効になるように
  overlayContainer.style.pointerEvents = "none"; 

  // 実際のボタンを作成（pointerEvents は親ではなくボタンに設定）
  const button = document.createElement("button");
  button.textContent = "Click Me";  // ボタンに表示するテキスト（必要に応じて変更）
  button.style.backgroundColor = "blue";
  button.style.color = "white";
  button.style.border = "none";
  button.style.padding = "10px 20px";
  button.style.cursor = "pointer";
  button.style.borderRadius = "4px";
  button.style.outline = "none";
  // 親コンテナの pointerEvents が none のため、ボタン側でマウスイベントを有効にする
  button.style.pointerEvents = "auto";

  // フォーカス時のスタイル（青いボックスシャドウ）を設定
  button.addEventListener("focus", function() {
    button.style.boxShadow = "0 0 0 2px rgba(0, 0, 255, 0.5)";
  });
  button.addEventListener("blur", function() {
    button.style.boxShadow = "none";
  });

  // 必要ならクリック時の挙動などを追加
  button.addEventListener("click", function(event) {
    event.stopPropagation();
    alert("Overlay Button Clicked!");
  });

  // オーバーレイコンテナにボタンを追加し、動画の親要素に配置
  overlayContainer.appendChild(button);
  parent.appendChild(overlayContainer);

  // 指定時間後にオーバーレイを非表示にする（disappearanceTime はミリ秒単位）
  setTimeout(() => {
    overlayContainer.style.display = "none";
  }, disappearanceTime);
}

// ページ内のすべての video 要素に対してオーバーレイを追加
function initOverlayButtons() {
  const videos = document.getElementsByTagName("video");
  for (const video of videos) {
    // 存在する動画に対してオーバーレイボタンを追加
    addOverlayButtonToVideo(video, 5000);  // 5000 ミリ秒（5 秒）後に消える
  }
}

// DOM の読み込み完了後に実行
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initOverlayButtons);
} else {
  initOverlayButtons();
}
