import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '../../../lib/db';
import Settings, { ISettings } from '../../../lib/models/Settings';

export async function GET() {
  try {
    await connectDB();

    // Récupération des paramètres
    let settings = await Settings.findOne().select('-__v');

    // Si aucun paramètre n'existe, créer les paramètres par défaut
    if (!settings) {
      settings = await Settings.create({
        orderingOpen: true,
        deliveryCities: ['Cergy', 'Pontoise', 'Saint-Ouen-l\'Aumône', 'Eragny', 'Vauréal', 'Jouy-le-Moutier'],
        deliveryFee: 2.50,
        minimumOrder: 20,
        deliveryTime: '30-45 minutes'
      });
    }

    return NextResponse.json({
      success: true,
      settings,
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
    const session = await getServerSession();
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    await connectDB();
    
    const body = await request.json();
    const { orderingOpen, deliveryCities, deliveryFee, minimumOrder, deliveryTime } = body;

    // Validation
    if (deliveryFee !== undefined && deliveryFee < 0) {
      return NextResponse.json(
        { error: 'Les frais de livraison doivent être positifs' },
        { status: 400 }
      );
    }

    if (minimumOrder !== undefined && minimumOrder < 0) {
      return NextResponse.json(
        { error: 'Le montant minimum de commande doit être positif' },
        { status: 400 }
      );
    }

    // Mettre à jour ou créer les paramètres
    const settings = await Settings.findOneAndUpdate(
      {},
      {
        orderingOpen,
        deliveryCities,
        deliveryFee,
        minimumOrder,
        deliveryTime,
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({
      success: true,
      settings,
      message: 'Paramètres mis à jour avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour des paramètres:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
} 