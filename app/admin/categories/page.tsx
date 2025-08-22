'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import EditCategoryModal from '../../../components/admin/EditCategoryModal';
import DeleteCategoryModal from '../../../components/admin/DeleteCategoryModal';

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

export default function AdminCategoriesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal state for adding new category
  const [showModal, setShowModal] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: '', slug: '' });

  // Modal state for editing category
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Modal state for deleting category
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);

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
      setLoading(true);
      const response = await fetch('/api/categories');
      const data = await response.json();

      if (data.success) {
        setCategories(data.categories || []);
      } else {
        setError('Erreur lors du chargement des catégories');
      }
    } catch (error) {
      console.error('Erreur:', error);
      setError('Erreur lors du chargement des catégories');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (category: Category) => {
    setDeletingCategory(category);
    setShowDeleteModal(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        setCategories(categories.filter(cat => cat.id !== id));
      } else {
        throw new Error(data.error || 'Erreur lors de la suppression');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la suppression: ' + (error instanceof Error ? error.message : 'Erreur inconnue'));
      throw error;
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newCategory.name.trim()) {
      alert('Le nom de la catégorie est requis');
      return;
    }

    setModalLoading(true);

    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newCategory.name.trim(),
          slug: newCategory.slug.trim() || undefined,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setCategories([...categories, { ...data.category, _count: { menus: 0 } }]);
        setNewCategory({ name: '', slug: '' });
        setShowModal(false);
      } else {
        alert('Erreur lors de la création: ' + data.error);
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la création');
    } finally {
      setModalLoading(false);
    }
  };

  // Auto-generate slug from name
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    setNewCategory({ name, slug });
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setShowEditModal(true);
  };

  const handleSaveCategory = (updatedCategory: Category) => {
    setCategories(categories.map(cat => 
      cat.id === updatedCategory.id ? updatedCategory : cat
    ));
  };

  // Filter categories
  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-lg font-medium mb-2">Erreur</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchCategories}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
          >
            Réessayer
          </button>
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
              <h1 className="text-3xl font-bold text-gray-900">Gestion des Catégories</h1>
              <p className="text-gray-600">
                Organisez vos menus par catégories
              </p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium"
            >
              Ajouter une catégorie
            </button>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500">Total catégories</div>
            <div className="text-2xl font-bold text-gray-900">{categories.length}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500">Catégories utilisées</div>
            <div className="text-2xl font-bold text-green-600">
              {categories.filter(c => c._count.menus > 0).length}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500">Catégories vides</div>
            <div className="text-2xl font-bold text-red-600">
              {categories.filter(c => c._count.menus === 0).length}
            </div>
          </div>
        </div>

        {/* Categories List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Catégorie
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Slug
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Menus
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Créée le
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCategories.map((category) => (
                  <tr key={category.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {category.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {category.slug}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        category._count.menus > 0 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {category._count.menus} menu(s)
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(category.createdAt).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleEditCategory(category)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Modifier
                        </button>
                        <button
                          onClick={() => handleDeleteClick(category)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Supprimer
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredCategories.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📂</div>
              <h3 className="text-xl font-medium text-gray-600 mb-2">
                Aucune catégorie trouvée
              </h3>
              <p className="text-gray-500 mb-4">
                {searchTerm 
                  ? 'Aucune catégorie ne correspond à votre recherche.'
                  : 'Commencez par créer votre première catégorie.'
                }
              </p>
              {!searchTerm && (
                <button
                  onClick={() => setShowModal(true)}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium"
                >
                  Ajouter une catégorie
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Add Category Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Ajouter une catégorie
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              <form onSubmit={handleAddCategory} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Nom *
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={newCategory.name}
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
                    value={newCategory.slug}
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
                    onClick={() => setShowModal(false)}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg font-medium"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={modalLoading}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {modalLoading ? 'Création...' : 'Créer'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Category Modal */}
      {editingCategory && (
        <EditCategoryModal
          category={editingCategory}
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setEditingCategory(null);
          }}
          onSave={handleSaveCategory}
        />
      )}

      {/* Delete Category Modal */}
      <DeleteCategoryModal
        category={deletingCategory}
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setDeletingCategory(null);
        }}
        onDelete={handleDelete}
      />
    </div>
  );
}