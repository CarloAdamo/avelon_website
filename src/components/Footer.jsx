import Container from './ui/Container';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black border-t border-white/10">
      <Container>
        <div className="py-12">
          {/* Main footer content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            {/* Brand */}
            <div>
              <div className="flex items-center mb-6">
                <img src="/avelon-logo.svg" alt="Avelon" className="h-20" />
              </div>
              <p className="text-white/60 text-sm max-w-sm leading-relaxed">
                Your modern technology partner for the AI era.
              </p>
            </div>

            {/* Links */}
            <div>
              <h4 className="text-white font-semibold mb-4 text-sm">Navigation</h4>
              <ul className="space-y-3">
                <li>
                  <a href="#services" className="text-white/60 hover:text-white transition-colors text-sm">
                    Our services
                  </a>
                </li>
                <li>
                  <a href="#cases" className="text-white/60 hover:text-white transition-colors text-sm">
                    Customer Stories
                  </a>
                </li>
                <li>
                  <a href="#about" className="text-white/60 hover:text-white transition-colors text-sm">
                    About us
                  </a>
                </li>
                <li>
                  <a href="#contact" className="text-white/60 hover:text-white transition-colors text-sm">
                    Career
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-white font-semibold mb-4 text-sm">Contact</h4>
              <ul className="space-y-3">
                <li>
                  <a href="mailto:info@avelon.se" className="text-white/60 hover:text-white transition-colors text-sm">
                    info@avelon.se
                  </a>
                </li>
                <li>
                  <a href="tel:+46701234567" className="text-white/60 hover:text-white transition-colors text-sm">
                    +46 70 123 45 67
                  </a>
                </li>
                <li className="text-white/60 text-sm">
                  Stockholm, Sweden
                </li>
              </ul>

              {/* Social */}
              <div className="mt-6">
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-10 h-10 bg-[#6B5B95]/20 hover:bg-[#6B5B95]/30 rounded-full items-center justify-center transition-colors"
                >
                  <svg className="w-5 h-5 text-[#6B5B95]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
            <p className="text-white/40">
              © {currentYear} Avelon. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-white/40 hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-white/40 hover:text-white transition-colors">
                Terms
              </a>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}
