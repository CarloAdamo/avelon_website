import { useState } from 'react';
import { motion, transform, useMotionValueEvent, useTransform } from 'framer-motion';
import { pickSequence, walkBob, walkFrame } from './math';
import useIsDesktop from './useIsDesktop';

const noop = () => 0;

function keyframes(spec, fallback) {
  if (!spec) return () => fallback;
  const [stops, values] = spec;
  return transform(stops, values);
}

function srcFor(sequence, walk, p) {
  if (walk) {
    const f = walkFrame(walk.window, p);
    if (f !== null) return walk.frames[f];
  }
  return pickSequence(sequence, p).src;
}

// Desktop: characters stand on a baseline at 88% of the stage, 62% tall. Mobile: the bottom 40% band (spec §3.5).
const BAND = { desktop: { bottom: '12%', height: '62%' }, mobile: { bottom: '3%', height: '34%' } };

/**
 * A character or prop cutout driven by scene progress.
 * `sequence` picks the image by progress; `walk` alternates two frames inside its window and adds a bob.
 * Transform keyframes are [stops, values] arrays (framer `transform` semantics).
 */
export default function Actor({
  progress, sequence = [], walk, x, y, rotate, scale, opacity, eager = false,
  alt = '', static: isStatic = null, className = '', zIndex = 10,
}) {
  const isDesktop = useIsDesktop();
  const band = isDesktop ? BAND.desktop : BAND.mobile;
  if (isStatic) {
    return (
      <img src={isStatic.src} alt={alt} loading="lazy"
        style={{ position: 'absolute', bottom: band.bottom, left: isStatic.left, transform: 'translateX(-50%)', height: band.height, width: 'auto' }} />
    );
  }
  return <LiveActor {...{ progress, sequence, walk, x, y, rotate, scale, opacity, eager, band, alt, className, zIndex }} />;
}

function LiveActor({ progress, sequence, walk, x, y, rotate, scale, opacity, eager, band, alt, className, zIndex }) {
  const [src, setSrc] = useState(() => srcFor(sequence, walk, progress.get()));
  useMotionValueEvent(progress, 'change', (p) => {
    const next = srcFor(sequence, walk, p);
    if (next !== src) setSrc(next);
  });
  const xf = keyframes(x, '50%');
  const yf = keyframes(y, 0);
  const rf = keyframes(rotate, 0);
  const sf = keyframes(scale, 1);
  const of = keyframes(opacity, 1);
  const left = useTransform(progress, (p) => xf(p));
  const yy = useTransform(progress, (p) => (typeof yf(p) === 'number' ? yf(p) : 0) - (walk ? walkBob(walk.window, p) : noop()));
  const rot = useTransform(progress, (p) => rf(p));
  const sc = useTransform(progress, (p) => sf(p));
  const op = useTransform(progress, (p) => of(p));
  return (
    <motion.img data-actor src={src} alt={alt} loading={eager ? 'eager' : 'lazy'} draggable={false}
      className={`pointer-events-none select-none ${className}`}
      style={{ position: 'absolute', bottom: band.bottom, left, x: '-50%', y: yy, rotate: rot, scale: sc, opacity: op, height: band.height, width: 'auto', zIndex }} />
  );
}
