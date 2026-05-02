import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import Container from '../ui/Container';

const PAPER = '#F3ECE1';
const INK = '#1f1a14';
const ACCENT = '#6B5B95';

export default function Contact() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [status, setStatus] = useState('idle');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');

    const form = e.target;
    const data = new FormData(form);

    try {
      const response = await fetch('https://formspree.io/f/xpwgkgor', {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      });

      if (response.ok) {
        setStatus('success');
        form.reset();
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <section
      id="contact"
      className="relative py-24 md:py-36"
      style={{ backgroundColor: PAPER }}
    >
      <Container>
        <div className="grid md:grid-cols-2 gap-12 md:gap-20 max-w-[1500px] mx-auto">
          {/* Left: Text */}
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8 }}
          >
            <h2
              className="font-extrabold leading-tight mb-6"
              style={{
                color: INK,
                fontSize: 'clamp(2.25rem, 4vw, 3.5rem)',
              }}
            >
              <span>Get in </span>
              <span
                style={{
                  fontFamily: 'var(--font-hand)',
                  color: ACCENT,
                  fontSize: '1.15em',
                  fontWeight: 700,
                }}
              >
                touch
              </span>
              <span>.</span>
            </h2>

            <div
              className="space-y-5 leading-relaxed"
              style={{
                color: INK,
                opacity: 0.75,
                fontSize: 'clamp(1rem, 1.05vw, 1.125rem)',
              }}
            >
              <p>
                Have a project in mind? Curious about what's actually possible
                for your business in the AI era? We'd love to hear from you.
              </p>
              <p>Drop us a message and we'll get back within 24 hours.</p>
            </div>

            <div className="mt-8">
              <a
                href="mailto:carladam@avelon.ai"
                className="inline-flex items-center transition-opacity hover:opacity-70"
                style={{ color: ACCENT }}
              >
                <svg
                  className="w-5 h-5 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <span
                  style={{
                    fontFamily: 'var(--font-hand)',
                    fontSize: '1.4rem',
                    fontWeight: 600,
                  }}
                >
                  carladam@avelon.ai
                </span>
              </a>
            </div>
          </motion.div>

          {/* Right: Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.15 }}
          >
            {status === 'success' ? (
              <div
                className="p-10 md:p-14 text-center"
                style={{
                  backgroundColor: 'rgba(31, 26, 20, 0.04)',
                  borderTop: `2px solid ${ACCENT}`,
                }}
              >
                <svg
                  className="w-12 h-12 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  style={{ color: ACCENT }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <h3
                  className="font-extrabold mb-2"
                  style={{
                    color: INK,
                    fontSize: 'clamp(1.5rem, 2vw, 2rem)',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-hand)',
                      color: ACCENT,
                      fontSize: '1.15em',
                      fontWeight: 700,
                    }}
                  >
                    Message
                  </span>{' '}
                  sent.
                </h3>
                <p style={{ color: INK, opacity: 0.7 }}>
                  We'll get back to you soon.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <Field name="name" label="Name" placeholder="Your name" required />
                <Field name="email" label="Email" type="email" placeholder="you@company.com" required />
                <Field name="company" label="Company" placeholder="Your company (optional)" />
                <Field
                  name="message"
                  label="Message"
                  placeholder="Tell us what you're trying to do..."
                  required
                  textarea
                />

                {status === 'error' && (
                  <p className="text-sm" style={{ color: '#b04848' }}>
                    Something went wrong. Try again or email us directly.
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="w-full py-4 font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  style={{
                    backgroundColor: ACCENT,
                    color: '#fff',
                    fontFamily: 'var(--font-hand)',
                    fontSize: '1.4rem',
                    fontWeight: 700,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#5a4a7a';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = ACCENT;
                  }}
                >
                  {status === 'submitting' ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Sending...
                    </>
                  ) : (
                    'Send message'
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </Container>
    </section>
  );
}

function Field({ name, label, placeholder, required, type = 'text', textarea }) {
  const baseClasses =
    'w-full bg-transparent px-4 py-3 transition-colors focus:outline-none';
  const baseStyle = {
    color: INK,
    borderBottom: '1.5px solid rgba(31, 26, 20, 0.2)',
    fontSize: '1rem',
  };
  const inputProps = {
    name,
    id: name,
    placeholder,
    required,
    className: baseClasses,
    style: baseStyle,
    onFocus: (e) => {
      e.target.style.borderBottomColor = ACCENT;
    },
    onBlur: (e) => {
      e.target.style.borderBottomColor = 'rgba(31, 26, 20, 0.2)';
    },
  };

  return (
    <div>
      <label
        htmlFor={name}
        className="block mb-2"
        style={{
          color: INK,
          opacity: 0.6,
          fontSize: '0.9rem',
          fontFamily: 'var(--font-hand)',
          fontWeight: 600,
        }}
      >
        {label}
      </label>
      {textarea ? <textarea rows={5} {...inputProps} /> : <input type={type} {...inputProps} />}
    </div>
  );
}
