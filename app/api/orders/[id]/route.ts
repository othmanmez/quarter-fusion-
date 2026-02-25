import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

// Configuration pour Next.js - route dynamique
export const dynamic = 'force-dynamic';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Vérifier l'authentification admin
    const session = await auth();
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const existing = await prisma.order.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Commande non trouvée' }, { status: 404 });
    }

    await prisma.order.delete({ where: { id } });

    return NextResponse.json({
      success: true,
      message: 'Commande supprimée avec succès',
    });
  } catch (error) {
    console.error('Erreur suppression commande:', error);
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
  }
}

