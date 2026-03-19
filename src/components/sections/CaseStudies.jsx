import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useRef, useState } from 'react';
import Container from '../ui/Container';

const cases = [
  {
    id: 'music',
    title: 'Odd Music',
    subtitle: 'AI-powered music publishing platform',
    industry: 'Music & Entertainment',
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&h=1000&fit=crop',
    challenge: 'Everything lived in Google Drive and Dropbox — spreadsheets for royalties, shared folders for contracts, endless email threads to find basic information. A small team spending big hours on admin instead of music.',
    solution: 'We built their entire operating platform from scratch. At the center sits an AI agent that manages their catalog, generates press releases, and answers any question about their business instantly. The team chats directly with their documents, creates releases, and runs their publishing operation — all from one place.',
    result: 'A small team now runs like a major label. In the founder\'s words: "This is worth millions."',
  },
  {
    id: 'medtech',
    title: 'Medtech Compliance Platform',
    subtitle: 'Automated regulatory intelligence',
    industry: 'Healthcare & Medical Devices',
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=1000&fit=crop',
    challenge: 'Medical device companies face a maze of regulatory requirements. Teams spent weeks manually reading through hundreds of regulatory documents, trying to figure out which rules applied to their specific product. Miss something, and you risk delays, fines, or worse.',
    solution: 'We built an automated pipeline that ingests and structures regulatory documents from multiple sources. Using advanced AI with graph-based knowledge mapping, the system understands how requirements connect and apply to specific product types. Teams simply describe their product and get a clear view of exactly what compliance requirements apply.',
    result: 'What used to take weeks of expert analysis now takes minutes. Companies can confidently navigate regulatory requirements and get to market faster, with less risk of costly compliance gaps.',
  },
  {
    id: 'retail',
    title: 'Consumer Goods Company',
    subtitle: 'AI-powered retail data automation',
    industry: 'Consumer Goods & Retail',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=1000&fit=crop',
    challenge: 'Several times a year, the team had to manually fill in product data files for major retailers like Kicks and Apoteket. Each retailer has their own Excel format, their own column names, their own units. "Packaging in ml" in one file means "pack in cl" in their own system. Weeks of tedious, error-prone copy-paste work.',
    solution: 'We built a system where you upload your own product data and the retailer\'s template. An AI maps between the two — translating units, matching field names, and filling in the spreadsheet automatically without breaking the retailer\'s formatting.',
    result: 'Weeks of manual work reduced to minutes. No more formatting errors, no more missed fields, no more dreading retailer season.',
  },
];

function CaseCard({ caseStudy, index, isInView, isExpanded, onToggle }) {
  const hasDetails = Boolean(caseStudy.challenge);

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
        transition={{ duration: 0.6, delay: index * 0.15 }}
        onClick={() => hasDetails && onToggle()}
        className={`group relative aspect-[3/4] overflow-hidden ${hasDetails ? 'cursor-pointer' : 'cursor-default'}`}
      >
        {/* Image */}
        <img
          src={caseStudy.image}
          alt={caseStudy.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* Dark overlay */}
        <div className={`absolute inset-0 transition-colors duration-300 ${
          isExpanded ? 'bg-black/60' : 'bg-black/40 group-hover:bg-black/30'
        }`} />

        {/* Grid overlay */}
        <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />

        {/* Border when expanded */}
        {isExpanded && (
          <div className="absolute inset-0 border-2 border-[#6B5B95] pointer-events-none" />
        )}

        {/* Content */}
        <div className="absolute inset-0 p-8 flex flex-col justify-end">
          <p className="text-[#A78BFA] text-sm mb-2">{caseStudy.industry}</p>
          <h3 className="text-2xl font-bold text-white mb-2">
            {caseStudy.title}
          </h3>
          <p className="text-white/70 text-sm">
            {caseStudy.subtitle}
          </p>
          {hasDetails && (
            <p className="text-white/50 text-sm mt-4 flex items-center">
              <span>{isExpanded ? 'Close' : 'Read story'}</span>
              <motion.svg
                className="w-4 h-4 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
              </motion.svg>
            </p>
          )}
        </div>
      </motion.div>

      {/* Mobile: Expanded content directly below each card */}
      <AnimatePresence>
        {isExpanded && caseStudy.challenge && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            className="overflow-hidden md:hidden"
          >
            <div className="bg-[#0a0a0a] border border-white/10 border-t-0 p-6">
              <div className="space-y-6">
                <div>
                  <h4 className="text-[#A78BFA] text-sm font-semibold mb-2 uppercase tracking-wider">The Challenge</h4>
                  <p className="text-white/80 text-sm leading-relaxed">{caseStudy.challenge}</p>
                </div>
                <div>
                  <h4 className="text-[#A78BFA] text-sm font-semibold mb-2 uppercase tracking-wider">The Solution</h4>
                  <p className="text-white/80 text-sm leading-relaxed">{caseStudy.solution}</p>
                </div>
                <div>
                  <h4 className="text-[#A78BFA] text-sm font-semibold mb-2 uppercase tracking-wider">The Result</h4>
                  <p className="text-white/80 text-sm leading-relaxed">{caseStudy.result}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function CaseStudies() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [expandedId, setExpandedId] = useState(null);

  const expandedCase = cases.find(c => c.id === expandedId);

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
            <CaseCard
              key={caseStudy.id}
              caseStudy={caseStudy}
              index={index}
              isInView={isInView}
              isExpanded={expandedId === caseStudy.id}
              onToggle={() => setExpandedId(expandedId === caseStudy.id ? null : caseStudy.id)}
            />
          ))}
        </div>

        {/* Desktop: Expanded Content - Below the grid */}
        <AnimatePresence>
          {expandedCase && expandedCase.challenge && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              className="overflow-hidden hidden md:block"
            >
              <div className="bg-[#0a0a0a] border border-white/10 mt-8 p-8 md:p-12">
                <div className="grid md:grid-cols-3 gap-8 md:gap-12">
                  <div>
                    <h4 className="text-[#A78BFA] text-sm font-semibold mb-3 uppercase tracking-wider">The Challenge</h4>
                    <p className="text-white/80 leading-relaxed">{expandedCase.challenge}</p>
                  </div>
                  <div>
                    <h4 className="text-[#A78BFA] text-sm font-semibold mb-3 uppercase tracking-wider">The Solution</h4>
                    <p className="text-white/80 leading-relaxed">{expandedCase.solution}</p>
                  </div>
                  <div>
                    <h4 className="text-[#A78BFA] text-sm font-semibold mb-3 uppercase tracking-wider">The Result</h4>
                    <p className="text-white/80 leading-relaxed">{expandedCase.result}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Container>
    </section>
  );
}
