import { motion, useTransform } from 'framer-motion';
import useIsDesktop from './useIsDesktop';
import { boxFractions, pointAlongPolyline, ringPoints } from './boxesLayout';
import { ramp } from './math';

import { ACCENT, NAV_HEIGHT } from './constants';

/** A small helper figure that travels the ring of boxes; each box it reaches gets a short ink ring. */
export default function AgentBot({ progress, travel, src }) {
  const isDesktop = useIsDesktop();
  const pts = ringPoints(isDesktop);
  const fractions = boxFractions(pts).slice(0, 7);
  const t = useTransform(progress, (p) => ramp(travel[0], travel[1], p));
  const left = useTransform(t, (v) => `${pointAlongPolyline(pts, v)[0]}%`);
  const top = useTransform(t, (v) => `${pointAlongPolyline(pts, v)[1]}%`);
  const size = isDesktop ? 96 : 44;
  const pings = fractions.map((f) => useTransform(t, (v) => Math.max(0, 1 - Math.abs(v - f) / 0.06))); // eslint-disable-line react-hooks/rules-of-hooks
  return (
    <div className="absolute inset-x-0 bottom-0 pointer-events-none" style={{ top: isDesktop ? NAV_HEIGHT : 0 }}>
      {pts.slice(0, 7).map(([x, y], i) => (
        <motion.span key={i} data-ping={i} className="absolute rounded-full pointer-events-none"
          style={{ left: `${x}%`, top: `${y}%`, width: size * 1.6, height: size * 1.6, x: '-50%', y: '-50%', border: `2px solid ${ACCENT}`, opacity: pings[i] }} />
      ))}
      <motion.img data-agent src={src} alt="" loading="lazy" className="absolute pointer-events-none"
        style={{ left, top, x: '-50%', y: '-60%', height: size, width: 'auto', zIndex: 12 }} />
    </div>
  );
}
