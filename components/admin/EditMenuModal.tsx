'use client';

import { useState, useEffect } from 'react';

interface MenuItem {
  id: string;
  title: string;
  description: string;
  price: number;
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
  createdAt: string;
  updatedAt: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface EditMenuModalProps {
  menuItem: MenuItem;
  isOpen: boolean;
  onClose: () => void;
  onSave: (menuItem: MenuItem) => void;
}

export default function EditMenuModal({ menuItem, isOpen, onClose, onSave }: EditMenuModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: 0,
    categoryId: '',
    image: '',
    badge: '',
    available: true,
    availableForClickAndCollect: true,
    availableForDelivery: true,
  });

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
      if (menuItem) {
        setFormData({
          title: menuItem.title,
          description: menuItem.description,
          price: menuItem.price,
          categoryId: menuItem.category.id,
          image: menuItem.image,
          badge: menuItem.badge || '',
          available: menuItem.available,
          availableForClickAndCollect: menuItem.availableForClickAndCollect,
          availableForDelivery: menuItem.availableForDelivery,
        });
        setError(null);
      }
    }
  }, [isOpen, menuItem]);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();
      if (data.success) {
        setCategories(data.categories || []);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des catégories:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      setError('Le titre du menu est requis');
      return;
    }

    if (!formData.categoryId) {
      setError('La catégorie est requise');
      return;
    }

    if (formData.price <= 0) {
      setError('Le prix doit être supérieur à 0');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/menu/${menuItem.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title.trim(),
          description: formData.description.trim(),
          price: formData.price,
          categoryId: formData.categoryId,
          image: formData.image.trim(),
          badge: formData.badge.trim() || undefined,
          available: formData.available,
          availableForClickAndCollect: formData.availableForClickAndCollect,
          availableForDelivery: formData.availableForDelivery,
        }),
      });

      const data = await response.json();

      if (data.success) {
        onSave(data.item);
        onClose();
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-5 border max-w-2xl shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              Modifier le menu
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Titre *
                </label>
                <input
                  type="text"
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500"
                  placeholder="Ex: Burger classique"
                />
              </div>

              {/* Price */}
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                  Prix (€) *
                </label>
                <input
                  type="number"
                  id="price"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500"
                placeholder="Description du plat..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Category */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  Catégorie *
                </label>
                <select
                  id="category"
                  value={formData.categoryId}
                  onChange={(e) => setFormData(prev => ({ ...prev, categoryId: e.target.value }))}
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

              {/* Badge */}
              <div>
                <label htmlFor="badge" className="block text-sm font-medium text-gray-700 mb-1">
                  Badge
                </label>
                <select
                  id="badge"
                  value={formData.badge}
                  onChange={(e) => setFormData(prev => ({ ...prev, badge: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500"
                >
                  <option value="">Aucun badge</option>
                  <option value="HOT">HOT</option>
                  <option value="NEW">NEW</option>
                  <option value="TOP">TOP</option>
                </select>
              </div>
            </div>

            {/* Image URL */}
            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                URL de l'image
              </label>
              <input
                type="url"
                id="image"
                value={formData.image}
                onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            {/* Availability Options */}
            <div className="border-t pt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Disponibilité</h4>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.available}
                    onChange={(e) => setFormData(prev => ({ ...prev, available: e.target.checked }))}
                    className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Menu disponible</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.availableForClickAndCollect}
                    onChange={(e) => setFormData(prev => ({ ...prev, availableForClickAndCollect: e.target.checked }))}
                    className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Disponible en click & collect</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.availableForDelivery}
                    onChange={(e) => setFormData(prev => ({ ...prev, availableForDelivery: e.target.checked }))}
                    className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Disponible en livraison</span>
                </label>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t">
              <button
                type="button"
                onClick={onClose}
                className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg font-medium"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Modification...' : 'Modifier'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}