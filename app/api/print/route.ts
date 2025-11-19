import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// API route qui fait le proxy vers le service d'impression local
// Cette route est appelée depuis le client, et elle essaie de contacter le service local
export async function POST(request: NextRequest) {
  try {
    const order = await request.json();

    // URL du service d'impression local
    // Si NEXT_PUBLIC_PRINTER_SERVICE_URL est défini, on l'utilise
    // Sinon, on essaie de détecter l'IP locale depuis les headers
    const printerServiceUrl = 
      process.env.NEXT_PUBLIC_PRINTER_SERVICE_URL || 
      'http://192.168.1.33:9000'; // IP par défaut de la tablette

    console.log('🖨️ Tentative d\'impression via:', printerServiceUrl);

    try {
      const response = await fetch(`${printerServiceUrl}/print`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(order),
        // Timeout de 5 secondes
        signal: AbortSignal.timeout(5000),
      });

      if (!response.ok) {
        throw new Error(`Service d'impression a répondu avec le statut ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        return NextResponse.json({ 
          success: true, 
          message: 'Ticket imprimé avec succès' 
        });
      } else {
        return NextResponse.json({ 
          success: false, 
          error: result.error || 'Erreur inconnue lors de l\'impression' 
        }, { status: 500 });
      }
    } catch (fetchError: any) {
      console.error('❌ Erreur de connexion au service d\'impression:', fetchError);
      
      // Si c'est une erreur de timeout ou de connexion, c'est probablement que le service n'est pas accessible
      if (fetchError.name === 'AbortError' || fetchError.message?.includes('fetch')) {
        return NextResponse.json({ 
          success: false, 
          error: 'Service d\'impression non accessible. Vérifiez que Termux est démarré sur votre tablette et que vous êtes sur le même réseau WiFi.' 
        }, { status: 503 });
      }

      throw fetchError;
    }
  } catch (error: any) {
    console.error('❌ Erreur lors du traitement de l\'impression:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Erreur interne du serveur' 
    }, { status: 500 });
  }
}

