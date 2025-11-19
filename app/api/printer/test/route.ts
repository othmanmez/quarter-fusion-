import { NextResponse } from 'next/server';
import { printTestTicket } from '@/lib/printer';

// Configuration pour Next.js - route dynamique
export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    const enabled = process.env.AUTO_PRINT_ENABLED === 'true';
    
    if (!enabled) {
      return NextResponse.json({
        success: false,
        error: 'Impression désactivée dans la configuration (.env)',
      }, { status: 400 });
    }

    await printTestTicket();

    return NextResponse.json({
      success: true,
      message: 'Ticket de test imprimé avec succès',
    });
  } catch (error: any) {
    console.error('Erreur lors de l\'impression du ticket de test:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Erreur lors de l\'impression',
    }, { status: 500 });
  }
}
