# 🚀 Guide de Démarrage - Quarter Fusion

## ✅ Votre Solution : Termux sur Tablette

**Architecture :**
- Site public sur Netlify (avec votre domaine)
- Admin accessible depuis tablette
- Impression via Termux sur tablette → Imprimante Epson

---

## 📋 Checklist Complète

### **1️⃣ Déployez sur Netlify** (15 minutes)

1. **Créez un compte** : https://app.netlify.com
2. **Import depuis GitHub** → Sélectionnez `quarter-fusion-`
3. **Configurez les variables** (voir `env.example`)
4. **Connectez votre domaine** (voir `CONFIG-DOMAINE-PERSONNALISE.md`)

### **2️⃣ Configurez Termux sur Tablette** (15 minutes)

1. **Installez Termux** (Play Store)
2. **Installez Node.js** : `pkg install nodejs`
3. **Créez le service** (voir `GUIDE-TERMUX-TABLETTE.md`)
4. **Démarrez** : `node printer-service-tablet.js`

### **3️⃣ Configurez Netlify**

**Variables importantes :**
```
NEXTAUTH_URL=https://votre-domaine.com
NEXT_PUBLIC_PRINTER_SERVICE_URL=http://192.168.1.33:9000
```

---

## 📖 Guides Essentiels

| Guide | Description |
|-------|-------------|
| **`GUIDE-TERMUX-TABLETTE.md`** | ⭐ Configuration complète Termux |
| **`CONFIG-DOMAINE-PERSONNALISE.md`** | Configuration avec votre domaine |
| **`CONFIG-FINALE-IP-TABLETTE.md`** | Référence rapide avec votre IP |
| **`env.example`** | Toutes les variables d'environnement |
| **`README.md`** | Documentation complète du projet |

---

## 🎯 Utilisation Quotidienne

**Matin :**
```bash
cd ~/storage/shared/quarter-fusion
node printer-service-tablet.js
```

**Pendant le service :**
- Commandes arrivent → Email
- Ouvrez l'admin → Clic "Imprimer" → Ticket sort ! ✅

**Soir :**
- `Ctrl+C` dans Termux

---

## ✅ C'est Tout !

**3 guides essentiels + env.example = Tout ce dont vous avez besoin !** 🎉

