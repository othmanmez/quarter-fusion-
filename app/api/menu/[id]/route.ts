import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Configuration pour Next.js - route dynamique
export const dynamic = 'force-dynamic';

// GET - Récupérer un menu par ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const menuItem = await prisma.menu.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });

    if (!menuItem) {
      return NextResponse.json(
        { error: 'Menu non trouvé' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      menuItem,
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du menu:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

// PUT - Modifier un menu
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
    const {
      title,
      description,
      price,
      priceClickAndCollect,
      priceDelivery,
      categoryId,
      image,
      badge,
      availableForClickAndCollect,
      availableForDelivery,
      available,
      allowDrinkOption,
      drinkPrice,
    } = body;

    // Validation (image non obligatoire lors de la modification)
    if (!title || !description || price === undefined || !categoryId) {
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

    if (priceClickAndCollect !== undefined && priceClickAndCollect < 0) {
      return NextResponse.json(
        { error: 'Le prix Click & Collect doit être positif' },
        { status: 400 }
      );
    }

    if (priceDelivery !== undefined && priceDelivery < 0) {
      return NextResponse.json(
        { error: 'Le prix Livraison doit être positif' },
        { status: 400 }
      );
    }

    // Vérifier si le menu existe
    const existingMenu = await prisma.menu.findUnique({
      where: { id: id }
    });
    if (!existingMenu) {
      return NextResponse.json(
        { error: 'Menu non trouvé' },
        { status: 404 }
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

    const nextImage = image && String(image).trim() !== '' ? image : existingMenu.image;

    const normalizedClickAndCollect =
      priceClickAndCollect !== undefined ? parseFloat(priceClickAndCollect) : existingMenu.priceClickAndCollect;
    const normalizedDelivery =
      priceDelivery !== undefined ? parseFloat(priceDelivery) : existingMenu.priceDelivery;
    const basePrice =
      price !== undefined
        ? parseFloat(price)
        : normalizedClickAndCollect ?? normalizedDelivery ?? existingMenu.price;

    const parsedDrinkPrice = drinkPrice !== undefined && drinkPrice !== null
      ? parseFloat(drinkPrice)
      : undefined;
    const nextDrinkPrice =
      parsedDrinkPrice !== undefined && !Number.isNaN(parsedDrinkPrice)
        ? parsedDrinkPrice
        : (existingMenu.drinkPrice ?? 1.5);

    const updatedMenuItem = await prisma.menu.update({
      where: { id: id },
      data: {
        title: title.trim(),
        description: description.trim(),
        price: basePrice,
        priceClickAndCollect: normalizedClickAndCollect,
        priceDelivery: normalizedDelivery,
        categoryId,
        image: nextImage,
        badge: badge ? badge.trim().toUpperCase() : null,
        available: available ?? true,
        availableForClickAndCollect: availableForClickAndCollect ?? true,
        availableForDelivery: availableForDelivery ?? true,
        allowDrinkOption: allowDrinkOption ?? false,
        drinkPrice: nextDrinkPrice,
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json({
      success: true,
      item: updatedMenuItem,
      message: 'Menu modifié avec succès',
    });
  } catch (error) {
    console.error('Erreur lors de la modification du menu:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer un menu
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

    // Vérifier si le menu existe
    const existingMenu = await prisma.menu.findUnique({
      where: { id: id }
    });
    if (!existingMenu) {
      return NextResponse.json(
        { error: 'Menu non trouvé' },
        { status: 404 }
      );
    }

    await prisma.menu.delete({
      where: { id: id }
    });

    return NextResponse.json({
      success: true,
      message: 'Menu supprimé avec succès',
    });
  } catch (error) {
    console.error('Erreur lors de la suppression du menu:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
} 