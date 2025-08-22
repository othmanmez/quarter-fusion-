'use client';

import { useState } from 'react';

interface Category {
  id: string;
  name: string;
  _count: {
    menus: number;
  };
}

interface DeleteCategoryModalProps {
  category: Category | null;
  isOpen: boolean;
  onClose: () => void;
  onDelete: (categoryId: string) => Promise<void>;
}

export default function DeleteCategoryModal({ category, isOpen, onClose, onDelete }: DeleteCategoryModalProps) {
  const [loading, setLoading] = useState(false);

  if (!isOpen || !category) return null;

  const canDelete = category._count.menus === 0;

  const handleDelete = async () => {
    if (!canDelete) return;
    
    setLoading(true);
    try {
      await onDelete(category.id);
      onClose();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              Supprimer la catégorie
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          <div className="mb-6">
            {canDelete ? (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9zM4 5a2 2 0 012-2h8a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V5zM8 8a1 1 0 012 0v3a1 1 0 11-2 0V8zM12 8a1 1 0 012 0v3a1 1 0 11-2 0V8z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      Confirmer la suppression
                    </h3>
                    <div className="mt-2 text-sm text-red-700">
                      <p>
                        Êtes-vous sûr de vouloir supprimer la catégorie <strong>"{category.name}"</strong> ?
                      </p>
                      <p className="mt-2">
                        Cette action est irréversible.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">
                      Suppression impossible
                    </h3>
                    <div className="mt-2 text-sm text-yellow-700">
                      <p>
                        Impossible de supprimer la catégorie <strong>"{category.name}"</strong> car elle est utilisée par {category._count.menus} menu(s).
                      </p>
                      <p className="mt-2">
                        Vous devez d'abord supprimer ou déplacer les menus associés.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg font-medium"
            >
              Annuler
            </button>
            {canDelete && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={loading}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Suppression...' : 'Supprimer'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}