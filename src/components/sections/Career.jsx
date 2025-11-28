import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Container from '../ui/Container';

const positions = [
  {
    id: 'digital-consultant',
    title: 'Digital Transformation Consultant',
    type: 'Full-time',
    location: 'Stockholm / Remote',
    description: 'We are looking for an exceptional consultant to help our clients leverage AI and modern technology to transform their businesses.',
    requirements: [
      '3+ years at a top-tier consultancy or leading tech company',
      'Proven track record of delivering complex digital transformation projects',
      'Strong analytical skills and ability to translate business needs into technical solutions',
      'Experience with AI/ML, automation platforms, or modern development frameworks',
      'Excellent communication skills - you can explain complex concepts to any audience',
      'Entrepreneurial mindset - we\'re a small team making big impact',
    ],
    nice: [
      'Experience with no-code/low-code platforms (Airtable, Make, n8n)',
      'Background in building AI agents or automation workflows',
      'Previous startup experience',
    ],
  },
];

export default function Career() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="career" className="relative py-32 md:py-48 bg-[#0a0a0a]">
      <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" />

      <Container>
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Career
          </h2>
          <p className="text-white/70 text-xl max-w-2xl">
            Join a team that's shaping how businesses work in the AI era.
            We're selective because we believe in quality over quantity.
          </p>
        </motion.div>

        <div className="space-y-8">
          {positions.map((position, index) => (
            <motion.div
              key={position.id}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="border border-white/10 p-8 md:p-12 hover:border-[#6B5B95]/50 transition-colors"
            >
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-8">
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
                    {position.title}
                  </h3>
                  <div className="flex flex-wrap gap-4 text-sm">
                    <span className="text-[#A78BFA]">{position.type}</span>
                    <span className="text-white/50">|</span>
                    <span className="text-white/70">{position.location}</span>
                  </div>
                </div>
                <a
                  href="mailto:careers@avelon.ai"
                  className="inline-flex items-center px-6 py-3 border border-[#6B5B95] text-[#A78BFA] hover:bg-[#6B5B95]/20 transition-colors text-sm font-medium"
                >
                  Apply now
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </div>

              <p className="text-white/70 mb-8 leading-relaxed">
                {position.description}
              </p>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-[#A78BFA] text-sm font-semibold mb-4 uppercase tracking-wider">
                    What we're looking for
                  </h4>
                  <ul className="space-y-3">
                    {position.requirements.map((req, i) => (
                      <li key={i} className="text-white/70 text-sm leading-relaxed flex">
                        <span className="text-[#6B5B95] mr-3">—</span>
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-[#A78BFA] text-sm font-semibold mb-4 uppercase tracking-wider">
                    Nice to have
                  </h4>
                  <ul className="space-y-3">
                    {position.nice.map((item, i) => (
                      <li key={i} className="text-white/70 text-sm leading-relaxed flex">
                        <span className="text-[#6B5B95] mr-3">—</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-white/50 text-sm mt-12"
        >
          Don't see a role that fits? We're always interested in meeting exceptional people.
          Reach out at <a href="mailto:careers@avelon.ai" className="text-[#A78BFA] hover:underline">careers@avelon.ai</a>
        </motion.p>
      </Container>
    </section>
  );
}
