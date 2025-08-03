(() => {
  const SVG_NAMESPACE = "http://www.w3.org/2000/svg";
  const COLOR_DEFAULT = "#FFFFFF";  // 基本色
  const COLOR_ACTIVE = "#FF0000";   // アクティブ時の色

  function createRoundedRectSVG(color = COLOR_DEFAULT) {
    const svg = document.createElementNS(SVG_NAMESPACE, "svg");
    svg.setAttribute("viewBox", "0 0 400 180");
    svg.setAttribute("width", "400");
    svg.setAttribute("height", "180");
    svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
    svg.style.color = color;
    svg.style.cursor = "pointer";
    svg.style.borderRadius = "6px";
    svg.style.transition = "color 0.2s ease";

    // クリックで色トグル
    svg.addEventListener("click", () => {
      svg.style.color = svg.style.color === COLOR_ACTIVE
        ? COLOR_DEFAULT
        : COLOR_ACTIVE;
    });

    // スタイル要素（fillはcurrentColorに依存）
    const style = document.createElementNS(SVG_NAMESPACE, "style");
    style.textContent = `
      .rounded-rect {
        fill: currentColor;
        stroke: black;
        stroke-width: 5;
        opacity: 0.5;
      }
    `;
    svg.appendChild(style);

    // 角丸四角形
    const rect = document.createElementNS(SVG_NAMESPACE, "rect");
    rect.setAttribute("x", 50);
    rect.setAttribute("y", 20);
    rect.setAttribute("rx", 20);
    rect.setAttribute("ry", 20);
    rect.setAttribute("width", 150);
    rect.setAttribute("height", 150);
    rect.setAttribute("class", "rounded-rect");

    svg.appendChild(rect);
    return svg;
  }

  // グローバル登録
  window.createRoundedRectSVG = createRoundedRectSVG;
  window.COLOR_RECT_DEFAULT = COLOR_DEFAULT;
  window.COLOR_RECT_ACTIVE = COLOR_ACTIVE;
})();
