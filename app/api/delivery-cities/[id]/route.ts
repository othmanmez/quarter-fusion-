import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// PUT - Mettre à jour une ville
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, postalCode, deliveryFee, minOrder, active } = body;

    // Validation
    if (name && (typeof name !== 'string' || name.trim().length === 0)) {
      return NextResponse.json(
        { success: false, error: 'Le nom de la ville est invalide' },
        { status: 400 }
      );
    }

    if (deliveryFee !== undefined && (typeof deliveryFee !== 'number' || deliveryFee < 0)) {
      return NextResponse.json(
        { success: false, error: 'Les frais de livraison doivent être positifs' },
        { status: 400 }
      );
    }

    // Vérifier si la ville existe
    const existingCity = await prisma.deliveryCity.findUnique({
      where: { id },
    });

    if (!existingCity) {
      return NextResponse.json(
        { success: false, error: 'Ville non trouvée' },
        { status: 404 }
      );
    }

    // Si le nom change, vérifier qu'il n'existe pas déjà
    if (name && name.trim() !== existingCity.name) {
      const duplicateCity = await prisma.deliveryCity.findUnique({
        where: { name: name.trim() },
      });

      if (duplicateCity) {
        return NextResponse.json(
          { success: false, error: 'Une ville avec ce nom existe déjà' },
          { status: 400 }
        );
      }
    }

    // Mettre à jour la ville
    const updatedCity = await prisma.deliveryCity.update({
      where: { id },
      data: {
        ...(name && { name: name.trim() }),
        ...(postalCode !== undefined && { postalCode: postalCode?.trim() || null }),
        ...(deliveryFee !== undefined && { deliveryFee: parseFloat(deliveryFee.toFixed(2)) }),
        ...(minOrder !== undefined && { minOrder: minOrder ? parseFloat(minOrder.toFixed(2)) : null }),
        ...(active !== undefined && { active }),
      },
    });

    return NextResponse.json({
      success: true,
      city: updatedCity,
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la ville:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la mise à jour de la ville' },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer une ville
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Vérifier si la ville existe
    const existingCity = await prisma.deliveryCity.findUnique({
      where: { id },
    });

    if (!existingCity) {
      return NextResponse.json(
        { success: false, error: 'Ville non trouvée' },
        { status: 404 }
      );
    }

    // Supprimer la ville
    await prisma.deliveryCity.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Ville supprimée avec succès',
    });
  } catch (error) {
    console.error('Erreur lors de la suppression de la ville:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la suppression de la ville' },
      { status: 500 }
    );
  }
}
