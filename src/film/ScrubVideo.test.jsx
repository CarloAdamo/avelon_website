import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { motionValue } from 'framer-motion';
import ScrubVideo from './ScrubVideo';

describe('ScrubVideo', () => {
  it('renders muted, inline, preload none, decorative, with no poster and no src before activation', () => {
    const html = renderToStaticMarkup(
      <ScrubVideo progress={motionValue(0)} window={[0, 0.8]} src="/film/video/a.mp4" srcMobile="/film/video/a-mobile.mp4" poster="/film/video/a.webp" />
    );
    expect(html).toContain('<video');
    expect(html).toContain('muted');
    expect(html.toLowerCase()).toContain('playsinline'); // React SSR emits playsInline=""; attribute names are case-insensitive
    expect(html).toContain('preload="none"');
    expect(html).toContain('aria-hidden="true"');
    expect(html).not.toContain('poster=');
    expect(html).not.toContain('src="/film/video/a.mp4"');
  });
  it('sets the poster at once for afterLoad videos, defers it for nearViewport ones', () => {
    const props = { progress: motionValue(0), window: [0, 0.8], src: '/film/video/a.mp4', poster: '/film/video/a.webp' };
    expect(renderToStaticMarkup(<ScrubVideo {...props} loadPolicy="afterLoad" />)).toContain('poster="/film/video/a.webp"');
    expect(renderToStaticMarkup(<ScrubVideo {...props} />)).not.toContain('poster=');
  });
});
