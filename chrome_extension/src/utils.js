export async function sendToApi(base64String, board_id, url) {
  fetch("http://localhost:3000/api/boards/" + board_id, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ file: base64String, url: url }),
  })
    .then((res) => res.text())
    .then((data) => {
      chrome.notifications.create({
        type: "basic",
        iconUrl: "icons/icon.png",
        title: "Image Sent!",
        message: "The image has been successfully sent to the API.",
        priority: 1,
      });
      console.log("Image sent successfully:", data);
    })
    .catch((err) => {
      console.error("Error sending image:", err);
    });
}

export function imageUrlToBase64(url, callback) {
  fetch(url)
    .then((response) => response.blob()) // Fetch the image as a blob
    .then((blob) => {
      const reader = new FileReader();

      reader.onloadend = function () {
        const base64String = reader.result.split(",")[1]; // Extract Base64 part
        callback(base64String);
      };

      reader.readAsDataURL(blob); // Convert the blob to Base64 string
    })
    .catch((err) => console.error("Error fetching the image: ", err));
}

export function cropAndSend(dataUrl, rect, dpr, board_id, url) {
  fetch(dataUrl)
    .then((response) => response.blob())
    .then((blob) => createImageBitmap(blob))
    .then((bitmap) => {
      const canvas = new OffscreenCanvas(rect.width * dpr, rect.height * dpr);
      const ctx = canvas.getContext("2d");

      ctx.drawImage(bitmap, rect.x * dpr, rect.y * dpr, rect.width * dpr, rect.height * dpr, 0, 0, rect.width * dpr, rect.height * dpr);

      return canvas.convertToBlob();
    })
    .then((croppedBlob) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        console.log(base64String);

        sendToApi(base64String, board_id, url);
      };
      reader.readAsDataURL(croppedBlob);
    })
    .catch((error) => {
      console.error("Cropping failed:", error);
      console.log({ error: error.message });
    });
}
