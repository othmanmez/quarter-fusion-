'use client';

import { useState } from 'react';

import { siteData } from '../../data/siteData';
import InfoSection from '../../components/InfoSection';
import NotificationModal from '../../components/NotificationModal';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState<{
    isOpen: boolean;
    type: 'success' | 'error';
    title: string;
    message: string;
    details?: string;
  }>({
    isOpen: false,
    type: 'success',
    title: '',
    message: '',
    details: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        // Modal de succès
        const details = result.confirmationSent 
          ? `📧 Email de confirmation envoyé\n📞 Réponse sous 24-48h\n🆔 Référence: ${result.reference}`
          : `📞 Réponse sous 24-48h\n🆔 Référence: ${result.reference}\n\n⚠️ Email de confirmation non envoyé\n(vérifiez votre adresse email)`;
        
        setModal({
          isOpen: true,
          type: 'success',
          title: 'Message envoyé avec succès !',
          message: 'Votre message a bien été transmis à notre équipe. Nous vous contacterons très bientôt.',
          details
        });
        
        // Réinitialiser le formulaire
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        });
      } else {
        // Modal d'erreur
        setModal({
          isOpen: true,
          type: 'error',
          title: 'Erreur lors de l\'envoi',
          message: 'Impossible d\'envoyer votre message pour le moment.',
          details: `Erreur: ${result.error}\n\nVeuillez réessayer ou nous contacter directement au 01 30 17 31 78.`
        });
      }
    } catch (error) {
      console.error('Erreur:', error);
      setModal({
        isOpen: true,
        type: 'error',
        title: 'Erreur de connexion',
        message: 'Impossible de contacter le serveur.',
        details: 'Vérifiez votre connexion internet et réessayez.\n\nSi le problème persiste, contactez-nous directement au 01 30 17 31 78.'
      });
    } finally {
      setLoading(false);
    }
  };

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
              Une question, une suggestion ou envie de nous faire un retour ? N'hésitez pas à nous écrire !
            </p>
          </div>
        </div>
      </section>

      {/* Formulaire de contact */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Envoyez-nous un message
              </h2>
              <p className="text-gray-600">
                Remplissez ce formulaire et nous vous répondrons rapidement
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Nom complet *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-700 focus:border-red-700 transition-colors"
                    placeholder="Votre nom complet"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-700 focus:border-red-700 transition-colors"
                    placeholder="votre@email.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-700 focus:border-red-700 transition-colors"
                    placeholder="06 12 34 56 78"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Sujet *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-700 focus:border-red-700 transition-colors"
                  >
                    <option value="">Choisissez un sujet</option>
                    <option value="information">Demande d'information</option>
                    <option value="commande">Question sur une commande</option>
                    <option value="suggestion">Suggestion</option>
                    <option value="reclamation">Réclamation</option>
                    <option value="autre">Autre</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={6}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-700 focus:border-red-700 transition-colors resize-none"
                  placeholder="Décrivez votre demande en détail..."
                ></textarea>
              </div>

              <div className="text-center">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-red-700 hover:bg-red-800 disabled:bg-red-400 text-white px-8 py-3 rounded-full text-lg font-medium transition-colors duration-200 shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
                >
                  {loading ? 'Envoi en cours...' : 'Envoyer le message'}
                </button>
              </div>
            </form>
          </div>

          {/* Contact rapide */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
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
              <div className="space-y-3 text-gray-600">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-red-700 mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{siteData.restaurant.address}</span>
                </div>
                <div className="pt-4">
                  <a
                    href="https://maps.google.com/?q=6+Passage+de+l%27Aurore,+95800+Cergy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-red-700 hover:text-red-800 font-medium"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Voir sur Google Maps
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <InfoSection />


      {/* Modal de notification */}
      <NotificationModal
        isOpen={modal.isOpen}
        onClose={() => setModal({ ...modal, isOpen: false })}
        type={modal.type}
        title={modal.title}
        message={modal.message}
        details={modal.details}
      />
    </main>
  );
} 