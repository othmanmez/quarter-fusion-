import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// PUT - Modifier une ville de livraison
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Vérifier l'authentification admin
    const session = await auth();
    if (!session || session.user?.role?.toLowerCase() !== 'admin') {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, postalCode, deliveryFee, minOrder, active } = body;

    // Validation
    if (deliveryFee !== undefined && deliveryFee < 0) {
      return NextResponse.json(
        { error: 'Les frais de livraison doivent être >= 0' },
        { status: 400 }
      );
    }

    // Mettre à jour
    const city = await prisma.deliveryCity.update({
      where: { id: params.id },
      data: {
        ...(name && { name: name.trim() }),
        ...(postalCode !== undefined && { postalCode: postalCode?.trim() || null }),
        ...(deliveryFee !== undefined && { deliveryFee: parseFloat(deliveryFee) }),
        ...(minOrder !== undefined && { minOrder: minOrder ? parseFloat(minOrder) : null }),
        ...(active !== undefined && { active })
      }
    });

    return NextResponse.json({
      success: true,
      city
    });
  } catch (error) {
    console.error('Erreur lors de la modification de la ville:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer une ville de livraison
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Vérifier l'authentification admin
    const session = await auth();
    if (!session || session.user?.role?.toLowerCase() !== 'admin') {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    await prisma.deliveryCity.delete({
      where: { id: params.id }
    });

    return NextResponse.json({
      success: true,
      message: 'Ville supprimée avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la suppression de la ville:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

