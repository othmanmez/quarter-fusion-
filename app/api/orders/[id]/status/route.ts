import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Configuration pour Next.js - route dynamique
export const dynamic = 'force-dynamic';
import { auth } from '@/lib/auth';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Vérifier l'authentification admin
    const session = await auth();
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    // Récupération des données de la requête
    const body = await request.json();
    const { status } = body;

    // Validation du statut (utilise les valeurs de l'enum Prisma)
    const validStatuses = ['A_PREPARER', 'EN_ATTENTE', 'EN_PREPARATION', 'PRETE', 'TERMINEE', 'ANNULEE'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Statut invalide' },
        { status: 400 }
      );
    }

    // Recherche de la commande
    const order = await prisma.order.findUnique({
      where: { id }
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Commande non trouvée' },
        { status: 404 }
      );
    }

    // Mise à jour du statut de la commande
    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { 
        status,
        updatedAt: new Date()
      }
    });

    // Note: Email notification could be added here if needed
    // if (status === 'PRETE' && order.status !== 'PRETE') {
    //   // Send notification email
    // }

    return NextResponse.json({
      success: true,
      order: updatedOrder,
      message: 'Statut de la commande mis à jour avec succès'
    });

  } catch (error) {
    console.error('Erreur lors de la mise à jour du statut:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}