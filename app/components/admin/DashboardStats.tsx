import { getDashboardData } from '@/lib/admin/dashboard';
import { Package, Wallet, ShoppingCart, Hourglass, TrendingUp, TrendingDown } from 'lucide-react';

export default async function DashboardStats() {
  const data = await getDashboardData();
  const { stats } = data;

  const statCards = [
    {
      title: 'Commandes aujourd\'hui',
      value: stats.ordersToday,
      icon: <Package className="w-6 h-6" />,
      color: 'bg-blue-500',
      change: '+12%',
      trend: 'up' as const,
    },
    {
      title: 'Chiffre d\'affaires',
      value: `${stats.revenueToday.toFixed(2)}€`,
      icon: <Wallet className="w-6 h-6" />,
      color: 'bg-green-500',
      change: '+8%',
      trend: 'up' as const,
    },
    {
      title: 'Panier moyen',
      value: `${stats.averageOrderValue.toFixed(2)}€`,
      icon: <ShoppingCart className="w-6 h-6" />,
      color: 'bg-purple-500',
      change: '+2%',
      trend: 'up' as const,
    },
    {
      title: 'En attente',
      value: stats.pendingOrders,
      icon: <Hourglass className="w-6 h-6" />,
      color: stats.pendingOrders > 5 ? 'bg-red-500' : 'bg-orange-500',
      change: stats.pendingOrders > 0 ? 'Action requise' : 'Tout ok',
      trend: stats.pendingOrders > 5 ? 'down' : 'up' as const,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((card, index) => (
        <div key={index} className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <div className="flex items-center">
            <div className={`${card.color} text-white p-3 rounded-lg text-2xl`}>
              {card.icon}
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-black">{card.title}</p>
              <p className="text-2xl font-semibold text-gray-900">{card.value}</p>
              <div className="flex items-center mt-1">
                <span 
                  className={`text-xs font-medium ${
                    card.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  <span className="inline-flex items-center gap-1">
                    {card.trend === 'up' ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                    {card.change}
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}