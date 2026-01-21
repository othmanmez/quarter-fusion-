import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Configuration pour Next.js - route dynamique
export const dynamic = 'force-dynamic';

// GET - Récupérer les personnalisations d'un plat
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const customizations = await prisma.customization.findMany({
      where: { menuId: id },
      orderBy: { createdAt: 'asc' }
    });

    return NextResponse.json({
      success: true,
      customizations
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des personnalisations:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

// POST - Ajouter une personnalisation à un plat
export async function POST(
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
    const { name, type, required, options, maxSelections } = body;

    // Validation
    if (!name || name.trim() === '') {
      return NextResponse.json(
        { error: 'Le nom de la personnalisation est requis' },
        { status: 400 }
      );
    }

    if (!type || !['SINGLE_CHOICE', 'MULTIPLE_CHOICE', 'TOGGLE'].includes(type)) {
      return NextResponse.json(
        { error: 'Type invalide' },
        { status: 400 }
      );
    }

    if (!options || !Array.isArray(options) || options.length === 0) {
      return NextResponse.json(
        { error: 'Au moins une option est requise' },
        { status: 400 }
      );
    }

    if (type === 'MULTIPLE_CHOICE' && maxSelections !== undefined && maxSelections !== null) {
      const max = parseInt(maxSelections, 10);
      if (Number.isNaN(max) || max < 1) {
        return NextResponse.json(
          { error: 'Le nombre maximum de choix doit être supérieur à 0' },
          { status: 400 }
        );
      }
    }

    // Créer la personnalisation
    const customization = await prisma.customization.create({
      data: {
        menuId: id,
        name: name.trim(),
        type,
        required: required || false,
        ...(type === 'MULTIPLE_CHOICE' && {
          maxSelections: maxSelections !== undefined && maxSelections !== null
            ? parseInt(maxSelections, 10)
            : null
        }),
        options: options.map((opt: any) => ({
          name: opt.name,
          priceExtra: parseFloat(opt.priceExtra) || 0
        }))
      }
    });

    return NextResponse.json({
      success: true,
      customization
    });
  } catch (error) {
    console.error('Erreur lors de la création de la personnalisation:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

