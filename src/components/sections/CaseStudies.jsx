import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import Container from '../ui/Container';

const cases = [
  {
    title: 'E-handel Automation',
    client: 'Nordic Fashion AB',
    category: 'Automation & AI',
    description: 'Implementerade AI-agenter för orderhantering och kundservice som reducerade manuellt arbete med 70%.',
    results: ['70% mindre manuellt arbete', '3x snabbare orderhantering', '95% kundnöjdhet'],
    tags: ['Make', 'AI Agents', 'Airtable'],
    image: 'https://images.unsplash.com/photo-1557821552-17105176677c?w=800&h=600&fit=crop',
  },
  {
    title: 'CRM & Sales Pipeline',
    client: 'TechStart Sweden',
    category: 'Custom Development',
    description: 'Byggde skräddarsydd CRM-lösning med Airtable och automatiska AI-notifikationer för säljteamet.',
    results: ['45% ökning i konvertering', 'Realtidsdata för ledning', 'Integrerat med befintliga system'],
    tags: ['Airtable', 'n8n', 'Custom App'],
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop',
  },
  {
    title: 'Produktion Dashboard',
    client: 'Industrial Solutions',
    category: 'Analytics & Reporting',
    description: 'Real-time produktionsdashboard med AI-prediktioner för underhåll och optimering.',
    results: ['20% effektivitetsökning', 'Förebyggande underhåll', 'Datadriven beslutsfattning'],
    tags: ['Custom App', 'AI', 'Data Pipeline'],
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
  },
];

function CaseCard({ caseStudy, index }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative overflow-hidden rounded-2xl bg-white shadow-sm hover:shadow-xl transition-shadow duration-300"
    >
      {/* Image */}
      <div className="relative h-64 overflow-hidden">
        <motion.img
          src={caseStudy.image}
          alt={caseStudy.title}
          className="w-full h-full object-cover"
          animate={{ scale: isHovered ? 1.1 : 1 }}
          transition={{ duration: 0.4 }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        {/* Category badge */}
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 text-xs font-medium bg-white/90 backdrop-blur-sm rounded-full">
            {caseStudy.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <p className="text-sm text-gray-500 mb-2">{caseStudy.client}</p>
        <h3 className="text-2xl font-bold text-gray-900 mb-3">
          {caseStudy.title}
        </h3>
        <p className="text-gray-600 mb-4 leading-relaxed">
          {caseStudy.description}
        </p>

        {/* Results */}
        <div className="mb-4 space-y-2">
          {caseStudy.results.map((result, i) => (
            <div key={i} className="flex items-start text-sm">
              <svg className="w-5 h-5 mr-2 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-gray-700">{result}</span>
            </div>
          ))}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {caseStudy.tags.map((tag, i) => (
            <span
              key={i}
              className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Hover indicator */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-gray-900 to-gray-600"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
}

export default function CaseStudies() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="cases" className="py-24 md:py-32 bg-white">
      <Container>
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Case Studies
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Se hur vi har hjälpt andra företag att transformera sina processer
            med modern teknologi och AI-driven automation.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cases.map((caseStudy, index) => (
            <CaseCard key={index} caseStudy={caseStudy} index={index} />
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mt-12"
        >
          <p className="text-gray-600 mb-4">Vill du se fler exempel?</p>
          <button className="text-gray-900 font-medium hover:underline">
            Kontakta oss för mer information →
          </button>
        </motion.div>
      </Container>
    </section>
  );
}
