import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import Container from '../ui/Container';
import { useCalendly } from '../../context/CalendlyContext';

export default function Hero() {
  const ref = useRef(null);
  const { openCalendly } = useCalendly();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section ref={ref} className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* Grid background */}
      <div className="absolute inset-0 grid-bg" />

      {/* Animated background on the right */}
      <div className="absolute right-0 top-0 w-2/3 h-full overflow-hidden pointer-events-none">
        {/* Floating animated shapes */}
        <motion.div
          className="absolute top-1/4 right-20 w-96 h-96 rounded-full bg-gradient-to-br from-[#8cbdc3]/30 to-[#c9a961]/20 blur-3xl"
          animate={{
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-1/2 right-40 w-64 h-64 rounded-full bg-gradient-to-br from-[#c9a961]/30 to-[#8cbdc3]/20 blur-3xl"
          animate={{
            y: [0, 30, 0],
            scale: [1, 0.8, 1],
            rotate: [0, -90, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
        <motion.div
          className="absolute top-1/3 right-10 w-72 h-72 rounded-full bg-gradient-to-br from-[#8cbdc3]/20 to-transparent blur-3xl"
          animate={{
            y: [0, 40, 0],
            x: [-20, 20, -20],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
        <div className="absolute inset-0 grid-bg opacity-30" />
      </div>

      <Container className="relative z-10">
        <motion.div
          className="max-w-4xl"
          style={{ opacity }}
        >
          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-6xl md:text-8xl font-extrabold text-white mb-8 leading-tight"
          >
            Modern IT för{' '}
            <br />
            <span className="text-[#c9a961]">AI-eran</span>.
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-white/70 mb-12 max-w-3xl leading-relaxed"
          >
            Vi hjälper SME-bolag att transformera sitt sätt att arbeta med AI-agenter,
            no-code verktyg och intelligenta automatiseringar. En helhets­leverantör
            för den digitala framtiden.
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <button
              onClick={openCalendly}
              className="group inline-flex items-center text-white/80 hover:text-white transition-colors text-lg"
            >
              <span className="mr-2">Get in touch</span>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </motion.div>
        </motion.div>
      </Container>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="w-6 h-10 border border-white/30 rounded-full flex items-start justify-center p-2"
        >
          <motion.div
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-1 h-3 bg-white/50 rounded-full"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
