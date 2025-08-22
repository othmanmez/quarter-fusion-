import { getDashboardData } from '@/lib/admin/dashboard';
import type { PopularItem } from '@/app/types/admin';

export default async function PopularItems() {
  const data = await getDashboardData();
  const { popularItems } = data;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Plats populaires
      </h3>
      <div className="space-y-3">
        {popularItems.length > 0 ? (
          popularItems.map((item: PopularItem, index: number) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center font-semibold text-sm mr-3">
                  {index + 1}
                </div>
                <div>
                  <div className="font-medium text-gray-900">{item.title}</div>
                  <div className="text-sm text-gray-500">{item.quantity} vendus</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-gray-900">{item.revenue.toFixed(2)}€</div>
                <div className="text-sm text-gray-500">CA</div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">📊</div>
            <p>Aucune donnée disponible</p>
          </div>
        )}
      </div>
    </div>
  );
}