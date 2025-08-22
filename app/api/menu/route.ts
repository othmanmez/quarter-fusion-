import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const mode = searchParams.get('mode'); // 'click-and-collect' ou 'delivery'

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

    // Récupération de tous les éléments du menu disponibles avec leurs catégories
    const menuItems = await prisma.menu.findMany({
      where: whereConditions,
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
      orderBy: [
        { category: { name: 'asc' } },
        { title: 'asc' },
      ],
    });

    // Grouper par catégorie
    const menuByCategory = menuItems.reduce((acc, item) => {
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
    if (!title || !description || !price || !categoryId || !image) {
      return NextResponse.json(
        { error: 'Tous les champs sont requis' },
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
        image,
        badge,
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