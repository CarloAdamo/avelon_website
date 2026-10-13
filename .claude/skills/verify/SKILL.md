---
name: verify
description: Build, launch and drive the Avelon site to verify changes end-to-end
---

# Verifying the Avelon website

Vite + React SPA. Unit tests: `npm test` (Vitest). End-to-end verification is driving the real site.

## Build & serve

```bash
npm run build
npm run preview -- --port 4173 --strictPort   # run in background
```

## Drive it

Headless Chrome via puppeteer-core (install `--no-save` in a scratch dir,
executablePath `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome`).

The film is six pinned scenes, each `<section data-scene=ID data-length=L>`; scroll
position for progress p inside a scene is `section.offsetTop + p * L * innerHeight`.

Key flows:
- **title** (L 2): video `/film/video/max-arrives.mp4` loads only after the window
  `load` event, then `document.querySelector('[data-scene=title] video').currentTime`
  changes while scrolling 0→0.8.
- **question / connect / agents / stay**: every `[data-bubble]` reaches opacity > 0.9 at the
  middle of its hold window (windows live in `SCENES[id].WINDOWS` in `src/film/scenes/windows.js`).
- **build** (L 3): `/film/video/guide-draws.mp4` is requested only once the scene is within
  one viewport, then scrubs.
- Reduced motion (`page.emulateMediaFeatures([{name:'prefers-reduced-motion', value:'reduce'}])`):
  no `position: sticky`, all bubbles visible, page shorter than 12 viewports.
- **/test**: lazy Spline route still 200s without bloating `/`.

## Gotchas

- Scrub clips (`public/film/video/*.mp4`) must stay **all-intra** (ffmpeg `-g 1`) or scrubbing stutters.
  Recipe: `ffmpeg -i in.mp4 -an -c:v libx264 -preset slow -crf 26 -g 1 -pix_fmt yuv420p -movflags +faststart -vf scale=1280:-2 out.mp4`.
- Cutouts must keep alpha (`scripts/film/to-webp.sh in.png out.webp lossless`).
- Images are WebP; grep `dist/assets/*.js` for stray `.png` refs after asset work (the paper tile is the one allowed PNG).
- Production domain: https://avelon.ai (Vercel project `avelon-website`).
