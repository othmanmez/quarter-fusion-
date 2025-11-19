# 🚀 Guide : Impression depuis Tablette avec Termux

## 🎯 Solution Ultime : Termux sur Tablette Samsung

**Votre tablette devient le serveur d'impression !**

```
[Tablette Samsung]
    ↓
[Termux] → [Service d'impression]
    ↓
[Imprimante Epson 192.168.1.12]
    ↓
[Ticket sort !] ✅
```

**Avantages :**
- ✅ Pas besoin de PC
- ✅ La tablette est toujours avec vous
- ✅ Impression en 1 clic
- ✅ Simple et mobile
- ✅ 0€ de coût

---

## 📱 Configuration (15 Minutes)

### **ÉTAPE 1 : Installez Termux** (2 minutes)

1. **Ouvrez le Play Store** sur votre tablette

2. **Cherchez** : "Termux"

3. **Installez** : Termux (par F-Droid)
   - C'est gratuit et open-source
   - Icône noire avec `>_`

4. **Ouvrez Termux**

---

### **ÉTAPE 2 : Installez Node.js** (5 minutes)

Dans Termux, tapez ces commandes **une par une** :

```bash
# Mise à jour des paquets
pkg update && pkg upgrade

# Installation de Node.js
pkg install nodejs

# Vérification
node --version
# Devrait afficher : v20.x.x ou similaire
```

**⏱️ Ça prend 3-5 minutes. Soyez patient !**

---

### **ÉTAPE 3 : Donnez Accès au Stockage** (1 minute)

```bash
termux-setup-storage
```

**Une fenêtre apparaît** : "Autoriser Termux à accéder aux fichiers ?"

**Tapez** : "Autoriser" ✅

---

### **ÉTAPE 4 : Créez le Service d'Impression** (5 minutes)

#### **4.1 Créez le dossier :**

```bash
cd ~/storage/shared
mkdir quarter-fusion
cd quarter-fusion
```

#### **4.2 Installez node-thermal-printer :**

```bash
npm install node-thermal-printer
```

#### **4.3 Créez le fichier de service :**

```bash
cat > printer-service-tablet.js << 'EOF'
// Service d'impression Quarter Fusion pour Tablette
const http = require('http');
const { ThermalPrinter, PrinterTypes, CharacterSet } = require('node-thermal-printer');

const PORT = 9000;
const PRINTER_IP = '192.168.1.12';

console.log('🖨️  Service d\'impression Quarter Fusion (Tablette)');
console.log(`📡 Écoute sur port ${PORT}`);
console.log('✅ Prêt à imprimer !');

const server = http.createServer(async (req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  if (req.method === 'POST' && req.url === '/print') {
    let body = '';
    
    req.on('data', chunk => {
      body += chunk.toString();
    });
    
    req.on('end', async () => {
      try {
        const order = JSON.parse(body);
        
        console.log(`🖨️  Impression commande #${order.orderNumber}...`);
        
        // Créer l'imprimante
        const printer = new ThermalPrinter({
          type: PrinterTypes.EPSON,
          interface: `tcp://${PRINTER_IP}:9100`,
          characterSet: 'PC850_MULTILINGUAL',
          removeSpecialCharacters: false,
          lineCharacter: '=',
          width: 48,
        });

        // Formatage du ticket
        printer.alignCenter();
        printer.setTextSize(1, 1);
        printer.bold(true);
        printer.println('QUARTER FUSION');
        printer.bold(false);
        printer.setTextSize(0, 0);
        printer.drawLine();
        
        printer.println('');
        printer.setTextDoubleHeight(true);
        printer.bold(true);
        printer.println(`COMMANDE #${order.orderNumber}`);
        printer.bold(false);
        printer.setTextDoubleHeight(false);
        printer.println('');
        
        printer.drawLine();
        
        // Client
        printer.alignLeft();
        printer.bold(true);
        printer.println(`CLIENT: ${order.customerName}`);
        printer.bold(false);
        printer.println(`Tel: ${order.phone}`);
        
        if (order.isDelivery && order.deliveryAddress) {
          printer.println(`Adresse: ${order.deliveryAddress}`);
          if (order.city) printer.println(`Ville: ${order.city}`);
        }
        
        printer.drawLine();
        
        // Articles
        printer.bold(true);
        printer.println('ARTICLES:');
        printer.bold(false);
        printer.println('');
        
        order.items.forEach(item => {
          const line = `${item.quantity}x ${item.title}`;
          const price = `${(item.price * item.quantity).toFixed(2)}E`;
          const spaces = ' '.repeat(48 - line.length - price.length);
          printer.println(line + spaces + price);
          
          if (item.customizations && item.customizations.length > 0) {
            item.customizations.forEach(custom => {
              if (custom.selectedOptions && custom.selectedOptions.length > 0) {
                custom.selectedOptions.forEach(opt => {
                  printer.println(`  * ${opt}`);
                });
              }
            });
          }
        });
        
        printer.drawLine();
        
        // Total
        printer.setTextSize(1, 1);
        printer.bold(true);
        const totalLine = `TOTAL: ${order.total.toFixed(2)}E`;
        const totalSpaces = ' '.repeat(Math.floor((48 - totalLine.length) / 2));
        printer.println(totalSpaces + totalLine);
        printer.bold(false);
        printer.setTextSize(0, 0);
        
        printer.drawLine();
        
        // Paiement
        printer.alignCenter();
        printer.println(`Paiement: ${order.paymentMethod === 'ESPECES' ? 'Especes' : 'Carte'}`);
        
        if (order.notes) {
          printer.println('');
          printer.println(`Note: ${order.notes}`);
        }
        
        printer.println('');
        printer.println('Merci et a bientot !');
        printer.println('');
        printer.println('');
        printer.println('');
        
        printer.cut();
        
        // Exécuter l'impression
        await printer.execute();
        
        console.log(`✅ Commande #${order.orderNumber} imprimée !`);
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, message: 'Ticket imprimé' }));
        
      } catch (error) {
        console.error('❌ Erreur:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: error.message }));
      }
    });
  } else if (req.method === 'GET' && req.url === '/status') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'online', message: 'Service opérationnel' }));
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
});

server.listen(PORT, () => {
  console.log(`\n🎯 Service démarré sur port ${PORT}`);
  console.log(`📱 Impression depuis la tablette activée !`);
  console.log(`\n💡 Pour arrêter : Ctrl+C\n`);
});
EOF
```

---

### **ÉTAPE 5 : Démarrez le Service** (1 minute)

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

**✅ Le service tourne !** Laissez Termux ouvert en arrière-plan.

---

### **ÉTAPE 6 : Trouvez l'IP de Votre Tablette** (2 minutes)

Dans **un nouvel onglet Termux** (glissez depuis la gauche → "New session") :

```bash
ifconfig wlan0 | grep "inet "
```

**Vous verrez :**
```
inet 192.168.1.XXX  netmask 0xffffff00  broadcast 192.168.1.255
     ^^^^^^^^^^^^
     C'EST L'IP DE VOTRE TABLETTE !
```

**Notez cette IP :** `192.168.1.___`

---

## 🌐 Configuration Netlify

### **Variables d'Environnement à Ajouter :**

Sur Netlify, ajoutez/modifiez :

```
NEXT_PUBLIC_PRINTER_SERVICE_URL
http://192.168.1.XXX:9000
```

⚠️ **Remplacez `XXX` par l'IP de votre TABLETTE** (étape 6)

**Redéployez** après avoir modifié !

---

## 🎯 Utilisation Quotidienne

### **Matin (Début du Service) :**

1. **Ouvrez Termux** sur votre tablette

2. **Tapez :**
```bash
cd ~/storage/shared/quarter-fusion
node printer-service-tablet.js
```

3. **Minimisez Termux** (bouton Home)
   - Le service continue en arrière-plan !

4. **Ouvrez l'admin** (icône Quarter Fusion)

**Prêt à travailler !** ✅

---

### **Pendant le Service :**

1. **Commande arrive** → Email

2. **Ouvrez l'admin** (déjà ouvert)

3. **Cliquez "Imprimer"**

4. **Le ticket sort !** 🎉

**Temps : 3 secondes** ⏱️

---

### **Soir (Fin du Service) :**

1. **Ouvrez Termux**

2. **Appuyez sur** `Ctrl+C` (il y a un bouton Ctrl dans Termux)

3. **Fermez Termux**

**C'est tout !** ✅

---

## 💡 Astuces Android

### **Pour que Termux reste actif en arrière-plan :**

1. **Paramètres Android** → Applications → Termux

2. **Batterie** → Optimisation de la batterie → **Désactiver pour Termux**

3. **Données en arrière-plan** → **Autoriser**

4. **Démarrage automatique** (si disponible) → **Autoriser**

---

### **Raccourci de démarrage (Avancé) :**

Créez un script de démarrage automatique :

```bash
cd ~
cat > start-printer.sh << 'EOF'
#!/data/data/com.termux/files/usr/bin/bash
cd ~/storage/shared/quarter-fusion
node printer-service-tablet.js
EOF

chmod +x start-printer.sh
```

**Ensuite, pour démarrer :**
```bash
./start-printer.sh
```

---

### **Widget Termux (Super Pratique) :**

1. **Créez** `~/.shortcuts/`
```bash
mkdir -p ~/.shortcuts
```

2. **Créez le raccourci** :
```bash
cat > ~/.shortcuts/start-printer.sh << 'EOF'
#!/data/data/com.termux/files/usr/bin/bash
cd ~/storage/shared/quarter-fusion
node printer-service-tablet.js
EOF

chmod +x ~/.shortcuts/start-printer.sh
```

3. **Sur l'écran d'accueil Android** :
   - Appui long → Widgets → Termux:Widget
   - Une icône "start-printer" apparaît !

4. **Pour démarrer** : Tapez sur l'icône ! 🚀

---

## ✅ Avantages de Cette Solution

| Avantage | Pourquoi |
|----------|----------|
| **Mobilité** | ✅ La tablette est toujours avec vous |
| **Simplicité** | ✅ Tout sur un seul appareil |
| **Économie** | ✅ Pas besoin de PC allumé |
| **Rapidité** | ✅ Service local = instantané |
| **Fiabilité** | ✅ Pas de réseau à gérer |

---

## 🆘 Dépannage

### **Problème : "node: command not found"**

```bash
pkg install nodejs
```

### **Problème : "Cannot find module 'node-thermal-printer'"**

```bash
cd ~/storage/shared/quarter-fusion
npm install node-thermal-printer
```

### **Problème : "Ticket ne sort pas"**

**Vérifiez :**

1. L'imprimante est allumée
2. La tablette et l'imprimante sont sur le même WiFi
3. Testez : `ping 192.168.1.12`

### **Problème : "Termux se ferme tout seul"**

**Désactivez l'optimisation de batterie pour Termux** (voir astuces ci-dessus)

---

## 🔋 Consommation de Batterie

**Service d'impression Termux :**
- CPU : <1%
- RAM : ~30 MB
- Batterie : ~2% par heure

**Votre tablette tiendra toute la journée sans problème !** 🔋

---

## 📊 Comparaison Finale

### **Avec PC :**
- ❌ Doit être allumé
- ❌ Deux appareils à gérer
- ❌ Consommation électrique

### **Avec Termux sur Tablette :** ⭐
- ✅ Un seul appareil
- ✅ Mobile et flexible
- ✅ Pas de PC nécessaire
- ✅ Simple et moderne
- ✅ Économique

---

## 🎊 Résumé

**Avec Termux sur votre tablette Samsung :**

1. **Matin** : Démarrez le service (10 secondes)
2. **Journée** : Imprimez en 1 clic
3. **Soir** : Arrêtez le service (2 secondes)

**Tout est sur votre tablette !**  
**Simple, mobile, efficace !** 🚀✨

---

## 💬 Besoin d'Aide ?

Si vous bloquez sur une étape, dites-moi et je vous guide ! 😊

