import { siteData } from '../data/siteData';

export default function InfoSection() {
  const days = [
    { name: 'Lundi', key: 'monday' },
    { name: 'Mardi', key: 'tuesday' },
    { name: 'Mercredi', key: 'wednesday' },
    { name: 'Jeudi', key: 'thursday' },
    { name: 'Vendredi', key: 'friday' },
    { name: 'Samedi', key: 'saturday' },
    { name: 'Dimanche', key: 'sunday' }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Titre de section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Informations <span className="text-red-700">pratiques</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Tout ce que vous devez savoir pour nous rendre visite ou commander
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Colonne gauche - Horaires et contact */}
          <div className="space-y-8">
            {/* Horaires d'ouverture */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <svg className="w-6 h-6 text-red-700 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Horaires d'ouverture
              </h3>
              <div className="space-y-3">
                {days.map((day) => (
                  <div key={day.key} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                    <span className="font-medium text-gray-700">{day.name}</span>
                    <span className="text-gray-600">{siteData.hours[day.key as keyof typeof siteData.hours]}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <svg className="w-6 h-6 text-red-700 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Contact
              </h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-red-700 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-gray-700">{siteData.restaurant.address}</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-red-700 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <a href={`tel:${siteData.restaurant.phone}`} className="text-red-700 hover:text-red-800 font-medium">
                    {siteData.restaurant.phone}
                  </a>
                </div>

              </div>
            </div>

            {/* Conditions de livraison */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <svg className="w-6 h-6 text-red-700 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                Livraison
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-700">Commande minimum :</span>
                  <span className="font-medium text-red-700">{siteData.delivery.minimum}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Frais de livraison :</span>
                  <span className="font-medium text-red-700">{siteData.delivery.fee}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Délai de livraison :</span>
                  <span className="font-medium text-red-700">{siteData.delivery.time}</span>
                </div>
                <div className="pt-3 border-t border-gray-100">
                  <span className="text-sm text-gray-600">{siteData.delivery.zones}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Colonne droite - Google Maps */}
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <svg className="w-6 h-6 text-red-700 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m-6 3l6-3" />
              </svg>
              Notre localisation
            </h3>
            <div className="relative h-96 rounded-xl overflow-hidden mb-4">
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

            {/* Galerie photos du restaurant */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="relative h-32 rounded-lg overflow-hidden">
                <img 
                  src="/images/devanture.jpg.jpg" 
                  alt="Devanture du restaurant"
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="relative h-32 rounded-lg overflow-hidden">
                <img 
                  src="/images/interieur.jpg.jpg" 
                  alt="Intérieur du restaurant"
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                />
              </div>
            </div>

            <div className="text-center">
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
  );
} 