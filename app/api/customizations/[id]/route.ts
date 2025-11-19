import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// PUT - Modifier une personnalisation
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
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

    const { id } = await params;
    const body = await request.json();
    const { name, type, required, options } = body;

    const customization = await prisma.customization.update({
      where: { id },
      data: {
        ...(name && { name: name.trim() }),
        ...(type && { type }),
        ...(required !== undefined && { required }),
        ...(options && {
          options: options.map((opt: any) => ({
            name: opt.name,
            priceExtra: parseFloat(opt.priceExtra) || 0
          }))
        })
      }
    });

    return NextResponse.json({
      success: true,
      customization
    });
  } catch (error) {
    console.error('Erreur lors de la modification de la personnalisation:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer une personnalisation
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
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

    const { id } = await params;
    await prisma.customization.delete({
      where: { id }
    });

    return NextResponse.json({
      success: true,
      message: 'Personnalisation supprimée avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la suppression de la personnalisation:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

