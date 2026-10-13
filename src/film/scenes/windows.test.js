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
