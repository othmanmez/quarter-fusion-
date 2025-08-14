# Système de Commande Interactive - Quarter Fusion

## 📋 Vue d'ensemble

Ce système implémente un wizard de commande interactif en 3 étapes pour le snack Quarter Fusion, utilisant **Next.js 14**, **MongoDB Atlas**, **Mongoose** et **Nodemailer**.

## 🚀 Fonctionnalités

### 1. Wizard de commande en 3 étapes
- ✅ **Étape 1** : Sélection du menu avec panier en temps réel
- ✅ **Étape 2** : Récapitulatif de la commande avec modifications
- ✅ **Étape 3** : Informations client et confirmation

### 2. Deux modes de commande
- ✅ **Click & Collect** : Retrait en restaurant
- ✅ **Livraison** : Livraison à domicile avec adresse

### 3. Gestion d'état avancée
- ✅ Contexte React pour persistance des données
- ✅ Panier en temps réel avec calculs automatiques
- ✅ Validation des formulaires

## 📁 Structure des fichiers

```
quarter-fusion/
├── app/
│   ├── commander/
│   │   ├── click-and-collect/page.tsx    # Page Click & Collect
│   │   └── livraison/page.tsx            # Page Livraison
│   ├── components/
│   │   ├── OrderWizard.tsx               # Composant principal
│   │   └── order/
│   │       ├── MenuSelection.tsx         # Étape 1
│   │       ├── OrderSummary.tsx          # Étape 2
│   │       ├── CustomerInfoForm.tsx      # Étape 3
│   │       └── OrderConfirmation.tsx     # Confirmation
│   ├── contexts/
│   │   └── OrderContext.tsx              # Contexte React
│   └── api/
│       ├── menu/route.ts                 # API menu
│       ├── settings/route.ts             # API paramètres
│       └── orders/route.ts               # API commandes
├── lib/
│   ├── models/
│   │   ├── MenuItem.ts                   # Modèle menu
│   │   ├── Settings.ts                   # Modèle paramètres
│   │   └── Order.ts                      # Modèle commande
│   ├── email.ts                          # Gestion emails
│   └── mongodb.ts                        # Connexion DB
└── scripts/
    └── init-menu.js                      # Script d'initialisation
```

## ⚙️ Configuration

### 1. Variables d'environnement

Assurez-vous d'avoir configuré `.env.local` :

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
```

### 2. Initialisation du menu

Pour initialiser le menu avec les données par défaut :

```bash
# Installer node-fetch si nécessaire
npm install node-fetch

# Lancer le serveur de développement
npm run dev

# Dans un autre terminal, initialiser le menu
node scripts/init-menu.js
```

## 🔧 Utilisation

### 1. Accès aux pages de commande

- **Click & Collect** : `/commander/click-and-collect`
- **Livraison** : `/commander/livraison`

### 2. Navigation dans le wizard

Le système utilise un contexte React pour maintenir l'état entre les étapes :

```typescript
import { useOrder } from '../contexts/OrderContext';

const { state, addToCart, nextStep, prevStep } = useOrder();
```

### 3. API Endpoints

#### GET /api/menu
Récupère tous les éléments du menu disponibles.

#### POST /api/menu
Initialise le menu avec les données par défaut.

#### GET /api/settings
Récupère les paramètres (villes de livraison, frais, etc.).

#### POST /api/orders
Crée une nouvelle commande avec envoi d'emails.

## 📊 Modèles de données

### MenuItem
```typescript
interface MenuItem {
  _id: string;
  title: string;
  description: string;
  price: number;
  category: 'buckets' | 'quarters' | 'sandwiches' | 'accompagnements';
  image: string;
  badge?: 'HOT' | 'NEW' | 'TOP';
  available: boolean;
}
```

### Order
```typescript
interface Order {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: OrderItem[];
  total: number;
  deliveryAddress?: string;
  city?: string;
  isDelivery: boolean;
  status: 'A_PREPARER' | 'En attente' | 'En préparation' | 'Prête' | 'Terminée' | 'Annulée';
  estimatedTime: string;
  paymentMethod: 'especes' | 'carte';
  notes?: string;
}
```

## 🎨 Interface utilisateur

### Design responsive
- **Mobile-first** avec Tailwind CSS
- **Sidebar** avec panier en temps réel
- **Indicateurs d'étapes** visuels
- **Validation** en temps réel des formulaires

### Composants principaux

#### OrderWizard
- Gestion des 3 étapes
- Sidebar avec panier
- Navigation entre étapes
- Confirmation de commande

#### MenuSelection
- Affichage par catégories
- Ajout au panier
- Badges (HOT, NEW, TOP)
- Images optimisées

#### OrderSummary
- Récapitulatif détaillé
- Modifications de quantités
- Calculs automatiques
- Informations importantes

#### CustomerInfoForm
- Validation des champs
- Champs conditionnels (livraison)
- Sélection du paiement
- Notes spéciales

## 🔒 Sécurité et validation

### Validation côté client
- Champs obligatoires
- Format email et téléphone
- Quantités positives
- Adresse requise pour livraison

### Validation côté serveur
- Données requises
- Types de données
- Statuts de commande valides
- Méthodes de paiement autorisées

## 📧 Emails automatiques

### Types d'emails
1. **Confirmation client** : Détails de la commande
2. **Notification admin** : Nouvelle commande à traiter
3. **Commande prête** : Notification de disponibilité
4. **Commande terminée** : Confirmation de finalisation

### Templates
- Design responsive
- Couleurs Quarter Fusion
- Informations complètes
- Liens d'action

## 🚀 Déploiement

### 1. Préparation
```bash
# Installer les dépendances
npm install

# Initialiser le menu
node scripts/init-menu.js

# Tester les emails
# Configurer les variables d'environnement
```

### 2. Variables d'environnement Vercel
```bash
vercel env add SMTP_HOST
vercel env add SMTP_PORT
vercel env add SMTP_USER
vercel env add SMTP_PASS
vercel env add SMTP_FROM
vercel env add MONGODB_URI
vercel env add ADMIN_EMAIL
```

### 3. Déploiement
```bash
vercel --prod
```

## 🧪 Tests

### Test du wizard
1. Naviguer vers `/commander/click-and-collect`
2. Ajouter des articles au panier
3. Vérifier les calculs en temps réel
4. Remplir le formulaire client
5. Confirmer la commande

### Test des emails
1. Créer une commande
2. Vérifier l'email de confirmation
3. Vérifier l'email admin
4. Tester les mises à jour de statut

## 🔄 Évolutions futures

### Fonctionnalités à ajouter
- [ ] **Paiement en ligne** avec Stripe
- [ ] **Suivi en temps réel** des commandes
- [ ] **Notifications push** pour les statuts
- [ ] **Historique des commandes** client
- [ ] **Système de fidélité**
- [ ] **Gestion des allergènes**
- [ ] **Personnalisation des plats**

### Optimisations
- [ ] **Cache Redis** pour les performances
- [ ] **Queue d'emails** avec Bull
- [ ] **Analytics** des commandes
- [ ] **A/B testing** des interfaces
- [ ] **PWA** pour les commandes mobiles

## 📞 Support

Pour toute question ou problème :
- **Email** : contact@quarterfusion.fr
- **Téléphone** : 01 30 17 31 78
- **Adresse** : 6 passage de l'aurore, 95800 Cergy

---

**Quarter Fusion** - Système de commande interactive v1.0 