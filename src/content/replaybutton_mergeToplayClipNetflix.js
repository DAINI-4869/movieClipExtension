(function () {
  const BUTTON_ID = "nf-loop-toggle-btn";
  const SIDEBAR_ID = "nf-memo-sidebar";
  const SIDEBAR_PCT = 20;
  const COLOR_DEFAULT = window.COLOR_DETAIL_DEFAULT || "#FFFFFF";
  const COLOR_LOOPING = window.COLOR_DETAIL_ACTIVE || "#FF0000";
  let isLooping = false;
  let timer = null;

  // SVGアイコン
  const svgIcon = window.createMoreDetailSVG(COLOR_DEFAULT);

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
      const res = await fetch(window.getUrl);
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
        const jumpBtn = document.createElement("button");
        jumpBtn.textContent = "▶ このClipへジャンプ";
        jumpBtn.style.cssText = "margin-top:4px;background:#0f0;color:#000;border:none;padding:4px 8px;cursor:pointer;";
        jumpBtn.onclick = () => {
          console.log("このclipを選択しました！");
          selectClip(item.id);
        };
        entry.appendChild(jumpBtn);
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
  //Clip選択時の処理
  async function selectClip(clipId) {
    console.log("Clip selected:", clipId);

    const url = `http://localhost:3000/api/fetchClip?id=${encodeURIComponent(clipId)}`;

    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const raw = await res.text();
      console.log("Raw response:", raw);

      const clipData = JSON.parse(raw);
      console.log("取得クリップデータ:", clipData);

      setClipDataOnCookies(clipData);  // Cookie保存
      redirectToClip(clipData);        // リンクにジャンプ

    } catch (err) {
      console.error("クリップ選択処理でエラー:", err);
    }
  }

  //Cookieへ保存
  function setClipDataOnCookies(data) {
    const keys = ["title", "user", "startTime", "endTime", "url", "service"];
    for (const key of keys) {
      if (data[key] !== undefined) {
        const encoded = encodeURIComponent(data[key]);
        document.cookie = `${key}=${encoded}; path=/; max-age=3600; SameSite=Lax; secure`;
        console.log(`🍪 Cookie set: ${key} = ${encoded}`);
      }
    }
  }

  //対象サービスごとにジャンプ
  function redirectToClip({ url, service, startTime }) {
    if (!url || !service) {
      alert("URL または サービス情報が不正です");
      return;
    }

    let baseUrl;
    switch (service.toLowerCase()) {
      case "netflix":
        baseUrl = `https://www.netflix.com${url}`;
        break;
      case "amazon":
        baseUrl = `https://www.amazon.co.jp${url}`;
        break;
      case "youtube":
        baseUrl = `https://www.youtube.com${url}`;
        break;
      default:
        alert(`未対応のサービス: ${service}`);
        return;
    }

    const finalUrl = baseUrl + (baseUrl.includes("?") ? "&" : "?") + "t=" + Math.floor(startTime);
    window.location.assign(finalUrl, "_blank");
    console.log("再生位置付きで開きます:", finalUrl);
  }

})();
