import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useRef, useState } from 'react';
import Container from '../ui/Container';

const PAPER = '#F3ECE1';
const INK = '#1f1a14';
const ACCENT = '#6B5B95';

const cases = [
  {
    id: 'music',
    title: 'Odd Music',
    subtitle: 'AI-powered music publishing platform',
    industry: 'Music & Entertainment',
    image: '/cases/music.png',
    challenge: 'Everything lived in Google Drive and Dropbox — spreadsheets for royalties, shared folders for contracts, endless email threads to find basic information. A small team spending big hours on admin instead of music.',
    solution: 'We built their entire operating platform from scratch. At the center sits an AI agent that manages their catalog, generates press releases, and answers any question about their business instantly. The team chats directly with their documents, creates releases, and runs their publishing operation — all from one place.',
    result: 'A small team now runs like a major label. In the founder\'s words: "This is worth millions."',
  },
  {
    id: 'medtech',
    title: 'Medtech Compliance Platform',
    subtitle: 'Automated regulatory intelligence',
    industry: 'Healthcare & Medical Devices',
    image: '/cases/medtech.png',
    challenge: 'Medical device companies face a maze of regulatory requirements. Teams spent weeks manually reading through hundreds of regulatory documents, trying to figure out which rules applied to their specific product. Miss something, and you risk delays, fines, or worse.',
    solution: 'We built an automated pipeline that ingests and structures regulatory documents from multiple sources. Using advanced AI with graph-based knowledge mapping, the system understands how requirements connect and apply to specific product types. Teams simply describe their product and get a clear view of exactly what compliance requirements apply.',
    result: 'What used to take weeks of expert analysis now takes minutes. Companies can confidently navigate regulatory requirements and get to market faster, with less risk of costly compliance gaps.',
  },
  {
    id: 'retail',
    title: 'Consumer Goods Company',
    subtitle: 'AI-powered retail data automation',
    industry: 'Consumer Goods & Retail',
    image: '/cases/retail.png',
    challenge: 'Several times a year, the team had to manually fill in product data files for major retailers like Kicks and Apoteket. Each retailer has their own Excel format, their own column names, their own units. "Packaging in ml" in one file means "pack in cl" in their own system. Weeks of tedious, error-prone copy-paste work.',
    solution: 'We built a system where you upload your own product data and the retailer\'s template. An AI maps between the two — translating units, matching field names, and filling in the spreadsheet automatically without breaking the retailer\'s formatting.',
    result: 'Weeks of manual work reduced to minutes. No more formatting errors, no more missed fields, no more dreading retailer season.',
  },
];

function CaseCard({ caseStudy, index, isInView, isExpanded, onToggle }) {
  const hasDetails = Boolean(caseStudy.challenge);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6, delay: index * 0.12, ease: [0.25, 0.1, 0.25, 1] }}
      onClick={() => hasDetails && onToggle()}
      className={`group ${hasDetails ? 'cursor-pointer' : 'cursor-default'}`}
    >
      {/* Image — sits flush on the paper bg (no frame), light shadow for depth */}
      <div
        className="relative aspect-[3/2] overflow-hidden transition-shadow duration-300"
        style={{
          boxShadow: isExpanded
            ? '0 8px 30px rgba(31, 26, 20, 0.15), 0 0 0 2px #6B5B95'
            : '0 2px 12px rgba(31, 26, 20, 0.06)',
        }}
      >
        <img
          src={caseStudy.image}
          alt={caseStudy.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
        />
      </div>

      {/* Text content below image */}
      <div className="mt-5 md:mt-6">
        <p
          style={{
            fontFamily: 'var(--font-hand)',
            color: ACCENT,
            fontSize: '1.1rem',
            fontWeight: 600,
          }}
        >
          {caseStudy.industry}
        </p>
        <h3
          className="font-extrabold leading-tight mt-1"
          style={{
            color: INK,
            fontSize: 'clamp(1.4rem, 1.8vw, 1.75rem)',
          }}
        >
          {caseStudy.title}
        </h3>
        <p
          className="mt-2 leading-relaxed"
          style={{
            color: INK,
            opacity: 0.65,
            fontSize: '1rem',
          }}
        >
          {caseStudy.subtitle}
        </p>
        {hasDetails && (
          <div
            className="mt-4 flex items-center group/cta transition-opacity"
            style={{ color: ACCENT }}
          >
            <span
              style={{
                fontFamily: 'var(--font-hand)',
                fontSize: '1.25rem',
                fontWeight: 600,
              }}
            >
              {isExpanded ? 'Close' : 'Read the story'}
            </span>
            <motion.svg
              className="w-4 h-4 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </motion.svg>
          </div>
        )}
      </div>

      {/* Mobile: expanded content directly below the card */}
      <AnimatePresence>
        {isExpanded && hasDetails && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            className="overflow-hidden md:hidden"
          >
            <div
              className="mt-6 p-6 space-y-6"
              style={{
                backgroundColor: 'rgba(31, 26, 20, 0.04)',
                borderTop: `2px solid ${ACCENT}`,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <DetailBlock label="The challenge" body={caseStudy.challenge} />
              <DetailBlock label="What we built" body={caseStudy.solution} />
              <DetailBlock label="The result" body={caseStudy.result} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function DetailBlock({ label, body }) {
  return (
    <div>
      <h4
        style={{
          fontFamily: 'var(--font-hand)',
          color: ACCENT,
          fontSize: '1.4rem',
          fontWeight: 700,
          marginBottom: '0.5rem',
        }}
      >
        {label}
      </h4>
      <p
        className="leading-relaxed"
        style={{
          color: INK,
          opacity: 0.8,
          fontSize: '0.95rem',
        }}
      >
        {body}
      </p>
    </div>
  );
}

export default function CaseStudies() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [expandedId, setExpandedId] = useState(null);

  const expandedCase = cases.find((c) => c.id === expandedId);

  return (
    <section
      id="cases"
      className="relative py-24 md:py-36"
      style={{ backgroundColor: PAPER }}
    >
      <Container>
        {/* Title */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="mb-12 md:mb-20 max-w-[1500px] mx-auto"
        >
          <h2
            className="font-extrabold leading-tight"
            style={{
              color: INK,
              fontSize: 'clamp(2.25rem, 4vw, 3.5rem)',
            }}
          >
            <span>Real </span>
            <span
              style={{
                fontFamily: 'var(--font-hand)',
                color: ACCENT,
                fontSize: '1.15em',
                fontWeight: 700,
              }}
            >
              customer
            </span>
            <span> stories.</span>
          </h2>
          <p
            className="mt-5 md:mt-6 leading-relaxed max-w-2xl"
            style={{
              color: INK,
              opacity: 0.7,
              fontSize: 'clamp(1rem, 1.05vw, 1.125rem)',
            }}
          >
            A few of the companies we've worked with — what they were stuck on,
            what we built, and what changed.
          </p>
        </motion.div>

        {/* Cases grid */}
        <div className="grid md:grid-cols-3 gap-10 md:gap-12 max-w-[1500px] mx-auto">
          {cases.map((caseStudy, index) => (
            <CaseCard
              key={caseStudy.id}
              caseStudy={caseStudy}
              index={index}
              isInView={isInView}
              isExpanded={expandedId === caseStudy.id}
              onToggle={() =>
                setExpandedId(expandedId === caseStudy.id ? null : caseStudy.id)
              }
            />
          ))}
        </div>

        {/* Desktop: expanded content panel below the grid */}
        <AnimatePresence>
          {expandedCase && expandedCase.challenge && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.45, ease: 'easeInOut' }}
              className="overflow-hidden hidden md:block max-w-[1500px] mx-auto"
            >
              <div
                className="mt-12 p-10 md:p-14"
                style={{
                  borderTop: `2px solid ${ACCENT}`,
                  backgroundColor: 'rgba(31, 26, 20, 0.03)',
                }}
              >
                <div className="grid md:grid-cols-3 gap-10 md:gap-14">
                  <DetailBlock label="The challenge" body={expandedCase.challenge} />
                  <DetailBlock label="What we built" body={expandedCase.solution} />
                  <DetailBlock label="The result" body={expandedCase.result} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Container>
    </section>
  );
}
