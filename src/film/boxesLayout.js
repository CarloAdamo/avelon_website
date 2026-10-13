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
  email: [47, 12], files: [78, 30], crm: [88, 54], invoicing: [76, 78],
  chat: [11, 78], google: [11, 50], microsoft: [18, 24], portal: [59, 58],
};

// Mobile: 4×2 grid inside the box band (stage 32%–60%). Columns at 12.5/37.5/62.5/87.5, rows at 42/56.
const MOBILE = {
  email: [12.5, 42], files: [37.5, 42], crm: [62.5, 42], invoicing: [87.5, 42],
  chat: [12.5, 56], google: [37.5, 56], microsoft: [62.5, 56], portal: [87.5, 56],
};

export function positions(isDesktop) {
  return isDesktop ? DESKTOP : MOBILE;
}

const RING = ['email', 'files', 'crm', 'invoicing', 'chat', 'google', 'microsoft'];

// Adjacency: the ring in order, plus two chords across it (desktop only: on the mobile 4×2 grid the
// chords would run along a row over the ring segments). The portal adds two edges when it exists.
export const RING_EDGES = RING.map((id, i) => [id, RING[(i + 1) % RING.length]]);
export const CHORDS = [['email', 'crm'], ['microsoft', 'crm']];
export const EDGES = [...RING_EDGES, ...CHORDS];

export const PORTAL_EDGES = [['portal', 'crm'], ['portal', 'invoicing']];

export function segments(isDesktop, withPortal) {
  const pos = positions(isDesktop);
  const base = isDesktop ? EDGES : RING_EDGES;
  const edges = withPortal ? [...base, ...PORTAL_EDGES] : base;
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
