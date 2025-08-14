# 🏪 Système d'Administration Quarter Fusion

Interface d'administration complète et sécurisée pour la gestion du restaurant Quarter Fusion.

## 🚀 Installation et Configuration

### 1. Variables d'environnement

Assurez-vous que votre fichier `.env.local` contient toutes les variables nécessaires :

```bash
# Configuration MongoDB Atlas
MONGODB_URI=mongodb+srv://quarterfusion:Quarter2025%21@cluster0.5brzic0.mongodb.net/quarter-fusion?retryWrites=true&w=majority&appName=Cluster0

# Configuration Email (Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=quarterfusion@gmail.com
EMAIL_PASS=fpcplcoqhgfmlkok
ADMIN_EMAIL=quarterfusion@gmail.com

# Configuration SMTP pour les emails transactionnels
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=quarterfusion@gmail.com
SMTP_PASS=fpcplcoqhgfmlkok
SMTP_FROM="Quarter Fusion <quarterfusion@gmail.com>"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="quarter-fusion-admin-secret-key-2025"

# Admin Credentials
ADMIN_EMAIL="quarterfusion@gmail.com"
ADMIN_PASSWORD="QuarterAdmin2025!"

# Cloudinary Configuration (à configurer)
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"

# URL de l'interface admin
NEXT_PUBLIC_ADMIN_URL="http://localhost:3000/admin"
```

### 2. Installation des dépendances

```bash
npm install
```

### 3. Initialisation de la base de données

```bash
npm run seed
```

### 4. Lancement du serveur

```bash
npm run dev
```

## 🔐 Authentification

- **URL de connexion** : `http://localhost:3000/admin/login`
- **Email** : `quarterfusion@gmail.com`
- **Mot de passe** : `QuarterAdmin2025!`

## 📊 Fonctionnalités

### Dashboard (`/admin/dashboard`)
- **Statut des commandes** : Activer/désactiver les commandes
- **Frais de livraison** : Modifier les frais de livraison
- **Villes de livraison** : Ajouter/supprimer des villes
- **Statistiques rapides** : Vue d'ensemble des commandes

### Gestion du Menu (`/admin/menu`)
- **Ajouter des plats** : Titre, description, prix, catégorie, image
- **Modifier des plats** : Mise à jour des informations
- **Supprimer des plats** : Suppression avec confirmation
- **Upload d'images** : Intégration Cloudinary

### Gestion des Catégories (`/admin/categories`)
- **Créer des catégories** : Organisation du menu
- **Modifier des catégories** : Renommage
- **Supprimer des catégories** : Vérification d'usage avant suppression

### Gestion des Commandes (`/admin/orders`)
- **Liste des commandes** : Tri par date, statut
- **Changement de statut** : A_PREPARER → EN_COURS → TERMINE
- **Détails des commandes** : Informations client, articles, total

### Paramètres de Livraison (`/admin/delivery`)
- **Configuration complète** : Frais, villes, délais
- **Aperçu des paramètres** : État actuel du système

## 🗄️ Structure de la Base de Données

### Modèles Mongoose

#### Category
```typescript
{
  name: string;        // Nom de la catégorie
  slug: string;        // Slug automatique
  createdAt: Date;
  updatedAt: Date;
}
```

#### Menu
```typescript
{
  title: string;       // Nom du plat
  description: string; // Description
  price: number;       // Prix
  category: ObjectId;  // Référence vers Category
  image: string;       // URL de l'image
  available: boolean;  // Disponibilité
  createdAt: Date;
  updatedAt: Date;
}
```

#### Settings
```typescript
{
  orderingOpen: boolean;     // Commandes ouvertes/fermées
  deliveryFee: number;       // Frais de livraison
  deliveryCities: string[];  // Villes de livraison
  minimumOrder: number;      // Commande minimum
  deliveryTime: string;      // Délai de livraison
  createdAt: Date;
  updatedAt: Date;
}
```

#### Order
```typescript
{
  orderNumber: string;       // Numéro unique
  customerName: string;      // Nom du client
  customerEmail: string;     // Email
  customerPhone: string;     // Téléphone
  items: OrderItem[];        // Articles commandés
  total: number;             // Total
  deliveryAddress?: string;  // Adresse (livraison)
  city?: string;             // Ville (livraison)
  isDelivery: boolean;       // Type de commande
  status: string;            // Statut
  paymentMethod: string;     // Mode de paiement
  notes?: string;            // Notes
  createdAt: Date;
  updatedAt: Date;
}
```

## 🔌 API Routes

### Authentification
- `POST /api/auth/signin` - Connexion
- `POST /api/auth/signout` - Déconnexion

### Catégories
- `GET /api/categories` - Liste des catégories
- `POST /api/categories` - Créer une catégorie
- `PUT /api/categories/[id]` - Modifier une catégorie
- `DELETE /api/categories/[id]` - Supprimer une catégorie

### Menu
- `GET /api/menu` - Liste du menu (public)
- `POST /api/menu` - Créer un plat (admin)
- `GET /api/menu/[id]` - Détail d'un plat
- `PUT /api/menu/[id]` - Modifier un plat (admin)
- `DELETE /api/menu/[id]` - Supprimer un plat (admin)

### Paramètres
- `GET /api/settings` - Récupérer les paramètres
- `PUT /api/settings` - Mettre à jour les paramètres (admin)

### Commandes
- `GET /api/orders` - Liste des commandes (admin)
- `POST /api/orders` - Créer une commande (public)
- `PUT /api/orders/[id]/status` - Changer le statut (admin)

### Upload
- `POST /api/upload` - Upload d'images (admin)

## 🛡️ Sécurité

### Authentification
- **NextAuth.js** avec stratégie JWT
- **Credentials Provider** pour l'authentification admin
- **Middleware** de protection des routes admin
- **Session** avec expiration de 24h

### Validation
- **Validation des inputs** côté serveur
- **Sanitisation** des données
- **Vérification des permissions** sur toutes les routes sensibles

### Protection
- **CSRF Protection** via NextAuth
- **Rate Limiting** (à implémenter si nécessaire)
- **Input Validation** stricte

## 🎨 Interface Utilisateur

### Design System
- **Tailwind CSS** pour le styling
- **Responsive Design** mobile-first
- **Composants réutilisables**
- **Thème Quarter Fusion** (rouge #b91c1c)

### Composants Principaux
- **Layout Admin** avec navigation
- **Formulaires** avec validation
- **Tableaux** avec tri et pagination
- **Modales** de confirmation
- **Notifications** de succès/erreur

## 🚀 Déploiement

### Prérequis
1. **MongoDB Atlas** configuré et accessible
2. **Cloudinary** configuré pour l'upload d'images
3. **Variables d'environnement** configurées

### Étapes
1. **Build** : `npm run build`
2. **Start** : `npm start`
3. **Seed** : `npm run seed` (première fois)

## 🔧 Maintenance

### Logs
- **Console logs** pour le debugging
- **Error handling** complet
- **Validation** des données

### Sauvegarde
- **MongoDB Atlas** avec sauvegarde automatique
- **Images** stockées sur Cloudinary

### Monitoring
- **Statuts des commandes** en temps réel
- **Métriques** de performance
- **Alertes** en cas d'erreur

## 📞 Support

Pour toute question ou problème :
- **Email** : quarterfusion@gmail.com
- **Documentation** : Ce fichier README
- **Logs** : Console du serveur

---

**Quarter Fusion Admin** - Système d'administration complet et sécurisé 🏪 