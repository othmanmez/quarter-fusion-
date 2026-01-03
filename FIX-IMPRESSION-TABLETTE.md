# 🔧 Fix : Impression depuis Tablette ne Fonctionne Pas

## ❌ Problème

Le service Termux est démarré mais l'impression ne fonctionne pas.

**Cause :** Le service écoute seulement sur `localhost` au lieu de toutes les interfaces.

---

## ✅ Solution

### **ÉTAPE 1 : Copiez le Fichier Corrigé sur Votre Tablette**

**Sur votre PC**, le fichier `printer-service-tablet.js` est maintenant corrigé.

**Option A : Via USB**
1. Connectez votre tablette en USB
2. Copiez `printer-service-tablet.js` dans le dossier de la tablette
3. Dans Termux : `cp /sdcard/Download/printer-service-tablet.js ~/storage/shared/quarter-fusion/`

**Option B : Créez le Fichier Directement dans Termux**

Dans Termux, tapez :

```bash
cd ~/storage/shared/quarter-fusion

# Supprimez l'ancien fichier
rm printer-service-tablet.js

# Créez le nouveau fichier
cat > printer-service-tablet.js << 'ENDOFFILE'
// Service d'impression Quarter Fusion pour Tablette
const http = require('http');
const { ThermalPrinter, PrinterTypes, CharacterSet } = require('node-thermal-printer');

const PORT = 9000;
const PRINTER_IP = '192.168.1.12';
const HOST = '0.0.0.0'; // IMPORTANT : Écouter sur toutes les interfaces

console.log('🖨️  Service d\'impression Quarter Fusion (Tablette)');
console.log(`📡 Écoute sur ${HOST}:${PORT}`);
console.log('✅ Prêt à imprimer !');

const server = http.createServer(async (req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS, GET');
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
        console.log(`   Client: ${order.customerName}`);
        console.log(`   Total: ${order.total}€`);
        
        // Créer l'imprimante
        const printer = new ThermalPrinter({
          type: PrinterTypes.EPSON,
          interface: `tcp://${PRINTER_IP}:9100`,
          characterSet: 'PC850_MULTILINGUAL',
          removeSpecialCharacters: false,
          lineCharacter: '=',
          width: 48,
        });

        // Formatage du ticket (même code qu'avant)
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
        
        printer.setTextSize(1, 1);
        printer.bold(true);
        const totalLine = `TOTAL: ${order.total.toFixed(2)}E`;
        const totalSpaces = ' '.repeat(Math.floor((48 - totalLine.length) / 2));
        printer.println(totalSpaces + totalLine);
        printer.bold(false);
        printer.setTextSize(0, 0);
        
        printer.drawLine();
        
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
        
        await printer.execute();
        
        console.log(`✅ Commande #${order.orderNumber} imprimée !`);
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, message: 'Ticket imprimé' }));
        
      } catch (error) {
        console.error('❌ Erreur:', error);
        console.error('   Détails:', error.message);
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

server.listen(PORT, HOST, () => {
  console.log(`\n🎯 Service démarré sur ${HOST}:${PORT}`);
  console.log(`📱 Accessible depuis le réseau local`);
  console.log(`🖨️  Imprimante: ${PRINTER_IP}:9100`);
  console.log(`\n💡 Pour arrêter : Ctrl+C\n`);
});

process.on('SIGINT', () => {
  console.log('\n👋 Arrêt du service d\'impression...');
  server.close(() => {
    console.log('✅ Service arrêté proprement.');
    process.exit(0);
  });
});
ENDOFFILE

# Vérifiez que le fichier est créé
ls -la printer-service-tablet.js
```

---

### **ÉTAPE 2 : Redémarrez le Service**

**Arrêtez l'ancien service** (Ctrl+C dans Termux)

**Démarrez le nouveau :**

```bash
cd ~/storage/shared/quarter-fusion
node printer-service-tablet.js
```

**Vous devez maintenant voir :**

```
🖨️  Service d'impression Quarter Fusion (Tablette)
📡 Écoute sur 0.0.0.0:9000
✅ Prêt à imprimer !

🎯 Service démarré sur 0.0.0.0:9000
📱 Accessible depuis le réseau local
🖨️  Imprimante: 192.168.1.12:9100
```

**Notez le changement :** `0.0.0.0:9000` au lieu de juste `9000` !

---

### **ÉTAPE 3 : Testez**

**Dans Termux (nouvelle session) :**

```bash
# Testez depuis la tablette elle-même
curl http://192.168.1.33:9000/status
```

**Vous devez voir :**
```json
{"status":"online","message":"Service opérationnel"}
```

**Si ça marche, testez l'impression depuis l'admin !**

---

## 🔍 Vérifications Supplémentaires

### **1. Vérifiez l'IP de la Tablette**

```bash
ip route get 1.1.1.1 | awk '{print $7}'
```

**Si l'IP a changé**, modifiez dans `app/admin/orders/page.tsx` :
```typescript
const printerServiceUrl = 'http://NOUVELLE_IP:9000';
```

### **2. Vérifiez la Connexion à l'Imprimante**

```bash
ping 192.168.1.12
```

**Si ça ne répond pas**, l'imprimante n'est pas sur le réseau.

### **3. Vérifiez les Logs Termux**

Quand vous cliquez sur "Imprimer", vous devez voir dans Termux :

```
🖨️  Impression commande #1234...
   Client: Jean Dupont
   Total: 19.00€
✅ Commande #1234 imprimée !
```

**Si vous voyez une erreur**, copiez le message d'erreur complet.

---

## ✅ Checklist

- [ ] Fichier `printer-service-tablet.js` mis à jour avec `HOST = '0.0.0.0'`
- [ ] Service redémarré dans Termux
- [ ] Message "Écoute sur 0.0.0.0:9000" visible
- [ ] Test `curl http://192.168.1.33:9000/status` → OK
- [ ] IP tablette vérifiée : `192.168.1.33`
- [ ] Test ping imprimante : `ping 192.168.1.12` → OK
- [ ] Test impression depuis l'admin → Ticket sort !

---

## 🆘 Si Ça Ne Marche Toujours Pas

**Vérifiez les logs Termux** quand vous cliquez sur "Imprimer" :

1. **Si vous voyez** `🖨️  Impression commande #...` → La requête arrive !
2. **Si vous voyez une erreur** → Copiez le message d'erreur complet
3. **Si vous ne voyez rien** → La requête n'arrive pas au service

**Envoyez-moi :**
- Les logs Termux complets
- Le résultat de `curl http://192.168.1.33:9000/status`
- Le message d'erreur dans le navigateur (console)

---

## 💡 Astuce

**Pour éviter de retaper le fichier**, créez un script de démarrage :

```bash
cat > ~/.shortcuts/start-printer.sh << 'EOF'
#!/data/data/com.termux/files/usr/bin/bash
cd ~/storage/shared/quarter-fusion
node printer-service-tablet.js
EOF

chmod +x ~/.shortcuts/start-printer.sh
```

**Ensuite**, utilisez le widget Termux pour démarrer en 1 clic ! 🚀

