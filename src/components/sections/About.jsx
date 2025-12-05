import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Container from '../ui/Container';
import { useCalendly } from '../../context/CalendlyContext';

export default function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { openCalendly } = useCalendly();

  return (
    <section id="about" className="relative py-32 md:py-48 bg-black">
      {/* Grid background */}
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />

      <Container>
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Left: Text */}
          <motion.div
            ref={ref}
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-8">
              A new kind of <span className="text-[#6B5B95]">digital partner</span>
            </h2>

            <div className="space-y-6 text-white/90 leading-relaxed">
              <p>
                Traditional IT consultants help with computers, networks, and phones.
                We go deeper. We transform the way you work with modern tools that
                automate tasks, connect your systems, and give you superpowers.
              </p>
              <p>
                We build powerful databases to organize your business. We connect your
                tools so data flows automatically. We create AI assistants that handle
                repetitive work. And we build custom apps when off-the-shelf just won't do.
              </p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mt-8"
            >
              <button
                onClick={openCalendly}
                className="group inline-flex items-center text-white/80 hover:text-white transition-colors text-lg"
              >
                <span className="mr-2">Let's talk</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </motion.div>
          </motion.div>

          {/* Right: Image */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="aspect-square overflow-hidden relative">
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&h=800&fit=crop"
                alt="Team member"
                className="w-full h-full object-cover"
              />
              {/* Grid overlay */}
              <div className="absolute inset-0 grid-bg opacity-40" />
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
