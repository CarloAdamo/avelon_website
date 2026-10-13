import { motion, useMotionValue, useTransform } from 'framer-motion';
import useIsDesktop from './useIsDesktop';
import { bubbleOpacity } from './math';

/**
 * Small Inter line shown under a bubble, sharing its window.
 * Desktop: absolutely positioned at `anchor` ({left, top}). Mobile: under bubble slot 1. Pass `static` to render in flow.
 */
export default function Caption({ progress, window: win, anchor, static: isStatic = false, children }) {
  const isDesktop = useIsDesktop();
  const fallback = useMotionValue(1);
  const opacity = useTransform(progress ?? fallback, (p) => (win ? bubbleOpacity(win, p) : 1));
  const style = { color: 'rgba(31,26,20,0.7)', fontFamily: 'var(--font-sans)', fontSize: 'clamp(0.9rem, 1.05vw, 1.1rem)', maxWidth: '40ch' };
  if (isStatic) return <p data-caption style={{ ...style, margin: '0.25rem 0 1rem' }}>{children}</p>;
  const pos = isDesktop ? anchor : { left: '6%', right: '6%', top: '17%', textAlign: 'center' };
  return (
    <motion.p data-caption className="absolute z-20 pointer-events-none" style={{ ...style, ...pos, opacity }}>{children}</motion.p>
  );
}
