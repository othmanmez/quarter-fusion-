# 🚀 Guide de déploiement Quarter Fusion sur Vercel

## 📋 Ce dont tu as besoin

- ✅ Compte GitHub (gratuit)
- ✅ Compte Vercel (gratuit)
- ✅ Compte MongoDB Atlas (déjà configuré)
- ✅ 15 minutes de ton temps

---

## 🎯 ÉTAPE 1 : Prépare ton projet

### 1.1 Teste que tout fonctionne

```bash
# Ouvre ton terminal dans le dossier du projet
cd C:\Users\othma\OneDrive\Bureau\quarter-fusion-

# Teste le build
npm run build
```

✅ Si ça fonctionne sans erreur, continue !  
❌ Si erreur, corrige-la avant de continuer

### 1.2 Crée un fichier .gitignore (si pas déjà fait)

Vérifie que tu as un fichier `.gitignore` avec :

```
# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env*.local
.env

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts
```

---

## 🐙 ÉTAPE 2 : Push ton code sur GitHub

### 2.1 Crée un compte GitHub (si pas déjà fait)

1. Va sur https://github.com
2. Clique **"Sign up"**
3. Crée ton compte (gratuit)

### 2.2 Crée un nouveau repository

1. Une fois connecté, clique sur **"+"** en haut à droite
2. Sélectionne **"New repository"**
3. Remplis :
   - **Repository name** : `quarter-fusion`
   - **Description** : "Site web restaurant Quarter Fusion"
   - **Visibilité** : **Private** (pour garder le code privé)
4. **NE COCHE PAS** "Add a README file"
5. Clique **"Create repository"**

### 2.3 Push ton code

GitHub va t'afficher des commandes. Dans ton terminal :

```bash
# Initialise Git (si pas déjà fait)
git init

# Ajoute tous les fichiers
git add .

# Crée le premier commit
git commit -m "Initial commit - Quarter Fusion ready for deployment"

# Ajoute ton repo GitHub (REMPLACE par TON lien)
git remote add origin https://github.com/TON-USERNAME/quarter-fusion.git

# Renomme la branche en main
git branch -M main

# Push le code
git push -u origin main
```

✅ Ton code est maintenant sur GitHub !

---

## 🗄️ ÉTAPE 3 : Configure MongoDB Atlas

### 3.1 Autorise les connexions depuis Vercel

1. Va sur https://cloud.mongodb.com
2. Connecte-toi
3. Clique sur ton cluster **"Cluster0"**
4. Va dans **"Network Access"** (menu de gauche)
5. Clique **"Add IP Address"**
6. Sélectionne **"Allow access from anywhere"**
7. Confirme avec `0.0.0.0/0`
8. Clique **"Confirm"**

⚠️ **Important** : C'est nécessaire car Vercel utilise des IPs dynamiques

✅ MongoDB est prêt pour Vercel !

---

## 🔐 ÉTAPE 4 : Génère un secret sécurisé

### 4.1 Génère ton NEXTAUTH_SECRET

**Option A : Avec OpenSSL (recommandé)**

Dans Git Bash ou WSL :
```bash
openssl rand -base64 32
```

**Option B : Avec un site web**

Va sur https://generate-secret.vercel.app/32

**Option C : Manuel**

Tape au moins 32 caractères aléatoires :
```
exemple: Kx9mP2nQ7sL4wF8vB3cR5tY6uH0jG1iE
```

📝 **GARDE CE SECRET** ! Tu en auras besoin à l'étape suivante.

---

## 🚀 ÉTAPE 5 : Déploie sur Vercel

### 5.1 Crée un compte Vercel

1. Va sur https://vercel.com
2. Clique **"Sign Up"**
3. Choisis **"Continue with GitHub"**
4. Autorise Vercel à accéder à GitHub
5. ✅ Tu es connecté !

### 5.2 Importe ton projet

1. Sur le dashboard Vercel, clique **"Add New..."** → **"Project"**
2. Tu verras la liste de tes repos GitHub
3. Trouve **"quarter-fusion"**
4. Clique **"Import"**

### 5.3 Configure le projet

Vercel détecte automatiquement Next.js ! 🎉

**Framework Preset** : Next.js (détecté automatiquement)  
**Root Directory** : `./` (laisse par défaut)  
**Build Command** : `npm run build` (laisse par défaut)  
**Output Directory** : `.next` (laisse par défaut)

**⚠️ NE CLIQUE PAS ENCORE SUR "DEPLOY" !**

### 5.4 Configure les variables d'environnement

Avant de déployer, ajoute les variables :

1. Déplie la section **"Environment Variables"**
2. Ajoute ces variables **UNE PAR UNE** :

#### Variable 1 : DATABASE_URL
```
Name: DATABASE_URL
Value: mongodb+srv://quarterfusion:Quarter2025%21@cluster0.5brzic0.mongodb.net/quarter-fusion?retryWrites=true&w=majority&appName=Cluster0
```

#### Variable 2 : NEXTAUTH_URL
```
Name: NEXTAUTH_URL
Value: https://quarter-fusion.vercel.app
```
⚠️ **Note** : Tu changeras cette URL après le premier déploiement si tu as un domaine custom

#### Variable 3 : NEXTAUTH_SECRET
```
Name: NEXTAUTH_SECRET
Value: [TON SECRET GÉNÉRÉ À L'ÉTAPE 4]
```
⚠️ **Utilise le secret que tu as généré !**

#### Variable 4 : EMAIL_HOST
```
Name: EMAIL_HOST
Value: smtp.gmail.com
```

#### Variable 5 : EMAIL_PORT
```
Name: EMAIL_PORT
Value: 587
```

#### Variable 6 : EMAIL_USER
```
Name: EMAIL_USER
Value: quarterfusion@gmail.com
```

#### Variable 7 : EMAIL_PASS
```
Name: EMAIL_PASS
Value: fpcplcoqhgfmlkok
```

#### Variable 8 : ADMIN_EMAIL
```
Name: ADMIN_EMAIL
Value: quarterfusion@gmail.com
```

### 5.5 Deploy !

1. Vérifie que toutes les 8 variables sont ajoutées
2. Clique sur **"Deploy"**
3. ☕ Attends 2-3 minutes...

---

## 🎉 ÉTAPE 6 : Ton site est en ligne !

### 6.1 Accède à ton site

Une fois le build terminé, Vercel affiche :

```
✅ Deployment ready
🌐 https://quarter-fusion.vercel.app
```

Clique sur le lien pour voir ton site ! 🎊

### 6.2 Teste que tout fonctionne

1. **Page d'accueil** : https://quarter-fusion.vercel.app
   - ✅ Les 3 best-sellers s'affichent
   
2. **Admin** : https://quarter-fusion.vercel.app/admin
   - ✅ Connexion avec `Issa2025` / `quarterfusion`
   
3. **Commander** : https://quarter-fusion.vercel.app/commander
   - ✅ Modal de personnalisation fonctionne
   - ✅ Villes de livraison s'affichent

---

## 🗄️ ÉTAPE 7 : Seed la base de données

### 7.1 Depuis ton ordinateur local

Modifie temporairement ton `.env.local` pour utiliser la base de production :

```bash
# Dans ton terminal local
npx tsx scripts/create-admin-user.ts
npm run seed:cities
npm run seed:prisma
```

**OU**

### 7.2 Directement depuis l'admin

1. Va sur https://quarter-fusion.vercel.app/admin
2. Connecte-toi
3. Crée tes catégories manuellement
4. Ajoute tes plats avec images
5. Configure les villes de livraison

---

## 🌐 ÉTAPE 8 (OPTIONNEL) : Domaine personnalisé

Si tu as acheté `quarterfusion.com` :

### 8.1 Ajoute le domaine dans Vercel

1. Va dans ton projet Vercel
2. **Settings** → **Domains**
3. Clique **"Add"**
4. Entre `quarterfusion.com`
5. Clique **"Add"**

### 8.2 Configure les DNS

Vercel va te donner des instructions. Chez ton registrar (ex: OVH, Gandi) :

**Ajoute ces enregistrements DNS :**

```
Type    Name    Value
A       @       76.76.21.21
CNAME   www     cname.vercel-dns.com
```

### 8.3 Attends la propagation

- ⏳ 5 minutes à 24h (généralement ~30 min)
- Tu recevras un email de confirmation

### 8.4 Mets à jour NEXTAUTH_URL

1. Vercel → **Settings** → **Environment Variables**
2. Modifie **NEXTAUTH_URL** :
   ```
   https://quarterfusion.com
   ```
3. **Redéploie** le site (Vercel → **Deployments** → **Redeploy**)

✅ Ton site est sur **quarterfusion.com** !

---

## 🔄 ÉTAPE 9 : Mises à jour futures

### Comment mettre à jour ton site ?

1. **Modifie ton code localement**
2. **Teste** : `npm run build`
3. **Commit & Push** :
   ```bash
   git add .
   git commit -m "Description des changements"
   git push
   ```
4. **Vercel déploie automatiquement !** 🚀

Tu recevras une notification par email à chaque déploiement.

---

## 📊 ÉTAPE 10 : Surveillance et Analytics

### 10.1 Analytics Vercel (gratuit)

1. Vercel → Ton projet → **Analytics**
2. Active **Vercel Analytics**
3. Tu verras :
   - Nombre de visiteurs
   - Pages les plus vues
   - Performance du site

### 10.2 Logs et erreurs

1. Vercel → **Logs**
2. Tu peux voir tous les logs en temps réel
3. Utile pour débugger

---

## 🆘 DÉPANNAGE

### Problème 1 : Build failed

**Erreur** : Le build échoue sur Vercel

**Solution** :
1. Vérifie que `npm run build` fonctionne en local
2. Vérifie les logs Vercel pour voir l'erreur exacte
3. Vérifie que toutes les variables d'env sont définies

### Problème 2 : Page blanche

**Erreur** : Le site affiche une page blanche

**Solution** :
1. Ouvre la console du navigateur (F12)
2. Vérifie s'il y a des erreurs
3. Vérifie que `NEXTAUTH_URL` est correct
4. Redéploie le site

### Problème 3 : Erreur de connexion admin

**Erreur** : "Failed to fetch" ou erreur de connexion

**Solution** :
1. Vérifie `NEXTAUTH_URL` (doit être l'URL exacte de ton site)
2. Vérifie `NEXTAUTH_SECRET` (doit être défini)
3. Redéploie après modification des variables

### Problème 4 : MongoDB ne se connecte pas

**Erreur** : "MongoServerError: connection refused"

**Solution** :
1. MongoDB Atlas → **Network Access**
2. Vérifie que `0.0.0.0/0` est autorisé
3. Vérifie que `DATABASE_URL` est correct dans Vercel

---

## ✅ CHECKLIST FINALE

Avant de valider le déploiement :

- [ ] Code build en local sans erreur
- [ ] Code pushé sur GitHub
- [ ] MongoDB Atlas accessible depuis partout (`0.0.0.0/0`)
- [ ] Secret NextAuth généré (32+ caractères)
- [ ] 8 variables d'environnement ajoutées sur Vercel
- [ ] Site déployé et accessible
- [ ] Admin fonctionne (connexion OK)
- [ ] Base de données seedée (villes + menus)
- [ ] Personnalisations fonctionnent
- [ ] Commandes fonctionnent

---

## 🎊 FÉLICITATIONS !

Ton site **Quarter Fusion** est maintenant en ligne ! 🚀

**URL** : https://quarter-fusion.vercel.app

**Admin** : https://quarter-fusion.vercel.app/admin  
**Login** : `Issa2025` / `quarterfusion`

---

## 📞 SUPPORT

**Problème avec Vercel ?**
- Documentation : https://vercel.com/docs
- Support : https://vercel.com/support

**Problème avec MongoDB ?**
- Documentation : https://docs.mongodb.com/atlas/
- Support : https://support.mongodb.com/

---

## 🚀 PROCHAINES ÉTAPES

Maintenant que ton site est en ligne :

1. ✅ Configure tes **vrais menus** depuis l'admin
2. ✅ Ajoute de **belles images** de tes plats
3. ✅ Configure les **personnalisations** (sauces, tailles, etc.)
4. ✅ Teste les **commandes** de bout en bout
5. ✅ Partage le lien à tes clients ! 🎉

---

**Développé par Othman Meziane**


