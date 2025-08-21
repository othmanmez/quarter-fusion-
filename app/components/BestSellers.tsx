import Image from 'next/image';
import { siteData } from '../data/siteData';

export default function BestSellers() {
  return (
    <section className="py-16 bg-gradient-to-b from-red-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Titre principal */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Nos <span className="text-red-700">Best-Sellers</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Découvrez nos plats les plus populaires, préparés avec passion et des ingrédients frais
          </p>
        </div>

        {/* Grille des cartes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {siteData.bestSellers.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              {/* Badge */}
              <div className="relative">
                <div className="absolute top-4 left-4 z-10">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold text-white ${
                    item.badge === 'HOT' ? 'bg-red-600' :
                    item.badge === 'NEW' ? 'bg-green-600' :
                    'bg-blue-600'
                  }`}>
                    {item.badge}
                  </span>
                </div>
                
                {/* Image */}
                <div className="relative h-48 w-full bg-gray-200">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
              </div>

              {/* Contenu */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                  {item.description}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-red-700">
                    {item.price}
                  </span>
                  <button className="bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200">
                    Commander
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to action */}
        <div className="text-center mt-12">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/click-and-collect"
              className="bg-red-700 hover:bg-red-800 text-white px-8 py-3 rounded-full text-lg font-medium transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              Click & Collect
            </a>
            <a
              href="/livraison"
              className="bg-transparent border-2 border-red-700 text-red-700 px-8 py-3 rounded-full text-lg font-medium hover:bg-red-700 hover:text-white transition-colors duration-200"
            >
              Livraison
            </a>
          </div>
        </div>
      </div>
    </section>
  );
} 