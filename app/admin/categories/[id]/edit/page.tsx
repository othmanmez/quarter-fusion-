'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

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

export default function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categoryId, setCategoryId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
  });

  useEffect(() => {
    async function initializeParams() {
      const resolvedParams = await params;
      setCategoryId(resolvedParams.id);
    }
    initializeParams();
  }, [params]);

  useEffect(() => {
    if (status === 'loading' || !categoryId) return;
    
    if (!session) {
      router.push('/admin/login');
      return;
    }

    fetchCategory();
  }, [session, status, router, categoryId]);

  const fetchCategory = async () => {
    if (!categoryId) return;
    try {
      setInitialLoading(true);
      const response = await fetch(`/api/categories/${categoryId}`);
      const data = await response.json();

      if (data.success) {
        setCategory(data.category);
        setFormData({
          name: data.category.name,
          slug: data.category.slug,
        });
      } else {
        setError('Catégorie non trouvée');
      }
    } catch (error) {
      console.error('Erreur:', error);
      setError('Erreur lors du chargement de la catégorie');
    } finally {
      setInitialLoading(false);
    }
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
      const response = await fetch(`/api/categories/${categoryId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          slug: formData.slug.trim() || undefined,
        }),
      });

      const data = await response.json();

      if (data.success) {
        router.push('/admin/categories');
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

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    setFormData({ name, slug });
  };

  if (status === 'loading' || initialLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (error && !category) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-lg font-medium mb-2">Erreur</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link
            href="/admin/categories"
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
              <h1 className="text-3xl font-bold text-gray-900">Modifier la Catégorie</h1>
              <p className="text-gray-600">
                {category?.name}
              </p>
            </div>
            <Link
              href="/admin/categories"
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium"
            >
              Retour à la liste
            </Link>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          {/* Category Info */}
          {category && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="text-sm font-medium text-blue-800 mb-2">
                Informations de la catégorie
              </h3>
              <div className="text-sm text-blue-700 space-y-1">
                <p><strong>Menus associés :</strong> {category._count.menus}</p>
                <p><strong>Créée le :</strong> {new Date(category.createdAt).toLocaleDateString('fr-FR')}</p>
                <p><strong>Modifiée le :</strong> {new Date(category.updatedAt).toLocaleDateString('fr-FR')}</p>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
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

            {/* Slug (read-only, auto-generated) */}
            <div>
              <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-2">
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
                Généré automatiquement à partir du nom. Utilisé dans les URLs.
              </p>
            </div>

            {/* Warning for categories with menus */}
            {category && category._count.menus > 0 && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
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

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <Link
                href="/admin/categories"
                className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-2 rounded-lg font-medium"
              >
                Annuler
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Modification...' : 'Modifier la catégorie'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}