import { prisma } from '@/lib/prisma';
import { DashboardData } from '@/app/types/admin';

export async function getDashboardData(): Promise<DashboardData> {
  try {
    // Calcul des dates
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const endDate = new Date();

    // Requêtes parallèles pour les performances
    const [
      periodStats,
      totalStats,
      pendingOrders,
      recentOrders,
      weeklyData
    ] = await Promise.all([
      // Statistiques du jour
      prisma.order.aggregate({
        where: {
          createdAt: { gte: today, lte: endDate },
          status: { not: 'ANNULEE' },
        },
        _count: { _all: true },
        _sum: { total: true },
      }),
      
      // Statistiques totales
      prisma.order.aggregate({
        where: { status: { not: 'ANNULEE' } },
        _count: { _all: true },
        _sum: { total: true },
      }),
      
      // Commandes en attente
      prisma.order.count({
        where: {
          status: { in: ['A_PREPARER', 'EN_ATTENTE', 'EN_PREPARATION'] },
        },
      }),
      
      // Commandes récentes
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          orderNumber: true,
          customerEmail: true,
          customerPhone: true,
          items: true,
          total: true,
          isDelivery: true,
          status: true,
          createdAt: true,
        },
      }),
      
      // Données de la semaine (simulation pour MongoDB)
      generateWeeklyData()
    ]);

    // Construction de la réponse
    const dashboardData: DashboardData = {
      stats: {
        ordersToday: periodStats._count._all,
        revenueToday: Number(periodStats._sum.total) || 0,
        totalOrders: totalStats._count._all,
        totalRevenue: Number(totalStats._sum.total) || 0,
        averageOrderValue: totalStats._count._all > 0 
          ? Number(totalStats._sum.total) / totalStats._count._all 
          : 0,
        pendingOrders,
      },
      recentOrders: recentOrders.map(order => ({
        ...order,
        customerName: order.customerEmail.split('@')[0],
        items: Array.isArray(order.items) ? order.items.map(item => ({
          ...item,
          description: item.description || undefined
        })) : [],
        estimatedTime: '30-45 minutes',
        paymentMethod: 'CARTE' as const,
        updatedAt: order.createdAt,
        deliveryAddress: undefined,
        city: undefined,
        notes: undefined,
      })),
      popularItems: [
        { title: 'Quarter Fusion Burger', quantity: 45, revenue: 580.50 },
        { title: 'Wings Buffalo (6 pièces)', quantity: 32, revenue: 284.80 },
        { title: 'Bucket Maxi Fusion', quantity: 18, revenue: 448.20 },
      ],
      weeklyRevenue: weeklyData,
    };

    return dashboardData;
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    
    // Données par défaut en cas d'erreur
    return {
      stats: {
        ordersToday: 0,
        revenueToday: 0,
        totalOrders: 0,
        totalRevenue: 0,
        averageOrderValue: 0,
        pendingOrders: 0,
      },
      recentOrders: [],
      popularItems: [],
      weeklyRevenue: [],
    };
  }
}

// Génération de données de test pour la semaine
function generateWeeklyData() {
  const weeklyRevenue = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    // Simulation de données
    const baseRevenue = 200 + Math.random() * 300;
    const baseOrders = 8 + Math.floor(Math.random() * 15);
    
    weeklyRevenue.push({
      date: date.toISOString().split('T')[0],
      revenue: Math.round(baseRevenue * 100) / 100,
      orders: baseOrders,
    });
  }
  return weeklyRevenue;
}