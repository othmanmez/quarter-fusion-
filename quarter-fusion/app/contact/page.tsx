import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { siteData } from '../data/siteData';

export default function ContactPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      
      {/* Header de la page */}
      <section className="pt-20 pb-12 bg-gradient-to-b from-red-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Contactez-<span className="text-red-700">nous</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Une question ? Un avis ? N'hésitez pas à nous contacter, nous sommes là pour vous !
            </p>
          </div>
        </div>
      </section>

      {/* Contenu principal */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Informations de contact */}
            <div className="space-y-8">
              <div className="bg-red-700 rounded-2xl p-8 text-white">
                <h2 className="text-2xl font-bold mb-6">
                  Informations de contact
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{siteData.restaurant.address}</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <a href={`tel:${siteData.restaurant.phone}`} className="hover:underline">
                      {siteData.restaurant.phone}
                    </a>
                  </div>
                </div>
              </div>

              {/* Horaires d'ouverture */}
              <div className="bg-gray-50 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Horaires d'ouverture
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2">
                    <span className="font-medium text-gray-700">Lundi - Dimanche</span>
                    <span className="text-gray-600">18:00 - 02:00</span>
                  </div>
                </div>
              </div>

              {/* Réseaux sociaux */}
              <div className="bg-gray-50 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Suivez-nous
                </h3>
                <div className="flex space-x-4">
                  {siteData.socialMedia.map((social) => (
                    <a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200"
                      aria-label={social.name}
                    >
                      <span className="text-2xl">{social.icon}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Carte Google Maps */}
            <div className="bg-gray-50 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Notre localisation
              </h3>
              <div className="relative h-96 rounded-xl overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2624.9916256937595!2d2.0362!3d49.0369!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e6f4c8c8c8c8c%3A0x8c8c8c8c8c8c8c8c!2s6+Passage+de+l%27Aurore%2C+95800+Cergy!5e0!3m2!1sfr!2sfr!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Quarter Fusion - Localisation"
                ></iframe>
              </div>
              <div className="mt-4 text-center">
                <a
                  href="https://maps.google.com/?q=6+Passage+de+l%27Aurore,+95800+Cergy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-red-700 hover:text-red-800 font-medium"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Ouvrir dans Google Maps
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
} 