# 📧 Page Contact - Documentation Complète

## Vue d'ensemble

La page Contact de Quarter Fusion permet aux clients d'envoyer des messages à l'équipe du restaurant via un formulaire en ligne sécurisé avec notification par email.

## 🏗️ Architecture

### Frontend (`/app/contact/page.tsx`)
- **Type**: Client Component (`'use client'`)
- **Framework**: React avec TypeScript
- **Styling**: Tailwind CSS
- **Gestion d'état**: React hooks (useState)

### Backend (`/app/api/contact/route.ts`)
- **Type**: API Route Next.js 15
- **Méthodes**: POST (principal), GET (test)
- **Validation**: Côté serveur complète
- **Email**: Double envoi (notification + confirmation)

### Templates Email (`/emails/templates/contact-template.ts`)
- **Notification**: Email envoyé au restaurant
- **Confirmation**: Email envoyé au client
- **Style**: Cohérent avec l'identité Quarter Fusion

## 📋 Fonctionnalités

### Formulaire de Contact
```typescript
interface FormData {
  name: string;          // Nom complet (requis)
  email: string;         // Email (requis, validé)
  phone?: string;        // Téléphone (optionnel)
  subject: string;       // Sujet (requis, select)
  message: string;       // Message (requis)
}
```

### Sujets Disponibles
- **Information**: Demande d'information générale
- **Commande**: Question sur une commande
- **Suggestion**: Suggestion d'amélioration
- **Réclamation**: Réclamation ou problème
- **Autre**: Autres sujets

### Validation
- **Frontend**: HTML5 + React (temps réel)
- **Backend**: Vérification complète + regex email
- **Sécurité**: Sanitisation des données

## 🔄 Flux de Traitement

### 1. Soumission du Formulaire
```typescript
handleSubmit() → API /api/contact → Validation → Email → Response
```

### 2. Validation des Données
- Champs requis: name, email, subject, message
- Format email: regex `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
- Longueur et sécurité des chaînes

### 3. Envoi d'Emails
```typescript
// Email 1: Notification au restaurant
sendEmail({
  to: process.env.ADMIN_EMAIL,
  subject: `[Quarter Fusion] Nouveau message: ${subject}`,
  html: generateContactNotificationEmail(data)
})

// Email 2: Confirmation au client
sendEmail({
  to: formData.email,
  subject: 'Quarter Fusion - Message bien reçu !',
  html: generateContactConfirmationEmail(data)
})
```

### 4. Réponse et UI
- **Succès**: Modal vert avec numéro de référence
- **Erreur**: Modal rouge avec détails de l'erreur
- **Loading**: Bouton désactivé et texte "Envoi en cours..."

## 📧 Configuration Email

### Variables d'Environnement
```env
# Gmail SMTP Configuration
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT="587"
EMAIL_USER="rdvplateform@gmail.com"
EMAIL_PASS="omdt leke zdgu ghwm"
ADMIN_EMAIL="shadowytcontactpro@gmail.com"
```

### Librairie Utilisée
- **Nodemailer**: Transport SMTP Gmail
- **Configuration**: Non-sécurisé (port 587)
- **Authentification**: OAuth2 via App Password

## 🎨 Interface Utilisateur

### Structure de la Page
1. **Header**: Titre et description
2. **Formulaire**: Champs organisés en grid responsive
3. **Contact Rapide**: Bouton téléphone + adresse
4. **InfoSection**: Horaires et informations pratiques

### Modal de Notification (`NotificationModal.tsx`)
```typescript
interface NotificationModalProps {
  isOpen: boolean;
  type: 'success' | 'error';
  title: string;
  message: string;
  details?: string;
  onClose: () => void;
}
```

### Caractéristiques du Modal
- **Backdrop**: Blur léger + overlay semi-transparent
- **Animation**: Fade-in + zoom-in (Tailwind CSS)
- **Accessibilité**: Fermeture par Escape + focus trap
- **Actions**: Boutons contextuels (appeler/fermer)

## 🔧 Templates d'Email

### Template Notification (Restaurant)
- **Header**: Rouge Quarter Fusion
- **Contenu**: Toutes les infos du contact
- **Tableau**: Données organisées et lisibles
- **Action**: Bouton de réponse rapide

### Template Confirmation (Client)
- **Header**: Vert (succès)
- **Contenu**: Confirmation + prochaines étapes
- **Links**: Liens vers menu et commandes
- **Contact**: Informations de contact du restaurant

### Styling des Emails
```css
/* Couleurs Quarter Fusion */
--primary: #b91c1c (rouge)
--success: #28a745 (vert)
--background: #f9f9f9 (gris clair)

/* Typography */
font-family: Arial, sans-serif
line-height: 1.6
max-width: 600px
```

## 📊 Gestion d'Erreurs

### Types d'Erreurs Gérées
1. **Validation**: Champs manquants ou invalides
2. **SMTP**: Problème de configuration email
3. **Réseau**: Erreur de connexion
4. **Serveur**: Erreur interne (500)

### Messages d'Erreur Utilisateur
```typescript
// Validation
"Tous les champs obligatoires doivent être renseignés"

// Email invalide
"Veuillez saisir une adresse email valide"

// SMTP
"Configuration email manquante sur le serveur"

// Connexion
"Impossible de contacter le serveur"
```

## 🚀 Utilisation

### Tester la Page
1. Démarrer le serveur: `npm run dev --turbopack`
2. Aller sur: `http://localhost:3001/contact`
3. Remplir le formulaire avec des données valides
4. Vérifier la réception des emails

### Debug
```bash
# Logs côté serveur
console.log('Message reçu:', { reference, from, subject })

# Logs côté client  
console.error('Erreur frontend:', error)
```

## 🔐 Sécurité

### Mesures Implémentées
- **Validation**: Double validation (frontend + backend)
- **Sanitisation**: Échappement des caractères spéciaux
- **Rate Limiting**: À implémenter si nécessaire
- **CORS**: Configuration Next.js par défaut

### Recommandations
- Monitorer les tentatives d'envoi en masse
- Implémenter un CAPTCHA si spam élevé
- Logger les tentatives d'injection

## 🎯 Points d'Amélioration

### Fonctionnalités Futures
- **Attachments**: Support des pièces jointes
- **Rich Text**: Éditeur WYSIWYG pour les messages
- **Templates**: Messages prédéfinis
- **Notification Push**: Alertes en temps réel
- **Dashboard Admin**: Interface de gestion des messages

### Performance
- **Cache**: Mise en cache des templates
- **Queue**: File d'attente pour les emails
- **CDN**: Images des templates via CDN

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 768px (formulaire en colonne simple)
- **Tablet**: 768-1024px (grid 2 colonnes)  
- **Desktop**: > 1024px (layout complet)

### Optimisations Mobile
- Touch-friendly buttons (44px minimum)
- Keyboard approprié (email, tel, text)
- Viewport optimisé
- Loading states visibles

---

**Dernière mise à jour**: $(date +%Y-%m-%d)
**Version**: 1.0.0
**Maintenu par**: Équipe Quarter Fusion