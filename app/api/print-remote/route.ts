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

    // Construire les données ESC/POS pour l'imprimante
    const printerData = buildPrinterCommands({
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
      createdAt: new Date(createdAt)
    });

    // Envoyer à l'imprimante via l'IP publique
    const printerUrl = process.env.PRINTER_PUBLIC_URL || 'http://YOUR_PUBLIC_IP:9100';
    
    console.log(`🖨️ Envoi vers l'imprimante : ${printerUrl}`);
    
    const response = await fetch(printerUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
      },
      body: printerData,
      signal: AbortSignal.timeout(10000) // Timeout 10s
    });

    if (!response.ok) {
      throw new Error(`Erreur imprimante: ${response.status}`);
    }

    console.log(`✅ Ticket imprimé pour la commande ${orderNumber}`);

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

/**
 * Construire les commandes ESC/POS pour l'imprimante
 */
function buildPrinterCommands(order: any): string {
  const ESC = '\x1B';
  const GS = '\x1D';
  
  let commands = '';
  
  // Initialiser l'imprimante
  commands += `${ESC}@`;
  
  // En-tête centré et en gras
  commands += `${ESC}a\x01`; // Centrer
  commands += `${ESC}E\x01`; // Gras on
  commands += `${GS}!\x11`; // Double hauteur et largeur
  commands += 'QUARTER FUSION\n';
  commands += `${GS}!\x00`; // Normal
  commands += `${ESC}E\x00`; // Gras off
  commands += '6 passage de l\'aurore - 95800 Cergy\n';
  commands += 'Tel: 01 30 17 31 78\n';
  commands += '================================================\n';
  
  // Type de commande
  commands += `${ESC}E\x01${GS}!\x11`;
  commands += order.isDelivery ? '  LIVRAISON  \n' : ' CLICK & COLLECT \n';
  commands += `${GS}!\x00${ESC}E\x00\n`;
  
  // Numéro de commande
  commands += `${ESC}a\x01${ESC}E\x01`;
  commands += `N° ${order.orderNumber}\n`;
  commands += `${ESC}E\x00`;
  
  // Date
  const date = new Date(order.createdAt);
  commands += `${date.toLocaleDateString('fr-FR')} - ${date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}\n`;
  commands += '================================================\n';
  
  // Client
  commands += `${ESC}a\x00${ESC}E\x01`; // Gauche, gras
  commands += `CLIENT: ${order.customerName.toUpperCase()}\n`;
  commands += `${ESC}E\x00`;
  commands += `Tel: ${order.customerPhone}\n`;
  
  if (order.isDelivery && order.deliveryAddress) {
    commands += `Adresse: ${order.deliveryAddress}\n`;
    if (order.city) commands += `${order.city}\n`;
  }
  
  commands += '------------------------------------------------\n';
  
  // Articles
  order.items.forEach((item: any) => {
    commands += `${ESC}E\x01`;
    commands += `${item.quantity}x ${item.title}`;
    const itemPrice = (item.price * item.quantity).toFixed(2);
    const spaces = 48 - `${item.quantity}x ${item.title}`.length - itemPrice.length - 1;
    commands += ' '.repeat(Math.max(1, spaces)) + itemPrice + 'E\n';
    commands += `${ESC}E\x00`;
    
    // Personnalisations
    if (item.customizations && item.customizations.length > 0) {
      item.customizations.forEach((custom: any) => {
        custom.selectedOptions?.forEach((option: string) => {
          commands += `  + ${option}`;
          if (custom.priceExtra > 0) {
            const extraPrice = custom.priceExtra.toFixed(2);
            const spaces = 48 - `  + ${option}`.length - extraPrice.length - 2;
            commands += ' '.repeat(Math.max(1, spaces)) + '+' + extraPrice + 'E';
          }
          commands += '\n';
        });
      });
    }
  });
  
  // Total
  commands += '------------------------------------------------\n';
  commands += `${ESC}E\x01${GS}!\x11`;
  const totalStr = order.total.toFixed(2);
  const spaces = 48 - 'TOTAL:'.length - totalStr.length - 1;
  commands += 'TOTAL:' + ' '.repeat(Math.max(1, spaces)) + totalStr + 'E\n';
  commands += `${GS}!\x00${ESC}E\x00`;
  
  // Paiement
  commands += `Paiement: ${order.paymentMethod}\n`;
  
  // Notes
  if (order.notes) {
    commands += '------------------------------------------------\n';
    commands += `${ESC}E\x01Notes: ${order.notes}${ESC}E\x00\n`;
  }
  
  // Fin
  commands += '================================================\n';
  commands += `${ESC}a\x01${ESC}E\x01${GS}!\x11`;
  commands += 'BON APPETIT !\n';
  commands += `${GS}!\x00${ESC}E\x00`;
  commands += 'Merci pour votre confiance\n';
  commands += '@quarterfusion\n';
  commands += '================================================\n\n\n';
  
  // Couper le papier
  commands += `${GS}V\x00`;
  
  return commands;
}

