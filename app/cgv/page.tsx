import { siteData } from '../../data/siteData';

export default function CGVPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="pt-30 pb-12 bg-gradient-to-b from-red-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Conditions Générales de <span className="text-red-700">Vente</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Conditions applicables aux commandes sur {siteData.restaurant.name}
            </p>
          </div>
        </div>
      </section>

      {/* Contenu */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-lg p-8 space-y-8">
            
            {/* Préambule */}
            <div>
              <p className="text-gray-700 leading-relaxed">
                Les présentes Conditions Générales de Vente (CGV) régissent les relations contractuelles entre 
                {' '}{siteData.restaurant.name} et ses clients dans le cadre de la vente de produits alimentaires 
                en ligne ou par téléphone.
              </p>
            </div>

            {/* Article 1 */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Article 1 - Identification du vendeur</h2>
              <div className="text-gray-700 space-y-2">
                <p><strong>Raison sociale :</strong> {siteData.restaurant.name}</p>
                <p><strong>Adresse :</strong> {siteData.restaurant.address}</p>
                <p><strong>Téléphone :</strong> {siteData.restaurant.phone}</p>
                <p><strong>Email :</strong> contact@quarterfusion.com</p>
                <p><strong>SIRET :</strong> [À compléter]</p>
                <p><strong>TVA intracommunautaire :</strong> [À compléter]</p>
              </div>
            </div>

            {/* Article 2 */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Article 2 - Champ d'application</h2>
              <div className="text-gray-700 space-y-3">
                <p>
                  Les présentes CGV s'appliquent à toutes les commandes passées sur le site web ou par téléphone 
                  auprès de {siteData.restaurant.name}.
                </p>
                <p>
                  Le fait de passer commande implique l'adhésion entière et sans réserve aux présentes CGV.
                </p>
              </div>
            </div>

            {/* Article 3 */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Article 3 - Produits et services</h2>
              <div className="text-gray-700 space-y-3">
                <p><strong>3.1 Description des produits</strong></p>
                <p>
                  Les produits proposés sont des denrées alimentaires (burgers, tacos, sandwichs, accompagnements, 
                  boissons, desserts) préparés sur place avec des ingrédients frais.
                </p>
                <p className="mt-3"><strong>3.2 Photos et descriptions</strong></p>
                <p>
                  Les photographies et descriptions de produits sont non contractuelles et peuvent varier légèrement 
                  par rapport aux produits réels.
                </p>
                <p className="mt-3"><strong>3.3 Allergènes</strong></p>
                <p>
                  Les informations sur les allergènes sont disponibles sur demande. Il est de la responsabilité du 
                  client de nous informer de toute allergie alimentaire avant de passer commande.
                </p>
              </div>
            </div>

            {/* Article 4 */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Article 4 - Commandes</h2>
              <div className="text-gray-700 space-y-3">
                <p><strong>4.1 Passation de commande</strong></p>
                <p>Les commandes peuvent être passées :</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>En ligne sur notre site web</li>
                  <li>Par téléphone au {siteData.restaurant.phone}</li>
                </ul>
                <p className="mt-3"><strong>4.2 Confirmation de commande</strong></p>
                <p>
                  Une fois la commande validée, vous recevez une confirmation par email avec le récapitulatif de 
                  votre commande et le délai de préparation/livraison estimé.
                </p>
                <p className="mt-3"><strong>4.3 Disponibilité</strong></p>
                <p>
                  Nos produits sont disponibles pendant nos horaires d'ouverture et dans la limite des stocks disponibles. 
                  En cas d'indisponibilité d'un produit, nous vous contacterons pour vous proposer une alternative.
                </p>
              </div>
            </div>

            {/* Article 5 */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Article 5 - Prix</h2>
              <div className="text-gray-700 space-y-3">
                <p><strong>5.1 Tarifs</strong></p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Les prix sont indiqués en euros TTC (TVA applicable : 10% pour les produits alimentaires)</li>
                  <li>Les prix peuvent être modifiés à tout moment, mais seront appliqués selon les tarifs en vigueur au moment de la commande</li>
                </ul>
                <p className="mt-3"><strong>5.2 Frais de livraison</strong></p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Livraison : {siteData.delivery.fee}</li>
                  <li>Commande minimum : {siteData.delivery.minimum}</li>
                  <li>Click & Collect : Gratuit</li>
                </ul>
              </div>
            </div>

            {/* Article 6 */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Article 6 - Paiement</h2>
              <div className="text-gray-700 space-y-3">
                <p><strong>6.1 Moyens de paiement acceptés</strong></p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Espèces</li>
                  <li>Carte bancaire (à la livraison ou au retrait)</li>
                </ul>
                <p className="mt-3"><strong>6.2 Sécurité des paiements</strong></p>
                <p>
                  Les paiements par carte bancaire sont sécurisés. Nous ne conservons aucune donnée bancaire.
                </p>
              </div>
            </div>

            {/* Article 7 */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Article 7 - Livraison et retrait</h2>
              <div className="text-gray-700 space-y-3">
                <p><strong>7.1 Modes de récupération</strong></p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Livraison à domicile :</strong> Dans la zone {siteData.delivery.zones}</li>
                  <li><strong>Click & Collect :</strong> Retrait au restaurant {siteData.restaurant.address}</li>
                </ul>
                <p className="mt-3"><strong>7.2 Délais</strong></p>
                <p>
                  Délai indicatif : {siteData.delivery.time}. Ce délai est donné à titre indicatif et peut varier 
                  selon l'affluence.
                </p>
                <p className="mt-3"><strong>7.3 Conditions de livraison</strong></p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Une adresse complète et valide doit être fournie</li>
                  <li>Le client doit être présent pour réceptionner la commande</li>
                  <li>En cas d'absence, nous vous contacterons. Passé 10 minutes, la commande pourra être annulée sans remboursement</li>
                </ul>
              </div>
            </div>

            {/* Article 8 */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Article 8 - Droit de rétractation</h2>
              <div className="text-gray-700 space-y-3">
                <p>
                  Conformément à l'article L221-28 du Code de la consommation, le droit de rétractation ne peut être 
                  exercé pour les denrées périssables. Les produits alimentaires ne peuvent donc pas faire l'objet 
                  d'un retour ou d'un remboursement, sauf en cas de produit non conforme.
                </p>
              </div>
            </div>

            {/* Article 9 */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Article 9 - Annulation et modification</h2>
              <div className="text-gray-700 space-y-3">
                <p><strong>9.1 Annulation par le client</strong></p>
                <p>
                  Vous pouvez annuler votre commande gratuitement avant le début de sa préparation. 
                  Contactez-nous immédiatement au {siteData.restaurant.phone}.
                </p>
                <p className="mt-3"><strong>9.2 Annulation par le vendeur</strong></p>
                <p>
                  Nous nous réservons le droit d'annuler une commande en cas de force majeure, d'indisponibilité 
                  des produits ou de problème technique. Vous serez remboursé intégralement.
                </p>
              </div>
            </div>

            {/* Article 10 */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Article 10 - Réclamations et garanties</h2>
              <div className="text-gray-700 space-y-3">
                <p><strong>10.1 Réclamations</strong></p>
                <p>
                  Toute réclamation doit être formulée dans les 24 heures suivant la réception de la commande :
                </p>
                <ul className="list-none space-y-2 ml-4">
                  <li><strong>Par téléphone :</strong> {siteData.restaurant.phone}</li>
                  <li><strong>Par email :</strong> contact@quarterfusion.com</li>
                </ul>
                <p className="mt-3"><strong>10.2 Produits non conformes</strong></p>
                <p>
                  En cas de produit non conforme (erreur de commande, produit manquant, qualité), nous procéderons 
                  au remplacement ou au remboursement.
                </p>
              </div>
            </div>

            {/* Article 11 */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Article 11 - Responsabilité</h2>
              <div className="text-gray-700 space-y-3">
                <p>
                  {siteData.restaurant.name} ne pourra être tenu responsable en cas de :
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Retard de livraison dû à un cas de force majeure</li>
                  <li>Erreur dans l'adresse de livraison fournie par le client</li>
                  <li>Absence du client lors de la livraison</li>
                  <li>Réaction allergique si le client n'a pas signalé ses allergies</li>
                </ul>
              </div>
            </div>

            {/* Article 12 */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Article 12 - Données personnelles</h2>
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

            {/* Article 13 */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Article 13 - Médiation</h2>
              <div className="text-gray-700 space-y-2">
                <p>
                  En cas de litige, vous pouvez recourir à un médiateur de la consommation dans les conditions 
                  prévues par le Code de la consommation.
                </p>
                <p className="mt-3">
                  <strong>Plateforme européenne de règlement des litiges :</strong>{' '}
                  <a 
                    href="https://ec.europa.eu/consumers/odr" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-red-700 hover:text-red-800"
                  >
                    https://ec.europa.eu/consumers/odr
                  </a>
                </p>
              </div>
            </div>

            {/* Article 14 */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Article 14 - Droit applicable</h2>
              <div className="text-gray-700">
                <p>
                  Les présentes CGV sont soumises au droit français. En cas de litige, et après échec de toute 
                  tentative de recherche d'une solution amiable, les tribunaux français seront seuls compétents.
                </p>
              </div>
            </div>

            {/* Article 15 */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Article 15 - Modification des CGV</h2>
              <div className="text-gray-700">
                <p>
                  Nous nous réservons le droit de modifier les présentes CGV à tout moment. Les CGV applicables sont 
                  celles en vigueur au moment de la passation de la commande.
                </p>
                <p className="mt-3">
                  <strong>Dernière mise à jour :</strong> {new Date().toLocaleDateString('fr-FR')}
                </p>
              </div>
            </div>

            {/* Contact */}
            <div className="mt-8 p-6 bg-red-50 rounded-xl border-2 border-red-100">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Contact</h3>
              <div className="text-gray-700 space-y-2">
                <p>Pour toute question concernant nos CGV :</p>
                <p><strong>{siteData.restaurant.name}</strong></p>
                <p>{siteData.restaurant.address}</p>
                <p><strong>Téléphone :</strong> {siteData.restaurant.phone}</p>
                <p><strong>Email :</strong> contact@quarterfusion.com</p>
              </div>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}

