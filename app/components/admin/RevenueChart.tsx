'use client';

import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DashboardData } from '@/app/types/admin';

export default function RevenueChart() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/admin/dashboard');
        const result = await response.json();
        setData(result.data);
      } catch (error) {
        console.error('Error fetching chart data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
        <div className="h-6 bg-gray-200 rounded animate-pulse mb-4 w-1/3"></div>
        <div className="h-80 bg-gray-100 rounded animate-pulse"></div>
      </div>
    );
  }

  const chartData = data?.weeklyRevenue.map(day => ({
    date: new Date(day.date).toLocaleDateString('fr-FR', { 
      weekday: 'short',
      day: 'numeric'
    }),
    revenue: day.revenue,
    orders: day.orders,
  })) || [];

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Chiffre d'affaires - 7 derniers jours
        </h3>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
            <span className="text-gray-600">Revenue</span>
          </div>
        </div>
      </div>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis 
              dataKey="date" 
              stroke="#6b7280"
              fontSize={12}
            />
            <YAxis 
              stroke="#6b7280"
              fontSize={12}
              tickFormatter={(value) => `${value}€`}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
              }}
              formatter={(value: number, name: string) => [
                name === 'revenue' ? `${value.toFixed(2)}€` : value,
                name === 'revenue' ? 'Chiffre d\'affaires' : 'Commandes'
              ]}
              labelStyle={{ color: '#374151', fontWeight: 'medium' }}
            />
            <Line 
              type="monotone" 
              dataKey="revenue" 
              stroke="#dc2626" 
              strokeWidth={3}
              dot={{ fill: '#dc2626', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#dc2626', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      {chartData.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <div className="text-4xl mb-2">📈</div>
            <p>Aucune donnée disponible</p>
          </div>
        </div>
      )}
    </div>
  );
}