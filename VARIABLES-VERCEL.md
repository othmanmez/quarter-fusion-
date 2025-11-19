# 🔐 Variables d'environnement pour Vercel

À ajouter dans : **Vercel → Settings → Environment Variables**

---

## 📋 Liste complète (8 variables)

### 1. DATABASE_URL
```
mongodb+srv://quarterfusion:Quarter2025%21@cluster0.5brzic0.mongodb.net/quarter-fusion?retryWrites=true&w=majority&appName=Cluster0
```

### 2. NEXTAUTH_URL
```
https://quarter-fusion.vercel.app
```
⚠️ Change si tu as un domaine custom (ex: https://quarterfusion.com)

### 3. NEXTAUTH_SECRET
```
[Génère avec: openssl rand -base64 32]
```
⚠️ Doit être unique et sécurisé (32+ caractères)

### 4. EMAIL_HOST
```
smtp.gmail.com
```

### 5. EMAIL_PORT
```
587
```

### 6. EMAIL_USER
```
quarterfusion@gmail.com
```

### 7. EMAIL_PASS
```
fpcplcoqhgfmlkok
```

### 8. ADMIN_EMAIL
```
quarterfusion@gmail.com
```

---

## ✅ Comment ajouter sur Vercel

1. Va dans ton projet Vercel
2. **Settings** → **Environment Variables**
3. Pour chaque variable :
   - Clique **"Add New"**
   - **Name** : Nom de la variable
   - **Value** : Valeur
   - **Environments** : Coche "Production", "Preview", "Development"
   - Clique **"Save"**

---

## 🔒 Sécurité

⚠️ **NE PARTAGE JAMAIS** ces variables publiquement !
⚠️ **Ne les commit JAMAIS** dans Git !
⚠️ Génère un **nouveau NEXTAUTH_SECRET** pour la production !

---

**Voir le guide complet : GUIDE-DEPLOIEMENT-VERCEL.md**


