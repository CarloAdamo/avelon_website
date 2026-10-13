import { describe, it, expect } from 'vitest';
import {
  FRAME, ramp, bubbleOpacity, bubbleRise, holdLength, validateWindow, overlaps,
  pickSequence, walkFrame, walkBob, shouldSeek, clampTime, videoTime, pickSrc,
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
