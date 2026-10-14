import Scene from '../Scene';
import Bubble from '../Bubble';
import Hand from '../Hand';
import Actor from '../Actor';
import ScrubVideo from '../ScrubVideo';
import Camera from '../Camera';
import useIsDesktop from '../useIsDesktop';
import { Paper } from '../Backdrop';
import { A, V } from '../assets';
import { SCENES } from './windows';

const { L, WINDOWS } = SCENES.question;

// Soft edges so the clip's cream blends into the paper (same mask as the title card).
const EDGE_MASK = 'linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 4%, black 96%, transparent 100%)';
const MASK = { maskImage: EDGE_MASK, WebkitMaskImage: EDGE_MASK, maskComposite: 'intersect', WebkitMaskComposite: 'source-in' };

function Lines({ progress }) {
  const anchors = progress
    ? { max1: { desktop: { left: '8%', top: '12%' }, mobile: { slot: 1 } }, max2: { desktop: { left: '8%', top: '12%' }, mobile: { slot: 1 } }, guide: { desktop: { left: '54%', top: '14%' }, mobile: { slot: 2 } } }
    : {};
  const common = (key) => (progress ? { progress, window: WINDOWS[key], anchor: anchors[key] } : { static: true });
  return (
    <>
      <Bubble speaker="max" {...common('max1')}>
        It used to be Microsoft and a printer. Now it's Microsoft, Slack, HubSpot, Notion, ChatGPT, Claude. All of it has AI. All of it wants to <Hand>connect</Hand>.
      </Bubble>
      <Bubble speaker="max" {...common('max2')}>
        And nobody here knows where the data actually <Hand>goes</Hand>.
      </Bubble>
      <Bubble speaker="guide" {...common('guide')}>
        That's the <Hand>job</Hand> now. Walk with me.
      </Bubble>
    </>
  );
}

function Static() {
  return (
    <>
      <div className="relative" style={{ height: '60svh' }}>
        <Paper />
        <Actor static={{ src: `${A}/max-stack-stand.webp`, left: '30%' }} alt="Max, holding a wobbling stack of papers" />
        <Actor static={{ src: `${A}/guide-wave.webp`, left: '70%' }} alt="The guide, waving" />
      </div>
      <Lines />
    </>
  );
}

export default function Question({ reduced }) {
  return (
    <Scene id="question" length={L} reduced={reduced} staticContent={<Static />}>
      {(progress) => <Stage progress={progress} />}
    </Scene>
  );
}

// The whole scene is one clip (Max waits with the stack, the guide walks in, waves and settles), scrubbed
// over the first two bubbles and held on its last frame for the third. Desktop: 16:9 camera, contain-fitted.
// Mobile: the clip sits in a full-width band at the bottom, cropped to 4:3 (both characters stay inside the
// crop), the bubbles stack above it.
function Stage({ progress }) {
  const isDesktop = useIsDesktop();
  const video = (
    <ScrubVideo progress={progress} window={[0.02, 0.62]}
      src={`${V}/guide-arrives.mp4`} srcMobile={`${V}/guide-arrives-mobile.mp4`} poster={`${V}/guide-arrives.webp`}
      className="w-full object-cover" style={isDesktop ? { ...MASK, position: 'absolute', inset: 0, height: '100%' } : { ...MASK, height: 'auto', aspectRatio: '4 / 3' }} />
  );
  return (
    <>
      <Paper />
      {isDesktop
        ? <Camera>{video}</Camera>
        : <div className="absolute inset-0 flex justify-center items-end pb-4">{video}</div>}
      <Lines progress={progress} />
    </>
  );
}
