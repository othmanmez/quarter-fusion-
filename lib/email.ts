import nodemailer from 'nodemailer';

// Configuration du transporteur SMTP
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // true pour 465, false pour les autres ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Interface pour les paramètres d'email
interface EmailParams {
  to: string;
  subject: string;
  html: string;
}

/**
 * Fonction utilitaire pour envoyer des emails
 * @param to - Adresse email du destinataire
 * @param subject - Sujet de l'email
 * @param html - Contenu HTML de l'email
 * @returns Promise<boolean> - true si l'email a été envoyé avec succès
 */
export async function sendEmail({ to, subject, html }: EmailParams): Promise<boolean> {
  try {
    const mailOptions = {
      from: process.env.SMTP_FROM,
      to,
      subject,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email envoyé avec succès:', info.messageId);
    return true;
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error);
    return false;
  }
}

/**
 * Template pour l'email de confirmation de commande
 */
export function generateOrderConfirmationEmail(orderData: {
  orderNumber: string;
  customerName: string;
  items: Array<{ title: string; quantity: number; price: number }>;
  total: number;
  deliveryAddress: string;
  city: string;
  estimatedTime: string;
}) {
  const itemsHtml = orderData.items
    .map(item => `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.title}</td>
        <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
        <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">${item.price.toFixed(2)}€</td>
      </tr>
    `)
    .join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Confirmation de commande</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background-color: #b91c1c; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="margin: 0; font-size: 24px;">Quarter Fusion</h1>
        <p style="margin: 5px 0 0 0; font-size: 16px;">Confirmation de votre commande</p>
      </div>
      
      <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px;">
        <p>Bonjour ${orderData.customerName},</p>
        
        <p>Nous avons bien reçu votre commande et nous vous remercions pour votre confiance !</p>
        
        <div style="background-color: white; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #b91c1c; margin-top: 0;">Numéro de commande : ${orderData.orderNumber}</h3>
          
          <table style="width: 100%; border-collapse: collapse; margin: 15px 0;">
            <thead>
              <tr style="background-color: #f5f5f5;">
                <th style="padding: 8px; text-align: left; border-bottom: 2px solid #b91c1c;">Article</th>
                <th style="padding: 8px; text-align: center; border-bottom: 2px solid #b91c1c;">Quantité</th>
                <th style="padding: 8px; text-align: right; border-bottom: 2px solid #b91c1c;">Prix</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
            <tfoot>
              <tr style="background-color: #f5f5f5; font-weight: bold;">
                <td colspan="2" style="padding: 8px; text-align: right;">Total :</td>
                <td style="padding: 8px; text-align: right;">${orderData.total.toFixed(2)}€</td>
              </tr>
            </tfoot>
          </table>
        </div>
        
        <div style="background-color: white; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h4 style="color: #b91c1c; margin-top: 0;">Informations de livraison</h4>
          <p><strong>Adresse :</strong> ${orderData.deliveryAddress}</p>
          <p><strong>Ville :</strong> ${orderData.city}</p>
          <p><strong>Délai estimé :</strong> ${orderData.estimatedTime}</p>
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

/**
 * Template pour l'email de commande prête
 */
export function generateOrderReadyEmail(orderData: {
  orderNumber: string;
  customerName: string;
  deliveryAddress?: string;
  city?: string;
  isDelivery: boolean;
}) {
  const deliveryInfo = orderData.isDelivery 
    ? `<p><strong>Adresse de livraison :</strong> ${orderData.deliveryAddress}, ${orderData.city}</p>`
    : '<p><strong>Retrait en restaurant :</strong> 6 passage de l\'aurore, 95800 Cergy</p>';

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Votre commande est prête</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background-color: #28a745; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="margin: 0; font-size: 24px;">Quarter Fusion</h1>
        <p style="margin: 5px 0 0 0; font-size: 16px;">Votre commande est prête !</p>
      </div>
      
      <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px;">
        <p>Bonjour ${orderData.customerName},</p>
        
        <div style="background-color: #d4edda; border: 1px solid #c3e6cb; color: #155724; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">🎉 Votre commande est prête !</h3>
          <p><strong>Numéro de commande :</strong> ${orderData.orderNumber}</p>
          <p><strong>Heure :</strong> ${new Date().toLocaleTimeString('fr-FR')}</p>
        </div>
        
        <div style="background-color: white; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h4 style="color: #b91c1c; margin-top: 0;">Informations de retrait/livraison</h4>
          ${deliveryInfo}
        </div>
        
        <p>Merci de votre patience et bon appétit !</p>
        
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