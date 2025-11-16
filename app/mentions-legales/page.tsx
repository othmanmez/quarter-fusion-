import { siteData } from '../../data/siteData';

export default function MentionsLegalesPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="pt-30 pb-12 bg-gradient-to-b from-red-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Mentions <span className="text-red-700">légales</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Informations légales concernant {siteData.restaurant.name}
            </p>
          </div>
        </div>
      </section>

      {/* Contenu */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-lg p-8 space-y-8">
            
            {/* Éditeur du site */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Éditeur du site</h2>
              <div className="text-gray-700 space-y-2">
                <p><strong>Raison sociale :</strong> {siteData.restaurant.name}</p>
                <p><strong>Adresse :</strong> {siteData.restaurant.address}</p>
                <p><strong>Téléphone :</strong> {siteData.restaurant.phone}</p>
                <p><strong>Email :</strong> contact@quarterfusion.com</p>
                <p><strong>Forme juridique :</strong> [À compléter - ex: SARL, Auto-entrepreneur]</p>
                <p><strong>Capital social :</strong> [À compléter]</p>
                <p><strong>SIRET :</strong> [À compléter]</p>
                <p><strong>RCS :</strong> [À compléter]</p>
              </div>
            </div>

            {/* Directeur de publication */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Directeur de publication</h2>
              <div className="text-gray-700">
                <p><strong>Nom :</strong> [À compléter]</p>
                <p><strong>Email :</strong> contact@quarterfusion.com</p>
              </div>
            </div>

            {/* Hébergement */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Hébergement du site</h2>
              <div className="text-gray-700 space-y-2">
                <p><strong>Hébergeur :</strong> [À compléter - ex: Vercel, OVH, etc.]</p>
                <p><strong>Adresse :</strong> [À compléter]</p>
                <p><strong>Site web :</strong> [À compléter]</p>
              </div>
            </div>

            {/* Propriété intellectuelle */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Propriété intellectuelle</h2>
              <div className="text-gray-700 space-y-3">
                <p>
                  L'ensemble de ce site relève de la législation française et internationale sur le droit d'auteur 
                  et la propriété intellectuelle. Tous les droits de reproduction sont réservés, y compris pour 
                  les documents téléchargeables et les représentations iconographiques et photographiques.
                </p>
                <p>
                  La reproduction de tout ou partie de ce site sur un support électronique quel qu'il soit est 
                  formellement interdite sauf autorisation expresse du directeur de la publication.
                </p>
              </div>
            </div>

            {/* Données personnelles */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Protection des données personnelles</h2>
              <div className="text-gray-700 space-y-3">
                <p>
                  Conformément à la loi « informatique et libertés » du 6 janvier 1978 modifiée et au Règlement 
                  Général sur la Protection des Données (RGPD), vous disposez d'un droit d'accès, de rectification, 
                  de suppression et d'opposition aux données personnelles vous concernant.
                </p>
                <p>
                  Pour exercer ces droits, vous pouvez nous contacter à l'adresse : contact@quarterfusion.com
                </p>
                <p>
                  Pour plus d'informations, consultez notre{' '}
                  <a href="/politique-confidentialite" className="text-red-700 hover:text-red-800 font-medium">
                    Politique de confidentialité
                  </a>
                  .
                </p>
              </div>
            </div>

            {/* Cookies */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Cookies</h2>
              <div className="text-gray-700 space-y-3">
                <p>
                  Ce site utilise des cookies pour améliorer l'expérience utilisateur et analyser le trafic. 
                  En poursuivant votre navigation sur ce site, vous acceptez l'utilisation de cookies.
                </p>
                <p>
                  Vous pouvez désactiver les cookies dans les paramètres de votre navigateur.
                </p>
              </div>
            </div>

            {/* Crédits */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Crédits</h2>
              <div className="text-gray-700">
                <p>
                  <strong>Conception et développement :</strong> Samy Ajouid & Othman Meziane
                </p>
                <p className="mt-2">
                  <strong>Technologies utilisées :</strong> Next.js, React, TypeScript, Tailwind CSS, Prisma, MongoDB
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}

