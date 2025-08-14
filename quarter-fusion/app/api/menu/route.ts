import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '../../../lib/db';
import Menu from '../../../lib/models/Menu';
import Category from '../../../lib/models/Category';

export async function GET() {
  try {
    await connectDB();

    // Récupération de tous les éléments du menu disponibles avec leurs catégories
    const menuItems = await Menu.find({ available: true })
      .populate('category', 'name slug')
      .sort({ 'category.name': 1, title: 1 })
      .select('-__v');

    // Grouper par catégorie
    const menuByCategory = menuItems.reduce((acc, item) => {
      const categoryName = (item.category as any).name;
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
    const session = await getServerSession();
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    await connectDB();
    
    const body = await request.json();
    const { title, description, price, category, image } = body;

    // Validation
    if (!title || !description || !price || !category || !image) {
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
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return NextResponse.json(
        { error: 'Catégorie non trouvée' },
        { status: 404 }
      );
    }

    const menuItem = await Menu.create({
      title: title.trim(),
      description: description.trim(),
      price: parseFloat(price),
      category,
      image,
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