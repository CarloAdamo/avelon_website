import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import Scene from './Scene';

describe('Scene', () => {
  it('reserves (L + 1) viewports in svh and pins a 100svh stage', () => {
    const html = renderToStaticMarkup(
      <Scene id="question" length={2.5}>{() => <p>stage</p>}</Scene>
    );
    expect(html).toContain('height:350svh');
    expect(html).toContain('height:100svh');
    expect(html).toContain('data-scene="question"');
    expect(html).toContain('data-length="2.5"');
    expect(html).toContain('sticky');
  });

  it('renders the static content in flow when reduced', () => {
    const html = renderToStaticMarkup(
      <Scene id="question" length={2.5} reduced staticContent={<p>static</p>}>{() => <p>stage</p>}</Scene>
    );
    expect(html).toContain('data-film-static="true"');
    expect(html).toContain('static');
    expect(html).not.toContain('sticky');
    expect(html).not.toContain('350svh');
  });
});
