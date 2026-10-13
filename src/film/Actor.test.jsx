import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { motionValue } from 'framer-motion';
import Actor from './Actor';
import { Paper, Backdrop } from './Backdrop';

describe('Actor', () => {
  const seq = [{ from: 0, src: '/a.webp' }, { from: 0.5, src: '/b.webp' }];
  it('shows the sequence entry for the initial progress and lazy-loads by default', () => {
    const html = renderToStaticMarkup(<Actor progress={motionValue(0.6)} sequence={seq} x={[[0, 1], ['20%', '20%']]} />);
    expect(html).toContain('src="/b.webp"');
    expect(html).toContain('loading="lazy"');
    expect(html).toContain('data-actor');
  });
  it('is decorative in pinned mode (the bubbles carry the story)', () => {
    const html = renderToStaticMarkup(<Actor progress={motionValue(0)} sequence={seq} alt="Max" />);
    expect(html).toContain('alt=""');
    expect(html).not.toContain('alt="Max"');
  });
  it('loads eagerly when asked', () => {
    const html = renderToStaticMarkup(<Actor progress={motionValue(0)} sequence={seq} eager />);
    expect(html).toContain('loading="eager"');
  });
  it('renders a plain positioned img in static mode', () => {
    const html = renderToStaticMarkup(<Actor static={{ src: '/a.webp', left: '30%' }} alt="Max" />);
    expect(html).toContain('src="/a.webp"');
    expect(html).toContain('alt="Max"');
    expect(html).not.toContain('data-actor');
  });
});

describe('backdrops', () => {
  it('tiles the paper and lazy-loads the office', () => {
    expect(renderToStaticMarkup(<Paper />)).toContain('/film/paper.png');
    const html = renderToStaticMarkup(<Backdrop src="/film/backdrops/office.webp" srcMobile="/film/backdrops/office-800.webp" />);
    expect(html).toContain('loading="lazy"');
    expect(html).toContain('office-800.webp');
  });
});
