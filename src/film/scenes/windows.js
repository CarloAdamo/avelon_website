// Scroll length (viewports) and bubble windows [in0, in1, out0, out1] per scene.
// Bubbles are rendered in the DOM in the same key order as WINDOWS; the verification script relies on that.
// SHORT lists windows exempt from the 0.8-viewport hold rule (the title-card hint only).
// Lengths total 18.5 viewports of scrubbing (about 40–60 s at a normal scroll pace). Windows are
// fractions of L, so lengthening a scene lengthens every hold in it; the test below enforces the minimum.
export const SCENES = {
  title:    { L: 2,   WINDOWS: { hint: [0.2, 0.28, 0.5, 0.58] }, SHORT: ['hint'] },
  question: { L: 3,   WINDOWS: { max: [0.10, 0.18, 0.50, 0.58], guide: [0.58, 0.66, 0.98, 1.0] } },
  connect:  { L: 4.5, WINDOWS: { all: [0.18, 0.25, 0.48, 0.55], connect: [0.58, 0.65, 0.93, 1.0] } },
  agents:   { L: 3,   WINDOWS: { agents: [0.15, 0.23, 0.60, 0.68] } },
  build:    { L: 3,   WINDOWS: { build: [0.25, 0.33, 0.70, 0.78] } },
  stay:     { L: 3,   WINDOWS: { secure: [0.05, 0.13, 0.45, 0.53], stay: [0.55, 0.63, 0.95, 1.0] } },
};
