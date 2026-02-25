'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import EditMenuModal from '../../../components/admin/EditMenuModal';
import CustomizationsModal from '../../../components/admin/CustomizationsModal';
import {
  CupSoda,
  Trash2,
  Star,
  Loader2,
  Palette,
  Pencil,
  UtensilsCrossed,
} from 'lucide-react';

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
  isBestSeller?: boolean;
  availableForClickAndCollect: boolean;
  availableForDelivery: boolean;
  allowDrinkOption?: boolean;
  drinkPrice?: number;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  customizations?: any[];
  createdAt: string;
  updatedAt: string;
}

export default function AdminMenuPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Modal state for editing menu
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingMenuItem, setEditingMenuItem] = useState<MenuItem | null>(null);
  
  // Modal state for customizations
  const [showCustomizationsModal, setShowCustomizationsModal] = useState(false);
  const [customizingMenuItem, setCustomizingMenuItem] = useState<MenuItem | null>(null);

  // Bestseller toggle
  const [bestSellerLoading, setBestSellerLoading] = useState<string | null>(null);

  // Migration drinkPrice
  const handleFixDrinkPrice = async () => {
    if (!confirm('Mettre tous les prix de boisson à 2€ pour les menus qui ont cette option ?')) return;
    try {
      const res = await fetch('/api/admin/fix-drink-price', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        alert(`✅ ${data.message}`);
        fetchMenuItems();
      } else {
        alert('Erreur : ' + (data.error || 'inconnue'));
      }
    } catch {
      alert('Erreur réseau');
    }
  };

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/admin/login');
      return;
    }

    fetchMenuItems();
  }, [session, status, router]);

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      // Inclure les personnalisations pour l'interface admin
      // Ajouter un timestamp pour éviter le cache
      const response = await fetch(`/api/menu?includeCustomizations=true&_t=${Date.now()}`, {
        cache: 'no-store'
      });
      const data = await response.json();

      if (data.success) {
        setMenuItems(data.items || []);
      } else {
        setError('Erreur lors du chargement des menus');
      }
    } catch (error) {
      console.error('Erreur:', error);
      setError('Erreur lors du chargement des menus');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer "${title}" ?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/menu/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        setMenuItems(menuItems.filter(item => item.id !== id));
      } else {
        alert('Erreur lors de la suppression: ' + data.error);
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la suppression');
    }
  };

  const handleDeleteAll = async () => {
    const menuCount = menuItems.length;
    
    if (menuCount === 0) {
      alert('Aucun menu à supprimer');
      return;
    }

    // Double confirmation pour éviter les suppressions accidentelles
    const firstConfirm = confirm(
      `⚠️ ATTENTION : Vous êtes sur le point de supprimer TOUS les ${menuCount} menu(s) !\n\nCette action est irréversible et supprimera également toutes les personnalisations associées.\n\nVoulez-vous vraiment continuer ?`
    );

    if (!firstConfirm) {
      return;
    }

    const secondConfirm = confirm(
      `⚠️ DERNIÈRE CONFIRMATION ⚠️\n\nVous allez supprimer définitivement ${menuCount} menu(s).\n\nTapez OK pour confirmer.`
    );

    if (!secondConfirm) {
      return;
    }

    try {
      const response = await fetch('/api/menu', {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        setMenuItems([]);
        alert(`✅ ${data.message}`);
      } else {
        alert('Erreur lors de la suppression: ' + data.error);
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la suppression de tous les menus');
    }
  };

  const toggleAvailability = async (id: string, currentStatus: boolean) => {
    try {
      const item = menuItems.find(m => m.id === id);
      if (!item) return;

      const response = await fetch(`/api/menu/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: item.title,
          description: item.description,
          price: item.price,
          categoryId: item.category.id,
          image: item.image,
          badge: item.badge,
          availableForClickAndCollect: item.availableForClickAndCollect,
          availableForDelivery: item.availableForDelivery,
          available: !currentStatus,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMenuItems(menuItems.map(m => 
          m.id === id ? { ...m, available: !currentStatus } : m
        ));
      } else {
        alert('Erreur lors de la mise à jour: ' + data.error);
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la mise à jour');
    }
  };

  const toggleBestSeller = async (item: MenuItem) => {
    const newValue = !item.isBestSeller;
    setBestSellerLoading(item.id);
    try {
      const response = await fetch('/api/menu/best-sellers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ menuId: item.id, isBestSeller: newValue }),
      });
      const data = await response.json();
      if (data.success) {
        setMenuItems(menuItems.map(m =>
          m.id === item.id ? { ...m, isBestSeller: newValue } : m
        ));
      } else if (data.limitReached) {
        alert('⭐ Vous avez déjà 3 bestsellers. Retirez-en un avant d\'en ajouter un nouveau.');
      } else {
        alert('Erreur : ' + (data.error || 'Impossible de modifier le bestseller'));
      }
    } catch {
      alert('Erreur réseau');
    } finally {
      setBestSellerLoading(null);
    }
  };

  const handleEditMenuItem = (menuItem: MenuItem) => {
    setEditingMenuItem(menuItem);
    setShowEditModal(true);
  };

  const handleSaveMenuItem = (updatedMenuItem: MenuItem) => {
    setMenuItems(menuItems.map(item => 
      item.id === updatedMenuItem.id ? updatedMenuItem : item
    ));
  };

  // Obtenir les catégories uniques
  const categories = Array.from(new Set(menuItems.map(item => item.category.name)))
    .map(name => menuItems.find(item => item.category.name === name)?.category)
    .filter(Boolean);

  // Filtrer les menus
  const filteredMenus = menuItems.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category.name === selectedCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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
          <p className="text-black mb-4">{error}</p>
          <button
            onClick={fetchMenuItems}
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
              <h1 className="text-3xl font-bold text-gray-900">Gestion des Menus</h1>
              <p className="text-black">
                Gérez vos plats, leur disponibilité et leurs personnalisations
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleFixDrinkPrice}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm"
                title="Corriger prix boisson → 2€"
              >
                <span className="inline-flex items-center gap-2">
                  <CupSoda className="w-4 h-4" />
                  Fixer boisson 2€
                </span>
              </button>
              {menuItems.length > 0 && (
                <button
                  onClick={handleDeleteAll}
                  className="bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded-lg font-medium"
                  title="Supprimer tous les menus"
                >
                  <span className="inline-flex items-center gap-2">
                    <Trash2 className="w-4 h-4" />
                    Supprimer tout
                  </span>
                </button>
              )}
            <Link
              href="/admin/menu/new"
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium"
            >
              Ajouter un menu
            </Link>
            </div>
          </div>
          
          {/* Info bestsellers */}
          <div className="pb-4">
            <div className={`border-l-4 p-4 rounded flex items-center justify-between ${
              menuItems.filter(m => m.isBestSeller).length >= 3
                ? 'bg-yellow-50 border-yellow-500'
                : 'bg-orange-50 border-orange-400'
            }`}>
              <div className="flex items-center gap-3">
                <Star className="w-6 h-6 text-orange-600 fill-orange-600" />
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    Best-sellers page d&apos;accueil —{' '}
                    <span className={menuItems.filter(m => m.isBestSeller).length >= 3 ? 'text-yellow-700' : 'text-orange-700'}>
                      {menuItems.filter(m => m.isBestSeller).length} / 3 sélectionnés
                    </span>
                  </p>
                  <p className="text-xs text-gray-600 mt-0.5">
                    Cliquez sur l&apos;étoile d&apos;un plat pour l&apos;ajouter / le retirer des bestsellers (maximum 3).
                    Ils restent affichés à vie jusqu&apos;à ce que vous les changiez.
                  </p>
                </div>
              </div>
              {menuItems.filter(m => m.isBestSeller).length > 0 && (
                <div className="ml-4 flex flex-col gap-1">
                  {menuItems.filter(m => m.isBestSeller).map(m => (
                    <span key={m.id} className="text-xs bg-yellow-200 text-yellow-900 px-2 py-0.5 rounded-full font-medium">
                      <span className="inline-flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-yellow-900 fill-yellow-900" />
                        {m.title}
                      </span>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Info sur les personnalisations */}
          <div className="pb-6">
            <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded">
              <div className="flex">
                <div className="flex-shrink-0">
                  <Palette className="w-6 h-6 text-purple-700" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-purple-900">
                    Gérez les personnalisations de vos menus
                  </h3>
                  <div className="mt-2 text-sm text-purple-800">
                    <p>
                      Cliquez sur <strong className="bg-purple-600 text-white px-2 py-0.5 rounded text-xs inline-flex items-center gap-1"><Palette className="w-3.5 h-3.5" /> Personnaliser</strong> pour configurer les options de chaque plat (sauces, suppléments, ingrédients à retirer, etc.).
                      Les boissons ne peuvent pas être personnalisées.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                Rechercher
              </label>
              <input
                type="text"
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Rechercher par titre ou description..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500"
              />
            </div>

            {/* Category Filter */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Catégorie
              </label>
              <select
                id="category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500"
              >
                <option value="all">Toutes les catégories</option>
                {categories.map((category) => (
                  <option key={category?.id} value={category?.name}>
                    {category?.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500">Total menus</div>
            <div className="text-2xl font-bold text-gray-900">{menuItems.length}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500">Disponibles</div>
            <div className="text-2xl font-bold text-green-600">
              {menuItems.filter(m => m.available).length}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500">Indisponibles</div>
            <div className="text-2xl font-bold text-red-600">
              {menuItems.filter(m => !m.available).length}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500">Catégories</div>
            <div className="text-2xl font-bold text-gray-900">{categories.length}</div>
          </div>
        </div>

        {/* Menu List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Menu
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Catégorie
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Prix C&C / Liv
                  </th>
                  <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ⭐ Bestseller
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Modes
                  </th>
                  <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Personnalisations
                  </th>
                  <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredMenus.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-12 w-12 flex-shrink-0">
                          <img
                            className="h-12 w-12 rounded-lg object-cover"
                            src={item.image}
                            alt={item.title}
                          />
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900 flex items-center">
                            {item.title}
                            {item.badge && (
                              <span className={`ml-1 px-1.5 py-0.5 text-xs font-bold rounded-full ${
                                item.badge === 'HOT' ? 'bg-red-100 text-red-800' :
                                item.badge === 'NEW' ? 'bg-green-100 text-green-800' :
                                'bg-blue-100 text-blue-800'
                              }`}>
                                {item.badge}
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-gray-500 truncate max-w-xs">
                            {item.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {item.category.name}
                      </span>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900 font-medium">
                      {(
                        (item.priceClickAndCollect ?? item.price).toFixed(2)
                      )}€ / {(
                        (item.priceDelivery ?? item.price).toFixed(2)
                      )}€
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-center">
                      <button
                        onClick={() => toggleBestSeller(item)}
                        disabled={bestSellerLoading === item.id}
                        title={item.isBestSeller ? 'Retirer des bestsellers' : 'Ajouter aux bestsellers'}
                        className="transition-transform hover:scale-110 disabled:opacity-50 disabled:cursor-wait inline-flex items-center justify-center"
                      >
                        {bestSellerLoading === item.id ? (
                          <Loader2 className="w-6 h-6 animate-spin text-gray-500" />
                        ) : item.isBestSeller ? (
                          <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                        ) : (
                          <Star className="w-6 h-6 text-gray-300 hover:text-yellow-300" />
                        )}
                      </button>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap">
                      <button
                        onClick={() => toggleAvailability(item.id, item.available)}
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          item.available
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                        }`}
                      >
                        {item.available ? '✓ Dispo' : '✗ Indispo'}
                      </button>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-2">
                        <span className={`text-xs ${item.availableForClickAndCollect ? 'text-green-600' : 'text-red-600'}`}>
                          C&C {item.availableForClickAndCollect ? '✓' : '✗'}
                        </span>
                        <span className={`text-xs ${item.availableForDelivery ? 'text-green-600' : 'text-red-600'}`}>
                          Liv {item.availableForDelivery ? '✓' : '✗'}
                        </span>
                      </div>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-center">
                      {item.category.slug !== 'boissons' ? (
                        item.customizations && item.customizations.length > 0 ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            {item.customizations.length} configurée{item.customizations.length > 1 ? 's' : ''}
                          </span>
                        ) : (
                          <span className="text-xs text-gray-400">
                            Aucune
                          </span>
                        )
                      ) : (
                        <span className="text-xs text-gray-400">
                          N/A
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end items-center space-x-2">
                        {/* Bouton Personnalisations - désactivé pour les boissons */}
                        {item.category.slug !== 'boissons' ? (
                          <button
                            onClick={() => {
                              setCustomizingMenuItem(item);
                              setShowCustomizationsModal(true);
                            }}
                            className="px-3 py-1.5 bg-purple-600 text-white text-xs font-medium rounded hover:bg-purple-700 transition-colors"
                            title="Gérer les personnalisations (sauces, suppléments, etc.)"
                          >
                            <span className="inline-flex items-center gap-1">
                              <Palette className="w-3.5 h-3.5" />
                              Personnaliser
                            </span>
                          </button>
                        ) : (
                          <span 
                            className="px-3 py-1.5 bg-gray-200 text-gray-500 text-xs font-medium rounded cursor-not-allowed"
                            title="Les boissons n'ont pas de personnalisations"
                          >
                            <span className="inline-flex items-center gap-1">
                              <Palette className="w-3.5 h-3.5" />
                              Personnaliser
                            </span>
                          </span>
                        )}
                        <button
                          onClick={() => handleEditMenuItem(item)}
                          className="text-indigo-600 hover:text-indigo-900 font-medium"
                        >
                          <span className="inline-flex items-center gap-1">
                            <Pencil className="w-4 h-4" />
                            Modifier
                          </span>
                        </button>
                        <button
                          onClick={() => handleDelete(item.id, item.title)}
                          className="text-red-600 hover:text-red-900 font-medium"
                        >
                          <span className="inline-flex items-center gap-1">
                            <Trash2 className="w-4 h-4" />
                            Supprimer
                          </span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredMenus.length === 0 && (
            <div className="text-center py-12">
              <div className="flex justify-center mb-4">
                <UtensilsCrossed className="w-16 h-16 text-gray-300" />
              </div>
              <h3 className="text-xl font-medium text-black mb-2">
                Aucun menu trouvé
              </h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || selectedCategory !== 'all' 
                  ? 'Aucun menu ne correspond à vos critères de recherche.'
                  : 'Commencez par ajouter votre premier menu.'
                }
              </p>
              {!searchTerm && selectedCategory === 'all' && (
                <Link
                  href="/admin/menu/new"
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium"
                >
                  Ajouter un menu
                </Link>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Edit Menu Modal */}
      {editingMenuItem && (
        <EditMenuModal
          menuItem={editingMenuItem}
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setEditingMenuItem(null);
          }}
          onSave={handleSaveMenuItem}
        />
      )}

      {/* Customizations Modal */}
      {customizingMenuItem && (
        <CustomizationsModal
          menuId={customizingMenuItem.id}
          menuTitle={customizingMenuItem.title}
          isOpen={showCustomizationsModal}
          onClose={() => {
            setShowCustomizationsModal(false);
            setCustomizingMenuItem(null);
          }}
          onSave={() => {
            fetchMenuItems();
          }}
        />
      )}
    </div>
  );
}