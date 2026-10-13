// Geometry for the system boxes. All coordinates are percentages of the stage (x: width, y: height).
export const BOXES = [
  { id: 'email', label: 'Email' },
  { id: 'files', label: 'Files' },
  { id: 'crm', label: 'CRM' },
  { id: 'invoicing', label: 'Invoicing' },
  { id: 'chat', label: 'Chat', logo: '/logos/slack.webp' },
  { id: 'google', label: 'Google', logo: '/logos/google.webp' },
  { id: 'microsoft', label: 'Microsoft', logo: '/logos/microsoft.webp' },
  { id: 'portal', label: 'Portal', isNew: true },
];

const DESKTOP = {
  email: [50, 14], files: [74, 22], crm: [86, 46], invoicing: [76, 72],
  chat: [24, 72], google: [14, 46], microsoft: [26, 22], portal: [50, 86],
};

// Mobile: 4×2 grid inside the box band (stage 32%–60%). Columns at 12.5/37.5/62.5/87.5, rows at 39/53.
const MOBILE = {
  email: [12.5, 39], files: [37.5, 39], crm: [62.5, 39], invoicing: [87.5, 39],
  chat: [12.5, 53], google: [37.5, 53], microsoft: [62.5, 53], portal: [87.5, 53],
};

export function positions(isDesktop) {
  return isDesktop ? DESKTOP : MOBILE;
}

const RING = ['email', 'files', 'crm', 'invoicing', 'chat', 'google', 'microsoft'];

export const EDGES = [
  ...RING.map((id, i) => [id, RING[(i + 1) % RING.length]]),
  ['email', 'invoicing'],
  ['microsoft', 'crm'],
];

export const PORTAL_EDGES = [['portal', 'invoicing'], ['portal', 'chat']];

export function segments(isDesktop, withPortal) {
  const pos = positions(isDesktop);
  const edges = withPortal ? [...EDGES, ...PORTAL_EDGES] : EDGES;
  return edges.map(([from, to]) => ({
    from, to, x1: pos[from][0], y1: pos[from][1], x2: pos[to][0], y2: pos[to][1],
  }));
}

export function ringPoints(isDesktop) {
  const pos = positions(isDesktop);
  const pts = RING.map((id) => pos[id]);
  return [...pts, pts[0]];
}

function lengths(points) {
  const out = [];
  for (let i = 1; i < points.length; i++) {
    const [ax, ay] = points[i - 1];
    const [bx, by] = points[i];
    out.push(Math.hypot(bx - ax, by - ay));
  }
  return out;
}

export function boxFractions(points) {
  const ls = lengths(points);
  const total = ls.reduce((a, b) => a + b, 0);
  const out = [0];
  let acc = 0;
  for (const l of ls) {
    acc += l;
    out.push(acc / total);
  }
  return out;
}

export function pointAlongPolyline(points, t) {
  const ls = lengths(points);
  const total = ls.reduce((a, b) => a + b, 0);
  let remaining = Math.max(0, Math.min(1, t)) * total;
  for (let i = 0; i < ls.length; i++) {
    if (remaining <= ls[i] || i === ls.length - 1) {
      const f = ls[i] === 0 ? 0 : remaining / ls[i];
      const [ax, ay] = points[i];
      const [bx, by] = points[i + 1];
      return [ax + (bx - ax) * f, ay + (by - ay) * f];
    }
    remaining -= ls[i];
  }
  return points[points.length - 1];
}
