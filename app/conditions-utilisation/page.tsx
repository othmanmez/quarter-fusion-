import { siteData } from '../../data/siteData';

export default function ConditionsUtilisationPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="pt-30 pb-12 bg-gradient-to-b from-red-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Conditions <span className="text-red-700">d'utilisation</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Règles d'utilisation du site {siteData.restaurant.name}
            </p>
          </div>
        </div>
      </section>

      {/* Contenu */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-lg p-8 space-y-8">
            
            {/* Acceptation */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptation des conditions</h2>
              <div className="text-gray-700 space-y-3">
                <p>
                  En accédant et en utilisant le site web de {siteData.restaurant.name}, vous acceptez d'être lié par 
                  les présentes conditions d'utilisation. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser ce site.
                </p>
                <p>
                  Nous nous réservons le droit de modifier ces conditions à tout moment. Les modifications prendront 
                  effet dès leur publication sur le site.
                </p>
              </div>
            </div>

            {/* Utilisation du site */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Utilisation du site</h2>
              <div className="text-gray-700 space-y-3">
                <p>Vous vous engagez à utiliser ce site de manière responsable et à :</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Ne pas perturber le fonctionnement du site</li>
                  <li>Ne pas tenter d'accéder à des zones non autorisées</li>
                  <li>Ne pas utiliser le site à des fins illégales ou frauduleuses</li>
                  <li>Ne pas transmettre de virus ou de code malveillant</li>
                  <li>Ne pas collecter des données d'autres utilisateurs</li>
                  <li>Respecter les droits de propriété intellectuelle</li>
                </ul>
              </div>
            </div>

            {/* Commandes en ligne */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Commandes en ligne</h2>
              <div className="text-gray-700 space-y-3">
                <p><strong>Passation de commande :</strong></p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Les commandes peuvent être passées directement sur le site ou par téléphone</li>
                  <li>Vous devez fournir des informations exactes et complètes</li>
                  <li>Une confirmation de commande vous sera envoyée par email</li>
                  <li>Toute commande vaut acceptation des présentes conditions</li>
                </ul>
                <p className="mt-3"><strong>Disponibilité :</strong></p>
                <p>
                  Les produits sont proposés dans la limite des stocks disponibles. En cas d'indisponibilité, 
                  nous vous en informerons et vous proposerons une alternative ou le remboursement.
                </p>
              </div>
            </div>

            {/* Prix et paiement */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Prix et paiement</h2>
              <div className="text-gray-700 space-y-3">
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Les prix sont indiqués en euros TTC</li>
                  <li>Les frais de livraison sont précisés avant validation de la commande</li>
                  <li>Le paiement s'effectue en espèces ou par carte bancaire à la livraison ou au retrait</li>
                  <li>Nous nous réservons le droit de modifier nos tarifs à tout moment</li>
                </ul>
              </div>
            </div>

            {/* Livraison */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Livraison et retrait</h2>
              <div className="text-gray-700 space-y-3">
                <p><strong>Modes de récupération :</strong></p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Livraison à domicile :</strong> Commande minimum {siteData.delivery.minimum}, 
                      frais {siteData.delivery.fee}, délai {siteData.delivery.time}</li>
                  <li><strong>Click & Collect :</strong> Retrait au restaurant, sans frais supplémentaires</li>
                </ul>
                <p className="mt-3"><strong>Zones de livraison :</strong></p>
                <p>{siteData.delivery.zones}</p>
                <p className="mt-3"><strong>Délais :</strong></p>
                <p>
                  Les délais de livraison sont donnés à titre indicatif. Nous mettons tout en œuvre pour les respecter, 
                  mais ne pouvons être tenus responsables des retards exceptionnels.
                </p>
              </div>
            </div>

            {/* Annulation et remboursement */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Annulation et remboursement</h2>
              <div className="text-gray-700 space-y-3">
                <p><strong>Annulation par le client :</strong></p>
                <p>
                  Vous pouvez annuler votre commande gratuitement tant qu'elle n'a pas été préparée. 
                  Contactez-nous immédiatement au {siteData.restaurant.phone}.
                </p>
                <p className="mt-3"><strong>Produits non conformes :</strong></p>
                <p>
                  En cas de produit non conforme ou défectueux, contactez-nous dans les 24h. 
                  Nous procéderons au remplacement ou au remboursement.
                </p>
                <p className="mt-3"><strong>Droit de rétractation :</strong></p>
                <p>
                  Conformément à la réglementation, le droit de rétractation ne s'applique pas aux denrées périssables.
                </p>
              </div>
            </div>

            {/* Propriété intellectuelle */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Propriété intellectuelle</h2>
              <div className="text-gray-700 space-y-3">
                <p>
                  L'ensemble du contenu du site (textes, images, logos, design) est la propriété exclusive de 
                  {siteData.restaurant.name} ou de ses partenaires et est protégé par les lois sur la propriété intellectuelle.
                </p>
                <p>
                  Toute reproduction, distribution ou utilisation sans autorisation préalable est interdite et pourra 
                  faire l'objet de poursuites.
                </p>
              </div>
            </div>

            {/* Responsabilité */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Limitation de responsabilité</h2>
              <div className="text-gray-700 space-y-3">
                <p>Nous nous efforçons de maintenir le site accessible et à jour, cependant :</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Nous ne garantissons pas l'absence d'interruption ou d'erreurs</li>
                  <li>Nous ne sommes pas responsables des dommages résultant de l'utilisation du site</li>
                  <li>Les informations fournies le sont à titre indicatif</li>
                  <li>Nous ne sommes pas responsables du contenu des sites externes liés</li>
                </ul>
              </div>
            </div>

            {/* Protection des données */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Protection des données personnelles</h2>
              <div className="text-gray-700">
                <p>
                  Vos données personnelles sont collectées et traitées conformément à notre{' '}
                  <a href="/politique-confidentialite" className="text-red-700 hover:text-red-800 font-medium">
                    Politique de confidentialité
                  </a>
                  {' '}et au RGPD.
                </p>
              </div>
            </div>

            {/* Réclamations */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Réclamations</h2>
              <div className="text-gray-700 space-y-2">
                <p>Pour toute réclamation, contactez notre service client :</p>
                <ul className="list-none space-y-2 ml-4">
                  <li><strong>Email :</strong> contact@quarterfusion.com</li>
                  <li><strong>Téléphone :</strong> {siteData.restaurant.phone}</li>
                  <li><strong>Adresse :</strong> {siteData.restaurant.address}</li>
                </ul>
                <p className="mt-3">
                  En cas de litige non résolu, vous pouvez recourir à une médiation de la consommation.
                </p>
              </div>
            </div>

            {/* Droit applicable */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Droit applicable</h2>
              <div className="text-gray-700">
                <p>
                  Les présentes conditions sont régies par le droit français. En cas de litige, les tribunaux français 
                  seront seuls compétents.
                </p>
              </div>
            </div>

            {/* Contact */}
            <div className="mt-8 p-6 bg-red-50 rounded-xl border-2 border-red-100">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Contact</h3>
              <div className="text-gray-700 space-y-2">
                <p>Pour toute question concernant ces conditions d'utilisation :</p>
                <p><strong>Email :</strong> contact@quarterfusion.com</p>
                <p><strong>Téléphone :</strong> {siteData.restaurant.phone}</p>
                <p><strong>Adresse :</strong> {siteData.restaurant.address}</p>
              </div>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}

