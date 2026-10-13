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

const { L, WINDOWS } = SCENES.connect;

function Static() {
  return (
    <>
      <div className="relative" style={{ height: '60svh' }}>
        <Paper />
        <Camera>
          <Backdrop {...OFFICE} />
          <SystemBoxes static showNew={null} />
          <Actor static={{ src: `${A}/max-neutral.webp`, left: '30%' }} alt="Max" />
          <Actor static={{ src: `${A}/guide-point.webp`, left: '44%' }} alt="The guide" />
        </Camera>
      </div>
      <Bubble speaker="guide" static>Email, files, CRM, invoicing, chat. We look after <Hand>all</Hand> of it.</Bubble>
      <Bubble speaker="guide" static>First we <Hand>connect</Hand> what you already have. One customer, one record, everywhere.</Bubble>
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

function Stage({ progress }) {
  const isDesktop = useIsDesktop();
  // Mobile: the characters stand apart so they do not overlap at 70% scale.
  const [maxX, guideX] = isDesktop ? ['30%', '44%'] : ['26%', '72%'];
  return (
    <>
      <Paper />
      <Camera>
        <Backdrop {...OFFICE} />
        <SystemBoxes progress={progress} appear={[0.12, 0.45]} connect={[0.50, 0.85]} showNew={null} />
        <Actor progress={progress} alt="Max"
          sequence={[{ from: 0, src: `${A}/max-walk-a.webp` }, { from: 0.12, src: `${A}/max-neutral.webp` }]}
          walk={{ frames: [`${A}/max-walk-a.webp`, `${A}/max-walk-b.webp`], window: [0, 0.12] }}
          x={[[0, 0.12], ['-10%', maxX]]} />
        <Actor progress={progress} alt="The guide"
          sequence={[{ from: 0, src: `${A}/guide-walk-a.webp` }, { from: 0.12, src: `${A}/guide-point.webp` }]}
          walk={{ frames: [`${A}/guide-walk-a.webp`, `${A}/guide-walk-b.webp`], window: [0, 0.12] }}
          x={[[0, 0.12], ['110%', guideX]]} />
      </Camera>
      <Bubble speaker="guide" progress={progress} window={WINDOWS.all} anchor={{ desktop: { left: '52%', top: '10.5%', tail: 'left' }, mobile: { slot: 1 } }}>
        Email, files, CRM, invoicing, chat. We look after <Hand>all</Hand> of it.
      </Bubble>
      <Bubble speaker="guide" progress={progress} window={WINDOWS.connect} anchor={{ desktop: { left: '52%', top: '10.5%', tail: 'left' }, mobile: { slot: 2 } }}>
        First we <Hand>connect</Hand> what you already have. One customer, one record, everywhere.
      </Bubble>
    </>
  );
}
