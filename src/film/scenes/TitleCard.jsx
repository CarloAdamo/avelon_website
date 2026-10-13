import { motion, useTransform } from 'framer-motion';
import Scene from '../Scene';
import Bubble from '../Bubble';
import Hand from '../Hand';
import ScrubVideo from '../ScrubVideo';
import { Paper } from '../Backdrop';
import { ramp } from '../math';
import { INK } from '../constants';
import { SCENES } from './windows';

const { L, WINDOWS } = SCENES.title;
const V = '/film/video';

function Headline() {
  return (
    <>
      <h1 className="font-extrabold leading-[1.05]" style={{ color: INK, fontSize: 'clamp(2rem, 4.2vw, 3.75rem)' }}>
        <span className="block">Your <Hand>true*</Hand></span>
        <span className="block">digital partner</span>
        <span className="block">for the AI era.</span>
      </h1>
      <p className="mt-4 md:mt-6 leading-relaxed hidden sm:block" style={{ color: INK, opacity: 0.7, fontSize: 'clamp(0.95rem, 1.05vw, 1.125rem)', maxWidth: '34ch' }}>
        AI has leveled the playing field. We help businesses use what was once reserved for the few.
      </p>
    </>
  );
}

function Static() {
  return (
    <>
      <div className="pt-24"><Headline /></div>
      <img src={`${V}/max-arrives.webp`} alt="Max arriving with a wobbling stack of papers" loading="eager" className="w-full mt-8" />
      <Bubble speaker="max" static>A little <Hand>help</Hand> here?</Bubble>
    </>
  );
}

export default function TitleCard({ reduced }) {
  return (
    <Scene id="title" length={L} reduced={reduced} staticContent={<Static />}>
      {(progress) => <Stage progress={progress} />}
    </Scene>
  );
}

function Stage({ progress }) {
  const headOpacity = useTransform(progress, (p) => 1 - ramp(0.85, 1, p));
  const headY = useTransform(progress, (p) => -40 * ramp(0.85, 1, p));
  const arrowOpacity = useTransform(progress, (p) => 1 - ramp(0.05, 0.12, p));
  return (
    <>
      <Paper />
      <div className="absolute inset-0 flex justify-center items-end pb-4 md:items-center md:justify-end md:pr-[6vw] md:pb-0">
        <ScrubVideo progress={progress} window={[0, 0.8]} loadPolicy="afterLoad"
          src={`${V}/max-arrives.mp4`} srcMobile={`${V}/max-arrives-mobile.mp4`} poster={`${V}/max-arrives.webp`}
          className="h-[52svh] md:h-[80svh] w-auto"
          style={{
            maskImage: 'linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 4%, black 96%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 4%, black 96%, transparent 100%)',
            maskComposite: 'intersect', WebkitMaskComposite: 'source-in',
          }} />
      </div>
      <motion.div className="absolute inset-x-0 top-24 md:top-0 md:bottom-0 z-10 pointer-events-none px-6 md:px-[6vw] md:flex md:items-center text-center md:text-left"
        style={{ opacity: headOpacity, y: headY }}>
        <div className="mx-auto md:mx-0" style={{ maxWidth: 'min(48vw, 720px)' }}><Headline /></div>
      </motion.div>
      <Bubble speaker="max" progress={progress} window={WINDOWS.hint} anchor={{ desktop: { left: '62%', top: '12%' }, mobile: { slot: 1 } }}>
        A little <Hand>help</Hand> here?
      </Bubble>
      <motion.div className="absolute bottom-8 left-1/2 -translate-x-1/2 pointer-events-none" style={{ opacity: arrowOpacity }}>
        <motion.svg animate={{ y: [0, 6, 0] }} transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          className="w-5 h-5" fill="none" stroke={INK} viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </motion.svg>
      </motion.div>
    </>
  );
}
