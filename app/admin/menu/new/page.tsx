'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ImageUploadField } from '@/app/components/admin/ImageUploadField';

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function NewMenuPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priceClickAndCollect: '',
    priceDelivery: '',
    categoryId: '',
    image: '/images/placeholder.svg',
    badge: '',
    available: true,
    availableForClickAndCollect: true,
    availableForDelivery: true,
  });

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/admin/login');
      return;
    }

    fetchCategories();
  }, [session, status, router]);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();

      if (data.success) {
        setCategories(data.categories || []);
        // Sélectionner la première catégorie par défaut
        if (data.categories && data.categories.length > 0) {
          setFormData(prev => ({ ...prev, categoryId: data.categories[0].id }));
        }
      } else {
        setError('Erreur lors du chargement des catégories');
      }
    } catch (error) {
      console.error('Erreur:', error);
      setError('Erreur lors du chargement des catégories');
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
      const response = await fetch('/api/menu', {
        method: 'POST',
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
        setError(data.error || 'Erreur lors de la création du menu');
      }
    } catch (error) {
      console.error('Erreur:', error);
      setError('Erreur lors de la création du menu');
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

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
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
              <h1 className="text-3xl font-bold text-gray-900">Nouveau Menu</h1>
              <p className="text-gray-600">
                Ajoutez un nouveau plat à votre menu
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
              <ImageUploadField
                label="Image (optionnel)"
                value={formData.image}
                onChange={(nextUrl) => setFormData(prev => ({ ...prev, image: nextUrl }))}
                helpText="💡 Collez une URL ou uploadez un fichier (Cloudinary). Laissez vide pour l'image par défaut."
              />
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
                {loading ? 'Création...' : 'Créer le menu'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}