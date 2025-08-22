# Quarter Fusion - Restaurant Website & Admin Dashboard

Une application web complète pour restaurant avec site public, dashboard administrateur et système de gestion des commandes. Développée avec Next.js 15, TypeScript, Prisma ORM et MongoDB.

## 🚀 Fonctionnalités

### Site Public
- **Design responsive** : Mobile-first avec adaptation desktop
- **Menu dynamique** : Affichage des plats par catégorie avec filtres
- **Best-sellers dynamiques** : Contenus provenant de la base de données (badges HOT, NEW, TOP)
- **Modes de commande** : Click & Collect et Livraison
- **Système de panier** : Gestion des commandes avec contexte React
- **Pages dédiées** : Homepage, Menu, Contact

### Dashboard Administrateur
- **Interface modale** : Gestion moderne avec modals au lieu de pages séparées
- **Gestion des catégories** : CRUD complet avec slugs auto-générés
- **Gestion des menus** : CRUD complet avec badges et disponibilité
- **Tableaux compacts** : Layouts optimisés pour une meilleure utilisation de l'espace
- **Système d'alerte** : Modals de confirmation pour les suppressions

### Authentification & Sécurité
- **NextAuth v5** : Authentification sécurisée avec rôles
- **Middleware de protection** : Routes admin protégées
- **Hashage des mots de passe** : bcryptjs pour la sécurité
- **Gestion des sessions** : Persistance et hydratation optimisées

## 🛠️ Stack Technique

- **Framework** : Next.js 15 avec App Router et Turbopack
- **Language** : TypeScript pour le typage statique
- **Base de données** : MongoDB avec Prisma ORM
- **Authentification** : NextAuth.js v5
- **Styling** : Tailwind CSS v4
- **Email** : Nodemailer pour les notifications
- **Images** : Support Cloudinary + composant `next/image`
- **Runtime** : Node.js (forcé pour éviter les problèmes Edge Runtime)

## 📁 Structure du projet

```
quarter-fusion/
├── app/
│   ├── admin/                    # Dashboard administrateur (protégé)
│   │   ├── categories/          # Gestion des catégories
│   │   ├── menu/               # Gestion des menus
│   │   ├── dashboard/          # Tableau de bord
│   │   ├── login/              # Authentification admin
│   │   └── layout.tsx          # Layout admin avec navigation
│   ├── api/                     # API REST endpoints
│   │   ├── auth/               # Routes NextAuth
│   │   ├── admin/              # API protégées admin
│   │   ├── categories/         # CRUD catégories
│   │   ├── menu/               # CRUD menus + best-sellers
│   │   ├── orders/             # Gestion commandes
│   │   ├── settings/           # Paramètres restaurant
│   │   └── upload/             # Upload images Cloudinary
│   ├── commander/               # Pages de commande client
│   │   ├── click-and-collect/  # Mode retrait
│   │   └── livraison/          # Mode livraison
│   ├── components/              # Composants React réutilisables
│   │   └── admin/              # Composants spécifiques admin
│   ├── contexts/                # Contextes React (panier)
│   ├── types/                   # Définitions TypeScript
│   ├── data/                    # Données statiques centralisées
│   ├── layout.tsx               # Layout principal
│   └── page.tsx                # Page d'accueil
├── components/                  # Composants globaux
├── lib/                         # Utilitaires et configuration
│   ├── auth.ts                 # Configuration NextAuth
│   ├── prisma.ts               # Client Prisma
│   ├── admin/                  # Utilitaires admin
│   └── email.ts                # Templates et envoi emails
├── prisma/                      # Configuration base de données
│   ├── schema.prisma           # Schéma Prisma
│   └── seed.ts                 # Script de seed
├── scripts/                     # Scripts utilitaires
└── middleware.ts               # Protection routes admin
```

## 🎨 Design System

### Couleurs
- **Rouge principal** : `#b91c1c` (red-700)
- **Rouge hover** : `#991b1b` (red-800)
- **Gris clair** : `#f3f4f6` (gray-50)
- **Gris foncé** : `#111827` (gray-900)

### Typographie
- **Police principale** : Geist (sans-serif moderne)
- **Titres** : Font-bold avec tailles responsives
- **Corps de texte** : Font-normal avec line-height optimisé

### Composants
- **Boutons** : Rounded-full avec hover effects
- **Cartes** : Rounded-2xl avec shadow-lg
- **Sections** : Padding vertical py-16
- **Grilles** : Grid responsive avec gap-8

## 🚀 Installation et démarrage

1. **Cloner le projet**
   ```bash
   git clone [url-du-repo]
   cd quarter-fusion
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Configuration environnement**
   ```bash
   # Copier les fichiers d'exemple
   cp .env.example .env.local
   cp .env.example .env
   
   # Configurer les variables dans .env.local et .env
   ```

4. **Initialiser la base de données**
   ```bash
   # Synchroniser le schéma Prisma avec MongoDB
   npx prisma db push
   
   # Peupler la base avec des données de test
   npm run seed
   ```

5. **Créer un utilisateur admin**
   ```bash
   npm run test:admin
   ```

6. **Lancer le serveur de développement**
   ```bash
   npm run dev --turbopack
   ```

7. **Ouvrir dans le navigateur**
   ```
   http://localhost:3000
   ```

### Variables d'environnement requises

Configurer dans `.env.local` (pour Next.js) et `.env` (pour Prisma) :

```env
# Base de données MongoDB
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/quarter-fusion

# NextAuth configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key

# Credentials admin
ADMIN_EMAIL=admin@quarter-fusion.com
ADMIN_PASSWORD=your-admin-password

# Configuration email (Gmail SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=your-email@gmail.com

# Upload images Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

## 📝 Personnalisation

### Dashboard Administrateur
- **Accès** : `/admin` (authentification requise)
- **Fonctionnalités** :
  - Gestion des catégories de menus avec slugs auto-générés
  - CRUD complet des articles de menu avec upload d'images
  - Interface modale moderne (pas de pages séparées)
  - Tableaux compacts optimisés pour l'espace
  - Alertes de confirmation pour les suppressions
  - Statistiques de vente et commandes en temps réel

### Gestion du contenu
- **Menus dynamiques** : Gestion via l'interface admin avec catégorisation
- **Best-sellers** : Sélection automatique via badges (HOT, NEW, TOP)
- **Images** : Upload direct via Cloudinary avec optimisation automatique
- **Catégories** : Slugs auto-générés à partir du nom pour les URLs

### Modifier les données statiques
Données centralisées dans `app/data/siteData.ts` :
- Informations du restaurant (nom, adresse, téléphone)
- Horaires d'ouverture
- Conditions de livraison et tarifs
- Réseaux sociaux
- Contenu textuel des pages

### Personaliser l'apparence
- **Couleurs** : Thème rouge principal (#b91c1c) modifiable dans les composants
- **Responsive** : Design mobile-first avec breakpoints adaptés
- **Typographie** : Police Geist moderne avec tailles responsives

## 📱 Responsive Design

Le site est optimisé pour tous les écrans :
- **Mobile** : < 768px (navigation hamburger, grilles 1 colonne)
- **Tablet** : 768px - 1024px (grilles 2 colonnes)
- **Desktop** : > 1024px (grilles 3 colonnes, navigation complète)

## 🔧 Scripts disponibles

- `npm run dev --turbopack` : Serveur de développement avec Turbo (recommandé)
- `npm run build` : Build de production
- `npm run start` : Serveur de production
- `npm run lint` : Vérification du code ESLint
- `npm run seed` : Peupler la base de données avec des données de test
- `npm run test:admin` : Tester l'accès administrateur
- `npx prisma db push` : Synchroniser le schéma Prisma avec MongoDB
- `npx prisma studio` : Interface web pour explorer la base de données

## 📄 Pages implémentées

### Pages publiques
- `/` : Page d'accueil avec best-sellers dynamiques
- `/commander/click-and-collect` : Commande en retrait
- `/commander/livraison` : Commande en livraison  
- `/contact` : Page de contact

### Pages administrateur (protégées)
- `/admin` : Dashboard avec statistiques
- `/admin/categories` : Gestion des catégories (interface modale)
- `/admin/menu` : Gestion des menus (interface modale)
- `/admin/login` : Authentification administrateur

### API REST
- `/api/categories` : CRUD catégories
- `/api/menu` : CRUD menus + best-sellers
- `/api/orders` : Gestion des commandes
- `/api/upload` : Upload images Cloudinary
- `/api/settings` : Paramètres du restaurant

## 🎯 Fonctionnalités implémentées

- [x] Dashboard administrateur complet avec interface modale
- [x] Gestion des catégories avec slugs auto-générés
- [x] CRUD complet des menus avec upload d'images Cloudinary
- [x] Best-sellers dynamiques basés sur la base de données
- [x] Système d'authentification NextAuth v5 avec rôles
- [x] Protection des routes admin via middleware
- [x] API REST complète pour toutes les entités
- [x] Email automatique de confirmation de commande
- [x] Interface responsive mobile-first
- [x] Tableaux compacts optimisés pour l'admin

## 🔮 Améliorations futures

- [ ] Système de paiement en ligne (Stripe/PayPal)
- [ ] Notifications push pour les commandes
- [ ] Module de fidélité clients
- [ ] Analytics avancées des ventes
- [ ] Module de gestion des stocks
- [ ] Système de promotions et coupons
- [ ] Application mobile React Native
- [ ] Tests automatisés (Jest/Cypress)

## 🛡️ Sécurité

- **Authentification** : NextAuth v5 avec sessions sécurisées
- **Hashage** : bcryptjs pour les mots de passe admin
- **Protection CSRF** : Intégration NextAuth automatique
- **Validation** : Validation côté serveur pour toutes les API
- **Middleware** : Protection des routes admin
- **Variables d'environnement** : Séparation des secrets

## 🐛 Résolution de problèmes

### Erreurs courantes

**Base de données non accessible**
```bash
# Vérifier la connexion MongoDB
npx prisma db push
```

**Variables d'environnement manquantes**
```bash
# Copier .env.example vers .env et .env.local
cp .env.example .env.local
cp .env.example .env
```

**Erreur d'hydratation React**
- Problème résolu avec DarkReader : composant HydrationFix implémenté
- Largeurs aléatoires remplacées par valeurs fixes

**Erreurs de build TypeScript**
```bash
# Vérifier la syntaxe et les types
npm run lint
npx tsc --noEmit
```

## 📞 Support

Pour contribuer au projet :
1. Fork le repository
2. Créer une branche feature (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Commit les changements (`git commit -am 'Ajout nouvelle fonctionnalité'`)
4. Push vers la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. Créer une Pull Request

---

**Quarter Fusion** - Application complète de gestion de restaurant 🍔
*Développée avec Next.js 15, TypeScript, Prisma et MongoDB*
