'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface DeliveryCity {
  id: string;
  name: string;
  postalCode: string | null;
  deliveryFee: number;
  minOrder: number | null;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function DeliveryCitiesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [cities, setCities] = useState<DeliveryCity[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCity, setEditingCity] = useState<DeliveryCity | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    postalCode: '',
    deliveryFee: '',
    minOrder: ''
  });

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/admin/login');
      return;
    }

    fetchCities();
  }, [session, status, router]);

  const fetchCities = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/delivery-cities');
      const data = await response.json();

      if (data.success) {
        setCities(data.cities || []);
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingCity 
        ? `/api/delivery-cities/${editingCity.id}`
        : '/api/delivery-cities';
      
      const method = editingCity ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          postalCode: formData.postalCode || null,
          deliveryFee: parseFloat(formData.deliveryFee),
          minOrder: formData.minOrder ? parseFloat(formData.minOrder) : null
        })
      });

      const data = await response.json();

      if (data.success) {
        fetchCities();
        setShowModal(false);
        resetForm();
      } else {
        alert('Erreur: ' + data.error);
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de l\'enregistrement');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Supprimer la ville "${name}" ?`)) return;

    try {
      const response = await fetch(`/api/delivery-cities/${id}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (data.success) {
        fetchCities();
      } else {
        alert('Erreur: ' + data.error);
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la suppression');
    }
  };

  const toggleActive = async (city: DeliveryCity) => {
    try {
      const response = await fetch(`/api/delivery-cities/${city.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !city.active })
      });

      const data = await response.json();

      if (data.success) {
        fetchCities();
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const openEditModal = (city: DeliveryCity) => {
    setEditingCity(city);
    setFormData({
      name: city.name,
      postalCode: city.postalCode || '',
      deliveryFee: city.deliveryFee.toString(),
      minOrder: city.minOrder?.toString() || ''
    });
    setShowModal(true);
  };

  const openNewModal = () => {
    resetForm();
    setShowModal(true);
  };

  const resetForm = () => {
    setEditingCity(null);
    setFormData({
      name: '',
      postalCode: '',
      deliveryFee: '',
      minOrder: ''
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Villes de livraison
          </h1>
          <p className="text-gray-600">
            Gérez les villes et frais de livraison
          </p>
        </div>
        <button
          onClick={openNewModal}
          className="bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          + Nouvelle ville
        </button>
      </div>

      {/* Liste des villes */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Ville
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Code postal
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Frais de livraison
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Minimum commande
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {cities.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    Aucune ville configurée. Cliquez sur "Nouvelle ville" pour commencer.
                  </td>
                </tr>
              ) : (
                cities.map((city) => (
                  <tr key={city.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {city.name}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {city.postalCode || '-'}
                    </td>
                    <td className="px-6 py-4 text-gray-900 font-medium">
                      {city.deliveryFee.toFixed(2)}€
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {city.minOrder ? `${city.minOrder.toFixed(2)}€` : '-'}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleActive(city)}
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          city.active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {city.active ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => openEditModal(city)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Modifier"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDelete(city.id, city.name)}
                          className="text-red-600 hover:text-red-800"
                          title="Supprimer"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal d'ajout/modification */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingCity ? 'Modifier la ville' : 'Nouvelle ville'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom de la ville *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500"
                    placeholder="Ex: Cergy"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Code postal (optionnel)
                  </label>
                  <input
                    type="text"
                    value={formData.postalCode}
                    onChange={(e) => setFormData(prev => ({ ...prev, postalCode: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500"
                    placeholder="Ex: 95000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Frais de livraison (€) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.deliveryFee}
                    onChange={(e) => setFormData(prev => ({ ...prev, deliveryFee: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500"
                    placeholder="Ex: 2.50"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Minimum de commande (€) (optionnel)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.minOrder}
                    onChange={(e) => setFormData(prev => ({ ...prev, minOrder: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500"
                    placeholder="Ex: 20.00"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Laissez vide pour utiliser le minimum général
                  </p>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      resetForm();
                    }}
                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-red-700 text-white rounded-md hover:bg-red-800"
                  >
                    {editingCity ? 'Enregistrer' : 'Créer'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

