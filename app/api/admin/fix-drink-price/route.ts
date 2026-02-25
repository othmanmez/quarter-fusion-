import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// GET - Voir les articles concernés (sans modifier)
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const items = await prisma.menu.findMany({
      where: { allowDrinkOption: true },
      select: { id: true, title: true, drinkPrice: true },
    });

    const toFix = items.filter(i => i.drinkPrice === 1.5 || i.drinkPrice == null);

    return NextResponse.json({
      success: true,
      total: items.length,
      toFix: toFix.length,
      items: items.map(i => ({
        id: i.id,
        title: i.title,
        drinkPrice: i.drinkPrice,
        needsFix: i.drinkPrice === 1.5 || i.drinkPrice == null,
      })),
    });
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// POST - Mettre à jour drinkPrice 1.5 → 2 pour tous les articles concernés
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const result = await prisma.menu.updateMany({
      where: {
        allowDrinkOption: true,
        drinkPrice: 1.5,
      },
      data: { drinkPrice: 2 },
    });

    // Aussi corriger les null
    const resultNull = await prisma.menu.updateMany({
      where: {
        allowDrinkOption: true,
        drinkPrice: { equals: null },
      },
      data: { drinkPrice: 2 },
    });

    return NextResponse.json({
      success: true,
      message: `${result.count + resultNull.count} article(s) mis à jour : drinkPrice → 2€`,
      updated: result.count + resultNull.count,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
