import { siteData } from '../../data/siteData';
import InfoSection from '../../components/InfoSection';

export default function ContactPage() {

  return (
    <main className="min-h-screen">
      
      {/* Header de la page */}
      <section className="pt-30 pb-12 bg-gradient-to-b from-red-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Nous <span className="text-red-700">contacter</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Retrouvez toutes nos coordonnées et suivez-nous sur les réseaux sociaux !
            </p>
          </div>
        </div>
      </section>

      {/* Informations de contact */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Contact rapide */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-red-700 rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">
                Besoin d'une réponse rapide ?
              </h3>
              <p className="text-red-100 mb-6">
                Appelez-nous directement, nous sommes là pour vous aider !
              </p>
              <a
                href={`tel:${siteData.restaurant.phone}`}
                className="inline-flex items-center bg-white text-red-700 px-6 py-3 rounded-full font-medium hover:bg-gray-100 transition-colors duration-200"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                {siteData.restaurant.phone}
              </a>
            </div>

            <div className="bg-white rounded-2xl p-8 border-2 border-red-700">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Nous trouver
              </h3>
              <div className="space-y-4 text-gray-600">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-red-700 mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{siteData.restaurant.address}</span>
                </div>

                {/* Google Maps embed */}
                <div className="w-full h-64 rounded-xl overflow-hidden border-2 border-gray-200">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2617.5!2d2.0599!3d49.0364!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e6f7b5e7e7e7e7%3A0x7e7e7e7e7e7e7e7e!2s6%20Passage%20de%20l'Aurore%2C%2095800%20Cergy!5e0!3m2!1sfr!2sfr!4v1234567890"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Localisation Quarter Fusion"
                  ></iframe>
                </div>

                {/* Galerie photos du restaurant */}
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <div className="relative h-24 rounded-lg overflow-hidden">
                    <img 
                      src="/images/devanture.jpg.jpg" 
                      alt="Devanture du restaurant"
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="relative h-24 rounded-lg overflow-hidden">
                    <img 
                      src="/images/interieur.jpg.jpg" 
                      alt="Intérieur du restaurant"
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                </div>

                <div className="pt-2">
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

          {/* Section Réseaux Sociaux */}
          <div className="mt-12">
            <div className="bg-gradient-to-br from-red-700 to-red-800 rounded-2xl p-8 text-white text-center">
              <h3 className="text-3xl font-bold mb-4">
                Suivez-nous sur les réseaux sociaux
              </h3>
              <p className="text-red-100 mb-8 text-lg">
                Restez informés de nos nouveautés, promotions et actualités !
              </p>
              
              <div className="flex flex-wrap justify-center gap-6">
                {siteData.socialMedia.map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white text-red-700 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-3"
                  >
                    <span className="text-2xl">{social.icon}</span>
                    {social.name}
                  </a>
                ))}
              </div>
            </div>
          </div>

        </div>
      </section>

      <InfoSection />
    </main>
  );
} 