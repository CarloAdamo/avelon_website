import { useState } from 'react';

export default function useCalendly() {
  const [isOpen, setIsOpen] = useState(false);

  // Replace this URL with your actual Calendly URL
  const calendlyUrl = 'https://calendly.com/your-username/30min';

  const openCalendly = () => setIsOpen(true);
  const closeCalendly = () => setIsOpen(false);

  return {
    isOpen,
    openCalendly,
    closeCalendly,
    calendlyUrl,
  };
}
