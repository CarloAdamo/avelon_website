---
name: verify
description: Build, launch and drive the Avelon site to verify changes end-to-end
---

# Verifying the Avelon website

Vite + React SPA. No tests — verification is driving the real site.

## Build & serve

```bash
npm run build
npm run preview -- --port 4173 --strictPort   # run in background
```

## Drive it

Headless Chrome via puppeteer-core (install `--no-save` in a scratch dir,
executablePath `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome`).

Key flows to exercise:
- **Hero / RocketScroll** (`/`, first 900vh): rocket video must scrub —
  `document.querySelector('video').currentTime` should change after
  `window.scrollTo(0, innerHeight * 4)`.
- **TrueMeaning** (next 1000vh): astronaut video is lazy — it must NOT be
  requested on initial load, and MUST load + scrub after scrolling to
  ~9.5 × innerHeight. Watch `.mp4` network requests to confirm.
- **/test**: lazy route pulling the Spline runtime chunks — should 200 without
  bloating the `/` bundle (check `dist/assets/` for separate spline chunks).

## Gotchas

- Scrub videos (`public/rocket/rocket-scrub.mp4`, `public/videos/astronaut-scrub.mp4`)
  must stay **all-intra** (ffmpeg `-g 1`) or scroll scrubbing stutters badly.
  Re-encode recipe: `ffmpeg -i in.mp4 -an -c:v libx264 -preset slow -crf 28 -g 1
  -pix_fmt yuv420p -movflags +faststart out.mp4` (ffmpeg binary at
  `node_modules/ffmpeg-static/ffmpeg`).
- Images are WebP; grep `dist/assets/*.js` for stray `.png` refs after asset work.
- Production domain: https://avelon.ai (Vercel project `avelon-website`).
