(function () {
  const SVG_NAMESPACE = "http://www.w3.org/2000/svg";
  const BUTTON_ID = "loop-button";
  const COLOR_DEFAULT = "#FFFFFF";
  const COLOR_LOOPING = "#FF0000";

  let isLooping = false;
  let svgElement;
  const SELECTORS = {
    controlsStandard: '[data-uia="controls-standard"]',
    controlEpisodes: '[data-uia="control-episodes"]',
    controlForward10: '[data-uia="control-forward10"]',
  };

  const buttonMargin = createButtonMargin();
  const wrapButton = document.createElement("div");
  const loopButton = createLoopButton();
  svgElement = createLoopSVG();

  loopButton.addEventListener("click", handleLoopToggle);

  const observer = new MutationObserver(mutationCallback);
  observer.observe(document.body, { childList: true, subtree: true });

  window.addEventListener("beforeunload", () => {
    observer.disconnect();
  });

  function createButtonMargin() {
    const margin = document.createElement("div");
    margin.style.minWidth = "3rem";
    margin.style.width = "3rem";
    return margin;
  }

  function createLoopButton() {
    const button = document.createElement("button");
    button.id = BUTTON_ID;
    button.setAttribute("aria-label", "ループボタン");
    return button;
  }

  function createLoopSVG() {
    const svg = document.createElementNS(SVG_NAMESPACE, "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("width", "120%");
    svg.setAttribute("height", "120%");
    svg.style.color = COLOR_DEFAULT;

    const style = document.createElementNS(SVG_NAMESPACE, "style");
    style.textContent = `
      .loop-icon {
        fill: none;
        stroke: currentColor;
        stroke-width: 1.5;
        stroke-miterlimit: 10;
        stroke-linecap: round;
        stroke-linejoin: round;
      }
    `;
    svg.appendChild(style);

    const paths = [
      "M3.57996 5.15991H17.42C19.08 5.15991 20.42 6.49991 20.42 8.15991V11.4799",
      "M6.73996 2L3.57996 5.15997L6.73996 8.32001",
      "M20.42 18.84H6.57996C4.91996 18.84 3.57996 17.5 3.57996 15.84V12.52",
      "M17.26 21.9999L20.42 18.84L17.26 15.6799"
    ];

    for (const d of paths) {
      const path = document.createElementNS(SVG_NAMESPACE, "path");
      path.setAttribute("d", d);
      path.setAttribute("class", "loop-icon");
      svg.appendChild(path);
    }

    return svg;
  }

  function handleLoopToggle() {
    isLooping = !isLooping;
    svgElement.style.color = isLooping ? COLOR_LOOPING : COLOR_DEFAULT;
    console.log(isLooping ? "ループON" : "ループOFF");
  }

  function addElements() {
    const controlsStandardElement = document.querySelector(SELECTORS.controlsStandard);
    if (controlsStandardElement) {
      const controlVolumeElement = document.querySelector(SELECTORS.controlEpisodes);
      if (controlVolumeElement) {
        loopButton.className = controlVolumeElement.className;
        loopButton.appendChild(svgElement);
        wrapButton.className = controlVolumeElement.parentNode.className;
        controlVolumeElement.parentNode.after(wrapButton);
        wrapButton.appendChild(loopButton);
        controlVolumeElement.parentNode.after(buttonMargin);
      }
    }
  }

  function mutationCallback(mutationsList) {
    const controlsForward10Element = document.querySelector(SELECTORS.controlForward10);
    if (controlsForward10Element && !document.getElementById(BUTTON_ID)) {
      addElements();
    } else if (!controlsForward10Element && document.getElementById(BUTTON_ID)) {
      buttonMargin.remove();
      loopButton.remove();
    }
  }
})();
