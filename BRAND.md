# Brand Guide

> The visual and verbal language of the site. Use this as the source of truth
> when designing decks, social posts, partner materials, or anything that
> needs to feel consistent with the live site.

---

## 1. Core idea

**Your *true*\* digital partner for the AI era.**

The asterisk is the brand. *"True"* is the loaded word — what we are claiming
about ourselves — and the asterisk invites the reader to scroll/keep reading
to find out what it means. Don't drop the asterisk; it's the brand's signature.

The visual concept is a **cross between hand-drawn sketch and clean modern**.
Pencil on cream paper, but with confident sans-serif typography and crisp
layout. Neither pure cartoon nor pure tech-startup.

---

## 2. Colour palette

| Role | Hex | Use |
|---|---|---|
| **Paper** | `#F3ECE1` | Primary background. Used everywhere. The "canvas." |
| **Ink** | `#1F1A14` | Primary text colour. Warm near-black. |
| **Accent (Lila)** | `#6B5B95` | Handwritten words, links, CTAs, brand markers (`true*`). |
| **Sky** | `#77C1E2` | Transition / atmospheric colour. Used in the rocket scroll story. Sampled directly from the video. |

**Subtle alpha tints** (don't introduce new greys; layer Ink at low opacity):

| Token | Value | Use |
|---|---|---|
| Ink @ 75% | `rgba(31, 26, 20, 0.75)` | Body text on paper |
| Ink @ 65% | `rgba(31, 26, 20, 0.65)` | Secondary text, captions |
| Ink @ 15% | `rgba(31, 26, 20, 0.15)` | Hairline borders, dividers |
| Ink @ 04% | `rgba(31, 26, 20, 0.04)` | Soft panel backgrounds (e.g. expanded card details) |

**Don't introduce**: pure white, pure black, neon, gradients with bright stops.
The brand lives in muted, paper-tone territory.

---

## 3. Typography

Two typefaces. They always work together.

### 3.1 Inter — primary

Used for everything that needs structure: headlines, body text, navigation,
buttons, captions.

- Weights loaded: **300, 400, 500, 600, 700, 800, 900**
- Headlines: **800 (Extrabold)**, often `font-extrabold leading-[1.05]`
- Body: **400** at 0.75–0.8 opacity on Ink
- Sub-text / labels: **500** at 0.65 opacity

### 3.2 Caveat — accent / handwritten

Used **only for emphasis** — the word the eye should land on. Treats it like
someone is writing in the margin of a printed document.

- Weights loaded: **400, 500, 600, 700**
- Default in the brand: **700 (Bold)** at the accent colour `#6B5B95`
- Sized **1.15× to 1.25× the surrounding Inter text** so the visual baseline
  sits right despite Caveat being a smaller-x-height font

```css
--font-sans: 'Inter', system-ui, -apple-system, sans-serif;
--font-hand: 'Caveat', 'Inter', cursive;
```

### 3.3 The "Inter + Caveat" pattern

The brand's signature typographic move: **a clean Inter headline with one
handwritten Caveat word**.

> Your **true\*** digital partner for the AI era.
> True means **rethinking** what's possible.
> Real **customer** stories.
> Get in **touch**.
> Join the **team**.
> *We **think** with you.*

The hand-drawn word always belongs to **the concept the section is about** —
not a decoration, but a deliberate accent on the loadbearing word.

### 3.4 Type-size system (fluid)

Use `clamp()` so type scales naturally with viewport. Patterns currently in use:

| Element | Size |
|---|---|
| Hero H1 | `clamp(2rem, 4.2vw, 3.75rem)` |
| Section H2 | `clamp(1.75rem, 3.4vw, 3rem)` |
| Card / sub-section H3 | `clamp(1.5rem, 2.8vw, 2.5rem)` |
| Body | `clamp(0.95rem, 1.05vw, 1.125rem)` |
| Hand-accent inside H1/H2 | `1.15em` of parent |
| Button / CTA (Caveat) | `1.25rem`–`1.4rem` |

---

## 4. Imagery

The visual identity is built on **AI-generated pencil sketches on cream paper**,
in the style of *Hergé / Tintin* line work — confident strokes, soft graphite
shading, occasional muted colour accents (rust, gold, deep amber).

**Style anchor (always include in generation prompts):**

> "Hand-drawn pencil sketch on cream paper, soft graphite shading,
> Hergé/Tintin-inspired line work, monochrome with subtle muted colour
> accents, calm pacing."

**Do**:
- Cream paper background that matches `#F3ECE1` ± a few points
- Hand-drawn linework, slight imperfection
- Surreal touches when fitting (an astronaut floating in a pencil-drawn workshop, a rocket on a launch pad)
- Colour accents only where they tell the story (red on a rocket nose-cone, warm bokeh on a microphone)

**Don't**:
- Photorealistic stock photos
- Neon, gradient, glow effects
- Pure-white image backgrounds (creates a visible seam on the cream page)
- Generic "AI-art" aesthetic — geometric particles, holograms, glowing orbs

### 4.1 Image specs

- **Case study cards / hero illustrations**: **3:2 landscape**, ~1500×1000 or 1536×1024
- **App-logo accents** (Slack, Google, etc.): **1:1 square**, transparent background, sketched in same pencil style
- **Background colour for transparent images**: should match `#F3ECE1` so they sit flush on the page. If the source image has a near-cream bg, leave it; if it's pure white, expect a visible boundary

### 4.2 Scroll-driven video

Long-form pencil sketches can be turned into **scroll-scrubbed videos**. Spec:

- 16:9 landscape (1280×720 sufficient)
- 6–10 seconds source duration
- **Re-encoded as all-keyframe MP4** (`-x264-params keyint=1:scenecut=0`) so frame-by-frame seek is instant
- Use the same cream paper background and pencil aesthetic
- Calm pacing — single continuous transformation, no rapid cuts

---

## 5. Layout & UI

### 5.1 Structure

- **Single light theme** throughout the site — no dark sections
- Section bg: `#F3ECE1` (Paper) everywhere
- Sections separated by **hand-drawn wavy dividers** with a Caveat asterisk in the centre
- Generous vertical padding between sections: `py-24 md:py-36`
- Content max-width: **1500px** centred (`max-w-[1500px] mx-auto`)
- Side padding: `px-6 md:px-[4vw]`

### 5.2 Cards & frames

- **Cards** use 3:2 aspect imagery, no border, soft shadow only
- Default shadow: `0 2px 12px rgba(31, 26, 20, 0.06)`
- Active / focused: `0 8px 30px rgba(31, 26, 20, 0.15), 0 0 0 2px #6B5B95`
- Hover: subtle `scale-[1.03]` on the image, no border highlight

### 5.3 Buttons & CTAs

Two patterns:

**Filled (primary action)** — apply form, send message:
- Background: `#6B5B95`
- Text: white, **Caveat** at `1.3rem`–`1.4rem`, weight 700
- Hover: darken to `#5A4A7A`

**Inline link CTA** — "Read the story", "Get in touch", "View role":
- Text colour: `#6B5B95`
- Font: **Caveat 600**, `1.25rem`
- Followed by a small chevron/arrow that rotates or translates on hover

### 5.4 Form inputs

Underline-only (no boxes):
- `border-bottom: 1.5px solid rgba(31, 26, 20, 0.2)`
- Focus: border colour goes `#6B5B95`
- Labels: **Caveat 600** at `0.9rem`, ink @ 60% opacity

### 5.5 Section dividers

Hand-drawn wavy SVG line, broken in the middle by a Caveat asterisk in
`#6B5B95`. Two variants alternate so consecutive dividers don't look
identical. Component lives at `src/components/ui/SectionDivider.jsx`.

---

## 6. Motion

Most motion comes from **scroll position**, not autoplay. The brand feels
quiet and attentive, not flashy.

- **Scroll-scrubbed videos** for the rocket hero and astronaut "true means"
- **Parallax / pan** for horizontal phases inside long sections
- **Cross-fades** rather than slides between phases
- **Eased fade-and-rise** for entrance: `opacity 0 → 1`, `y 30 → 0`,
  duration `0.6–0.8s`, easing `[0.25, 0.1, 0.25, 1]`
- **No bouncy springs**, no rotating logos, no flashy interactions

---

## 7. Voice

**Confident, plain, specific.** Avoid generic consulting language.

**Always**:
- Specific over abstract ("Custom platforms, dashboards, internal tools" >
  "transformative solutions")
- Concrete over fluffy ("ships in weeks" > "delivers value at speed")
- One word per concept gets the Caveat treatment — pick the loadbearing one

**Avoid**:
- "It isn't *X* — it's *Y*" contrast structures (AI-slop tell)
- Buzzwords: *transform*, *unlock*, *synergy*, *deepest value*, *cutting-edge*
- Self-comparison to competitors ("unlike other agencies", "we're not just *X*")
- Em-dash sentences that hinge on a contrast or reveal

**Reference phrases that work**:
- *"Your true\* digital partner for the AI era."*
- *"We think with you. We build with you. We stay with you."*
- *"Most teams ask what to automate. We ask what to redesign."* (this one is on the line, but lands because the contrast is concrete)
- *"The build that took quarters and millions now ships in weeks."*

---

## 8. Quick reference

```
Paper      #F3ECE1
Ink        #1F1A14
Lila       #6B5B95
Sky        #77C1E2

Inter      300 / 400 / 500 / 600 / 700 / 800 / 900
Caveat     400 / 500 / 600 / 700  →  use 700 in lila for accents

Pattern    Plain Inter + ONE Caveat word per phrase
Asterisk   Always present on `true*`
Imagery    Pencil sketch, cream paper, Hergé-style
Sections   Single light theme, wavy divider with `*` between
Motion     Scroll-driven, calm, eased
Voice      Specific, plain, no consulting clichés
```
