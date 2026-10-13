import Scene from '../Scene';
import Bubble from '../Bubble';
import Hand from '../Hand';
import Actor from '../Actor';
import { Backdrop } from '../Backdrop';
import SystemBoxes from '../SystemBoxes';
import { SCENES } from './windows';

const { L, WINDOWS } = SCENES.connect;
const A = '/film/actors';
const OFFICE = { src: '/film/backdrops/office.webp', srcMobile: '/film/backdrops/office-800.webp' };

function Static() {
  return (
    <>
      <div className="relative" style={{ height: '60svh' }}>
        <Backdrop {...OFFICE} />
        <SystemBoxes static showNew={null} />
        <Actor static={{ src: `${A}/max-neutral.webp`, left: '30%' }} alt="Max" />
        <Actor static={{ src: `${A}/guide-point.webp`, left: '44%' }} alt="The guide" />
      </div>
      <Bubble speaker="guide" static>Email, files, CRM, invoicing, chat. We look after <Hand>all</Hand> of it.</Bubble>
      <Bubble speaker="guide" static>First we <Hand>connect</Hand> what you already have. One customer, one record, everywhere.</Bubble>
    </>
  );
}

export default function Connect({ reduced }) {
  return (
    <Scene id="connect" length={L} reduced={reduced} staticContent={<Static />}>
      {(progress) => (
        <>
          <Backdrop {...OFFICE} />
          <SystemBoxes progress={progress} appear={[0.12, 0.45]} connect={[0.50, 0.85]} showNew={null} />
          <Actor progress={progress} alt="Max"
            sequence={[{ from: 0, src: `${A}/max-walk-a.webp` }, { from: 0.12, src: `${A}/max-neutral.webp` }]}
            walk={{ frames: [`${A}/max-walk-a.webp`, `${A}/max-walk-b.webp`], window: [0, 0.12] }}
            x={[[0, 0.12], ['-10%', '30%']]} />
          <Actor progress={progress} alt="The guide"
            sequence={[{ from: 0, src: `${A}/guide-walk-a.webp` }, { from: 0.12, src: `${A}/guide-point.webp` }]}
            walk={{ frames: [`${A}/guide-walk-a.webp`, `${A}/guide-walk-b.webp`], window: [0, 0.12] }}
            x={[[0, 0.12], ['110%', '44%']]} />
          <Bubble speaker="guide" progress={progress} window={WINDOWS.all} anchor={{ desktop: { left: '52%', top: '10.5%' }, mobile: { slot: 1 } }}>
            Email, files, CRM, invoicing, chat. We look after <Hand>all</Hand> of it.
          </Bubble>
          <Bubble speaker="guide" progress={progress} window={WINDOWS.connect} anchor={{ desktop: { left: '52%', top: '10.5%' }, mobile: { slot: 2 } }}>
            First we <Hand>connect</Hand> what you already have. One customer, one record, everywhere.
          </Bubble>
        </>
      )}
    </Scene>
  );
}
