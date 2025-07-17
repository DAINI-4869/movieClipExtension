import { getApiEndpoint } from './../utils.js';

(function () {
  const SVG_NS = "http://www.w3.org/2000/svg";
  const BUTTON_ID = "nf-loop-toggle-btn";
  const SIDEBAR_ID = "nf-memo-sidebar";
  const SIDEBAR_PCT = 20;
  const COLOR_DEFAULT = "#FFFFFF";
  const COLOR_LOOPING = "#FF0000";
  let isLooping = false;
  let timer = null;

  // SVGアイコン
  const svgIcon = (() => {
    const svg = document.createElementNS(SVG_NS, "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("width", "120%");
    svg.setAttribute("height", "120%");
    svg.style.color = COLOR_DEFAULT;
    svg.style.transition = "color 0.2s ease";
    svg.innerHTML = `
      <style>
        .loop-icon {
          fill: none;
          stroke: currentColor;
          stroke-width: 1.5;
          stroke-miterlimit: 10;
          stroke-linecap: round;
          stroke-linejoin: round;
        }
      </style>
      <path d="M3.58 5.16H17.42c1.66 0 3 1.34 3 3v3.32"  class="loop-icon"/>
      <path d="M6.74 2l-3.16 3.16L6.74 8.32"              class="loop-icon"/>
      <path d="M20.42 18.84H6.58c-1.66 0-3-1.34-3-3v-3.32" class="loop-icon"/>
      <path d="M17.26 22l3.16-3.16L17.26 15.68"            class="loop-icon"/>
    `;
    return svg;
  })();

  // ループボタン
  const loopButton = (() => {
    const btn = document.createElement("button");
    btn.id = BUTTON_ID;
    btn.setAttribute("aria-label", "メモサイドバー開閉");
    btn.appendChild(svgIcon);
    btn.style.cursor = "pointer";
    btn.addEventListener("click", () => {
      isLooping = !isLooping;
      svgIcon.style.color = isLooping ? COLOR_LOOPING : COLOR_DEFAULT;
      toggleSidebar();
    });
    return btn;
  })();

  // Netflix UI に挿入
  const SELECTOR_STANDARD = '[data-uia="controls-standard"]';
  const SELECTOR_EPISODE = '[data-uia="control-episodes"]';
  const SELECTOR_FWD10 = '[data-uia="control-forward10"]';

  const uiObserver = new MutationObserver(() => {
    const controls = document.querySelector(SELECTOR_STANDARD);
    const episodeBtn = document.querySelector(SELECTOR_EPISODE);
    if (controls && episodeBtn && !document.getElementById(BUTTON_ID)) {
      loopButton.className = episodeBtn.className;
      const wrapper = document.createElement("div");
      wrapper.className = episodeBtn.parentNode.className;
      episodeBtn.parentNode.after(wrapper);
      wrapper.appendChild(loopButton);

      const spacer = document.createElement("div");
      spacer.style.minWidth = "3rem";
      episodeBtn.parentNode.after(spacer);
    }
    if (!document.querySelector(SELECTOR_FWD10) && document.getElementById(BUTTON_ID)) {
      loopButton.remove();
    }
  });
  uiObserver.observe(document.body, { childList: true, subtree: true });
  window.addEventListener("beforeunload", () => uiObserver.disconnect());

  // サイドバーのトグル
  function toggleSidebar() {
    const sb = document.getElementById(SIDEBAR_ID);
    sb ? closeSidebar() : openSidebar();
  }

  function openSidebar() {
    const player = document.querySelector(".watch-video--player-view");
    if (!player) return;
    player.style.transition = "width .3s";
    player.style.width = `calc(100% - ${SIDEBAR_PCT}%)`;

    const sb = document.createElement("div");
    sb.id = SIDEBAR_ID;
    sb.style.cssText = `
      position:fixed;top:0;right:0;width:${SIDEBAR_PCT}%;
      height:100%;background:rgba(0,0,0,.9);color:white;
      padding:10px;box-sizing:border-box;z-index:9999;
      display:flex;flex-direction:column;gap:10px;overflow-y:auto;
      font-size:12px;`;

    const header = document.createElement("div");
    header.style.cssText = "display:flex;justify-content:space-between;align-items:center;";
    const title = document.createElement("strong");
    title.textContent = "記録一覧";
    const closeBtn = document.createElement("button");
    closeBtn.textContent = "×";
    closeBtn.style.cssText = "background:red;color:#fff;border:none;cursor:pointer;font-size:14px;";
    closeBtn.onclick = toggleSidebar;
    header.append(title, closeBtn);
    sb.appendChild(header);

    const listContainer = document.createElement("div");
    listContainer.id = "nf-api-list";
    listContainer.textContent = "読込中…";
    sb.appendChild(listContainer);

    document.body.appendChild(sb);

    fetchDataAndRender(listContainer);
  }

  function closeSidebar() {
    const player = document.querySelector(".watch-video--player-view");
    if (player) player.style.width = "100%";
    document.getElementById(SIDEBAR_ID)?.remove();
    clearInterval(timer);
  }

  // API 取得 → 表示
  async function fetchDataAndRender(container) {
    try {
      const res = await fetch(getApiEndpoint('random10'));
      const data = await res.json();
      const items = data.allReceivedData || [];

      if (!items.length) {
        container.textContent = "データがありません。";
        return;
      }

      container.innerHTML = "";
      for (const item of items) {
        const entry = document.createElement("div");
        entry.style.cssText = "border-bottom:1px solid #555;padding:4px 0;";
        entry.innerHTML = `
          <div><strong>${item.title}（${item.epnumber}）</strong></div>
          <div>ユーザー: ${item.user}</div>
          <div>範囲: ${formatTime(item.startTime)} - ${formatTime(item.endTime)}</div>
        `;
        container.appendChild(entry);
      }
    } catch (err) {
      container.textContent = "データの取得に失敗しました。";
      console.error("API取得失敗:", err);
    }
  }

  function formatTime(sec) {
    const s = Math.floor(sec % 60).toString().padStart(2, "0");
    const m = Math.floor(sec / 60);
    return `${m}:${s}`;
  }
})();
