# ⚡ Installation Rapide - Impression Automatique

## 🎯 Objectif

**Faire en sorte que les commandes s'impriment AUTOMATIQUEMENT sans que le patron ait à faire quoi que ce soit.**

---

## 📱 Sur la Tablette (10 minutes - UNE SEULE FOIS)

### 1. Installez Termux

Téléchargez depuis le Play Store : **Termux**

### 2. Ouvrez Termux et tapez :

```bash
# Installer Node.js
pkg update && pkg install nodejs -y

# Créer le dossier
cd ~/storage/shared
mkdir quarter-fusion-printer
cd quarter-fusion-printer
```

### 3. Copiez le fichier service

**Sur votre PC** :
1. Ouvrez : `printer-service-tablet.js`
2. Copiez TOUT le contenu

**Sur la tablette (Termux)** :
```bash
nano printer-service-tablet.js
```
3. Appui long → Coller
4. Modifiez cette ligne avec l'IP de VOTRE imprimante :
```javascript
const PRINTER_IP = '192.168.1.12';  // ← IP de votre imprimante Epson
```
5. `Ctrl+X` → `Y` → `Entrée`

### 4. Installez les dépendances

```bash
npm init -y
npm install express node-thermal-printer
```

### 5. Trouvez l'IP de la tablette

```bash
ip route get 1.1.1.1 | awk '{print $7}'
```

**Notez ce résultat** (ex: `192.168.1.33`) → Vous en aurez besoin pour Netlify !

---

## 🌐 Sur Netlify (5 minutes - UNE SEULE FOIS)

### 1. Allez sur Netlify

https://app.netlify.com → Votre site → **Site settings** → **Environment variables**

### 2. Ajoutez ces variables :

| Name | Value |
|------|-------|
| `AUTO_PRINT_ENABLED` | `true` |
| `REMOTE_PRINT_ENABLED` | `true` |
| `PRINTER_PUBLIC_URL` | `http://192.168.1.33:9000` ← **Votre IP tablette** |
| `PRINTER_AUTH_TOKEN` | Générez avec : `node scripts/generate-secret.js` |

### 3. Redéployez

**Deploys** → **Trigger deploy** → **Deploy site**

---

## 🚀 Utilisation Quotidienne

### **CHAQUE MATIN** (30 secondes) :

1. Allumez l'imprimante
2. Allumez la tablette
3. Ouvrez Termux
4. Tapez :
```bash
cd ~/storage/shared/quarter-fusion-printer
node printer-service-tablet.js
```

Vous verrez :
```
✅ Service démarré sur le port 9000
```

**⚠️ Laissez Termux OUVERT toute la journée !**

### **PENDANT LE SERVICE** :

**Rien à faire !** Les tickets s'impriment automatiquement quand une commande arrive.

### **CHAQUE SOIR** (5 secondes) :

Dans Termux : `Ctrl+C`

---

## ✅ Test

### Testez l'impression :

Sur la tablette dans Termux (pendant que le service tourne) :
```bash
curl -X POST http://localhost:9000/test
```

→ Un ticket de test devrait s'imprimer ! ✅

---

## 🆘 Ça ne marche pas ?

### L'imprimante n'imprime pas :

1. Vérifiez que l'imprimante est allumée
2. Vérifiez l'IP dans le fichier `printer-service-tablet.js`
3. Ping : `ping 192.168.1.12`

### Le service ne démarre pas :

1. Vérifiez que vous êtes dans le bon dossier
2. Réinstallez : `npm install`

### Les commandes ne s'impriment pas depuis le site :

1. Vérifiez que le service tourne sur la tablette
2. Vérifiez l'IP dans `PRINTER_PUBLIC_URL` sur Netlify
3. Vérifiez les logs Netlify pour voir les erreurs

---

## 📝 Checklist Complète

- [ ] Termux installé sur tablette
- [ ] Node.js installé
- [ ] Fichier service copié et configuré
- [ ] IP imprimante correcte dans le fichier
- [ ] `npm install` fait
- [ ] IP tablette notée
- [ ] Variables Netlify configurées
- [ ] Site redéployé
- [ ] Service démarré sur tablette
- [ ] Test d'impression réussi
- [ ] Commande test passée

---

## 🎉 C'est Tout !

Une fois installé, vous n'avez qu'à :
1. **Matin** : Lancer le service (`node printer-service-tablet.js`)
2. **Journée** : Les tickets s'impriment automatiquement
3. **Soir** : Arrêter le service (`Ctrl+C`)

**100% AUTOMATIQUE - Aucune action du patron ! ✅**
