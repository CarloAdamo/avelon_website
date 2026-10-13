import Scene from '../Scene';
import Bubble from '../Bubble';
import Hand from '../Hand';
import Actor from '../Actor';
import Caption from '../Caption';
import Camera from '../Camera';
import useIsDesktop from '../useIsDesktop';
import { Paper, Backdrop } from '../Backdrop';
import SystemBoxes from '../SystemBoxes';
import AgentBot from '../AgentBot';
import { A, OFFICE } from '../assets';
import { SCENES } from './windows';

const { L, WINDOWS } = SCENES.agents;

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
          <img src={`${A}/agent-bot.webp`} alt="" loading="lazy" style={{ position: 'absolute', left: '50%', top: '14%', height: 64, transform: 'translate(-50%,-50%)' }} />
        </Camera>
      </div>
      <Bubble speaker="guide" static>Then we show you how to work with AI <Hand>agents</Hand>.</Bubble>
      <Caption static>They answer questions, move data, write the first draft.</Caption>
    </>
  );
}

export default function Agents({ reduced }) {
  return (
    <Scene id="agents" length={L} reduced={reduced} staticContent={<Static />}>
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
        <SystemBoxes progress={progress} appear={[0, 0.001]} connect={[0.001, 0.002]} showNew={null} />
        <AgentBot progress={progress} travel={[0.10, 0.90]} src={`${A}/agent-bot.webp`} />
        <Actor progress={progress} alt="Max" sequence={[{ from: 0, src: `${A}/max-neutral.webp` }]} x={[[0, 1], [maxX, maxX]]} />
        <Actor progress={progress} alt="The guide" sequence={[{ from: 0, src: `${A}/guide-point.webp` }]} x={[[0, 1], [guideX, guideX]]} />
      </Camera>
      <Bubble speaker="guide" progress={progress} window={WINDOWS.agents} anchor={{ desktop: { left: '52%', top: '10.5%', tail: 'left' }, mobile: { slot: 1 } }}>
        Then we show you how to work with AI <Hand>agents</Hand>.
      </Bubble>
      <Caption progress={progress} window={WINDOWS.agents} anchor={{ left: '55%', top: '31%', maxWidth: 'min(40ch, 18vw)' }}>
        They answer questions, move data, write the first draft.
      </Caption>
    </>
  );
}
