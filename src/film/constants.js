export const SPRING = { stiffness: 120, damping: 30, mass: 0.4 };
export const PAPER = '#F3ECE1';
export const INK = '#1F1A14';
export const ACCENT = '#6B5B95';
export const NAV_HEIGHT = 80; // the fixed navbar (h-20)
// Desktop office scenes: the box layer starts below the navbar band, 80px of the 1080px capture = 7.4% of the camera.
export const DESKTOP_BAND = '7.4%';
// Seedance renders a clip slightly shrunk against its 1920×1080 start frame (measured on the Build clip:
// content at 0.9869·x − 4.31 px, 0.9682·y − 0.21 px; the same on every generation so far). CLIP_FIT is the
// inverse, applied to every office clip so its frames coincide with the live camera layers. Re-measure
// with scripts/film/measure-clip.py after regenerating a clip whose start frame has the boxes.
export const CLIP_FIT = { transformOrigin: '0 0', transform: 'translate(0.228%, 0.020%) scale(1.0133, 1.0329)' };
