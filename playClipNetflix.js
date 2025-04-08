// == Netflix Clip Player Content Script ==
// This content‑script plays a specific clip on Netflix between starttime and endtime
// that are stored in chrome.storage.local under the key "clip".
// -----------------------------------------------------------------------------

(() => {
  'use strict';

  // ---------------------------------------------------------------------------
  // Globals
  // ---------------------------------------------------------------------------
  let videoPlayer = null;   // <video> element reference
  let clipData    = null;   // { starttime, endtime, name, title, username }

  // End-time detection tolerance (seconds)
  const EPSILON = 0.05;
  let countdownIntervalId = null;

  // ---------------------------------------------------------------------------
  // Add clip tag to URL if missing
  // ---------------------------------------------------------------------------
  function ensureClipTagInURL() {
    if (!window.location.search.includes('clip=1')) {
      const url = new URL(window.location.href);
      url.searchParams.set('clip', '1');
      window.location.href = url.toString();
    }
  }

  // ---------------------------------------------------------------------------
  // 1) Read clip info from chrome.storage.local
  // ---------------------------------------------------------------------------
  function loadClipFromStorage() {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get(['playClipSystemKey', 'clip'], res => {
        if (chrome.runtime.lastError) {
          return reject(chrome.runtime.lastError);
        }

        if (res.playClipSystemKey === 1 && res.clip) {
          clipData = res.clip;
          console.info('[Clip] loaded:', clipData);
          resolve();
        } else {
          chrome.storage.local.set({ playClipSystemKey: 0 });
          reject(new Error('[Clip] No clip data or playClipSystemKey !== 1'));
        }
      });
    });
  }

  // ---------------------------------------------------------------------------
  // 2) Wait for <video> element to appear (Netflix inserts it dynamically)
  // ---------------------------------------------------------------------------
  function waitForVideoElement() {
    return new Promise(resolve => {
      const existing = document.querySelector('video');
      if (existing) return resolve(existing);

      const observer = new MutationObserver(() => {
        const v = document.querySelector('video');
        if (v) {
          observer.disconnect();
          resolve(v);
        }
      });

      observer.observe(document.body, { childList: true, subtree: true });
    });
  }

  // ---------------------------------------------------------------------------
  // 3) Initialize after both clip data & video element are ready
  // ---------------------------------------------------------------------------
  async function init() {
    // URLにclip=1が付いていなければ追加してリロード
    ensureClipTagInURL();

    try {
      await loadClipFromStorage();
      videoPlayer = await waitForVideoElement();
      setupPlayer();
    } catch (err) {
      console.error('[Clip] Initialization failed:', err);
      return;
    }
  }

  // ---------------------------------------------------------------------------
  // 4) Set up listeners and monitor for endtime only
  // ---------------------------------------------------------------------------
  function setupPlayer() {
    const end = Number(clipData.endtime);

    if (videoPlayer.readyState >= 1) {
      console.info('[Video] metadata already available, skipping wait.');
      monitorClipEnd(end);
      startCountdownLogger(end);
    } else {
      videoPlayer.addEventListener('loadedmetadata', () => {
        console.info('[Video] metadata loaded. duration =', videoPlayer.duration);
        monitorClipEnd(end);
        startCountdownLogger(end);
      });
    }

    videoPlayer.addEventListener('error', e => {
      console.error('[Video] error:', e);
    });
  }

  // ---------------------------------------------------------------------------
  // 5) Stop when reaching the end
  // ---------------------------------------------------------------------------
  function monitorClipEnd(end) {
    function onTimeUpdate() {
      if (videoPlayer.currentTime + EPSILON >= end) {
        console.info('[Clip] Reached end, pausing and reloading.');
        videoPlayer.pause();
        videoPlayer.removeEventListener('timeupdate', onTimeUpdate);

        clearInterval(countdownIntervalId);
        window.location.reload();
      }
    }
    videoPlayer.addEventListener('timeupdate', onTimeUpdate);
  }

  // ---------------------------------------------------------------------------
  // 6) Log remaining time until end every second
  // ---------------------------------------------------------------------------
  function startCountdownLogger(end) {
    if (countdownIntervalId !== null) clearInterval(countdownIntervalId);

    countdownIntervalId = setInterval(() => {
      if (!videoPlayer) return;
      const remaining = Math.max(0, end - videoPlayer.currentTime);
      console.log(`[Countdown] ${remaining.toFixed(1)} seconds remaining until end.`);
    }, 1000);
  }

  // ---------------------------------------------------------------------------
  // Kick things off when the page finishes loading
  // ---------------------------------------------------------------------------
  window.addEventListener('load', init);

})();
