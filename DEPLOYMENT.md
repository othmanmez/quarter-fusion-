# 🚀 Guide de déploiement - Quarter Fusion

## Méthode 1 : Déploiement via Vercel Dashboard (Recommandé)

### Étape 1 : Préparer le projet

1. **Assurez-vous que le code est sur GitHub**
   ```bash
   git add .
   git commit -m "Prêt pour le déploiement"
   git push origin main
   ```

### Étape 2 : Configurer Vercel

1. Allez sur [vercel.com](https://vercel.com)
2. Cliquez sur **"Add New Project"**
3. Sélectionnez votre repo GitHub `quarter-fusion`
4. Vercel détecte automatiquement Next.js

### Étape 3 : Variables d'environnement

Ajoutez ces variables dans Vercel :

```env
DATABASE_URL=mongodb+srv://quarterfusion:Quarter2025%21@cluster0.5brzic0.mongodb.net/quarter-fusion?retryWrites=true&w=majority&appName=Cluster0

NEXTAUTH_URL=https://votre-domaine.vercel.app
NEXTAUTH_SECRET=change-this-super-secret-key-min-32-characters-long

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=quarterfusion@gmail.com
EMAIL_PASS=fpcplcoqhgfmlkok
ADMIN_EMAIL=quarterfusion@gmail.com

AUTO_PRINT_ENABLED=false
```

⚠️ **IMPORTANT** : 
- Remplacez `votre-domaine` par votre vrai domaine Vercel
- Ne mettez PAS les variables `PRINTER_*` en production
- Générez un nouveau `NEXTAUTH_SECRET` pour la production

### Étape 4 : Déployer

1. Cliquez sur **"Deploy"**
2. Attendez 2-3 minutes
3. Votre site est en ligne ! 🎉

---

## Méthode 2 : Déploiement via Vercel CLI

### Installation

```bash
npm i -g vercel
vercel login
```

### Déploiement

```bash
# Preview deployment
vercel

# Production deployment
vercel --prod
```

---

## Post-déploiement

### 1. Configurer MongoDB Atlas

1. Allez sur [MongoDB Atlas](https://cloud.mongodb.com)
2. **Network Access** → Ajoutez l'IP `0.0.0.0/0` (toutes les IPs)
3. Testez la connexion depuis Vercel

### 2. Créer un compte admin

Option A : Depuis votre machine locale
```bash
# Modifiez DATABASE_URL pour pointer vers prod
node scripts/update-admin.js
```

Option B : Via Prisma Studio
```bash
npx prisma studio
# Créez un utilisateur manuellement
```

### 3. Tester le site

✅ Checklist de test :
- [ ] Page d'accueil charge
- [ ] Click & Collect fonctionne
- [ ] Livraison fonctionne
- [ ] Commande test réussie
- [ ] Email reçu
- [ ] Admin accessible (`/admin`)
- [ ] Dashboard admin fonctionne
- [ ] Gestion du menu OK
- [ ] Notifications fonctionnent

### 4. Configurer le domaine personnalisé (Optionnel)

1. Dans Vercel : **Settings** → **Domains**
2. Ajoutez votre domaine
3. Configurez les DNS chez votre registrar
4. Mettez à jour `NEXTAUTH_URL`

---

## Dépannage

### ❌ "Build failed"

**Vérifiez :**
```bash
# Localement
npm run build
```

**Solutions :**
- Tous les imports sont corrects
- Pas d'erreurs TypeScript
- Variables d'environnement définies

### ❌ "Cannot connect to database"

**Vérifiez :**
1. `DATABASE_URL` correcte dans Vercel
2. IP `0.0.0.0/0` whitelistée dans MongoDB Atlas
3. Cluster MongoDB en ligne

### ❌ "Emails not sending"

**Vérifiez :**
1. `EMAIL_USER` et `EMAIL_PASS` corrects
2. Mot de passe d'application Gmail créé
3. Compte Gmail actif

### ❌ "Session expired immediately"

**Solution :**
1. Générez un nouveau `NEXTAUTH_SECRET` :
   ```bash
   openssl rand -base64 32
   ```
2. Ajoutez-le dans Vercel
3. Redéployez

---

## Surveillance

### Logs Vercel

```bash
vercel logs <deployment-url>
```

### Analytics (Optionnel)

Activez Vercel Analytics :
1. Project Settings → Analytics
2. Enable Analytics

---

## Rollback

Si problème, revenez à un déploiement précédent :

1. **Deployments** dans Vercel
2. Sélectionnez un déploiement stable
3. **Promote to Production**

---

## Sécurité en production

### ✅ Bonnes pratiques appliquées

- [x] Mots de passe hashés (bcrypt)
- [x] HTTPS automatique (Vercel)
- [x] Variables sensibles dans .env
- [x] Routes admin protégées
- [x] CSRF protection
- [x] Validation des données

### ⚠️ À faire après déploiement

- [ ] Changer tous les mots de passe par défaut
- [ ] Activer 2FA sur Gmail
- [ ] Surveiller les logs d'erreurs
- [ ] Configurer des sauvegardes MongoDB
- [ ] Limiter l'accès admin si possible

---

## Performance

### Optimisations automatiques

Vercel optimise automatiquement :
- ✅ CDN global
- ✅ Compression Brotli
- ✅ Images optimisées
- ✅ Cache intelligent
- ✅ Edge Functions

### Monitoring

Surveillez :
- Temps de réponse API
- Taux d'erreur
- Utilisation mémoire
- Trafic

---

## Coûts

### Vercel

- **Hobby (Gratuit)** : Parfait pour commencer
  - Bande passante illimitée
  - 100 GB-hours/mois
  - Domaine personnalisé inclus

- **Pro ($20/mois)** : Si besoin de plus
  - Support prioritaire
  - Analytics avancées
  - Plus de ressources

### MongoDB Atlas

- **Free Tier (M0)** : Gratuit pour toujours
  - 512 MB stockage
  - Connexions partagées
  - Parfait pour débuter

- **Dedicated ($9+/mois)** : Si croissance
  - Plus de stockage
  - Performances garanties
  - Backups automatiques

---

## Maintenance

### Mises à jour

```bash
# Mettre à jour les dépendances
npm update

# Rebuild et redéployer
git commit -am "Update dependencies"
git push
```

### Sauvegardes

Configurez des sauvegardes MongoDB :
1. MongoDB Atlas → Backups
2. Activez Cloud Backup
3. Définissez la fréquence

---

## Support

### Ressources

- 📚 [Documentation Vercel](https://vercel.com/docs)
- 📚 [Documentation Next.js](https://nextjs.org/docs)
- 📚 [Documentation MongoDB](https://www.mongodb.com/docs)
- 📧 Support Vercel : support@vercel.com

### Logs et debugging

```bash
# Logs en temps réel
vercel logs --follow

# Logs d'une fonction spécifique
vercel logs --function=api/orders
```

---

**Bon déploiement ! 🚀**

