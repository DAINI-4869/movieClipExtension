import { getApiEndpoint } from './../api.js';
import '../image/toggleButtonSVG.js'; 


// ✅ 追加ボタンの挿入処理
(function addAlertButtonNextToLoopBtn() {
  const TARGET_ID = "nf-loop-toggle-btn";       // 既存ボタンのID
  const NEW_BTN_ID = "nf-alert-toggle-btn";     // 新規ボタンのID
  const COLOR_DEFAULT = window.COLOR_RECT_DEFAULT || "#FFFFFF";

  const tryInsert = () => {
    const target = document.getElementById(TARGET_ID);
    if (!target || document.getElementById(NEW_BTN_ID)) return;

    // 新しいSVGボタン作成
    const newSvgBtn = window.createRoundedRectSVG(COLOR_DEFAULT);
    newSvgBtn.id = NEW_BTN_ID;
    newSvgBtn.style.marginLeft = "8px";
    newSvgBtn.addEventListener("click", () => {
      alert("追加ボタンがクリックされました");
    });

    // 既存ボタンの隣に挿入
    target.after(newSvgBtn);
  };

  // DOM監視（UIが遅れて読み込まれるNetflixへの対策）
  const observer = new MutationObserver(tryInsert);
  observer.observe(document.body, { childList: true, subtree: true });
  window.addEventListener("beforeunload", () => observer.disconnect());

  // 最初に一度試みる
  tryInsert();
})();

