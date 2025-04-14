"use strict";

import { cropAndSend, imageUrlToBase64, sendToApi } from "./utils";

/// <reference types="chrome"/>

chrome.runtime.onInstalled.addListener(() => {
  fetch("http://localhost:3000/api/boards", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      accepts: "application/json",
    },
  })
    .then(async (res) => {
      const boards = await res.json();
      chrome.storage.local.set({ boards: JSON.stringify(boards) });
      boards.forEach((element) => {
        chrome.contextMenus.create({
          id: "sendImage_" + element.id,
          title: "Send Image to " + element.title,
          contexts: ["image"],
        });
      });
    })
    .catch((err) => {
      console.error("Error sending image:", err);
    });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  const key = info.menuItemId.split("_");
  if (key[0] === "sendImage") {
    const imageUrl = info.srcUrl;
    console.log(`Image URL: ${imageUrl}`);

    // Usage example:
    imageUrlToBase64(imageUrl, async (base64String) => {
      sendToApi("data:image/png;base64," + base64String, key[1], imageUrl);
    });
  }
});

chrome.commands.onCommand.addListener((command) => {
  console.log(command);
  if (command === "capture_area") {
    chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["contentScript.js"],
      });
    });
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "capture") {
    setTimeout(() => {
      chrome.tabs.captureVisibleTab(null, { format: "png" }, async (dataUrl) => {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        cropAndSend(dataUrl, message.rect, message.dpr, message.board_id, tab.url ?? "https://nourl.com");
        // console.log(dataUrl);
      });
    }, 1000);
    return true;
  }
});
