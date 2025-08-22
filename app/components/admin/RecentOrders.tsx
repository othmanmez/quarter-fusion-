import { getDashboardData } from '@/lib/admin/dashboard';
import Link from 'next/link';
import type { OrderWithDetails } from '@/app/types/admin';

const statusColors = {
  'A_PREPARER': 'bg-yellow-100 text-yellow-800',
  'EN_ATTENTE': 'bg-blue-100 text-blue-800',
  'EN_PREPARATION': 'bg-orange-100 text-orange-800',
  'PRETE': 'bg-green-100 text-green-800',
  'TERMINEE': 'bg-gray-100 text-gray-800',
  'ANNULEE': 'bg-red-100 text-red-800',
};

const statusLabels = {
  'A_PREPARER': 'À préparer',
  'EN_ATTENTE': 'En attente',
  'EN_PREPARATION': 'En préparation',
  'PRETE': 'Prête',
  'TERMINEE': 'Terminée',
  'ANNULEE': 'Annulée',
};

export default async function RecentOrders() {
  const data = await getDashboardData();
  const { recentOrders } = data;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            Commandes récentes
          </h3>
          <Link 
            href="/admin/orders"
            className="text-sm text-red-600 hover:text-red-700 font-medium"
          >
            Voir toutes →
          </Link>
        </div>
      </div>
      
      <div className="overflow-hidden">
        {recentOrders.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {recentOrders.map((order: OrderWithDetails) => (
              <div key={order.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-red-100 text-red-600 rounded-full flex items-center justify-center font-semibold">
                        {order.orderNumber.slice(-2)}
                      </div>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        #{order.orderNumber}
                      </div>
                      <div className="text-sm text-gray-500">
                        {order.customerName} • {order.isDelivery ? 'Livraison' : 'Click & Collect'}
                      </div>
                      <div className="text-xs text-gray-400">
                        {new Date(order.createdAt).toLocaleTimeString('fr-FR', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">
                      {order.total.toFixed(2)}€
                    </div>
                    <span 
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        statusColors[order.status]
                      }`}
                    >
                      {statusLabels[order.status]}
                    </span>
                  </div>
                </div>
                
                {order.items && order.items.length > 0 && (
                  <div className="mt-3 text-sm text-gray-600">
                    {order.items.slice(0, 2).map((item, index) => (
                      <span key={index}>
                        {item.quantity}x {item.title}
                        {index < Math.min(order.items.length, 2) - 1 && ', '}
                      </span>
                    ))}
                    {order.items.length > 2 && (
                      <span className="text-gray-400">
                        {' '}et {order.items.length - 2} autre(s)
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center text-gray-500">
            <div className="text-4xl mb-2">📦</div>
            <p>Aucune commande récente</p>
          </div>
        )}
      </div>
    </div>
  );
}