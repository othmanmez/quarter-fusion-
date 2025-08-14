# Quarter Fusion - Site Web Restaurant

Un site web moderne pour un restaurant de snack, développé avec Next.js 14 et Tailwind CSS.

## 🚀 Fonctionnalités

- **Design responsive** : Mobile-first avec adaptation desktop
- **Navigation fixe** : Menu hamburger sur mobile, navigation complète sur desktop
- **Section Hero** : Présentation des best-sellers avec badges (HOT, NEW, TOP)
- **Section Étapes** : Processus en 3 étapes avec images et descriptions
- **Informations pratiques** : Horaires, contact, Google Maps, conditions de livraison
- **Réseaux sociaux** : Liens vers TikTok, Instagram, Snapchat
- **Footer complet** : Mentions légales, copyright, liens utiles

## 🛠️ Technologies utilisées

- **Framework** : Next.js 14 avec App Router
- **Styling** : Tailwind CSS v4
- **Images** : Composant `next/image` pour l'optimisation
- **TypeScript** : Typage statique pour une meilleure maintenabilité
- **Responsive** : Design mobile-first avec breakpoints Tailwind

## 📁 Structure du projet

```
quarter-fusion/
├── app/
│   ├── components/          # Composants React
│   │   ├── Navbar.tsx      # Navigation fixe
│   │   ├── Hero.tsx        # Section best-sellers
│   │   ├── Steps.tsx       # Section 3 étapes
│   │   ├── InfoSection.tsx # Informations pratiques
│   │   ├── SocialLinks.tsx # Réseaux sociaux
│   │   └── Footer.tsx      # Pied de page
│   ├── data/
│   │   └── siteData.ts     # Données centralisées
│   ├── layout.tsx          # Layout principal
│   ├── page.tsx           # Page d'accueil
│   └── globals.css        # Styles globaux
├── public/
│   └── images/
│       └── placeholder.svg # Image de placeholder
└── package.json
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

3. **Lancer le serveur de développement**
   ```bash
   npm run dev
   ```

4. **Ouvrir dans le navigateur**
   ```
   http://localhost:3000
   ```

## 📝 Personnalisation

### Modifier les données
Toutes les données sont centralisées dans `app/data/siteData.ts` :
- Informations du restaurant
- Horaires d'ouverture
- Best-sellers
- Étapes de préparation
- Conditions de livraison
- Réseaux sociaux

### Ajouter des images
1. Placer les images dans `public/images/`
2. Mettre à jour les chemins dans `siteData.ts`
3. Utiliser le composant `next/image` pour l'optimisation

### Modifier les couleurs
Les couleurs sont définies dans les classes Tailwind. Pour changer le thème :
1. Modifier les classes `red-700`, `red-800` dans les composants
2. Ou configurer un thème personnalisé dans `tailwind.config.js`

## 📱 Responsive Design

Le site est optimisé pour tous les écrans :
- **Mobile** : < 768px (navigation hamburger, grilles 1 colonne)
- **Tablet** : 768px - 1024px (grilles 2 colonnes)
- **Desktop** : > 1024px (grilles 3 colonnes, navigation complète)

## 🔧 Scripts disponibles

- `npm run dev` : Serveur de développement
- `npm run build` : Build de production
- `npm run start` : Serveur de production
- `npm run lint` : Vérification du code

## 📄 Pages à créer

Le site actuel est une page d'accueil. Pour un site complet, créer :
- `/menu` : Page du menu complet
- `/commander` : Page de commande
- `/contact` : Page de contact
- `/mentions-legales` : Mentions légales
- `/politique-confidentialite` : Politique de confidentialité
- `/conditions-utilisation` : Conditions d'utilisation
- `/cgv` : Conditions générales de vente

## 🎯 Optimisations futures

- [ ] Ajouter des vraies images de produits
- [ ] Intégrer un système de commande en ligne
- [ ] Ajouter des animations avec Framer Motion
- [ ] Optimiser le SEO avec des métadonnées dynamiques
- [ ] Ajouter un système de cookies
- [ ] Intégrer Google Analytics
- [ ] Ajouter des tests unitaires

## 📞 Support

Pour toute question ou modification, contactez l'équipe de développement.

---

**Quarter Fusion** - Votre restaurant de snack préféré à Paris 🍔
