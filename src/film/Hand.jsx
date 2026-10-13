export const ACCENT = '#6B5B95';

export default function Hand({ children }) {
  return (
    <span style={{ fontFamily: 'var(--font-hand)', fontWeight: 700, color: ACCENT, fontSize: '1.15em', lineHeight: 1 }}>
      {children}
    </span>
  );
}
