import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - Récupérer toutes les villes de livraison
export async function GET() {
  try {
    const cities = await prisma.deliveryCity.findMany({
      where: { active: true },
      orderBy: { name: 'asc' }
    });

    return NextResponse.json({
      success: true,
      cities
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des villes:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

// POST - Créer une nouvelle ville de livraison (Admin uniquement)
export async function POST(request: NextRequest) {
  try {
    // Vérifier l'authentification admin
    const session = await auth();
    if (!session || session.user?.role?.toLowerCase() !== 'admin') {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, postalCode, deliveryFee, minOrder } = body;

    // Validation
    if (!name || name.trim() === '') {
      return NextResponse.json(
        { error: 'Le nom de la ville est requis' },
        { status: 400 }
      );
    }

    if (deliveryFee === undefined || deliveryFee < 0) {
      return NextResponse.json(
        { error: 'Les frais de livraison doivent être >= 0' },
        { status: 400 }
      );
    }

    // Vérifier si la ville existe déjà
    const existing = await prisma.deliveryCity.findUnique({
      where: { name: name.trim() }
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Cette ville existe déjà' },
        { status: 400 }
      );
    }

    // Créer la ville
    const city = await prisma.deliveryCity.create({
      data: {
        name: name.trim(),
        postalCode: postalCode?.trim() || null,
        deliveryFee: parseFloat(deliveryFee),
        minOrder: minOrder ? parseFloat(minOrder) : null,
        active: true
      }
    });

    return NextResponse.json({
      success: true,
      city
    });
  } catch (error) {
    console.error('Erreur lors de la création de la ville:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

