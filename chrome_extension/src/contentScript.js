"use strict";
import "./popup.css";

(async () => {
  const canvas = document.createElement("canvas");
  const selectionBox = document.createElement("div");
  const bgBox = document.createElement("div");
  const optionsOverlay = document.createElement("div");

  Object.assign(selectionBox.style, {
    position: "fixed",
    border: "2px dashed green",
    zIndex: 9999999,
    background: "transparent",
    // pointerEvents: "none",
  });

  Object.assign(bgBox.style, {
    position: "fixed",
    border: "2px dashed green",
    zIndex: 99999,
    background: "rgba(0, 0, 0, 0.3)",
    // pointerEvents: "none",
    bottom: "0px",
    right: "0px",
    top: "0px",
    left: "0px",
  });

  Object.assign(optionsOverlay.style, {
    position: "fixed",
    // border: "2px dashed green",
    zIndex: 999999,
    top: "10%",
    left: "10%",
    right: "10%",
    bottom: "10%",
    background: "rgba(2,0,0,0.7)",
  });

  bgBox.querySelectorAll("*").forEach((child) => {
    child.style.pointerEvents = "none"; // Make sure child elements also can't interact
  });
  document.body.appendChild(bgBox);

  let startX, startY, endX, endY;

  const onMouseDown = (e) => {
    startX = e.clientX;
    startY = e.clientY;
    selectionBox.style.left = `${startX}px`;
    selectionBox.style.top = `${startY}px`;
    selectionBox.style.width = "0px";
    selectionBox.style.height = "0px";
    bgBox.appendChild(selectionBox);
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  const onMouseMove = (e) => {
    endX = e.clientX;
    endY = e.clientY;
    selectionBox.style.width = `${Math.abs(endX - startX)}px`;
    selectionBox.style.height = `${Math.abs(endY - startY)}px`;
    selectionBox.style.left = `${Math.min(startX, endX)}px`;
    selectionBox.style.top = `${Math.min(startY, endY)}px`;
  };

  const onEscape = (e) => {
    // console.log(e.key);
    if (e.key !== "Escape") return;
    bgBox.remove();
    optionsOverlay.remove();
    selectionBox.remove();

    document.removeEventListener("keydown", onEscape);
    document.removeEventListener("mousedown", onMouseDown);
  };
  document.addEventListener("keydown", onEscape);

  const onMouseUp = async () => {
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);
    document.removeEventListener("mousedown", onMouseDown);
    const rect = selectionBox.getBoundingClientRect();
    selectionBox.remove();
    // bgBox.remove();
    bgBox.appendChild(optionsOverlay);
    // optionsOverlay.innerHTML = `<button id="send">Send</button>`;

    // prompt("Send image to API?");
    const store = await chrome.storage.local.get("boards");
    console.log(JSON.parse(store.boards));

    const ul = document.createElement("ul");
    ul.style.padding = "16px";
    JSON.parse(store.boards).forEach((board) => {
      const li = document.createElement("li");
      li.textContent = board.title;
      // Add styles to the list item
      li.style.padding = "8px 12px";
      li.style.margin = "4px 0";
      li.style.borderRadius = "4px";
      li.style.backgroundColor = "#f5f5f5";
      li.style.cursor = "pointer";
      li.style.transition = "background-color 0.2s ease";
      li.style.fontSize = "14px";

      li.addEventListener("click", () => {
        optionsOverlay.remove();
        bgBox.remove();
        chrome.runtime.sendMessage({
          action: "capture",
          rect: {
            x: rect.left,
            y: rect.top,
            width: rect.width,
            height: rect.height,
          },
          dpr: window.devicePixelRatio,
          board_id: board.id,
        });
      });
      ul.appendChild(li);
    });

    const li = document.createElement("li");
    li.textContent = "Cancel";
    // Add styles to the list item
    li.style.padding = "8px 12px";
    li.style.margin = "4px 0";
    li.style.borderRadius = "4px";
    li.style.backgroundColor = "rgb(255,10,10)";
    li.style.cursor = "pointer";
    li.style.transition = "background-color 0.2s ease";
    li.style.fontSize = "14px";

    li.addEventListener("click", () => {
      optionsOverlay.remove();
      bgBox.remove();
    });
    ul.appendChild(li);
    optionsOverlay.appendChild(ul);
  };

  document.addEventListener("mousedown", onMouseDown);
})();
