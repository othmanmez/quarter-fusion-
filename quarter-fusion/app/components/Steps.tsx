import Image from 'next/image';
import { siteData } from '../data/siteData';

export default function Steps() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Titre de section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Notre Snack en <span className="text-red-700">3 étapes</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Simple, rapide et délicieux. Voici comment nous préparons votre commande
          </p>
        </div>

        {/* Grille des étapes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {siteData.steps.map((step, index) => (
            <div key={step.id} className="text-center">
              {/* Numéro d'étape */}
              <div className="relative mb-6">
                <div className="w-16 h-16 bg-red-700 rounded-full flex items-center justify-center mx-auto text-white text-2xl font-bold">
                  {step.id}
                </div>
                {/* Ligne de connexion (sauf pour le dernier) */}
                {index < siteData.steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gray-300 transform -translate-y-1/2 z-0"></div>
                )}
              </div>

              {/* Image */}
              <div className="relative h-48 w-full mb-6 rounded-2xl overflow-hidden shadow-lg">
                <Image
                  src={step.image}
                  alt={step.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>

              {/* Contenu */}
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                {step.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        {/* Call to action */}
        <div className="text-center mt-16">
          <button className="bg-red-700 hover:bg-red-800 text-white px-8 py-3 rounded-full text-lg font-medium transition-colors duration-200 shadow-lg hover:shadow-xl">
            Commander maintenant
          </button>
        </div>
      </div>
    </section>
  );
} 