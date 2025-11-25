import Navbar from './components/Navbar';
import Hero from './components/sections/Hero';
import Services from './components/sections/Services';
import CaseStudies from './components/sections/CaseStudies';
import About from './components/sections/About';
import Blog from './components/sections/Blog';
import Footer from './components/Footer';
import { CalendlyProvider } from './context/CalendlyContext';

function App() {
  return (
    <CalendlyProvider>
      <div className="min-h-screen">
        <Navbar />
        <Hero />
        <Services />
        <CaseStudies />
        <About />
        <Blog />
        <Footer />
      </div>
    </CalendlyProvider>
  );
}

export default App;
