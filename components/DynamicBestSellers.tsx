import { Suspense } from 'react';
import { prisma } from '@/lib/prisma';
import { unstable_noStore as noStore } from 'next/cache';

interface MenuItem {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  badge?: string;
  available: boolean;
  availableForClickAndCollect: boolean;
  availableForDelivery: boolean;
}

function BestSellersSkeleton() {
  return (
    <section className="py-16 bg-gradient-to-b from-red-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Titre principal */}
        <div className="text-center mb-12">
          <div className="h-12 bg-gray-200 rounded animate-pulse mb-4 mx-auto max-w-md" />
          <div className="h-6 bg-gray-200 rounded animate-pulse mx-auto max-w-2xl" />
        </div>

        {/* Grille des cartes skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl shadow-lg overflow-hidden"
            >
              {/* Image skeleton */}
              <div className="h-48 bg-gray-200 animate-pulse relative">
                {/* Badge skeleton */}
                <div className="absolute top-4 left-4 z-10">
                  <div className="h-6 bg-gray-300 rounded-full animate-pulse w-16" />
                </div>
              </div>

              {/* Contenu skeleton */}
              <div className="p-6">
                {/* Titre */}
                <div className="h-6 bg-gray-200 rounded animate-pulse mb-2 w-3/4" />
                
                {/* Description */}
                <div className="space-y-2 mb-4">
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-full" />
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3" />
                </div>

                {/* Prix et boutons */}
                <div className="flex justify-between items-center">
                  <div className="h-8 bg-gray-200 rounded animate-pulse w-20" />
                  <div className="flex flex-col space-y-1">
                    <div className="h-8 bg-gray-200 rounded-full animate-pulse w-24" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to action skeleton */}
        <div className="text-center mt-12">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <div className="h-12 bg-gray-200 rounded-full animate-pulse w-48" />
            <div className="h-12 bg-gray-200 rounded-full animate-pulse w-32" />
          </div>
        </div>
      </div>
    </section>
  );
}

async function getBestSellers(): Promise<MenuItem[]> {
  try {
    // Toujours recharger depuis la base (sinon en prod ça peut rester “bloqué” avec un cache)
    noStore();
    
    // Appeler directement Prisma au lieu de fetch pour éviter les problèmes de connexion
    // C'est la même logique que dans app/api/menu/best-sellers/route.ts
    const bestSellers = await prisma.menu.findMany({
      where: {
        badge: {
          in: ['HOT', 'NEW', 'TOP']
        },
        available: true
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        }
      },
      orderBy: [
        { badge: 'asc' }, // HOT first, then NEW, then TOP
        { createdAt: 'desc' }
      ],
      take: 3 // 3 best-sellers sur la page d'accueil
    });

    return bestSellers.map((item: any) => ({
      ...item,
      badge: item.badge === null ? undefined : item.badge,
    }));
  } catch (error) {
    console.error('Error fetching best sellers:', error);
    return [];
  }
}

async function BestSellersContent() {
  const bestSellers = await getBestSellers();

  if (bestSellers.length === 0) {
    return (
      <section className="py-16 bg-gradient-to-b from-red-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Nos <span className="text-red-700">Best-Sellers</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Découvrez nos plats les plus populaires, préparés avec passion et des ingrédients frais
            </p>
          </div>
          <div className="text-center">
            <p className="text-gray-500">Aucun menu spécial disponible pour le moment.</p>
          </div>
        </div>
      </section>
    );
  }

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
          {bestSellers.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              {/* Badge */}
              <div className="relative">
                {item.badge && (
                  <div className="absolute top-4 left-4 z-10">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold text-white ${
                      item.badge === 'HOT' ? 'bg-red-600' :
                      item.badge === 'NEW' ? 'bg-green-600' :
                      'bg-blue-600'
                    }`}>
                      {item.badge}
                    </span>
                  </div>
                )}
                
                {/* Image */}
                <div className="h-48 bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center relative overflow-hidden">
                  <img
                    src={item.image || '/images/placeholder.svg'}
                    alt={item.title}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/placeholder.svg';
                    }}
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
                    {item.price.toFixed(2)}€
                  </span>
                  <div className="flex flex-col space-y-1">
                    {item.availableForClickAndCollect && (
                      <button className="bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200">
                        Click & Collect
                      </button>
                    )}
                    {item.availableForDelivery && !item.availableForClickAndCollect && (
                      <button className="bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200">
                        Livraison
                      </button>
                    )}
                    {!item.available && (
                      <span className="text-gray-500 text-sm">Indisponible</span>
                    )}
                  </div>
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

export default function DynamicBestSellers() {
  return (
    <Suspense fallback={<BestSellersSkeleton />}>
      <BestSellersContent />
    </Suspense>
  );
}