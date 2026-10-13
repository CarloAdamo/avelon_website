import { useRef } from 'react';
import { useScroll, useSpring } from 'framer-motion';
import { PAPER, SPRING } from './constants';

function Pinned({ id, length, className, children }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const progress = useSpring(scrollYProgress, SPRING);
  return (
    <section id={id} ref={ref} data-scene={id} data-length={length} className={`relative ${className}`}
      style={{ height: `${(length + 1) * 100}svh`, backgroundColor: PAPER }}>
      <div className="sticky top-0 w-full overflow-hidden" style={{ height: '100svh' }}>
        {children(progress)}
      </div>
    </section>
  );
}

/**
 * A pinned scene. `length` is the scroll distance in viewports while the stage is pinned,
 * so the section is (length + 1) viewports tall. Children receive a spring-smoothed 0..1 progress.
 * When `reduced` is true the scene renders `staticContent` in normal flow instead.
 */
export default function Scene({ id, length, reduced = false, staticContent = null, className = '', children }) {
  if (reduced) {
    return (
      <section id={id} data-scene={id} data-film-static="true" className={`relative px-6 md:px-[4vw] py-12 ${className}`} style={{ backgroundColor: PAPER }}>
        <div className="max-w-[1100px] mx-auto">{staticContent}</div>
      </section>
    );
  }
  return <Pinned id={id} length={length} className={className}>{children}</Pinned>;
}
