import { siteData } from '../../data/siteData';

export default function PolitiqueConfidentialitePage() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="pt-30 pb-12 bg-gradient-to-b from-red-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Politique de <span className="text-red-700">confidentialité</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comment nous collectons et protégeons vos données personnelles
            </p>
          </div>
        </div>
      </section>

      {/* Contenu */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-lg p-8 space-y-8">
            
            {/* Introduction */}
            <div>
              <p className="text-gray-700 leading-relaxed">
                {siteData.restaurant.name} accorde une grande importance à la protection de vos données personnelles. 
                Cette politique de confidentialité décrit comment nous collectons, utilisons et protégeons vos informations 
                conformément au Règlement Général sur la Protection des Données (RGPD).
              </p>
            </div>

            {/* Responsable du traitement */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Responsable du traitement des données</h2>
              <div className="text-gray-700 space-y-2">
                <p><strong>Responsable :</strong> {siteData.restaurant.name}</p>
                <p><strong>Adresse :</strong> {siteData.restaurant.address}</p>
                <p><strong>Email :</strong> contact@quarterfusion.com</p>
                <p><strong>Téléphone :</strong> {siteData.restaurant.phone}</p>
              </div>
            </div>

            {/* Données collectées */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Données personnelles collectées</h2>
              <div className="text-gray-700 space-y-3">
                <p>Nous collectons les données suivantes :</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Lors d'une commande :</strong> Nom, prénom, adresse email, numéro de téléphone, adresse de livraison</li>
                  <li><strong>Lors de la navigation :</strong> Adresse IP, type de navigateur, pages visitées, durée de visite</li>
                  <li><strong>Cookies :</strong> Données de session, préférences utilisateur</li>
                </ul>
              </div>
            </div>

            {/* Finalités */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Finalités du traitement</h2>
              <div className="text-gray-700 space-y-2">
                <p>Vos données sont collectées pour :</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Traiter et livrer vos commandes</li>
                  <li>Vous contacter concernant votre commande</li>
                  <li>Améliorer nos services et notre site web</li>
                  <li>Vous envoyer des informations sur nos offres (avec votre consentement)</li>
                  <li>Respecter nos obligations légales et réglementaires</li>
                  <li>Prévenir la fraude et assurer la sécurité du site</li>
                </ul>
              </div>
            </div>

            {/* Base légale */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Base légale du traitement</h2>
              <div className="text-gray-700 space-y-2">
                <p>Le traitement de vos données repose sur :</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>L'exécution du contrat :</strong> Pour traiter votre commande</li>
                  <li><strong>Votre consentement :</strong> Pour l'envoi d'offres commerciales</li>
                  <li><strong>L'intérêt légitime :</strong> Pour améliorer nos services</li>
                  <li><strong>Obligation légale :</strong> Pour la conservation des données comptables</li>
                </ul>
              </div>
            </div>

            {/* Destinataires */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Destinataires des données</h2>
              <div className="text-gray-700 space-y-2">
                <p>Vos données peuvent être transmises à :</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Notre personnel interne (préparation des commandes, livraison)</li>
                  <li>Nos prestataires de paiement sécurisé</li>
                  <li>Nos prestataires techniques (hébergement, maintenance)</li>
                  <li>Les autorités compétentes en cas d'obligation légale</li>
                </ul>
              </div>
            </div>

            {/* Durée de conservation */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Durée de conservation</h2>
              <div className="text-gray-700 space-y-2">
                <p>Nous conservons vos données :</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Données de commande :</strong> 3 ans après la dernière commande</li>
                  <li><strong>Données comptables :</strong> 10 ans (obligation légale)</li>
                  <li><strong>Cookies :</strong> 13 mois maximum</li>
                  <li><strong>Données de navigation :</strong> 12 mois</li>
                </ul>
              </div>
            </div>

            {/* Vos droits */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Vos droits</h2>
              <div className="text-gray-700 space-y-3">
                <p>Conformément au RGPD, vous disposez des droits suivants :</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Droit d'accès :</strong> Obtenir une copie de vos données</li>
                  <li><strong>Droit de rectification :</strong> Corriger vos données inexactes</li>
                  <li><strong>Droit à l'effacement :</strong> Supprimer vos données</li>
                  <li><strong>Droit d'opposition :</strong> Vous opposer au traitement</li>
                  <li><strong>Droit à la limitation :</strong> Limiter le traitement</li>
                  <li><strong>Droit à la portabilité :</strong> Récupérer vos données dans un format structuré</li>
                  <li><strong>Droit de retirer votre consentement :</strong> À tout moment</li>
                </ul>
                <p className="mt-4">
                  Pour exercer vos droits, contactez-nous à : <strong>contact@quarterfusion.com</strong>
                </p>
                <p>
                  Vous disposez également du droit d'introduire une réclamation auprès de la CNIL : 
                  <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="text-red-700 hover:text-red-800 ml-1">
                    www.cnil.fr
                  </a>
                </p>
              </div>
            </div>

            {/* Sécurité */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Sécurité des données</h2>
              <div className="text-gray-700 space-y-2">
                <p>Nous mettons en œuvre des mesures techniques et organisationnelles pour protéger vos données :</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Chiffrement des données sensibles (HTTPS/SSL)</li>
                  <li>Accès limité aux données personnelles</li>
                  <li>Sauvegardes régulières</li>
                  <li>Protection contre les accès non autorisés</li>
                  <li>Formation du personnel à la protection des données</li>
                </ul>
              </div>
            </div>

            {/* Cookies */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Cookies</h2>
              <div className="text-gray-700 space-y-2">
                <p>Notre site utilise des cookies pour :</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Maintenir votre session de navigation</li>
                  <li>Mémoriser votre panier de commande</li>
                  <li>Analyser le trafic du site (statistiques anonymes)</li>
                </ul>
                <p className="mt-3">
                  Vous pouvez paramétrer votre navigateur pour refuser les cookies, mais cela peut limiter certaines fonctionnalités du site.
                </p>
              </div>
            </div>

            {/* Modifications */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Modifications de la politique</h2>
              <div className="text-gray-700">
                <p>
                  Nous nous réservons le droit de modifier cette politique de confidentialité à tout moment. 
                  Les modifications seront publiées sur cette page avec la date de mise à jour.
                </p>
                <p className="mt-3">
                  <strong>Dernière mise à jour :</strong> {new Date().toLocaleDateString('fr-FR')}
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}

