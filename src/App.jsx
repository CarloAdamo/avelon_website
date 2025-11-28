import Navbar from './components/Navbar';
import Hero from './components/sections/Hero';
import Services from './components/sections/Services';
import CaseStudies from './components/sections/CaseStudies';
import About from './components/sections/About';
import Career from './components/sections/Career';
import Contact from './components/sections/Contact';
import Footer from './components/Footer';
import { CalendlyProvider } from './context/CalendlyContext';

function App() {
  return (
    <CalendlyProvider>
      <div className="min-h-screen bg-black">
        <Navbar />
        <Hero />
        <Services />
        <CaseStudies />
        <About />
        <Career />
        <Contact />
        <Footer />
      </div>
    </CalendlyProvider>
  );
}

export default App;
