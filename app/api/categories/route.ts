import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - Récupérer toutes les catégories
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { menus: true }
        }
      }
    });

    return NextResponse.json({
      success: true,
      categories,
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des catégories:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

// POST - Créer une nouvelle catégorie
export async function POST(request: NextRequest) {
  try {
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

    // Générer le slug si non fourni
    const finalSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    // Vérifier si la catégorie existe déjà
    const existingCategory = await prisma.category.findFirst({
      where: {
        OR: [
          { name: name.trim() },
          { slug: finalSlug }
        ]
      }
    });

    if (existingCategory) {
      return NextResponse.json(
        { error: 'Une catégorie avec ce nom ou ce slug existe déjà' },
        { status: 409 }
      );
    }

    const category = await prisma.category.create({
      data: {
        name: name.trim(),
        slug: finalSlug,
      },
    });

    return NextResponse.json({
      success: true,
      category,
      message: 'Catégorie créée avec succès',
    }, { status: 201 });
  } catch (error) {
    console.error('Erreur lors de la création de la catégorie:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
} 