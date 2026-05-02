import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useRef, useState } from 'react';
import Container from '../ui/Container';

const PAPER = '#F3ECE1';
const INK = '#1f1a14';
const ACCENT = '#6B5B95';

const positions = [
  {
    id: 'digital-consultant',
    title: 'Digital Transformation Consultant',
    type: 'Full-time',
    location: 'Stockholm / Remote',
    description:
      'We are looking for an exceptional consultant to help our clients leverage AI and modern technology to transform their businesses.',
    requirements: [
      '3+ years at a top-tier consultancy or leading tech company',
      'Proven track record of delivering complex digital transformation projects',
      'Strong analytical skills and ability to translate business needs into technical solutions',
      'Experience with AI/ML, automation platforms, or modern development frameworks',
      'Excellent communication skills — you can explain complex concepts to any audience',
      "Entrepreneurial mindset — we're a small team making big impact",
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
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [expandedId, setExpandedId] = useState(null);

  return (
    <section
      id="career"
      className="relative py-24 md:py-36"
      style={{ backgroundColor: PAPER }}
    >
      <Container>
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="mb-12 md:mb-16 max-w-[1500px] mx-auto"
        >
          <h2
            className="font-extrabold leading-tight"
            style={{
              color: INK,
              fontSize: 'clamp(2.25rem, 4vw, 3.5rem)',
            }}
          >
            <span>Join the </span>
            <span
              style={{
                fontFamily: 'var(--font-hand)',
                color: ACCENT,
                fontSize: '1.15em',
                fontWeight: 700,
              }}
            >
              team
            </span>
            <span>.</span>
          </h2>
          <p
            className="mt-5 md:mt-6 leading-relaxed max-w-2xl"
            style={{
              color: INK,
              opacity: 0.7,
              fontSize: 'clamp(1rem, 1.05vw, 1.125rem)',
            }}
          >
            We're a small team shaping how businesses work in the AI era —
            selective by design. If that sounds like you, take a look.
          </p>
        </motion.div>

        <div className="space-y-6 max-w-[1500px] mx-auto">
          {positions.map((position, index) => {
            const isExpanded = expandedId === position.id;
            return (
              <motion.div
                key={position.id}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.6, delay: index * 0.12 }}
                className="transition-all"
                style={{
                  borderTop: '1px solid rgba(31, 26, 20, 0.15)',
                  borderBottom: '1px solid rgba(31, 26, 20, 0.15)',
                }}
              >
                {/* Header */}
                <div
                  onClick={() => setExpandedId(isExpanded ? null : position.id)}
                  className="py-8 md:py-10 cursor-pointer"
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 md:gap-6">
                    <div>
                      <h3
                        className="font-extrabold mb-3"
                        style={{
                          color: INK,
                          fontSize: 'clamp(1.5rem, 2vw, 2rem)',
                        }}
                      >
                        {position.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-3 text-sm">
                        <span
                          style={{
                            fontFamily: 'var(--font-hand)',
                            color: ACCENT,
                            fontSize: '1.15rem',
                            fontWeight: 600,
                          }}
                        >
                          {position.type}
                        </span>
                        <span style={{ color: INK, opacity: 0.3 }}>•</span>
                        <span style={{ color: INK, opacity: 0.7 }}>
                          {position.location}
                        </span>
                      </div>
                    </div>
                    <div
                      className="flex items-center"
                      style={{ color: ACCENT }}
                    >
                      <span
                        style={{
                          fontFamily: 'var(--font-hand)',
                          fontSize: '1.25rem',
                          fontWeight: 600,
                        }}
                      >
                        {isExpanded ? 'Close' : 'View role'}
                      </span>
                      <motion.svg
                        className="w-4 h-4 ml-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </motion.svg>
                    </div>
                  </div>
                </div>

                {/* Expandable */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.4, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="pb-10 md:pb-12">
                        <p
                          className="leading-relaxed mb-8 max-w-3xl"
                          style={{
                            color: INK,
                            opacity: 0.8,
                            fontSize: 'clamp(0.95rem, 1.05vw, 1.1rem)',
                          }}
                        >
                          {position.description}
                        </p>

                        <div className="grid md:grid-cols-2 gap-10 md:gap-14 mb-10">
                          <RequirementsList
                            label="What we're looking for"
                            items={position.requirements}
                          />
                          <RequirementsList
                            label="Nice to have"
                            items={position.nice}
                          />
                        </div>

                        <a
                          href="mailto:careers@avelon.ai"
                          className="inline-flex items-center px-7 py-3 transition-opacity hover:opacity-80"
                          style={{
                            backgroundColor: ACCENT,
                            color: '#fff',
                            fontFamily: 'var(--font-hand)',
                            fontSize: '1.3rem',
                            fontWeight: 700,
                          }}
                        >
                          Apply now
                          <svg
                            className="w-4 h-4 ml-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17 8l4 4m0 0l-4 4m4-4H3"
                            />
                          </svg>
                        </a>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-12 text-sm max-w-[1500px] mx-auto"
          style={{ color: INK, opacity: 0.6 }}
        >
          Don't see a role that fits? We're always interested in meeting
          exceptional people. Reach out at{' '}
          <a
            href="mailto:careers@avelon.ai"
            className="hover:underline"
            style={{
              color: ACCENT,
              fontFamily: 'var(--font-hand)',
              fontSize: '1.1rem',
              fontWeight: 600,
            }}
          >
            careers@avelon.ai
          </a>
          .
        </motion.p>
      </Container>
    </section>
  );
}

function RequirementsList({ label, items }) {
  return (
    <div>
      <h4
        style={{
          fontFamily: 'var(--font-hand)',
          color: ACCENT,
          fontSize: '1.4rem',
          fontWeight: 700,
          marginBottom: '1rem',
        }}
      >
        {label}
      </h4>
      <ul className="space-y-3">
        {items.map((item, i) => (
          <li
            key={i}
            className="leading-relaxed flex"
            style={{
              color: INK,
              opacity: 0.8,
              fontSize: '0.95rem',
            }}
          >
            <span style={{ color: ACCENT, marginRight: '0.75rem' }}>—</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
