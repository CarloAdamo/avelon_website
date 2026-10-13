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
    Object.defineProperty(video, 'currentTime', { get: () => 0, set: (v) => { sets.push(v); } });
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
    Object.defineProperty(video, 'currentTime', { get: () => 1, set: (v) => { sets.push(v); } });
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
