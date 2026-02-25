import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Configuration pour Next.js - route dynamique
export const dynamic = 'force-dynamic';

interface OrderItem {
  item: {
    id: string;
    title: string;
    price: number;
    description: string;
  };
  quantity: number;
  customizations?: Array<string | { name: string; selectedOptions?: string[]; priceExtra?: number }>;
}

function getItemUnitPrice(item: OrderItem): number {
  const base = item.item.price ?? 0;
  const extras = Array.isArray(item.customizations)
    ? item.customizations.reduce((sum, c) => {
        if (typeof c === 'object' && typeof c.priceExtra === 'number') return sum + c.priceExtra;
        return sum;
      }, 0)
    : 0;
  return base + extras;
}

function getItemTotalPrice(item: OrderItem): number {
  return getItemUnitPrice(item) * item.quantity;
}

function getCartTotal(cart: OrderItem[]): number {
  return cart.reduce((sum, item) => sum + getItemTotalPrice(item), 0);
}

interface OrderFormData {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  moyenPaiement: string;
  notes: string;
  adresse?: string;
  ville?: string;
  codePostal?: string;
}

interface OrderRequest {
  cart: OrderItem[];
  formData: OrderFormData;
  total: number;
  type: 'click-and-collect' | 'livraison';
}

// Configuration du transporteur email
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Template email pour le client
function generateClientEmailHTML(orderData: OrderRequest, orderNumber: string) {
  const { cart, formData, type } = orderData;
  const isDelivery = type === 'livraison';
  const computedTotal = getCartTotal(cart) + (isDelivery ? (orderData.total - getCartTotal(cart)) : 0);
  
  const itemsHTML = cart.map(item => {
    const customizationLabels = (item.customizations || []).map(c => {
      if (typeof c === 'string') return c;
      if (c.name) {
        const opts = (c.selectedOptions || []).join(', ');
        const extra = typeof c.priceExtra === 'number' && c.priceExtra > 0 ? ` (+${c.priceExtra.toFixed(2)}€)` : '';
        return opts ? `${c.name}: ${opts}${extra}` : `${c.name}${extra}`;
      }
      return '';
    }).filter(Boolean);

    return `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #eee;">
        <strong>${item.item.title}</strong><br>
        <small style="color: #666;">${item.item.description}</small>
        ${customizationLabels.length > 0 ? 
          `<br><small style="color: #007bff;">Personnalisations: ${customizationLabels.join(', ')}</small>` : 
          ''
        }
        <br><small style="color: #888;">${getItemUnitPrice(item).toFixed(2)}€ / unité</small>
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">${getItemTotalPrice(item).toFixed(2)}€</td>
    </tr>
  `;
  }).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Confirmation de commande - Quarter Fusion</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #dc2626, #b91c1c); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .order-number { background: #dc2626; color: white; padding: 10px 20px; border-radius: 5px; display: inline-block; margin: 10px 0; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th { background: #dc2626; color: white; padding: 12px; text-align: left; }
        .total { background: #f0f0f0; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .info-box { background: #e3f2fd; border-left: 4px solid #2196f3; padding: 15px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🍔 Quarter Fusion</h1>
          <h2>Confirmation de votre commande</h2>
          <div class="order-number">
            Commande #${orderNumber}
          </div>
        </div>
        
        <div class="content">
          <p>Bonjour ${formData.prenom} ${formData.nom},</p>
          
          <p>Nous avons bien reçu votre commande et nous vous en remercions !</p>
          
          <div class="info-box">
            <strong>Informations de commande :</strong><br>
            • Type : ${isDelivery ? 'Livraison à domicile' : 'Click & Collect'}<br>
            • Temps estimé : ${isDelivery ? '30-45 minutes' : '15-20 minutes'}<br>
            • Moyen de paiement : ${formData.moyenPaiement === 'especes' ? 'Espèces' : 'Carte bancaire'}<br>
            • Téléphone : ${formData.telephone}
            ${isDelivery ? `<br>• Adresse : ${formData.adresse}, ${formData.codePostal} ${formData.ville}` : ''}
          </div>
          
          <h3>Détails de votre commande :</h3>
          <table>
            <thead>
              <tr>
                <th>Article</th>
                <th style="text-align: center;">Qté</th>
                <th style="text-align: right;">Prix</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHTML}
            </tbody>
          </table>
          
          <div class="total">
            <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
              <span>Sous-total :</span>
              <span>${getCartTotal(cart).toFixed(2)}€</span>
            </div>
            ${isDelivery ? `<div style="display:flex; justify-content:space-between; margin-bottom:4px;"><span>Frais de livraison :</span><span>${(orderData.total - getCartTotal(cart)).toFixed(2)}€</span></div>` : ''}
            <div style="display:flex; justify-content:space-between; font-size:1.1em; font-weight:bold; border-top:2px solid #dc2626; margin-top:8px; padding-top:8px;">
              <span>Total à payer :</span>
              <span>${orderData.total.toFixed(2)}€</span>
            </div>
          </div>
          
          ${formData.notes ? `
            <div class="info-box">
              <strong>Notes spéciales :</strong><br>
              ${formData.notes}
            </div>
          ` : ''}
          
          <div class="info-box">
            <strong>Prochaines étapes :</strong><br>
            ${isDelivery ? 
              '• Notre équipe prépare votre commande<br>• Un livreur vous contactera pour confirmer la livraison<br>• Paiement à la livraison' :
              '• Notre équipe prépare votre commande<br>• Rendez-vous en restaurant pour récupérer votre commande<br>• Paiement au retrait'
            }
          </div>
          
          <p>Pour toute question, n'hésitez pas à nous contacter au <strong>01 30 17 31 78</strong>.</p>
          
          <p>Merci de votre confiance !<br>
          <strong>L'équipe Quarter Fusion</strong></p>
        </div>
        
        <div class="footer">
          <p>Quarter Fusion<br>
          6 passage de l'aurore, 95800 Cergy<br>
          Tél : 01 30 17 31 78</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// Template email pour l'admin
function generateAdminEmailHTML(orderData: OrderRequest, orderNumber: string) {
  const { cart, formData, type } = orderData;
  const isDelivery = type === 'livraison';
  
  const itemsHTML = cart.map(item => {
    const customizationLabels = (item.customizations || []).map(c => {
      if (typeof c === 'string') return c;
      if (c.name) {
        const opts = (c.selectedOptions || []).join(', ');
        const extra = typeof c.priceExtra === 'number' && c.priceExtra > 0 ? ` (+${c.priceExtra.toFixed(2)}€)` : '';
        return opts ? `${c.name}: ${opts}${extra}` : `${c.name}${extra}`;
      }
      return '';
    }).filter(Boolean);

    return `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #eee;">
        <strong>${item.item.title}</strong><br>
        <small style="color: #666;">${item.item.description}</small>
        ${customizationLabels.length > 0 ? 
          `<br><small style="color: #007bff;">Personnalisations: ${customizationLabels.join(', ')}</small>` : 
          ''
        }
        <br><small style="color: #888;">${getItemUnitPrice(item).toFixed(2)}€ / unité</small>
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">${getItemTotalPrice(item).toFixed(2)}€</td>
    </tr>
  `;
  }).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Nouvelle commande - Quarter Fusion</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #dc2626, #b91c1c); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .order-number { background: #dc2626; color: white; padding: 10px 20px; border-radius: 5px; display: inline-block; margin: 10px 0; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th { background: #dc2626; color: white; padding: 12px; text-align: left; }
        .total { background: #f0f0f0; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .info-box { background: #e3f2fd; border-left: 4px solid #2196f3; padding: 15px; margin: 20px 0; }
        .urgent { background: #ffebee; border-left: 4px solid #f44336; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🍔 Quarter Fusion</h1>
          <h2>Nouvelle commande reçue</h2>
          <div class="order-number">
            Commande #${orderNumber}
          </div>
        </div>
        
        <div class="content">
          <div class="info-box urgent">
            <strong>🚨 NOUVELLE COMMANDE À TRAITER</strong><br>
            Type : ${isDelivery ? 'Livraison' : 'Click & Collect'}<br>
            Montant : ${orderData.total.toFixed(2)}€
          </div>
          
          <h3>Informations client :</h3>
          <div class="info-box">
            <strong>${formData.prenom} ${formData.nom}</strong><br>
            Email : ${formData.email}<br>
            Téléphone : ${formData.telephone}<br>
            Moyen de paiement : ${formData.moyenPaiement === 'especes' ? 'Espèces' : 'Carte bancaire'}
            ${isDelivery ? `<br>Adresse : ${formData.adresse}, ${formData.codePostal} ${formData.ville}` : ''}
          </div>
          
          <h3>Détails de la commande :</h3>
          <table>
            <thead>
              <tr>
                <th>Article</th>
                <th style="text-align: center;">Qté</th>
                <th style="text-align: right;">Prix</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHTML}
            </tbody>
          </table>
          
          <div class="total">
            <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
              <span>Sous-total :</span>
              <span>${getCartTotal(cart).toFixed(2)}€</span>
            </div>
            ${isDelivery ? `<div style="display:flex; justify-content:space-between; margin-bottom:4px;"><span>Frais de livraison :</span><span>${(orderData.total - getCartTotal(cart)).toFixed(2)}€</span></div>` : ''}
            <div style="display:flex; justify-content:space-between; font-size:1.1em; font-weight:bold; border-top:2px solid #dc2626; margin-top:8px; padding-top:8px;">
              <span>Total :</span>
              <span>${orderData.total.toFixed(2)}€</span>
            </div>
          </div>
          
          ${formData.notes ? `
            <div class="info-box">
              <strong>Notes spéciales :</strong><br>
              ${formData.notes}
            </div>
          ` : ''}
          
          <div class="info-box">
            <strong>Actions à effectuer :</strong><br>
            ${isDelivery ? 
              '• Préparer la commande<br>• Contacter le livreur<br>• Confirmer la livraison' :
              '• Préparer la commande<br>• Attendre le client en restaurant'
            }
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}

export async function POST(request: NextRequest) {
  try {
    const orderData: OrderRequest = await request.json();
    
    // Validation des données
    if (!orderData.cart || orderData.cart.length === 0) {
      return NextResponse.json({ error: 'Panier vide' }, { status: 400 });
    }
    
    if (!orderData.formData.email || !orderData.formData.telephone) {
      return NextResponse.json({ error: 'Informations client manquantes' }, { status: 400 });
    }

    const orderNumber = `QF-${Date.now()}`;

    // Sauvegarde de la commande dans la base de données Prisma
    const { prisma } = await import('@/lib/prisma');
    
    const savedOrder = await prisma.order.create({
      data: {
        orderNumber,
        customerName: `${orderData.formData.prenom} ${orderData.formData.nom}`,
        customerEmail: orderData.formData.email,
        customerPhone: orderData.formData.telephone,
        items: orderData.cart.map(cartItem => ({
          title: cartItem.item.title,
          quantity: cartItem.quantity,
          price: cartItem.item.price,
          description: cartItem.item.description,
          customizations: (cartItem.customizations || []).map(custom => {
            if (typeof custom === 'string') {
              return { name: custom, selectedOptions: [custom], priceExtra: 0 };
            }
            return {
              name: custom.name || '',
              selectedOptions: custom.selectedOptions || [],
              priceExtra: typeof custom.priceExtra === 'number' ? custom.priceExtra : 0,
            };
          })
        })),
        total: orderData.total,
        deliveryAddress: orderData.formData.adresse,
        city: orderData.formData.ville,
        isDelivery: orderData.type === 'livraison',
        status: 'A_PREPARER',
        estimatedTime: orderData.type === 'livraison' ? '30-45 minutes' : '15-20 minutes',
        paymentMethod: orderData.formData.moyenPaiement.toUpperCase() as 'ESPECES' | 'CARTE',
        notes: orderData.formData.notes || undefined
      }
    });

    // Envoi email au client (non bloquant : la commande est déjà enregistrée)
    let clientEmailResult: any = null;
    let adminEmailResult: any = null;
    let emailError: string | null = null;

    try {
      clientEmailResult = await transporter.sendMail({
        from: `"Quarter Fusion" <${process.env.EMAIL_USER}>`,
        to: orderData.formData.email,
        subject: `Confirmation de commande #${orderNumber} - Quarter Fusion`,
        html: generateClientEmailHTML(orderData, orderNumber),
      });
      console.log('✅ [EMAIL] Email client envoyé:', clientEmailResult.messageId);
    } catch (err: any) {
      emailError = err.message || 'Erreur email client';
      console.error('❌ [EMAIL] Erreur envoi email client:', err);
    }

    try {
      adminEmailResult = await transporter.sendMail({
        from: `"Quarter Fusion" <${process.env.EMAIL_USER}>`,
        to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
        subject: `Nouvelle commande #${orderNumber} - Quarter Fusion`,
        html: generateAdminEmailHTML(orderData, orderNumber),
      });
      console.log('✅ [EMAIL] Email admin envoyé:', adminEmailResult.messageId);
    } catch (err: any) {
      emailError = emailError ? `${emailError} | Admin: ${err.message}` : err.message;
      console.error('❌ [EMAIL] Erreur envoi email admin:', err);
    }

    // Impression automatique du ticket (si activée)
    let printStatus = { success: false, message: 'Impression désactivée' };
    
    console.log('🖨️  [IMPRESSION] Vérification de l\'impression automatique...');
    console.log('🖨️  [IMPRESSION] AUTO_PRINT_ENABLED =', process.env.AUTO_PRINT_ENABLED);
    console.log('🖨️  [IMPRESSION] REMOTE_PRINT_ENABLED =', process.env.REMOTE_PRINT_ENABLED);
    
    if (process.env.AUTO_PRINT_ENABLED === 'true') {
      // Vérifier si on utilise l'impression à distance (Netlify)
      if (process.env.REMOTE_PRINT_ENABLED === 'true' && process.env.PRINTER_PUBLIC_URL) {
        console.log('🌐 [IMPRESSION] Impression à distance activée');
        try {
          const printerUrl = process.env.PRINTER_PUBLIC_URL;
          const authToken = process.env.PRINTER_AUTH_TOKEN;
          
          if (!authToken) {
            throw new Error('PRINTER_AUTH_TOKEN manquant');
          }
          
          console.log('🖨️  [IMPRESSION] Envoi vers:', printerUrl);
          
          // Appeler notre propre API d'impression
          const response = await fetch(`${process.env.NEXTAUTH_URL}/api/print-remote`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({
              orderNumber: savedOrder.orderNumber,
              customerName: savedOrder.customerName,
              customerPhone: savedOrder.customerPhone,
              items: savedOrder.items,
              total: savedOrder.total,
              isDelivery: savedOrder.isDelivery,
              deliveryAddress: savedOrder.deliveryAddress,
              city: savedOrder.city,
              paymentMethod: savedOrder.paymentMethod,
              notes: savedOrder.notes,
              createdAt: savedOrder.createdAt
            })
          });
          
          const result = await response.json();
          
          if (response.ok && result.success) {
            console.log('✅ [IMPRESSION] Ticket envoyé à l\'imprimante distante !');
            printStatus = { success: true, message: 'Ticket imprimé à distance' };
          } else {
            throw new Error(result.error || 'Erreur d\'impression à distance');
          }
        } catch (printError: any) {
          console.error('❌ [IMPRESSION] Erreur d\'impression à distance:', printError);
          printStatus = { success: false, message: printError.message || 'Erreur d\'impression à distance' };
        }
      } else {
        // Impression locale (comme avant)
        console.log('🖨️  [IMPRESSION] Impression locale activée');
        try {
          const { printOrderTicket } = await import('@/lib/printer');
          console.log('🖨️  [IMPRESSION] Module chargé, impression en cours...');
          
          const printed = await printOrderTicket({
            orderNumber: savedOrder.orderNumber,
            customerName: savedOrder.customerName,
            customerPhone: savedOrder.customerPhone,
            items: savedOrder.items as any[],
            total: savedOrder.total,
            isDelivery: savedOrder.isDelivery,
            deliveryAddress: savedOrder.deliveryAddress || undefined,
            city: savedOrder.city || undefined,
            paymentMethod: savedOrder.paymentMethod,
            notes: savedOrder.notes || undefined,
            createdAt: savedOrder.createdAt
          });
          
          if (printed) {
            console.log('✅ [IMPRESSION] Ticket imprimé avec succès !');
            printStatus = { success: true, message: 'Ticket imprimé avec succès' };
          } else {
            printStatus = { success: false, message: 'L\'impression a échoué' };
          }
        } catch (printError: any) {
          console.error('❌ [IMPRESSION] Erreur:', printError);
          printStatus = { success: false, message: printError.message || 'Erreur d\'impression' };
        }
      }
    } else {
      console.log('⚠️  [IMPRESSION] Impression désactivée');
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Commande envoyée avec succès',
      orderNumber,
      orderId: savedOrder.id,
      emailsSent: {
        client: clientEmailResult?.messageId || null,
        admin: adminEmailResult?.messageId || null,
        error: emailError || null,
      },
      printStatus
    });

  } catch (error) {
    console.error('Erreur lors du traitement de la commande:', error);
    return NextResponse.json({ 
      error: 'Erreur lors du traitement de la commande' 
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    const { prisma } = await import('@/lib/prisma');
    
    const orders = await prisma.order.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      take: 100
    });

    return NextResponse.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des commandes:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
} 