/**
 * Template email pour les messages de contact
 */

export interface ContactEmailData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

/**
 * Template pour l'email de notification envoyé au restaurant
 */
export function generateContactNotificationEmail(data: ContactEmailData) {
  const { name, email, phone, subject, message } = data;
  const receivedAt = new Date().toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Nouveau message de contact</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background-color: #b91c1c; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="margin: 0; font-size: 24px;">Quarter Fusion</h1>
        <p style="margin: 5px 0 0 0; font-size: 16px;">Nouveau message de contact</p>
      </div>
      
      <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px;">
        <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; color: #856404; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="margin-top: 0;">📧 Nouveau message reçu</h3>
          <p><strong>Reçu le :</strong> ${receivedAt}</p>
        </div>
        
        <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #b91c1c; margin-top: 0;">Informations du contact</h3>
          
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee; width: 120px;">Nom :</td>
              <td style="padding: 8px; border-bottom: 1px solid #eee;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee;">Email :</td>
              <td style="padding: 8px; border-bottom: 1px solid #eee;">
                <a href="mailto:${email}" style="color: #b91c1c; text-decoration: none;">${email}</a>
              </td>
            </tr>
            ${phone ? `
            <tr>
              <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee;">Téléphone :</td>
              <td style="padding: 8px; border-bottom: 1px solid #eee;">
                <a href="tel:${phone}" style="color: #b91c1c; text-decoration: none;">${phone}</a>
              </td>
            </tr>
            ` : ''}
            <tr>
              <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee;">Sujet :</td>
              <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>${subject}</strong></td>
            </tr>
          </table>
        </div>
        
        <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h4 style="color: #b91c1c; margin-top: 0;">Message</h4>
          <div style="background-color: #f8f9fa; padding: 15px; border-left: 4px solid #b91c1c; white-space: pre-wrap; font-family: inherit;">${message}</div>
        </div>
        
        <div style="background-color: #d4edda; border: 1px solid #c3e6cb; color: #155724; padding: 15px; border-radius: 8px; text-align: center;">
          <strong>💡 Action requise :</strong> Répondre à ce message dans les plus brefs délais
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 12px;">
          <p>Email automatique généré par le système de contact Quarter Fusion</p>
          <p>6 passage de l'aurore, 95800 Cergy</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Template pour l'email de confirmation envoyé au client
 */
export function generateContactConfirmationEmail(data: ContactEmailData) {
  const { name, subject } = data;
  const sentAt = new Date().toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Message reçu - Quarter Fusion</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background-color: #28a745; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="margin: 0; font-size: 24px;">Quarter Fusion</h1>
        <p style="margin: 5px 0 0 0; font-size: 16px;">Message bien reçu !</p>
      </div>
      
      <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px;">
        <p>Bonjour ${name},</p>
        
        <div style="background-color: #d4edda; border: 1px solid #c3e6cb; color: #155724; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">✅ Votre message a été envoyé avec succès !</h3>
          <p><strong>Envoyé le :</strong> ${sentAt}</p>
          <p><strong>Sujet :</strong> ${subject}</p>
        </div>
        
        <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #b91c1c; margin-top: 0;">Que se passe-t-il maintenant ?</h3>
          <ul style="padding-left: 20px;">
            <li style="margin-bottom: 8px;">📧 Votre message a été transmis à notre équipe</li>
            <li style="margin-bottom: 8px;">⏱️ Nous vous répondrons dans les <strong>24-48h</strong></li>
            <li style="margin-bottom: 8px;">📱 Pour une réponse plus rapide, appelez-nous au <strong>01 30 17 31 78</strong></li>
          </ul>
        </div>
        
        <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
          <h4 style="color: #b91c1c; margin-top: 0;">En attendant notre réponse...</h4>
          <p>Découvrez nos menus et commandez en ligne !</p>
          <div style="margin: 15px 0;">
            <a href="http://localhost:3000/click-and-collect" style="background-color: #b91c1c; color: white; padding: 12px 24px; border-radius: 25px; text-decoration: none; margin: 0 10px; display: inline-block;">Click & Collect</a>
            <a href="http://localhost:3000/livraison" style="background-color: transparent; border: 2px solid #b91c1c; color: #b91c1c; padding: 10px 22px; border-radius: 25px; text-decoration: none; margin: 0 10px; display: inline-block;">Livraison</a>
          </div>
        </div>
        
        <p>Merci de votre confiance !</p>
        
        <p>Cordialement,<br><strong>L'équipe Quarter Fusion</strong></p>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 12px;">
          <p>📍 <strong>Notre adresse :</strong> 6 passage de l'aurore, 95800 Cergy</p>
          <p>📞 <strong>Téléphone :</strong> 01 30 17 31 78</p>
          <p>🕐 <strong>Horaires :</strong> Lundi au dimanche - consultez notre site web</p>
        </div>
      </div>
    </body>
    </html>
  `;
}