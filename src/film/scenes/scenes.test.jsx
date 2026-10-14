import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import TitleCard from './TitleCard';
import Build from './Build';
import Question from './Question';
import Connect from './Connect';
import Agents from './Agents';
import Stay from './Stay';
import { SCENES } from './windows';

const scenes = [
  ['title', TitleCard, ['IT partner', 'help']],
  ['question', Question, ['printer', 'Walk with me']],
  ['connect', Connect, ['We look after', 'One customer, one record, everywhere']],
  ['agents', Agents, ['AI', 'write the first draft']],
  ['build', Build, ['missing', 'Usually in weeks']],
  ['stay', Stay, ['where your data goes', 'Same people next year']],
];

describe('scenes render', () => {
  for (const [id, Component, phrases] of scenes) {
    it(`${id}: pinned mode renders the section with its length`, () => {
      const html = renderToStaticMarkup(<Component reduced={false} />);
      expect(html).toContain(`data-scene="${id}"`);
      expect(html).toContain(`data-length="${SCENES[id].L}"`);
      for (const p of phrases) expect(html).toContain(p);
    });
    it(`${id}: static mode renders in flow with every bubble`, () => {
      const html = renderToStaticMarkup(<Component reduced />);
      expect(html).toContain('data-film-static="true"');
      expect(html.match(/data-bubble=/g).length).toBe(Object.keys(SCENES[id].WINDOWS).length);
      for (const p of phrases) expect(html).toContain(p);
    });
  }
});
