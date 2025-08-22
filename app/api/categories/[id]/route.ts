import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - Récupérer une catégorie par ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        menus: true,
        _count: {
          select: { menus: true }
        }
      },
    });

    if (!category) {
      return NextResponse.json(
        { error: 'Catégorie non trouvée' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      category,
    });
  } catch (error) {
    console.error('Erreur lors de la récupération de la catégorie:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

// PUT - Modifier une catégorie
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

    const body = await request.json();
    const { name, slug } = body;

    // Validation
    if (!name || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Le nom de la catégorie est requis' },
        { status: 400 }
      );
    }

    // Vérifier si la catégorie existe
    const existingCategory = await prisma.category.findUnique({
      where: { id }
    });
    if (!existingCategory) {
      return NextResponse.json(
        { error: 'Catégorie non trouvée' },
        { status: 404 }
      );
    }

    // Générer le slug si non fourni
    const finalSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    // Vérifier si le nouveau nom/slug existe déjà (sauf pour la même catégorie)
    const duplicateCategory = await prisma.category.findFirst({
      where: {
        AND: [
          { id: { not: id } },
          {
            OR: [
              { name: name.trim() },
              { slug: finalSlug }
            ]
          }
        ]
      }
    });

    if (duplicateCategory) {
      return NextResponse.json(
        { error: 'Une catégorie avec ce nom ou ce slug existe déjà' },
        { status: 409 }
      );
    }

    const updatedCategory = await prisma.category.update({
      where: { id },
      data: {
        name: name.trim(),
        slug: finalSlug,
      },
      include: {
        _count: {
          select: {
            menus: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      category: updatedCategory,
      message: 'Catégorie modifiée avec succès',
    });
  } catch (error) {
    console.error('Erreur lors de la modification de la catégorie:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer une catégorie
export async function DELETE(
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

    // Vérifier si la catégorie existe
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { menus: true }
        }
      }
    });
    
    if (!category) {
      return NextResponse.json(
        { error: 'Catégorie non trouvée' },
        { status: 404 }
      );
    }

    // Vérifier si des menus utilisent cette catégorie
    if (category._count.menus > 0) {
      return NextResponse.json(
        { 
          error: `Impossible de supprimer cette catégorie car ${category._count.menus} menu(s) l'utilise(nt)` 
        },
        { status: 409 }
      );
    }

    await prisma.category.delete({
      where: { id }
    });

    return NextResponse.json({
      success: true,
      message: 'Catégorie supprimée avec succès',
    });
  } catch (error) {
    console.error('Erreur lors de la suppression de la catégorie:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
} 