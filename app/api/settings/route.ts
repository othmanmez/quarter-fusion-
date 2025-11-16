import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Récupérer tous les paramètres depuis la base
    const allSettings = await prisma.settings.findMany();
    
    // Convertir en objet
    const settingsObj: any = {
      clickAndCollectEnabled: true,
      deliveryEnabled: true,
      minOrderAmount: 20,
      deliveryFee: 2.5,
      estimatedTime: '30-45 minutes',
      deliveryCities: ['Cergy', 'Pontoise', 'Saint-Ouen-l\'Aumône', 'Eragny', 'Vauréal', 'Jouy-le-Moutier']
    };
    
    allSettings.forEach(setting => {
      // Convertir les valeurs booléennes
      if (setting.value === 'true' || setting.value === 'false') {
        settingsObj[setting.key] = setting.value === 'true';
      }
      // Convertir les valeurs numériques
      else if (!isNaN(Number(setting.value))) {
        settingsObj[setting.key] = Number(setting.value);
      }
      // Valeurs string
      else {
        settingsObj[setting.key] = setting.value;
      }
    });

    return NextResponse.json({
      success: true,
      settings: settingsObj,
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des paramètres:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

// Route pour mettre à jour les paramètres
export async function PUT(request: NextRequest) {
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
    const { key, value } = body;

    if (!key) {
      return NextResponse.json(
        { error: 'Clé manquante' },
        { status: 400 }
      );
    }

    // Validation selon le type de paramètre
    if ((key === 'deliveryFee' || key === 'minOrderAmount') && value < 0) {
      return NextResponse.json(
        { error: 'La valeur doit être positive' },
        { status: 400 }
      );
    }

    // Convertir la valeur en string pour la base
    const valueStr = String(value);

    // Créer ou mettre à jour le paramètre
    await prisma.settings.upsert({
      where: { key },
      update: { value: valueStr },
      create: {
        key,
        value: valueStr
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Paramètre mis à jour avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour des paramètres:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}