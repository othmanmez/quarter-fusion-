# Gestion des Emails Transactionnels - Quarter Fusion

## 📧 Vue d'ensemble

Ce système implémente la gestion complète des emails transactionnels pour le snack Quarter Fusion, utilisant **Next.js 14**, **MongoDB Atlas**, **Mongoose** et **Nodemailer**.

## 🚀 Fonctionnalités

### 1. Emails automatiques lors de la création d'une commande
- ✅ **Email de confirmation client** avec détails complets
- ✅ **Email de notification admin** avec récapitulatif
- ✅ Numéro de commande unique généré automatiquement
- ✅ Détails des articles, prix et informations de livraison

### 2. Emails lors de la mise à jour du statut
- ✅ **Email "Prête"** quand la commande est prête
- ✅ **Email "Terminée"** quand la commande est finalisée
- ✅ **Emails génériques** pour les autres statuts
- ✅ Heure de mise à jour incluse

### 3. Gestion robuste des erreurs
- ✅ Envoi d'emails en arrière-plan (non-bloquant)
- ✅ Logs détaillés des succès/échecs
- ✅ Fallback gracieux si les emails échouent

## 📁 Structure des fichiers

```
quarter-fusion/
├── lib/
│   ├── email.ts              # Configuration Nodemailer + templates
│   ├── mongodb.ts            # Connexion MongoDB Atlas
│   └── models/
│       └── Order.ts          # Modèle Mongoose pour les commandes
├── app/api/orders/
│   ├── route.ts              # POST/GET /api/orders
│   └── [id]/status/
│       └── route.ts          # PUT /api/orders/[id]/status
├── env.example               # Variables d'environnement
├── examples/
│   └── api-usage.md          # Exemples d'utilisation
└── README-EMAILS.md          # Cette documentation
```

## ⚙️ Configuration

### 1. Variables d'environnement

Créez un fichier `.env.local` basé sur `env.example` :

```env
# Configuration SMTP
SMTP_HOST="smtp.example.com"
SMTP_PORT=587
SMTP_USER="contact@mon-site.com"
SMTP_PASS="motdepasseSMTP"
SMTP_FROM="Snack Quarter Fusion <contact@mon-site.com>"

# Configuration MongoDB Atlas
MONGODB_URI="mongodb+srv://username:password@cluster.mongodb.net/quarter-fusion"

# Configuration admin
ADMIN_EMAIL="admin@quarterfusion.fr"
NEXT_PUBLIC_ADMIN_URL="http://localhost:3000/admin"
```

### 2. Dépendances installées

```bash
npm install nodemailer mongoose
npm install @types/nodemailer
```

## 📧 Templates d'emails

### Email de confirmation client
- **Couleur principale** : Rouge Quarter Fusion (#b91c1c)
- **Contenu** : Numéro de commande, détails des articles, total, adresse de livraison
- **Design** : Responsive, compatible tous clients email

### Email "Commande prête"
- **Couleur principale** : Vert (#28a745)
- **Contenu** : Numéro de commande, heure actuelle, informations de retrait/livraison
- **Design** : Accent sur l'urgence et la disponibilité

### Email de notification admin
- **Couleur principale** : Rouge Quarter Fusion (#b91c1c)
- **Contenu** : Récapitulatif complet, informations client, lien vers l'interface admin
- **Design** : Professionnel, orienté action

## 🔧 API Routes

### POST /api/orders
**Créer une nouvelle commande**

```javascript
const orderData = {
  customerName: "Jean Dupont",
  customerEmail: "jean.dupont@email.com",
  customerPhone: "01 23 45 67 89",
  items: [
    {
      title: "Bucket Maxi Fusion",
      quantity: 1,
      price: 24.90
    }
  ],
  deliveryAddress: "123 Rue de la Paix",
  city: "Cergy",
  isDelivery: true
};

const response = await fetch('/api/orders', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(orderData)
});
```

### PUT /api/orders/[id]/status
**Mettre à jour le statut d'une commande**

```javascript
const response = await fetch(`/api/orders/${orderId}/status`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ status: "Prête" })
});
```

### GET /api/orders
**Récupérer toutes les commandes**

```javascript
const response = await fetch('/api/orders');
const orders = await response.json();
```

## 📊 Modèle de données

### Schéma Order (Mongoose)

```typescript
interface IOrder {
  orderNumber: string;        // QF20241201001
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: OrderItem[];
  total: number;
  deliveryAddress?: string;
  city?: string;
  isDelivery: boolean;
  status: 'En attente' | 'En préparation' | 'Prête' | 'Terminée' | 'Annulée';
  estimatedTime: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Statuts de commande
- **En attente** : Commande reçue, en attente de traitement
- **En préparation** : Commande en cours de préparation
- **Prête** : Commande prête pour retrait/livraison
- **Terminée** : Commande livrée/retirée
- **Annulée** : Commande annulée

## 🎨 Design des emails

### Caractéristiques
- **Responsive** : Compatible mobile et desktop
- **Inline CSS** : Compatible tous clients email
- **Couleurs Quarter Fusion** : Rouge #b91c1c, blanc, gris
- **Typographie** : Arial, sans-serif pour la compatibilité
- **Largeur maximale** : 600px pour une lecture optimale

### Éléments visuels
- **Header coloré** avec logo Quarter Fusion
- **Tableaux** pour les détails des commandes
- **Badges colorés** pour les statuts
- **Boutons d'action** pour l'admin
- **Footer** avec informations de contact

## 🔒 Sécurité et performance

### Sécurité
- ✅ Validation des données d'entrée
- ✅ Gestion des erreurs sans exposition d'informations sensibles
- ✅ Variables d'environnement pour les secrets

### Performance
- ✅ Connexion MongoDB mise en cache
- ✅ Envoi d'emails en arrière-plan (non-bloquant)
- ✅ Index MongoDB pour les requêtes fréquentes
- ✅ Logs pour le monitoring

### Robustesse
- ✅ Fallback gracieux si les emails échouent
- ✅ Retry automatique pour les connexions MongoDB
- ✅ Validation des statuts de commande
- ✅ Gestion des commandes non trouvées

## 🚀 Déploiement

### 1. Configuration production
```env
SMTP_HOST="smtp.gmail.com"  # ou votre fournisseur SMTP
SMTP_PORT=587
SMTP_USER="contact@quarterfusion.fr"
SMTP_PASS="votre_mot_de_passe_app"
SMTP_FROM="Quarter Fusion <contact@quarterfusion.fr>"
MONGODB_URI="mongodb+srv://prod_user:prod_pass@cluster.mongodb.net/quarter-fusion"
ADMIN_EMAIL="admin@quarterfusion.fr"
```

### 2. Fournisseurs SMTP recommandés
- **Gmail** : smtp.gmail.com:587
- **SendGrid** : smtp.sendgrid.net:587
- **Mailgun** : smtp.mailgun.org:587
- **Amazon SES** : email-smtp.eu-west-1.amazonaws.com:587

### 3. Variables d'environnement Vercel
```bash
vercel env add SMTP_HOST
vercel env add SMTP_PORT
vercel env add SMTP_USER
vercel env add SMTP_PASS
vercel env add SMTP_FROM
vercel env add MONGODB_URI
vercel env add ADMIN_EMAIL
```

## 📝 Logs et monitoring

### Logs automatiques
```javascript
// Succès
console.log('Email envoyé avec succès:', info.messageId);
console.log('Connexion MongoDB établie');

// Erreurs
console.error('Erreur lors de l\'envoi de l\'email:', error);
console.error('Erreur lors de la création de la commande:', error);
```

### Monitoring recommandé
- **Vercel Analytics** pour les performances
- **MongoDB Atlas** pour les requêtes
- **Logs serveur** pour les erreurs d'email
- **Tests d'envoi** réguliers

## 🧪 Tests

### Test d'envoi d'email
```javascript
// Test simple de la fonction sendEmail
import { sendEmail } from '../lib/email';

const testEmail = await sendEmail({
  to: 'test@example.com',
  subject: 'Test Quarter Fusion',
  html: '<h1>Test email</h1>'
});

console.log('Email test envoyé:', testEmail);
```

### Test de création de commande
```javascript
// Test de l'API de création
const testOrder = {
  customerName: "Test User",
  customerEmail: "test@example.com",
  customerPhone: "01 23 45 67 89",
  items: [{ title: "Test Item", quantity: 1, price: 10.00 }],
  isDelivery: false
};

const response = await fetch('/api/orders', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(testOrder)
});

console.log('Test commande:', await response.json());
```

## 🔄 Évolutions futures

### Fonctionnalités à ajouter
- [ ] **Templates d'email personnalisables** via interface admin
- [ ] **Notifications SMS** avec Twilio
- [ ] **Webhooks** pour intégrations tierces
- [ ] **Historique des emails** envoyés
- [ ] **Tests automatisés** pour les emails
- [ ] **Interface admin** pour gérer les commandes
- [ ] **Notifications push** pour les commandes urgentes

### Optimisations
- [ ] **Queue d'emails** avec Redis/Bull
- [ ] **Templates d'email** avec Handlebars
- [ ] **A/B testing** des templates
- [ ] **Analytics** des emails (open rate, click rate)
- [ ] **Signature d'emails** personnalisée

## 📞 Support

Pour toute question ou problème :
- **Email** : contact@quarterfusion.fr
- **Téléphone** : 01 30 17 31 78
- **Adresse** : 6 passage de l'aurore, 95800 Cergy

---

**Quarter Fusion** - Système de gestion des emails transactionnels v1.0 