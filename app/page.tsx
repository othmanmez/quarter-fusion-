import Navbar from './components/Navbar';
import Hero from './components/Hero';
import BestSellers from './components/BestSellers';
import InfoSection from './components/InfoSection';
import SocialLinks from './components/SocialLinks';
import Footer from './components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Navigation fixe */}
      <Navbar />
      
      {/* Section Hero avec logo */}
      <Hero />
      
      {/* Section Best-Sellers */}
      <BestSellers />
      
      {/* Section Informations pratiques */}
      <InfoSection />
      
      {/* Section Réseaux sociaux */}
      <SocialLinks />
      
      {/* Footer */}
      <Footer />
    </main>
  );
}
