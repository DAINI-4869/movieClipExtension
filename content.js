(() => {
  /* ==========================  定数  =========================== */
  const SVG_NS           = 'http://www.w3.org/2000/svg';
  const BTN_ID           = 'nr-record-btn';
  const COLOR_DEFAULT    = '#FFFFFF';
  const COLOR_RECORDING  = '#FF0000';
  const SELECTOR = {
    video          : 'video',
    titleContainer : '[data-uia="video-title"]',
    controls       : '[data-uia="controls-standard"]',
    volBtn         : '[data-uia="control-volume-high"]',
    fwd10Btn       : '[data-uia="control-forward10"]', // “再生UIが出た?” 判断用
  };

  /* ======================  ユーティリティ  ===================== */
  const qs  = (sel, root = document) => root.querySelector(sel);
  const qsa = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const wait = ms => new Promise(r => setTimeout(r, ms));

  /* ========================  クラス本体  ======================= */
  class NetflixRecorder {
    /* ----- 状態 ----- */
    #isRec     = false;
    #startTime = 0;
    #svg       = null;
    #btn       = null;
    #margin    = null;
    #observer  = null;

    /* ----- 初期化 ----- */
    async init() {
      this.#injectHistoryHook();                   // SPA遷移検知
      this.#createDom();                           // ボタン等を生成
      this.#appendOnUiReady();                     // 初回 UI 挿入
      this.#setupMutationObserver();               // UI が非同期生成される対策
      window.addEventListener('beforeunload', () => this.#observer.disconnect());
    }

    /* ----- DOM生成 ----- */
    #createDom() {
      // マージン
      this.#margin = document.createElement('div');
      Object.assign(this.#margin.style, { minWidth: '3rem', width: '3rem' });

      // ボタン
      this.#btn = document.createElement('button');
      this.#btn.id = BTN_ID;
      this.#btn.ariaLabel = '録画ボタン';
      this.#btn.addEventListener('click', () => this.#toggleRecord());

      // SVG アイコン
      this.#svg = this.#buildSvg();
      this.#btn.appendChild(this.#svg);
    }

    #buildSvg() {
      const svg = document.createElementNS(SVG_NS, 'svg');
      svg.setAttribute('viewBox', '0 0 24 24');
      svg.setAttribute('width',  '120%');
      svg.setAttribute('height', '120%');
      svg.style.color = COLOR_DEFAULT;

      const style = document.createElementNS(SVG_NS, 'style');
      style.textContent = '.s{fill:none;stroke:currentColor;stroke-miterlimit:10;}';
      svg.append(style);

      const elems = [
        ['rect'   , { class: 's', x: 1.5,  y: 9.14, width: 15.27, height: 12.41 }],
        ['polygon', { class: 's', points: '16.77 17.73 21.55 21.55 22.5 21.55 22.5 9.14 21.55 9.14 16.77 12.96 16.77 17.73'}],
        ['circle' , { class: 's', cx: 4.84 , cy: 5.8 , r: 3.34 }],
        ['circle' , { class: 's', cx: 13.43, cy: 5.8 , r: 3.34 }],
        ['polygon', { class: 's', points: '7.23 16.77 7.23 13.91 10.09 15.34 7.23 16.77'}],
      ];
      elems.forEach(([tag, attrs]) => {
        const el = document.createElementNS(SVG_NS, tag);
        Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
        svg.appendChild(el);
      });
      return svg;
    }

    /* ----- UI にボタンを差し込む ----- */
    #appendOnUiReady() {
      const controls = qs(SELECTOR.controls);
      const volBtn   = qs(SELECTOR.volBtn);
      if (!controls || !volBtn) return;

      // Netflix の既存クラスを流用して違和感ない見た目に
      this.#btn.className    = volBtn.className;              // 大きさ・余白
      this.#margin.className = volBtn.parentNode.className;   // ボタン周囲のラッパと同格
      volBtn.parentNode.after(this.#margin);
      volBtn.parentNode.after(this.#btn);
    }

    /* ----- MutationObserver で UI 出現を監視 ----- */
    #setupMutationObserver() {
      this.#observer = new MutationObserver(() => {
        // “10秒送り” ボタンが有無の瞬間に合わせて追従
        if (qs(SELECTOR.fwd10Btn) && !qs(`#${BTN_ID}`)) {
          this.#appendOnUiReady();
        } else if (!qs(SELECTOR.fwd10Btn) && qs(`#${BTN_ID}`)) {
          this.#btn.remove();
          this.#margin.remove();
        }
      });
      this.#observer.observe(document.body, { childList: true, subtree: true });
    }

    /* ----- 録画トグル ----- */
    #toggleRecord() {
      const video = qs(SELECTOR.video);
      if (!video) { return alert('ビデオ要素が見つかりません'); }

      if (!this.#isRec) {                // ---- 録画開始 ----
        this.#isRec     = true;
        this.#startTime = video.currentTime;
        this.#svg.style.color = COLOR_RECORDING;
        return;
      }

      /* ---- 録画終了 ---- */
      const end = video.currentTime;
      const span = end - this.#startTime;

      try {
        if (span < 1)  throw new Error('録画範囲が 1秒 未満です');
        if (span < 0)  throw new Error('終了時刻が開始時刻より前です');
        const payload = this.#buildPayload(this.#startTime, end);
        this.#post(payload);
      } catch (err) {
        console.error(err);
        alert(err.message);
      } finally {
        this.#resetState();
      }
    }

    /* ----- 送信データを組み立て ----- */
    #buildPayload(start, end) {
      const titleBox = qs(SELECTOR.titleContainer);
      if (!titleBox) throw new Error('タイトル要素が取得できません');

      /** @type {{title:string, ep?:string}} */
      const titleInfo = (() => {
        const h4 = qs('h4', titleBox);
        if (h4) {   // シリーズ作品
          return {
            title : h4.textContent.trim(),
            ep    : qs('span:nth-of-type(1)', titleBox)?.textContent.trim() || ''
          };
        }
        return { title: titleBox.textContent.trim() };
      })();

      return {
        ...titleInfo,
        startTime : start,
        endTime   : end,
        url       : location.pathname,
        recordedAt: new Date().toISOString(),
      };
    }

    /* ----- サーバーへ送信 ----- */
    async #post(data) {
      try {
        const res = await fetch(window.url, {
          method : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body   : JSON.stringify(data),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        console.log('[NetflixRecorder] Upload success');
      } catch (e) {
        console.error('[NetflixRecorder] Upload failed', e);
        alert('データ送信に失敗しました');
      }
    }

    /* ----- 状態リセット ----- */
    #resetState() {
      this.#isRec = false;
      this.#svg.style.color = COLOR_DEFAULT;
    }

    /* ----- SPA履歴遷移フック (history_change.js)----- */
    #injectHistoryHook() {
      const script = document.createElement('script');
      script.src   = chrome.runtime.getURL('history_change.js');
      script.onload = () => script.remove();
      document.head.append(script);

      window.addEventListener('historyChange', e => {
        this.#resetState();
        chrome.runtime.sendMessage({ type: 'HISTORY_CHANGE', data: e.detail });
      });
    }
  }

  /* ========================  起動 ======================== */
  document.addEventListener('DOMContentLoaded', () => new NetflixRecorder().init());
})();
