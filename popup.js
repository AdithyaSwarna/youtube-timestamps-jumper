document.addEventListener('DOMContentLoaded', () => {
    const startTimeInput = document.getElementById('start-time');
    const endTimeInput = document.getElementById('end-time');
    const nameInput = document.getElementById('name');
    const addTimestampButton = document.getElementById('add-timestamp');
    const timestampsContainer = document.getElementById('timestamps');
    const allTimestampsContainer = document.getElementById('all-timestamps');
    const viewAllButton = document.getElementById('view-all-timestamps');
  
    function renderTimestamps(timestamps) {
      timestampsContainer.innerHTML = '';
      timestamps.forEach((timestamp, index) => {
        const div = document.createElement('div');
        div.classList.add('timestamp');
        div.innerHTML = `
          <span>${timestamp.name || 'Timestamp ' + (index + 1)} (${timestamp.start}${timestamp.end ? ' - ' + timestamp.end : ''})</span>
          <button class="play" data-start="${timestamp.start}" data-end="${timestamp.end}" data-loop="${timestamp.loop}">Play</button>
          <button class="edit" data-index="${index}">Edit</button>
          <button class="toggle-loop">${timestamp.loop ? 'Disable Loop' : 'Enable Loop'}</button>
        `;
        timestampsContainer.appendChild(div);
  
        div.querySelector('.play').addEventListener('click', () => {
          chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, {
              action: 'playTimestamp',
              start: timestamp.start,
              end: timestamp.end,
              loop: timestamp.loop
            });
          });
        });
  
        div.querySelector('.edit').addEventListener('click', () => {
          startTimeInput.value = timestamp.start;
          endTimeInput.value = timestamp.end;
          nameInput.value = timestamp.name;
          addTimestampButton.textContent = 'Save Edit';
          addTimestampButton.dataset.index = index;
        });
  
        div.querySelector('.toggle-loop').addEventListener('click', () => {
          timestamp.loop = !timestamp.loop;
          saveTimestamps(timestamps);
          renderTimestamps(timestamps);
        });
      });
    }
  
    function saveTimestamps(timestamps) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const videoId = new URLSearchParams(new URL(tabs[0].url).search).get('v');
        const storage = {};
        storage[videoId] = timestamps;
        chrome.storage.local.set(storage, () => {
          renderTimestamps(timestamps);
        });
      });
    }
  
    addTimestampButton.addEventListener('click', () => {
      const start = startTimeInput.value.trim();
      const end = endTimeInput.value.trim();
      const name = nameInput.value.trim();
      const index = addTimestampButton.dataset.index;
      const newTimestamp = { start, end, name, loop: false };
  
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const videoId = new URLSearchParams(new URL(tabs[0].url).search).get('v');
        chrome.storage.local.get([videoId], (result) => {
          const timestamps = result[videoId] || [];
          if (index) {
            timestamps[parseInt(index)] = newTimestamp;
          } else {
            timestamps.push(newTimestamp);
          }
          saveTimestamps(timestamps);
        });
      });
  
      startTimeInput.value = '';
      endTimeInput.value = '';
      nameInput.value = '';
      addTimestampButton.textContent = 'Add Timestamp';
      delete addTimestampButton.dataset.index;
    });
  
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const videoId = new URLSearchParams(new URL(tabs[0].url).search).get('v');
      chrome.storage.local.get([videoId], (result) => {
        const timestamps = result[videoId] || [];
        renderTimestamps(timestamps);
      });
    });
  
    viewAllButton.addEventListener('click', () => {
      chrome.storage.local.get(null, (items) => {
        allTimestampsContainer.innerHTML = '';
        for (const [videoId, timestamps] of Object.entries(items)) {
          const videoTimestamps = document.createElement('div');
          videoTimestamps.classList.add('video-timestamps');
          videoTimestamps.innerHTML = `<h3>Video ID: ${videoId}</h3>`;
          timestamps.forEach((timestamp, index) => {
            const div = document.createElement('div');
            div.classList.add('timestamp');
            div.innerHTML = `
              <span>${timestamp.name || 'Timestamp ' + (index + 1)} (${timestamp.start}${timestamp.end ? ' - ' + timestamp.end : ''})</span>
              <button class="edit" data-video-id="${videoId}" data-index="${index}">Edit</button>
            `;
            videoTimestamps.appendChild(div);
  
            div.querySelector('.edit').addEventListener('click', () => {
              startTimeInput.value = timestamp.start;
              endTimeInput.value = timestamp.end;
              nameInput.value = timestamp.name;
              addTimestampButton.textContent = 'Save Edit';
              addTimestampButton.dataset.index = index;
              addTimestampButton.dataset.videoId = videoId;
            });
          });
          allTimestampsContainer.appendChild(videoTimestamps);
        }
      });
    });
  });
  