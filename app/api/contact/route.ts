import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '../../../lib/email';
import { 
  generateContactNotificationEmail, 
  generateContactConfirmationEmail,
  ContactEmailData 
} from '../../../emails/templates/contact-template';

// Configuration pour Next.js - route dynamique
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, subject, message } = body;

    // Validation des champs requis
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Tous les champs obligatoires doivent être renseignés (nom, email, sujet, message)' 
        },
        { status: 400 }
      );
    }

    // Validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Veuillez saisir une adresse email valide' 
        },
        { status: 400 }
      );
    }

    // Préparation des données pour les templates
    const contactData: ContactEmailData = {
      name: name.trim(),
      email: email.trim(),
      phone: phone?.trim() || '',
      subject: subject.trim(),
      message: message.trim()
    };

    // Génération des templates email
    const notificationHtml = generateContactNotificationEmail(contactData);
    const confirmationHtml = generateContactConfirmationEmail(contactData);

    // Envoi de l'email de notification au restaurant
    const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_USER;
    if (!adminEmail) {
      console.error('ADMIN_EMAIL ou EMAIL_USER non configuré dans les variables d\'environnement');
      return NextResponse.json(
        { 
          success: false, 
          error: 'Configuration email manquante sur le serveur' 
        },
        { status: 500 }
      );
    }

    const notificationSent = await sendEmail({
      to: adminEmail,
      subject: `[Quarter Fusion] Nouveau message de contact: ${subject}`,
      html: notificationHtml
    });

    if (!notificationSent) {
      console.error('Échec de l\'envoi de l\'email de notification au restaurant');
      return NextResponse.json(
        { 
          success: false, 
          error: 'Erreur lors de l\'envoi du message. Veuillez réessayer ou nous contacter par téléphone.' 
        },
        { status: 500 }
      );
    }

    // Envoi de l'email de confirmation au client
    const confirmationSent = await sendEmail({
      to: email,
      subject: 'Quarter Fusion - Message bien reçu !',
      html: confirmationHtml
    });

    // Si la confirmation échoue, on log mais on ne fait pas échouer la requête
    if (!confirmationSent) {
      console.error('Échec de l\'envoi de l\'email de confirmation au client:', email);
    }

    // Générer un numéro de référence pour le message
    const referenceNumber = `MSG-${Date.now()}`;

    console.log(`Message de contact reçu avec succès:`, {
      reference: referenceNumber,
      from: email,
      subject: subject,
      notificationSent,
      confirmationSent
    });

    return NextResponse.json({
      success: true,
      message: 'Votre message a été envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.',
      reference: referenceNumber,
      confirmationSent
    });

  } catch (error) {
    console.error('Erreur lors du traitement du message de contact:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Une erreur inattendue s\'est produite. Veuillez réessayer ou nous contacter directement.' 
      },
      { status: 500 }
    );
  }
}

// Méthode GET pour vérifier que l'endpoint fonctionne (optionnel)
export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'API de contact Quarter Fusion - Utilisez POST pour envoyer un message',
    endpoints: {
      POST: 'Envoyer un message de contact',
      requiredFields: ['name', 'email', 'subject', 'message'],
      optionalFields: ['phone']
    }
  });
}