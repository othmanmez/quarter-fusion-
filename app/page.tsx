import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import InfoSection from '../components/InfoSection';
import SocialLinks from '../components/SocialLinks';
import Footer from '../components/Footer';
import DynamicBestSellers from '../components/DynamicBestSellers';

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Navigation fixe */}
      
      {/* Section Hero avec logo */}
      {/*<Hero />*/}
      
      {/* Section Best-Sellers */}
      <DynamicBestSellers />
      
      {/* Section Informations pratiques */}
      <InfoSection />
      
      {/* Section Réseaux sociaux */}
      <SocialLinks />
      
      {/* Footer */}
      <Footer />
    </main>
  );
}
