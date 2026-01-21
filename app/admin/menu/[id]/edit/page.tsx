'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface MenuItem {
  id: string;
  title: string;
  description: string;
  price: number;
  priceClickAndCollect?: number | null;
  priceDelivery?: number | null;
  image: string;
  available: boolean;
  badge?: string;
  availableForClickAndCollect: boolean;
  availableForDelivery: boolean;
  category: {
    id: string;
    name: string;
    slug: string;
  };
}

export default function EditMenuPage({ params }: { params: Promise<{ id: string }> }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItem, setMenuItem] = useState<MenuItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [menuId, setMenuId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priceClickAndCollect: '',
    priceDelivery: '',
    categoryId: '',
    image: '',
    badge: '',
    available: true,
    availableForClickAndCollect: true,
    availableForDelivery: true,
  });

  useEffect(() => {
    async function initializeParams() {
      const resolvedParams = await params;
      setMenuId(resolvedParams.id);
    }
    initializeParams();
  }, [params]);

  useEffect(() => {
    if (status === 'loading' || !menuId) return;
    
    if (!session) {
      router.push('/admin/login');
      return;
    }

    fetchData();
  }, [session, status, router, menuId]);

  const fetchData = async () => {
    try {
      setInitialLoading(true);
      
      // Fetch categories and menu item in parallel
      const [categoriesResponse, menuResponse] = await Promise.all([
        fetch('/api/categories'),
        fetch(`/api/menu/${menuId}`)
      ]);

      const categoriesData = await categoriesResponse.json();
      const menuData = await menuResponse.json();

      if (!categoriesData.success) {
        throw new Error('Erreur lors du chargement des catégories');
      }

      if (!menuData.success) {
        throw new Error('Menu non trouvé');
      }

      const nextCategories = categoriesData.categories || [];
      const menu = menuData.menuItem;
      if (nextCategories.length === 0 && menu?.category) {
        setCategories([menu.category]);
      } else {
        setCategories(nextCategories);
      }
      setMenuItem(menu);
      
      // Populate form with menu data
      const fallbackPrice = menu.price;
      setFormData({
        title: menu.title,
        description: menu.description,
        priceClickAndCollect: (menu.priceClickAndCollect ?? fallbackPrice).toString(),
        priceDelivery: (menu.priceDelivery ?? fallbackPrice).toString(),
        categoryId: menu.category.id,
        image: menu.image,
        badge: menu.badge || '',
        available: menu.available,
        availableForClickAndCollect: menu.availableForClickAndCollect,
        availableForDelivery: menu.availableForDelivery,
      });

    } catch (error) {
      console.error('Erreur:', error);
      setError(error instanceof Error ? error.message : 'Erreur lors du chargement');
    } finally {
      setInitialLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.priceClickAndCollect || !formData.priceDelivery || !formData.categoryId) {
      setError('Tous les champs obligatoires doivent être remplis');
      return;
    }

    if (parseFloat(formData.priceClickAndCollect) < 0 || parseFloat(formData.priceDelivery) < 0) {
      setError('Les prix doivent être positifs');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/menu/${menuId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.priceClickAndCollect),
          priceClickAndCollect: parseFloat(formData.priceClickAndCollect),
          priceDelivery: parseFloat(formData.priceDelivery),
        }),
      });

      const data = await response.json();

      if (data.success) {
        router.push('/admin/menu');
      } else {
        setError(data.error || 'Erreur lors de la modification du menu');
      }
    } catch (error) {
      console.error('Erreur:', error);
      setError('Erreur lors de la modification du menu');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  if (status === 'loading' || initialLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (error && !menuItem) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-lg font-medium mb-2">Erreur</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link
            href="/admin/menu"
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
          >
            Retour à la liste
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Modifier le Menu</h1>
              <p className="text-gray-600">
                {menuItem?.title}
              </p>
            </div>
            <Link
              href="/admin/menu"
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium"
            >
              Retour à la liste
            </Link>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Titre *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500"
                placeholder="Ex: Burger Quarter Fusion"
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500"
                placeholder="Décrivez le plat..."
              />
            </div>

            {/* Price and Category */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="priceClickAndCollect" className="block text-sm font-medium text-gray-700 mb-2">
                  Prix Click & Collect (€) *
                </label>
                <input
                  type="number"
                  id="priceClickAndCollect"
                  name="priceClickAndCollect"
                  value={formData.priceClickAndCollect}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label htmlFor="priceDelivery" className="block text-sm font-medium text-gray-700 mb-2">
                  Prix Livraison (€) *
                </label>
                <input
                  type="number"
                  id="priceDelivery"
                  name="priceDelivery"
                  value={formData.priceDelivery}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-2">
                  Catégorie *
                </label>
                <select
                  id="categoryId"
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500"
                >
                  <option value="">Sélectionner une catégorie</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Image URL */}
            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
                URL de l'image
              </label>
              <input
                type="text"
                inputMode="url"
                id="image"
                name="image"
                value={formData.image}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500"
                placeholder="https://example.com/image.jpg"
              />
              {formData.image && (
                <div className="mt-2">
                  <img
                    src={formData.image}
                    alt="Aperçu"
                    className="h-32 w-32 object-cover rounded-lg"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/placeholder.svg';
                    }}
                  />
                </div>
              )}
            </div>

            {/* Badge */}
            <div>
              <label htmlFor="badge" className="block text-sm font-medium text-gray-700 mb-2">
                Badge (optionnel)
              </label>
              <select
                id="badge"
                name="badge"
                value={formData.badge}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500"
              >
                <option value="">Aucun badge</option>
                <option value="HOT">HOT</option>
                <option value="NEW">NEW</option>
                <option value="TOP">TOP</option>
              </select>
            </div>

            {/* Availability Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Disponibilité</h3>
              
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="available"
                    checked={formData.available}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Menu disponible</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="availableForClickAndCollect"
                    checked={formData.availableForClickAndCollect}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Disponible pour Click & Collect</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="availableForDelivery"
                    checked={formData.availableForDelivery}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Disponible pour la livraison</span>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <Link
                href="/admin/menu"
                className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-2 rounded-lg font-medium"
              >
                Annuler
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Modification...' : 'Modifier le menu'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}