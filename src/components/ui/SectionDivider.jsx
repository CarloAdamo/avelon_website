/* Hand-drawn wavy divider — uses native SVG curves so the line is clearly visible
   without relying on filter regions (which collapse on thin horizontal paths). */

const ACCENT = '#6B5B95';
const INK = '#1f1a14';

// Two pre-shaped wavy paths so the dividers between sections look slightly different.
const PATHS = {
  left: [
    'M 0 25 Q 30 18, 60 25 T 120 25 T 180 25 T 240 25 T 300 25',
    'M 0 25 Q 35 32, 70 25 T 140 25 T 210 25 T 280 25 T 300 25',
  ],
  right: [
    'M 0 25 Q 30 32, 60 25 T 120 25 T 180 25 T 240 25 T 300 25',
    'M 0 25 Q 40 18, 80 25 T 160 25 T 240 25 T 300 25',
  ],
};

export default function SectionDivider({ variant = 0 }) {
  const v = variant % PATHS.left.length;

  return (
    <div className="px-6 md:px-[4vw] py-12 md:py-16">
      <div className="max-w-[600px] mx-auto flex items-center justify-center gap-5">
        {/* Left wavy line */}
        <svg
          viewBox="0 0 300 50"
          className="flex-1 max-w-[260px]"
          preserveAspectRatio="none"
          style={{ height: '24px' }}
          aria-hidden="true"
        >
          <path
            d={PATHS.left[v]}
            stroke={INK}
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
            opacity="0.5"
          />
        </svg>

        {/* Center asterisk */}
        <span
          style={{
            fontFamily: 'var(--font-hand)',
            fontSize: '2.5rem',
            fontWeight: 700,
            color: ACCENT,
            lineHeight: 1,
          }}
        >
          *
        </span>

        {/* Right wavy line */}
        <svg
          viewBox="0 0 300 50"
          className="flex-1 max-w-[260px]"
          preserveAspectRatio="none"
          style={{ height: '24px' }}
          aria-hidden="true"
        >
          <path
            d={PATHS.right[v]}
            stroke={INK}
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
            opacity="0.5"
          />
        </svg>
      </div>
    </div>
  );
}
