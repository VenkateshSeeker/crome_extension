console.log("AI Shopping Assistant Service Worker Online");

chrome.runtime.onInstalled.addListener(() => {
    console.log("Extension installed successfully");
});
