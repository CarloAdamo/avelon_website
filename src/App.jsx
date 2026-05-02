import Navbar from './components/Navbar';
import TrueMeaning from './components/sections/TrueMeaning';
import CaseStudies from './components/sections/CaseStudies';
import Career from './components/sections/Career';
import Contact from './components/sections/Contact';
import Footer from './components/Footer';
import RocketScroll from './components/sections/RocketScroll';
import { CalendlyProvider } from './context/CalendlyContext';

function App() {
  return (
    <CalendlyProvider>
      <div className="min-h-screen" style={{ backgroundColor: '#F3ECE1' }}>
        <Navbar />
        <RocketScroll />
        <TrueMeaning />
        <CaseStudies />
        <Contact />
        <Career />
        <Footer />
      </div>
    </CalendlyProvider>
  );
}

export default App;
