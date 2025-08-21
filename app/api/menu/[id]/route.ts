import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '../../../../lib/db';
import Menu from '../../../../lib/models/Menu';
import Category from '../../../../lib/models/Category';

// GET - Récupérer un plat spécifique
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const menuItem = await Menu.findById(params.id)
      .populate('category', 'name slug')
      .select('-__v');

    if (!menuItem) {
      return NextResponse.json(
        { error: 'Plat non trouvé' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      menuItem,
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du plat:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

// PUT - Mettre à jour un plat
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    const { title, description, price, category, image, available } = body;

    // Vérifier si le plat existe
    const existingMenuItem = await Menu.findById(params.id);
    if (!existingMenuItem) {
      return NextResponse.json(
        { error: 'Plat non trouvé' },
        { status: 404 }
      );
    }

    // Validation
    if (title !== undefined && (!title || title.trim().length === 0)) {
      return NextResponse.json(
        { error: 'Le titre est requis' },
        { status: 400 }
      );
    }

    if (price !== undefined && price < 0) {
      return NextResponse.json(
        { error: 'Le prix doit être positif' },
        { status: 400 }
      );
    }

    // Vérifier si la catégorie existe (si fournie)
    if (category) {
      const categoryExists = await Category.findById(category);
      if (!categoryExists) {
        return NextResponse.json(
          { error: 'Catégorie non trouvée' },
          { status: 404 }
        );
      }
    }

    const updateData: any = {};
    if (title !== undefined) updateData.title = title.trim();
    if (description !== undefined) updateData.description = description.trim();
    if (price !== undefined) updateData.price = parseFloat(price);
    if (category !== undefined) updateData.category = category;
    if (image !== undefined) updateData.image = image;
    if (available !== undefined) updateData.available = available;

    const updatedMenuItem = await Menu.findByIdAndUpdate(
      params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('category', 'name slug');

    return NextResponse.json({
      success: true,
      menuItem: updatedMenuItem,
      message: 'Plat mis à jour avec succès',
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du plat:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer un plat
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Vérifier si le plat existe
    const menuItem = await Menu.findById(params.id);
    if (!menuItem) {
      return NextResponse.json(
        { error: 'Plat non trouvé' },
        { status: 404 }
      );
    }

    await Menu.findByIdAndDelete(params.id);

    return NextResponse.json({
      success: true,
      message: 'Plat supprimé avec succès',
    });
  } catch (error) {
    console.error('Erreur lors de la suppression du plat:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
} 