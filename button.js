function createMyButton(onClickHandler) {
    if (document.getElementById("my-extension-btn")) return;
  
    const btn = document.createElement("button");
    btn.id = "my-extension-btn";
    btn.textContent = "▶ Start";
    btn.style.position = "fixed";
    btn.style.bottom = "20px";
    btn.style.right = "20px";
    btn.style.zIndex = "9999";
    btn.className = "my-extension-style";
    
    if (typeof onClickHandler === "function") {
      btn.onclick = onClickHandler;
    }
  
    document.body.appendChild(btn);
  }
  