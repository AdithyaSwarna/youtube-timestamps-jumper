chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo && changeInfo.status === 'complete') {
      chrome.tabs.get(tabId, (updatedTab) => {
        if (chrome.runtime.lastError) {
          console.error('Error getting tab info:', chrome.runtime.lastError.message);
          return;
        }
  
        if (updatedTab.url && updatedTab.url.includes('youtube.com/watch')) {
          console.log("Tab URL:", updatedTab.url);
  
          // Execute content script
          chrome.scripting.executeScript({
            target: { tabId: tabId },
            files: ['content.js']
          }, () => {
            if (chrome.runtime.lastError) {
              console.error('Script injection failed:', chrome.runtime.lastError.message);
            }
          });
  
          // Check if there are stored timestamps for the current video
          const videoId = new URLSearchParams(new URL(updatedTab.url).search).get('v');
          chrome.storage.local.get([videoId], (result) => {
            if (result[videoId] && result[videoId].length > 0) {
              chrome.action.openPopup();  // Automatically open the popup
            }
          });
        } else {
          console.log('URL does not match YouTube pattern:', updatedTab.url);
        }
      });
    } else {
      console.error('Change info is undefined or lacks status property:', changeInfo);
    }
  });
  