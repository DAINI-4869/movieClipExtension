// カスタムイベントが実行されたら実行
window.addEventListener("clipListElementsRendered", () => {
    console.log("このclipを読み込みました！");
});
window.addEventListener("clipSelected", () => {
    console.log("このclipを選択しました！");
    //cookieを読み込む
    
    //再生機能を起動

});

