import { motion, useScroll, useSpring, useTransform, useMotionValueEvent } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

export default function RocketScroll() {
  const sectionRef = useRef(null);
  const videoRef = useRef(null);
  const targetTimeRef = useRef(0);
  const [duration, setDuration] = useState(0);
  const [ready, setReady] = useState(false);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.4,
  });

  // Non-linear scroll → video time mapping. Sketch phase lingers; later phases play closer to natural pace.
  const videoProgress = useTransform(progress, [0, 0.45, 0.7, 1], [0, 0.18, 0.5, 1]);

  useMotionValueEvent(videoProgress, 'change', (vp) => {
    if (!duration) return;
    targetTimeRef.current = Math.max(0, Math.min(duration - 0.05, vp * duration));
  });

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const onMeta = () => setDuration(video.duration || 0);
    const onCanPlay = () => setReady(true);
    video.addEventListener('loadedmetadata', onMeta);
    video.addEventListener('canplay', onCanPlay);
    const prime = video.play();
    if (prime && typeof prime.then === 'function') {
      prime.then(() => video.pause()).catch(() => {});
    }
    return () => {
      video.removeEventListener('loadedmetadata', onMeta);
      video.removeEventListener('canplay', onCanPlay);
    };
  }, []);

  useEffect(() => {
    if (!duration) return;
    const video = videoRef.current;
    if (!video) return;
    let raf;
    const tick = () => {
      const current = video.currentTime;
      const target = targetTimeRef.current;
      if (Math.abs(target - current) > 0.01) {
        video.currentTime = target;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [duration]);

  // Hero copy fades out as soon as the user starts scrolling
  const heroOpacity = useTransform(progress, [0, 0.08, 0.15], [1, 1, 0]);
  const heroY = useTransform(progress, [0, 0.15], [0, -40]);

  // Scroll indicator hides almost immediately
  const scrollHintOpacity = useTransform(progress, [0, 0.05], [1, 0]);

  // Story beats — fade in, HOLD at full opacity for a chunk of scroll, then fade out.
  // 5-stop curve gives each beat a proper "linger" so it can actually be read at normal scroll speed.
  const story1Opacity = useTransform(progress, [0.14, 0.22, 0.32, 0.40], [0, 1, 1, 0]);
  const story1Y = useTransform(progress, [0.14, 0.22, 0.40], [30, 0, -20]);
  const story2Opacity = useTransform(progress, [0.42, 0.50, 0.62, 0.70], [0, 1, 1, 0]);
  const story2Y = useTransform(progress, [0.42, 0.50, 0.70], [30, 0, -20]);
  const story3Opacity = useTransform(progress, [0.74, 0.82, 0.94, 1.0], [0, 1, 1, 0]);
  const story3Y = useTransform(progress, [0.74, 0.82, 1.0], [30, 0, -20]);

  // Sky color (paper handled via tiled image overlay below to match the video's exact rendered tone)
  const skyColor = '#77C1E2';

  // Paper image fades out as bg turns blue. Using the same image source as the video means
  // the section bg matches the video frame exactly — bypasses CSS-vs-video color profile drift.
  const paperOpacity = useTransform(videoProgress, [0, 0.15, 0.22], [1, 1, 0]);

  // Ink color stays dark — bg never goes deep, dark text is legible on both paper and sky-blue.
  const inkColor = '#1f1a14';

  return (
    <section ref={sectionRef} className="relative" style={{ height: '900vh' }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Sky-blue base layer — visible once the paper layer fades out */}
        <div className="absolute inset-0" style={{ backgroundColor: skyColor }} />

        {/* Paper layer — tiled PNG extracted from the video so colors match exactly */}
        <motion.div
          className="absolute inset-0"
          style={{
            opacity: paperOpacity,
            backgroundImage: 'url(/rocket/paper.png)',
            backgroundRepeat: 'repeat',
            backgroundSize: '160px 160px',
          }}
        />

        {/* Rocket video — anchored bottom on mobile, right column on desktop */}
        <div className="absolute inset-0 flex justify-center items-end pb-4 md:items-center md:justify-end md:pr-[6vw] md:pb-0">
          <video
            ref={videoRef}
            src="/rocket/rocket-scrub.mp4"
            muted
            playsInline
            preload="auto"
            className="h-[60vh] md:h-[88vh] w-auto"
            style={{
              opacity: ready ? 1 : 0,
              transition: 'opacity 0.4s ease',
              // Feather all four edges so any tone mismatch with the section bg dissolves gradually
              // instead of forming a visible seam. Mask is intersected from horizontal + vertical gradients.
              maskImage:
                'linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 4%, black 96%, transparent 100%)',
              WebkitMaskImage:
                'linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 4%, black 96%, transparent 100%)',
              maskComposite: 'intersect',
              WebkitMaskComposite: 'source-in',
            }}
          />
        </div>

        {/* Hero overlay — centered top on mobile (under navbar), left column on desktop. Fades out by ~15% scroll */}
        <motion.div
          className="absolute inset-x-0 top-24 md:top-0 md:bottom-0 z-10 pointer-events-none px-6 md:px-[6vw] md:flex md:items-center text-center md:text-left"
          style={{ opacity: heroOpacity, y: heroY }}
        >
          <div className="mx-auto md:mx-0 max-w-full" style={{ maxWidth: 'min(48vw, 720px)' }}>
            <motion.h1
              className="font-extrabold leading-[1.05]"
              style={{
                color: inkColor,
                fontSize: 'clamp(2rem, 4.2vw, 3.75rem)',
              }}
            >
              <span className="block">
                Your{' '}
                <span
                  className="text-[#6B5B95]"
                  style={{
                    fontFamily: 'var(--font-hand)',
                    fontWeight: 700,
                    fontSize: '1.15em',
                  }}
                >
                  true*
                </span>
              </span>
              <span className="block">digital partner</span>
              <span className="block">for the AI era.</span>
            </motion.h1>

            <motion.p
              className="mt-4 md:mt-6 leading-relaxed hidden sm:block"
              style={{
                color: inkColor,
                opacity: 0.7,
                fontSize: 'clamp(0.95rem, 1.05vw, 1.125rem)',
                maxWidth: '34ch',
              }}
            >
              AI has leveled the playing field. We help businesses unlock
              capabilities once reserved for the few.
            </motion.p>
          </div>
        </motion.div>

        {/* Story beats — each fades in/out over its own scroll window, in the same left column as the hero */}
        <StoryBeat opacity={story1Opacity} y={story1Y} lead="We" accent="think" tail="with you." />
        <StoryBeat opacity={story2Opacity} y={story2Y} lead="We" accent="build" tail="with you." />
        <StoryBeat opacity={story3Opacity} y={story3Y} lead="We" accent="stay" tail="with you." />

        {/* Scroll hint — bottom center, hidden on mobile to avoid clashing with the rocket */}
        <motion.div
          className="hidden md:flex absolute bottom-8 left-1/2 -translate-x-1/2 pointer-events-none flex-col items-center gap-1"
          style={{ opacity: scrollHintOpacity }}
        >
          <motion.span
            style={{
              color: inkColor,
              fontFamily: 'var(--font-hand)',
              fontSize: '1.4rem',
            }}
          >
            scroll to launch
          </motion.span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          >
            <motion.svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: inkColor }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </motion.svg>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function StoryBeat({ opacity, y, lead, accent, tail }) {
  return (
    <motion.div
      className="absolute inset-x-0 top-24 md:top-0 md:bottom-0 z-10 pointer-events-none px-6 md:px-[6vw] md:flex md:items-center text-center md:text-left"
      style={{ opacity, y }}
    >
      <div className="mx-auto md:mx-0 max-w-full" style={{ maxWidth: 'min(48vw, 720px)' }}>
        <h2
          className="font-extrabold leading-[1.05]"
          style={{
            color: '#1f1a14',
            fontSize: 'clamp(2.5rem, 3.6vw, 3rem)',
          }}
        >
          <span className="block">{lead}</span>
          <span
            className="block text-[#6B5B95]"
            style={{
              fontFamily: 'var(--font-hand)',
              fontWeight: 700,
              fontSize: '1.25em',
              lineHeight: 0.95,
              marginTop: '0.05em',
            }}
          >
            {accent}
          </span>
          {tail && <span className="block">{tail}</span>}
        </h2>
      </div>
    </motion.div>
  );
}
