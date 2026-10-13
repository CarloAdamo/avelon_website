import { describe, it, expect } from 'vitest';
import {
  BOXES, positions, EDGES, RING_EDGES, CHORDS, PORTAL_EDGES, segments, ringPoints, pointAlongPolyline, boxFractions,
} from './boxesLayout';

describe('boxes', () => {
  it('has eight boxes with the portal last', () => {
    expect(BOXES).toHaveLength(8);
    expect(BOXES[7]).toMatchObject({ id: 'portal', isNew: true });
  });
  it('places every box on desktop and on the mobile 4x2 grid', () => {
    const d = positions(true);
    expect(d.email).toEqual([47, 12]);
    expect(d.portal).toEqual([59, 58]);
    const m = positions(false);
    expect(Object.keys(m)).toHaveLength(8);
    const xs = new Set(Object.values(m).map(([x]) => x));
    const ys = new Set(Object.values(m).map(([, y]) => y));
    expect(xs.size).toBe(4);
    expect(ys.size).toBe(2);
    expect(Math.max(...ys)).toBeLessThanOrEqual(60); // inside the 32%–60% box band
    expect(Math.min(...ys)).toBeGreaterThanOrEqual(32);
  });
});

describe('edges and segments', () => {
  it('has a 7-ring plus two chords, and two portal edges', () => {
    expect(RING_EDGES).toHaveLength(7);
    expect(CHORDS).toHaveLength(2);
    expect(EDGES).toEqual([...RING_EDGES, ...CHORDS]);
    expect(EDGES).toContainEqual(['email', 'crm']);
    expect(EDGES).toContainEqual(['microsoft', 'crm']);
    expect(PORTAL_EDGES).toHaveLength(2);
  });
  it('resolves segments to coordinates and adds portal edges on demand', () => {
    expect(segments(true, false)).toHaveLength(9);
    expect(segments(true, true)).toHaveLength(11);
    expect(segments(true, false).some((e) => e.from === 'email' && e.to === 'crm')).toBe(true);
    const s = segments(true, false).find((e) => e.from === 'email' && e.to === 'files');
    expect(s).toMatchObject({ x1: 47, y1: 12, x2: 78, y2: 30 });
  });
});

describe('mobile segments', () => {
  it('draws only the ring on the 4x2 grid, plus the portal edges on demand', () => {
    const ring = segments(false, false);
    expect(ring).toHaveLength(7);
    expect(ring.map((e) => [e.from, e.to])).toEqual(RING_EDGES);
    expect(segments(false, true)).toHaveLength(9);
    for (const [a, b] of CHORDS) expect(ring.some((e) => e.from === a && e.to === b)).toBe(false);
  });
});

describe('agent path', () => {
  it('walks the ring and returns to the start', () => {
    const pts = ringPoints(true);
    expect(pts).toHaveLength(8);
    expect(pts[0]).toEqual(pts[7]);
  });
  it('interpolates along the polyline', () => {
    const pts = [[0, 0], [10, 0], [10, 10]];
    expect(pointAlongPolyline(pts, 0)).toEqual([0, 0]);
    expect(pointAlongPolyline(pts, 0.5)).toEqual([10, 0]);
    expect(pointAlongPolyline(pts, 0.75)).toEqual([10, 5]);
    expect(pointAlongPolyline(pts, 1)).toEqual([10, 10]);
  });
  it('reports the fraction at which each point is reached', () => {
    expect(boxFractions([[0, 0], [10, 0], [10, 10]])).toEqual([0, 0.5, 1]);
  });
});
