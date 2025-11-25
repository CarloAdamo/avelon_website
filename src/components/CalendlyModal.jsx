import { PopupModal } from 'react-calendly';

export default function CalendlyModal({ isOpen, onClose, url }) {
  return (
    <PopupModal
      url={url}
      onModalClose={onClose}
      open={isOpen}
      rootElement={document.getElementById('root')}
    />
  );
}
