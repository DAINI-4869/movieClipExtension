
console.log("このサイトに入りました！"); 
document.addEventListener('Load', function() {
    // ターゲット要素をIDで取得
    const targetElement = document.querySelector('#clip-Detail');

    // 要素が存在するか確認
    if (targetElement) {
        // データ属性を取得
        const startTime = targetElement.dataset.starttime; // "998.071031"
        const endTime = targetElement.dataset.endtime; // "1131.689591"

        // コンソールに表示
        console.log('開始時間:', startTime);
        console.log('終了時間:', endTime);

        // 必要であればデータを他の処理に渡す
        return { startTime, endTime };
    } else {
        console.log('対象の要素が見つかりませんでした');
    }
});


