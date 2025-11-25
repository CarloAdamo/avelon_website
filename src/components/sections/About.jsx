import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Container from '../ui/Container';
import Button from '../ui/Button';
import { useCalendly } from '../../context/CalendlyContext';

const values = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: 'Innovation',
    description: 'Vi ligger alltid i framkant och testar de senaste verktygen för att ge er bästa möjliga lösning.'
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    title: 'Partnerskap',
    description: 'Vi ser oss som en förlängning av ert team, inte bara en extern leverantör.'
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'Resultat',
    description: 'Vi fokuserar på mätbara resultat och konkreta förbättringar för er verksamhet.'
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    title: 'Utbildning',
    description: 'Vi lär ut och empowerar ert team att själva kunna jobba med moderna verktyg.'
  }
];

const stats = [
  { value: '50+', label: 'Nöjda kunder' },
  { value: '200+', label: 'Projekt levererade' },
  { value: '95%', label: 'Kundnöjdhet' },
  { value: '24/7', label: 'Support' }
];

export default function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { openCalendly } = useCalendly();

  return (
    <section id="about" className="py-24 md:py-32 bg-gray-50">
      <Container>
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Om Avelon
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Vi är inte din vanliga IT-konsult. Vi är specialiserade på att hjälpa SME-företag
            navigera och implementera den senaste teknologin inom AI, automation och no-code.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20"
        >
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                {stat.value}
              </div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Main content */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="text-3xl font-bold text-gray-900 mb-6">
              En ny typ av IT-konsult för AI-eran
            </h3>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                Traditionella IT-konsulter hjälper med datorer, nätverk och telefoner.
                Vi går djupare. Vi hjälper er transformera hela arbetssättet med moderna
                verktyg som AI-agenter, no-code plattformar och intelligenta automatiseringar.
              </p>
              <p>
                Med Airtable bygger vi kraftfulla databaser. Med Make och n8n kopplar vi
                samman era system. Med AI skapar vi intelligenta agenter som automatiserar
                repetitivt arbete. Och med moderna utvecklingsverktyg som Claude Code och
                Lovable bygger vi skräddarsydda appar på rekordtid.
              </p>
              <p>
                Vi tror på att empowera våra kunder. Därför utbildar vi även ert team så
                att ni kan fortsätta utveckla och optimera era lösningar själva.
              </p>
            </div>
            <div className="mt-8">
              <Button onClick={openCalendly}>Låt oss prata om er utmaning</Button>
            </div>
          </motion.div>

          {/* Image placeholder */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative"
          >
            <div className="aspect-square rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=800&fit=crop"
                alt="Team collaboration"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Floating card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-lg"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <div className="font-bold text-gray-900">Certifierade</div>
                  <div className="text-sm text-gray-600">AI & Automation</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Values */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h3 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Våra värderingar
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 mb-4 rounded-xl bg-gray-900 text-white">
                  {value.icon}
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">
                  {value.title}
                </h4>
                <p className="text-gray-600 text-sm">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
