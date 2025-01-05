// ページが完全にロードされたら実行
window.addEventListener("load", () => {
    console.log("このサイトに完全に入りました！");

    // 全ての clipedbutton ボタンを取得
    const buttons = document.querySelectorAll("#clipedbutton");

    if (buttons.length > 0) {
        console.log(`見つかったボタンの数: ${buttons.length}`);

        buttons.forEach((button) => {
            // 各ボタンにクリックイベントを追加
            button.addEventListener("click", (event) => {
                event.preventDefault(); // 元の動作を無効化
                console.log("ボタンがクリックされました！");

                // 親要素（`#clip-Detail`）を取得
                const parentElement = button.closest("#clip-Detail");

                if (parentElement) {
                    // `data-starttime` と `data-endtime` を取得
                    const startTime = parentElement.getAttribute("data-starttime");
                    const endTime = parentElement.getAttribute("data-endtime");

                    console.log(`Start Time: ${startTime}, End Time: ${endTime}`);

                    // 必要に応じて処理
                    alert(`Start Time: ${startTime}, End Time: ${endTime}`);
                } else {
                    console.log("親要素が見つかりませんでした。");
                }
            });

            // ボタンの表示を変更（必要に応じて追加）
            button.textContent = "Modified Netflix";
            console.log("ボタンのテキストを変更しました。");
        });
    } else {
        console.log("ボタンが見つかりませんでした。");
    }
});
