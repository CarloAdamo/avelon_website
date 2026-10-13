# Film clip prompts

The two scroll-scrubbed clips in `public/film/video/` were generated with Higgsfield Seedance 2.5
(`omni_reference`, start image, 5 s, 720p, 16:9, no audio) and then re-encoded all-intra
(see `.claude/skills/verify/SKILL.md`). These are the accepted attempts.

Start frames come from the dev-only capture route: `npm run dev`, then
`node scripts/film/frame.mjs title frame-title.png` and `node scripts/film/frame.mjs build frame-build.png`.

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

Job `9f7488e1-1700-45b6-83ab-31daa31281ae`, second attempt. The first attempt (the plan's original
prompt) drew the box upper-middle, away from the portal position, so the placement was spelled out.

> Hand-drawn pencil sketch animation on cream paper, vintage 1930s cartoon style, exactly the same two characters, boxes and drawing style as the start frame. The taller character in the scarf stretches his pencil arm out and down toward the lower right, and draws a small rounded rectangle low on the wall near the floor, to the right of the two characters, about two thirds of the way across the frame, just above the baseboard and left of the box labelled Invoicing; the pencil line appears stroke by stroke and becomes a small box with a screen, outlined in muted purple. The shorter character watches and smiles. The seven existing boxes and the office stay exactly still. The camera must not move, no zoom. No text, no speech bubbles, no new characters.

The rendered clip is slightly shrunk against its start frame (content at 0.9874·x − 4.8 px,
0.9698·y − 1.5 px of 1920×1080). `src/film/scenes/Build.jsx` undoes this with `CLIP_FIT`; a
regenerated clip needs that fit measured again (compare the clip's first frame with the start frame).
