# Film clip prompts

The two scroll-scrubbed clips in `public/film/video/` were generated with Higgsfield Seedance 2.5
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

## Video 1: Max arrives (`max-arrives.mp4`, title card; start frame `frame-title.png`)

Job `652c51a8-25f6-433e-a120-bbaf73502934`, first attempt. Encoded with `-ss 0.6` to drop the empty
opening frames.

> Hand-drawn pencil sketch animation on cream paper, vintage 1930s cartoon style, exactly the same character and drawing style as the start frame. The founder walks in from the left edge toward the right with a bouncy cartoon walk, carrying a wobbling stack of papers with a laptop on top; two sheets flutter to the ground; he looks worried and glances up. Camera static, no zoom, no pan. The paper background stays uniform cream. No text, no speech bubbles, no other characters, no colour beyond the rust-red tie.

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
