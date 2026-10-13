import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { motionValue } from 'framer-motion';
import Bubble from './Bubble';
import Hand from './Hand';

describe('Bubble', () => {
  it('renders static bubbles in flow with a speaker label', () => {
    const html = renderToStaticMarkup(
      <Bubble speaker="guide" static>Walk <Hand>with</Hand> me.</Bubble>
    );
    expect(html).toContain('data-bubble="guide"');
    expect(html).toContain('data-static="true"');
    expect(html).toContain('The guide');
    expect(html).toContain('font-family:var(--font-hand)');
  });

  it('renders animated bubbles absolutely positioned with the mobile slot by default (SSR = mobile)', () => {
    const p = motionValue(0.3);
    const html = renderToStaticMarkup(
      <Bubble speaker="max" progress={p} window={[0.1, 0.18, 0.5, 0.58]}
        anchor={{ desktop: { left: '22%', top: '10%' }, mobile: { slot: 2 } }}>
        Is that <Hand>it</Hand>?
      </Bubble>
    );
    expect(html).toContain('data-bubble="max"');
    expect(html).toContain('position:absolute');
    expect(html).toContain('top:23%');
    expect(html).toContain('opacity:1');
  });
});
