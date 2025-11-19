# ⚡ Configuration rapide - Imprimante Epson WiFi

## 🎯 Ce qu'il faut faire en 5 minutes

### 1️⃣ Trouver l'adresse IP de l'imprimante

Sur votre imprimante Epson :
- Appuyez sur **Menu** → **Paramètres réseau** → **Statut réseau**
- Notez l'**adresse IP** (exemple : `192.168.1.100`)

### 2️⃣ Modifier le fichier .env

À la racine de votre projet, ajoutez ces lignes dans `.env` :

```env
# Imprimante Epson WiFi
AUTO_PRINT_ENABLED=true
PRINTER_INTERFACE=tcp://192.168.1.100:9100
PRINTER_TYPE=EPSON
PRINTER_WIDTH=48
```

**⚠️ Remplacez `192.168.1.100` par l'IP de VOTRE imprimante !**

### 3️⃣ Installer les dépendances

```bash
npm install node-thermal-printer
```

### 4️⃣ Redémarrer le serveur

```bash
# Arrêtez le serveur (Ctrl+C)
# Puis relancez
npm run dev
```

### 5️⃣ Tester !

1. Allez sur `/admin/settings`
2. Cliquez sur **"🔍 Vérifier le statut"**
3. Cliquez sur **"🖨️ Imprimer un test"**

**✅ Si un ticket s'imprime → C'est bon !**

**❌ Si ça ne marche pas :**
- Vérifiez l'adresse IP
- Vérifiez que l'imprimante est allumée
- Vérifiez qu'elle est sur le même WiFi que votre serveur
- Consultez le guide complet : `docs/GUIDE-IMPRIMANTE-EPSON-WIFI.md`

---

## 🎉 Utilisation

Une fois configurée, **l'imprimante imprime automatiquement** un ticket à chaque nouvelle commande !

Vous n'avez rien à faire, c'est automatique :
1. 🛒 Client passe commande
2. 🔊 Son de notification
3. 🖨️ **Ticket imprimé automatiquement**
4. ✉️ Emails envoyés

---

## 📱 Configuration de l'IP statique (Recommandé)

Pour éviter que l'IP change :

**Sur l'imprimante :**
1. Menu → Paramètres réseau
2. Configuration IP → **Manuel**
3. IP : `192.168.1.100`
4. Masque : `255.255.255.0`
5. Passerelle : `192.168.1.1`

---

## 🆘 Problèmes courants

### ❌ "Imprimante non connectée"

**Solutions :**
1. Vérifiez l'adresse IP avec : `ping 192.168.1.100`
2. Vérifiez que l'imprimante est allumée
3. Vérifiez qu'elle est sur le même réseau WiFi
4. Redémarrez l'imprimante

### ❌ "Impression désactivée"

Vérifiez dans `.env` :
```env
AUTO_PRINT_ENABLED=true
```

### ❌ Le texte est bizarre

Vérifiez dans `.env` :
```env
PRINTER_TYPE=EPSON
```

---

## 📖 Documentation complète

Pour plus d'infos : `docs/GUIDE-IMPRIMANTE-EPSON-WIFI.md`

---

**Date :** Novembre 2024  
**Testé avec :** Epson TM-T20II, TM-T88V

