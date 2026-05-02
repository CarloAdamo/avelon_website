import Container from './ui/Container';

const PAPER = '#F3ECE1';
const INK = '#1f1a14';
const ACCENT = '#6B5B95';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      style={{
        backgroundColor: PAPER,
        borderTop: '1px solid rgba(31, 26, 20, 0.15)',
      }}
    >
      <Container>
        <div className="py-12 max-w-[1500px] mx-auto">
          {/* Main footer content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            {/* Brand */}
            <div>
              <div className="flex items-center mb-5">
                <img
                  src="/avelon-logo.png"
                  alt="Avelon"
                  className="h-16"
                />
              </div>
              <p
                className="text-sm max-w-sm leading-relaxed"
                style={{ color: INK, opacity: 0.65 }}
              >
                Your{' '}
                <span
                  style={{
                    fontFamily: 'var(--font-hand)',
                    color: ACCENT,
                    fontWeight: 700,
                    fontSize: '1.1em',
                  }}
                >
                  true*
                </span>{' '}
                digital partner for the AI era.
              </p>
            </div>

            {/* Links */}
            <div>
              <h4
                className="mb-4"
                style={{
                  color: INK,
                  fontFamily: 'var(--font-hand)',
                  fontWeight: 700,
                  fontSize: '1.2rem',
                }}
              >
                Navigation
              </h4>
              <ul className="space-y-3">
                <FooterLink href="#cases">Customer Stories</FooterLink>
                <FooterLink href="#contact">Contact</FooterLink>
                <FooterLink href="#career">Career</FooterLink>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4
                className="mb-4"
                style={{
                  color: INK,
                  fontFamily: 'var(--font-hand)',
                  fontWeight: 700,
                  fontSize: '1.2rem',
                }}
              >
                Contact
              </h4>
              <ul className="space-y-3">
                <FooterLink href="mailto:info@avelon.se">info@avelon.se</FooterLink>
                <FooterLink href="tel:+46708234234">+46 708 234 234</FooterLink>
                <li
                  className="text-sm"
                  style={{ color: INK, opacity: 0.6 }}
                >
                  Stockholm, Sweden
                </li>
              </ul>

              <div className="mt-6">
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-10 h-10 rounded-full items-center justify-center transition-colors"
                  style={{ backgroundColor: 'rgba(107, 91, 149, 0.15)' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(107, 91, 149, 0.30)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(107, 91, 149, 0.15)';
                  }}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" style={{ color: ACCENT }}>
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div
            className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm"
            style={{ borderTop: '1px solid rgba(31, 26, 20, 0.12)' }}
          >
            <p style={{ color: INK, opacity: 0.5 }}>
              © {currentYear} Avelon. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a
                href="#"
                className="hover:underline"
                style={{ color: INK, opacity: 0.5 }}
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="hover:underline"
                style={{ color: INK, opacity: 0.5 }}
              >
                Terms
              </a>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}

function FooterLink({ href, children }) {
  return (
    <li>
      <a
        href={href}
        className="text-sm transition-colors"
        style={{ color: INK, opacity: 0.65 }}
        onMouseEnter={(e) => {
          e.currentTarget.style.opacity = 1;
          e.currentTarget.style.color = ACCENT;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.opacity = 0.65;
          e.currentTarget.style.color = INK;
        }}
      >
        {children}
      </a>
    </li>
  );
}
