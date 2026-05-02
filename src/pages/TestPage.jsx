import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';
import SplineScene from '../components/ui/SplineScene';
import Spotlight from '../components/ui/Spotlight';
import ShimmerText from '../components/ui/ShimmerText';

/* ─── Process Steps ─── */
const processSteps = [
  {
    number: '01',
    title: 'We listen',
    description:
      'You tell us what\'s frustrating. What takes too long. What falls through the cracks. Maybe it\'s spreadsheets. Maybe it\'s a process that should take minutes but takes days.',
    image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&h=600&fit=crop',
  },
  {
    number: '02',
    title: 'We map',
    description:
      'We look at how your team actually works today. The tools, the workarounds, the manual steps nobody questions anymore.',
    image: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&h=600&fit=crop',
  },
  {
    number: '03',
    title: 'We rethink',
    description:
      'We show you what\'s possible now that wasn\'t before. Not a slide deck — a clear picture of what could change and why it matters.',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop',
  },
  {
    number: '04',
    title: 'We build & ship',
    description:
      'You get a working solution. Tailored to your team, not a generic tool. We stay with you until it\'s part of how you work.',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop',
  },
];

const PROCESS_STEP_DURATION = 6000;

function ProcessSection() {
  const [activeStep, setActiveStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Stop when last step is done
    if (activeStep >= processSteps.length - 1 && progress >= 100) return;

    const timer = setTimeout(() => {
      if (activeStep < processSteps.length - 1) {
        setActiveStep(activeStep + 1);
        setProgress(0);
      } else {
        setProgress(100);
      }
    }, PROCESS_STEP_DURATION);

    return () => clearTimeout(timer);
  }, [activeStep]);

  // Animate progress bar
  useEffect(() => {
    setProgress(0);
    const start = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const pct = Math.min((elapsed / PROCESS_STEP_DURATION) * 100, 100);
      setProgress(pct);
      if (pct >= 100) clearInterval(interval);
    }, 50);
    return () => clearInterval(interval);
  }, [activeStep]);

  const handleStepClick = (index) => {
    setActiveStep(index);
    setProgress(0);
  };

  return (
    <section className="w-full py-20 md:py-32 px-6 md:px-12 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[#6B5B95] text-sm font-medium tracking-wider uppercase mb-4"
          >
            How we work
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
          >
            We start with what slows you down
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-gray-500 max-w-2xl mx-auto"
          >
            Maybe your team spends days in spreadsheets every month. Maybe your customers deserve
            a better experience than email and PDF. Whatever it is — we figure out what's possible now, and make it real.
          </motion.p>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Left: Steps */}
          <div className="flex flex-col gap-2">
            {processSteps.map((step, index) => {
              const isActive = activeStep === index;
              const isCompleted = index < activeStep;

              return (
                <motion.button
                  key={step.number}
                  onClick={() => handleStepClick(index)}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative text-left p-6 rounded-xl transition-all duration-300 ${
                    isActive
                      ? 'bg-white shadow-lg shadow-gray-200/50 border border-gray-200'
                      : 'bg-transparent hover:bg-white/50 border border-transparent'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Step number */}
                    <div
                      className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-colors duration-300 ${
                        isActive
                          ? 'bg-[#6B5B95] text-white'
                          : isCompleted
                          ? 'bg-[#6B5B95]/20 text-[#6B5B95]'
                          : 'bg-gray-200 text-gray-400'
                      }`}
                    >
                      {isCompleted ? (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        step.number
                      )}
                    </div>

                    <div className="flex-1">
                      <h3
                        className={`text-xl font-semibold mb-1 transition-colors duration-300 ${
                          isActive ? 'text-gray-900' : 'text-gray-400'
                        }`}
                      >
                        {step.title}
                      </h3>

                      <AnimatePresence mode="wait">
                        {isActive && (
                          <motion.p
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                            className="text-gray-500 text-sm leading-relaxed"
                          >
                            {step.description}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Progress bar */}
                  {isActive && (
                    <div className="absolute bottom-0 left-6 right-6 h-[2px] bg-gray-200 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-[#6B5B95] rounded-full"
                        style={{ width: `${progress}%` }}
                        transition={{ duration: 0.1, ease: 'linear' }}
                      />
                    </div>
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Right: Image */}
          <div className="flex items-center">
            <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100 border border-gray-200">
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeStep}
                  src={processSteps[activeStep].image}
                  alt={processSteps[activeStep].title}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Case Studies Data ─── */
const caseStudies = [
  {
    id: '01',
    title: 'Odd Music',
    before: 'Spreadsheets, shared folders, endless email threads. A small team drowning in admin.',
    after: 'One platform runs their entire operation. The team now focuses on music, not logistics.',
    result: '"This is worth millions."',
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&h=600&fit=crop',
  },
  {
    id: '02',
    title: 'Medtech Company',
    before: 'Weeks spent manually reading hundreds of regulatory documents for each product.',
    after: 'Describe your product, get every applicable requirement in minutes.',
    result: 'Weeks → minutes.',
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=600&fit=crop',
  },
  {
    id: '03',
    title: 'Consumer Goods',
    before: 'Manually filling retailer Excel templates. Different formats, different units, every quarter.',
    after: 'Upload your data and the template. AI maps everything automatically.',
    result: 'No more formatting errors. No more dreading retailer season.',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=600&fit=crop',
  },
];

const AUTO_PLAY_DURATION = 8000;

/* ─── Before/After Case Studies ─── */
function CaseStudiesSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const handleNext = useCallback(() => {
    setDirection(1);
    setActiveIndex((prev) => (prev + 1) % caseStudies.length);
  }, []);

  const handlePrev = useCallback(() => {
    setDirection(-1);
    setActiveIndex((prev) => (prev - 1 + caseStudies.length) % caseStudies.length);
  }, []);

  const handleTabClick = useCallback((index) => {
    setDirection(index > activeIndex ? 1 : -1);
    setActiveIndex(index);
  }, [activeIndex]);

  useEffect(() => {
    if (isPaused) return;
    if (activeIndex >= caseStudies.length - 1) return;
    const timeout = setTimeout(handleNext, AUTO_PLAY_DURATION);
    return () => clearTimeout(timeout);
  }, [activeIndex, isPaused, handleNext]);

  const variants = {
    enter: (dir) => ({ y: dir > 0 ? '-100%' : '100%', opacity: 0 }),
    center: { zIndex: 1, y: 0, opacity: 1 },
    exit: (dir) => ({ zIndex: 0, y: dir > 0 ? '100%' : '-100%', opacity: 0 }),
  };

  const study = caseStudies[activeIndex];

  return (
    <section className="w-full py-20 md:py-32 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-[#6B5B95] text-sm font-medium tracking-wider uppercase mb-4"
        >
          Real results
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-5xl font-bold text-gray-900 mb-16"
        >
          Before & after
        </motion.h2>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
          {/* Left: Tab List */}
          <div className="lg:col-span-5">
            {caseStudies.map((s, index) => (
              <button
                key={s.id}
                onClick={() => handleTabClick(index)}
                className={`group relative flex items-start gap-4 py-6 md:py-8 border-t border-gray-200 w-full text-left transition-colors duration-300 ${
                  activeIndex === index ? 'text-gray-900' : 'text-gray-400'
                }`}
              >
                {/* Progress bar */}
                <div className="absolute left-[-16px] md:left-[-24px] top-0 bottom-0 w-[2px] bg-gray-200">
                  {activeIndex === index && (
                    <motion.div
                      className="absolute top-0 left-0 w-full bg-[#6B5B95] origin-top"
                      initial={{ height: '0%' }}
                      animate={{ height: isPaused ? undefined : '100%' }}
                      transition={{
                        duration: AUTO_PLAY_DURATION / 1000,
                        ease: 'linear',
                      }}
                      key={`progress-${activeIndex}`}
                    />
                  )}
                </div>

                <span className="text-[10px] font-medium opacity-50 mt-1">
                  /{s.id}
                </span>

                <div className="flex flex-col gap-2 flex-1">
                  <span className="text-2xl md:text-3xl font-normal">
                    {s.title}
                  </span>

                  <AnimatePresence mode="wait">
                    {activeIndex === index && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                        className="space-y-3"
                      >
                        <div>
                          <p className="text-red-400/80 text-xs font-medium uppercase tracking-wider mb-1">Before</p>
                          <p className="text-gray-500 text-sm leading-relaxed">{s.before}</p>
                        </div>
                        <div>
                          <p className="text-emerald-500/80 text-xs font-medium uppercase tracking-wider mb-1">After</p>
                          <p className="text-gray-700 text-sm leading-relaxed">{s.after}</p>
                        </div>
                        <p className="text-[#6B5B95] text-sm font-medium italic">
                          {s.result}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </button>
            ))}
          </div>

          {/* Right: Image Gallery */}
          <div className="lg:col-span-7 flex flex-col justify-end h-full">
            <div
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100 border border-gray-200">
                <AnimatePresence initial={false} custom={direction} mode="popLayout">
                  <motion.div
                    key={activeIndex}
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                      y: { type: 'spring', stiffness: 260, damping: 32 },
                      opacity: { duration: 0.4 },
                    }}
                    className="absolute inset-0 w-full h-full"
                  >
                    <img
                      src={study.image}
                      alt={study.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </motion.div>
                </AnimatePresence>

                {/* Navigation buttons */}
                <div className="absolute bottom-4 right-4 md:bottom-6 md:right-6 flex gap-2 z-20">
                  <button
                    onClick={handlePrev}
                    className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-md border border-gray-200 flex items-center justify-center hover:bg-white transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={handleNext}
                    className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-md border border-gray-200 flex items-center justify-center hover:bg-white transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Contact Section ─── */
function ContactSection() {
  return (
    <section id="contact" className="w-full py-20 md:py-32 px-6 md:px-12 bg-gray-50">
      <div className="max-w-3xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
        >
          Curious what's possible?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-lg md:text-xl text-gray-600 mb-10"
        >
          Tell us what takes your team too long. We'll tell you what's possible now.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <a
            href="mailto:hello@avelon.se"
            className="inline-flex items-center justify-center px-8 py-4 bg-gray-900 text-white rounded-lg text-lg font-medium hover:bg-gray-800 transition-colors"
          >
            Get in touch
          </a>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── Main Page ─── */
export default function TestPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* ── HERO ── */}
      {/* Mobile */}
      <div className="md:hidden">
        <section className="relative h-[70vh] w-full overflow-hidden">
          <div className="absolute inset-0">
            <SplineScene
              scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
              className="w-full h-full"
            />
          </div>
          <Spotlight className="-top-40 left-0" fill="#6B5B95" />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(to top, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 40%)',
            }}
          />
        </section>

        <div className="px-6 -mt-20 relative z-10 pb-16">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="text-4xl font-bold leading-tight text-gray-900"
          >
            Your{' '}
            <span className="text-[#6B5B95]">
              <ShimmerText delay={1}>digital partner</ShimmerText>
            </span>
            <br />
            for the AI era.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="mt-4 text-lg text-gray-500 leading-relaxed"
          >
            AI has leveled the playing field. We help small teams
            operate like they never thought possible.
          </motion.p>
          <motion.a
            href="#contact"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="inline-flex items-center mt-8 px-6 py-3 bg-gray-900 text-white rounded-lg text-base font-medium hover:bg-gray-800 transition-colors"
          >
            Tell us what takes too long
          </motion.a>
        </div>
      </div>

      {/* Desktop */}
      <div className="hidden md:block">
        <section className="relative h-screen w-full overflow-hidden">
          {/* Robot on right */}
          <div className="absolute inset-0 left-[30%]">
            <SplineScene
              scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
              className="w-full h-full"
            />
          </div>

          <Spotlight className="-top-40 left-60 -top-20" fill="#6B5B95" />

          {/* Gradient for text readability */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(to right, rgba(255,255,255,0.97) 0%, rgba(255,255,255,0.8) 35%, rgba(255,255,255,0) 55%)',
            }}
          />

          {/* Hero text */}
          <div className="relative z-10 flex items-center h-full max-w-7xl mx-auto px-12 pointer-events-none">
            <div className="max-w-xl">
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.3 }}
                className="text-5xl lg:text-7xl font-bold leading-tight text-gray-900"
              >
                Your{' '}
                <span className="text-[#6B5B95]">
                  <ShimmerText delay={1}>digital partner</ShimmerText>
                </span>
                <br />
                for the AI era.
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.6 }}
                className="mt-6 text-xl text-gray-500 max-w-lg leading-relaxed"
              >
                AI has leveled the playing field. We help small teams
                operate like they never thought possible.
              </motion.p>

              <motion.a
                href="#contact"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.9 }}
                className="inline-flex items-center mt-8 px-8 py-4 bg-gray-900 text-white rounded-lg text-lg font-medium hover:bg-gray-800 transition-colors pointer-events-auto"
              >
                Tell us what takes too long
              </motion.a>
            </div>
          </div>
        </section>
      </div>

      {/* ── PROCESS ── */}
      <ProcessSection />

      {/* ── CASE STUDIES ── */}
      <CaseStudiesSection />

      {/* ── CONTACT ── */}
      <ContactSection />
    </div>
  );
}
