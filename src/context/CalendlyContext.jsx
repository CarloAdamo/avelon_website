import { createContext, useContext, useState } from 'react';
import CalendlyModal from '../components/CalendlyModal';

const CalendlyContext = createContext();

export function CalendlyProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  // Replace this URL with your actual Calendly URL
  const calendlyUrl = 'https://calendly.com/carladam-avelon/30min';

  const openCalendly = () => setIsOpen(true);
  const closeCalendly = () => setIsOpen(false);

  return (
    <CalendlyContext.Provider value={{ openCalendly, closeCalendly }}>
      {children}
      <CalendlyModal
        isOpen={isOpen}
        onClose={closeCalendly}
        url={calendlyUrl}
      />
    </CalendlyContext.Provider>
  );
}

export function useCalendly() {
  const context = useContext(CalendlyContext);
  if (!context) {
    throw new Error('useCalendly must be used within CalendlyProvider');
  }
  return context;
}
