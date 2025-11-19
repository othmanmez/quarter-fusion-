import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Configuration pour Next.js - route dynamique
export const dynamic = 'force-dynamic';
import { DashboardData } from '@/app/types/admin';
import { z } from 'zod';

// Validation du paramètre de requête
const querySchema = z.object({
  period: z.enum(['today', 'week', 'month']).optional().default('today'),
});

export async function GET(request: NextRequest) {
  try {
    // Authentification avec la nouvelle approche Next.js 15
    const session = await auth();
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Admin access required' },
        { status: 401 }
      );
    }

    // Validation des paramètres
    const { searchParams } = new URL(request.url);
    const { period } = querySchema.parse({
      period: searchParams.get('period'),
    });

    // Calcul des dates basé sur la période
    const getDateRange = (period: string) => {
      const now = new Date();
      const start = new Date();
      
      switch (period) {
        case 'today':
          start.setHours(0, 0, 0, 0);
          break;
        case 'week':
          start.setDate(start.getDate() - 7);
          break;
        case 'month':
          start.setMonth(start.getMonth() - 1);
          break;
      }
      
      return { start, end: now };
    };

    const { start: startDate, end: endDate } = getDateRange(period);

    // Utilisation de Prisma avec des requêtes parallèles pour les performances
    const [
      periodStats,
      totalStats,
      pendingOrders,
      recentOrders,
      weeklyData
    ] = await Promise.all([
      // Statistiques de la période
      prisma.order.aggregate({
        where: {
          createdAt: { gte: startDate, lte: endDate },
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
      
      // Données de la semaine (simulation pour MongoDB - remplacer par une vraie agrégation si nécessaire)
      Promise.resolve([
        { date: '2024-01-15', orders: 8, revenue: 234.50 },
        { date: '2024-01-16', orders: 12, revenue: 356.80 },
        { date: '2024-01-17', orders: 15, revenue: 428.90 },
        { date: '2024-01-18', orders: 10, revenue: 287.60 },
        { date: '2024-01-19', orders: 18, revenue: 512.30 },
        { date: '2024-01-20', orders: 22, revenue: 634.70 },
        { date: '2024-01-21', orders: 16, revenue: 445.20 },
      ])
    ]);

    // Construction de la réponse avec typage strict
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
      recentOrders: recentOrders.map((order: any) => ({
        ...order,
        customerName: order.customerEmail.split('@')[0],
        items: Array.isArray(order.items) ? order.items.map((item: any) => ({
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
      weeklyRevenue: Array.isArray(weeklyData) ? weeklyData.map((day: any) => ({
        date: day.date,
        revenue: Number(day.revenue) || 0,
        orders: Number(day.orders) || 0,
      })) : [],
    };

    return NextResponse.json({
      success: true,
      data: dashboardData,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Dashboard API error:', error);
    
    // Gestion d'erreur plus détaillée en 2025
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Validation Error', 
          details: error.issues,
          message: 'Invalid request parameters'
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        error: 'Internal Server Error',
        message: 'Failed to fetch dashboard data',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}