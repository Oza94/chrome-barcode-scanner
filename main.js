console.log("Starting...");

changeColor.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting
    .executeScript({
      target: { tabId: tab.id },
      files: ["quagga.min.js"],
    })
    .then(() =>
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["scan.js"],
      })
    );
});
