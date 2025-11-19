# 📖 Index de la documentation Quarter Fusion

Tous les guides et documents disponibles pour le projet.

---

## 🚀 **DÉPLOIEMENT** (À FAIRE EN PREMIER)

### Pour déployer le site sur Vercel

| Document | Description | Durée |
|----------|-------------|-------|
| **`GUIDE-DEPLOIEMENT-VERCEL.md`** | Guide complet illustré avec toutes les étapes détaillées | 15 min |
| **`DEPLOIEMENT-RAPIDE.md`** | Version express pour déployer rapidement | 10 min |
| **`VARIABLES-VERCEL.md`** | Liste des 8 variables d'environnement à configurer | 2 min |

**📌 Commence par** : `DEPLOIEMENT-RAPIDE.md` si tu es pressé, sinon `GUIDE-DEPLOIEMENT-VERCEL.md`

---

## 📚 **DOCUMENTATION PRINCIPALE**

### Pour comprendre le projet

| Document | Description |
|----------|-------------|
| **`README.md`** | Documentation technique complète du projet |
| **`RECAPITULATIF-PROJET.md`** | Vue d'ensemble : ce qui a été fait, structure, commandes |
| **`INDEX-DOCUMENTATION.md`** | Ce fichier - navigation dans la documentation |

**📌 Commence par** : `RECAPITULATIF-PROJET.md` pour avoir une vue d'ensemble

---

## 🔧 **CONFIGURATION**

### Fichiers de configuration

| Fichier | Description |
|---------|-------------|
| `.env.example` | Variables d'environnement à copier vers `.env.local` |
| `package.json` | Dépendances et scripts npm |
| `prisma/schema.prisma` | Schéma de la base de données |
| `next.config.ts` | Configuration Next.js |

---

## 🛠️ **SCRIPTS UTILITAIRES**

### Dans le dossier `scripts/`

| Script | Commande | Description |
|--------|----------|-------------|
| `create-admin-user.ts` | `npx tsx scripts/create-admin-user.ts` | Créer l'utilisateur admin (Issa2025) |
| `seed-prisma.ts` | `npm run seed:prisma` | Créer 7 catégories et 22 plats de démo |
| `seed-cities.ts` | `npm run seed:cities` | Créer 7 villes de livraison par défaut |
| `generate-secret.js` | `node scripts/generate-secret.js` | Générer un NEXTAUTH_SECRET sécurisé |
| `check-nextauth.js` | `node scripts/check-nextauth.js` | Vérifier la configuration NextAuth |

---

## 🎯 **GUIDE D'UTILISATION**

### Développement local

1. **Premier lancement** :
   ```bash
   npm install                              # Installer les dépendances
   cp .env.example .env.local              # Copier les variables d'env
   npx prisma db push                      # Synchroniser la base
   npx tsx scripts/create-admin-user.ts    # Créer l'admin
   npm run seed:cities                     # Créer les villes
   npm run seed:prisma                     # Créer les menus
   npm run dev                             # Lancer le serveur
   ```

2. **Accéder au site** :
   - Frontend : http://localhost:3000
   - Admin : http://localhost:3000/admin
   - Login : `Issa2025` / `quarterfusion`

### Déploiement production

1. **Lire le guide** : `DEPLOIEMENT-RAPIDE.md`
2. **Suivre les étapes** : GitHub → Vercel → Variables → Deploy
3. **Temps estimé** : 10-15 minutes

---

## 🗂️ **STRUCTURE DES DOSSIERS**

```
quarter-fusion/
├── 📚 DOCUMENTATION (racine)
│   ├── README.md                      # Doc technique complète
│   ├── RECAPITULATIF-PROJET.md       # Vue d'ensemble
│   ├── GUIDE-DEPLOIEMENT-VERCEL.md   # Guide déploiement complet
│   ├── DEPLOIEMENT-RAPIDE.md         # Guide déploiement express
│   ├── VARIABLES-VERCEL.md           # Variables d'environnement
│   └── INDEX-DOCUMENTATION.md        # Ce fichier
│
├── 🔧 CONFIGURATION
│   ├── .env.example                  # Template variables
│   ├── package.json                  # Dépendances
│   ├── next.config.ts               # Config Next.js
│   └── prisma/schema.prisma         # Schéma DB
│
├── 🛠️ SCRIPTS
│   ├── scripts/create-admin-user.ts  # Créer admin
│   ├── scripts/seed-prisma.ts       # Seed menus
│   ├── scripts/seed-cities.ts       # Seed villes
│   ├── scripts/generate-secret.js   # Générer secret
│   └── scripts/check-nextauth.js    # Vérifier NextAuth
│
├── 💻 CODE SOURCE
│   ├── app/                         # Pages Next.js
│   ├── components/                  # Composants React
│   ├── contexts/                    # Contextes React
│   ├── lib/                         # Utilitaires
│   └── middleware.ts                # Protection routes
│
└── 🎨 ASSETS
    └── public/                      # Images, logos
```

---

## 📋 **CHECKLIST DE DÉPART**

### ✅ Configuration locale

- [ ] Node.js installé (v18+)
- [ ] MongoDB Atlas configuré
- [ ] `.env.local` créé avec les bonnes variables
- [ ] Dépendances installées (`npm install`)
- [ ] Base synchronisée (`npx prisma db push`)
- [ ] Admin créé (`npx tsx scripts/create-admin-user.ts`)
- [ ] Villes créées (`npm run seed:cities`)
- [ ] Menus créés (`npm run seed:prisma`)
- [ ] Serveur lancé (`npm run dev`)
- [ ] Site accessible (http://localhost:3000)
- [ ] Admin accessible (http://localhost:3000/admin)

### ✅ Prêt pour le déploiement

- [ ] Build fonctionne en local (`npm run build`)
- [ ] Code pushé sur GitHub
- [ ] MongoDB Atlas accessible depuis partout (`0.0.0.0/0`)
- [ ] Secret NextAuth généré pour prod
- [ ] Compte Vercel créé
- [ ] 8 variables d'environnement préparées

---

## 🆘 **PROBLÈMES FRÉQUENTS**

### Problème : Build failed

**Solution** :
```bash
npm run build  # Teste en local
```
Vérifie les erreurs dans le terminal.

### Problème : Admin ne marche pas

**Solution** :
1. Vérifie que `NEXTAUTH_URL` = l'URL exacte de ton site
2. Vérifie que `NEXTAUTH_SECRET` est défini (32+ caractères)
3. Redéploie le site

### Problème : Base de données inaccessible

**Solution** :
1. MongoDB Atlas → **Network Access**
2. Ajoute `0.0.0.0/0` (Allow from anywhere)
3. Vérifie `DATABASE_URL` dans les variables

### Problème : "Failed to fetch" sur le site

**Solution** :
1. Vérifie que le serveur tourne sur le bon port
2. `NEXTAUTH_URL` doit correspondre au port (ex: `http://localhost:3000`)
3. Voir `scripts/check-nextauth.js`

---

## 💡 **CONSEILS**

### Pour le développement local

1. **Toujours lancer** `npm run dev` depuis la racine du projet
2. **Port par défaut** : 3000 (si occupé, Next.js propose 3001, 3002, etc.)
3. **Vérifier les logs** dans le terminal pour détecter les erreurs

### Pour le déploiement

1. **Teste toujours** le build en local avant : `npm run build`
2. **Utilise Vercel** pour un déploiement simple et gratuit
3. **Génère un nouveau secret** pour la production (pas celui de dev)
4. **Change NEXTAUTH_URL** pour l'URL de production

### Pour l'admin

1. **Identifiant** : `Issa2025` (pas d'email, juste le login)
2. **Mot de passe** : `quarterfusion`
3. **Accès rapide** : Double-clic sur le copyright en bas de page

---

## 📞 **LIENS UTILES**

- **Next.js Docs** : https://nextjs.org/docs
- **Vercel** : https://vercel.com
- **MongoDB Atlas** : https://cloud.mongodb.com
- **Prisma Docs** : https://www.prisma.io/docs
- **Imgur (hébergement images)** : https://imgur.com
- **PostImages (hébergement images)** : https://postimages.org

---

## 🎊 **BON DÉPLOIEMENT !**

Le site est prêt. Il ne reste plus qu'à suivre le guide de déploiement !

**Commence par** : `DEPLOIEMENT-RAPIDE.md` 🚀

---

**Quarter Fusion - Othman Meziane**


