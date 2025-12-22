import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Configuration pour Next.js - route dynamique
export const dynamic = 'force-dynamic';

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

    // Log pour debug
    console.log(`📊 Best sellers trouvés: ${bestSellers.length}`);
    bestSellers.forEach(item => {
      console.log(`  - ${item.title} (badge: ${item.badge}, available: ${item.available})`);
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