import Actor from './Actor';
import { Paper, Backdrop } from './Backdrop';
import SystemBoxes from './SystemBoxes';
import Camera from './Camera';
import { A, OFFICE } from './assets';

function Title() {
  return (
    <>
      <Paper />
      <Actor static={{ src: `${A}/max-stack.webp`, left: '30%' }} alt="Max" />
    </>
  );
}

// Empty paper: start and end frame for clips where a character enters and leaves.
function Blank() {
  return <Paper />;
}

// Question clip: Max waits with the stack (start); the guide has arrived and listens (end).
function QuestionStart() {
  return (
    <>
      <Paper />
      <Actor static={{ src: `${A}/max-stack-stand.webp`, left: '28%' }} alt="Max" />
    </>
  );
}
function QuestionEnd() {
  return (
    <>
      <Paper />
      <Actor static={{ src: `${A}/max-stack-stand.webp`, left: '28%' }} alt="Max" />
      <Actor static={{ src: `${A}/guide-neutral.webp`, left: '66%' }} alt="The guide" />
    </>
  );
}

function BuildStart() {
  return (
    <>
      <Paper />
      <Camera>
        <Backdrop {...OFFICE} />
        <SystemBoxes static showNew={null} />
        <Actor static={{ src: `${A}/max-neutral.webp`, left: '30%' }} alt="Max" />
        <Actor static={{ src: `${A}/guide-draw.webp`, left: '44%' }} alt="The guide" />
      </Camera>
    </>
  );
}

/**
 * Dev-only route `/capture?scene=title|build|blank|question|question-end` (`npm run dev`): a 1920×1080 stage used to screenshot video
 * start frames. The stage is 16:9, so the office camera fills it and the capture equals the live camera.
 */
export default function CaptureFrame() {
  const scene = new URLSearchParams(window.location.search).get('scene') || 'title';
  const Composition = { build: BuildStart, blank: Blank, question: QuestionStart, 'question-end': QuestionEnd }[scene] || Title;
  return (
    <div id="capture-stage" style={{ position: 'relative', width: 1920, height: 1080, overflow: 'hidden', backgroundColor: '#F3ECE1' }}>
      <Composition />
    </div>
  );
}
