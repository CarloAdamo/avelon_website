import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Container from '../ui/Container';

const cases = [
  {
    title: 'E-handel Automation',
    subtitle: 'AI-agenter för orderhantering',
    image: 'https://images.unsplash.com/photo-1557821552-17105176677c?w=800&h=1000&fit=crop',
  },
  {
    title: 'Nordic Tech Startup',
    subtitle: 'Airtable CRM & Sales Pipeline',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=1000&fit=crop',
  },
  {
    title: 'Produktionsbolag',
    subtitle: 'Real-time Dashboard & Analytics',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=1000&fit=crop',
  },
];

export default function CaseStudies() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="cases" className="relative py-32 md:py-48 bg-black">
      <Container>
        {/* Title */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-bold text-white">
            Customer Stories
          </h2>
        </motion.div>

        {/* Cases Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {cases.map((caseStudy, index) => (
            <motion.a
              key={index}
              href="#"
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="group relative aspect-[3/4] overflow-hidden"
            >
              {/* Image */}
              <img
                src={caseStudy.image}
                alt={caseStudy.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />

              {/* Dark overlay */}
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-300" />

              {/* Grid overlay */}
              <div className="absolute inset-0 grid-bg opacity-30" />

              {/* Content */}
              <div className="absolute inset-0 p-8 flex flex-col justify-end">
                <h3 className="text-2xl font-bold text-white mb-2">
                  {caseStudy.title}
                </h3>
                <p className="text-white/70 text-sm">
                  {caseStudy.subtitle}
                </p>
              </div>
            </motion.a>
          ))}
        </div>
      </Container>
    </section>
  );
}
