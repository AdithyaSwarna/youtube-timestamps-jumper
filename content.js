(function() {
    // Function to parse time in mm:ss format to seconds
    function parseTime(timeStr) {
      const [minutes, seconds] = timeStr.split(':').map(Number);
      return (minutes * 60) + seconds;
    }
  
    // Function to add a timestamp
    function addTimestamp(start, end, name, loop) {
      const timestamps = JSON.parse(localStorage.getItem('timestamps')) || {};
      const videoId = new URLSearchParams(window.location.search).get('v');
      if (!timestamps[videoId]) {
        timestamps[videoId] = [];
      }
      timestamps[videoId].push({ start, end, name, loop });
      localStorage.setItem('timestamps', JSON.stringify(timestamps));
    }
  
    // Function to get timestamps for the current video
    function getTimestamps() {
      const timestamps = JSON.parse(localStorage.getItem('timestamps')) || {};
      const videoId = new URLSearchParams(window.location.search).get('v');
      return timestamps[videoId] || [];
    }
  
    // Inject a button to open the popup
    const button = document.createElement('button');
    button.textContent = 'Manage Timestamps';
    button.style.position = 'fixed';
    button.style.top = '10px';
    button.style.right = '10px';
    button.style.zIndex = '1000';
    button.addEventListener('click', () => {
      chrome.runtime.sendMessage({ action: 'openPopup' });
    });
    document.body.appendChild(button);
  
    // Message listener to handle playback control
    chrome.runtime.onMessage.addListener((message) => {
      if (message.action === 'playTimestamp') {
        const { start, end, loop } = message;
        const video = document.querySelector('video');
        video.currentTime = parseTime(start);
        if (end) {
          const endTime = parseTime(end);
          video.addEventListener('timeupdate', function onTimeUpdate() {
            if (video.currentTime >= endTime) {
              if (loop) {
                video.currentTime = parseTime(start);
              } else {
                video.pause();
              }
              video.removeEventListener('timeupdate', onTimeUpdate);
            }
          });
        }
        video.play();
      }
    });
  })();
  