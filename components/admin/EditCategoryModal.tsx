'use client';

import { useState, useEffect } from 'react';

interface Category {
  id: string;
  name: string;
  slug: string;
  _count: {
    menus: number;
  };
  createdAt: string;
  updatedAt: string;
}

interface EditCategoryModalProps {
  category: Category;
  isOpen: boolean;
  onClose: () => void;
  onSave: (category: Category) => void;
}

export default function EditCategoryModal({ category, isOpen, onClose, onSave }: EditCategoryModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
  });

  useEffect(() => {
    if (isOpen && category) {
      setFormData({
        name: category.name,
        slug: category.slug,
      });
      setError(null);
    }
  }, [isOpen, category]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    setFormData({ name, slug });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      setError('Le nom de la catégorie est requis');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/categories/${category.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          slug: formData.slug.trim(),
        }),
      });

      const data = await response.json();

      if (data.success) {
        onSave(data.category);
        onClose();
      } else {
        setError(data.error || 'Erreur lors de la modification de la catégorie');
      }
    } catch (error) {
      console.error('Erreur:', error);
      setError('Erreur lors de la modification de la catégorie');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              Modifier la catégorie
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          {/* Category Info */}
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="text-sm font-medium text-blue-800 mb-2">
              Informations de la catégorie
            </h4>
            <div className="text-sm text-blue-700 space-y-1">
              <p><strong>Menus associés :</strong> {category._count.menus}</p>
              <p><strong>Créée le :</strong> {new Date(category.createdAt).toLocaleDateString('fr-FR')}</p>
              <p><strong>Modifiée le :</strong> {new Date(category.updatedAt).toLocaleDateString('fr-FR')}</p>
            </div>
          </div>

          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Warning for categories with menus */}
          {category._count.menus > 0 && (
            <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">
                    Attention
                  </h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <p>
                      Cette catégorie est utilisée par {category._count.menus} menu(s). 
                      La modification du slug peut affecter les liens existants.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Nom *
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={handleNameChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500"
                placeholder="Ex: Burgers"
              />
            </div>

            <div>
              <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
                Slug (généré automatiquement)
              </label>
              <input
                type="text"
                id="slug"
                value={formData.slug}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500 cursor-not-allowed"
                placeholder="burgers"
              />
              <p className="mt-1 text-sm text-gray-500">
                Généré automatiquement à partir du nom
              </p>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
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