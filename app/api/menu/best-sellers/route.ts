import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// GET — Récupérer les bestsellers (isBestSeller = true en priorité, badge en fallback)
export async function GET() {
  try {
    // Priorité 1 : menus explicitement marqués bestseller par l'admin
    let bestSellers = await prisma.menu.findMany({
      where: { isBestSeller: true },
      include: {
        category: { select: { id: true, name: true, slug: true } }
      },
      orderBy: { updatedAt: 'desc' },
      take: 3,
    });

    // Fallback : si aucun bestseller défini, utiliser les badges
    if (bestSellers.length === 0) {
      bestSellers = await prisma.menu.findMany({
        where: {
          badge: { in: ['HOT', 'NEW', 'TOP'] },
          available: true,
        },
        include: {
          category: { select: { id: true, name: true, slug: true } }
        },
        orderBy: [{ badge: 'asc' }, { createdAt: 'desc' }],
        take: 3,
      });
    }

    return NextResponse.json({ success: true, items: bestSellers });
  } catch (error) {
    console.error('Erreur best-sellers:', error);
    return NextResponse.json({ success: false, error: 'Erreur serveur' }, { status: 500 });
  }
}

// POST — Définir/retirer un bestseller (body: { menuId, isBestSeller })
export async function POST(request: NextRequest) {
  try {
    const { menuId, isBestSeller } = await request.json();

    if (!menuId || typeof isBestSeller !== 'boolean') {
      return NextResponse.json({ error: 'menuId et isBestSeller requis' }, { status: 400 });
    }

    // Vérifier la limite de 3 si on ajoute un bestseller
    if (isBestSeller) {
      const count = await prisma.menu.count({ where: { isBestSeller: true } });
      if (count >= 3) {
        return NextResponse.json({
          error: 'Vous avez déjà 3 bestsellers. Retirez-en un avant d\'en ajouter un nouveau.',
          limitReached: true,
        }, { status: 400 });
      }
    }

    const updated = await prisma.menu.update({
      where: { id: menuId },
      data: { isBestSeller },
      include: { category: { select: { id: true, name: true, slug: true } } },
    });

    return NextResponse.json({ success: true, item: updated });
  } catch (error) {
    console.error('Erreur toggle bestseller:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}