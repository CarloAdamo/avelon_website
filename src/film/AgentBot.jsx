import { motion, useTransform } from 'framer-motion';
import useIsDesktop from './useIsDesktop';
import { boxFractions, pointAlongPolyline, ringPoints } from './boxesLayout';
import { ramp } from './math';
import { ACCENT, DESKTOP_BAND } from './constants';

/** A small helper figure that travels the ring of boxes; each box it reaches gets a short ink ring. */
export default function AgentBot({ progress, travel, src }) {
  const isDesktop = useIsDesktop();
  const pts = ringPoints(isDesktop);
  const fractions = boxFractions(pts).slice(0, 7);
  const t = useTransform(progress, (p) => ramp(travel[0], travel[1], p));
  const left = useTransform(t, (v) => `${pointAlongPolyline(pts, v)[0]}%`);
  const top = useTransform(t, (v) => `${pointAlongPolyline(pts, v)[1]}%`);
  // Desktop sizes in camera units (96px at the 1920px capture width = 5cqw).
  const size = isDesktop ? { bot: '5cqw', ping: '8cqw' } : { bot: 44, ping: 70 };
  const pings = fractions.map((f) => useTransform(t, (v) => Math.max(0, 1 - Math.abs(v - f) / 0.06))); // eslint-disable-line react-hooks/rules-of-hooks
  return (
    <div className="absolute inset-x-0 bottom-0 pointer-events-none" style={{ top: isDesktop ? DESKTOP_BAND : 0 }}>
      {pts.slice(0, 7).map(([x, y], i) => (
        <motion.span key={i} data-ping={i} className="absolute rounded-full pointer-events-none"
          style={{ left: `${x}%`, top: `${y}%`, width: size.ping, height: size.ping, x: '-50%', y: '-50%', border: `2px solid ${ACCENT}`, opacity: pings[i] }} />
      ))}
      <motion.img data-agent src={src} alt="" loading="lazy" className="absolute pointer-events-none"
        style={{ left, top, x: '-50%', y: '-60%', height: size.bot, width: 'auto', zIndex: 12 }} />
    </div>
  );
}
