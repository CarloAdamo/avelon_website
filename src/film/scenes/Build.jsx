import Scene from '../Scene';
import Bubble from '../Bubble';
import Hand from '../Hand';
import Actor from '../Actor';
import Caption from '../Caption';
import ScrubVideo from '../ScrubVideo';
import useIsDesktop from '../useIsDesktop';
import { Backdrop } from '../Backdrop';
import SystemBoxes from '../SystemBoxes';
import { SCENES } from './windows';

const { L, WINDOWS } = SCENES.build;
const A = '/film/actors';
const V = '/film/video';
const OFFICE = { src: '/film/backdrops/office.webp', srcMobile: '/film/backdrops/office-800.webp' };

function Static() {
  return (
    <>
      <div className="relative" style={{ height: '60svh' }}>
        <Backdrop {...OFFICE} />
        <SystemBoxes static showNew={0} />
        <Actor static={{ src: `${A}/guide-draw.webp`, left: '44%' }} alt="The guide, drawing" />
        <Actor static={{ src: `${A}/max-relieved.webp`, left: '30%' }} alt="Max, relieved" />
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
  return (
    <>
      <Backdrop {...OFFICE} />
      <SystemBoxes progress={progress} appear={[0, 0.001]} connect={[0.001, 0.002]} showNew={0.75} />
      {isDesktop && (
        <ScrubVideo progress={progress} window={[0.05, 0.75]} opacity={[[0.75, 0.85], [1, 0]]}
          src={`${V}/guide-draws.mp4`} poster={`${V}/guide-draws.webp`}
          className="absolute inset-0 w-full h-full object-cover" style={{ zIndex: 11 }} />
      )}
      <Actor progress={progress} alt="The guide, drawing" sequence={[{ from: 0, src: `${A}/guide-draw.webp` }]} x={[[0, 1], ['44%', '44%']]} opacity={fadeIn} zIndex={12} />
      <Actor progress={progress} alt="Max" sequence={[{ from: 0, src: `${A}/max-neutral.webp` }, { from: 0.75, src: `${A}/max-relieved.webp` }]} x={[[0, 1], ['30%', '30%']]} opacity={fadeIn} zIndex={12} />
      <Bubble speaker="guide" progress={progress} window={WINDOWS.build} anchor={{ desktop: { left: '52%', top: '10.5%' }, mobile: { slot: 1 } }}>
        And where something is missing, we <Hand>build</Hand> it.
      </Bubble>
      <Caption progress={progress} window={WINDOWS.build} anchor={{ left: '52%', top: '31%', maxWidth: 'min(40ch, 20vw)' }}>
        A portal, a dashboard, an internal tool. Usually in weeks.
      </Caption>
    </>
  );
}
