import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import Container from '../ui/Container';
import { useCalendly } from '../../context/CalendlyContext';

export default function Hero() {
  const ref = useRef(null);
  const videoRef = useRef(null);
  const { openCalendly } = useCalendly();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section ref={ref} className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#050508]">
      {/* Video background */}
      <div className="absolute inset-0 w-full h-full">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover object-[70%_center] md:object-center"
          style={{ filter: 'brightness(0.8)' }}
        >
          <source src="/space-bg.mp4" type="video/mp4" />
        </video>
        {/* Overlay gradient for better text readability */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to right, rgba(5,5,8,0.7) 0%, rgba(5,5,8,0.3) 50%, rgba(5,5,8,0.5) 100%)',
          }}
        />
      </div>

      {/* Vignette for depth */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 70% 70% at 50% 50%, transparent 0%, rgba(5,5,8,0.6) 100%)',
        }}
      />

      <Container className="relative z-10">
        <motion.div
          className="max-w-4xl"
          style={{ opacity }}
        >
          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="text-6xl md:text-8xl font-extrabold text-white mb-8 leading-tight"
          >
            Modern IT for{' '}
            <br />
            <motion.span
              className="text-[#6B5B95] inline-block"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            >
              the AI era
            </motion.span>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.1 }}
            >
              .
            </motion.span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
            className="text-xl md:text-2xl text-white mb-12 max-w-3xl leading-relaxed"
          >
            AI has leveled the playing field. We help businesses unlock capabilities
            that were once reserved for the few. Automating work, building custom tools,
            and scaling smarter.
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <button
              onClick={openCalendly}
              className="group inline-flex items-center text-white/90 hover:text-[#6B5B95] transition-colors duration-300 text-lg"
            >
              <span className="mr-3">Get in touch</span>
              <motion.svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </motion.svg>
            </button>
          </motion.div>
        </motion.div>
      </Container>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-6 h-10 border border-white/20 rounded-full flex items-start justify-center p-2"
        >
          <motion.div
            animate={{
              y: [0, 8, 0],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-1 h-2 bg-white/40 rounded-full"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
