import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Container from '../ui/Container';

const services = [
  { name: 'Airtable & No-Code', delay: 0.1 },
  { name: 'AI-Agenter & Automation', delay: 0.2 },
  { name: 'Custom App Development', delay: 0.3 },
  { name: 'Modern Tech Consulting', delay: 0.4 },
];

export default function Services() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="services" className="relative py-32 md:py-48 bg-black overflow-hidden">
      {/* Grid background */}
      <div className="absolute inset-0 grid-bg opacity-50" />

      <Container>
        <div className="grid md:grid-cols-2 gap-16 items-start">
          {/* Left: Title */}
          <motion.div
            ref={ref}
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl md:text-6xl font-bold text-white">
              Offering
            </h2>
          </motion.div>

          {/* Right: Services list */}
          <div className="space-y-0">
            {services.map((service, index) => (
              <motion.div
                key={service.name}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: service.delay }}
                className="group"
              >
                <a
                  href="#"
                  className="block py-8 border-t border-white/10 hover:border-[#8cbdc3]/50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-2xl md:text-3xl font-light text-white group-hover:text-[#8cbdc3] transition-colors">
                      {service.name}
                    </span>
                    <svg
                      className="w-6 h-6 text-white/40 group-hover:text-[#8cbdc3] group-hover:translate-x-2 transition-all"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </a>
              </motion.div>
            ))}

            {/* Bottom border */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="border-t border-white/10 pt-8"
            />

            {/* End-to-end text (rotated) */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="absolute right-0 bottom-16 origin-bottom-right"
            >
              <span className="text-[#c9a961] text-sm tracking-widest rotate-90 inline-block">
                End-to-end
              </span>
            </motion.div>
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mt-16 text-right"
        >
          <a
            href="#contact"
            className="group inline-flex items-center text-white/80 hover:text-white transition-colors text-lg"
          >
            <span className="mr-2">Get in touch</span>
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </motion.div>
      </Container>
    </section>
  );
}
