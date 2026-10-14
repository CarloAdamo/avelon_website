# Film clip prompts

The scroll-scrubbed clips in `public/film/video/` were generated with Higgsfield Seedance 2.5
(`omni_reference`, start image, 5 s, 720p, 16:9, no audio) and then re-encoded all-intra
(see `.claude/skills/verify/SKILL.md`). These are the accepted attempts.

Start frames come from the dev-only capture route: `npm run dev`, then
`node frame.mjs title frame-title.png` and `node frame.mjs build frame-build.png`, run from a copy of
`scripts/film/frame.mjs` in a scratch dir with puppeteer-core installed.

```bash
higgsfield generate create seedance_2_5 --mode omni_reference --start-image <frame.png> \
  --duration 5 --resolution 720p --aspect_ratio 16:9 --generate_audio false \
  --wait --wait-timeout 20m --wait-interval 15s --json --prompt "<prompt>" > video.json
```

## Video 1: Max arrives (`max-arrives.mp4`, title card)

Current clip: job `bb141bf6-49d4-4eec-9c59-b74c3bd4fdf8`:
**start and end image are the empty paper** (`/capture?scene=blank`, `frame-blank.png`) and Max comes in as
`--image-references frame-q-start.png` (the Question start frame: `max-stack-stand` on paper), so the frame is
empty before the scroll starts, Max walks all the way out of the right edge, and he is the same drawing as in
the Question and Connect clips. The previous take (`a219813e-…`) used the walking cutout `max-stack` as the
reference, which is a different drawing of Max (narrower, off-canon); `/capture?scene=title` now uses
`max-stack-stand` too. No `-ss` trim. The first clip (job
`652c51a8-25f6-433e-a120-bbaf73502934`) started from `frame-title.png` with Max already in the frame and was
trimmed 0.6 s.

```bash
higgsfield generate create seedance_2_5 --mode omni_reference --start-image frame-blank.png --end-image frame-blank.png \
  --image-references frame-q-start.png --duration 5 --resolution 720p --aspect_ratio 16:9 --generate_audio false \
  --wait --wait-timeout 20m --wait-interval 15s --json --prompt "<prompt>" > video.json
```

> Hand-drawn pencil sketch animation on cream paper, vintage 1930s cartoon style. The frame starts completely empty: plain cream paper, nothing else. The character from the reference image (the founder with the round head, hair tuft, shirt, suspenders and rust-red tie, carrying a wobbling stack of papers with a laptop on top) walks in from the left edge with a bouncy cartoon walk, keeping exactly the same face, proportions and line work as in the reference image in every frame; worried face, sweat drops, two sheets fluttering off. He keeps walking at a steady pace across the whole frame and walks out of the right edge, so the frame is completely empty again at the end. Side view, same size throughout. Camera static, no zoom, no pan. The paper background stays uniform cream. No text, no speech bubbles, no other characters, no colour beyond the rust-red tie.

Timing in the clip: Max enters at about 0.4 s, is mid-frame at 2.5–3 s, and is gone by 4.8 s; the two dropped
sheets stay on the floor. The hint bubble window in `windows.js` is set from this.

## Video 2: the guide draws the portal (`guide-draws.mp4`, Build; start frame `frame-build.png`)

Current clip: job `1523fef3-80df-41b0-9685-180878f923cc`, regenerated after the four standing guide poses
were redrawn to match the canon sheet and the walk frames (the earlier cutouts had drifted to a different face).
Same prompt, first attempt; it draws the box just below and right of the pencil hand, where the portal now sits
(62, 66). Earlier clips: `ef2b2bc5-…` (solid lines, box at (59, 58)) and `9f7488e1-…` (dashed lines). The
prompt's placement wording dates from the original run, whose first attempt drew the box upper-middle.

> Hand-drawn pencil sketch animation on cream paper, vintage 1930s cartoon style, exactly the same two characters, boxes and drawing style as the start frame. The taller character in the scarf stretches his pencil arm out and down toward the lower right, and draws a small rounded rectangle low on the wall near the floor, to the right of the two characters, about two thirds of the way across the frame, just above the baseboard and left of the box labelled Invoicing; the pencil line appears stroke by stroke and becomes a small box with a screen, outlined in muted purple. The shorter character watches and smiles. The seven existing boxes and the office stay exactly still. The camera must not move, no zoom. No text, no speech bubbles, no new characters.

Seedance renders the clip slightly shrunk against its start frame (content at 0.9869·x − 4.31 px,
0.9699·y − 1.46 px of 1920×1080; the same on every generation so far). `src/film/scenes/Build.jsx`
undoes this with `CLIP_FIT`. After regenerating, extract the first and last frames
(`ffmpeg -i raw.mp4 -frames:v 1 first.png`, `ffmpeg -sseof -0.1 -i raw.mp4 -frames:v 1 last.png`) and run
`python3 scripts/film/measure-clip.py first.png last.png` next to `frame-build.png`; it prints the CSS.

## Video 3: the guide arrives (`guide-arrives.mp4`, Question; start `frame-q-start.png`, end `frame-q-end.png`)

Job `64011adb-08a3-4715-a65a-148f2dc59e68`, third attempt, **no `--image-references`**: the second attempt (`ce847097-…`) passed Max's title frame as an extra reference and Seedance blended that walking drawing into Max for a few frames, so he changed character mid-clip. Start and end frames alone carry both characters; never add a reference that shows a character in a different drawing. Start frame `/capture?scene=question` (`max-stack-stand` at 28%; the first attempt, job `28247c91-…`, started from the walking cutout and left Max frozen mid-stride), end
frame `/capture?scene=question-end` (Max + `guide-neutral` at 66%), Max's title reference as an extra image
reference. Desktop 1280×720 and mobile 854×480 encodes, no trim. The scene scrubs it over `[0.02, 0.62]` and
holds the last frame while the guide's bubble is up.

```bash
higgsfield generate create seedance_2_5 --mode omni_reference --start-image frame-q-start.png --end-image frame-q-end.png \
  --duration 5 --resolution 720p --aspect_ratio 16:9 --generate_audio false \
  --wait --wait-timeout 20m --wait-interval 15s --json --prompt "<prompt>" > video.json
```

> Hand-drawn pencil sketch animation on cream paper, vintage 1930s cartoon style, exactly the same two characters and drawing style as the start and end frames. the characters must keep exactly the same faces, proportions and line work in every frame. The shorter character on the left (the founder with the paper stack and laptop) keeps both feet planted in the same spot for the whole clip and does not walk or step; only the stack sways gently, a sweat drop flies, and his eyes glance to the right. From the very first second the taller character in the scarf walks in from the right edge with a bouncy cartoon walk, reaches the position shown in the end frame, gives a friendly wave with one hand, then puts both hands in his jacket pockets and stands listening with a calm smile, exactly as in the end frame. Side view, same size throughout. Camera static, no zoom, no pan. The paper background stays uniform cream. No text, no speech bubbles, no other characters, no colour beyond the rust-red tie and the muted purple scarf.

Timing in the clip: Max stays planted and the stack sways; the guide enters at about 1 s,
stops at about 2.5 s, waves at 3.5–4 s and has his hands in his pockets by 5 s.

## Video 4: into the office (`office-arrives.mp4`, Connect; start `frame-c-start.png`, end `frame-c-end.png`)

Job `7843ab0a-7df8-4d53-b492-d0a01cabe865`, first attempt. Start frame `/capture?scene=connect` (the empty office in the camera), end
frame `/capture?scene=connect-end` (`max-stack-stand` at 30%, `guide-point` at 44%), the Question end frame
as the character reference. Desktop only, no trim. The scene scrubs it over `[0, 0.25]` and holds the last
frame while the boxes appear and connect over it; `CLIP_FIT` (shared, `src/film/constants.js`) maps it onto
the camera.

```bash
higgsfield generate create seedance_2_5 --mode omni_reference --start-image frame-c-start.png --end-image frame-c-end.png \
  --image-references frame-q-end.png --duration 5 --resolution 720p --aspect_ratio 16:9 --generate_audio false \
  --wait --wait-timeout 20m --wait-interval 15s --json --prompt "<prompt>" > video.json
```

> Hand-drawn pencil sketch animation on cream paper, vintage 1930s cartoon style, exactly the same office and drawing style as the start frame and exactly the same two characters as the reference image and the end frame. The office starts empty. From the very first second the two characters walk in from the left edge with bouncy cartoon walks: the taller character in the scarf leads, the shorter founder follows carrying a wobbling stack of papers with a laptop on top, sweat drops, two sheets fluttering off. They stop in front of the desk at the positions shown in the end frame: the founder stands holding the stack, the taller character turns toward the wall on the right and points at it with one hand, other hand on hip, exactly as in the end frame. Side view, same size throughout. The office furniture stays exactly still. Camera static, no zoom, no pan. No text, no speech bubbles, no other characters, no boxes or diagrams on the wall, no colour beyond the rust-red tie and the muted purple scarf.

Timing in the clip: the office is empty for about 0.5 s, the guide enters at about 1 s and Max follows, both
are at their marks by about 3 s, and the guide is pointing from about 4 s.
