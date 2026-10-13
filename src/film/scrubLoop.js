import { shouldSeek } from './math';

/** One requestAnimationFrame loop shared by every scrubbed video on the page. */
export function createScrubLoop({ raf, caf }) {
  const registry = new Set();
  let handle = null;

  function tick() {
    for (const entry of registry) {
      const target = entry.target();
      if (shouldSeek(entry.video.currentTime, target)) entry.video.currentTime = target;
    }
    handle = registry.size ? raf(tick) : null;
  }

  return {
    register(entry) {
      registry.add(entry);
      if (handle === null) handle = raf(tick);
    },
    unregister(entry) {
      registry.delete(entry);
      if (registry.size === 0 && handle !== null) {
        caf(handle);
        handle = null;
      }
    },
    size: () => registry.size,
  };
}

const scrubLoop = typeof window !== 'undefined'
  ? createScrubLoop({ raf: (cb) => window.requestAnimationFrame(cb), caf: (h) => window.cancelAnimationFrame(h) })
  : createScrubLoop({ raf: () => 0, caf: () => {} });

export default scrubLoop;
