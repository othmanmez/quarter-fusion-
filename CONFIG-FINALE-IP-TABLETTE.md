# ✅ Configuration Finale avec IP Tablette : 192.168.1.33

## 🎯 Votre Configuration

- **IP de votre tablette** : `192.168.1.33`
- **IP de l'imprimante** : `192.168.1.12`
- **Port du service** : `9000`

---

## 🌐 Configuration Netlify

### **Variables d'Environnement à Ajouter/Modifier :**

Sur Netlify, allez dans **"Site settings" → "Environment variables"**

**Ajoutez ou modifiez cette variable :**

```
NEXT_PUBLIC_PRINTER_SERVICE_URL
http://192.168.1.33:9000
```

⚠️ **IMPORTANT** : Pas de guillemets, juste la valeur !

---

## 📋 Toutes les Variables Netlify (Rappel)

Assurez-vous d'avoir TOUTES ces variables :

```
MONGODB_URI
mongodb+srv://quarterfusion:Quarter2025%21@cluster0.5brzic0.mongodb.net/quarter-fusion?retryWrites=true&w=majority&appName=Cluster0

DATABASE_URL
mongodb+srv://quarterfusion:Quarter2025%21@cluster0.5brzic0.mongodb.net/quarter-fusion?retryWrites=true&w=majority&appName=Cluster0

NEXTAUTH_URL
https://votre-site.netlify.app

NEXTAUTH_SECRET
c4c8f3a1e92d4b0b7fd9e1f58c39a5e2c7bfa4df1a8e6cf0d32ab98e4db6517c

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

⚠️ **Remplacez `https://votre-site.netlify.app` par votre vraie URL Netlify !**

---

## 🔄 Redéployer Netlify

**Après avoir ajouté/modifié les variables :**

1. **Cliquez sur** "Trigger deploy" → "Deploy site"
2. **Attendez** que le déploiement se termine (~2-3 minutes)
3. **C'est fait !** ✅

---

## 📱 Configuration Termux (Rappel)

### **Dans Termux, créez le service :**

```bash
cd ~/storage/shared
mkdir -p quarter-fusion
cd quarter-fusion

# Installez node-thermal-printer
npm install node-thermal-printer

# Créez le fichier (voir GUIDE-TERMUX-TABLETTE.md pour le contenu complet)
# Ou copiez printer-service-tablet.js depuis votre PC
```

### **Démarrez le service :**

```bash
node printer-service-tablet.js
```

**Vous devriez voir :**

```
🖨️  Service d'impression Quarter Fusion (Tablette)
📡 Écoute sur port 9000
✅ Prêt à imprimer !

🎯 Service démarré sur port 9000
📱 Impression depuis la tablette activée !
```

---

## ✅ Test Complet

### **1. Vérifiez que Termux tourne :**

Dans Termux, vous devez voir le service actif.

### **2. Vérifiez la connexion à l'imprimante :**

Dans Termux (nouvelle session) :

```bash
ping 192.168.1.12
```

**Si ça répond, c'est bon !** ✅

### **3. Testez depuis l'admin :**

1. **Ouvrez l'admin** sur votre tablette : `https://votre-site.netlify.app/admin`

2. **Passez une commande test** (depuis un autre appareil)

3. **Dans l'admin**, cliquez sur "🖨️ Imprimer"

4. **Le ticket doit sortir !** 🎉

---

## 🆘 Dépannage

### **Problème : "Service d'impression non disponible"**

**Vérifiez :**

1. ✅ Termux est ouvert et le service tourne
2. ✅ La tablette est sur le même WiFi que l'imprimante
3. ✅ L'IP dans Netlify est correcte : `http://192.168.1.33:9000`
4. ✅ Netlify a été redéployé après modification

**Test rapide :**

Dans Termux :
```bash
curl http://localhost:9000/status
```

**Devrait répondre :** `{"status":"online","message":"Service opérationnel"}`

### **Problème : "Ticket ne sort pas"**

**Vérifiez :**

1. ✅ Imprimante allumée
2. ✅ Imprimante connectée au WiFi
3. ✅ Test : `ping 192.168.1.12` dans Termux

---

## 🎯 Checklist Finale

- [ ] IP tablette notée : `192.168.1.33` ✅
- [ ] Variable `NEXT_PUBLIC_PRINTER_SERVICE_URL` configurée sur Netlify
- [ ] Netlify redéployé
- [ ] Termux installé sur tablette
- [ ] Node.js installé dans Termux
- [ ] Service d'impression créé dans Termux
- [ ] Service démarré dans Termux
- [ ] Test de connexion : `ping 192.168.1.12` OK
- [ ] Test d'impression depuis l'admin OK

---

## 🎊 C'est Prêt !

**Votre configuration est complète !**

**IP Tablette :** `192.168.1.33`  
**IP Imprimante :** `192.168.1.12`  
**Service :** Port `9000`

**Tout est configuré !** 🚀✨

---

## 📖 Guides de Référence

- **`GUIDE-TERMUX-TABLETTE.md`** : Guide complet Termux
- **`TROUVER-IP-TABLETTE.md`** : Comment trouver l'IP
- **`DEMARRAGE-RAPIDE.md`** : Vue d'ensemble

---

## 💡 Rappel : Utilisation Quotidienne

**Matin :**
```bash
cd ~/storage/shared/quarter-fusion
node printer-service-tablet.js
```

**Pendant le service :**
- Commandes arrivent → Email
- Ouvrez l'admin → Clic "Imprimer" → Ticket sort ! ✅

**Soir :**
- `Ctrl+C` dans Termux pour arrêter

**Simple et efficace !** 🎯

