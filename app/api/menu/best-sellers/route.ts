import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Fetch menus with HOT, NEW, or TOP badges that are available
    const bestSellers = await prisma.menu.findMany({
      where: {
        badge: {
          in: ['HOT', 'NEW', 'TOP']
        },
        available: true
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        }
      },
      orderBy: [
        { badge: 'asc' }, // HOT first, then NEW, then TOP
        { createdAt: 'desc' }
      ],
      take: 3 // Limit to 3 best-sellers on homepage
    });

    return NextResponse.json({
      success: true,
      items: bestSellers
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des best-sellers:', error);
    return NextResponse.json({
      success: false,
      error: 'Erreur lors de la récupération des best-sellers'
    }, { status: 500 });
  }
}