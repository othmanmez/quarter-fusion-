# 🖨️ Guide : Configuration imprimante Epson WiFi

## ✅ Configuration pour votre imprimante Epson WiFi

Votre système est déjà prêt à fonctionner avec une imprimante Epson !

---

## 📋 Étape 1 : Trouver l'adresse IP de votre imprimante

### **Méthode 1 : Via l'imprimante (Recommandée)**

1. **Sur l'imprimante Epson** :
   - Appuyez sur le bouton **Menu** ou **Setup**
   - Allez dans **Paramètres réseau** ou **Network Settings**
   - Cherchez **Statut réseau** ou **Network Status**
   - Notez l'**adresse IP** affichée (ex: `192.168.1.100`)

### **Méthode 2 : Imprimer la page de configuration réseau**

1. Sur l'imprimante, maintenez appuyé le bouton **Papier/Alimentation**
2. L'imprimante imprime une page avec toutes les infos réseau
3. Cherchez la ligne **"IP Address"** ou **"Adresse IP"**
4. Notez l'adresse (ex: `192.168.1.100`)

### **Méthode 3 : Via le routeur**

1. Connectez-vous à votre routeur (souvent `192.168.1.1` ou `192.168.0.1`)
2. Allez dans **Périphériques connectés** ou **Liste des appareils**
3. Cherchez votre imprimante Epson
4. Notez son adresse IP

---

## 📋 Étape 2 : Configuration du fichier .env

Dans votre fichier `.env` à la racine du projet, ajoutez ces lignes :

```env
# ========================================
# CONFIGURATION IMPRIMANTE EPSON WIFI
# ========================================

# Activer l'impression automatique des tickets
AUTO_PRINT_ENABLED=true

# Adresse IP de votre imprimante Epson WiFi
# Format : tcp://ADRESSE_IP:9100
# Le port 9100 est le port standard pour les imprimantes Epson
PRINTER_INTERFACE=tcp://192.168.1.100:9100

# Type d'imprimante (ne pas changer)
PRINTER_TYPE=EPSON

# Largeur du ticket (en caractères)
# 48 pour imprimante 80mm (standard)
# 32 pour imprimante 58mm (petite)
PRINTER_WIDTH=48
```

**⚠️ IMPORTANT** : Remplacez `192.168.1.100` par l'adresse IP réelle de VOTRE imprimante !

---

## 📋 Étape 3 : Installer les dépendances

Dans votre terminal, exécutez :

```bash
npm install node-thermal-printer
```

---

## 📋 Étape 4 : Redémarrer le serveur

```bash
# Arrêtez le serveur (Ctrl+C)
# Puis relancez
npm run dev
```

---

## 🧪 Étape 5 : Tester l'imprimante

### **Via l'interface admin :**

1. **Connectez-vous** à l'admin : `/admin/dashboard`

2. **Allez dans Paramètres** : `/admin/settings`

3. Vous verrez une section **"Test d'imprimante"** 🖨️

4. **Cliquez sur** "Vérifier le statut" pour voir si l'imprimante est connectée

5. **Cliquez sur** "Imprimer un test" pour imprimer un ticket de test

### **Ce qui doit s'afficher si ça marche :**

```
✅ Statut de l'imprimante:
   - Activée: ✅ Oui
   - Connectée: ✅ Oui
   - Interface: tcp://192.168.1.100:9100
```

### **Si vous voyez des erreurs :**

```
❌ Impossible de se connecter à l'imprimante
```

→ Vérifiez l'adresse IP
→ Vérifiez que l'imprimante est allumée
→ Vérifiez qu'elle est sur le même réseau WiFi

---

## 🎯 Étape 6 : Tester avec une vraie commande

1. **Allez sur** `/click-and-collect` ou `/livraison`
2. **Passez une commande de test**
3. **Validez la commande**
4. **Le ticket doit s'imprimer automatiquement !** 🎉

---

## 📄 Format du ticket imprimé

Voici à quoi ressemble le ticket :

```
================================================
           QUARTER FUSION
        6 passage de l'aurore
              95800 Cergy
           Tel: 01 30 17 31 78

================================================

          ** CLICK & COLLECT **

             Commande N°
            QF-1234567890

Date:                              19/11/2024
Heure:                                  14:30

================================================

CLIENT:
Jean Dupont
Tel: 06 12 34 56 78

------------------------------------------------

ARTICLES:

1x Burger Quarter Crousty         8,50€
  + Sauce: BBQ
  + Boisson: Coca-Cola          +1,50€

2x Tacos Mixte                   17,00€
  + Sauce: Blanche

------------------------------------------------

                          TOTAL: 27,00€

------------------------------------------------
Paiement:                             ESPECES

------------------------------------------------
NOTES:
Bien cuit s'il vous plaît

================================================

       Merci de votre commande !
      A bientot chez Quarter Fusion


[Coupe du papier]
```

---

## ⚙️ Configuration avancée

### **Changer le port si nécessaire :**

Si le port 9100 ne fonctionne pas, essayez :
- Port 9100 (standard Epson)
- Port 515 (LPD)
- Port 631 (IPP)

Dans le `.env` :
```env
PRINTER_INTERFACE=tcp://192.168.1.100:515
```

### **Pour imprimante 58mm (petite) :**

```env
PRINTER_WIDTH=32
```

---

## 🔧 Résolution de problèmes

### ❌ **"Erreur de connexion à l'imprimante"**

**Causes possibles :**
1. Adresse IP incorrecte
2. Imprimante éteinte
3. Imprimante sur un autre réseau WiFi
4. Pare-feu qui bloque

**Solutions :**

1. **Vérifiez l'adresse IP :**
   ```bash
   # Sur Windows (CMD)
   ping 192.168.1.100
   
   # Si ça répond : l'imprimante est accessible
   # Si timeout : adresse incorrecte ou imprimante éteinte
   ```

2. **Vérifiez que l'imprimante est allumée**

3. **Vérifiez le réseau WiFi :**
   - L'imprimante et le serveur doivent être sur le **même réseau**
   - Pas de réseau invité/guest

4. **Désactivez temporairement le pare-feu** pour tester

---

### ❌ **"L'imprimante imprime mais le texte est bizarre"**

**Solution :** Vérifiez le type d'imprimante dans `.env` :
```env
PRINTER_TYPE=EPSON
```

---

### ❌ **"Le ticket ne se coupe pas automatiquement"**

**Solution :** Vérifiez que votre imprimante Epson supporte la coupe automatique.

Si non, le papier dépassera et vous devrez le couper manuellement.

---

### ❌ **"Rien ne s'imprime"**

**Checklist :**
- [ ] Imprimante allumée ✅
- [ ] Papier présent ✅
- [ ] Adresse IP correcte ✅
- [ ] `AUTO_PRINT_ENABLED=true` dans `.env` ✅
- [ ] Serveur redémarré après modification `.env` ✅
- [ ] Même réseau WiFi ✅
- [ ] Ping réussi vers l'imprimante ✅

---

## 🎨 Personnalisation du ticket

### **Modifier le texte du ticket :**

Éditez le fichier `lib/printer.ts` :

```typescript
// Ligne 64-66 : Nom et adresse du restaurant
printer.println('QUARTER FUSION');
printer.println('6 passage de l\'aurore');
printer.println('95800 Cergy');
```

### **Modifier le message de fin :**

```typescript
// Ligne ~180-182
printer.println('Merci de votre commande !');
printer.println('A bientot chez Quarter Fusion');
```

---

## 🔄 Impression manuelle depuis l'admin

Si vous voulez réimprimer un ticket depuis l'interface admin :

1. Allez dans `/admin/orders`
2. Cliquez sur une commande
3. **Bientôt disponible** : Bouton "Réimprimer le ticket"

---

## 📊 Modèles d'imprimantes Epson compatibles

Votre configuration fonctionne avec :

### **Imprimantes Epson testées :**
- ✅ Epson TM-T20II
- ✅ Epson TM-T20III
- ✅ Epson TM-T82II
- ✅ Epson TM-T88V
- ✅ Epson TM-T88VI
- ✅ Epson TM-m30
- ✅ Epson TM-m30II

### **La plupart des imprimantes Epson TM (Thermal) fonctionnent !**

---

## 🌐 Configuration IP statique (Recommandé)

Pour éviter que l'adresse IP change :

### **Sur l'imprimante :**

1. Menu → Paramètres réseau
2. Configuration IP → **Manuel**
3. Définir :
   - IP : `192.168.1.100`
   - Masque : `255.255.255.0`
   - Passerelle : `192.168.1.1`

### **Ou sur le routeur :**

1. Connectez-vous au routeur
2. DHCP → Réservation d'adresse
3. Sélectionnez l'imprimante Epson
4. Réservez l'IP `192.168.1.100`

---

## 📱 Application Epson (optionnelle)

Téléchargez **"Epson TM Utility"** (gratuit) :
- Sur ordinateur pour configurer l'imprimante
- Tester la connexion réseau
- Mettre à jour le firmware

---

## ✅ Checklist de configuration finale

- [ ] Adresse IP de l'imprimante trouvée
- [ ] Fichier `.env` configuré avec la bonne IP
- [ ] `AUTO_PRINT_ENABLED=true`
- [ ] Dépendances installées (`npm install node-thermal-printer`)
- [ ] Serveur redémarré
- [ ] Test d'impression réussi depuis `/admin/settings`
- [ ] Ticket imprimé lors d'une commande de test
- [ ] Papier thermique de rechange disponible
- [ ] IP statique configurée (recommandé)

---

## 🎉 C'est terminé !

Votre imprimante Epson WiFi est maintenant configurée !

**Chaque fois qu'une commande arrive :**
1. 🔊 Son de notification
2. 📱 Badge de notification
3. 🖨️ **Ticket imprimé automatiquement**
4. ✉️ Emails envoyés

---

## 🆘 Support

### **Problème persistant ?**

1. Vérifiez les logs du serveur :
   ```bash
   # Dans le terminal où tourne npm run dev
   # Cherchez les messages d'erreur
   ```

2. Testez la connexion :
   ```bash
   ping 192.168.1.100
   ```

3. Vérifiez le pare-feu Windows

4. Redémarrez l'imprimante et le serveur

---

## 📞 Informations techniques

### **Configuration actuelle :**
```javascript
Type: EPSON (ThermalPrinter)
Interface: TCP/IP WiFi
Port: 9100 (standard ESC/POS)
Protocole: ESC/POS
Encodage: FRANCE
Largeur: 48 caractères (80mm) ou 32 (58mm)
```

### **Commandes ESC/POS supportées :**
- Texte normal / gras
- Taille double largeur / hauteur
- Alignement (gauche / centre / droite)
- Coupe automatique du papier
- Séparateurs et lignes
- QR codes (optionnel)

---

**Date de création :** Novembre 2024  
**Version :** 1.0  
**Testé avec :** Epson TM-T20II, TM-T88V

