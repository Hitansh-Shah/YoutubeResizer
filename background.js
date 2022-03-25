let isActive = false

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ isActive })
});