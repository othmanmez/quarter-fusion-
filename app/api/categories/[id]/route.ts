import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '../../../../lib/db';
import Category from '../../../../lib/models/Category';
import Menu from '../../../../lib/models/Menu';

// PUT - Mettre à jour une catégorie
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
    const { name } = body;

    // Validation
    if (!name || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Le nom de la catégorie est requis' },
        { status: 400 }
      );
    }

    // Vérifier si la catégorie existe
    const existingCategory = await Category.findById(params.id);
    if (!existingCategory) {
      return NextResponse.json(
        { error: 'Catégorie non trouvée' },
        { status: 404 }
      );
    }

    // Vérifier si le nouveau nom existe déjà (sauf pour la même catégorie)
    const duplicateCategory = await Category.findOne({ 
      name: { $regex: new RegExp(`^${name}$`, 'i') },
      _id: { $ne: params.id }
    });

    if (duplicateCategory) {
      return NextResponse.json(
        { error: 'Une catégorie avec ce nom existe déjà' },
        { status: 409 }
      );
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      params.id,
      { name: name.trim() },
      { new: true, runValidators: true }
    );

    return NextResponse.json({
      success: true,
      category: updatedCategory,
      message: 'Catégorie mise à jour avec succès',
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la catégorie:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer une catégorie
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

    // Vérifier si la catégorie existe
    const category = await Category.findById(params.id);
    if (!category) {
      return NextResponse.json(
        { error: 'Catégorie non trouvée' },
        { status: 404 }
      );
    }

    // Vérifier si des plats utilisent cette catégorie
    const menuItemsCount = await Menu.countDocuments({ category: params.id });
    if (menuItemsCount > 0) {
      return NextResponse.json(
        { 
          error: `Impossible de supprimer cette catégorie car ${menuItemsCount} plat(s) l'utilise(nt)` 
        },
        { status: 409 }
      );
    }

    await Category.findByIdAndDelete(params.id);

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