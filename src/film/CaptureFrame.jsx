import Actor from './Actor';
import { Paper, Backdrop } from './Backdrop';
import SystemBoxes from './SystemBoxes';

const A = '/film/actors';
const OFFICE = { src: '/film/backdrops/office.webp', srcMobile: '/film/backdrops/office-800.webp' };

function Title() {
  return (
    <>
      <Paper />
      <Actor static={{ src: `${A}/max-stack.webp`, left: '30%' }} alt="Max" />
    </>
  );
}

function BuildStart() {
  return (
    <>
      <Backdrop {...OFFICE} />
      <SystemBoxes static showNew={null} />
      <Actor static={{ src: `${A}/max-neutral.webp`, left: '28%' }} alt="Max" />
      <Actor static={{ src: `${A}/guide-draw.webp`, left: '42%' }} alt="The guide" />
    </>
  );
}

/** Dev route `/capture?scene=title|build`: a 1920×1080 stage used to screenshot video start frames. */
export default function CaptureFrame() {
  const scene = new URLSearchParams(window.location.search).get('scene') || 'title';
  const Composition = scene === 'build' ? BuildStart : Title;
  return (
    <div id="capture-stage" style={{ position: 'relative', width: 1920, height: 1080, overflow: 'hidden', backgroundColor: '#F3ECE1' }}>
      <Composition />
    </div>
  );
}
