import { NextResponse } from 'next/server';
import { checkPrinterConnection } from '@/lib/printer';

// Configuration pour Next.js - route dynamique
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const enabled = process.env.AUTO_PRINT_ENABLED === 'true';
    const printerInterface = process.env.PRINTER_INTERFACE || '';
    
    if (!enabled) {
      return NextResponse.json({
        enabled: false,
        connected: false,
        interface: printerInterface,
      });
    }

    const connected = await checkPrinterConnection();

    return NextResponse.json({
      enabled: true,
      connected,
      interface: printerInterface,
    });
  } catch (error) {
    console.error('Erreur lors de la vérification du statut de l\'imprimante:', error);
    return NextResponse.json({
      enabled: false,
      connected: false,
      interface: '',
      error: 'Erreur lors de la vérification',
    }, { status: 500 });
  }
}

