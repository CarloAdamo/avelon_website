# The Avelon site as a scroll-driven film — design spec

Date: 2026-10-13. Status: for review (revised after Codex review).

## 1. Intent

The whole site becomes one short cartoon film that plays as the visitor scrolls. Two characters carry the story in speech bubbles. The current site is vague about what Avelon sells; the film exists to fix that.

The one sentence a visitor must leave with:

> A regular IT partner handles your Microsoft account and your laptops. Avelon looks after everything you run on: connects what you have, shows you how to work with AI agents, builds what's missing. Secure and transparent, so you always know where your data goes. And the same people stay with you.

Audience: founder or CEO of a 10–100 person company, drowning in systems and admin. Language: English. Brand: `BRAND.md` (paper `#F3ECE1`, ink `#1F1A14`, accent `#6B5B95`, Inter + one Caveat word per phrase, calm scroll-driven motion, no neon, no gradients, no "it isn't X, it's Y" copy).

Decisions already made by the owner and not open here: whole page is the film; hybrid build (stills + code animation + two scroll-scrubbed video clips); rubber-hose character style; English; audience above.

## 2. Characters (canon locked)

Both exist as approved character sheets. Source files today (session scratchpad, outside the repo):

```
/private/tmp/claude-501/-Users-cab-avelon-website/e519dae3-cd9d-4840-9a4c-42d21bb03dc4/scratchpad/style-test/max-character.png
/private/tmp/claude-501/-Users-cab-avelon-website/e519dae3-cd9d-4840-9a4c-42d21bb03dc4/scratchpad/style-test/guide-character-v2.png
```

**Precondition for all asset work:** the first task of the plan copies these two files to `public/film/canon/max-sheet.png` and `public/film/canon/guide-sheet.png` and commits them. Every later image and video is reproducible from the checkout after that.

- **Max** (the customer): 1930s rubber-hose founder. Round head, dark hair tuft, white shirt with rolled sleeves, suspenders, rust-red tie (the only colour on him), dark trousers, big rounded shoes. Poses on sheet: neutral, overwhelmed walk with wobbling paper stack + laptop, relieved with open arms.
- **The guide** (Avelon): same drawing style and proportions, taller and leaner. Round-collared three-button jacket, slim trousers, same big shoes, pencil behind one ear, muted purple scarf (the only colour on him). Poses: neutral with hands in pockets, pointing and explaining, drawing a curve in the air with the pencil.

Rules: original designs, never "mouse ears", never gloves, never a round black body silhouette (trademark and moderation risk). Every generated image that contains a character attaches both sheets as references. Characters are generated once per pose as transparent cutouts and reused; backdrops are generated empty. Videos start from a composited frame (cutout on backdrop), never from a freshly generated scene.

## 3. Mechanism

No animation engine. One small `Scene` wrapper plus today's `useScroll` + `useSpring` + `useTransform` arrays per scene (the pattern in `RocketScroll.jsx`).

### 3.1 Scroll model

A scene has a **scroll length `L`** in viewports: the distance the visitor scrolls while the stage is pinned. With `useScroll({ offset: ['start start', 'end end'] })` and a sticky stage of one viewport, the section must be **`(L + 1) × 100svh` tall**; progress 0..1 maps to those `L` viewports of scrolling. All windows below are fractions of `L`.

- A bubble **holds** (fully visible) for at least 0.8 viewport: `0.8 / L` of progress.
- Fade in and fade out are 0.2 viewport each: `0.2 / L`.
- Two bubbles in one scene never overlap in their hold windows.

Film totals: 18.5 viewports of scrubbing, 24.5 viewports of page height (six scenes, `L + 1` each). At a normal scroll pace of about two seconds per viewport that is 40 to 60 seconds; a fast skim is about 20 seconds. Lengths live in one place (`src/film/scenes/windows.js`); windows are fractions of `L`, so a scene can be lengthened later without retiming its bubbles.

### 3.2 Components (`src/film/`)

| Component | Contract |
|---|---|
| `Scene` | Props: `length` (L), `children(progress)`. Renders `<section style={{height: (length+1)*100svh}}>` containing a sticky `100svh` stage. Progress is `useSpring(scrollYProgress, {stiffness 120, damping 30, mass 0.4})`. Under reduced motion (§3.6) it renders the `static` prop instead: a normal-flow block, auto height, no sticky, no scroll reserve. |
| `Bubble` | Props: `speaker` (`max`/`guide`), `anchor` (`{desktop: {x,y}, mobile: {slot}}`), `children`, and either `progress` + `window=[in0,in1,out0,out1]` (animated: opacity 0→1→1→0 with a 20px rise) or `static` (always visible, normal flow). Hand-drawn SVG outline (slightly wobbly rounded rect + tail toward the speaker, ink at 85%, 2px). Text Inter 500 on paper; loaded word via `Hand`. |
| `Hand` | `src/film/Hand.jsx`. Inline span, Caveat 700, accent colour, `font-size: 1.15em`. Used inside bubbles and headings. |
| `Actor` | Props: `progress`, `sequence=[{from, src}]` (shows the entry with the largest `from` ≤ progress), optional `walk={frames: [a, b], window: [start, end]}` (inside the window, alternates frames every 0.06 of progress and adds a 6px vertical bob), transform keyframes `x`, `y`, `rotate`, `scale`, `opacity` as `[stops, values]`, `static={{src, x, y}}` for the reduced-motion pose. Renders a transparent WebP `<img loading="lazy">` unless `eager`. |
| `ScrubVideo` | Props: `progress`, `window=[a,b]` (progress range mapped to 0..duration), `src`, `srcMobile`, `poster`, `loadPolicy` (`'afterLoad'` or `'nearViewport'`). `nearViewport`: `preload="none"` until the section is within one viewport (`IntersectionObserver`, `rootMargin: '100% 0px'`), then `load()` + prime play/pause. `afterLoad` (scene 0 only): same, but triggered by the window `load` event. The target time is recomputed from the **current** progress value on `loadedmetadata`, on registration with the scrub loop, and on `src` change, so a visitor who stops inside the scene before metadata arrives still lands on the right frame. Registers with `useScrubLoop` while intersecting, deregisters otherwise. |
| `useScrubLoop` | One module-level `requestAnimationFrame` loop for all registered videos. Seeks when target differs from `currentTime` by more than one frame (1/24 s). Starts on first registration, stops when the registry is empty. |
| `SystemBoxes` | Props: `progress`, `appear=[a,b]` (boxes fade in one by one), `connect=[a,b]` (lines draw via `pathLength`), `showNew` (progress at which the eighth, "built" box appears), `flow` (boolean: animate a dotted flow along the lines with `strokeDashoffset`), `locks` (boolean). Eight boxes: email, files, CRM, invoicing, chat (Slack logo), Google, Microsoft, and the new box ("Portal", drawn in accent). Hand-drawn SVG rects (wobbly path, ink 70%), 112px desktop / 56px mobile, with the existing `/logos/*.webp` or a one-word Inter label. Lines are straight SVG segments between box centres along a fixed adjacency list (a ring plus two chords). Layout in §3.5. |
| `scenes/*.jsx` | One file per scene (`TitleCard`, `Question`, `Connect`, `Agents`, `Build`, `Stay`). Each declares its windows inline as plain arrays and its `static` composition. |
| `Film.jsx` | Renders the six scenes in order. |

`App.jsx` keeps `CalendlyProvider` as the outer wrapper (`Navbar` calls `useCalendly`, which throws without it). Inside: `Navbar`, `Film`, `CaseStudies`, `SectionDivider`, `Contact`, `SectionDivider`, `Career`, `Footer`.

### 3.3 Navigation

The navbar keeps Customer Stories / Contact / Career anchors. Jumps stay instant (no `scroll-behavior: smooth` anywhere), so a jump does not scrub every video on the way. After a jump, springs settle within a few hundred ms; this is acceptable.

### 3.4 Loading

- **Before the window `load` event** (critical): HTML, CSS, JS, fonts, logo, scene 0 poster, the Max and guide cutouts used in scenes 0–1 (`eager`, plus `<link rel="preload">` for the poster). Budget ≤ 1.5 MB transfer.
- **After `load`**: video 1 (scene 0), budget ≤ 4 MB desktop / ≤ 2 MB mobile.
- **One viewport ahead** (`loading="lazy"` or the `nearViewport` policy): every other actor, backdrop, box logo, video 2, and the three case-study images (`CaseStudies.jsx` gets `loading="lazy"` on its `<img>`; today they are eager and total ~430 kB).

### 3.5 Layout

**Desktop (≥ 768px).** Stage is a 16:9-ish area. Characters stand on a baseline at 88% of stage height. Bubbles anchor above the speaker's head. Boxes sit on a ring around the characters: positions as percentages of stage width/height, clockwise from top: email (47, 12), files (78, 30), CRM (88, 54), invoicing (76, 78), chat (11, 78), Google (11, 50), Microsoft (18, 24), new box (64, 86 → appears to the right of the guide's feet, clear of both characters). In the office scenes Max stands at 30% and the guide at 44%. Bubbles clamp to at least 92px from the top; on desktop the box layer starts 80px down (`NAV_HEIGHT`), so ring percentages are relative to the area below the navbar. Nothing in the stage may sit in the top 80px (the fixed navbar) at any viewport of 768px or wider, and no bubble may overlap a box; bubbles are anchored at top 10.5% (captions at 31%, both clamped as above) and, if one touches a box, the bubble is nudged, never the box. Adjacency: the ring in that order, plus chords email–invoicing and Microsoft–CRM.

**Mobile (< 768px).** Stage splits into three bands: bubbles (top 32%), boxes (next 28%: a 4×2 grid, 56px boxes, the new box is the eighth slot and stays empty until built), actors (bottom 40%, characters at 70% of their desktop scale). Bubbles use `anchor.mobile.slot` (`1` at top 11%, `2` at top 23%, both below the 80px navbar; the grid rows sit at 42% and 56%; the title-card hint overrides its slot with `top: 42%`, between the headline and the video) so two bubbles in a scene never collide. Lines are straight segments between grid centres with the same adjacency. The agent path (scene 3) follows the segments. Side gutter 24px. Units are `svh`, never `vh`. Video 1 uses its `srcMobile` variant; video 2 is desktop-only (scene 4).

Forms never live inside a sticky stage.

### 3.6 Reduced motion

`useReducedMotion()` from framer-motion. When true, every `Scene` renders its `static` composition: a normal-flow block (auto height) with the backdrop, the actors at the poses given in their `static` prop, then the scene's bubbles stacked in document flow beneath the picture (each `Bubble` in `static` mode, with the speaker's name as a small Caveat label), then the captions. `ScrubVideo` renders the poster only. The film is readable top to bottom with no sticky positioning and no scroll reserve.

## 4. Scenes

Windows are progress fractions and respect §3.1 (hold ≥ `0.8/L`). Bubble windows are written `[in0, in1, out0, out1]`.

### Scene 0 — Title card (L = 2)

Headline unchanged: "Your **true\*** digital partner for the AI era." Left column on desktop, top on mobile. Right column / lower half: **Video 1**, Max arriving from the left with the wobbling paper stack and laptop, two sheets fluttering down, `loadPolicy="afterLoad"`, scrubbed over `[0.0, 0.8]`. Under the headline, Inter at 70%: "AI has leveled the playing field. We help businesses use what was once reserved for the few."

Scroll hint: a small bubble from Max, `[0, 0, 0.25, 0.4]`, with the existing bouncing arrow beneath it: **"A little *help* here?"** The bubble is the invitation; the arrow is the affordance. No "scroll to…" instruction. (Alternatives for the owner to swap: "No popcorn *required*." / "Runtime: one *coffee*.")

Headline and subline fade out over `[0.85, 1.0]`.

Static: headline, subline, poster, hint bubble.

### Scene 1 — The question (L = 3)

Backdrop: paper. Max (`max-stack`) stands at 22% from the left. Guide walks in from the right, `walk.window [0.0, 0.15]`, `x` from 110% to 66%; `sequence`: `guide-walk` frames until 0.15, `guide-wave` from 0.15, `guide-neutral` from 0.5.

- Bubble Max `[0.10, 0.18, 0.50, 0.58]`: "Our IT partner sorts out the laptops and the Microsoft account. Is that ***it***?"
- Bubble guide `[0.58, 0.66, 0.98, 1.0]`: "Laptops are the ***easy*** part. Walk with me."

Static: both actors, both bubbles.

### Scene 2 — Everything you run on, connected (L = 4.5)

Backdrop: empty sketched office. Both characters walk in `[0.0, 0.12]` and stop (Max 30%, guide 44%). `SystemBoxes appear=[0.12, 0.45]`, `connect=[0.50, 0.85]`.

- Bubble guide `[0.18, 0.25, 0.48, 0.55]`: "Email, files, CRM, invoicing, chat. We look after ***all*** of it."
- Bubble guide `[0.58, 0.65, 0.93, 1.0]`: "First we ***connect*** what you already have. One customer, one record, everywhere."

Static: office, both actors, boxes connected, both bubbles.

### Scene 3 — AI agents (L = 3)

Office, boxes connected. `agent-bot` cutout travels along the adjacency path (CSS `offset-path` on the SVG path, `offset-distance` via `useTransform`, `[0.10, 0.90]`); each box it reaches gets a short ink ring "ping". Max `max-neutral`, guide `guide-point`.

- Bubble guide `[0.15, 0.23, 0.60, 0.68]`: "Then we show you how to work with AI ***agents***."
- Caption (Inter 70%, below the bubble, same window): "They answer questions, move data, write the first draft."

Static: office, boxes, agent at the midpoint of the path, bubble, caption.

### Scene 4 — Build (L = 3)

Office. **Video 2** (`nearViewport`, desktop only): the guide draws a new box in the air with the pencil and it becomes a box with a small screen, scrubbed over `[0.05, 0.75]`. The clip is captured from the same composition the stage shows (office, boxes, both characters at their stage positions, 1920×1080) and rendered full-stage with `object-fit: cover`, so the drawn box lands where the SVG portal appears at `(64, 86)`. The SVG new box and its two lines are hidden until 0.75, then draw in while the video fades out `[0.75, 0.85]`; the crossfade hides small offsets. Max `max-neutral` until 0.75, `max-relieved` after. On mobile (< 768px) there is no video: the guide holds the drawing pose and the portal box plus its two lines draw in at 0.75 in the 4×2 grid.

- Bubble guide `[0.25, 0.33, 0.70, 0.78]`: "And where something is missing, we ***build*** it."
- Caption: "A portal, a dashboard, an internal tool. Usually in weeks."

Static: office, boxes with the new box, `guide-draw`, `max-relieved`, bubble, caption.

### Scene 5 — Secure, and we stay (L = 3)

The "after" picture and the payoff: all eight boxes connected, the paper stack gone, Max `max-relieved`, guide `guide-neutral`. `SystemBoxes locks flow`: a small sketched lock at each line's midpoint and a dotted flow along the lines.

- Bubble guide `[0.05, 0.13, 0.45, 0.53]`: "Secure and ***transparent***. You always know where your data goes."
- Bubble guide `[0.55, 0.63, 0.95, 1.0]`: "And we ***stay***. Same people next year."

Static: the after picture, both bubbles.

### Scenes 6–8 — Proof, talk, join (normal flow)

`CaseStudies` gets a `static` guide bubble as its heading intro: "Here's what it looked like for three of our ***clients***." The three case cards and their copy stay as they are; their images become `loading="lazy"`. `Contact` gets `max-relieved` and `guide-neutral` cutouts (static `<img loading="lazy">`) beside its heading on desktop, hidden on mobile. `Career` and `Footer` unchanged.

## 5. Copy rules

From `BRAND.md` §7: specific, plain, one Caveat word per phrase, no buzzwords ("transform", "unlock", "landscape"), no "unlike other partners", no reveal/contrast constructions. Scene 1 states what a regular partner does as a plain fact in Max's mouth; the guide adds, never contrasts. All bubble text is HTML, never baked into images.

## 6. Assets and pipeline

All paths under `public/film/`.

### 6.1 Images (Codex, GPT Image, free on the owner's ChatGPT subscription)

Generate with `codex exec --sandbox workspace-write --skip-git-repo-check -C <dir> -i public/film/canon/max-sheet.png -i public/film/canon/guide-sheet.png -o <answer> '<prompt>'`, asking for the built-in `image_gen` tool, a transparent background for cutouts, and a copy of the PNG into the working directory. Convert to WebP with `sharp` via `npx --no-save` (lossless alpha for cutouts, quality 82 for backdrops). Backdrops get an 800px mobile variant.

| Asset | Type | Notes |
|---|---|---|
| `canon/max-sheet.png`, `canon/guide-sheet.png` | reference | copied from the scratchpad (§2) |
| `actors/max-neutral`, `max-walk-a`, `max-walk-b`, `max-stack`, `max-relieved` | cutout, transparent, ~900px tall | walk frames: same pose, legs swapped |
| `actors/guide-neutral`, `guide-walk-a`, `guide-walk-b`, `guide-wave`, `guide-point`, `guide-draw` | cutout | |
| `actors/agent-bot` | cutout, ~300px | round sketched helper with a satchel, not resembling any known robot |
| `props/paper-stack` | cutout | |
| `backdrops/office.webp` (+ `office-800.webp`) | 16:9, 2048px wide | empty office: desk, window, plant, no people |
| `paper.png` | tile | moved from `public/rocket/` |

Prompt invariants for every image: "Hand-drawn pencil sketch on cream paper #F3ECE1, soft graphite shading, vintage 1930s animation style, confident clean line work, original characters, no mouse ears, no gloves, no text, no watermark, no white background, no gradients or glow."

### 6.2 Videos (Higgsfield, Ultra plan)

Two clips, both image-to-video from a composited start frame: the relevant cutouts placed on the backdrop with the stage's desktop layout, rendered by the app's `/capture?scene=title|build` route and captured with puppeteer at 1920×1080.

| Clip | Start frame | Model | Length | Variants |
|---|---|---|---|---|
| `video/max-arrives` | `max-stack` on paper, left of centre | Seedance 2.5 (chosen in the model test) | 5 s | desktop 1280×720 + mobile 854×480 |
| `video/guide-draws` | `guide-draw` + `max-neutral` on office, boxes connected, no portal | same | 5 s | desktop only |

Command: `higgsfield generate create <model> [--mode omni_reference] --start-image <frame.png> --duration 5 --resolution 720p --aspect_ratio 16:9 --generate_audio false --prompt '<motion prompt>' --wait --json`. Download the result URL, then re-encode:

```
ffmpeg -i in.mp4 -an -c:v libx264 -preset slow -crf 26 -g 1 -pix_fmt yuv420p -movflags +faststart -vf scale=1280:-2 out.mp4
ffmpeg -i in.mp4 -an -c:v libx264 -preset slow -crf 27 -g 1 -pix_fmt yuv420p -movflags +faststart -vf scale=854:-2 out-mobile.mp4
```

Poster: first frame as WebP. Budget per clip: ≤ 4 MB desktop, ≤ 2 MB mobile. If the pencil grain pushes a clip over budget, shorten to 4 s before raising CRF above 28.

Accept a clip only if: characters stay on-model (compare against the sheets), background stays uniform cream, no text or extra characters appear, the camera does not move. Otherwise regenerate with a tightened prompt; budget three attempts per clip.

## 7. What changes in the repo

- New: `src/film/` as in §3.2, `public/film/`.
- Changed: `App.jsx` composition (provider kept); `CaseStudies.jsx` intro bubble + lazy images; `Contact.jsx` cutouts on desktop; `index.css` body background to paper and text to ink (today it is still `#0a0a0a` / white, a leftover); `BRAND.md` gets a "Characters" section and the new copy; `.claude/skills/verify/SKILL.md` updated to §8.
- Removed: `RocketScroll.jsx`, `TrueMeaning.jsx`, `public/rocket/rocket-*`, `public/videos/`, `public/screens/`. `SplineScene.jsx` and `TestPage.jsx` are unrelated and stay.

## 8. Verification

There is no unit test suite; verification is driving the production build with the existing `verify` skill (`vite build`, `vite preview`, puppeteer-core against the installed Chrome). The plan adds a scripted check (scratchpad, not committed) that:

- for each scene, scrolls to the midpoint of every bubble hold window and asserts the bubble's computed opacity > 0.9, and asserts that at the end of each hold the next bubble is not yet above 0.1;
- asserts no `.mp4` request before the window `load` event, exactly one after it (video 1), and a second only once scene 4 is within one viewport;
- scrolls through scenes 0 and 4 and asserts `currentTime` changes;
- jumps directly into the middle of scene 4 on a throttled connection (puppeteer network throttling) and asserts the video reaches the frame for that progress within 2 s of metadata;
- takes 390×844 screenshots of every scene at three progress points for a visual pass;
- emulates `prefers-reduced-motion: reduce` and asserts no element is `position: sticky`, every bubble is visible, and the page is shorter than 12 viewports;
- sums the transfer size of everything requested before `load` against the 1.5 MB budget, and the video 1 size against 4 MB.

The subagent that runs this pass reports screenshots and numbers, not opinions.

## 9. Risks

- **Scroll fatigue.** 18.5 viewports of scrubbing before interactive content, chosen deliberately so the film is not over in half a minute. Mitigation: nav anchors for skippers, something moving in every scene, the "after" payoff in scene 5. If the browser pass feels slow, lengths come down in one file.
- **Character drift.** Mitigated structurally: cutouts generated once and reused; backdrops empty; videos from composited frames.
- **Moderation blocks.** Output-stage blocks when a result resembles a known mascot. Mitigation: the invariants line in every prompt; retry once with softer wording; never add mascot tropes.
- **Video style drift.** Image-to-video may lose the pencil look or move the camera. Mitigation: model comparison test before producing the real clips; acceptance criteria in §6.2.
- **Codex or Higgsfield auth expiring.** Both are browser logins the owner must redo; the plan's asset tasks state this up front.

## 10. Out of scope

Chapter strip in the navbar, Swedish translation, new case studies, sound, autoplay of any kind, a CMS for the copy.
