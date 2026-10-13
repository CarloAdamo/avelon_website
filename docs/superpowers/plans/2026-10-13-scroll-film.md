# Scroll-Driven Film Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the top of avelon.ai with a six-scene scroll-driven cartoon film (two characters, speech bubbles, two scrubbed video clips) that explains what Avelon sells, keeping Cases, Contact and Career below it.

**Architecture:** A `src/film/` module with one `Scene` wrapper (sticky stage, spring-smoothed scroll progress) and small layer components (`Bubble`, `Actor`, `ScrubVideo`, `SystemBoxes`) driven by plain `useTransform` keyframe arrays, exactly the pattern of today's `RocketScroll.jsx`. Pure math lives in `src/film/math.js` and `src/film/boxesLayout.js` and is unit-tested with Vitest; components are smoke-tested with `react-dom/server`; the real page is verified by a puppeteer script. Assets are generated with Codex (`image_gen`, free) for stills and Higgsfield (Seedance 2.5) for the two clips.

**Tech Stack:** Vite 7, React 19, framer-motion 12.23, Tailwind 4, Vitest 3 (new dev dep), puppeteer-core (scratch install only, never a dep), ffmpeg-static (already a dev dep), Codex CLI, Higgsfield CLI.

**Spec:** `docs/superpowers/specs/2026-10-13-scroll-film-design.md`

## Global Constraints

- Brand: paper `#F3ECE1`, ink `#1F1A14`, accent `#6B5B95`. Inter for text, Caveat 700 in accent for exactly one word per phrase. No pure white, no gradients, no glow, no neon.
- Copy: every bubble string is taken verbatim from spec §4. No "unlike", no "it isn't X, it's Y", no "transform/unlock/landscape".
- Units: stage and section heights use `svh`, never `vh`.
- Scroll model: a scene with scroll length `L` has section height `(L + 1) * 100svh`; bubble hold ≥ `0.8 / L`; fades `0.2 / L`; hold windows in one scene never overlap.
- No new runtime dependencies. Vitest is the only new dev dependency. puppeteer-core is installed with `--no-save` in the scratchpad.
- Images under `public/film/` are WebP (cutouts lossless with alpha, backdrops q82 + an 800px mobile variant). Videos are all-intra H.264 (`-g 1`), ≤ 4 MB desktop, ≤ 2 MB mobile, with a WebP poster.
- Every generated image attaches both canon sheets as references and ends its prompt with the invariants line from spec §6.1. Cutout prompts additionally say "transparent background".
- Lint must pass: `npm run lint` (eslint flat config, `no-unused-vars` with `^[A-Z_]` ignore).
- Commit after every task; messages are plain imperative lines ending with `Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>`.
- Work on branch `feat/scroll-film` created from `main`.

## Review Focus

1. **A bubble window that starts at 0 (`[0, 0, 0.25, 0.4]`) must be fully visible at progress 0.** framer's range interpolation divides by zero on equal stops; `bubbleOpacity` in Task 2 handles the degenerate ramp and is tested at `p = 0`.
2. **A video that fails to load (404, offline, blocked) must leave the poster visible and stop seeking.** `ScrubVideo` in Task 7 switches to a `failed` state on the `error` event and unregisters from the loop; Task 15 blocks the mp4 URL in puppeteer and asserts the poster is still shown.
3. **Landing directly on `/#contact` must not start the scrub loop.** Task 7 tests that the loop schedules no frame while the registry is empty; Task 15 loads `/#contact` and asserts no `[data-scrub-active="true"]` element exists.
4. **A trackpad fling that moves progress by a large delta must seek once per frame, never queue seeks.** Task 7 tests that one tick with a large delta assigns `currentTime` exactly once per video.
5. **Resizing across the 768px breakpoint mid-scene must switch layouts without stale positions.** `useIsDesktop` in Task 4 subscribes to `matchMedia('change')`; Task 15 resizes the viewport from 1280 to 390 at scene 2 progress 0.6 and asserts the box grid positions changed.

---

### Task 1: Branch, canon assets, folder scaffold

**Files:**
- Create: `public/film/canon/max-sheet.png`, `public/film/canon/guide-sheet.png`, `public/film/paper.png`, `public/film/.gitkeep` dirs: `actors/`, `props/`, `backdrops/`, `video/`
- Create: `scripts/film/gen-image.sh`, `scripts/film/to-webp.sh`

**Interfaces:**
- Produces: `scripts/film/gen-image.sh <out.png> "<prompt>"` (generates one image with both sheets as references, copies the PNG to `<out.png>`); `scripts/film/to-webp.sh <in.png> <out.webp> [lossless|<quality>]`.

- [ ] **Step 1: Create the branch**

```bash
cd /Users/cab/avelon_website && git checkout -b feat/scroll-film main
```

- [ ] **Step 2: Copy canon sheets and the paper tile**

```bash
S=/private/tmp/claude-501/-Users-cab-avelon-website/e519dae3-cd9d-4840-9a4c-42d21bb03dc4/scratchpad/style-test
mkdir -p public/film/canon public/film/actors public/film/props public/film/backdrops public/film/video scripts/film
cp "$S/max-character.png" public/film/canon/max-sheet.png
cp "$S/guide-character-v2.png" public/film/canon/guide-sheet.png
cp public/rocket/paper.png public/film/paper.png
touch public/film/actors/.gitkeep public/film/props/.gitkeep public/film/backdrops/.gitkeep public/film/video/.gitkeep
```

Expected: `ls public/film/canon` shows both PNGs (1774×887 and 1792×896).

- [ ] **Step 3: Write the Codex image wrapper**

`scripts/film/gen-image.sh`:

```bash
#!/usr/bin/env bash
# Generate one pencil-sketch image with Codex's built-in image_gen (runs on the ChatGPT subscription).
# Usage: scripts/film/gen-image.sh <out.png> "<prompt>"
# Both canon sheets are attached as references; the brand invariants line is appended to every prompt.
set -euo pipefail
out="$1"; prompt="$2"
repo="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
codex_bin="$(ls -d "$HOME"/.vscode/extensions/openai.chatgpt-*/bin/*/codex 2>/dev/null | sort -V | tail -1)"
[ -x "${codex_bin:-}" ] || { echo "codex binary not found under ~/.vscode/extensions/openai.chatgpt-*" >&2; exit 1; }
work="$(mktemp -d)"
name="$(basename "$out")"
invariants="Hand-drawn pencil sketch on cream paper #F3ECE1, soft graphite shading, vintage 1930s animation style, confident clean line work, original characters, no mouse ears, no gloves, no text, no watermark, no white background, no gradients or glow."
full="Image 1 is the character sheet for \"Max\" (reference only). Image 2 is the character sheet for \"the guide\" (reference only). Use your built-in image_gen tool to generate ONE image, then copy the final PNG into the current working directory as $name. Reply with only the final file path. If the tool rejects the request, retry once with softer wording that keeps the same content.

$prompt

Style invariants: $invariants"
"$codex_bin" exec --sandbox workspace-write --skip-git-repo-check -C "$work" \
  -i "$repo/public/film/canon/max-sheet.png" -i "$repo/public/film/canon/guide-sheet.png" \
  -o "$work/answer.txt" "$full" > "$work/run.log" 2>&1 || true
if [ -f "$work/$name" ]; then
  mkdir -p "$(dirname "$out")"; cp "$work/$name" "$out"; echo "$out"
else
  echo "generation failed; last log lines:" >&2; tail -5 "$work/run.log" >&2; exit 1
fi
```

`scripts/film/to-webp.sh`:

```bash
#!/usr/bin/env bash
# Convert a PNG to WebP with ffmpeg-static. Alpha is preserved.
# Usage: scripts/film/to-webp.sh <in.png> <out.webp> [lossless|<quality 0-100>]   (default: 82)
set -euo pipefail
in="$1"; out="$2"; mode="${3:-82}"
repo="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
ff="$repo/node_modules/ffmpeg-static/ffmpeg"
if [ "$mode" = "lossless" ]; then
  "$ff" -v error -y -i "$in" -c:v libwebp -lossless 1 -pix_fmt bgra "$out"
else
  "$ff" -v error -y -i "$in" -c:v libwebp -quality "$mode" -pix_fmt yuva420p "$out"
fi
echo "$out $(wc -c < "$out" | tr -d ' ') bytes"
```

```bash
chmod +x scripts/film/gen-image.sh scripts/film/to-webp.sh
```

- [ ] **Step 4: Smoke-test the WebP script on the paper tile**

```bash
scripts/film/to-webp.sh public/film/paper.png /tmp/paper-test.webp lossless && rm /tmp/paper-test.webp
```

Expected: prints `/tmp/paper-test.webp <n> bytes`, exit 0.

- [ ] **Step 5: Commit**

```bash
git add public/film scripts/film
git commit -m "Add film canon sheets, paper tile and asset scripts

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 2: Vitest and the pure math helpers

**Files:**
- Modify: `package.json` (devDependencies, `test` script)
- Create: `vitest.config.js`, `src/film/math.js`, `src/film/math.test.js`

**Interfaces:**
- Produces (all exported from `src/film/math.js`):
  - `FRAME = 1/24`
  - `ramp(a, b, p) -> 0..1` (step when `a === b`)
  - `bubbleOpacity(window, p) -> 0..1`, `bubbleRise(window, p, px = 20) -> number`
  - `holdLength(window) -> number`, `validateWindow(window, L, minHold = 0.8) -> {ok, hold}`, `overlaps(a, b) -> boolean`
  - `pickSequence(sequence, p) -> entry`, `walkFrame(window, p, period = 0.06) -> 0|1|null`, `walkBob(window, p, period = 0.06, amp = 6) -> number`
  - `shouldSeek(current, target, frame = FRAME) -> boolean`, `clampTime(duration, t) -> number`, `videoTime(window, p, duration) -> number`, `pickSrc(isDesktop, src, srcMobile) -> string`

Helpers live here and not in component files because `react-refresh/only-export-components` is an error in `eslint.config.js`: a `.jsx` file may export components and primitive constants only.

- [ ] **Step 1: Install Vitest and add the script**

```bash
npm install -D vitest@^3.2.4
```

In `package.json` scripts add `"test": "vitest run"`. Create `vitest.config.js`:

```js
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// The React plugin gives the automatic JSX runtime, so .test.jsx files need no React import.
export default defineConfig({
  plugins: [react()],
  test: {
    include: ['src/**/*.test.{js,jsx}'],
    environment: 'node',
  },
});
```

- [ ] **Step 2: Write the failing tests**

`src/film/math.test.js`:

```js
import { describe, it, expect } from 'vitest';
import {
  FRAME, ramp, bubbleOpacity, bubbleRise, holdLength, validateWindow, overlaps,
  pickSequence, walkFrame, walkBob, shouldSeek, clampTime, videoTime,
} from './math';

describe('ramp', () => {
  it('is 0 before, 1 after, linear between', () => {
    expect(ramp(0.2, 0.4, 0.1)).toBe(0);
    expect(ramp(0.2, 0.4, 0.3)).toBeCloseTo(0.5);
    expect(ramp(0.2, 0.4, 0.9)).toBe(1);
  });
  it('is a step when the stops are equal', () => {
    expect(ramp(0, 0, 0)).toBe(1);
    expect(ramp(0.5, 0.5, 0.49)).toBe(0);
  });
});

describe('bubbleOpacity', () => {
  const w = [0.1, 0.18, 0.5, 0.58];
  it('fades in, holds, fades out', () => {
    expect(bubbleOpacity(w, 0.05)).toBe(0);
    expect(bubbleOpacity(w, 0.14)).toBeCloseTo(0.5);
    expect(bubbleOpacity(w, 0.3)).toBe(1);
    expect(bubbleOpacity(w, 0.54)).toBeCloseTo(0.5);
    expect(bubbleOpacity(w, 0.7)).toBe(0);
  });
  it('is fully visible at p=0 for a window starting at [0,0,…]', () => {
    expect(bubbleOpacity([0, 0, 0.25, 0.4], 0)).toBe(1);
  });
  it('rises 20px during fade in and lifts 20px during fade out', () => {
    expect(bubbleRise(w, 0.05)).toBe(20);
    expect(bubbleRise(w, 0.3)).toBe(0);
    expect(bubbleRise(w, 0.58)).toBe(-20);
  });
});

describe('window validation', () => {
  it('computes hold in viewports and rejects short holds', () => {
    expect(holdLength([0.1, 0.18, 0.5, 0.58])).toBeCloseTo(0.32);
    expect(validateWindow([0.1, 0.18, 0.5, 0.58], 2.5)).toEqual({ ok: true, hold: expect.closeTo(0.8, 5) });
    expect(validateWindow([0.22, 0.3, 0.45, 0.52], 1.5).ok).toBe(false);
  });
  it('rejects non-monotonic windows', () => {
    expect(validateWindow([0.3, 0.2, 0.9, 1], 3).ok).toBe(false);
  });
  it('detects overlapping holds', () => {
    expect(overlaps([0.1, 0.18, 0.5, 0.58], [0.4, 0.5, 0.9, 1])).toBe(false);
    expect(overlaps([0.1, 0.18, 0.5, 0.58], [0.3, 0.4, 0.9, 1])).toBe(true);
  });
});

describe('actor helpers', () => {
  const seq = [{ from: 0, src: 'a' }, { from: 0.15, src: 'b' }, { from: 0.5, src: 'c' }];
  it('picks the entry with the largest from <= p', () => {
    expect(pickSequence(seq, 0).src).toBe('a');
    expect(pickSequence(seq, 0.15).src).toBe('b');
    expect(pickSequence(seq, 0.49).src).toBe('b');
    expect(pickSequence(seq, 1).src).toBe('c');
  });
  it('alternates walk frames every period inside the window and is null outside', () => {
    expect(walkFrame([0, 0.3], 0.01)).toBe(0);
    expect(walkFrame([0, 0.3], 0.07)).toBe(1);
    expect(walkFrame([0, 0.3], 0.13)).toBe(0);
    expect(walkFrame([0, 0.3], 0.5)).toBeNull();
  });
  it('bobs between 0 and amp inside the window', () => {
    expect(walkBob([0, 0.3], 0)).toBeCloseTo(0);
    expect(walkBob([0, 0.3], 0.03)).toBeCloseTo(6);
    expect(walkBob([0, 0.3], 0.9)).toBe(0);
  });
});

describe('video helpers', () => {
  it('seeks only beyond one frame', () => {
    expect(shouldSeek(1.0, 1.0 + FRAME / 2)).toBe(false);
    expect(shouldSeek(1.0, 1.2)).toBe(true);
  });
  it('clamps to the last decodable frame', () => {
    expect(clampTime(5, -1)).toBe(0);
    expect(clampTime(5, 9)).toBeCloseTo(4.95);
  });
  it('maps a progress window onto the video duration', () => {
    expect(videoTime([0.2, 0.8], 0.5, 5)).toBeCloseTo(2.5);
    expect(videoTime([0.2, 0.8], 0.0, 5)).toBe(0);
    expect(videoTime([0.2, 0.8], 1.0, 5)).toBeCloseTo(4.95);
  });
  it('picks the mobile source below the breakpoint and falls back to desktop', () => {
    expect(pickSrc(true, '/d.mp4', '/m.mp4')).toBe('/d.mp4');
    expect(pickSrc(false, '/d.mp4', '/m.mp4')).toBe('/m.mp4');
    expect(pickSrc(false, '/d.mp4', undefined)).toBe('/d.mp4');
  });
});
```

(Add `pickSrc` to the import list at the top of the test file.)

- [ ] **Step 3: Run the tests to verify they fail**

Run: `npm test`
Expected: FAIL, `Cannot find module './math'`.

- [ ] **Step 4: Implement `src/film/math.js`**

```js
// Pure helpers for the scroll film. No React, no DOM.
export const FRAME = 1 / 24;

export function ramp(a, b, p) {
  if (a === b) return p >= a ? 1 : 0;
  if (p <= a) return 0;
  if (p >= b) return 1;
  return (p - a) / (b - a);
}

export function bubbleOpacity([in0, in1, out0, out1], p) {
  if (p < in0 || p >= out1) return 0;
  return Math.min(ramp(in0, in1, p), 1 - ramp(out0, out1, p));
}

export function bubbleRise([in0, in1, out0, out1], p, px = 20) {
  return (1 - ramp(in0, in1, p)) * px - ramp(out0, out1, p) * px;
}

export function holdLength([, in1, out0]) {
  return out0 - in1;
}

export function validateWindow(window, L, minHold = 0.8) {
  const [in0, in1, out0, out1] = window;
  const monotonic = in0 <= in1 && in1 <= out0 && out0 <= out1 && in0 >= 0 && out1 <= 1;
  const hold = holdLength(window) * L;
  return { ok: monotonic && hold >= minHold - 1e-9, hold };
}

export function overlaps(a, b) {
  return a[1] < b[2] && b[1] < a[2];
}

export function pickSequence(sequence, p) {
  let chosen = sequence[0];
  for (const entry of sequence) {
    if (entry.from <= p && entry.from >= chosen.from) chosen = entry;
  }
  return chosen;
}

export function walkFrame([start, end], p, period = 0.06) {
  if (p < start || p > end) return null;
  return Math.floor((p - start) / period) % 2;
}

export function walkBob([start, end], p, period = 0.06, amp = 6) {
  if (p < start || p > end) return 0;
  const phase = ((p - start) / period) % 1;
  return Math.sin(phase * Math.PI) * amp;
}

export function shouldSeek(current, target, frame = FRAME) {
  return Math.abs(target - current) > frame;
}

export function clampTime(duration, t) {
  return Math.max(0, Math.min(duration - 0.05, t));
}

export function videoTime([a, b], p, duration) {
  return clampTime(duration, ramp(a, b, p) * duration);
}

export function pickSrc(isDesktop, src, srcMobile) {
  return isDesktop || !srcMobile ? src : srcMobile;
}
```

- [ ] **Step 5: Run the tests to verify they pass**

Run: `npm test`
Expected: all green (18 tests).

- [ ] **Step 6: Lint and commit**

```bash
npm run lint
git add package.json package-lock.json vitest.config.js src/film/math.js src/film/math.test.js
git commit -m "Add Vitest and the film math helpers

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 3: Box layout geometry

**Files:**
- Create: `src/film/boxesLayout.js`, `src/film/boxesLayout.test.js`

**Interfaces:**
- Produces:
  - `BOXES: [{id, label, logo?, isNew?}]` (8 entries, order: email, files, crm, invoicing, chat, google, microsoft, portal)
  - `positions(isDesktop) -> {id: [x, y]}` percentages of stage width/height
  - `EDGES` (7 ring + 2 chords) and `PORTAL_EDGES` (2) as `[fromId, toId]`
  - `segments(isDesktop, withPortal) -> [{from, to, x1, y1, x2, y2}]`
  - `ringPoints(isDesktop) -> [[x, y], …]` (7 points, ring order, closed back to the first)
  - `pointAlongPolyline(points, t) -> [x, y]` for `t` in 0..1
  - `boxFractions(points) -> number[]` cumulative-length fraction at which each point is reached

- [ ] **Step 1: Write the failing tests**

`src/film/boxesLayout.test.js`:

```js
import { describe, it, expect } from 'vitest';
import {
  BOXES, positions, EDGES, PORTAL_EDGES, segments, ringPoints, pointAlongPolyline, boxFractions,
} from './boxesLayout';

describe('boxes', () => {
  it('has eight boxes with the portal last', () => {
    expect(BOXES).toHaveLength(8);
    expect(BOXES[7]).toMatchObject({ id: 'portal', isNew: true });
  });
  it('places every box on desktop and on the mobile 4x2 grid', () => {
    const d = positions(true);
    expect(d.email).toEqual([50, 14]);
    expect(d.portal).toEqual([50, 86]);
    const m = positions(false);
    expect(Object.keys(m)).toHaveLength(8);
    const xs = new Set(Object.values(m).map(([x]) => x));
    const ys = new Set(Object.values(m).map(([, y]) => y));
    expect(xs.size).toBe(4);
    expect(ys.size).toBe(2);
    expect(Math.max(...ys)).toBeLessThanOrEqual(60); // inside the 32%–60% box band
    expect(Math.min(...ys)).toBeGreaterThanOrEqual(32);
  });
});

describe('edges and segments', () => {
  it('has a 7-ring plus two chords, and two portal edges', () => {
    expect(EDGES).toHaveLength(9);
    expect(EDGES).toContainEqual(['email', 'invoicing']);
    expect(EDGES).toContainEqual(['microsoft', 'crm']);
    expect(PORTAL_EDGES).toHaveLength(2);
  });
  it('resolves segments to coordinates and adds portal edges on demand', () => {
    expect(segments(true, false)).toHaveLength(9);
    expect(segments(true, true)).toHaveLength(11);
    const s = segments(true, false).find((e) => e.from === 'email' && e.to === 'files');
    expect(s).toMatchObject({ x1: 50, y1: 14, x2: 74, y2: 22 });
  });
});

describe('agent path', () => {
  it('walks the ring and returns to the start', () => {
    const pts = ringPoints(true);
    expect(pts).toHaveLength(8);
    expect(pts[0]).toEqual(pts[7]);
  });
  it('interpolates along the polyline', () => {
    const pts = [[0, 0], [10, 0], [10, 10]];
    expect(pointAlongPolyline(pts, 0)).toEqual([0, 0]);
    expect(pointAlongPolyline(pts, 0.5)).toEqual([10, 0]);
    expect(pointAlongPolyline(pts, 0.75)).toEqual([10, 5]);
    expect(pointAlongPolyline(pts, 1)).toEqual([10, 10]);
  });
  it('reports the fraction at which each point is reached', () => {
    expect(boxFractions([[0, 0], [10, 0], [10, 10]])).toEqual([0, 0.5, 1]);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test`
Expected: FAIL, `Cannot find module './boxesLayout'`.

- [ ] **Step 3: Implement `src/film/boxesLayout.js`**

```js
// Geometry for the system boxes. All coordinates are percentages of the stage (x: width, y: height).
export const BOXES = [
  { id: 'email', label: 'Email' },
  { id: 'files', label: 'Files' },
  { id: 'crm', label: 'CRM' },
  { id: 'invoicing', label: 'Invoicing' },
  { id: 'chat', label: 'Chat', logo: '/logos/slack.webp' },
  { id: 'google', label: 'Google', logo: '/logos/google.webp' },
  { id: 'microsoft', label: 'Microsoft', logo: '/logos/microsoft.webp' },
  { id: 'portal', label: 'Portal', isNew: true },
];

const DESKTOP = {
  email: [50, 14], files: [74, 22], crm: [86, 46], invoicing: [76, 72],
  chat: [24, 72], google: [14, 46], microsoft: [26, 22], portal: [50, 86],
};

// Mobile: 4×2 grid inside the box band (stage 32%–60%). Columns at 12.5/37.5/62.5/87.5, rows at 39/53.
const MOBILE = {
  email: [12.5, 39], files: [37.5, 39], crm: [62.5, 39], invoicing: [87.5, 39],
  chat: [12.5, 53], google: [37.5, 53], microsoft: [62.5, 53], portal: [87.5, 53],
};

export function positions(isDesktop) {
  return isDesktop ? DESKTOP : MOBILE;
}

const RING = ['email', 'files', 'crm', 'invoicing', 'chat', 'google', 'microsoft'];

export const EDGES = [
  ...RING.map((id, i) => [id, RING[(i + 1) % RING.length]]),
  ['email', 'invoicing'],
  ['microsoft', 'crm'],
];

export const PORTAL_EDGES = [['portal', 'invoicing'], ['portal', 'chat']];

export function segments(isDesktop, withPortal) {
  const pos = positions(isDesktop);
  const edges = withPortal ? [...EDGES, ...PORTAL_EDGES] : EDGES;
  return edges.map(([from, to]) => ({
    from, to, x1: pos[from][0], y1: pos[from][1], x2: pos[to][0], y2: pos[to][1],
  }));
}

export function ringPoints(isDesktop) {
  const pos = positions(isDesktop);
  const pts = RING.map((id) => pos[id]);
  return [...pts, pts[0]];
}

function lengths(points) {
  const out = [];
  for (let i = 1; i < points.length; i++) {
    const [ax, ay] = points[i - 1];
    const [bx, by] = points[i];
    out.push(Math.hypot(bx - ax, by - ay));
  }
  return out;
}

export function boxFractions(points) {
  const ls = lengths(points);
  const total = ls.reduce((a, b) => a + b, 0);
  const out = [0];
  let acc = 0;
  for (const l of ls) {
    acc += l;
    out.push(acc / total);
  }
  return out;
}

export function pointAlongPolyline(points, t) {
  const ls = lengths(points);
  const total = ls.reduce((a, b) => a + b, 0);
  let remaining = Math.max(0, Math.min(1, t)) * total;
  for (let i = 0; i < ls.length; i++) {
    if (remaining <= ls[i] || i === ls.length - 1) {
      const f = ls[i] === 0 ? 0 : remaining / ls[i];
      const [ax, ay] = points[i];
      const [bx, by] = points[i + 1];
      return [ax + (bx - ax) * f, ay + (by - ay) * f];
    }
    remaining -= ls[i];
  }
  return points[points.length - 1];
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test`
Expected: all green.

- [ ] **Step 5: Lint and commit**

```bash
npm run lint
git add src/film/boxesLayout.js src/film/boxesLayout.test.js
git commit -m "Add system box layout geometry

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 4: `useIsDesktop`, `Hand`, `Bubble`

**Files:**
- Create: `src/film/useIsDesktop.js`, `src/film/Hand.jsx`, `src/film/Bubble.jsx`, `src/film/Bubble.test.jsx`

**Interfaces:**
- Produces:
  - `useIsDesktop() -> boolean` (`min-width: 768px`, false during SSR)
  - `<Hand>word</Hand>`: Caveat 700, accent, `1.15em`
  - `<Bubble speaker="max"|"guide" anchor={{desktop:{left,top}, mobile:{slot:1|2}}} progress={MotionValue} window={[…4]} >` or `<Bubble speaker static>`; root carries `data-bubble={speaker}`.

- [ ] **Step 1: Write the failing test**

`src/film/Bubble.test.jsx`:

```jsx
import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { motionValue } from 'framer-motion';
import Bubble from './Bubble';
import Hand from './Hand';

describe('Bubble', () => {
  it('renders static bubbles in flow with a speaker label', () => {
    const html = renderToStaticMarkup(
      <Bubble speaker="guide" static>Walk <Hand>with</Hand> me.</Bubble>
    );
    expect(html).toContain('data-bubble="guide"');
    expect(html).toContain('data-static="true"');
    expect(html).toContain('The guide');
    expect(html).toContain('font-family:var(--font-hand)');
  });

  it('renders animated bubbles absolutely positioned with the mobile slot by default (SSR = mobile)', () => {
    const p = motionValue(0.3);
    const html = renderToStaticMarkup(
      <Bubble speaker="max" progress={p} window={[0.1, 0.18, 0.5, 0.58]}
        anchor={{ desktop: { left: '22%', top: '10%' }, mobile: { slot: 2 } }}>
        Is that <Hand>it</Hand>?
      </Bubble>
    );
    expect(html).toContain('data-bubble="max"');
    expect(html).toContain('position:absolute');
    expect(html).toContain('top:17%');
    expect(html).toContain('opacity:1');
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test`
Expected: FAIL, `Cannot find module './Bubble'`.

- [ ] **Step 3: Implement the three files**

`src/film/useIsDesktop.js` (uses `useSyncExternalStore`, so no `setState` inside an effect, which `react-hooks` v7 flags):

```js
import { useSyncExternalStore } from 'react';

const QUERY = '(min-width: 768px)';

function subscribe(onChange) {
  const m = window.matchMedia(QUERY);
  m.addEventListener('change', onChange);
  return () => m.removeEventListener('change', onChange);
}

const getSnapshot = () => window.matchMedia(QUERY).matches;
const getServerSnapshot = () => false;

export default function useIsDesktop() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
```

`src/film/Hand.jsx`:

```jsx
export const ACCENT = '#6B5B95';

export default function Hand({ children }) {
  return (
    <span style={{ fontFamily: 'var(--font-hand)', fontWeight: 700, color: ACCENT, fontSize: '1.15em', lineHeight: 1 }}>
      {children}
    </span>
  );
}
```

`src/film/Bubble.jsx`:

```jsx
import { motion, useMotionValue, useTransform } from 'framer-motion';
import useIsDesktop from './useIsDesktop';
import { bubbleOpacity, bubbleRise } from './math';

const INK = '#1F1A14';
const PAPER = '#F3ECE1';
const NAMES = { max: 'Max', guide: 'The guide' };
const SLOT_TOP = { 1: '4%', 2: '17%' };

// The classic hand-drawn border: uneven radii make a slightly wobbly outline that stays crisp at any size.
const SHAPE = {
  border: `2px solid rgba(31, 26, 20, 0.85)`,
  borderRadius: '255px 15px 225px 15px / 15px 225px 15px 255px',
  backgroundColor: PAPER,
  color: INK,
  padding: '0.9rem 1.2rem',
  fontFamily: 'var(--font-sans)',
  fontWeight: 500,
  fontSize: 'clamp(1rem, 1.4vw, 1.35rem)',
  lineHeight: 1.35,
  maxWidth: '34ch',
  boxShadow: '0 2px 12px rgba(31, 26, 20, 0.06)',
};

function Tail({ side }) {
  const flip = side === 'right' ? 'scaleX(-1)' : 'none';
  return (
    <svg viewBox="0 0 40 28" width="34" height="24" aria-hidden="true"
      style={{ position: 'absolute', bottom: -21, [side]: 28, transform: flip, overflow: 'visible' }}>
      <path d="M 4 2 C 8 12, 10 20, 6 27 C 16 20, 26 10, 34 3" fill={PAPER} stroke="rgba(31, 26, 20, 0.85)" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export default function Bubble({ speaker, anchor, progress, window: win, static: isStatic = false, children }) {
  const isDesktop = useIsDesktop();
  const fallback = useMotionValue(1);
  const source = progress ?? fallback;
  const opacity = useTransform(source, (p) => (win ? bubbleOpacity(win, p) : 1));
  const y = useTransform(source, (p) => (win ? bubbleRise(win, p) : 0));
  const side = speaker === 'max' ? 'left' : 'right';

  if (isStatic) {
    return (
      <div data-bubble={speaker} data-static="true" className="relative my-4" style={{ maxWidth: '40ch' }}>
        <div style={{ fontFamily: 'var(--font-hand)', fontWeight: 600, fontSize: '1.1rem', color: 'rgba(31,26,20,0.65)', marginBottom: 4 }}>
          {NAMES[speaker]}
        </div>
        <div style={SHAPE}>{children}</div>
      </div>
    );
  }

  const position = isDesktop
    ? { left: anchor.desktop.left, top: anchor.desktop.top }
    : { left: '6%', right: '6%', top: SLOT_TOP[anchor.mobile.slot] };

  return (
    <motion.div data-bubble={speaker} className="z-20 pointer-events-none"
      style={{ position: 'absolute', ...position, opacity, y }}>
      <div style={{ ...SHAPE, position: 'relative', marginLeft: isDesktop ? 0 : 'auto', marginRight: isDesktop ? 0 : 'auto' }}>
        {children}
        <Tail side={side} />
      </div>
    </motion.div>
  );
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test`
Expected: green. If `opacity:1` is not in the SSR output, framer serialised the motion value differently; assert on `data-bubble` and `top:17%` only and note it in the commit.

- [ ] **Step 5: Lint and commit**

```bash
npm run lint
git add src/film/useIsDesktop.js src/film/Hand.jsx src/film/Bubble.jsx src/film/Bubble.test.jsx
git commit -m "Add film Bubble, Hand and useIsDesktop

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 5: `Scene`

**Files:**
- Create: `src/film/Scene.jsx`, `src/film/Scene.test.jsx`

**Interfaces:**
- Produces: `<Scene id length reduced staticContent className>{(progress) => …}</Scene>`. Section has `data-scene={id}` and `data-length={length}`. `SPRING`, `PAPER`, `INK`, `ACCENT` exported from `src/film/constants.js`.

- [ ] **Step 1: Write the failing test**

`src/film/Scene.test.jsx`:

```jsx
import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import Scene from './Scene';

describe('Scene', () => {
  it('reserves (L + 1) viewports in svh and pins a 100svh stage', () => {
    const html = renderToStaticMarkup(
      <Scene id="question" length={2.5}>{() => <p>stage</p>}</Scene>
    );
    expect(html).toContain('height:350svh');
    expect(html).toContain('height:100svh');
    expect(html).toContain('data-scene="question"');
    expect(html).toContain('data-length="2.5"');
    expect(html).toContain('sticky');
  });

  it('renders the static content in flow when reduced', () => {
    const html = renderToStaticMarkup(
      <Scene id="question" length={2.5} reduced staticContent={<p>static</p>}>{() => <p>stage</p>}</Scene>
    );
    expect(html).toContain('data-film-static="true"');
    expect(html).toContain('static');
    expect(html).not.toContain('sticky');
    expect(html).not.toContain('350svh');
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test`
Expected: FAIL, `Cannot find module './Scene'`.

- [ ] **Step 3: Implement `src/film/constants.js` and `src/film/Scene.jsx`**

`src/film/constants.js`:

```js
export const SPRING = { stiffness: 120, damping: 30, mass: 0.4 };
export const PAPER = '#F3ECE1';
export const INK = '#1F1A14';
export const ACCENT = '#6B5B95';
```

`src/film/Scene.jsx`. The scroll hooks live in an inner component that only mounts in animated mode: framer-motion's `useScroll` throws `Target ref is defined but not hydrated` when its target ref is never attached, which is exactly what the static branch would do.

```jsx
import { useRef } from 'react';
import { useScroll, useSpring } from 'framer-motion';
import { PAPER, SPRING } from './constants';

function Pinned({ id, length, className, children }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const progress = useSpring(scrollYProgress, SPRING);
  return (
    <section id={id} ref={ref} data-scene={id} data-length={length} className={`relative ${className}`}
      style={{ height: `${(length + 1) * 100}svh`, backgroundColor: PAPER }}>
      <div className="sticky top-0 w-full overflow-hidden" style={{ height: '100svh' }}>
        {children(progress)}
      </div>
    </section>
  );
}

/**
 * A pinned scene. `length` is the scroll distance in viewports while the stage is pinned,
 * so the section is (length + 1) viewports tall. Children receive a spring-smoothed 0..1 progress.
 * When `reduced` is true the scene renders `staticContent` in normal flow instead.
 */
export default function Scene({ id, length, reduced = false, staticContent = null, className = '', children }) {
  if (reduced) {
    return (
      <section id={id} data-scene={id} data-film-static="true" className={`relative px-6 md:px-[4vw] py-12 ${className}`} style={{ backgroundColor: PAPER }}>
        <div className="max-w-[1100px] mx-auto">{staticContent}</div>
      </section>
    );
  }
  return <Pinned id={id} length={length} className={className}>{children}</Pinned>;
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test`
Expected: green.

- [ ] **Step 5: Lint and commit**

```bash
npm run lint
git add src/film/constants.js src/film/Scene.jsx src/film/Scene.test.jsx
git commit -m "Add film Scene wrapper

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 6: `Actor` and backdrops

**Files:**
- Create: `src/film/Actor.jsx`, `src/film/Backdrop.jsx`, `src/film/Actor.test.jsx`

**Interfaces:**
- Produces:
  - `<Actor progress sequence=[{from, src}] walk={{frames:[a,b], window:[s,e]}} x=[stops, values] y=[stops, values] rotate scale opacity eager alt>`; root `<motion.img data-actor>` centred on `left`, standing in the desktop band (`bottom: 12%`, `height: 62%`) or the mobile band (`bottom: 3%`, `height: 34%`). `x` values are CSS lengths/percentages.
  - `<Actor static={{src, left}} />` renders a plain `<img>`.
  - `<Paper />` (tiled paper), `<Backdrop src srcMobile alt />` (16:9 cover, lazy).

- [ ] **Step 1: Write the failing test**

`src/film/Actor.test.jsx`:

```jsx
import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { motionValue } from 'framer-motion';
import Actor from './Actor';
import { Paper, Backdrop } from './Backdrop';

describe('Actor', () => {
  const seq = [{ from: 0, src: '/a.webp' }, { from: 0.5, src: '/b.webp' }];
  it('shows the sequence entry for the initial progress and lazy-loads by default', () => {
    const html = renderToStaticMarkup(<Actor progress={motionValue(0.6)} sequence={seq} x={[[0, 1], ['20%', '20%']]} />);
    expect(html).toContain('src="/b.webp"');
    expect(html).toContain('loading="lazy"');
    expect(html).toContain('data-actor');
  });
  it('loads eagerly when asked', () => {
    const html = renderToStaticMarkup(<Actor progress={motionValue(0)} sequence={seq} eager />);
    expect(html).toContain('loading="eager"');
  });
  it('renders a plain positioned img in static mode', () => {
    const html = renderToStaticMarkup(<Actor static={{ src: '/a.webp', left: '30%' }} alt="Max" />);
    expect(html).toContain('src="/a.webp"');
    expect(html).toContain('alt="Max"');
    expect(html).not.toContain('data-actor');
  });
});

describe('backdrops', () => {
  it('tiles the paper and lazy-loads the office', () => {
    expect(renderToStaticMarkup(<Paper />)).toContain('/film/paper.png');
    const html = renderToStaticMarkup(<Backdrop src="/film/backdrops/office.webp" srcMobile="/film/backdrops/office-800.webp" />);
    expect(html).toContain('loading="lazy"');
    expect(html).toContain('office-800.webp');
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test`
Expected: FAIL, `Cannot find module './Actor'`.

- [ ] **Step 3: Implement `src/film/Actor.jsx`**

```jsx
import { useState } from 'react';
import { motion, transform, useMotionValueEvent, useTransform } from 'framer-motion';
import { pickSequence, walkBob, walkFrame } from './math';

const noop = () => 0;

function keyframes(spec, fallback) {
  if (!spec) return () => fallback;
  const [stops, values] = spec;
  return transform(stops, values);
}

function srcFor(sequence, walk, p) {
  if (walk) {
    const f = walkFrame(walk.window, p);
    if (f !== null) return walk.frames[f];
  }
  return pickSequence(sequence, p).src;
}

// Desktop: characters stand on a baseline at 88% of the stage, 62% tall. Mobile: the bottom 40% band (spec §3.5).
const BAND = { desktop: { bottom: '12%', height: '62%' }, mobile: { bottom: '3%', height: '34%' } };

/**
 * A character or prop cutout driven by scene progress.
 * `sequence` picks the image by progress; `walk` alternates two frames inside its window and adds a bob.
 * Transform keyframes are [stops, values] arrays (framer `transform` semantics).
 */
export default function Actor({
  progress, sequence = [], walk, x, y, rotate, scale, opacity, eager = false,
  alt = '', static: isStatic = null, className = '', zIndex = 10,
}) {
  const isDesktop = useIsDesktop();
  const band = isDesktop ? BAND.desktop : BAND.mobile;
  if (isStatic) {
    return (
      <img src={isStatic.src} alt={alt} loading="lazy"
        style={{ position: 'absolute', bottom: band.bottom, left: isStatic.left, transform: 'translateX(-50%)', height: band.height, width: 'auto' }} />
    );
  }
  return <LiveActor {...{ progress, sequence, walk, x, y, rotate, scale, opacity, eager, band, alt, className, zIndex }} />;
}

function LiveActor({ progress, sequence, walk, x, y, rotate, scale, opacity, eager, band, alt, className, zIndex }) {
  const [src, setSrc] = useState(() => srcFor(sequence, walk, progress.get()));
  useMotionValueEvent(progress, 'change', (p) => {
    const next = srcFor(sequence, walk, p);
    if (next !== src) setSrc(next);
  });
  const xf = keyframes(x, '50%');
  const yf = keyframes(y, 0);
  const rf = keyframes(rotate, 0);
  const sf = keyframes(scale, 1);
  const of = keyframes(opacity, 1);
  const left = useTransform(progress, (p) => xf(p));
  const yy = useTransform(progress, (p) => (typeof yf(p) === 'number' ? yf(p) : 0) - (walk ? walkBob(walk.window, p) : noop()));
  const rot = useTransform(progress, (p) => rf(p));
  const sc = useTransform(progress, (p) => sf(p));
  const op = useTransform(progress, (p) => of(p));
  return (
    <motion.img data-actor src={src} alt={alt} loading={eager ? 'eager' : 'lazy'} draggable={false}
      className={`pointer-events-none select-none ${className}`}
      style={{ position: 'absolute', bottom: band.bottom, left, x: '-50%', y: yy, rotate: rot, scale: sc, opacity: op, height: band.height, width: 'auto', zIndex }} />
  );
}
```

Add `import useIsDesktop from './useIsDesktop';` at the top of `Actor.jsx`. The test's `height="62%"` default is gone; nothing in the test asserts on it.

`src/film/Backdrop.jsx`:

```jsx
export function Paper() {
  return (
    <div aria-hidden="true" className="absolute inset-0"
      style={{ backgroundImage: 'url(/film/paper.png)', backgroundRepeat: 'repeat', backgroundSize: '160px 160px' }} />
  );
}

export function Backdrop({ src, srcMobile, alt = '' }) {
  return (
    <picture>
      {srcMobile && <source media="(max-width: 767px)" srcSet={srcMobile} />}
      <img src={src} alt={alt} loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
    </picture>
  );
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test`
Expected: green.

- [ ] **Step 5: Lint and commit**

```bash
npm run lint
git add src/film/Actor.jsx src/film/Backdrop.jsx src/film/Actor.test.jsx
git commit -m "Add film Actor and backdrops

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 7: Scrub loop and `ScrubVideo`

**Files:**
- Create: `src/film/scrubLoop.js`, `src/film/scrubLoop.test.js`, `src/film/ScrubVideo.jsx`, `src/film/ScrubVideo.test.jsx`

**Interfaces:**
- Produces:
  - `createScrubLoop({ raf, caf }) -> { register(entry), unregister(entry), size() }` where `entry = { video, target: () => number }`; default export `scrubLoop` bound to `window`.
  - `<ScrubVideo progress window=[a,b] src srcMobile poster loadPolicy="nearViewport"|"afterLoad" className style opacity=[stops, values]>`; `<video>` has `data-scrub-active` while registered, `data-video-failed` after an error.

- [ ] **Step 1: Write the failing tests**

`src/film/scrubLoop.test.js`:

```js
import { describe, it, expect, vi } from 'vitest';
import { createScrubLoop } from './scrubLoop';

function fakeRaf() {
  const queue = [];
  return {
    raf: vi.fn((cb) => { queue.push(cb); return queue.length; }),
    caf: vi.fn(),
    flush() { const cbs = queue.splice(0); cbs.forEach((cb) => cb(0)); },
    pending: () => queue.length,
  };
}

describe('scrub loop', () => {
  it('schedules nothing while the registry is empty', () => {
    const r = fakeRaf();
    createScrubLoop(r);
    expect(r.raf).not.toHaveBeenCalled();
  });

  it('seeks each registered video once per tick when beyond one frame', () => {
    const r = fakeRaf();
    const loop = createScrubLoop(r);
    const video = { currentTime: 0 };
    const sets = [];
    Object.defineProperty(video, 'currentTime', { get: () => 0, set: (v) => sets.push(v) });
    loop.register({ video, target: () => 3.2 });
    expect(r.raf).toHaveBeenCalledTimes(1);
    r.flush();
    expect(sets).toEqual([3.2]);
    expect(r.pending()).toBe(1);
  });

  it('does not seek within one frame', () => {
    const r = fakeRaf();
    const loop = createScrubLoop(r);
    const sets = [];
    const video = {};
    Object.defineProperty(video, 'currentTime', { get: () => 1, set: (v) => sets.push(v) });
    loop.register({ video, target: () => 1.01 });
    r.flush();
    expect(sets).toEqual([]);
  });

  it('stops when the last video unregisters', () => {
    const r = fakeRaf();
    const loop = createScrubLoop(r);
    const entry = { video: { currentTime: 0 }, target: () => 0 };
    loop.register(entry);
    loop.unregister(entry);
    expect(r.caf).toHaveBeenCalledTimes(1);
    expect(loop.size()).toBe(0);
    r.flush();
    expect(r.pending()).toBe(0);
  });
});
```

`src/film/ScrubVideo.test.jsx`:

```jsx
import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { motionValue } from 'framer-motion';
import ScrubVideo from './ScrubVideo';

describe('ScrubVideo', () => {
  it('renders muted, inline, preload none, poster set and no src before activation', () => {
    const html = renderToStaticMarkup(
      <ScrubVideo progress={motionValue(0)} window={[0, 0.8]} src="/film/video/a.mp4" srcMobile="/film/video/a-mobile.mp4" poster="/film/video/a.webp" />
    );
    expect(html).toContain('<video');
    expect(html).toContain('muted');
    expect(html).toContain('playsinline');
    expect(html).toContain('preload="none"');
    expect(html).toContain('poster="/film/video/a.webp"');
    expect(html).not.toContain('src="/film/video/a.mp4"');
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npm test`
Expected: FAIL, modules not found.

- [ ] **Step 3: Implement `src/film/scrubLoop.js`**

```js
import { shouldSeek } from './math';

/** One requestAnimationFrame loop shared by every scrubbed video on the page. */
export function createScrubLoop({ raf, caf }) {
  const registry = new Set();
  let handle = null;

  function tick() {
    for (const entry of registry) {
      const target = entry.target();
      if (shouldSeek(entry.video.currentTime, target)) entry.video.currentTime = target;
    }
    handle = registry.size ? raf(tick) : null;
  }

  return {
    register(entry) {
      registry.add(entry);
      if (handle === null) handle = raf(tick);
    },
    unregister(entry) {
      registry.delete(entry);
      if (registry.size === 0 && handle !== null) {
        caf(handle);
        handle = null;
      }
    },
    size: () => registry.size,
  };
}

const scrubLoop = typeof window !== 'undefined'
  ? createScrubLoop({ raf: (cb) => window.requestAnimationFrame(cb), caf: (h) => window.cancelAnimationFrame(h) })
  : createScrubLoop({ raf: () => 0, caf: () => {} });

export default scrubLoop;
```

`src/film/ScrubVideo.jsx`:

```jsx
import { useEffect, useRef, useState } from 'react';
import { motion, transform, useMotionValueEvent, useTransform } from 'framer-motion';
import scrubLoop from './scrubLoop';
import useIsDesktop from './useIsDesktop';
import { pickSrc, videoTime } from './math';

/**
 * Scroll-scrubbed all-intra video. No bytes are requested until activation:
 * `nearViewport` activates one viewport ahead, `afterLoad` activates on the window load event.
 * The target time is recomputed from the current progress on metadata, registration and src change.
 */
export default function ScrubVideo({
  progress, window: win, src, srcMobile, poster, loadPolicy = 'nearViewport',
  className = '', style = {}, opacity,
}) {
  const videoRef = useRef(null);
  const durationRef = useRef(0);
  const targetRef = useRef(0);
  const entryRef = useRef(null);
  const isDesktop = useIsDesktop();
  const [activated, setActivated] = useState(false);
  const [active, setActive] = useState(false);
  const [failed, setFailed] = useState(false);
  const of = opacity ? transform(opacity[0], opacity[1]) : () => 1;
  const op = useTransform(progress, (p) => of(p));

  const recompute = () => {
    if (!durationRef.current) return;
    targetRef.current = videoTime(win, progress.get(), durationRef.current);
  };

  useMotionValueEvent(progress, 'change', () => recompute());

  // Activation: start loading on the chosen policy.
  useEffect(() => {
    if (activated) return undefined;
    const el = videoRef.current;
    if (!el) return undefined;
    if (loadPolicy === 'afterLoad') {
      if (document.readyState === 'complete') {
        const t = setTimeout(() => setActivated(true), 0); // never set state synchronously inside an effect
        return () => clearTimeout(t);
      }
      const onLoad = () => setActivated(true);
      window.addEventListener('load', onLoad, { once: true });
      return () => window.removeEventListener('load', onLoad);
    }
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) { io.disconnect(); setActivated(true); }
    }, { rootMargin: '100% 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, [activated, loadPolicy]);

  // Load the chosen source once activated; reload if the breakpoint changes.
  useEffect(() => {
    if (!activated || failed) return undefined;
    const el = videoRef.current;
    if (!el) return undefined;
    const chosen = pickSrc(isDesktop, src, srcMobile);
    if (el.getAttribute('src') === chosen) return undefined;
    const onMeta = () => { durationRef.current = el.duration || 0; recompute(); };
    const onError = () => { setFailed(true); if (entryRef.current) scrubLoop.unregister(entryRef.current); };
    el.addEventListener('loadedmetadata', onMeta);
    el.addEventListener('error', onError);
    el.preload = 'auto';
    el.src = chosen;
    el.load();
    const prime = el.play();
    if (prime && typeof prime.then === 'function') prime.then(() => el.pause()).catch(() => {});
    return () => {
      el.removeEventListener('loadedmetadata', onMeta);
      el.removeEventListener('error', onError);
    };
  }, [activated, failed, isDesktop, src, srcMobile]); // eslint-disable-line react-hooks/exhaustive-deps

  // Register with the shared loop only while the video is near the viewport.
  useEffect(() => {
    if (!activated || failed) return undefined;
    const el = videoRef.current;
    if (!el) return undefined;
    const entry = { video: el, target: () => targetRef.current };
    entryRef.current = entry;
    const io = new IntersectionObserver((entries) => {
      const near = entries.some((e) => e.isIntersecting);
      if (near) { recompute(); scrubLoop.register(entry); setActive(true); }
      else { scrubLoop.unregister(entry); setActive(false); }
    }, { rootMargin: '100% 0px' });
    io.observe(el);
    return () => { io.disconnect(); scrubLoop.unregister(entry); };
  }, [activated, failed]); // eslint-disable-line react-hooks/exhaustive-deps

  if (failed) {
    return <img data-video-failed="true" src={poster} alt="" className={className} style={style} />;
  }

  return (
    <motion.video ref={videoRef} poster={poster} muted playsInline preload="none"
      data-scrub-active={active ? 'true' : 'false'}
      className={className} style={{ ...style, opacity: op }} />
  );
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npm test`
Expected: green.

- [ ] **Step 5: Lint and commit**

```bash
npm run lint
git add src/film/scrubLoop.js src/film/scrubLoop.test.js src/film/ScrubVideo.jsx src/film/ScrubVideo.test.jsx
git commit -m "Add shared scrub loop and ScrubVideo

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 8: `SystemBoxes` and `AgentBot`

**Files:**
- Create: `src/film/SystemBoxes.jsx`, `src/film/AgentBot.jsx`, `src/film/SystemBoxes.test.jsx`

**Interfaces:**
- Produces:
  - `<SystemBoxes progress appear=[a,b] connect=[a,b] showNew={p|null} locks flow static>`; renders `[data-box=id]` elements and `<svg data-boxes-svg viewBox="0 0 100 100" preserveAspectRatio="none">`. `static` renders everything at rest (boxes visible, lines drawn, portal shown).
  - `<AgentBot progress travel=[a,b] src>`; renders `[data-agent]` positioned along the ring and emits `[data-ping=id]` rings.

- [ ] **Step 1: Write the failing test**

`src/film/SystemBoxes.test.jsx`:

```jsx
import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { motionValue } from 'framer-motion';
import SystemBoxes from './SystemBoxes';
import AgentBot from './AgentBot';

describe('SystemBoxes', () => {
  it('renders eight boxes and nine lines, portal hidden until showNew', () => {
    const html = renderToStaticMarkup(<SystemBoxes progress={motionValue(1)} appear={[0.1, 0.45]} connect={[0.5, 0.85]} showNew={null} />);
    expect(html.match(/data-box="/g)).toHaveLength(8);
    expect(html.match(/<line/g)).toHaveLength(9);
    expect(html).toContain('data-box="portal"');
    expect(html).toContain('data-portal-visible="false"');
  });
  it('adds the two portal lines and locks when asked', () => {
    const html = renderToStaticMarkup(<SystemBoxes progress={motionValue(1)} appear={[0, 0.1]} connect={[0.1, 0.2]} showNew={0.5} locks />);
    expect(html.match(/<line/g)).toHaveLength(11);
    expect(html.match(/data-lock="/g)).toHaveLength(11);
    expect(html).toContain('data-portal-visible="true"');
  });
  it('renders a static composition without motion values', () => {
    const html = renderToStaticMarkup(<SystemBoxes static showNew={0} />);
    expect(html.match(/data-box="/g)).toHaveLength(8);
    expect(html).toContain('data-portal-visible="true"');
  });
});

describe('AgentBot', () => {
  it('positions the agent on the ring for the given progress', () => {
    const html = renderToStaticMarkup(<AgentBot progress={motionValue(0.1)} travel={[0.1, 0.9]} src="/film/actors/agent-bot.webp" />);
    expect(html).toContain('data-agent');
    expect(html.match(/data-ping="/g)).toHaveLength(7);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test`
Expected: FAIL, modules not found.

- [ ] **Step 3: Implement `src/film/SystemBoxes.jsx`**

```jsx
import { motion, useMotionValue, useTransform } from 'framer-motion';
import useIsDesktop from './useIsDesktop';
import { BOXES, EDGES, positions, segments } from './boxesLayout';
import { ramp } from './math';
import { INK, ACCENT, PAPER } from './constants';

const HAND_RADIUS = '255px 15px 225px 15px / 15px 225px 15px 255px';

function Box({ box, x, y, size, opacity, isNew }) {
  return (
    <motion.div data-box={box.id} className="absolute flex flex-col items-center justify-center gap-1 pointer-events-none"
      style={{
        left: `${x}%`, top: `${y}%`, width: size, height: size, x: '-50%', y: '-50%', opacity,
        border: `2px solid ${isNew ? ACCENT : 'rgba(31,26,20,0.7)'}`, borderRadius: HAND_RADIUS, backgroundColor: PAPER,
        boxShadow: '0 2px 12px rgba(31, 26, 20, 0.06)',
      }}>
      {box.logo
        ? <img src={box.logo} alt={box.label} loading="lazy" style={{ width: '46%', height: '46%', objectFit: 'contain' }} />
        : <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, color: isNew ? ACCENT : INK, fontSize: size > 80 ? '0.95rem' : '0.6rem' }}>{box.label}</span>}
    </motion.div>
  );
}

function Lock({ x, y, id }) {
  return (
    <g data-lock={id} transform={`translate(${x} ${y})`}>
      <rect x="-1.1" y="-0.6" width="2.2" height="1.8" rx="0.3" fill={PAPER} stroke={INK} strokeWidth="0.25" vectorEffect="non-scaling-stroke" />
      <path d="M -0.6 -0.6 V -1.2 A 0.6 0.6 0 0 1 0.6 -1.2 V -0.6" fill="none" stroke={INK} strokeWidth="0.25" vectorEffect="non-scaling-stroke" />
    </g>
  );
}

/**
 * The eight system boxes and the lines between them.
 * appear: window during which boxes fade in one after another. connect: window during which lines draw.
 * showNew: progress at which the portal box appears (null = never). locks/flow: decorations for scene 5.
 */
export default function SystemBoxes({ progress, appear = [0, 0], connect = [0, 0], showNew = null, locks = false, flow = false, static: isStatic = false }) {
  const isDesktop = useIsDesktop();
  const fallback = useMotionValue(1);
  const p = isStatic ? fallback : progress;
  const pos = positions(isDesktop);
  const size = isDesktop ? 112 : 56;
  const withPortal = showNew !== null;
  const segs = segments(isDesktop, withPortal);
  const base = BOXES.filter((b) => !b.isNew);
  const step = (appear[1] - appear[0]) / base.length;
  const cstep = (connect[1] - connect[0]) / EDGES.length;

  const boxOpacities = base.map((_, i) => useTransform(p, (v) => (isStatic ? 1 : ramp(appear[0] + i * step, appear[0] + (i + 1) * step, v)))); // eslint-disable-line react-hooks/rules-of-hooks
  // Ring and chord lines draw during `connect`; the two portal lines draw together with the portal box.
  const lineLengths = segs.map((s, j) => useTransform(p, (v) => { // eslint-disable-line react-hooks/rules-of-hooks
    if (isStatic) return 1;
    if (s.from === 'portal') return ramp(showNew, showNew + 0.08, v);
    return ramp(connect[0] + j * cstep, connect[0] + (j + 1) * cstep, v);
  }));
  const portalOpacity = useTransform(p, (v) => (!withPortal ? 0 : isStatic ? 1 : ramp(showNew, showNew + 0.05, v)));
  const dash = useTransform(p, (v) => -v * 60);
  const portalVisible = withPortal && (isStatic || p.get() >= showNew);

  return (
    <div className="absolute inset-0 pointer-events-none" data-boxes>
      <svg data-boxes-svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full" aria-hidden="true">
        {segs.map((s, j) => (
          <motion.line key={`${s.from}-${s.to}`} x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2}
            stroke="rgba(31,26,20,0.55)" strokeWidth="2" vectorEffect="non-scaling-stroke" strokeLinecap="round"
            style={{ pathLength: lineLengths[j] }} />
        ))}
        {/* framer's pathLength owns stroke-dasharray, so the dotted flow is a second set of plain lines. */}
        {flow && segs.map((s) => (
          <motion.line key={`flow-${s.from}-${s.to}`} x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2}
            stroke={ACCENT} strokeWidth="2" vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeDasharray="6 8"
            style={{ strokeDashoffset: dash }} />
        ))}
        {locks && segs.map((s) => <Lock key={`lock-${s.from}-${s.to}`} id={`${s.from}-${s.to}`} x={(s.x1 + s.x2) / 2} y={(s.y1 + s.y2) / 2} />)}
      </svg>
      {base.map((box, i) => <Box key={box.id} box={box} x={pos[box.id][0]} y={pos[box.id][1]} size={size} opacity={boxOpacities[i]} />)}
      <span data-portal-visible={portalVisible ? 'true' : 'false'} hidden />
      <Box box={BOXES[7]} x={pos.portal[0]} y={pos.portal[1]} size={size} opacity={portalOpacity} isNew />
    </div>
  );
}
```

`src/film/AgentBot.jsx`:

```jsx
import { motion, useTransform } from 'framer-motion';
import useIsDesktop from './useIsDesktop';
import { boxFractions, pointAlongPolyline, ringPoints } from './boxesLayout';
import { ramp } from './math';

const ACCENT = '#6B5B95';

/** A small helper figure that travels the ring of boxes; each box it reaches gets a short ink ring. */
export default function AgentBot({ progress, travel, src }) {
  const isDesktop = useIsDesktop();
  const pts = ringPoints(isDesktop);
  const fractions = boxFractions(pts).slice(0, 7);
  const t = useTransform(progress, (p) => ramp(travel[0], travel[1], p));
  const left = useTransform(t, (v) => `${pointAlongPolyline(pts, v)[0]}%`);
  const top = useTransform(t, (v) => `${pointAlongPolyline(pts, v)[1]}%`);
  const size = isDesktop ? 96 : 44;
  const pings = fractions.map((f) => useTransform(t, (v) => Math.max(0, 1 - Math.abs(v - f) / 0.06))); // eslint-disable-line react-hooks/rules-of-hooks
  return (
    <>
      {pts.slice(0, 7).map(([x, y], i) => (
        <motion.span key={i} data-ping={i} className="absolute rounded-full pointer-events-none"
          style={{ left: `${x}%`, top: `${y}%`, width: size * 1.6, height: size * 1.6, x: '-50%', y: '-50%', border: `2px solid ${ACCENT}`, opacity: pings[i] }} />
      ))}
      <motion.img data-agent src={src} alt="" loading="lazy" className="absolute pointer-events-none"
        style={{ left, top, x: '-50%', y: '-60%', height: size, width: 'auto', zIndex: 12 }} />
    </>
  );
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test`
Expected: green. (`hidden` span serialises as `<span data-portal-visible="true" hidden="">`; the assertion uses the attribute only.)

- [ ] **Step 5: Lint and commit**

```bash
npm run lint
git add src/film/SystemBoxes.jsx src/film/AgentBot.jsx src/film/SystemBoxes.test.jsx
git commit -m "Add SystemBoxes and AgentBot layers

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 9: Generate the character and prop cutouts

**Files:**
- Create: `public/film/actors/{max-neutral,max-walk-a,max-walk-b,max-stack,max-relieved,guide-neutral,guide-walk-a,guide-walk-b,guide-wave,guide-point,guide-draw,agent-bot}.webp`, `public/film/props/paper-stack.webp`

**Interfaces:**
- Consumes: `scripts/film/gen-image.sh`, `scripts/film/to-webp.sh` (Task 1).
- Produces: the WebP paths above, each with an alpha channel, characters ~900px tall.

Precondition: Codex is logged in (`codex login` opens a browser; the owner approves). Verify with a cheap `codex exec "Reply OK"` before starting.

- [ ] **Step 1: Generate the Max cutouts (one call each, in parallel)**

Shared prompt prefix for every cutout: `A single full-body character cutout on a fully TRANSPARENT background (no paper, no shadow, alpha channel), portrait orientation, the character fills the height, feet at the bottom edge. Draw exactly the character from Image 1 (Max): same face, hair tuft, shirt, suspenders, rust-red tie, dark trousers, big rounded shoes, same line weight and graphite shading.` Then one pose line:

| Out | Pose line |
|---|---|
| `max-neutral` | `Pose: standing neutral, facing slightly right, hands on hips, small smile.` |
| `max-walk-a` | `Pose: mid-stride walking to the right, LEFT foot forward and planted, right leg swinging back, arms swinging naturally, neutral face.` |
| `max-walk-b` | `Pose: mid-stride walking to the right, RIGHT foot forward and planted, left leg swinging back, arms swinging the opposite way, neutral face. Same framing and scale as a matching left-foot frame.` |
| `max-stack` | `Pose: walking to the right, carrying a wobbling stack of papers with a laptop on top, two sheets fluttering off, sweat drops, worried face.` |
| `max-relieved` | `Pose: standing, arms open wide, big relieved smile, eyes happy-closed.` |

```bash
mkdir -p /tmp/film-gen
MAX='A single full-body character cutout on a fully TRANSPARENT background (no paper, no shadow, alpha channel), portrait orientation, the character fills the height, feet at the bottom edge. Draw exactly the character from Image 1 (Max): same face, hair tuft, shirt, suspenders, rust-red tie, dark trousers, big rounded shoes, same line weight and graphite shading.'
scripts/film/gen-image.sh /tmp/film-gen/max-neutral.png "$MAX Pose: standing neutral, facing slightly right, hands on hips, small smile." &
scripts/film/gen-image.sh /tmp/film-gen/max-walk-a.png "$MAX Pose: mid-stride walking to the right, LEFT foot forward and planted, right leg swinging back, arms swinging naturally, neutral face." &
scripts/film/gen-image.sh /tmp/film-gen/max-walk-b.png "$MAX Pose: mid-stride walking to the right, RIGHT foot forward and planted, left leg swinging back, arms swinging the opposite way, neutral face. Same framing and scale as a matching left-foot frame." &
scripts/film/gen-image.sh /tmp/film-gen/max-stack.png "$MAX Pose: walking to the right, carrying a wobbling stack of papers with a laptop on top, two sheets fluttering off, sweat drops, worried face." &
scripts/film/gen-image.sh /tmp/film-gen/max-relieved.png "$MAX Pose: standing, arms open wide, big relieved smile, eyes happy-closed." &
wait
```

The same pattern applies in Step 2 with the guide prefix (`GUIDE='…'`) and the six guide pose lines, and in Step 3 for the agent and paper stack.

- [ ] **Step 2: Generate the guide cutouts**

Prefix: `A single full-body character cutout on a fully TRANSPARENT background (no paper, no shadow, alpha channel), portrait orientation, the character fills the height, feet at the bottom edge. Draw exactly the character from Image 2 (the guide): same face, hair, round-collared three-button jacket, slim trousers, big rounded shoes, pencil behind the ear, muted purple scarf, same line weight and graphite shading.`

| Out | Pose line |
|---|---|
| `guide-neutral` | `Pose: standing neutral, facing slightly left, hands in jacket pockets, calm smile.` |
| `guide-walk-a` | `Pose: mid-stride walking to the left, LEFT foot forward and planted, right leg swinging back, arms swinging naturally.` |
| `guide-walk-b` | `Pose: mid-stride walking to the left, RIGHT foot forward and planted, left leg swinging back, arms swinging the opposite way. Same framing and scale as a matching left-foot frame.` |
| `guide-wave` | `Pose: standing, one hand raised in a friendly wave, other hand on hip, open smile.` |
| `guide-point` | `Pose: standing, pointing forward-left with one hand and explaining, other hand on hip.` |
| `guide-draw` | `Pose: standing, holding the pencil up and drawing a curve in the air, focused, eyes on the pencil tip.` |

- [ ] **Step 3: Generate the agent and the paper stack**

`agent-bot`: `A small, round, friendly helper figure on a fully TRANSPARENT background: a sketched ball-shaped body on two short legs, two dot eyes, a tiny satchel across the body, no face resembling any known robot or mascot, same pencil style and line weight as Images 1 and 2. Square framing.`

`paper-stack`: `A wobbling stack of paper sheets with a closed laptop on top, on a fully TRANSPARENT background, same pencil style as the sheets, no character.`

- [ ] **Step 4: Inspect, convert and verify alpha**

Open each PNG (Read tool) and reject any that: has a cream or white background instead of transparency, drifts from the sheet (wrong clothes, mouse ears, gloves), or contains text. Regenerate rejected ones with the same prompt plus `The background MUST be transparent alpha, not cream.` Then:

```bash
for f in /tmp/film-gen/max-*.png /tmp/film-gen/guide-*.png /tmp/film-gen/agent-bot.png; do
  n=$(basename "$f" .png); scripts/film/to-webp.sh "$f" "public/film/actors/$n.webp" lossless; done
scripts/film/to-webp.sh /tmp/film-gen/paper-stack.png public/film/props/paper-stack.webp lossless
for f in public/film/actors/*.webp public/film/props/*.webp; do
  node_modules/ffmpeg-static/ffmpeg -v error -i "$f" -f null - 2>&1 | head -1
  node_modules/ffmpeg-static/ffmpeg -hide_banner -i "$f" 2>&1 | grep -oE "yuva420p|bgra|rgba|argb|yuv420p" | head -1 | xargs -I{} echo "$f {}"
done
rm public/film/actors/.gitkeep public/film/props/.gitkeep
```

Expected: every line reports an alpha pixel format (`yuva420p`, `bgra`, `rgba` or `argb`), never bare `yuv420p`. Any cutout over 400 kB is re-encoded with `scripts/film/to-webp.sh in.png out.webp 90`.

- [ ] **Step 5: Commit**

```bash
git add public/film/actors public/film/props
git commit -m "Add character and prop cutouts for the film

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 10: Generate the office backdrop

**Files:**
- Create: `public/film/backdrops/office.webp`, `public/film/backdrops/office-800.webp`

- [ ] **Step 1: Generate**

```bash
scripts/film/gen-image.sh /tmp/film-gen/office.png "An empty small-company office drawn as a wide 16:9 scene on cream paper: a simple desk with a closed laptop, a window with a plant on the sill, a filing cabinet, a wall clock, a floor line. No people, no characters, no screens with content, no text. Everything is light pencil line work with soft graphite shading so that characters and boxes placed on top remain readable; keep the centre of the image sparse. Use the same cream paper tone and line style as Images 1 and 2."
```

- [ ] **Step 2: Inspect and convert**

Read `/tmp/film-gen/office.png`. Reject if it contains people, text, or a dense centre. Then:

```bash
scripts/film/to-webp.sh /tmp/film-gen/office.png public/film/backdrops/office.webp 82
node_modules/ffmpeg-static/ffmpeg -v error -y -i /tmp/film-gen/office.png -vf scale=800:-2 /tmp/film-gen/office-800.png
scripts/film/to-webp.sh /tmp/film-gen/office-800.png public/film/backdrops/office-800.webp 80
rm public/film/backdrops/.gitkeep
ls -la public/film/backdrops
```

Expected: `office.webp` ≤ 250 kB, `office-800.webp` ≤ 80 kB.

- [ ] **Step 3: Commit**

```bash
git add public/film/backdrops
git commit -m "Add office backdrop for the film

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 11: Scenes 1, 2, 3 and 5 (no video)

**Files:**
- Create: `src/film/scenes/windows.js`, `src/film/scenes/windows.test.js`, `src/film/scenes/Question.jsx`, `src/film/scenes/Connect.jsx`, `src/film/scenes/Agents.jsx`, `src/film/scenes/Stay.jsx`, `src/film/Caption.jsx`

**Interfaces:**
- Consumes: `Scene`, `Bubble`, `Hand`, `Actor`, `Paper`, `Backdrop`, `SystemBoxes`, `AgentBot`.
- Produces: `SCENES` from `src/film/scenes/windows.js` (`{ title, question, connect, agents, build, stay }`, each `{ L, WINDOWS, SHORT? }`), and one default component per scene taking `{ reduced }`. Scene `.jsx` files export only their component (eslint `react-refresh/only-export-components` is an error).

- [ ] **Step 1: Write the windows module and its failing test**

`src/film/scenes/windows.js` (all six scenes, so Task 12 adds nothing here):

```js
// Scroll length (viewports) and bubble windows [in0, in1, out0, out1] per scene.
// Bubbles are rendered in the DOM in the same key order as WINDOWS; the verification script relies on that.
// SHORT lists windows exempt from the 0.8-viewport hold rule (the title-card hint only).
export const SCENES = {
  title:    { L: 1.5, WINDOWS: { hint: [0, 0, 0.25, 0.4] }, SHORT: ['hint'] },
  question: { L: 2.5, WINDOWS: { max: [0.10, 0.18, 0.50, 0.58], guide: [0.58, 0.66, 0.98, 1.0] } },
  connect:  { L: 3.5, WINDOWS: { all: [0.18, 0.25, 0.48, 0.55], connect: [0.58, 0.65, 0.93, 1.0] } },
  agents:   { L: 2.5, WINDOWS: { agents: [0.15, 0.23, 0.60, 0.68] } },
  build:    { L: 2.5, WINDOWS: { build: [0.25, 0.33, 0.70, 0.78] } },
  stay:     { L: 2.5, WINDOWS: { secure: [0.05, 0.13, 0.45, 0.53], stay: [0.55, 0.63, 0.95, 1.0] } },
};
```

`src/film/scenes/windows.test.js`:

```js
import { describe, it, expect } from 'vitest';
import { validateWindow, overlaps } from '../math';
import { SCENES } from './windows';

describe('scene windows', () => {
  it('covers all six scenes', () => {
    expect(Object.keys(SCENES)).toEqual(['title', 'question', 'connect', 'agents', 'build', 'stay']);
  });
  for (const [name, scene] of Object.entries(SCENES)) {
    it(`${name}: every bubble holds >= 0.8 viewport (unless SHORT) and holds never overlap`, () => {
      const entries = Object.entries(scene.WINDOWS);
      expect(entries.length).toBeGreaterThan(0);
      for (const [key, w] of entries) {
        const minHold = (scene.SHORT || []).includes(key) ? 0 : 0.8;
        const { ok, hold } = validateWindow(w, scene.L, minHold);
        expect({ key, w, hold, ok }).toMatchObject({ ok: true });
      }
      const wins = entries.map(([, w]) => w);
      for (let i = 0; i < wins.length; i++) for (let j = i + 1; j < wins.length; j++) {
        expect(overlaps(wins[i], wins[j])).toBe(false);
      }
    });
  }
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npm test`
Expected: FAIL, `Cannot find module './windows'`. Then create `windows.js` and run again: green (7 tests). The scene components below are checked by the build and the browser pass.

- [ ] **Step 3: Implement `src/film/Caption.jsx`**

```jsx
import { motion, useMotionValue, useTransform } from 'framer-motion';
import useIsDesktop from './useIsDesktop';
import { bubbleOpacity } from './math';

/**
 * Small Inter line shown under a bubble, sharing its window.
 * Desktop: absolutely positioned at `anchor` ({left, top}). Mobile: under bubble slot 1. Pass `static` to render in flow.
 */
export default function Caption({ progress, window: win, anchor, static: isStatic = false, children }) {
  const isDesktop = useIsDesktop();
  const fallback = useMotionValue(1);
  const opacity = useTransform(progress ?? fallback, (p) => (win ? bubbleOpacity(win, p) : 1));
  const style = { color: 'rgba(31,26,20,0.7)', fontFamily: 'var(--font-sans)', fontSize: 'clamp(0.9rem, 1.05vw, 1.1rem)', maxWidth: '40ch' };
  if (isStatic) return <p data-caption style={{ ...style, margin: '0.25rem 0 1rem' }}>{children}</p>;
  const pos = isDesktop ? anchor : { left: '6%', right: '6%', top: '17%', textAlign: 'center' };
  return (
    <motion.p data-caption className="absolute z-20 pointer-events-none" style={{ ...style, ...pos, opacity }}>{children}</motion.p>
  );
}
```

- [ ] **Step 4: Implement the four scenes**

`src/film/scenes/Question.jsx`:

```jsx
import Scene from '../Scene';
import Bubble from '../Bubble';
import Hand from '../Hand';
import Actor from '../Actor';
import { Paper } from '../Backdrop';
import { SCENES } from './windows';

const { L, WINDOWS } = SCENES.question;
const A = '/film/actors';

function Static() {
  return (
    <>
      <div className="relative" style={{ height: '60svh' }}>
        <Paper />
        <Actor static={{ src: `${A}/max-stack.webp`, left: '30%' }} alt="Max, carrying a wobbling stack of papers" />
        <Actor static={{ src: `${A}/guide-wave.webp`, left: '70%' }} alt="The guide, waving" />
      </div>
      <Bubble speaker="max" static>Our IT partner sorts out the laptops and the Microsoft account. Is that <Hand>it</Hand>?</Bubble>
      <Bubble speaker="guide" static>Laptops are the <Hand>easy</Hand> part. Walk with me.</Bubble>
    </>
  );
}

export default function Question({ reduced }) {
  return (
    <Scene id="question" length={L} reduced={reduced} staticContent={<Static />}>
      {(progress) => (
        <>
          <Paper />
          <Actor progress={progress} eager alt="Max"
            sequence={[{ from: 0, src: `${A}/max-stack.webp` }]}
            x={[[0, 1], ['22%', '22%']]} />
          <Actor progress={progress} eager alt="The guide"
            sequence={[{ from: 0, src: `${A}/guide-walk-a.webp` }, { from: 0.15, src: `${A}/guide-wave.webp` }, { from: 0.5, src: `${A}/guide-neutral.webp` }]}
            walk={{ frames: [`${A}/guide-walk-a.webp`, `${A}/guide-walk-b.webp`], window: [0, 0.15] }}
            x={[[0, 0.15], ['110%', '66%']]} />
          <Bubble speaker="max" progress={progress} window={WINDOWS.max} anchor={{ desktop: { left: '14%', top: '10%' }, mobile: { slot: 1 } }}>
            Our IT partner sorts out the laptops and the Microsoft account. Is that <Hand>it</Hand>?
          </Bubble>
          <Bubble speaker="guide" progress={progress} window={WINDOWS.guide} anchor={{ desktop: { left: '52%', top: '10%' }, mobile: { slot: 2 } }}>
            Laptops are the <Hand>easy</Hand> part. Walk with me.
          </Bubble>
        </>
      )}
    </Scene>
  );
}
```

`src/film/scenes/Connect.jsx`:

```jsx
import Scene from '../Scene';
import Bubble from '../Bubble';
import Hand from '../Hand';
import Actor from '../Actor';
import { Backdrop } from '../Backdrop';
import SystemBoxes from '../SystemBoxes';
import { SCENES } from './windows';

const { L, WINDOWS } = SCENES.connect;
const A = '/film/actors';
const OFFICE = { src: '/film/backdrops/office.webp', srcMobile: '/film/backdrops/office-800.webp' };

function Static() {
  return (
    <>
      <div className="relative" style={{ height: '60svh' }}>
        <Backdrop {...OFFICE} />
        <SystemBoxes static showNew={null} />
        <Actor static={{ src: `${A}/max-neutral.webp`, left: '34%' }} alt="Max" />
        <Actor static={{ src: `${A}/guide-point.webp`, left: '50%' }} alt="The guide" />
      </div>
      <Bubble speaker="guide" static>Email, files, CRM, invoicing, chat. We look after <Hand>all</Hand> of it.</Bubble>
      <Bubble speaker="guide" static>First we <Hand>connect</Hand> what you already have. One customer, one record, everywhere.</Bubble>
    </>
  );
}

export default function Connect({ reduced }) {
  return (
    <Scene id="connect" length={L} reduced={reduced} staticContent={<Static />}>
      {(progress) => (
        <>
          <Backdrop {...OFFICE} />
          <SystemBoxes progress={progress} appear={[0.12, 0.45]} connect={[0.50, 0.85]} showNew={null} />
          <Actor progress={progress} alt="Max"
            sequence={[{ from: 0, src: `${A}/max-walk-a.webp` }, { from: 0.12, src: `${A}/max-neutral.webp` }]}
            walk={{ frames: [`${A}/max-walk-a.webp`, `${A}/max-walk-b.webp`], window: [0, 0.12] }}
            x={[[0, 0.12], ['-10%', '34%']]} />
          <Actor progress={progress} alt="The guide"
            sequence={[{ from: 0, src: `${A}/guide-walk-a.webp` }, { from: 0.12, src: `${A}/guide-point.webp` }]}
            walk={{ frames: [`${A}/guide-walk-a.webp`, `${A}/guide-walk-b.webp`], window: [0, 0.12] }}
            x={[[0, 0.12], ['110%', '50%']]} />
          <Bubble speaker="guide" progress={progress} window={WINDOWS.all} anchor={{ desktop: { left: '54%', top: '8%' }, mobile: { slot: 1 } }}>
            Email, files, CRM, invoicing, chat. We look after <Hand>all</Hand> of it.
          </Bubble>
          <Bubble speaker="guide" progress={progress} window={WINDOWS.connect} anchor={{ desktop: { left: '54%', top: '8%' }, mobile: { slot: 2 } }}>
            First we <Hand>connect</Hand> what you already have. One customer, one record, everywhere.
          </Bubble>
        </>
      )}
    </Scene>
  );
}
```

`src/film/scenes/Agents.jsx`:

```jsx
import Scene from '../Scene';
import Bubble from '../Bubble';
import Hand from '../Hand';
import Actor from '../Actor';
import Caption from '../Caption';
import { Backdrop } from '../Backdrop';
import SystemBoxes from '../SystemBoxes';
import AgentBot from '../AgentBot';
import { SCENES } from './windows';

const { L, WINDOWS } = SCENES.agents;
const A = '/film/actors';
const OFFICE = { src: '/film/backdrops/office.webp', srcMobile: '/film/backdrops/office-800.webp' };

function Static() {
  return (
    <>
      <div className="relative" style={{ height: '60svh' }}>
        <Backdrop {...OFFICE} />
        <SystemBoxes static showNew={null} />
        <Actor static={{ src: `${A}/max-neutral.webp`, left: '34%' }} alt="Max" />
        <Actor static={{ src: `${A}/guide-point.webp`, left: '50%' }} alt="The guide" />
        <img src={`${A}/agent-bot.webp`} alt="" loading="lazy" style={{ position: 'absolute', left: '50%', top: '14%', height: 64, transform: 'translate(-50%,-50%)' }} />
      </div>
      <Bubble speaker="guide" static>Then we show you how to work with AI <Hand>agents</Hand>.</Bubble>
      <Caption static>They answer questions, move data, write the first draft.</Caption>
    </>
  );
}

export default function Agents({ reduced }) {
  return (
    <Scene id="agents" length={L} reduced={reduced} staticContent={<Static />}>
      {(progress) => (
        <>
          <Backdrop {...OFFICE} />
          <SystemBoxes progress={progress} appear={[0, 0.001]} connect={[0.001, 0.002]} showNew={null} />
          <AgentBot progress={progress} travel={[0.10, 0.90]} src={`${A}/agent-bot.webp`} />
          <Actor progress={progress} alt="Max" sequence={[{ from: 0, src: `${A}/max-neutral.webp` }]} x={[[0, 1], ['34%', '34%']]} />
          <Actor progress={progress} alt="The guide" sequence={[{ from: 0, src: `${A}/guide-point.webp` }]} x={[[0, 1], ['50%', '50%']]} />
          <Bubble speaker="guide" progress={progress} window={WINDOWS.agents} anchor={{ desktop: { left: '54%', top: '8%' }, mobile: { slot: 1 } }}>
            Then we show you how to work with AI <Hand>agents</Hand>.
          </Bubble>
          <Caption progress={progress} window={WINDOWS.agents} anchor={{ left: '54%', top: '26%' }}>
            They answer questions, move data, write the first draft.
          </Caption>
        </>
      )}
    </Scene>
  );
}
```

`src/film/scenes/Stay.jsx`:

```jsx
import Scene from '../Scene';
import Bubble from '../Bubble';
import Hand from '../Hand';
import Actor from '../Actor';
import { Backdrop } from '../Backdrop';
import SystemBoxes from '../SystemBoxes';
import { SCENES } from './windows';

const { L, WINDOWS } = SCENES.stay;
const A = '/film/actors';
const OFFICE = { src: '/film/backdrops/office.webp', srcMobile: '/film/backdrops/office-800.webp' };

function Static() {
  return (
    <>
      <div className="relative" style={{ height: '60svh' }}>
        <Backdrop {...OFFICE} />
        <SystemBoxes static showNew={0} locks />
        <Actor static={{ src: `${A}/max-relieved.webp`, left: '34%' }} alt="Max, relieved" />
        <Actor static={{ src: `${A}/guide-neutral.webp`, left: '50%' }} alt="The guide" />
      </div>
      <Bubble speaker="guide" static>Secure and <Hand>transparent</Hand>. You always know where your data goes.</Bubble>
      <Bubble speaker="guide" static>And we <Hand>stay</Hand>. Same people next year.</Bubble>
    </>
  );
}

export default function Stay({ reduced }) {
  return (
    <Scene id="stay" length={L} reduced={reduced} staticContent={<Static />}>
      {(progress) => (
        <>
          <Backdrop {...OFFICE} />
          <SystemBoxes progress={progress} appear={[0, 0.001]} connect={[0.001, 0.002]} showNew={0} locks flow />
          <Actor progress={progress} alt="Max, relieved" sequence={[{ from: 0, src: `${A}/max-relieved.webp` }]} x={[[0, 1], ['34%', '34%']]} />
          <Actor progress={progress} alt="The guide" sequence={[{ from: 0, src: `${A}/guide-neutral.webp` }]} x={[[0, 1], ['50%', '50%']]} />
          <Bubble speaker="guide" progress={progress} window={WINDOWS.secure} anchor={{ desktop: { left: '54%', top: '8%' }, mobile: { slot: 1 } }}>
            Secure and <Hand>transparent</Hand>. You always know where your data goes.
          </Bubble>
          <Bubble speaker="guide" progress={progress} window={WINDOWS.stay} anchor={{ desktop: { left: '54%', top: '8%' }, mobile: { slot: 2 } }}>
            And we <Hand>stay</Hand>. Same people next year.
          </Bubble>
        </>
      )}
    </Scene>
  );
}
```

- [ ] **Step 5: Run the tests**

Run: `npm test`
Expected: green, including the four window checks.

- [ ] **Step 6: Lint and commit**

```bash
npm run lint
git add src/film/Caption.jsx src/film/scenes
git commit -m "Add scene windows and film scenes Question, Connect, Agents and Stay

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 12: Scenes 0 and 4 (video), `Film`, app integration, removal of the old sections

**Files:**
- Create: `src/film/scenes/TitleCard.jsx`, `src/film/scenes/Build.jsx`, `src/film/Film.jsx`, `src/film/CaptureFrame.jsx`
- Modify: `src/App.jsx`, `src/main.jsx`, `src/index.css:40-46`, `index.html`
- Delete: `src/components/sections/RocketScroll.jsx`, `src/components/sections/TrueMeaning.jsx`, `public/rocket/`, `public/videos/`, `public/screens/`

**Interfaces:**
- Consumes: everything from Tasks 4–8 and 11. Video paths (created in Task 13): `/film/video/max-arrives.mp4`, `/film/video/max-arrives-mobile.mp4`, `/film/video/max-arrives.webp`; `/film/video/guide-draws.mp4`, `/film/video/guide-draws.webp` (video 2 is desktop-only, see Build). Until Task 13 runs, the posters are temporary copies of the canon sheets converted to WebP so the page renders.
- Produces: `<Film />` (reads `useReducedMotion` once and passes `reduced` to every scene); the `/capture?scene=title|build` route rendering a 1920×1080 `#capture-stage` used by Task 13 to make video start frames.

- [ ] **Step 1: Windows**

`src/film/scenes/windows.js` from Task 11 already defines `title` and `build`; nothing to add. `TitleCard` and `Build` read `SCENES.title` / `SCENES.build`.

- [ ] **Step 2: Temporary posters**

```bash
scripts/film/to-webp.sh public/film/canon/max-sheet.png public/film/video/max-arrives.webp 70
scripts/film/to-webp.sh public/film/canon/guide-sheet.png public/film/video/guide-draws.webp 70
rm public/film/video/.gitkeep
```

- [ ] **Step 3: Implement `TitleCard.jsx`**

```jsx
import { motion, useTransform } from 'framer-motion';
import Scene from '../Scene';
import Bubble from '../Bubble';
import Hand from '../Hand';
import ScrubVideo from '../ScrubVideo';
import { Paper } from '../Backdrop';
import { ramp } from '../math';
import { INK } from '../constants';
import { SCENES } from './windows';

const { L, WINDOWS } = SCENES.title;
const V = '/film/video';

function Headline() {
  return (
    <>
      <h1 className="font-extrabold leading-[1.05]" style={{ color: INK, fontSize: 'clamp(2rem, 4.2vw, 3.75rem)' }}>
        <span className="block">Your <Hand>true*</Hand></span>
        <span className="block">digital partner</span>
        <span className="block">for the AI era.</span>
      </h1>
      <p className="mt-4 md:mt-6 leading-relaxed hidden sm:block" style={{ color: INK, opacity: 0.7, fontSize: 'clamp(0.95rem, 1.05vw, 1.125rem)', maxWidth: '34ch' }}>
        AI has leveled the playing field. We help businesses use what was once reserved for the few.
      </p>
    </>
  );
}

function Static() {
  return (
    <>
      <div className="pt-24"><Headline /></div>
      <img src={`${V}/max-arrives.webp`} alt="Max arriving with a wobbling stack of papers" loading="eager" className="w-full mt-8" />
      <Bubble speaker="max" static>A little <Hand>help</Hand> here?</Bubble>
    </>
  );
}

export default function TitleCard({ reduced }) {
  return (
    <Scene id="title" length={L} reduced={reduced} staticContent={<Static />}>
      {(progress) => <Stage progress={progress} />}
    </Scene>
  );
}

function Stage({ progress }) {
  const headOpacity = useTransform(progress, (p) => 1 - ramp(0.85, 1, p));
  const headY = useTransform(progress, (p) => -40 * ramp(0.85, 1, p));
  const arrowOpacity = useTransform(progress, (p) => 1 - ramp(0.05, 0.12, p));
  return (
    <>
      <Paper />
      <div className="absolute inset-0 flex justify-center items-end pb-4 md:items-center md:justify-end md:pr-[6vw] md:pb-0">
        <ScrubVideo progress={progress} window={[0, 0.8]} loadPolicy="afterLoad"
          src={`${V}/max-arrives.mp4`} srcMobile={`${V}/max-arrives-mobile.mp4`} poster={`${V}/max-arrives.webp`}
          className="h-[52svh] md:h-[80svh] w-auto"
          style={{
            maskImage: 'linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 4%, black 96%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 4%, black 96%, transparent 100%)',
            maskComposite: 'intersect', WebkitMaskComposite: 'source-in',
          }} />
      </div>
      <motion.div className="absolute inset-x-0 top-24 md:top-0 md:bottom-0 z-10 pointer-events-none px-6 md:px-[6vw] md:flex md:items-center text-center md:text-left"
        style={{ opacity: headOpacity, y: headY }}>
        <div className="mx-auto md:mx-0" style={{ maxWidth: 'min(48vw, 720px)' }}><Headline /></div>
      </motion.div>
      <Bubble speaker="max" progress={progress} window={WINDOWS.hint} anchor={{ desktop: { left: '62%', top: '12%' }, mobile: { slot: 1 } }}>
        A little <Hand>help</Hand> here?
      </Bubble>
      <motion.div className="absolute bottom-8 left-1/2 -translate-x-1/2 pointer-events-none" style={{ opacity: arrowOpacity }}>
        <motion.svg animate={{ y: [0, 6, 0] }} transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          className="w-5 h-5" fill="none" stroke={INK} viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </motion.svg>
      </motion.div>
    </>
  );
}
```

- [ ] **Step 4: Implement `Build.jsx`**

Video 2 is a full-stage clip captured from the same composition the stage shows (see `CaptureFrame`), rendered `absolute inset-0 object-cover` so the box the guide draws lands where the SVG portal appears; a 0.10 crossfade (video out, portal and actors in) hides small offsets. On mobile the stage is portrait and the 4×2 grid puts the portal elsewhere, so there is no video on mobile: the portal and its two lines draw in at 0.75 while the guide holds the drawing pose.

```jsx
import Scene from '../Scene';
import Bubble from '../Bubble';
import Hand from '../Hand';
import Actor from '../Actor';
import Caption from '../Caption';
import ScrubVideo from '../ScrubVideo';
import useIsDesktop from '../useIsDesktop';
import { Backdrop } from '../Backdrop';
import SystemBoxes from '../SystemBoxes';
import { SCENES } from './windows';

const { L, WINDOWS } = SCENES.build;
const A = '/film/actors';
const V = '/film/video';
const OFFICE = { src: '/film/backdrops/office.webp', srcMobile: '/film/backdrops/office-800.webp' };

function Static() {
  return (
    <>
      <div className="relative" style={{ height: '60svh' }}>
        <Backdrop {...OFFICE} />
        <SystemBoxes static showNew={0} />
        <Actor static={{ src: `${A}/guide-draw.webp`, left: '50%' }} alt="The guide, drawing" />
        <Actor static={{ src: `${A}/max-relieved.webp`, left: '34%' }} alt="Max, relieved" />
      </div>
      <Bubble speaker="guide" static>And where something is missing, we <Hand>build</Hand> it.</Bubble>
      <Caption static>A portal, a dashboard, an internal tool. Usually in weeks.</Caption>
    </>
  );
}

export default function Build({ reduced }) {
  return (
    <Scene id="build" length={L} reduced={reduced} staticContent={<Static />}>
      {(progress) => <Stage progress={progress} />}
    </Scene>
  );
}

function Stage({ progress }) {
  const isDesktop = useIsDesktop();
  const fadeIn = isDesktop ? [[0.75, 0.85], [0, 1]] : undefined;
  return (
    <>
      <Backdrop {...OFFICE} />
      <SystemBoxes progress={progress} appear={[0, 0.001]} connect={[0.001, 0.002]} showNew={0.75} />
      {isDesktop && (
        <ScrubVideo progress={progress} window={[0.05, 0.75]} opacity={[[0.75, 0.85], [1, 0]]}
          src={`${V}/guide-draws.mp4`} poster={`${V}/guide-draws.webp`}
          className="absolute inset-0 w-full h-full object-cover" style={{ zIndex: 11 }} />
      )}
      <Actor progress={progress} alt="The guide, drawing" sequence={[{ from: 0, src: `${A}/guide-draw.webp` }]} x={[[0, 1], ['50%', '50%']]} opacity={fadeIn} zIndex={12} />
      <Actor progress={progress} alt="Max" sequence={[{ from: 0, src: `${A}/max-neutral.webp` }, { from: 0.75, src: `${A}/max-relieved.webp` }]} x={[[0, 1], ['34%', '34%']]} opacity={fadeIn} zIndex={12} />
      <Bubble speaker="guide" progress={progress} window={WINDOWS.build} anchor={{ desktop: { left: '54%', top: '8%' }, mobile: { slot: 1 } }}>
        And where something is missing, we <Hand>build</Hand> it.
      </Bubble>
      <Caption progress={progress} window={WINDOWS.build} anchor={{ left: '54%', top: '26%' }}>
        A portal, a dashboard, an internal tool. Usually in weeks.
      </Caption>
    </>
  );
}
```

- [ ] **Step 4b: Implement `src/film/CaptureFrame.jsx` and its route**

The start frame for each clip is the stage composition without bubbles, captions, headline or video, rendered at a fixed 1920×1080 so Task 13 can screenshot it.

```jsx
import Actor from './Actor';
import { Paper, Backdrop } from './Backdrop';
import SystemBoxes from './SystemBoxes';

const A = '/film/actors';
const OFFICE = { src: '/film/backdrops/office.webp', srcMobile: '/film/backdrops/office-800.webp' };

function Title() {
  return (
    <>
      <Paper />
      <Actor static={{ src: `${A}/max-stack.webp`, left: '30%' }} alt="Max" />
    </>
  );
}

function BuildStart() {
  return (
    <>
      <Backdrop {...OFFICE} />
      <SystemBoxes static showNew={null} />
      <Actor static={{ src: `${A}/max-neutral.webp`, left: '34%' }} alt="Max" />
      <Actor static={{ src: `${A}/guide-draw.webp`, left: '50%' }} alt="The guide" />
    </>
  );
}

/** Dev route `/capture?scene=title|build`: a 1920×1080 stage used to screenshot video start frames. */
export default function CaptureFrame() {
  const scene = new URLSearchParams(window.location.search).get('scene') || 'title';
  const Composition = scene === 'build' ? BuildStart : Title;
  return (
    <div id="capture-stage" style={{ position: 'relative', width: 1920, height: 1080, overflow: 'hidden', backgroundColor: '#F3ECE1' }}>
      <Composition />
    </div>
  );
}
```

In `src/main.jsx` add a lazy route next to `/test`:

```jsx
const CaptureFrame = lazy(() => import('./film/CaptureFrame.jsx'))
// inside <Routes>:
<Route path="/capture" element={<Suspense fallback={null}><CaptureFrame /></Suspense>} />
```

- [ ] **Step 5: Implement `Film.jsx` and wire `App.jsx`**

`src/film/Film.jsx`:

```jsx
import { useReducedMotion } from 'framer-motion';
import TitleCard from './scenes/TitleCard';
import Question from './scenes/Question';
import Connect from './scenes/Connect';
import Agents from './scenes/Agents';
import Build from './scenes/Build';
import Stay from './scenes/Stay';

export default function Film() {
  const reduced = useReducedMotion();
  return (
    <>
      <TitleCard reduced={reduced} />
      <Question reduced={reduced} />
      <Connect reduced={reduced} />
      <Agents reduced={reduced} />
      <Build reduced={reduced} />
      <Stay reduced={reduced} />
    </>
  );
}
```

`src/App.jsx` (whole file):

```jsx
import Navbar from './components/Navbar';
import Film from './film/Film';
import CaseStudies from './components/sections/CaseStudies';
import Career from './components/sections/Career';
import Contact from './components/sections/Contact';
import Footer from './components/Footer';
import SectionDivider from './components/ui/SectionDivider';
import { CalendlyProvider } from './context/CalendlyContext';

function App() {
  return (
    <CalendlyProvider>
      <div className="min-h-screen" style={{ backgroundColor: '#F3ECE1' }}>
        <Navbar />
        <Film />
        <CaseStudies />
        <SectionDivider variant={0} />
        <Contact />
        <SectionDivider variant={1} />
        <Career />
        <Footer />
      </div>
    </CalendlyProvider>
  );
}

export default App;
```

`src/index.css` lines 40–46: change `background-color: #0a0a0a; color: white;` to `background-color: #F3ECE1; color: #1F1A14;`.

`index.html`: after the font `<link>` add `<link rel="preload" as="image" href="/film/video/max-arrives.webp" />` so the title-card poster is in the first paint.

- [ ] **Step 6: Delete the old sections and assets**

```bash
git rm -q src/components/sections/RocketScroll.jsx src/components/sections/TrueMeaning.jsx
git rm -rq public/rocket public/videos public/screens
grep -rn "rocket\|astronaut\|screens/" src index.html .claude/skills || true
```

Expected: the grep prints nothing from `src/` (the verify skill is updated in Task 14).

- [ ] **Step 7: Build, test, lint**

```bash
npm test && npm run lint && npm run build 2>&1 | tail -5
```

Expected: tests green, lint clean, build succeeds, no `rocket`/`astronaut` references in `dist/assets/*.js`:

```bash
grep -l "rocket-scrub\|astronaut" dist/assets/*.js || echo "no stale refs"
```

- [ ] **Step 8: Smoke in a browser**

```bash
npm run preview -- --port 4173 --strictPort &
```

Then with puppeteer-core (scratchpad install, see Task 15 Step 1) or by opening `http://localhost:4173` in Chrome: scroll through; every scene pins, bubbles appear, the page ends on Cases. Fix anything broken before committing. Kill the preview.

- [ ] **Step 9: Commit**

```bash
git add -A src/film src/App.jsx src/main.jsx src/index.css index.html public/film/video
git commit -m "Replace rocket and astronaut sections with the scroll film

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 13: Produce the two video clips

**Files:**
- Create: `public/film/video/max-arrives.mp4`, `max-arrives-mobile.mp4`, `max-arrives.webp`, `guide-draws.mp4`, `guide-draws.webp` (replacing the temporary posters; video 2 has no mobile variant)

**Interfaces:**
- Consumes: the running preview build (Task 12) to capture composited start frames; Higgsfield CLI logged in with the `Private` workspace selected (`higgsfield workspace list`).

- [ ] **Step 1: Install puppeteer-core in the scratchpad and capture the start frames**

```bash
S=/private/tmp/claude-501/-Users-cab-avelon-website/e519dae3-cd9d-4840-9a4c-42d21bb03dc4/scratchpad
mkdir -p $S/pp && cd $S/pp && npm init -y >/dev/null && npm install --no-save puppeteer-core@24.10.0 >/dev/null
cd /Users/cab/avelon_website && npm run build && (npm run preview -- --port 4173 --strictPort &)
```

`$S/pp/frame.mjs` screenshots the `/capture` route (Task 12), which renders the start composition at 1920×1080 with no bubbles, headline, captions or video:

```js
import puppeteer from 'puppeteer-core';
const [,, scene, out] = process.argv;
const browser = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true });
const page = await browser.newPage();
await page.setViewport({ width: 1920, height: 1080 });
await page.goto(`http://localhost:4173/capture?scene=${scene}`, { waitUntil: 'networkidle0' });
await new Promise((r) => setTimeout(r, 800));
const stage = await page.$('#capture-stage');
await stage.screenshot({ path: out });
await browser.close();
console.log(out);
```

```bash
cd $S/pp && node frame.mjs title frame-title.png && node frame.mjs build frame-build.png
```

Read both PNGs: `frame-title.png` shows Max with the paper stack on plain paper, left of centre; `frame-build.png` shows the office, the seven boxes connected, Max neutral at 34% and the guide in the drawing pose at 50%, no portal.

- [ ] **Step 2: Generate with Seedance 2.5 (35 credits per attempt, up to three attempts per clip)**

```bash
cd $S/pp
higgsfield generate create seedance_2_5 --mode omni_reference --start-image frame-title.png --duration 5 --resolution 720p --aspect_ratio 16:9 --generate_audio false --wait --wait-timeout 20m --wait-interval 15s --json \
  --prompt "Hand-drawn pencil sketch animation on cream paper, vintage 1930s cartoon style, exactly the same character and drawing style as the start frame. The founder walks in from the left edge toward the right with a bouncy cartoon walk, carrying a wobbling stack of papers with a laptop on top; two sheets flutter to the ground; he looks worried and glances up. Camera static, no zoom, no pan. The paper background stays uniform cream. No text, no speech bubbles, no other characters, no colour beyond the rust-red tie." > video-max.json

higgsfield generate create seedance_2_5 --mode omni_reference --start-image frame-build.png --duration 5 --resolution 720p --aspect_ratio 16:9 --generate_audio false --wait --wait-timeout 20m --wait-interval 15s --json \
  --prompt "Hand-drawn pencil sketch animation on cream paper, vintage 1930s cartoon style, exactly the same two characters, boxes and drawing style as the start frame. The taller character raises the pencil and draws a rounded rectangle in the air in front of him; the pencil line appears stroke by stroke and becomes a small box with a screen, outlined in muted purple. The shorter character watches and smiles. Everything else stays still. Camera static, no zoom. No text, no speech bubbles, no new characters." > video-guide.json
```

- [ ] **Step 3: Download and check the raw clips**

```bash
FF=/Users/cab/avelon_website/node_modules/ffmpeg-static/ffmpeg
cd $S/pp
for n in max guide; do url=$(grep -oE 'https://[^" ]+\.mp4[^" ]*' video-$n.json | head -1); curl -sL "$url" -o raw-$n.mp4; \
  $FF -v error -i raw-$n.mp4 -vf "select='not(mod(n\,24))',scale=480:-1,tile=6x1" -frames:v 1 -y raw-$n-frames.png; done
```

Read both frame tiles. Accept only if (spec §6.2): characters on-model, uniform cream background, no text, no extra characters, no camera move. Otherwise regenerate with the failing point added to the prompt as a negative ("the camera must not move", "no third character"), up to three attempts.

- [ ] **Step 4: Encode all-intra, make posters, replace the temporary files**

```bash
FF=/Users/cab/avelon_website/node_modules/ffmpeg-static/ffmpeg; V=/Users/cab/avelon_website/public/film/video
cd $S/pp
# Desktop clips (both), mobile clip (title card only: video 2 is desktop-only), posters from the first frame.
for pair in "max max-arrives" "guide guide-draws"; do set -- $pair
  $FF -v error -y -i raw-$1.mp4 -an -c:v libx264 -preset slow -crf 26 -g 1 -pix_fmt yuv420p -movflags +faststart -vf "fps=24,scale=1280:-2" $V/$2.mp4
  $FF -v error -y -i raw-$1.mp4 -frames:v 1 -c:v libwebp -quality 80 $V/$2.webp
done
$FF -v error -y -i raw-max.mp4 -an -c:v libx264 -preset slow -crf 27 -g 1 -pix_fmt yuv420p -movflags +faststart -vf "fps=24,scale=854:-2" $V/max-arrives-mobile.mp4
rm -f $V/guide-draws-mobile.mp4
ls -la $V
# All-intra check: every decoded frame must be an I-frame (showinfo prints one line per frame).
for f in $V/max-arrives.mp4 $V/max-arrives-mobile.mp4 $V/guide-draws.mp4; do
  total=$($FF -i "$f" -vf showinfo -f null - 2>&1 | grep -c " type:")
  iframes=$($FF -i "$f" -vf showinfo -f null - 2>&1 | grep -c " type:I ")
  echo "$(basename $f): $iframes / $total I-frames, $(wc -c < "$f" | tr -d ' ') bytes"
done
cd /Users/cab/avelon_website
```

Expected: `max-arrives.mp4` and `guide-draws.mp4` ≤ 4 MB, `max-arrives-mobile.mp4` ≤ 2 MB, 1280×720 / 854×480, and `I-frames == total` for every file (120 of 120 for a 5 s clip at 24 fps). If a desktop clip is over 4 MB, trim to 4 s with `-t 4` before raising CRF above 28.

- [ ] **Step 5: Smoke and commit**

Rebuild, preview, scroll scenes 0 and 4 on a desktop viewport; both videos scrub. Then:

```bash
cd /Users/cab/avelon_website
git add public/film/video
git commit -m "Add the two scrubbed film clips

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 14: Cases intro bubble, lazy case images, Contact cutouts, docs

**Files:**
- Modify: `src/components/sections/CaseStudies.jsx:62-66` (img) and `:199-206` (title block), `src/components/sections/Contact.jsx:46-60`, `BRAND.md`, `.claude/skills/verify/SKILL.md`

- [ ] **Step 1: CaseStudies**

At line 62 add `loading="lazy"` to the `<img>`. Before the title `<motion.div ref={ref} …>` (line 200) insert, inside `<Container>`:

```jsx
<div className="max-w-[1500px] mx-auto mb-8">
  <Bubble speaker="guide" static>Here's what it looked like for three of our <Hand>clients</Hand>.</Bubble>
</div>
```

with imports `import Bubble from '../../film/Bubble'; import Hand from '../../film/Hand';`.

- [ ] **Step 2: Contact**

Inside the left `<motion.div>` (line 48), before the `<h2>`, add a desktop-only strip:

```jsx
<div className="hidden md:flex items-end gap-6 mb-6" aria-hidden="true" style={{ height: 180 }}>
  <img src="/film/actors/max-relieved.webp" alt="" loading="lazy" style={{ height: 180, width: 'auto' }} />
  <img src="/film/actors/guide-neutral.webp" alt="" loading="lazy" style={{ height: 196, width: 'auto' }} />
</div>
```

- [ ] **Step 3: BRAND.md**

Add after §4 Imagery a section `### 4.3 Characters` with the two character descriptions from spec §2 (verbatim), the canon file paths, the rules line ("original designs, never mouse ears, never gloves, never a round black silhouette; every generation attaches both sheets"), and the prompt invariants line. Under §7 Voice add the six bubble lines from spec §4 under "Reference phrases that work". Replace the §6 Motion bullet "Scroll-scrubbed videos for the rocket hero and astronaut" with "Scroll-scrubbed clips for Max arriving (title card) and the guide drawing (Build scene); everything else is cutouts moved by scroll".

- [ ] **Step 4: Verify skill**

Rewrite the "Drive it" and "Gotchas" sections of `.claude/skills/verify/SKILL.md`:

```markdown
## Drive it

Headless Chrome via puppeteer-core (install `--no-save` in a scratch dir,
executablePath `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome`).

The film is six pinned scenes, each `<section data-scene=ID data-length=L>`; scroll
position for progress p inside a scene is `section.offsetTop + p * L * innerHeight`.

Key flows:
- **title** (L 1.5): video `/film/video/max-arrives.mp4` loads only after the window
  `load` event, then `document.querySelector('[data-scene=title] video').currentTime`
  changes while scrolling 0→0.8.
- **question / connect / agents / stay**: every `[data-bubble]` reaches opacity > 0.9 at the
  middle of its hold window (windows are exported as `WINDOWS` from `src/film/scenes/*.jsx`).
- **build** (L 2.5): `/film/video/guide-draws.mp4` is requested only once the scene is within
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
```

- [ ] **Step 5: Test, lint, build, commit**

```bash
npm test && npm run lint && npm run build 2>&1 | tail -3
git add src/components/sections/CaseStudies.jsx src/components/sections/Contact.jsx BRAND.md .claude/skills/verify/SKILL.md
git commit -m "Introduce cases with a guide bubble, add contact cutouts, update brand and verify docs

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 15: End-to-end verification pass

**Files:**
- Create (scratchpad, not committed): `verify-film.mjs`
- Modify: whatever the pass finds, each fix in its own commit

**Interfaces:**
- Consumes: the production build on `http://localhost:4173`, `data-scene`, `data-length`, `data-bubble`, `data-scrub-active`, `data-video-failed`, `data-box` attributes.

- [ ] **Step 1: Build and serve**

puppeteer-core was installed in `$S/pp` in Task 13 Step 1; if `$S/pp/node_modules/puppeteer-core` is missing, repeat that install line.

```bash
S=/private/tmp/claude-501/-Users-cab-avelon-website/e519dae3-cd9d-4840-9a4c-42d21bb03dc4/scratchpad
cd /Users/cab/avelon_website && npm run build && (npm run preview -- --port 4173 --strictPort &)
```

- [ ] **Step 2: Write `$S/pp/verify-film.mjs`**

```js
import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const BASE_URL = 'http://localhost:4173/'; // not `URL`: that would shadow the global constructor used below
const OUT = new URL('./shots/', import.meta.url).pathname; fs.mkdirSync(OUT, { recursive: true });
const results = []; const ok = (name, pass, info = '') => { results.push({ name, pass, info }); console.log(`${pass ? 'PASS' : 'FAIL'} ${name} ${info}`); };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const WINDOWS = JSON.parse(fs.readFileSync(new URL('./windows.json', import.meta.url)));

async function scrollTo(page, id, p) {
  const y = await page.evaluate((id, p) => { const s = document.querySelector(`[data-scene="${id}"]`); return s.offsetTop + p * Number(s.dataset.length) * window.innerHeight; }, id, p);
  await page.evaluate((y) => window.scrollTo(0, y), y); await sleep(900);
}

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true });

// 1. Desktop: loading policy, budgets, bubbles, scrubbing
{
  const page = await browser.newPage(); await page.setViewport({ width: 1280, height: 800 });
  const reqs = []; let loaded = false;
  page.on('response', async (r) => { try { const h = r.headers(); reqs.push({ url: r.url(), bytes: Number(h['content-length'] || 0), afterLoad: loaded }); } catch {} });
  await page.goto(BASE_URL, { waitUntil: 'load' }); loaded = true; await sleep(1500);
  const before = reqs.filter((r) => !r.afterLoad); const mp4Before = before.filter((r) => r.url.endsWith('.mp4'));
  ok('no mp4 before load', mp4Before.length === 0, `${mp4Before.length}`);
  const budget = before.reduce((a, r) => a + r.bytes, 0);
  ok('initial transfer <= 1.5MB', budget <= 1.5e6, `${(budget / 1e6).toFixed(2)} MB`);
  const mp4After = reqs.filter((r) => r.afterLoad && r.url.endsWith('.mp4'));
  ok('exactly one mp4 after load', mp4After.length === 1, mp4After.map((r) => r.url.split('/').pop()).join(','));
  ok('video 1 <= 4MB', (mp4After[0]?.bytes ?? 0) <= 4e6, `${((mp4After[0]?.bytes ?? 0) / 1e6).toFixed(2)} MB`);

  // Order matters: loading checks before any scroll reaches Build, scrub checks between explicit positions.
  const vt = (scene) => page.evaluate((s) => document.querySelector(`[data-scene="${s}"] video`)?.currentTime ?? -1, scene);
  await scrollTo(page, 'title', 0.1); const t0 = await vt('title');
  await scrollTo(page, 'title', 0.7); const t1 = await vt('title');
  ok('title video scrubs', t1 > t0 + 0.5, `${t0.toFixed(2)} -> ${t1.toFixed(2)}`);
  const mp4Count = () => reqs.filter((r) => r.url.endsWith('.mp4')).length;
  await scrollTo(page, 'connect', 0.5); ok('video 2 not requested two scenes early', mp4Count() === 1, `${mp4Count()}`);

  for (const [scene, wins] of Object.entries(WINDOWS)) {
    const keys = Object.keys(wins);
    const bubbleOpacity = (idx) => page.evaluate((scene, idx) => { const els = [...document.querySelectorAll(`[data-scene="${scene}"] [data-bubble]`)]; const el = els[idx]; return el ? Number(getComputedStyle(el).opacity) : -1; }, scene, idx);
    for (const [idx, key] of keys.entries()) { // bubbles appear in the DOM in WINDOWS key order
      const w = wins[key];
      await scrollTo(page, scene, (w[1] + w[2]) / 2);
      const op = await bubbleOpacity(idx);
      ok(`bubble ${scene}.${key} visible at mid-hold`, op > 0.9, `opacity ${op}`);
      await page.screenshot({ path: `${OUT}desktop-${scene}-${key}.png` });
      if (idx + 1 < keys.length) { // spec §8: at the end of a hold the next bubble is not yet visible
        await scrollTo(page, scene, w[2]);
        const next = await bubbleOpacity(idx + 1);
        ok(`bubble ${scene}.${keys[idx + 1]} hidden at end of ${key} hold`, next < 0.1, `opacity ${next}`);
      }
    }
  }
  ok('video 2 requested once build was near', mp4Count() === 2, `${mp4Count()}`);
  await scrollTo(page, 'build', 0.2); const b0 = await vt('build');
  await scrollTo(page, 'build', 0.7); const b1 = await vt('build');
  ok('build video scrubs', b1 > b0 + 0.5, `${b0.toFixed(2)} -> ${b1.toFixed(2)}`);
  // Review focus 5: breakpoint resize mid-scene
  await scrollTo(page, 'connect', 0.6);
  const left1 = await page.evaluate(() => getComputedStyle(document.querySelector('[data-scene="connect"] [data-box="crm"]')).left);
  await page.setViewport({ width: 390, height: 844 }); await sleep(800);
  const left2 = await page.evaluate(() => getComputedStyle(document.querySelector('[data-scene="connect"] [data-box="crm"]')).left);
  ok('box layout switches on resize', left1 !== left2, `${left1} -> ${left2}`);
  await page.close();
}

// 2. Throttled jump into build (review: late metadata)
{
  const page = await browser.newPage(); await page.setViewport({ width: 1280, height: 800 });
  const cdp = await page.createCDPSession(); await cdp.send('Network.enable');
  await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 300, downloadThroughput: 400 * 1024, uploadThroughput: 200 * 1024 });
  await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
  await scrollTo(page, 'build', 0.5);
  // Wait for metadata, then the frame for p=0.5 (window [0.05, 0.75] -> 64% of duration) must arrive within 2 s.
  const metaAt = Date.now();
  let dur = 0; while (!dur && Date.now() - metaAt < 20000) { dur = await page.evaluate(() => document.querySelector('[data-scene="build"] video')?.duration || 0); await sleep(100); }
  const expected = ((0.5 - 0.05) / (0.75 - 0.05)) * dur;
  const start = Date.now(); let ct = -1;
  while (Date.now() - start < 2000) { ct = await page.evaluate(() => document.querySelector('[data-scene="build"] video')?.currentTime ?? -1); if (Math.abs(ct - expected) < 0.3) break; await sleep(100); }
  ok('late-loading video lands on its frame within 2s', dur > 0 && Math.abs(ct - expected) < 0.3, `t=${ct.toFixed(2)} expected=${expected.toFixed(2)} after ${Date.now() - start}ms`);
  await page.close();
}

// 3. Video 404 keeps the poster (review focus 2)
{
  const page = await browser.newPage(); await page.setViewport({ width: 1280, height: 800 });
  await page.setRequestInterception(true);
  page.on('request', (r) => (r.url().endsWith('.mp4') ? r.abort() : r.continue()));
  await page.goto(BASE_URL, { waitUntil: 'load' }); await sleep(1500);
  const failed = await page.$('[data-scene="title"] [data-video-failed="true"]');
  const posterShown = failed ? await failed.evaluate((el) => el.complete && el.naturalWidth > 0) : false;
  ok('poster stays visible when video fails', !!failed && posterShown);
  await page.close();
}

// 4. Direct anchor landing (review focus 3)
{
  const page = await browser.newPage(); await page.setViewport({ width: 1280, height: 800 });
  await page.goto(`${BASE_URL}#contact`, { waitUntil: 'load' }); await sleep(1500);
  const active = await page.$$('[data-scrub-active="true"]');
  ok('no scrub loop when landing on #contact', active.length === 0, `${active.length} active`);
  await page.close();
}

// 5. Mobile screenshots
{
  const page = await browser.newPage(); await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.goto(BASE_URL, { waitUntil: 'load' }); await sleep(1000);
  for (const scene of ['title', 'question', 'connect', 'agents', 'build', 'stay']) for (const p of [0.2, 0.5, 0.8]) { await scrollTo(page, scene, p); await page.screenshot({ path: `${OUT}mobile-${scene}-${p}.png` }); }
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  ok('no horizontal overflow on mobile', !overflow);
  await page.close();
}

// 6. Reduced motion
{
  const page = await browser.newPage(); await page.setViewport({ width: 1280, height: 800 });
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  await page.goto(BASE_URL, { waitUntil: 'load' }); await sleep(1000);
  const sticky = await page.evaluate(() => [...document.querySelectorAll('*')].filter((e) => getComputedStyle(e).position === 'sticky').length);
  const bubbles = await page.evaluate(() => [...document.querySelectorAll('[data-bubble]')].map((e) => Number(getComputedStyle(e).opacity)));
  const vh = await page.evaluate(() => document.documentElement.scrollHeight / window.innerHeight);
  ok('reduced motion: no sticky', sticky === 0, `${sticky}`);
  ok('reduced motion: all bubbles visible', bubbles.length >= 10 && bubbles.every((o) => o > 0.9), `${bubbles.length}`);
  ok('reduced motion: page < 12 viewports', vh < 12, `${vh.toFixed(1)}`);
  await page.screenshot({ path: `${OUT}reduced.png`, fullPage: true });
  await page.close();
}

await browser.close();
const fails = results.filter((r) => !r.pass);
console.log(`\n${results.length - fails.length}/${results.length} passed`);
process.exit(fails.length ? 1 : 0);
```

`windows.json` is generated from `src/film/scenes/windows.js` (plain ESM, importable by node) so the script and the code never drift:

```bash
cd /Users/cab/avelon_website && node --input-type=module -e "
const { SCENES } = await import('./src/film/scenes/windows.js');
const fs = await import('node:fs');
const out = Object.fromEntries(Object.entries(SCENES).map(([id, s]) => [id, s.WINDOWS]));
fs.writeFileSync('$S/pp/windows.json', JSON.stringify(out, null, 2)); console.log(out);
"
```

The bubble lookup in step 1 relies on bubble order in the DOM matching key order in `WINDOWS`; keep that order in every scene file (it already does).

- [ ] **Step 3: Run it**

```bash
cd $S/pp && node verify-film.mjs 2>&1 | tee verify.log
```

Expected: every line `PASS`. For each `FAIL`: open the matching screenshot, find the cause in `src/film/`, fix, `npm run build`, re-run. Typical fixes: a bubble anchor overlapping an actor, a window too tight after spring lag, a video over budget (re-encode with `-t 4`).

- [ ] **Step 4: Look at every screenshot**

Read all `shots/*.png` (desktop and mobile). Reject anything where text overlaps a character, a bubble tail points at nobody, a box is cut off, or the office backdrop makes a bubble hard to read (fix: bump `SHAPE.backgroundColor` opacity to solid paper, which it already is, or move the anchor).

- [ ] **Step 5: Commit fixes**

One commit per fix, message naming the symptom, for example `Fix bubble anchor overlapping the guide in Connect`.

---

### Task 16: Branch review and hand-off

- [ ] **Step 1: Full gates**

```bash
npm test && npm run lint && npm run build && git status --short
```

Expected: green, clean tree.

- [ ] **Step 2: Review the whole branch**

Use the `superpowers:requesting-code-review` skill on `feat/scroll-film` against `main`, with the spec path as context. Address findings as separate commits.

- [ ] **Step 3: Finish the branch**

Use `superpowers:finishing-a-development-branch`. The owner decides merge vs PR; production is Vercel project `avelon-website` at https://avelon.ai and deploys from `main`.
