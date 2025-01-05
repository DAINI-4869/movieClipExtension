// ページが完全に読み込まれた後に実行
window.addEventListener("load", () => {
    console.log("このサイトに完全に入りました！");

    // MutationObserverを使用してDOMの変更を監視
    const observer = new MutationObserver(() => {
        const buttons = document.querySelectorAll(".clipedbutton"); // ボタンをクラスで選択

        if (buttons.length > 0) {
            console.log(`見つかったボタンの数: ${buttons.length}`);

            buttons.forEach((button) => {
                // すでにリスナーが追加されている場合はスキップ
                if (button.dataset.listenerAdded) return;

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

                // ボタンの表示を変更（例: テキスト変更）
                button.textContent = "Modified Netflix";
                console.log("ボタンのテキストを変更しました。");

                // リスナー追加済みのフラグを設定
                button.dataset.listenerAdded = "true";
            });
        }
    });

    // DOM変更の監視を開始
    observer.observe(document.body, { childList: true, subtree: true });
});
