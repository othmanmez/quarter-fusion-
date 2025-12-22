import { NextRequest, NextResponse } from 'next/server';

// Configuration pour Next.js - route dynamique
export const dynamic = 'force-dynamic';

/**
 * Route API pour envoyer des commandes d'impression à distance
 * ATTENTION : Nécessite un token secret pour la sécurité
 */
export async function POST(request: NextRequest) {
  try {
    // Vérification du token de sécurité
    const authHeader = request.headers.get('authorization');
    const expectedToken = process.env.PRINTER_AUTH_TOKEN;

    if (!expectedToken) {
      return NextResponse.json(
        { error: 'Service d\'impression non configuré' },
        { status: 503 }
      );
    }

    if (!authHeader || authHeader !== `Bearer ${expectedToken}`) {
      console.log('❌ Tentative d\'impression non autorisée');
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    // Vérifier que l'impression à distance est activée
    if (process.env.REMOTE_PRINT_ENABLED !== 'true') {
      return NextResponse.json(
        { error: 'Impression à distance désactivée' },
        { status: 503 }
      );
    }

    const body = await request.json();
    const { orderNumber, customerName, customerPhone, items, total, isDelivery, deliveryAddress, city, paymentMethod, notes, createdAt } = body;

    // Validation des données
    if (!orderNumber || !items || items.length === 0) {
      return NextResponse.json(
        { error: 'Données de commande invalides' },
        { status: 400 }
      );
    }

    // Envoyer vers le service d'impression sur la tablette
    const printerServiceUrl = process.env.PRINTER_PUBLIC_URL || 'http://192.168.1.33:9000';
    const printEndpoint = `${printerServiceUrl}/print`;

    console.log(`🖨️ Envoi vers le service d'impression: ${printEndpoint}`);

    const response = await fetch(printEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        orderNumber,
        customerName,
        customerPhone,
        items,
        total,
        isDelivery,
        deliveryAddress,
        city,
        paymentMethod,
        notes,
        createdAt
      }),
      signal: AbortSignal.timeout(15000) // Timeout 15s
    });

    if (!response.ok) {
      throw new Error(`Erreur imprimante: ${response.status}`);
    }

    const result = await response.json();

    if (result.success) {
      console.log(`✅ Ticket imprimé pour la commande ${orderNumber}`);
    } else {
      throw new Error(result.error || 'Erreur inconnue');
    }

    return NextResponse.json({
      success: true,
      message: 'Ticket envoyé à l\'imprimante',
      orderNumber
    });

  } catch (error: any) {
    console.error('❌ Erreur d\'impression à distance:', error);
    return NextResponse.json(
      {
        error: 'Erreur lors de l\'impression',
        details: error.message
      },
      { status: 500 }
    );
  }
}

