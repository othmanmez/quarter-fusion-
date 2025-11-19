import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Configuration pour Next.js - route dynamique
export const dynamic = 'force-dynamic';

// GET - Récupérer toutes les villes de livraison
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get('activeOnly') === 'true';

    const cities = await prisma.deliveryCity.findMany({
      where: activeOnly ? { active: true } : undefined,
      orderBy: { name: 'asc' },
    });

    return NextResponse.json({
      success: true,
      cities,
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des villes:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la récupération des villes' },
      { status: 500 }
    );
  }
}

// POST - Créer une nouvelle ville de livraison
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, postalCode, deliveryFee, minOrder, active } = body;

    // Validation
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Le nom de la ville est requis' },
        { status: 400 }
      );
    }

    if (deliveryFee === undefined || typeof deliveryFee !== 'number' || deliveryFee < 0) {
      return NextResponse.json(
        { success: false, error: 'Les frais de livraison sont requis et doivent être positifs' },
        { status: 400 }
      );
    }

    // Vérifier si la ville existe déjà
    const existingCity = await prisma.deliveryCity.findUnique({
      where: { name: name.trim() },
    });

    if (existingCity) {
      return NextResponse.json(
        { success: false, error: 'Cette ville existe déjà' },
        { status: 400 }
      );
    }

    // Créer la ville
    const city = await prisma.deliveryCity.create({
      data: {
        name: name.trim(),
        postalCode: postalCode?.trim() || null,
        deliveryFee: parseFloat(deliveryFee.toFixed(2)),
        minOrder: minOrder ? parseFloat(minOrder.toFixed(2)) : null,
        active: active !== false,
      },
    });

    return NextResponse.json({
      success: true,
      city,
    });
  } catch (error) {
    console.error('Erreur lors de la création de la ville:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la création de la ville' },
      { status: 500 }
    );
  }
}
