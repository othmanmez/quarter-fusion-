# 🌐 Configuration avec Votre Nom de Domaine

## 🎯 Votre Situation

- ✅ Vous avez acheté un nom de domaine
- ✅ Vous voulez l'utiliser avec Netlify
- ✅ Vous voulez configurer NEXTAUTH_URL correctement

---

## 📋 Étapes Complètes

### **ÉTAPE 1 : Déployez sur Netlify** (10 minutes)

1. **Allez sur** : https://app.netlify.com

2. **Créez un compte** (ou connectez-vous)
   - Cliquez sur "Sign up"
   - Choisissez "Sign up with GitHub" (recommandé)

3. **Importez votre projet** :
   - Cliquez sur "Add new site" → "Import an existing project"
   - Connectez votre compte GitHub
   - Sélectionnez le dépôt `quarter-fusion-`

4. **Configuration du build** :
   - Build command : `npm run build`
   - Publish directory : `.next`
   - Cliquez sur "Deploy site"

5. **Attendez** 2-3 minutes que le déploiement se termine

6. **Notez l'URL temporaire** : `https://votre-site-random-123.netlify.app`
   - Cette URL fonctionne déjà !
   - Vous pouvez l'utiliser temporairement

---

### **ÉTAPE 2 : Connectez Votre Domaine** (5 minutes)

1. **Dans Netlify**, allez dans votre site

2. **Cliquez sur** "Domain settings" (dans le menu de gauche)

3. **Cliquez sur** "Add custom domain"

4. **Entrez votre domaine** :
   - Exemple : `quarter-fusion.com`
   - OU : `www.quarter-fusion.com`

5. **Netlify vous affichera** :
   - Des instructions DNS
   - Des enregistrements à configurer

---

### **ÉTAPE 3 : Configurez les DNS** (10 minutes)

**Netlify vous donnera des enregistrements comme :**

#### **Option A : Domaine Principal (sans www)**

```
Type: A
Name: @
Value: 75.2.60.5
TTL: 3600

Type: CNAME
Name: www
Value: votre-site-random-123.netlify.app
TTL: 3600
```

#### **Option B : Domaine avec www**

```
Type: CNAME
Name: www
Value: votre-site-random-123.netlify.app
TTL: 3600

Type: A
Name: @
Value: 75.2.60.5
TTL: 3600
```

#### **Où Configurer ?**

**Selon votre registrar :**

- **OVH** : https://www.ovh.com/manager/web → Votre domaine → Zone DNS
- **GoDaddy** : https://dcc.godaddy.com → Votre domaine → DNS
- **Namecheap** : https://ap.www.namecheap.com → Domain List → Manage → Advanced DNS
- **Google Domains** : https://domains.google.com → Votre domaine → DNS

**Ajoutez les enregistrements** que Netlify vous a donnés.

**⏱️ Propagation DNS :** 5 minutes à 48 heures (généralement 10-30 minutes)

---

### **ÉTAPE 4 : Vérifiez la Connexion** (2 minutes)

1. **Dans Netlify**, allez dans "Domain settings"

2. **Attendez** que le statut passe à "Active" (cercle vert)

3. **Testez** : Ouvrez votre navigateur et allez sur `https://votre-domaine.com`

4. **Si ça fonctionne**, vous verrez votre site ! ✅

---

### **ÉTAPE 5 : Configurez NEXTAUTH_URL** (2 minutes)

1. **Dans Netlify**, allez dans "Site settings" → "Environment variables"

2. **Ajoutez ou modifiez** :

```
NEXTAUTH_URL
https://votre-domaine.com
```

⚠️ **IMPORTANT** :
- Utilisez `https://` (pas `http://`)
- Utilisez votre domaine EXACT (avec ou sans www selon votre choix)
- Pas de guillemets

**Exemples :**
- ✅ `https://quarter-fusion.com`
- ✅ `https://www.quarter-fusion.com`
- ❌ `http://quarter-fusion.com` (pas de https)
- ❌ `quarter-fusion.com` (manque https://)

---

### **ÉTAPE 6 : Redéployez** (2 minutes)

1. **Après avoir ajouté/modifié** `NEXTAUTH_URL`

2. **Cliquez sur** "Trigger deploy" → "Deploy site"

3. **Attendez** 2-3 minutes

4. **C'est fait !** ✅

---

## 📋 Toutes les Variables Netlify (Avec Votre Domaine)

**Assurez-vous d'avoir TOUTES ces variables :**

```
MONGODB_URI
mongodb+srv://quarterfusion:Quarter2025%21@cluster0.5brzic0.mongodb.net/quarter-fusion?retryWrites=true&w=majority&appName=Cluster0

DATABASE_URL
mongodb+srv://quarterfusion:Quarter2025%21@cluster0.5brzic0.mongodb.net/quarter-fusion?retryWrites=true&w=majority&appName=Cluster0

NEXTAUTH_URL
https://votre-domaine.com

NEXTAUTH_SECRET
change-this-super-secret-key-min-32-characters-1234567890

ADMIN_EMAIL
quarterfusion@gmail.com

ADMIN_PASSWORD
admin123

EMAIL_HOST
smtp.gmail.com

EMAIL_PORT
587

EMAIL_USER
quarterfusion@gmail.com

EMAIL_PASS
fpcplcoqhgfmlkok

AUTO_PRINT_ENABLED
false

PRINTER_INTERFACE
tcp://192.168.1.12:9100

PRINTER_TYPE
EPSON

PRINTER_WIDTH
48

NEXT_PUBLIC_PRINTER_SERVICE_URL
http://192.168.1.33:9000
```

⚠️ **Remplacez** :
- `https://votre-domaine.com` par votre vrai domaine
- `http://192.168.1.33:9000` par l'IP de votre tablette (déjà fait ✅)

---

## 🔒 HTTPS Automatique

**Netlify configure automatiquement HTTPS** pour votre domaine !

**Pas besoin de certificat SSL manuel !** ✅

**Netlify le fait automatiquement** en quelques minutes après la connexion du domaine.

---

## 🎯 Exemple Complet

**Si votre domaine est** : `quarter-fusion.com`

### **Configuration DNS (chez votre registrar) :**

```
Type: A
Name: @
Value: 75.2.60.5

Type: CNAME
Name: www
Value: votre-site-random-123.netlify.app
```

### **Variables Netlify :**

```
NEXTAUTH_URL
https://quarter-fusion.com

NEXT_PUBLIC_PRINTER_SERVICE_URL
http://192.168.1.33:9000
```

### **URLs Finales :**

- **Site public** : `https://quarter-fusion.com`
- **Admin** : `https://quarter-fusion.com/admin`
- **Service impression** : `http://192.168.1.33:9000` (local, sur votre tablette)

---

## 🆘 Dépannage

### **Problème : "Domain not verified"**

**Solution :**
1. Vérifiez que les DNS sont bien configurés
2. Attendez 10-30 minutes (propagation DNS)
3. Vérifiez dans Netlify → Domain settings → Status

### **Problème : "SSL certificate pending"**

**Solution :**
- Attendez 5-10 minutes
- Netlify configure automatiquement le certificat SSL
- Pas d'action nécessaire

### **Problème : "Site not loading"**

**Vérifiez :**
1. Les DNS sont bien configurés (utilisez https://dnschecker.org)
2. Le domaine est bien connecté dans Netlify
3. Le site est bien déployé (status "Published")

---

## ✅ Checklist Complète

- [ ] Compte Netlify créé
- [ ] Site déployé sur Netlify
- [ ] URL temporaire obtenue : `https://votre-site-random.netlify.app`
- [ ] Domaine ajouté dans Netlify
- [ ] DNS configurés chez votre registrar
- [ ] Domaine vérifié dans Netlify (statut "Active")
- [ ] HTTPS activé automatiquement
- [ ] `NEXTAUTH_URL` configuré avec votre domaine
- [ ] `NEXT_PUBLIC_PRINTER_SERVICE_URL` configuré avec IP tablette
- [ ] Site redéployé après modifications
- [ ] Test : Site accessible sur `https://votre-domaine.com`
- [ ] Test : Admin accessible sur `https://votre-domaine.com/admin`

---

## 🎊 Résumé

**Avec votre nom de domaine :**

1. **Déployez sur Netlify** → Obtenez une URL temporaire
2. **Connectez votre domaine** → Dans Netlify Domain settings
3. **Configurez les DNS** → Chez votre registrar
4. **Configurez NEXTAUTH_URL** → `https://votre-domaine.com`
5. **Redéployez** → C'est fait !

**Votre site sera accessible sur** : `https://votre-domaine.com` ✅

**Et l'admin sur** : `https://votre-domaine.com/admin` ✅

---

## 💡 Astuce

**Pendant que les DNS se propagent** (10-30 minutes) :

Vous pouvez utiliser l'URL temporaire Netlify pour tester :
- `https://votre-site-random.netlify.app`

**Une fois les DNS propagés**, votre domaine fonctionnera ! 🎯

---

## 📞 Besoin d'Aide ?

**Si vous bloquez sur une étape :**

1. **Quel est votre registrar ?** (OVH, GoDaddy, etc.)
2. **Quel est votre domaine ?** (pour vérifier la config)
3. **À quelle étape êtes-vous bloqué ?**

**Dites-moi et je vous guide !** 😊

