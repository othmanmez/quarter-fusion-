import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '../../../../../lib/mongodb';
import Order, { IOrder } from '../../../../../lib/models/Order';
import { sendEmail, generateOrderReadyEmail } from '../../../../../lib/email';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Connexion à MongoDB
    await connectToDatabase();

    // Récupération des données de la requête
    const body = await request.json();
    const { status } = body;

    // Validation du statut
    const validStatuses = ['En attente', 'En préparation', 'Prête', 'Terminée', 'Annulée'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Statut invalide' },
        { status: 400 }
      );
    }

    // Recherche de la commande
    const order = await Order.findById(params.id);
    if (!order) {
      return NextResponse.json(
        { error: 'Commande non trouvée' },
        { status: 404 }
      );
    }

    // Sauvegarde de l'ancien statut pour la comparaison
    const oldStatus = order.status;

    // Mise à jour du statut
    order.status = status;
    order.updatedAt = new Date();
    
    const updatedOrder = await order.save();

    // Envoi d'email si le statut est "Prête" ou "Terminée"
    if ((status === 'Prête' || status === 'Terminée') && oldStatus !== status) {
      sendStatusUpdateEmail(updatedOrder, status).catch(error => {
        console.error('Erreur lors de l\'envoi de l\'email de mise à jour:', error);
      });
    }

    return NextResponse.json({
      success: true,
      order: {
        id: updatedOrder._id,
        orderNumber: updatedOrder.orderNumber,
        status: updatedOrder.status,
        updatedAt: updatedOrder.updatedAt,
      },
      message: `Statut de la commande mis à jour vers "${status}"`
    });

  } catch (error) {
    console.error('Erreur lors de la mise à jour du statut:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

/**
 * Fonction pour envoyer l'email de mise à jour de statut
 * @param order - La commande mise à jour
 * @param status - Le nouveau statut
 */
async function sendStatusUpdateEmail(order: IOrder, status: string) {
  try {
    let subject: string;
    let emailHtml: string;

    if (status === 'Prête') {
      subject = `Votre commande est prête - ${order.orderNumber}`;
      emailHtml = generateOrderReadyEmail({
        orderNumber: order.orderNumber,
        customerName: order.customerName,
        deliveryAddress: order.deliveryAddress,
        city: order.city,
        isDelivery: order.isDelivery,
      });
    } else if (status === 'Terminée') {
      subject = `Votre commande est terminée - ${order.orderNumber}`;
      emailHtml = generateOrderCompletedEmail(order);
    } else {
      // Pour les autres statuts, on peut envoyer un email de mise à jour générique
      subject = `Mise à jour de votre commande - ${order.orderNumber}`;
      emailHtml = generateOrderStatusUpdateEmail(order, status);
    }

    await sendEmail({
      to: order.customerEmail,
      subject,
      html: emailHtml,
    });

    console.log(`Email de mise à jour envoyé pour la commande ${order.orderNumber} (statut: ${status})`);
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email de mise à jour:', error);
    // Ne pas faire échouer la mise à jour du statut si l'email échoue
  }
}

/**
 * Template pour l'email de commande terminée
 */
function generateOrderCompletedEmail(order: IOrder) {
  const deliveryInfo = order.isDelivery 
    ? `<p><strong>Adresse de livraison :</strong> ${order.deliveryAddress}, ${order.city}</p>`
    : '<p><strong>Retrait en restaurant :</strong> 6 passage de l\'aurore, 95800 Cergy</p>';

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Commande terminée</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background-color: #17a2b8; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="margin: 0; font-size: 24px;">Quarter Fusion</h1>
        <p style="margin: 5px 0 0 0; font-size: 16px;">Commande terminée</p>
      </div>
      
      <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px;">
        <p>Bonjour ${order.customerName},</p>
        
        <div style="background-color: #d1ecf1; border: 1px solid #bee5eb; color: #0c5460; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">✅ Votre commande est terminée !</h3>
          <p><strong>Numéro de commande :</strong> ${order.orderNumber}</p>
          <p><strong>Heure de finalisation :</strong> ${new Date().toLocaleTimeString('fr-FR')}</p>
        </div>
        
        <div style="background-color: white; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h4 style="color: #b91c1c; margin-top: 0;">Informations de retrait/livraison</h4>
          ${deliveryInfo}
        </div>
        
        <p>Merci d'avoir choisi Quarter Fusion ! Nous espérons vous revoir bientôt.</p>
        
        <p>Cordialement,<br>L'équipe Quarter Fusion</p>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 12px;">
          <p>Pour toute question, contactez-nous au 01 30 17 31 78</p>
          <p>6 passage de l'aurore, 95800 Cergy</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Template pour l'email de mise à jour de statut générique
 */
function generateOrderStatusUpdateEmail(order: IOrder, status: string) {
  const statusMessages = {
    'En attente': 'Votre commande est en attente de traitement',
    'En préparation': 'Votre commande est en cours de préparation',
    'Prête': 'Votre commande est prête',
    'Terminée': 'Votre commande est terminée',
    'Annulée': 'Votre commande a été annulée',
  };

  const statusColors = {
    'En attente': '#ffc107',
    'En préparation': '#17a2b8',
    'Prête': '#28a745',
    'Terminée': '#17a2b8',
    'Annulée': '#dc3545',
  };

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Mise à jour de commande</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background-color: #b91c1c; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="margin: 0; font-size: 24px;">Quarter Fusion</h1>
        <p style="margin: 5px 0 0 0; font-size: 16px;">Mise à jour de votre commande</p>
      </div>
      
      <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px;">
        <p>Bonjour ${order.customerName},</p>
        
        <div style="background-color: ${statusColors[status as keyof typeof statusColors]}; color: white; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">📋 ${statusMessages[status as keyof typeof statusMessages]}</h3>
          <p><strong>Numéro de commande :</strong> ${order.orderNumber}</p>
          <p><strong>Nouveau statut :</strong> ${status}</p>
          <p><strong>Heure de mise à jour :</strong> ${new Date().toLocaleString('fr-FR')}</p>
        </div>
        
        <p>Nous vous tiendrons informé de l'avancement de votre commande.</p>
        
        <p>Cordialement,<br>L'équipe Quarter Fusion</p>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 12px;">
          <p>Pour toute question, contactez-nous au 01 30 17 31 78</p>
          <p>6 passage de l'aurore, 95800 Cergy</p>
        </div>
      </div>
    </body>
    </html>
  `;
} 