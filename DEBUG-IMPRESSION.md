# 🔧 Debug : Ticket non imprimé

## ✅ Checklist de diagnostic

### 1. Vérifier la configuration

```bash
# Vérifier que l'impression est activée
grep AUTO_PRINT_ENABLED .env.local
# Doit afficher : AUTO_PRINT_ENABLED=true

# Vérifier l'adresse IP
grep PRINTER_INTERFACE .env.local
# Doit afficher : PRINTER_INTERFACE=tcp://192.168.1.12:9100
```

### 2. Tester la connexion à l'imprimante

```bash
# Ping de l'imprimante
ping -c 3 192.168.1.12

# Test du port 9100
nc -zv 192.168.1.12 9100 2>&1 || echo "Port 9100 fermé ou imprimante non accessible"
```

### 3. Vérifier que l'imprimante est allumée

- ✅ Imprimante sous tension
- ✅ Papier présent
- ✅ Pas d'erreur sur l'écran
- ✅ Connectée au WiFi (même réseau)

### 4. Tester via l'interface admin

1. Allez sur : **http://localhost:3000/admin/settings**
2. Connectez-vous (issa@quarterfusion.com / Issa2025)
3. Section "🖨️ Test d'imprimante"
4. Cliquez sur **"🔍 Vérifier le statut"**
   - ✅ Connectée → Passez à l'étape 5
   - ❌ Non connectée → Voir section "Problèmes courants"
5. Cliquez sur **"🖨️ Imprimer un test"**
   - ✅ Ticket imprimé → L'imprimante fonctionne !
   - ❌ Erreur → Voir les logs

### 5. Vérifier les logs

Regardez les logs du serveur pour voir les erreurs :

```bash
# Voir les dernières lignes de logs
tail -20 server.log

# Chercher les erreurs d'impression
grep -i "print\|imprim\|erreur" server.log
```

---

## ❌ Problèmes courants

### Problème 1 : "Imprimante non connectée"

**Cause** : L'imprimante ne répond pas sur le réseau

**Solution** :
```bash
# 1. Vérifier l'IP de l'imprimante
#    Sur l'imprimante : Menu → Paramètres réseau → Statut réseau

# 2. Mettre à jour l'IP dans .env.local si elle a changé
echo "PRINTER_INTERFACE=tcp://NOUVELLE_IP:9100" >> .env.local

# 3. Redémarrer le serveur
pkill -f "next dev"
npm run dev
```

### Problème 2 : "Connection refused" ou "ECONNREFUSED"

**Cause** : Le port 9100 n'est pas accessible

**Solutions** :
1. **Vérifier le pare-feu Windows**
   - Autoriser le trafic sortant vers 192.168.1.12:9100

2. **Tester un autre port** (rare)
   - Essayez 515 ou 631 si 9100 ne fonctionne pas
   ```env
   PRINTER_INTERFACE=tcp://192.168.1.12:515
   ```

3. **Redémarrer l'imprimante**
   - Éteindre/rallumer l'imprimante
   - Attendre 30 secondes
   - Retester

### Problème 3 : "Module not found: node-thermal-printer"

**Cause** : Package non installé

**Solution** :
```bash
npm install node-thermal-printer
npm run dev
```

### Problème 4 : Aucune erreur mais pas d'impression

**Cause** : L'imprimante reçoit les données mais ne les traite pas

**Solutions** :

1. **Vérifier le type d'imprimante**
   ```env
   PRINTER_TYPE=EPSON  # Pour imprimantes Epson TM
   ```

2. **Vérifier la largeur**
   ```env
   PRINTER_WIDTH=48  # Pour 80mm
   # ou
   PRINTER_WIDTH=32  # Pour 58mm
   ```

3. **Réinitialiser l'imprimante**
   - Éteindre l'imprimante
   - Débrancher 10 secondes
   - Rebrancher et rallumer
   - Attendre la fin de l'initialisation
   - Retester

4. **Imprimer une page de test depuis l'imprimante**
   - Maintenir le bouton papier appuyé
   - Une page de test doit s'imprimer
   - Si non → Problème matériel

### Problème 5 : "Ticket imprimé mais vide"

**Cause** : Mauvais encodage ou type d'imprimante incorrect

**Solution** :
```env
# Dans .env.local
PRINTER_TYPE=EPSON
PRINTER_WIDTH=48
```

---

## 🔍 Tests manuels avancés

### Test 1 : Vérifier que le package fonctionne

Créez un fichier `test-printer.js` :

```javascript
const { ThermalPrinter, PrinterTypes } = require('node-thermal-printer');

async function testPrint() {
  const printer = new ThermalPrinter({
    type: PrinterTypes.EPSON,
    interface: 'tcp://192.168.1.12:9100',
    characterSet: 'FRANCE',
    width: 48,
  });

  try {
    const isConnected = await printer.isPrinterConnected();
    console.log('Connectée :', isConnected);

    if (isConnected) {
      printer.alignCenter();
      printer.bold(true);
      printer.println('TEST IMPRESSION');
      printer.bold(false);
      printer.println('Si vous voyez ce texte,');
      printer.println('l\'imprimante fonctionne !');
      printer.newLine();
      printer.newLine();
      printer.cut();
      
      await printer.execute();
      console.log('✅ Ticket envoyé à l\'imprimante');
    }
  } catch (error) {
    console.error('❌ Erreur :', error.message);
  }
}

testPrint();
```

Exécutez :
```bash
node test-printer.js
```

### Test 2 : Vérifier la route API

```bash
# Tester la route de statut
curl http://localhost:3000/api/printer/status

# Tester l'impression
curl -X POST http://localhost:3000/api/printer/test
```

---

## 📝 Configuration recommandée

Votre `.env.local` doit contenir :

```env
AUTO_PRINT_ENABLED=true
PRINTER_INTERFACE=tcp://192.168.1.12:9100
PRINTER_TYPE=EPSON
PRINTER_WIDTH=48
```

---

## 🆘 Si rien ne fonctionne

### Option 1 : Impression via USB (plus fiable)

Si le WiFi pose problème, connectez l'imprimante en USB :

```env
# Sur Windows
PRINTER_INTERFACE=\\\\localhost\\NomImprimante

# Sur Linux/Mac
PRINTER_INTERFACE=/dev/usb/lp0
```

### Option 2 : Désactiver temporairement

En attendant de résoudre le problème :

```env
AUTO_PRINT_ENABLED=false
```

Les commandes fonctionneront sans impression.

### Option 3 : Contacter le support

Informations à fournir :
- Modèle exact de l'imprimante Epson
- Adresse IP : 192.168.1.12
- Message d'erreur complet
- Résultat du ping
- Logs du serveur

---

## ✅ Une fois que ça marche

1. **Configurez une IP statique** pour l'imprimante
   - Sur l'imprimante : Menu → Réseau → IP Manuel
   - IP : 192.168.1.12
   - Masque : 255.255.255.0
   - Passerelle : 192.168.1.1

2. **Testez avec une vraie commande**
   - http://localhost:3000/click-and-collect
   - Passez une commande
   - Le ticket s'imprime automatiquement

3. **Gardez du papier de rechange !**

---

## 📞 Besoin d'aide ?

Consultez le guide complet : `docs/GUIDE-IMPRIMANTE-EPSON-WIFI.md`

