import Scene from '../Scene';
import Bubble from '../Bubble';
import Caption from '../Caption';
import Hand from '../Hand';
import Actor from '../Actor';
import Camera from '../Camera';
import ScrubVideo from '../ScrubVideo';
import useIsDesktop from '../useIsDesktop';
import { Paper, Backdrop } from '../Backdrop';
import SystemBoxes from '../SystemBoxes';
import { A, V, OFFICE } from '../assets';
import { CLIP_FIT } from '../constants';
import { SCENES } from './windows';

const { L, WINDOWS } = SCENES.connect;

// Mobile: both bubbles use slot 1 (they never overlap in time) so the caption at slot 2 stays clear of them.
function Lines({ progress }) {
  const bubble = (key, slot) => (progress
    ? { progress, window: WINDOWS[key], anchor: { desktop: { left: '52%', top: '10.5%', tail: 'left' }, mobile: { slot } } }
    : { static: true });
  return (
    <>
      <Bubble speaker="guide" {...bubble('have', 1)}>Start with what you <Hand>have</Hand>.</Bubble>
      <Bubble speaker="guide" {...bubble('connect', 1)}>We connect it, and we know where every <Hand>line</Hand> goes.</Bubble>
      <Caption {...(progress ? { progress, window: WINDOWS.connect, anchor: { left: '55%', top: '31%', maxWidth: 'min(40ch, 18vw)' } } : { static: true })}>
        Every line documented. You always know where your data goes.
      </Caption>
    </>
  );
}

function Static() {
  return (
    <>
      <div className="relative" style={{ height: '60svh' }}>
        <Paper />
        <Camera>
          <Backdrop {...OFFICE} />
          <SystemBoxes static showNew={null} />
          <Actor static={{ src: `${A}/max-stack-stand.webp`, left: '30%' }} alt="Max, holding the stack" />
          <Actor static={{ src: `${A}/guide-point.webp`, left: '44%' }} alt="The guide, pointing" />
        </Camera>
      </div>
      <Lines />
    </>
  );
}

export default function Connect({ reduced }) {
  return (
    <Scene id="connect" length={L} reduced={reduced} staticContent={<Static />}>
      {(progress) => <Stage progress={progress} />}
    </Scene>
  );
}

// Desktop: the walk-in is a clip (empty office → both characters at their marks), scrubbed over the first
// quarter of the scene and held on its last frame while the boxes appear and connect on top of it. The clip
// was captured from this camera, so with CLIP_FIT its last frame is the composition the next scene starts from.
// Mobile: no clip; the cutouts stand at their marks from the start.
function Stage({ progress }) {
  const isDesktop = useIsDesktop();
  return (
    <>
      <Paper />
      <Camera>
        <Backdrop {...OFFICE} />
        {isDesktop
          ? <ScrubVideo progress={progress} window={[0, 0.25]} src={`${V}/office-arrives.mp4`} poster={`${V}/office-arrives.webp`}
              className="absolute inset-0 w-full h-full object-cover" style={CLIP_FIT} />
          : (
            <>
              <Actor progress={progress} alt="Max" sequence={[{ from: 0, src: `${A}/max-stack-stand.webp` }]} x={[[0, 1], ['26%', '26%']]} />
              <Actor progress={progress} alt="The guide" sequence={[{ from: 0, src: `${A}/guide-point.webp` }]} x={[[0, 1], ['72%', '72%']]} />
            </>
          )}
        <SystemBoxes progress={progress} appear={[0.26, 0.50]} connect={[0.58, 0.90]} showNew={null} />
      </Camera>
      <Lines progress={progress} />
    </>
  );
}
