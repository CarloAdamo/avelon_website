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
