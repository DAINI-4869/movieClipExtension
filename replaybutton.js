(function () {
  const SVG_NAMESPACE = "http://www.w3.org/2000/svg";
  const BUTTON_ID = "loop-button";
  const COLOR_DEFAULT = "#FFFFFF";
  const COLOR_LOOPING = "#FF0000";

  let isLooping = false;
  let svgElement;

  const SELECTOR_TARGET = '[data-uia="control-episodes"]';

  const observer = new MutationObserver(() => {
    const episodesButton = document.querySelector(SELECTOR_TARGET);
    if (episodesButton && !document.getElementById(BUTTON_ID)) {
      addLoopButtonNextToEpisodes(episodesButton);
    }
  });

  window.addEventListener("load", () => {
    const controls = document.body;
    if (controls) {
      observer.observe(controls, { childList: true, subtree: true });
    }
  });

  function addLoopButtonNextToEpisodes(episodesButton) {
    const wrapButton = document.createElement("div");
    wrapButton.style.marginLeft = "12px";
    wrapButton.style.display = "inline-block";

    const loopButton = document.createElement("button");
    loopButton.id = BUTTON_ID;
    loopButton.setAttribute("aria-label", "ループボタン");
    loopButton.style.width = "24px";
    loopButton.style.height = "24px";
    loopButton.style.background = "transparent";
    loopButton.style.border = "none";
    loopButton.style.cursor = "pointer";

    svgElement = createLoopSVG();
    loopButton.appendChild(svgElement);
    wrapButton.appendChild(loopButton);

    loopButton.addEventListener("click", handleLoopToggle);

    episodesButton.parentNode.insertAdjacentElement("afterend", wrapButton);
  }

  function handleLoopToggle() {
    isLooping = !isLooping;
    svgElement.style.color = isLooping ? COLOR_LOOPING : COLOR_DEFAULT;
    console.log(isLooping ? "ループON" : "ループOFF");
  }

  function createLoopSVG() {
    const svg = document.createElementNS(SVG_NAMESPACE, "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("width", "24");
    svg.setAttribute("height", "24");
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
})();
