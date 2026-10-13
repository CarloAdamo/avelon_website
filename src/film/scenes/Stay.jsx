import Scene from '../Scene';
import Bubble from '../Bubble';
import Hand from '../Hand';
import Actor from '../Actor';
import Camera from '../Camera';
import useIsDesktop from '../useIsDesktop';
import { Paper, Backdrop } from '../Backdrop';
import SystemBoxes from '../SystemBoxes';
import { A, OFFICE } from '../assets';
import { SCENES } from './windows';

const { L, WINDOWS } = SCENES.stay;

function Static() {
  return (
    <>
      <div className="relative" style={{ height: '60svh' }}>
        <Paper />
        <Camera>
          <Backdrop {...OFFICE} />
          <SystemBoxes static showNew={0} locks />
          <Actor static={{ src: `${A}/max-relieved.webp`, left: '30%' }} alt="Max, relieved" />
          <Actor static={{ src: `${A}/guide-neutral.webp`, left: '44%' }} alt="The guide" />
        </Camera>
      </div>
      <Bubble speaker="guide" static>Secure and <Hand>transparent</Hand>. You always know where your data goes.</Bubble>
      <Bubble speaker="guide" static>And we <Hand>stay</Hand>. Same people next year.</Bubble>
    </>
  );
}

export default function Stay({ reduced }) {
  return (
    <Scene id="stay" length={L} reduced={reduced} staticContent={<Static />}>
      {(progress) => <Stage progress={progress} />}
    </Scene>
  );
}

function Stage({ progress }) {
  const isDesktop = useIsDesktop();
  const [maxX, guideX] = isDesktop ? ['30%', '44%'] : ['26%', '72%'];
  return (
    <>
      <Paper />
      <Camera>
        <Backdrop {...OFFICE} />
        <SystemBoxes progress={progress} appear={[0, 0.001]} connect={[0.001, 0.002]} showNew={0} locks flow />
        <Actor progress={progress} alt="Max, relieved" sequence={[{ from: 0, src: `${A}/max-relieved.webp` }]} x={[[0, 1], [maxX, maxX]]} />
        <Actor progress={progress} alt="The guide" sequence={[{ from: 0, src: `${A}/guide-neutral.webp` }]} x={[[0, 1], [guideX, guideX]]} />
      </Camera>
      <Bubble speaker="guide" progress={progress} window={WINDOWS.secure} anchor={{ desktop: { left: '52%', top: '10.5%', tail: 'left' }, mobile: { slot: 1 } }}>
        Secure and <Hand>transparent</Hand>. You always know where your data goes.
      </Bubble>
      <Bubble speaker="guide" progress={progress} window={WINDOWS.stay} anchor={{ desktop: { left: '52%', top: '10.5%', tail: 'left' }, mobile: { slot: 2 } }}>
        And we <Hand>stay</Hand>. Same people next year.
      </Bubble>
    </>
  );
}
