import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export const dynamic = 'force-dynamic';

// Stockage en mémoire des codes OTP (clé = email, valeur = { code, expiresAt, orderData })
const otpStore = new Map<string, { code: string; expiresAt: number; orderData: any }>();

// Nettoyage automatique des OTP expirés toutes les 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of otpStore.entries()) {
    if (value.expiresAt < now) {
      otpStore.delete(key);
    }
  }
}, 5 * 60 * 1000);

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

function generateOtpCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function generateOtpEmailHTML(code: string, prenom: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Code de vérification - Quarter Fusion</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; background: #f5f5f5; margin: 0; padding: 20px;">
      <div style="max-width: 500px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
        
        <div style="background: linear-gradient(135deg, #dc2626, #b91c1c); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">🍔 Quarter Fusion</h1>
          <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0 0; font-size: 15px;">Vérification de votre commande</p>
        </div>

        <div style="padding: 35px 30px;">
          <p style="font-size: 16px; margin-top: 0;">Bonjour <strong>${prenom}</strong>,</p>
          
          <p style="color: #555;">Voici votre code de vérification pour confirmer votre commande :</p>

          <div style="text-align: center; margin: 30px 0;">
            <div style="display: inline-block; background: #f8f8f8; border: 2px dashed #dc2626; border-radius: 12px; padding: 20px 40px;">
              <span style="font-size: 42px; font-weight: bold; letter-spacing: 12px; color: #dc2626; font-family: monospace;">${code}</span>
            </div>
          </div>

          <div style="background: #fff8f0; border-left: 4px solid #f97316; padding: 15px; border-radius: 0 8px 8px 0; margin: 20px 0;">
            <p style="margin: 0; font-size: 13px; color: #c2410c;">
              ⏱️ Ce code est valable <strong>10 minutes</strong>.<br>
              Ne le communiquez à personne.
            </p>
          </div>

          <p style="color: #777; font-size: 13px;">Si vous n'avez pas passé de commande chez Quarter Fusion, ignorez cet email.</p>
        </div>

        <div style="background: #f9f9f9; padding: 20px; text-align: center; border-top: 1px solid #eee;">
          <p style="margin: 0; color: #999; font-size: 12px;">
            Quarter Fusion · 6 passage de l'aurore, 95800 Cergy · 01 30 17 31 78
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// POST /api/verify-otp
// body: { action: 'send', email, prenom, orderData } | { action: 'verify', email, code }
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    // --- Envoi du code OTP ---
    if (action === 'send') {
      const { email, prenom, orderData } = body;

      if (!email || !prenom || !orderData) {
        return NextResponse.json({ error: 'Données manquantes' }, { status: 400 });
      }

      const code = generateOtpCode();
      const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

      // Stocker l'OTP avec les données de commande
      otpStore.set(email.toLowerCase(), { code, expiresAt, orderData });

      // Envoyer l'email
      try {
        await transporter.sendMail({
          from: `"Quarter Fusion" <${process.env.EMAIL_USER}>`,
          to: email,
          subject: `Votre code de vérification : ${code} - Quarter Fusion`,
          html: generateOtpEmailHTML(code, prenom),
        });
        console.log(`✅ [OTP] Code envoyé à ${email}`);
      } catch (emailErr) {
        console.error('❌ [OTP] Erreur envoi email:', emailErr);
        return NextResponse.json({ error: "Impossible d'envoyer l'email. Vérifiez votre adresse email." }, { status: 500 });
      }

      return NextResponse.json({ success: true, message: `Code envoyé à ${email}` });
    }

    // --- Vérification du code OTP ---
    if (action === 'verify') {
      const { email, code } = body;

      if (!email || !code) {
        return NextResponse.json({ error: 'Email et code requis' }, { status: 400 });
      }

      const stored = otpStore.get(email.toLowerCase());

      if (!stored) {
        return NextResponse.json({ error: 'Aucun code trouvé pour cet email. Veuillez en demander un nouveau.' }, { status: 400 });
      }

      if (Date.now() > stored.expiresAt) {
        otpStore.delete(email.toLowerCase());
        return NextResponse.json({ error: 'Le code a expiré. Veuillez en demander un nouveau.' }, { status: 400 });
      }

      if (stored.code !== code.trim()) {
        return NextResponse.json({ error: 'Code incorrect. Veuillez réessayer.' }, { status: 400 });
      }

      // Code valide → on retourne les données de commande pour les soumettre
      const orderData = stored.orderData;
      otpStore.delete(email.toLowerCase()); // Supprimer le code utilisé

      return NextResponse.json({ success: true, orderData });
    }

    return NextResponse.json({ error: 'Action invalide' }, { status: 400 });

  } catch (error) {
    console.error('[OTP] Erreur:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
