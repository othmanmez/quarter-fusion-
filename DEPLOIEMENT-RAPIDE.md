# 🚀 Déploiement Rapide - Quarter Fusion

## ⚡ Guide express (10 minutes)

### 1️⃣ Prépare ton code
```bash
npm run build  # Vérifie que ça marche
```

### 2️⃣ Push sur GitHub
```bash
git init
git add .
git commit -m "Ready for deployment"
git remote add origin https://github.com/TON-USERNAME/quarter-fusion.git
git push -u origin main
```

### 3️⃣ Configure MongoDB Atlas
- Va sur https://cloud.mongodb.com
- **Network Access** → **Add IP** → **0.0.0.0/0** (Allow from anywhere)

### 4️⃣ Génère un secret
```bash
# Option 1 : Avec Node
node scripts/generate-secret.js

# Option 2 : Avec OpenSSL
openssl rand -base64 32

# Option 3 : Site web
# https://generate-secret.vercel.app/32
```

### 5️⃣ Déploie sur Vercel
1. Va sur https://vercel.com
2. **Sign up** avec GitHub
3. **Import** ton repo `quarter-fusion`
4. Ajoute les **8 variables d'environnement** (voir VARIABLES-VERCEL.md)
5. Clique **Deploy**

### 6️⃣ Seed la base
```bash
npx tsx scripts/create-admin-user.ts
npm run seed:cities
npm run seed:prisma
```

### 7️⃣ Teste !
- Site : https://quarter-fusion.vercel.app
- Admin : https://quarter-fusion.vercel.app/admin
- Login : `Issa2025` / `quarterfusion`

---

## 📚 Guides complets

- **Guide détaillé** : `GUIDE-DEPLOIEMENT-VERCEL.md`
- **Variables d'env** : `VARIABLES-VERCEL.md`

---

## 🆘 Problèmes ?

### Build failed
```bash
# Teste en local
npm run build
```

### Admin ne marche pas
- Vérifie `NEXTAUTH_URL` = URL exacte du site
- Vérifie `NEXTAUTH_SECRET` = secret 32+ caractères
- Redéploie

### Base de données inaccessible
- MongoDB Atlas → Network Access → `0.0.0.0/0`

---

## ✅ Checklist

- [ ] `npm run build` fonctionne en local
- [ ] Code sur GitHub
- [ ] MongoDB accessible depuis partout
- [ ] 8 variables ajoutées sur Vercel
- [ ] Site déployé
- [ ] Admin fonctionne
- [ ] Base seedée

**🎉 C'est tout ! Ton site est en ligne !**


