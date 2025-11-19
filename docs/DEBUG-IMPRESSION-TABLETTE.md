# 🔧 Dépannage : Impression depuis Tablette

## ❌ Problème : "Vérifiez que le serveur est démarré"

### **Vérifications Étape par Étape**

#### **1. Vérifier que Termux est Démarré**

Dans Termux, vous devez voir :
```
🖨️  Service d'impression Quarter Fusion (Tablette)
📡 Écoute sur port 9000
✅ Prêt à imprimer !

🎯 Service démarré sur port 9000
📱 Impression depuis la tablette activée !
```

**Si vous ne voyez pas ça :**
```bash
cd ~/storage/shared/quarter-fusion
node printer-service-tablet.js
```

---

#### **2. Vérifier l'IP de la Tablette**

Dans Termux (nouvelle session) :
```bash
ip route get 1.1.1.1 | awk '{print $7}'
```

**Vous devez voir** : `192.168.1.33`

**Si l'IP est différente**, modifiez dans `app/admin/orders/page.tsx` :
```typescript
const printerServiceUrl = 'http://VOTRE_IP:9000';
```

---

#### **3. Tester la Connexion**

Dans Termux :
```bash
# Testez si le service répond
curl http://localhost:9000/status
```

**Vous devez voir** :
```json
{"status":"online","message":"Service opérationnel"}
```

**Si ça ne marche pas**, le service n'est pas démarré.

---

#### **4. Vérifier le Réseau WiFi**

**Sur votre tablette :**
1. Paramètres → Wi-Fi
2. Vérifiez que vous êtes connecté au même réseau que l'imprimante
3. L'IP doit être `192.168.1.XXX` (même sous-réseau)

---

#### **5. Tester depuis le Navigateur**

**Sur votre tablette**, ouvrez Chrome et allez sur :
```
http://192.168.1.33:9000/status
```

**Vous devez voir** :
```json
{"status":"online","message":"Service opérationnel"}
```

**Si vous voyez "Impossible d'accéder au site"** :
- Le service n'est pas démarré
- OU le pare-feu Android bloque le port 9000

---

#### **6. Vérifier le Pare-feu Android**

**Si le test ci-dessus ne fonctionne pas :**

1. **Paramètres Android** → Applications → Termux
2. **Permissions** → Vérifiez que "Réseau" est activé
3. **Batterie** → Désactivez l'optimisation pour Termux

---

#### **7. Vérifier les Logs**

**Dans Termux**, quand vous cliquez sur "Imprimer", vous devez voir :
```
🖨️  Impression commande #1234...
✅ Commande #1234 imprimée !
```

**Si vous ne voyez rien**, la requête n'arrive pas au service.

---

## ✅ Solutions Courantes

### **Problème : Le service se ferme tout seul**

**Solution :**
```bash
# Désactivez l'optimisation de batterie pour Termux
# Paramètres → Applications → Termux → Batterie → Désactiver l'optimisation
```

---

### **Problème : "Failed to fetch"**

**Causes possibles :**
1. Service non démarré
2. Mauvaise IP
3. Pare-feu Android
4. Pas sur le même réseau WiFi

**Solutions :**
1. Redémarrez le service dans Termux
2. Vérifiez l'IP : `ip route get 1.1.1.1 | awk '{print $7}'`
3. Testez : `curl http://localhost:9000/status`
4. Vérifiez le WiFi

---

### **Problème : "Timeout"**

**Causes possibles :**
1. L'imprimante ne répond pas
2. Problème réseau entre tablette et imprimante
3. Service Termux trop lent

**Solutions :**
1. Vérifiez que l'imprimante est allumée
2. Testez : `ping 192.168.1.12` (IP imprimante)
3. Augmentez le timeout dans le code (déjà à 10 secondes)

---

### **Problème : Le ticket ne sort pas**

**Vérifiez :**
1. L'imprimante est allumée
2. L'imprimante est sur le WiFi
3. L'IP de l'imprimante est correcte : `192.168.1.12`
4. Testez : `ping 192.168.1.12`

---

## 🎯 Checklist Complète

- [ ] Termux est ouvert
- [ ] Service démarré : `node printer-service-tablet.js`
- [ ] Message "✅ Prêt à imprimer !" visible
- [ ] IP tablette vérifiée : `192.168.1.33`
- [ ] Test local : `curl http://localhost:9000/status` → OK
- [ ] Test navigateur : `http://192.168.1.33:9000/status` → OK
- [ ] Même réseau WiFi que l'imprimante
- [ ] Imprimante allumée et connectée
- [ ] Test ping : `ping 192.168.1.12` → OK

---

## 💡 Astuce : Widget Termux

**Pour démarrer facilement le service :**

1. Créez un raccourci :
```bash
mkdir -p ~/.shortcuts
cat > ~/.shortcuts/start-printer.sh << 'EOF'
#!/data/data/com.termux/files/usr/bin/bash
cd ~/storage/shared/quarter-fusion
node printer-service-tablet.js
EOF
chmod +x ~/.shortcuts/start-printer.sh
```

2. Ajoutez le widget sur l'écran d'accueil
3. Tapez dessus pour démarrer ! 🚀

---

## 🆘 Toujours Pas Résolu ?

**Vérifiez les logs dans Termux** quand vous cliquez sur "Imprimer".

**Si vous voyez une erreur**, envoyez-moi :
1. Le message d'erreur exact
2. Les logs Termux
3. Le résultat de `curl http://localhost:9000/status`

