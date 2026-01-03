import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Configuration pour Next.js - route dynamique
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const mode = searchParams.get('mode'); // 'click-and-collect' ou 'delivery'
    const includeCustomizations = searchParams.get('includeCustomizations') === 'true';

    // Construire les conditions de filtre
    const whereConditions: any = {
      available: true,
    };

    // Ajouter le filtre par mode si spécifié
    if (mode === 'click-and-collect') {
      whereConditions.availableForClickAndCollect = true;
    } else if (mode === 'delivery') {
      whereConditions.availableForDelivery = true;
    }

    // Construire les options d'inclusion
    const includeOptions: any = {
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
    };

    // Inclure les personnalisations si demandé (pour l'interface admin)
    if (includeCustomizations) {
      includeOptions.customizations = true;
    }

    // Récupération de tous les éléments du menu disponibles avec leurs catégories
    const menuItems = await prisma.menu.findMany({
      where: whereConditions,
      include: includeOptions,
      orderBy: [
        { category: { name: 'asc' } },
        { title: 'asc' },
      ],
    });

    // Grouper par catégorie
    const menuByCategory = menuItems.reduce((acc: any, item: any) => {
      const categoryName = item.category.name;
      if (!acc[categoryName]) {
        acc[categoryName] = [];
      }
      acc[categoryName].push(item);
      return acc;
    }, {} as Record<string, any[]>);

    return NextResponse.json({
      success: true,
      menu: menuByCategory,
      items: menuItems,
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du menu:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

// POST - Créer un nouveau plat
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
    const { 
      title, 
      description, 
      price, 
      categoryId, 
      image, 
      badge,
      availableForClickAndCollect = true,
      availableForDelivery = true,
      available = true 
    } = body;

    // Validation
    if (!title || !description || !price || !categoryId) {
      return NextResponse.json(
        { error: 'Titre, description, prix et catégorie sont requis' },
        { status: 400 }
      );
    }

    if (price < 0) {
      return NextResponse.json(
        { error: 'Le prix doit être positif' },
        { status: 400 }
      );
    }

    // Vérifier si la catégorie existe
    const categoryExists = await prisma.category.findUnique({
      where: { id: categoryId }
    });
    if (!categoryExists) {
      return NextResponse.json(
        { error: 'Catégorie non trouvée' },
        { status: 404 }
      );
    }

    const menuItem = await prisma.menu.create({
      data: {
        title: title.trim(),
        description: description.trim(),
        price: parseFloat(price),
        categoryId,
        image: image || '/images/placeholder.svg', // Image par défaut si non fournie
        badge: badge ? badge.trim().toUpperCase() : null,
        available,
        availableForClickAndCollect,
        availableForDelivery,
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json({
      success: true,
      menuItem,
      message: 'Plat créé avec succès',
    }, { status: 201 });
  } catch (error) {
    console.error('Erreur lors de la création du plat:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer tous les menus
export async function DELETE(request: NextRequest) {
  try {
    // Vérifier l'authentification admin
    const session = await auth();
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    // Compter le nombre de menus avant suppression
    const menuCount = await prisma.menu.count();

    if (menuCount === 0) {
      return NextResponse.json({
        success: true,
        message: 'Aucun menu à supprimer',
        deletedCount: 0
      });
    }

    // Supprimer tous les menus (les personnalisations seront supprimées en cascade)
    const result = await prisma.menu.deleteMany({});

    return NextResponse.json({
      success: true,
      message: `${result.count} menu(s) supprimé(s) avec succès`,
      deletedCount: result.count
    });
  } catch (error) {
    console.error('Erreur lors de la suppression de tous les menus:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
} 