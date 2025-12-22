# 🖨️ Guide d'Impression Automatique - Production

## ⚡ Ce qu'il faut savoir

**PROBLÈME** : Quand votre site est sur Netlify, il ne peut PAS imprimer directement sur votre imprimante locale.

**SOLUTION** : Un petit service tourne sur votre tablette 24/7 qui imprime automatiquement quand une commande arrive.

---

## 🎯 Comment ça Marche

```
Client passe commande sur le site
         ↓
    Site sur Netlify
         ↓
Envoie vers service sur tablette
         ↓
Tablette imprime automatiquement
         ↓
    ✅ TICKET IMPRIMÉ !
```

**AUCUNE ACTION REQUISE DU PATRON** - Tout est automatique !

---

## 📱 Installation sur la Tablette (UNE SEULE FOIS)

### Étape 1 : Installer Termux

1. Téléchargez **Termux** depuis le Play Store
2. Ouvrez Termux

### Étape 2 : Installer Node.js

```bash
pkg update
pkg install nodejs
```

### Étape 3 : Créer le dossier du projet

```bash
# Aller dans le stockage partagé
cd ~/storage/shared

# Créer le dossier
mkdir quarter-fusion-printer
cd quarter-fusion-printer
```

### Étape 4 : Copier le fichier service

1. **Sur votre PC**, ouvrez le fichier : `printer-service-tablet.js`
2. Copiez tout le contenu
3. **Sur la tablette**, dans Termux :

```bash
# Créer le fichier
nano printer-service-tablet.js
```

4. Collez le contenu (appui long → Coller)
5. Appuyez sur `Ctrl+X`, puis `Y`, puis `Entrée` pour sauvegarder

### Étape 5 : Modifier l'IP de l'imprimante

Dans le fichier, changez cette ligne :

```javascript
const PRINTER_IP = '192.168.1.12';  // ← Mettez l'IP de VOTRE imprimante
```

### Étape 6 : Installer les dépendances

```bash
npm init -y
npm install express node-thermal-printer
```

---

## 🚀 Démarrer le Service (À FAIRE CHAQUE MATIN)

### Sur la tablette, dans Termux :

```bash
cd ~/storage/shared/quarter-fusion-printer
node printer-service-tablet.js
```

Vous verrez :

```
╔═══════════════════════════════════════════════════════════╗
║     SERVICE D'IMPRESSION QUARTER FUSION - TABLETTE        ║
╚═══════════════════════════════════════════════════════════╝

✅ Service démarré sur le port 9000
🖨️  Imprimante: 192.168.1.12:9100
```

**⚠️ IMPORTANT : Laissez cette fenêtre OUVERTE toute la journée !**

---

## 📡 Trouver l'IP de votre Tablette

### Sur la tablette, dans Termux :

```bash
ip route get 1.1.1.1 | awk '{print $7}'
```

Exemple de résultat : `192.168.1.33`

**Notez cette IP, vous en aurez besoin pour Netlify !**

---

## 🌐 Configuration sur Netlify

### Variables d'environnement à ajouter :

Allez sur Netlify → Site settings → Environment variables

Ajoutez ces variables :

```env
# Activer l'impression automatique
AUTO_PRINT_ENABLED=true

# Activer l'impression à distance
REMOTE_PRINT_ENABLED=true

# URL du service sur la tablette (REMPLACEZ PAR VOTRE IP !)
PRINTER_PUBLIC_URL=http://192.168.1.33:9000

# Token de sécurité (générez-en un aléatoire)
PRINTER_AUTH_TOKEN=votre-token-secret-ici-123456789

# Les autres variables restent identiques
DATABASE_URL=mongodb+srv://...
NEXTAUTH_URL=https://votre-domaine.com
NEXTAUTH_SECRET=...
EMAIL_USER=...
EMAIL_PASS=...
```

### Comment générer un token secret :

Sur votre PC, ouvrez une console et tapez :

```bash
node scripts/generate-secret.js
```

Copiez le résultat dans `PRINTER_AUTH_TOKEN`

---

## ✅ Test de l'Impression

### Test depuis la tablette locale :

```bash
# Dans Termux (pendant que le service tourne)
curl http://localhost:9000/status
```

Vous devriez voir :

```json
{
  "status": "online",
  "printer": {
    "ip": "192.168.1.12",
    "port": 9100
  }
}
```

### Test d'impression :

```bash
curl -X POST http://localhost:9000/test
```

→ Un ticket de test devrait s'imprimer !

---

## 🔄 Workflow Complet

### **MATIN** (quand le restaurant ouvre) :

1. Allumez l'imprimante
2. Allumez la tablette
3. Ouvrez Termux sur la tablette
4. Lancez le service :
   ```bash
   cd ~/storage/shared/quarter-fusion-printer
   node printer-service-tablet.js
   ```
5. **Laissez la tablette allumée et Termux ouvert toute la journée**

### **PENDANT LE SERVICE** (automatique) :

1. Client passe commande sur le site
2. ✅ **Ticket s'imprime AUTOMATIQUEMENT**
3. Le patron n'a RIEN à faire !

### **SOIR** (quand le restaurant ferme) :

1. Dans Termux, appuyez sur `Ctrl+C` pour arrêter le service
2. Éteignez la tablette
3. Éteignez l'imprimante

---

## 🆘 Dépannage

### ❌ "Impossible de se connecter à l'imprimante"

**Solutions** :
1. Vérifiez que l'imprimante est allumée
2. Vérifiez l'IP de l'imprimante dans le fichier
3. Faites un ping : `ping 192.168.1.12`

### ❌ "Le site n'imprime pas en production"

**Vérifiez** :
1. Le service tourne sur la tablette (Termux ouvert)
2. L'IP dans `PRINTER_PUBLIC_URL` est correcte
3. La tablette et l'imprimante sont sur le même réseau WiFi
4. Les variables sont bien configurées sur Netlify

### ❌ "Connection refused"

**Problème** : La tablette n'est pas accessible depuis Internet

**Solution** : Utilisez l'impression manuelle depuis l'admin :
- Allez sur `/admin/orders`
- Cliquez sur le bouton "Imprimer" de chaque commande

---

## 💡 Option Alternative : Impression Manuelle

Si vous ne voulez pas laisser la tablette allumée :

1. Désactivez `AUTO_PRINT_ENABLED=false` sur Netlify
2. Le patron ouvre l'admin sur la tablette : `/admin/orders`
3. Il clique sur "Imprimer" pour chaque commande
4. Le ticket s'imprime directement (la tablette est sur le même réseau que l'imprimante)

---

## 📝 Résumé Simple

| Quoi | Où | Quand |
|------|-----|-------|
| Service d'impression | Tablette (Termux) | Démarrer le matin |
| Configuration | Netlify (variables) | Une seule fois |
| Imprimante | WiFi local | Allumée tout le temps |
| Impression | Automatique | Dès qu'une commande arrive |

---

## ✅ Checklist Finale

- [ ] Termux installé sur la tablette
- [ ] Node.js installé dans Termux
- [ ] Fichier `printer-service-tablet.js` copié
- [ ] IP de l'imprimante configurée dans le fichier
- [ ] Dépendances installées (`npm install`)
- [ ] IP de la tablette notée
- [ ] Variables configurées sur Netlify
- [ ] Service testé localement
- [ ] Test d'impression réussi
- [ ] Commande test passée sur le site

---

**🎉 Une fois tout configuré, l'impression est 100% AUTOMATIQUE !**

Le patron n'a qu'à :
1. Allumer la tablette le matin
2. Lancer le service dans Termux
3. Laisser la tablette allumée

**Chaque commande s'imprime automatiquement sans aucune action ! ✅**
