import Scene from '../Scene';
import Bubble from '../Bubble';
import Hand from '../Hand';
import Actor from '../Actor';
import Caption from '../Caption';
import Camera from '../Camera';
import ScrubVideo from '../ScrubVideo';
import useIsDesktop from '../useIsDesktop';
import { Paper, Backdrop } from '../Backdrop';
import SystemBoxes from '../SystemBoxes';
import { A, V, OFFICE } from '../assets';
import { SCENES } from './windows';

const { L, WINDOWS } = SCENES.build;

// Seedance renders its clip slightly shrunk against the start frame. Measured with
// scripts/film/measure-clip.py: each of the seven boxes in the 1920×1080 capture (frame-build.png) is
// template-matched in the clip's first and last frames (upscaled to 1920×1080), and a per-axis line is
// fitted: content at 0.9869·x − 4.31px, 0.9699·y − 1.46px (residuals under 1.5px, identical first and
// last frame, so the clip does not drift). CLIP_FIT is the inverse, which maps the clip back onto the
// capture and so onto the live camera.
const CLIP_FIT = { transformOrigin: '0 0', transform: 'translate(0.228%, 0.139%) scale(1.0133, 1.0310)' };

function Static() {
  return (
    <>
      <div className="relative" style={{ height: '60svh' }}>
        <Paper />
        <Camera>
          <Backdrop {...OFFICE} />
          <SystemBoxes static showNew={0} />
          <Actor static={{ src: `${A}/guide-draw.webp`, left: '44%' }} alt="The guide, drawing" />
          <Actor static={{ src: `${A}/max-relieved.webp`, left: '30%' }} alt="Max, relieved" />
        </Camera>
      </div>
      <Bubble speaker="guide" static>And where something is missing, we <Hand>build</Hand> it.</Bubble>
      <Caption static>A portal, a dashboard, an internal tool. Usually in weeks.</Caption>
    </>
  );
}

export default function Build({ reduced }) {
  return (
    <Scene id="build" length={L} reduced={reduced} staticContent={<Static />}>
      {(progress) => <Stage progress={progress} />}
    </Scene>
  );
}

function Stage({ progress }) {
  const isDesktop = useIsDesktop();
  const fadeIn = isDesktop ? [[0.75, 0.85], [0, 1]] : undefined;
  const [maxX, guideX] = isDesktop ? ['30%', '44%'] : ['26%', '72%'];
  // Desktop: the clip was captured from the same 16:9 camera (/capture?scene=build), so inside the camera
  // its drawn boxes and characters coincide with the live layers at every viewport.
  return (
    <>
      <Paper />
      <Camera>
        <Backdrop {...OFFICE} />
        {isDesktop && (
          <ScrubVideo progress={progress} window={[0.05, 0.75]} opacity={[[0.75, 0.85], [1, 0]]}
            src={`${V}/guide-draws.mp4`} poster={`${V}/guide-draws.webp`}
            className="absolute inset-0 w-full h-full object-cover" style={{ ...CLIP_FIT, zIndex: 11 }} />
        )}
        <SystemBoxes progress={progress} appear={[0, 0.001]} connect={[0.001, 0.002]} showNew={0.75} />
        <Actor progress={progress} alt="The guide, drawing" sequence={[{ from: 0, src: `${A}/guide-draw.webp` }]} x={[[0, 1], [guideX, guideX]]} opacity={fadeIn} zIndex={12} />
        <Actor progress={progress} alt="Max" sequence={[{ from: 0, src: `${A}/max-neutral.webp` }, { from: 0.75, src: `${A}/max-relieved.webp` }]} x={[[0, 1], [maxX, maxX]]} opacity={fadeIn} zIndex={12} />
      </Camera>
      <Bubble speaker="guide" progress={progress} window={WINDOWS.build} anchor={{ desktop: { left: '52%', top: '10.5%', tail: 'left' }, mobile: { slot: 1 } }}>
        And where something is missing, we <Hand>build</Hand> it.
      </Bubble>
      <Caption progress={progress} window={WINDOWS.build} anchor={{ left: '55%', top: '31%', maxWidth: 'min(40ch, 18vw)' }}>
        A portal, a dashboard, an internal tool. Usually in weeks.
      </Caption>
    </>
  );
}
