# NovaLabs — Two-Page Website with Chatbot

A clean, responsive, two‑page site with a floating chatbot. No build tools needed.

## Contents
- `index.html` — homepage with hero, features, contact
- `about.html` — about page with “how to wire an API” instructions
- `css/styles.css` — styles (dark theme, responsive)
- `js/chatbot.js` — floating chatbot (mock responses + optional real API hook)
- `js/main.js` — small UX enhancements
- `assets/*.svg` — local, lightweight images

## Getting Started
1. Download the ZIP and extract it.
2. Double‑click `index.html` to open locally, or serve the folder on any static host.

## Switch to a real chatbot API (optional)
1. Open `js/chatbot.js`.
2. Set `USE_MOCK = false`.
3. Implement `callRealAPI()` with your endpoint (proxy via a backend to keep keys safe).
