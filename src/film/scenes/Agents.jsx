import Scene from '../Scene';
import Bubble from '../Bubble';
import Hand from '../Hand';
import Actor from '../Actor';
import Caption from '../Caption';
import { Backdrop } from '../Backdrop';
import SystemBoxes from '../SystemBoxes';
import AgentBot from '../AgentBot';
import { SCENES } from './windows';

const { L, WINDOWS } = SCENES.agents;
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
        <img src={`${A}/agent-bot.webp`} alt="" loading="lazy" style={{ position: 'absolute', left: '50%', top: '14%', height: 64, transform: 'translate(-50%,-50%)' }} />
      </div>
      <Bubble speaker="guide" static>Then we show you how to work with AI <Hand>agents</Hand>.</Bubble>
      <Caption static>They answer questions, move data, write the first draft.</Caption>
    </>
  );
}

export default function Agents({ reduced }) {
  return (
    <Scene id="agents" length={L} reduced={reduced} staticContent={<Static />}>
      {(progress) => (
        <>
          <Backdrop {...OFFICE} />
          <SystemBoxes progress={progress} appear={[0, 0.001]} connect={[0.001, 0.002]} showNew={null} />
          <AgentBot progress={progress} travel={[0.10, 0.90]} src={`${A}/agent-bot.webp`} />
          <Actor progress={progress} alt="Max" sequence={[{ from: 0, src: `${A}/max-neutral.webp` }]} x={[[0, 1], ['30%', '30%']]} />
          <Actor progress={progress} alt="The guide" sequence={[{ from: 0, src: `${A}/guide-point.webp` }]} x={[[0, 1], ['44%', '44%']]} />
          <Bubble speaker="guide" progress={progress} window={WINDOWS.agents} anchor={{ desktop: { left: '52%', top: '10.5%', tail: 'left' }, mobile: { slot: 1 } }}>
            Then we show you how to work with AI <Hand>agents</Hand>.
          </Bubble>
          <Caption progress={progress} window={WINDOWS.agents} anchor={{ left: '55%', top: '31%', maxWidth: 'min(40ch, 18vw)' }}>
            They answer questions, move data, write the first draft.
          </Caption>
        </>
      )}
    </Scene>
  );
}
