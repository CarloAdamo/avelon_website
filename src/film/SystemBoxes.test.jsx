import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { motionValue } from 'framer-motion';
import SystemBoxes from './SystemBoxes';
import AgentBot from './AgentBot';

describe('SystemBoxes', () => {
  // Server rendering uses the mobile layout (useIsDesktop's server snapshot is false): the ring only.
  it('renders eight boxes and the seven ring lines, portal hidden until showNew', () => {
    const html = renderToStaticMarkup(<SystemBoxes progress={motionValue(1)} appear={[0.1, 0.45]} connect={[0.5, 0.85]} showNew={null} />);
    expect(html.match(/data-box="/g)).toHaveLength(8);
    expect(html.match(/<line/g)).toHaveLength(7);
    expect(html).toContain('data-box="portal"');
    expect(html).toContain('data-portal-visible="false"');
  });
  it('adds the two portal lines and locks when asked', () => {
    const html = renderToStaticMarkup(<SystemBoxes progress={motionValue(1)} appear={[0, 0.1]} connect={[0.1, 0.2]} showNew={0.5} locks />);
    expect(html.match(/<line/g)).toHaveLength(9);
    expect(html.match(/data-lock="/g)).toHaveLength(9);
    expect(html).toContain('data-portal-visible="true"');
  });
  it('renders a static composition without motion values', () => {
    const html = renderToStaticMarkup(<SystemBoxes static showNew={0} />);
    expect(html.match(/data-box="/g)).toHaveLength(8);
    expect(html).toContain('data-portal-visible="true"');
  });
});

describe('AgentBot', () => {
  it('positions the agent on the ring for the given progress', () => {
    const html = renderToStaticMarkup(<AgentBot progress={motionValue(0.1)} travel={[0.1, 0.9]} src="/film/actors/agent-bot.webp" />);
    expect(html).toContain('data-agent');
    expect(html.match(/data-ping="/g)).toHaveLength(7);
  });
});
