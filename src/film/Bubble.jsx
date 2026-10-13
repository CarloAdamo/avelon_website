import { motion, useMotionValue, useTransform } from 'framer-motion';
import useIsDesktop from './useIsDesktop';
import { bubbleOpacity, bubbleRise } from './math';

const INK = '#1F1A14';
const PAPER = '#F3ECE1';
const NAMES = { max: 'Max', guide: 'The guide' };
const SLOT_TOP = { 1: '4%', 2: '17%' };

// The classic hand-drawn border: uneven radii make a slightly wobbly outline that stays crisp at any size.
const SHAPE = {
  border: `2px solid rgba(31, 26, 20, 0.85)`,
  borderRadius: '255px 15px 225px 15px / 15px 225px 15px 255px',
  backgroundColor: PAPER,
  color: INK,
  padding: '0.9rem 1.2rem',
  fontFamily: 'var(--font-sans)',
  fontWeight: 500,
  fontSize: 'clamp(1rem, 1.4vw, 1.35rem)',
  lineHeight: 1.35,
  maxWidth: '34ch',
  boxShadow: '0 2px 12px rgba(31, 26, 20, 0.06)',
};

function Tail({ side }) {
  const flip = side === 'right' ? 'scaleX(-1)' : 'none';
  return (
    <svg viewBox="0 0 40 28" width="34" height="24" aria-hidden="true"
      style={{ position: 'absolute', bottom: -21, [side]: 28, transform: flip, overflow: 'visible' }}>
      <path d="M 4 2 C 8 12, 10 20, 6 27 C 16 20, 26 10, 34 3" fill={PAPER} stroke="rgba(31, 26, 20, 0.85)" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export default function Bubble({ speaker, anchor, progress, window: win, static: isStatic = false, children }) {
  const isDesktop = useIsDesktop();
  const fallback = useMotionValue(1);
  const source = progress ?? fallback;
  const opacity = useTransform(source, (p) => (win ? bubbleOpacity(win, p) : 1));
  const y = useTransform(source, (p) => (win ? bubbleRise(win, p) : 0));
  const side = speaker === 'max' ? 'left' : 'right';

  if (isStatic) {
    return (
      <div data-bubble={speaker} data-static="true" className="relative my-4" style={{ maxWidth: '40ch' }}>
        <div style={{ fontFamily: 'var(--font-hand)', fontWeight: 600, fontSize: '1.1rem', color: 'rgba(31,26,20,0.65)', marginBottom: 4 }}>
          {NAMES[speaker]}
        </div>
        <div style={SHAPE}>{children}</div>
      </div>
    );
  }

  const position = isDesktop
    ? { left: anchor.desktop.left, top: anchor.desktop.top }
    : { left: '6%', right: '6%', top: SLOT_TOP[anchor.mobile.slot] };

  return (
    <motion.div data-bubble={speaker} className="z-20 pointer-events-none"
      style={{ position: 'absolute', ...position, opacity, y }}>
      <div style={{ ...SHAPE, position: 'relative', marginLeft: isDesktop ? 0 : 'auto', marginRight: isDesktop ? 0 : 'auto' }}>
        {children}
        <Tail side={side} />
      </div>
    </motion.div>
  );
}
