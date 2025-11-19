# 🍔 Quarter Fusion - Système de Commande en Ligne

<div align="center">

![Quarter Fusion](https://img.shields.io/badge/Quarter_Fusion-Restaurant-red?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?style=for-the-badge&logo=mongodb)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma)

**Plateforme complète de commande en ligne pour restaurant**

[Documentation](#-documentation) • [Installation](#-installation) • [Fonctionnalités](#-fonctionnalités) • [Configuration](#-configuration)

</div>

---

## 📋 Table des matières

- [À propos](#-à-propos)
- [Fonctionnalités](#-fonctionnalités)
- [Technologies](#-technologies-utilisées)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Documentation](#-documentation)
- [Structure du projet](#-structure-du-projet)
- [Scripts disponibles](#-scripts-disponibles)
- [Déploiement](#-déploiement)
- [Support](#-support)

---

## 🎯 À propos

**Quarter Fusion** est une plateforme web moderne permettant aux clients de commander en ligne via deux modes :
- 🏪 **Click & Collect** : Commande en ligne, retrait en restaurant
- 🚗 **Livraison à domicile** : Livraison directe au domicile du client

Le système offre une interface intuitive pour les clients et un panneau d'administration complet pour gérer les commandes, le menu, les personnalisations et les paramètres du restaurant.

---

## ✨ Fonctionnalités

### **Pour les clients :**

#### 🛒 Commande en ligne
- ✅ Parcourir le menu par catégories
- ✅ Personnalisation des plats (sauces, suppléments, options)
- ✅ Option boisson pour les menus (+1,50€)
- ✅ Panier dynamique avec modification des quantités
- ✅ Choix entre Click & Collect et Livraison
- ✅ Sélection de la ville de livraison avec frais personnalisés
- ✅ Paiement à la livraison/retrait (espèces ou carte)

#### 📧 Notifications
- ✅ Email de confirmation automatique
- ✅ Numéro de commande unique
- ✅ Récapitulatif détaillé de la commande

### **Pour les administrateurs :**

#### 📊 Gestion des commandes
- ✅ Tableau de bord avec toutes les commandes
- ✅ Filtrage par statut (À préparer, En préparation, Prête, Terminée, Annulée)
- ✅ Recherche par numéro de commande, nom, téléphone
- ✅ Mise à jour du statut en temps réel
- ✅ Notification sonore pour les nouvelles commandes
- ✅ Badge de notification dans l'interface admin

#### 🍽️ Gestion du menu
- ✅ Ajout/modification/suppression de plats
- ✅ Gestion des catégories
- ✅ Badges (HOT, NEW, TOP)
- ✅ Disponibilité par mode (Click & Collect / Livraison)
- ✅ Gestion des prix et descriptions
- ✅ Upload d'images

#### 🎨 Personnalisations
- ✅ Créer des personnalisations par plat
- ✅ Types : choix unique, choix multiples, on/off
- ✅ Options gratuites ou payantes
- ✅ Templates rapides (sauces, suppléments, etc.)
- ✅ Personnalisations obligatoires ou facultatives
- ✅ Désactivation automatique pour les boissons

#### 🚗 Gestion des villes de livraison
- ✅ Ajouter/modifier/supprimer des villes
- ✅ Frais de livraison personnalisés par ville
- ✅ Commande minimum spécifique par ville
- ✅ Codes postaux pour pré-remplissage
- ✅ Activation/désactivation temporaire

#### 🖨️ Impression automatique
- ✅ Impression automatique des tickets de commande
- ✅ Compatible avec imprimantes thermiques Epson WiFi
- ✅ Configuration flexible (IP, port, largeur)
- ✅ Tickets personnalisés avec logo et informations
- ✅ Test d'impression depuis l'interface admin

#### ⚙️ Paramètres
- ✅ Activer/désactiver Click & Collect
- ✅ Activer/désactiver Livraison
- ✅ Frais de livraison par défaut
- ✅ Montant minimum de commande
- ✅ Temps estimé de préparation

#### 🔐 Authentification
- ✅ Système de connexion sécurisé
- ✅ Protection des routes admin
- ✅ Gestion des sessions

---

## 🛠️ Technologies utilisées

### **Frontend**
- **Next.js 14** - Framework React avec SSR et App Router
- **TypeScript** - Typage statique
- **Tailwind CSS** - Framework CSS utility-first
- **React Context API** - Gestion d'état global
- **Sonner** - Notifications toast élégantes

### **Backend**
- **Next.js API Routes** - API RESTful
- **Prisma** - ORM moderne pour MongoDB
- **MongoDB Atlas** - Base de données NoSQL cloud
- **NextAuth.js** - Authentification sécurisée
- **Nodemailer** - Envoi d'emails
- **bcryptjs** - Hashage des mots de passe

### **Impression**
- **node-thermal-printer** - Impression sur imprimantes thermiques
- **Epson TM Series** - Support natif des imprimantes Epson

### **PWA**
- **Service Workers** - Fonctionnement hors ligne
- **Web App Manifest** - Installation sur écran d'accueil
- **Responsive Design** - Adapté mobile, tablette, desktop

---

## 🚀 Installation

### **Prérequis**

- Node.js 18+ et npm/yarn
- MongoDB Atlas (compte gratuit)
- Compte Gmail (pour l'envoi d'emails)
- Git

### **1. Cloner le projet**

   ```bash
git clone <url-du-repo>
   cd quarter-fusion
   ```

### **2. Installer les dépendances**

   ```bash
   npm install
   ```

### **3. Configuration des variables d'environnement**

Créez un fichier `.env.local` à la racine :

```env
# Base de données MongoDB
DATABASE_URL="mongodb+srv://user:password@cluster.mongodb.net/quarterfusion"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="votre-secret-tres-long-et-aleatoire"

# Email (Gmail)
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT="587"
EMAIL_USER="votre-email@gmail.com"
EMAIL_PASS="votre-mot-de-passe-application"
ADMIN_EMAIL="admin@quarterfusion.com"

# Imprimante (optionnel)
AUTO_PRINT_ENABLED=true
PRINTER_INTERFACE=tcp://192.168.1.100:9100
PRINTER_TYPE=EPSON
PRINTER_WIDTH=48
```

### **4. Initialiser la base de données**

   ```bash
# Générer le client Prisma
npx prisma generate

# Pousser le schéma vers MongoDB
   npx prisma db push
```

### **5. Créer un compte administrateur**

```bash
node scripts/update-admin.js
```

Identifiants par défaut :
- Email : `issa@quarterfusion.com`
- Mot de passe : ``

### **6. Lancer le serveur de développement**

   ```bash
npm run dev
```

Le site est accessible sur `http://localhost:3000`

---

## ⚙️ Configuration

### **Configuration de l'email Gmail**

1. Activez la **vérification en 2 étapes** sur votre compte Gmail
2. Créez un **mot de passe d'application** :
   - Allez dans les paramètres Google
   - Sécurité → Mots de passe d'application
   - Créez un nouveau mot de passe pour "Mail"
3. Utilisez ce mot de passe dans `EMAIL_PASS`

Consultez : [Guide Gmail SMTP](https://support.google.com/accounts/answer/185833)

### **Configuration de l'imprimante Epson WiFi**

1. **Trouvez l'adresse IP** de votre imprimante :
   - Menu → Paramètres réseau → Statut réseau
   - Notez l'IP (ex: `192.168.1.100`)

2. **Configurez dans `.env.local`** :
   ```env
   AUTO_PRINT_ENABLED=true
   PRINTER_INTERFACE=tcp://192.168.1.100:9100
   PRINTER_TYPE=EPSON
   PRINTER_WIDTH=48
   ```

3. **Installez les dépendances** :
   ```bash
   npm install node-thermal-printer
   ```

4. **Testez** depuis `/admin/settings` → Section "Test d'imprimante"

📖 **Guide complet** : [`docs/GUIDE-IMPRIMANTE-EPSON-WIFI.md`](docs/GUIDE-IMPRIMANTE-EPSON-WIFI.md)

### **Configuration PWA pour tablette**

Pour installer l'interface admin sur une tablette Samsung :

1. Ouvrez `/admin` dans Chrome/Samsung Internet
2. Menu → **Ajouter à l'écran d'accueil**
3. L'application s'ouvre en plein écran

📖 **Guide complet** : [`docs/GUIDE-PWA-TABLETTE.md`](docs/GUIDE-PWA-TABLETTE.md)

---

## 📚 Documentation

Tous les guides sont disponibles dans le dossier `docs/` :

### **Guides d'utilisation**

| Guide | Description |
|-------|-------------|
| [`GUIDE-PERSONNALISATIONS.md`](docs/GUIDE-PERSONNALISATIONS.md) | Gérer les personnalisations de plats |
| [`GUIDE-OPTION-BOISSON.md`](docs/GUIDE-OPTION-BOISSON.md) | Ajouter l'option boisson aux menus |
| [`GUIDE-VILLES-LIVRAISON.md`](docs/GUIDE-VILLES-LIVRAISON.md) | Gérer les villes et frais de livraison |
| [`GUIDE-COMMANDE-CLIENT.md`](docs/GUIDE-COMMANDE-CLIENT.md) | Processus de commande client complet |
| [`GUIDE-IMPRIMANTE-EPSON-WIFI.md`](docs/GUIDE-IMPRIMANTE-EPSON-WIFI.md) | Configuration imprimante Epson WiFi |
| [`CONFIG-IMPRIMANTE-RAPIDE.md`](docs/CONFIG-IMPRIMANTE-RAPIDE.md) | Configuration rapide en 5 minutes |
| [`GUIDE-PWA-TABLETTE.md`](docs/GUIDE-PWA-TABLETTE.md) | Installation sur tablette Samsung |

### **Changelogs**

| Changelog | Description |
|-----------|-------------|
| [`CHANGELOG-PERSONNALISATIONS.md`](docs/CHANGELOG-PERSONNALISATIONS.md) | Historique des modifications - Personnalisations |
| [`CHANGELOG-OPTION-BOISSON.md`](docs/CHANGELOG-OPTION-BOISSON.md) | Historique des modifications - Option boisson |

### **Fichiers de configuration**

- [`CONFIG-IMPRIMANTE.txt`](CONFIG-IMPRIMANTE.txt) - Configuration rapide à copier
- [`public/notification-guide.txt`](public/notification-guide.txt) - Guide son de notification

---

## 📁 Structure du projet

```
quarter-fusion/
├── app/                          # Pages Next.js (App Router)
│   ├── admin/                    # Interface d'administration
│   │   ├── dashboard/            # Tableau de bord
│   │   ├── menu/                 # Gestion du menu
│   │   ├── orders/               # Gestion des commandes
│   │   └── settings/             # Paramètres
│   ├── api/                      # Routes API
│   │   ├── auth/                 # Authentification
│   │   ├── delivery-cities/     # Gestion des villes
│   │   ├── menu/                 # CRUD menu
│   │   ├── orders/               # CRUD commandes
│   │   ├── customizations/       # CRUD personnalisations
│   │   └── printer/              # API imprimante
│   ├── click-and-collect/        # Page Click & Collect
│   ├── livraison/                # Page Livraison
│   └── commander/                # Page commande (wizard)
├── components/                   # Composants React
│   ├── admin/                    # Composants admin
│   └── order/                    # Composants commande
├── contexts/                     # Context API
│   └── OrderContext.tsx          # État global des commandes
├── docs/                         # Documentation
│   ├── GUIDE-*.md                # Guides d'utilisation
│   └── CHANGELOG-*.md            # Historiques de modifications
├── hooks/                        # Custom React hooks
│   └── useOrderNotifications.ts  # Hook notifications
├── lib/                          # Utilitaires
│   ├── prisma.ts                 # Client Prisma
│   └── printer.ts                # Fonctions impression
├── prisma/                       # Schéma de base de données
│   └── schema.prisma             # Modèles Prisma
├── public/                       # Fichiers statiques
│   ├── manifest.json             # Configuration PWA
│   └── notification.mp3          # Son de notification
├── scripts/                      # Scripts utilitaires
│   ├── create-admin-user.ts      # Créer un admin
│   └── update-admin.js           # Mettre à jour l'admin
└── styles/                       # Styles globaux
```

---

## 🎮 Scripts disponibles

```bash
# Développement
npm run dev              # Lancer le serveur de dev (port 3000)

# Production
npm run build            # Build de production
npm run start            # Lancer le serveur de production

# Base de données
npx prisma generate      # Générer le client Prisma
npx prisma db push       # Pousser le schéma vers MongoDB
npx prisma studio        # Ouvrir l'interface Prisma Studio

# Administration
node scripts/update-admin.js  # Créer/mettre à jour le compte admin

# Linting
npm run lint             # Vérifier le code
```

---

## 🌐 Déploiement

### **Vercel (Recommandé)**

1. **Pushez votre code sur GitHub**

2. **Importez sur Vercel** :
   - Connectez votre repo GitHub
   - Vercel détecte automatiquement Next.js

3. **Configurez les variables d'environnement** :
   - Ajoutez toutes les variables du `.env.local`
   - Ne mettez PAS l'imprimante en production

4. **Déployez** : Vercel build et déploie automatiquement

### **Variables d'environnement en production**

```env
DATABASE_URL=mongodb+srv://...
NEXTAUTH_URL=https://votre-domaine.com
NEXTAUTH_SECRET=...
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=...
EMAIL_PASS=...
ADMIN_EMAIL=...
```

⚠️ **Important** : Ne pas activer l'impression automatique en production (`AUTO_PRINT_ENABLED=false`)

---

## 🔒 Sécurité

### **Bonnes pratiques implémentées**

- ✅ Mots de passe hashés avec bcrypt (12 rounds)
- ✅ Protection CSRF avec NextAuth
- ✅ Validation des données côté serveur
- ✅ Routes admin protégées
- ✅ Variables d'environnement sécurisées
- ✅ Sanitization des entrées utilisateur

### **Recommandations**

- Changez le `NEXTAUTH_SECRET` en production
- Utilisez des mots de passe forts
- Activez l'authentification 2FA sur Gmail
- Limitez l'accès admin aux IP de confiance
- Effectuez des sauvegardes régulières de MongoDB

---

## 📊 Modèles de données (Prisma)

### **Modèles principaux**

```prisma
// Menu
model Menu {
  id                          String
  title                       String
  description                 String
  price                       Float
  image                       String
  category                    Category
  customizations              Customization[]
  availableForClickAndCollect Boolean
  availableForDelivery        Boolean
  allowDrinkOption            Boolean
  drinkPrice                  Float
}

// Commande
model Order {
  id              String
  orderNumber     String
  customerName    String
  customerEmail   String
  customerPhone   String
  items           OrderItem[]
  total           Float
  isDelivery      Boolean
  status          OrderStatus
  paymentMethod   PaymentMethod
  deliveryAddress String?
  city            String?
  notes           String?
}

// Ville de livraison
model DeliveryCity {
  id          String
  name        String
  deliveryFee Float
  minOrder    Float?
  postalCode  String?
  active      Boolean
}

// Personnalisation
model Customization {
  id       String
  name     String
  type     CustomizationType
  required Boolean
  options  CustomizationOption[]
  menuId   String
}
```

---

## 🎨 Interface utilisateur

### **Design System**

- **Couleur principale** : Rouge (#dc2626)
- **Police** : System UI (San Francisco, Segoe UI, Roboto)
- **Framework CSS** : Tailwind CSS
- **Responsive** : Mobile-first design
- **Accessibilité** : WCAG 2.1 AA

### **Pages principales**

| URL | Description |
|-----|-------------|
| `/` | Page d'accueil |
| `/click-and-collect` | Commande Click & Collect |
| `/livraison` | Commande Livraison |
| `/commander` | Wizard de commande |
| `/admin` | Connexion admin |
| `/admin/dashboard` | Tableau de bord |
| `/admin/menu` | Gestion du menu |
| `/admin/orders` | Gestion des commandes |
| `/admin/settings` | Paramètres |

---

## 🐛 Dépannage

### **Problèmes courants**

#### ❌ "Cannot connect to MongoDB"
```bash
# Vérifiez votre DATABASE_URL
# Vérifiez que votre IP est dans la whitelist MongoDB Atlas
```

#### ❌ "Emails not sending"
```bash
# Vérifiez EMAIL_USER et EMAIL_PASS
# Créez un mot de passe d'application Gmail
# Vérifiez les paramètres de sécurité Gmail
```

#### ❌ "Imprimante non connectée"
```bash
# Vérifiez l'IP de l'imprimante
# Testez : ping 192.168.1.100
# Vérifiez que l'imprimante est allumée
# Consultez docs/GUIDE-IMPRIMANTE-EPSON-WIFI.md
```

#### ❌ "Session expired"
```bash
# Régénérez NEXTAUTH_SECRET
# Redémarrez le serveur
```

---

## 📈 Roadmap / Améliorations futures

### **Fonctionnalités prévues**

- [ ] Paiement en ligne (Stripe)
- [ ] Suivi de commande en temps réel
- [ ] Programme de fidélité
- [ ] Codes promo et réductions
- [ ] Statistiques avancées
- [ ] Export des commandes (CSV, PDF)
- [ ] Application mobile native
- [ ] Multi-langues (FR/EN)
- [ ] Réservation de table
- [ ] Avis clients

### **Améliorations techniques**

- [ ] Tests automatisés (Jest, Cypress)
- [ ] Cache Redis pour les performances
- [ ] CDN pour les images
- [ ] Monitoring avec Sentry
- [ ] CI/CD avec GitHub Actions
- [ ] Rate limiting sur les APIs
- [ ] Webhooks pour intégrations tierces

---

## 🤝 Contribution

### **Comment contribuer**

1. **Forkez** le projet
2. **Créez** une branche (`git checkout -b feature/AmazingFeature`)
3. **Committez** vos changements (`git commit -m 'Add some AmazingFeature'`)
4. **Pushez** vers la branche (`git push origin feature/AmazingFeature`)
5. **Ouvrez** une Pull Request

### **Standards de code**

- TypeScript strict mode
- ESLint + Prettier
- Commits conventionnels (Conventional Commits)
- Tests pour les nouvelles fonctionnalités
- Documentation à jour

---

## 📞 Support

### **Besoin d'aide ?**

- 📧 **Email** : support@quarterfusion.com
- 📚 **Documentation** : Consultez le dossier `docs/`
- 🐛 **Bug report** : Ouvrez une issue sur GitHub
- 💬 **Questions** : Créez une discussion sur GitHub

### **Ressources utiles**

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [MongoDB Atlas](https://www.mongodb.com/docs/atlas)

---

## 📜 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

---

## 👥 Équipe

Développé avec ❤️ par l'équipe Quarter Fusion

---

## 🙏 Remerciements

- **Next.js** - Framework React performant
- **Vercel** - Plateforme de déploiement
- **MongoDB** - Base de données NoSQL
- **Prisma** - ORM moderne
- **Tailwind CSS** - Framework CSS utilitaire
- **Epson** - Support des imprimantes thermiques

---

<div align="center">

**[⬆ Retour en haut](#-quarter-fusion---système-de-commande-en-ligne)**

Made with ❤️ for Quarter Fusion

</div>
