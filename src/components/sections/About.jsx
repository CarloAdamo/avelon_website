import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Container from '../ui/Container';

export default function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" className="relative py-32 md:py-48 bg-black">
      {/* Grid background */}
      <div className="absolute inset-0 grid-bg opacity-30" />

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
              En ny typ av <span className="text-[#6B5B95]">IT-konsult</span>
            </h2>

            <div className="space-y-6 text-white/90 leading-relaxed">
              <p>
                Traditionella IT-konsulter hjälper med datorer, nätverk och telefoner.
                Vi går djupare. Vi transformerar hela arbetssättet med moderna verktyg
                som AI-agenter, no-code plattformar och intelligenta automatiseringar.
              </p>
              <p>
                Med Airtable bygger vi kraftfulla databaser. Med Make och n8n kopplar vi
                samman era system. Med AI skapar vi intelligenta agenter som automatiserar
                repetitivt arbete. Och med moderna utvecklingsverktyg bygger vi
                skräddarsydda appar på rekordtid.
              </p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mt-8"
            >
              <a
                href="#contact"
                className="group inline-flex items-center text-white/80 hover:text-white transition-colors text-lg"
              >
                <span className="mr-2">Låt oss prata</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
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
