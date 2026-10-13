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
 * Dev-only route `/capture?scene=title|build|blank` (`npm run dev`): a 1920×1080 stage used to screenshot video
 * start frames. The stage is 16:9, so the office camera fills it and the capture equals the live camera.
 */
export default function CaptureFrame() {
  const scene = new URLSearchParams(window.location.search).get('scene') || 'title';
  const Composition = scene === 'build' ? BuildStart : scene === 'blank' ? Blank : Title;
  return (
    <div id="capture-stage" style={{ position: 'relative', width: 1920, height: 1080, overflow: 'hidden', backgroundColor: '#F3ECE1' }}>
      <Composition />
    </div>
  );
}
