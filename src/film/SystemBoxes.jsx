import { useState } from 'react';
import { motion, useMotionValue, useMotionValueEvent, useTransform } from 'framer-motion';
import useIsDesktop from './useIsDesktop';
import { BOXES, EDGES, positions, segments } from './boxesLayout';
import { ramp } from './math';
import { INK, ACCENT, PAPER } from './constants';

const HAND_RADIUS = '255px 15px 225px 15px / 15px 225px 15px 255px';

function Box({ box, x, y, size, opacity, isNew }) {
  return (
    <motion.div data-box={box.id} className="absolute flex flex-col items-center justify-center gap-1 pointer-events-none"
      style={{
        left: `${x}%`, top: `${y}%`, width: size, height: size, x: '-50%', y: '-50%', opacity,
        border: `2px solid ${isNew ? ACCENT : 'rgba(31,26,20,0.7)'}`, borderRadius: HAND_RADIUS, backgroundColor: PAPER,
        boxShadow: '0 2px 12px rgba(31, 26, 20, 0.06)',
      }}>
      {box.logo
        ? <img src={box.logo} alt={box.label} loading="lazy" style={{ width: '46%', height: '46%', objectFit: 'contain' }} />
        : <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, color: isNew ? ACCENT : INK, fontSize: size > 80 ? '0.95rem' : '0.6rem' }}>{box.label}</span>}
    </motion.div>
  );
}

/**
 * The eight system boxes and the lines between them.
 * appear: window during which boxes fade in one after another. connect: window during which lines draw.
 * showNew: progress at which the portal box appears (null = never). locks/flow: decorations for scene 5.
 */
export default function SystemBoxes({ progress, appear = [0, 0], connect = [0, 0], showNew = null, locks = false, flow = false, static: isStatic = false }) {
  const isDesktop = useIsDesktop();
  const fallback = useMotionValue(1);
  const p = isStatic ? fallback : progress;
  const pos = positions(isDesktop);
  const size = isDesktop ? 112 : 56;
  const withPortal = showNew !== null;
  const segs = segments(isDesktop, withPortal);
  const base = BOXES.filter((b) => !b.isNew);
  const step = (appear[1] - appear[0]) / base.length;
  const cstep = (connect[1] - connect[0]) / EDGES.length;

  const boxOpacities = base.map((_, i) => useTransform(p, (v) => (isStatic ? 1 : ramp(appear[0] + i * step, appear[0] + (i + 1) * step, v)))); // eslint-disable-line react-hooks/rules-of-hooks
  // Ring and chord lines draw during `connect`; the two portal lines draw together with the portal box.
  const lineLengths = segs.map((s, j) => useTransform(p, (v) => { // eslint-disable-line react-hooks/rules-of-hooks
    if (isStatic) return 1;
    if (s.from === 'portal') return ramp(showNew, showNew + 0.08, v);
    return ramp(connect[0] + j * cstep, connect[0] + (j + 1) * cstep, v);
  }));
  const portalOpacity = useTransform(p, (v) => (!withPortal ? 0 : isStatic ? 1 : ramp(showNew, showNew + 0.05, v)));
  const dash = useTransform(p, (v) => -v * 60);
  const flowOpacities = segs.map((s) => useTransform(p, (v) => (s.from === 'portal' ? ramp(showNew, showNew + 0.08, v) : 1))); // eslint-disable-line react-hooks/rules-of-hooks
  const [portalVisible, setPortalVisible] = useState(() => withPortal && (isStatic || p.get() >= showNew));
  useMotionValueEvent(p, 'change', (v) => {
    const next = withPortal && (isStatic || v >= showNew);
    if (next !== portalVisible) setPortalVisible(next);
  });

  return (
    <div className="absolute inset-0 pointer-events-none" data-boxes>
      <svg data-boxes-svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full" aria-hidden="true">
        {segs.map((s, j) => (
          <motion.line key={`${s.from}-${s.to}`} x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2}
            stroke="rgba(31,26,20,0.55)" strokeWidth="2" vectorEffect="non-scaling-stroke" strokeLinecap="round"
            style={{ pathLength: lineLengths[j] }} />
        ))}
        {/* framer's pathLength owns stroke-dasharray, so the dotted flow is a second set of plain lines. */}
        {flow && segs.map((s, j) => (
          <motion.line key={`flow-${s.from}-${s.to}`} x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2}
            stroke={ACCENT} strokeWidth="2" vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeDasharray="6 8"
            style={{ strokeDashoffset: dash, opacity: flowOpacities[j] }} />
        ))}
      </svg>
      {locks && segs.map((s) => (
        <span key={`lock-${s.from}-${s.to}`} data-lock={`${s.from}-${s.to}`} className="absolute pointer-events-none"
          style={{ left: `${(s.x1 + s.x2) / 2}%`, top: `${(s.y1 + s.y2) / 2}%`, transform: 'translate(-50%,-50%)' }}>
          <svg viewBox="0 0 20 22" width="18" height="20" aria-hidden="true">
            <rect x="3" y="9" width="14" height="11" rx="2" fill={PAPER} stroke={INK} strokeWidth="1.5" />
            <path d="M 6 9 V 6 A 4 4 0 0 1 14 6 V 9" fill="none" stroke={INK} strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </span>
      ))}
      {base.map((box, i) => <Box key={box.id} box={box} x={pos[box.id][0]} y={pos[box.id][1]} size={size} opacity={boxOpacities[i]} />)}
      <span data-portal-visible={portalVisible ? 'true' : 'false'} hidden />
      <Box box={BOXES[7]} x={pos.portal[0]} y={pos.portal[1]} size={size} opacity={portalOpacity} isNew />
    </div>
  );
}
