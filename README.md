# 🎬 YouTube Timestamps Jumper – A Browser Extension

A lightweight browser extension that allows you to bookmark, jump to, and loop specific timestamps in YouTube videos.

---
## 💡 Motivation

Have you ever wanted to:
- Rewatch a favorite part of a YouTube tutorial or music video?
- Loop a specific moment for learning, analysis, or fun?
- Quickly jump to your own bookmarked segments?

YouTube doesn’t provide native support for timestamp bookmarking or looping specific video segments.  
This extension was built to solve that exact problem — giving users full control over their playback experience in a simple, intuitive way.

Personally, I often found myself wanting to **listen to specific parts of songs** — because not every track is great as a whole, but certain segments are truly amazing.  
This extension helps isolate and enjoy those golden moments without hassle.
---
## 🚀 Features

- 🔖 **Bookmark Timestamps**  
  Save custom start/end timestamps for any YouTube video, with optional labels.

- ⏩ **Jump to Timestamp**  
  Click and instantly jump to the saved timestamp range.

- 🔁 **Loop Sections**  
  Enable looping to repeat your favorite video segments endlessly.

- 🧠 **Video-Aware UI**  
  Auto-detects the current video and displays relevant timestamps.

- 💾 **Storage**  
  Uses Chrome's local storage for persistent timestamp saving.

---

## 🛠️ How It Works

- Injects a "Manage Timestamps" button on every YouTube video page.
- Background script listens to tab updates and loads necessary scripts.
- Users interact with the extension via a popup interface.
- Messages are exchanged between popup, content script, and background worker to control playback.

---

## 🐞 Known Bugs

| Issue | Description | Suggested Fix |
|-------|-------------|----------------|
| 🔁 Loop button not persistent | Loop toggle resets when page reloads | Save loop state in `chrome.storage.local` and sync it across sessions |
| 🧪 No validation for invalid time formats | mm:ss inputs aren't checked | Add time format validation before saving |
| 🧹 Cannot delete timestamps | No delete option in the UI | Add a 🗑️ delete button next to each timestamp |
| 📦 Popup doesn’t auto-refresh on tab change | Stale data can show on video change | Re-fetch and reload timestamps on tab switch event |

---

## 🧪 Try It Out

1. Clone this repo:
   ```bash
   git clone https://github.com/AdithyaSwarna/youtube-timestamps-jumper.git

## 🛠️ How to Run Locally (Chrome)

> No build step or dependencies required – just plug and play!

### Steps:

1. **Open Chrome**  
2. **Go to** `chrome://extensions/`  
3. **Enable Developer Mode** (toggle in top-right)  
4. **Click "Load unpacked"**  
5. **Select your `YouTubeTimestampsJumper` folder**  

You’re now ready to use the extension!

### Test on YouTube:
- Open any YouTube video (e.g., `https://youtube.com/watch?v=VIDEO_ID`)
- Click the extension icon in the browser toolbar
- Add/edit/play timestamps, and enable looping
