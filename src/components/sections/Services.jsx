import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useRef, useState } from 'react';
import Container from '../ui/Container';

const services = [
  {
    id: 'enterprise',
    name: 'Enterprise systems made simple',
    delay: 0.1,
    description: 'In the past, you needed large IT budgets and developer teams to build systems that track customers, projects, and data. Now we can build the same powerful solutions in days instead of months - and you can customize them yourself over time. Perfect for managing everything from customer records to project planning.'
  },
  {
    id: 'ai',
    name: 'AI Agents & Automation',
    delay: 0.2,
    description: null
  },
  {
    id: 'apps',
    name: 'Custom App Development',
    delay: 0.3,
    description: null
  },
  {
    id: 'consulting',
    name: 'Modern Tech Consulting',
    delay: 0.4,
    description: null
  },
];

export default function Services() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [expandedId, setExpandedId] = useState(null);

  return (
    <section id="services" className="relative py-32 md:py-48 bg-black overflow-hidden">
      {/* Grid background */}
      <div className="absolute inset-0 grid-bg opacity-50 pointer-events-none" />

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
            {services.map((service) => {
              const isExpanded = expandedId === service.id;
              const hasDescription = Boolean(service.description);

              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.6, delay: service.delay }}
                >
                  <div
                    onClick={() => {
                      if (hasDescription) {
                        setExpandedId(isExpanded ? null : service.id);
                      }
                    }}
                    className={`py-8 border-t border-white/10 transition-colors ${
                      hasDescription
                        ? 'cursor-pointer hover:border-[#6B5B95]/50'
                        : 'cursor-default'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-2xl md:text-3xl font-light transition-colors ${
                          isExpanded
                            ? 'text-[#6B5B95]'
                            : hasDescription
                              ? 'text-white hover:text-[#6B5B95]'
                              : 'text-white'
                        }`}
                      >
                        {service.name}
                      </span>

                      {hasDescription ? (
                        <motion.svg
                          className={`w-6 h-6 transition-colors ${
                            isExpanded ? 'text-[#6B5B95]' : 'text-white/40'
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          animate={{ rotate: isExpanded ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                        </motion.svg>
                      ) : (
                        <svg
                          className="w-6 h-6 text-white/40"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      )}
                    </div>
                  </div>

                  {/* Expandable description */}
                  <AnimatePresence>
                    {isExpanded && service.description && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <p className="pb-8 text-white/70 leading-relaxed max-w-2xl">
                          {service.description}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}

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
              <span className="text-[#6B5B95] text-sm tracking-widest rotate-90 inline-block">
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
