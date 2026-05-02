import { motion, useScroll, useSpring, useTransform, useMotionValueEvent } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

const ACCENT = '#6B5B95';
const PAPER = '#F3ECE1';
const INK = '#1f1a14';

export default function TrueMeaning() {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 100, damping: 30, mass: 0.4,
  });

  // ---- Phase 1 astronaut video scrubbing ----
  // Video plays through as scroll moves through phase 1 (0.00 - 0.22)
  const astronautRef = useRef(null);
  const astronautTimeRef = useRef(0);
  const [astronautDuration, setAstronautDuration] = useState(0);
  const [astronautReady, setAstronautReady] = useState(false);
  const astronautProgress = useTransform(progress, [0.00, 0.22], [0, 1]);

  useMotionValueEvent(astronautProgress, 'change', (vp) => {
    if (!astronautDuration) return;
    astronautTimeRef.current = Math.max(0, Math.min(astronautDuration - 0.05, vp * astronautDuration));
  });

  useEffect(() => {
    const video = astronautRef.current;
    if (!video) return;
    const onMeta = () => setAstronautDuration(video.duration || 0);
    const onCanPlay = () => setAstronautReady(true);
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
    if (!astronautDuration) return;
    const video = astronautRef.current;
    if (!video) return;
    let raf;
    const tick = () => {
      const current = video.currentTime;
      const target = astronautTimeRef.current;
      if (Math.abs(target - current) > 0.01) {
        video.currentTime = target;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [astronautDuration]);

  // ---- Phase windows ----
  // Phase 1 (vertical):   scroll 0.00 - 0.22 — rethinking, screen3 (mgmt consult placeholder)
  // Phase 2 (horizontal): scroll 0.22 - 0.78 — specialized solutions, 3-panel pan
  // Phase 3 (vertical):   scroll 0.78 - 1.00 — seamless integration, flying logos

  // Visual layer opacities — overlap with the layout slide so everything moves as one transition.
  const phase1Op = useTransform(progress, [0.00, 0.16, 0.28], [1, 1, 0]);
  const phase2Op = useTransform(progress, [0.20, 0.32, 0.70, 0.82], [0, 1, 1, 0]);
  const phase3Op = useTransform(progress, [0.74, 0.86, 1.00], [0, 1, 1]);

  // Horizontal pan within phase 2.
  // 3 panels in a row of 300% width. translateX from 0% to -66.67% to reveal each in turn.
  const panX = useTransform(progress, [0.26, 0.72], ['0%', '-66.67%']);

  // ---- Logo fly-in / fly-out (phase 3) ----
  const FLY_IN_START  = 0.76;
  const FLY_IN_END    = 0.86;
  const FLY_OUT_START = 0.95;
  const FLY_OUT_END   = 1.00;

  const slackX = useTransform(progress,
    [FLY_IN_START, FLY_IN_END, FLY_OUT_START, FLY_OUT_END],
    ['-60%', '12%', '12%', '-60%']);
  const slackY = useTransform(progress,
    [FLY_IN_START, FLY_IN_END, FLY_OUT_START, FLY_OUT_END],
    ['10%', '10%', '10%', '-30%']);

  const googleX = useTransform(progress,
    [FLY_IN_START, FLY_IN_END, FLY_OUT_START, FLY_OUT_END],
    ['62%', '62%', '62%', '62%']);
  const googleY = useTransform(progress,
    [FLY_IN_START, FLY_IN_END, FLY_OUT_START, FLY_OUT_END],
    ['-50%', '8%', '8%', '-60%']);

  const chatgptX = useTransform(progress,
    [FLY_IN_START, FLY_IN_END, FLY_OUT_START, FLY_OUT_END],
    ['130%', '40%', '40%', '130%']);
  const chatgptY = useTransform(progress,
    [FLY_IN_START, FLY_IN_END, FLY_OUT_START, FLY_OUT_END],
    ['42%', '42%', '42%', '42%']);

  const microsoftX = useTransform(progress,
    [FLY_IN_START, FLY_IN_END, FLY_OUT_START, FLY_OUT_END],
    ['130%', '68%', '68%', '130%']);
  const microsoftY = useTransform(progress,
    [FLY_IN_START, FLY_IN_END, FLY_OUT_START, FLY_OUT_END],
    ['130%', '72%', '72%', '130%']);

  const claudeX = useTransform(progress,
    [FLY_IN_START, FLY_IN_END, FLY_OUT_START, FLY_OUT_END],
    ['-60%', '15%', '15%', '-60%']);
  const claudeY = useTransform(progress,
    [FLY_IN_START, FLY_IN_END, FLY_OUT_START, FLY_OUT_END],
    ['130%', '70%', '70%', '130%']);

  // Captions — overlap with the layout slide for one continuous motion.
  const cap1 = useTransform(progress, [0.02, 0.10, 0.18, 0.28], [0, 1, 1, 0]);
  const cap2 = useTransform(progress, [0.20, 0.32, 0.68, 0.80], [0, 1, 1, 0]);
  const cap3 = useTransform(progress, [0.74, 0.86, 0.96, 1.00], [0, 1, 1, 0]);

  // Layout slide — text and visual columns translate past each other instead of snapping.
  // text col is 40% wide (col-span-5 of 12), visual col is 57% wide (col-span-7 of 12).
  // Phase 1/3: text at left 0%, visual at left 43%. Phase 2: visual at left 0%, text at left 60%.
  const textLeft   = useTransform(progress, [0.16, 0.30, 0.70, 0.84], ['0%', '60%', '60%', '0%']);
  const visualLeft = useTransform(progress, [0.16, 0.30, 0.70, 0.84], ['43%', '0%', '0%', '43%']);

  // Apply the position animation only on desktop. On mobile we stack vertically.
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const m = window.matchMedia('(min-width: 768px)');
    setIsDesktop(m.matches);
    const onChange = (e) => setIsDesktop(e.matches);
    m.addEventListener('change', onChange);
    return () => m.removeEventListener('change', onChange);
  }, []);

  return (
    <section ref={sectionRef} className="relative" style={{ height: '1000vh', backgroundColor: PAPER }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden grid grid-rows-[auto_1fr]">
        {/* Title row */}
        <div className="pt-24 md:pt-28 px-6 md:px-[4vw]">
          <div className="max-w-[1500px] mx-auto">
            <h2
              className="font-extrabold leading-tight"
              style={{ color: INK, fontSize: 'clamp(1.75rem, 3.4vw, 3rem)' }}
            >
              What{' '}
              <span style={{ fontFamily: 'var(--font-hand)', color: ACCENT, fontSize: '1.15em' }}>
                true*
              </span>{' '}
              means.
            </h2>
          </div>
        </div>

        {/* Content row — vertically centered */}
        <div className="px-6 md:px-[4vw] pt-6 md:pt-0 pb-6 md:pb-10 flex items-stretch md:items-center min-h-0 overflow-hidden">
          <div className="max-w-[1500px] mx-auto w-full h-full md:h-auto flex flex-col md:block gap-4 md:gap-0 relative md:min-h-[60vh]">
            {/* TEXT — mobile: top of stack, desktop: absolute with animated left */}
            <motion.div
              className="relative h-[26vh] md:h-full md:absolute md:top-0 md:w-[40%] flex-shrink-0"
              style={isDesktop ? { left: textLeft } : undefined}
            >
              <Caption
                opacity={cap1}
                titleParts={[{ text: 'True means ' }, { text: 'rethinking', hand: true }, { text: ' what’s possible in the AI era.' }]}
                body="We start by understanding what makes your business specific. From there we translate that into the digital landscape and rethink what's possible — what AI unlocks for your particular workflows, what's worth building, and what wasn't on the table a year ago."
              />
              <Caption
                opacity={cap2}
                titleParts={[{ text: 'True means ' }, { text: 'specialized solutions', hand: true }, { text: ' built for how you actually work.' }]}
                body="Custom platforms, dashboards, internal tools — shaped around your specific workflows. AI changed what bespoke software costs, so the build that used to take quarters and millions now ships in weeks."
              />
              <Caption
                opacity={cap3}
                titleParts={[{ text: 'True means ' }, { text: 'seamless integration', hand: true }, { text: ' with the tools you already use.' }]}
                body="Slack, Google, Microsoft, Claude, ChatGPT — your stack stays where it is. On top, we build the AI-native layer that lets everything share context, talk to each other, and act as one coherent system."
              />
            </motion.div>

            {/* VISUAL — mobile: bottom of stack (flex-grow), desktop: absolute with animated left */}
            <motion.div
              className="relative w-full flex-1 md:h-full md:absolute md:top-0 md:w-[57%] overflow-hidden min-h-0"
              style={isDesktop ? { left: visualLeft } : undefined}
            >
              {/* Phase 1: astronaut video, scrubbed by scroll. Wrapped in flex parent so the
                  video element sizes to its content (no letterbox bars). */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center px-2"
                style={{ opacity: phase1Op }}
              >
                <video
                  ref={astronautRef}
                  src="/videos/astronaut-scrub.mp4"
                  muted
                  playsInline
                  preload="auto"
                  style={{ visibility: astronautReady ? 'visible' : 'hidden' }}
                  className="w-full h-full object-contain select-none"
                />
              </motion.div>

              {/* Phase 2: 3 panels in a horizontal row, panning sideways with scroll */}
              <motion.div
                className="absolute inset-0 overflow-hidden"
                style={{ opacity: phase2Op }}
              >
                <motion.div
                  className="flex h-full"
                  style={{ width: '300%', x: panX }}
                >
                  <Panel src="/screens/screen1.png" />
                  <Panel src="/screens/screen2.png" />
                  <Panel src="/screens/screen3.png" />
                </motion.div>
              </motion.div>

              {/* Phase 3: flying logos */}
              <motion.div className="absolute inset-0" style={{ opacity: phase3Op }}>
                <FlyingLogo src="/logos/slack.png"     name="Slack"     x={slackX}     y={slackY} />
                <FlyingLogo src="/logos/google.png"    name="Google"    x={googleX}    y={googleY} />
                <FlyingLogo src="/logos/chatgpt.png"   name="ChatGPT"   x={chatgptX}   y={chatgptY} />
                <FlyingLogo src="/logos/microsoft.png" name="Microsoft" x={microsoftX} y={microsoftY} />
                <FlyingLogo src="/logos/claude.png"    name="Claude"    x={claudeX}    y={claudeY} />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Panel({ src }) {
  return (
    <div className="relative h-full" style={{ width: 'calc(100% / 3)', flexShrink: 0 }}>
      <img
        src={src}
        alt=""
        draggable={false}
        className="absolute inset-0 m-auto max-w-full max-h-full w-auto h-auto object-contain select-none"
      />
    </div>
  );
}

function FlyingLogo({ src, name, x, y }) {
  return (
    <motion.img
      src={src}
      alt={name}
      draggable={false}
      className="absolute select-none pointer-events-none"
      style={{
        left: x,
        top: y,
        width: '20%',
        height: 'auto',
      }}
    />
  );
}

function Caption({ opacity, titleParts, body }) {
  return (
    <motion.div className="absolute inset-0" style={{ opacity }}>
      <h3
        className="font-extrabold leading-tight"
        style={{ color: INK, fontSize: 'clamp(1.5rem, 2.8vw, 2.5rem)' }}
      >
        {titleParts.map((p, i) =>
          p.hand ? (
            <span
              key={i}
              style={{
                fontFamily: 'var(--font-hand)',
                fontWeight: 700,
                color: ACCENT,
                fontSize: '1.15em',
              }}
            >
              {p.text}
            </span>
          ) : (
            <span key={i}>{p.text}</span>
          )
        )}
      </h3>
      <p
        className="mt-4 leading-relaxed"
        style={{
          color: INK,
          opacity: 0.75,
          fontSize: 'clamp(0.95rem, 1.05vw, 1.1rem)',
          maxWidth: '52ch',
        }}
      >
        {body}
      </p>
    </motion.div>
  );
}
