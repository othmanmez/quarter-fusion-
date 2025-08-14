import { siteData } from '../data/siteData';

export default function SocialLinks() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Titre de section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Suivez-nous sur les <span className="text-red-700">réseaux sociaux</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Découvrez nos dernières créations, offres spéciales et coulisses en temps réel
          </p>
        </div>

        {/* Grille des réseaux sociaux */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {siteData.socialMedia.map((social) => (
            <a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-8 text-center hover:from-red-100 hover:to-red-200 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              {/* Icône */}
              <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                {social.icon}
              </div>
              
              {/* Nom du réseau */}
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {social.name}
              </h3>
              
              {/* Description */}
              <p className="text-gray-600 mb-4">
                {social.name === 'TikTok' && 'Vidéos courtes et recettes'}
                {social.name === 'Instagram' && 'Photos et stories gourmandes'}
                {social.name === 'Snapchat' && 'Coups de cœur du jour'}
              </p>
              
              {/* Bouton */}
              <div className="inline-flex items-center text-red-700 hover:text-red-800 font-medium group-hover:translate-x-1 transition-transform duration-200">
                <span>Nous suivre</span>
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </div>
            </a>
          ))}
        </div>

        {/* Call to action */}
        <div className="text-center mt-12">
          <p className="text-lg text-gray-600 mb-6">
            Restez connecté pour ne manquer aucune de nos offres spéciales !
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="bg-red-700 hover:bg-red-800 text-white px-8 py-3 rounded-full text-lg font-medium transition-colors duration-200 shadow-lg hover:shadow-xl">
              Commander maintenant
            </button>
            <a
              href={`tel:${siteData.restaurant.phone}`}
              className="bg-white hover:bg-gray-50 text-red-700 border-2 border-red-700 px-8 py-3 rounded-full text-lg font-medium transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              Appeler {siteData.restaurant.phone}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
} 