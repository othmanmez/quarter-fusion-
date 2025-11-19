'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface OrderItem {
  title: string;
  quantity: number;
  price: number;
  description?: string;
  customizations?: {
    name: string;
    selectedOptions: string[];
    priceExtra: number;
  }[];
}

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: OrderItem[];
  total: number;
  deliveryAddress?: string;
  city?: string;
  isDelivery: boolean;
  status: string;
  estimatedTime: string;
  paymentMethod: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

const STATUS_LABELS: Record<string, string> = {
  A_PREPARER: 'À préparer',
  EN_ATTENTE: 'En attente',
  EN_PREPARATION: 'En préparation',
  PRETE: 'Prête',
  TERMINEE: 'Terminée',
  ANNULEE: 'Annulée',
};

const STATUS_COLORS: Record<string, string> = {
  A_PREPARER: 'bg-yellow-100 text-yellow-800',
  EN_ATTENTE: 'bg-blue-100 text-blue-800',
  EN_PREPARATION: 'bg-purple-100 text-purple-800',
  PRETE: 'bg-green-100 text-green-800',
  TERMINEE: 'bg-gray-100 text-gray-800',
  ANNULEE: 'bg-red-100 text-red-800',
};

export default function AdminOrdersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/admin/login');
      return;
    }

    fetchOrders();
  }, [session, status, router]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/orders');
      const data = await response.json();

      if (data.success) {
        setOrders(data.orders || []);
      } else {
        setError('Erreur lors du chargement des commandes');
      }
    } catch (error) {
      console.error('Erreur:', error);
      setError('Erreur lors du chargement des commandes');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();

      if (data.success) {
        setOrders(orders.map(order => 
          order.id === orderId ? { ...order, status: newStatus } : order
        ));
      } else {
        alert('Erreur lors de la mise à jour: ' + data.error);
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la mise à jour');
    }
  };

  const handlePrint = async (order: Order) => {
    try {
      // URL du service d'impression local (configurable via variable d'environnement)
      const printerServiceUrl = process.env.NEXT_PUBLIC_PRINTER_SERVICE_URL || 'http://localhost:9000';
      
      const response = await fetch(`${printerServiceUrl}/print`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderNumber: order.orderNumber,
          customerName: order.customerName,
          phone: order.customerPhone,
          items: order.items,
          total: order.total,
          isDelivery: order.isDelivery,
          deliveryAddress: order.deliveryAddress,
          city: order.city,
          paymentMethod: order.paymentMethod,
          notes: order.notes,
          createdAt: order.createdAt
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        alert('✅ Ticket imprimé avec succès !');
      } else {
        alert('❌ Erreur d\'impression : ' + result.error);
      }
    } catch (error: any) {
      console.error('Erreur d\'impression:', error);
      alert('❌ Service d\'impression non disponible.\n\nVérifiez que le service est démarré sur votre PC en lançant start-printer.bat');
    }
  };

  const toggleOrderDetails = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  // Filtrer les commandes
  const filteredOrders = orders.filter(order => {
    const matchesStatus = selectedStatus === 'all' || order.status === selectedStatus;
    const matchesSearch = 
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerPhone.includes(searchTerm);
    return matchesStatus && matchesSearch;
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
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchOrders}
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
              <h1 className="text-3xl font-bold text-gray-900">Gestion des Commandes</h1>
              <p className="text-gray-600">
                Gérez et suivez toutes les commandes
              </p>
            </div>
            <button
              onClick={fetchOrders}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium"
            >
              🔄 Actualiser
            </button>
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
                placeholder="Rechercher par numéro, nom, email ou téléphone..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500"
              />
            </div>

            {/* Status Filter */}
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                Statut
              </label>
              <select
                id="status"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500"
              >
                <option value="all">Tous les statuts</option>
                {Object.entries(STATUS_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
          {Object.entries(STATUS_LABELS).map(([status, label]) => {
            const count = orders.filter(o => o.status === status).length;
            return (
              <div key={status} className="bg-white rounded-lg shadow p-4">
                <div className="text-xs font-medium text-gray-500">{label}</div>
                <div className={`text-2xl font-bold ${STATUS_COLORS[status].split(' ')[1]}`}>
                  {count}
                </div>
              </div>
            );
          })}
        </div>

        {/* Orders List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📋</div>
              <h3 className="text-xl font-medium text-gray-600 mb-2">
                Aucune commande trouvée
              </h3>
              <p className="text-gray-500">
                {searchTerm || selectedStatus !== 'all' 
                  ? 'Aucune commande ne correspond à vos critères de recherche.'
                  : 'Les nouvelles commandes apparaîtront ici.'
                }
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <div key={order.id} className="p-6 hover:bg-gray-50">
                  {/* Order Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-bold text-gray-900">
                          {order.orderNumber}
                        </h3>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[order.status]}`}>
                          {STATUS_LABELS[order.status]}
                        </span>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          order.isDelivery ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {order.isDelivery ? '🚚 Livraison' : '🏪 Click & Collect'}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        <p><strong>Client:</strong> {order.customerName}</p>
                        <p><strong>Téléphone:</strong> {order.customerPhone}</p>
                        {order.isDelivery && order.deliveryAddress && (
                          <p><strong>Adresse:</strong> {order.deliveryAddress}, {order.city}</p>
                        )}
                        <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleString('fr-FR')}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900 mb-2">
                        {order.total.toFixed(2)}€
                      </div>
                      <div className="text-sm text-gray-600">
                        {order.paymentMethod === 'ESPECES' ? '💵 Espèces' : '💳 Carte'}
                      </div>
                    </div>
                  </div>

                  {/* Status Update */}
                  <div className="flex items-center space-x-2 mb-4">
                    <label className="text-sm font-medium text-gray-700">
                      Changer le statut:
                    </label>
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                      className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500 text-sm"
                    >
                      {Object.entries(STATUS_LABELS).map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => toggleOrderDetails(order.id)}
                      className="text-red-600 hover:text-red-700 text-sm font-medium"
                    >
                      {expandedOrder === order.id ? '▼ Masquer les détails' : '▶ Voir les détails'}
                    </button>
                    <button
                      onClick={() => handlePrint(order)}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors inline-flex items-center space-x-2"
                    >
                      <span>🖨️</span>
                      <span>Imprimer</span>
                    </button>
                  </div>

                  {/* Order Details */}
                  {expandedOrder === order.id && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-3">Articles commandés:</h4>
                      <div className="space-y-3">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex justify-between items-start border-b border-gray-200 pb-2">
                            <div className="flex-1">
                              <div className="font-medium text-gray-900">
                                {item.quantity}x {item.title}
                              </div>
                              {item.description && (
                                <div className="text-sm text-gray-600">{item.description}</div>
                              )}
                              {item.customizations && item.customizations.length > 0 && (
                                <div className="text-xs text-blue-600 mt-1">
                                  {item.customizations.map((custom, idx) => (
                                    <div key={idx}>
                                      {custom.name}: {custom.selectedOptions.join(', ')}
                                      {custom.priceExtra > 0 && ` (+${custom.priceExtra.toFixed(2)}€)`}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                            <div className="font-medium text-gray-900">
                              {(item.price * item.quantity).toFixed(2)}€
                            </div>
                          </div>
                        ))}
                      </div>
                      {order.notes && (
                        <div className="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400">
                          <p className="text-sm font-semibold text-gray-900">Notes:</p>
                          <p className="text-sm text-gray-700">{order.notes}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

