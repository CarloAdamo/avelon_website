import Scene from '../Scene';
import Bubble from '../Bubble';
import Hand from '../Hand';
import Actor from '../Actor';
import { Backdrop } from '../Backdrop';
import SystemBoxes from '../SystemBoxes';
import { SCENES } from './windows';

const { L, WINDOWS } = SCENES.stay;
const A = '/film/actors';
const OFFICE = { src: '/film/backdrops/office.webp', srcMobile: '/film/backdrops/office-800.webp' };

function Static() {
  return (
    <>
      <div className="relative" style={{ height: '60svh' }}>
        <Backdrop {...OFFICE} />
        <SystemBoxes static showNew={0} locks />
        <Actor static={{ src: `${A}/max-relieved.webp`, left: '34%' }} alt="Max, relieved" />
        <Actor static={{ src: `${A}/guide-neutral.webp`, left: '50%' }} alt="The guide" />
      </div>
      <Bubble speaker="guide" static>Secure and <Hand>transparent</Hand>. You always know where your data goes.</Bubble>
      <Bubble speaker="guide" static>And we <Hand>stay</Hand>. Same people next year.</Bubble>
    </>
  );
}

export default function Stay({ reduced }) {
  return (
    <Scene id="stay" length={L} reduced={reduced} staticContent={<Static />}>
      {(progress) => (
        <>
          <Backdrop {...OFFICE} />
          <SystemBoxes progress={progress} appear={[0, 0.001]} connect={[0.001, 0.002]} showNew={0} locks flow />
          <Actor progress={progress} alt="Max, relieved" sequence={[{ from: 0, src: `${A}/max-relieved.webp` }]} x={[[0, 1], ['34%', '34%']]} />
          <Actor progress={progress} alt="The guide" sequence={[{ from: 0, src: `${A}/guide-neutral.webp` }]} x={[[0, 1], ['50%', '50%']]} />
          <Bubble speaker="guide" progress={progress} window={WINDOWS.secure} anchor={{ desktop: { left: '54%', top: '8%' }, mobile: { slot: 1 } }}>
            Secure and <Hand>transparent</Hand>. You always know where your data goes.
          </Bubble>
          <Bubble speaker="guide" progress={progress} window={WINDOWS.stay} anchor={{ desktop: { left: '54%', top: '8%' }, mobile: { slot: 2 } }}>
            And we <Hand>stay</Hand>. Same people next year.
          </Bubble>
        </>
      )}
    </Scene>
  );
}
