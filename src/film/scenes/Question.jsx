import Scene from '../Scene';
import Bubble from '../Bubble';
import Hand from '../Hand';
import Actor from '../Actor';
import { Paper } from '../Backdrop';
import { A } from '../assets';
import { SCENES } from './windows';

const { L, WINDOWS } = SCENES.question;

function Static() {
  return (
    <>
      <div className="relative" style={{ height: '60svh' }}>
        <Paper />
        <Actor static={{ src: `${A}/max-stack.webp`, left: '30%' }} alt="Max, carrying a wobbling stack of papers" />
        <Actor static={{ src: `${A}/guide-wave.webp`, left: '70%' }} alt="The guide, waving" />
      </div>
      <Bubble speaker="max" static>Our IT partner sorts out the laptops and the Microsoft account. Is that <Hand>it</Hand>?</Bubble>
      <Bubble speaker="guide" static>Laptops are the <Hand>easy</Hand> part. Walk with me.</Bubble>
    </>
  );
}

export default function Question({ reduced }) {
  return (
    <Scene id="question" length={L} reduced={reduced} staticContent={<Static />}>
      {(progress) => (
        <>
          <Paper />
          <Actor progress={progress} eager alt="Max"
            sequence={[{ from: 0, src: `${A}/max-stack.webp` }]}
            x={[[0, 1], ['22%', '22%']]} />
          <Actor progress={progress} eager alt="The guide"
            sequence={[{ from: 0, src: `${A}/guide-walk-a.webp` }, { from: 0.15, src: `${A}/guide-wave.webp` }, { from: 0.5, src: `${A}/guide-neutral.webp` }]}
            walk={{ frames: [`${A}/guide-walk-a.webp`, `${A}/guide-walk-b.webp`], window: [0, 0.15] }}
            x={[[0, 0.15], ['110%', '66%']]} />
          <Bubble speaker="max" progress={progress} window={WINDOWS.max} anchor={{ desktop: { left: '10%', top: '14%' }, mobile: { slot: 1 } }}>
            Our IT partner sorts out the laptops and the Microsoft account. Is that <Hand>it</Hand>?
          </Bubble>
          <Bubble speaker="guide" progress={progress} window={WINDOWS.guide} anchor={{ desktop: { left: '50%', top: '14%' }, mobile: { slot: 2 } }}>
            Laptops are the <Hand>easy</Hand> part. Walk with me.
          </Bubble>
        </>
      )}
    </Scene>
  );
}
