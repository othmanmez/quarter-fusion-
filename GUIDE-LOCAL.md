# 🚀 Guide de Démarrage Local - Quarter Fusion

## ✅ Configuration Terminée !

Votre site Quarter Fusion est maintenant configuré et prêt à l'emploi en local.

---

## 📋 Récapitulatif de la Configuration

### ✅ Ce qui a été fait :

1. **Dépendances installées** : Toutes les bibliothèques nécessaires sont installées
2. **Base de données MongoDB** : Connectée et initialisée
3. **Compte administrateur créé** :
   - Email : `quarterfusion@gmail.com`
   - Mot de passe : `admin123`
4. **Données de test** :
   - 7 catégories créées (Burgers, Tacos, Sandwichs, etc.)
   - 22 plats ajoutés au menu
   - 7 villes de livraison configurées
5. **Email configuré** : Gmail SMTP prêt à envoyer les confirmations
6. **Serveur lancé** : http://localhost:3000

---

## 🌐 Démarrer le Site

### Démarrer le serveur de développement :

```bash
npm run dev
```

Le site sera accessible sur : **http://localhost:3000**

---

## 🎯 Accès aux Interfaces

### **Page d'accueil client** :
```
http://localhost:3000
```

### **Interface admin** :
```
http://localhost:3000/admin
```

**Identifiants admin** :
- Email : `quarterfusion@gmail.com`
- Mot de passe : `admin123`

### **Pages principales** :
- Click & Collect : http://localhost:3000/click-and-collect
- Livraison : http://localhost:3000/livraison
- Commander : http://localhost:3000/commander

---

## ⚙️ Configuration de l'environnement

Le fichier `.env.local` a été créé avec :

### **Base de données** :
- MongoDB Atlas connecté et fonctionnel

### **Email** :
- Gmail SMTP configuré avec : quarterfusion@gmail.com
- Les clients recevront des emails de confirmation automatiques

### **Imprimante** (optionnel) :
- Actuellement désactivée (`AUTO_PRINT_ENABLED=false`)
- IP configurée : `192.168.1.12:9100`
- Service tablette : `http://192.168.1.33:9000`

---

## 🛠️ Commandes Utiles

### Développement :
```bash
# Lancer le serveur de développement
npm run dev

# Build de production
npm run build

# Lancer en production
npm start
```

### Base de données :
```bash
# Mettre à jour le schéma Prisma
npx dotenv -e .env.local -- npx prisma db push

# Ouvrir l'interface Prisma Studio
npx dotenv -e .env.local -- npx prisma studio

# Réinitialiser les données de test
npx dotenv -e .env.local -- npm run seed:prisma
npx dotenv -e .env.local -- npm run seed:cities
```

### Administration :
```bash
# Créer/mettre à jour le compte admin
node scripts/update-admin.js
```

---

## 📱 Fonctionnalités Disponibles

### **Pour les clients** :
- ✅ Parcourir le menu par catégories
- ✅ Ajouter des articles au panier
- ✅ Choisir Click & Collect ou Livraison
- ✅ Sélectionner une ville de livraison
- ✅ Passer commande
- ✅ Recevoir un email de confirmation

### **Pour l'admin** :
- ✅ Dashboard avec statistiques
- ✅ Gestion des commandes (statuts, filtres, recherche)
- ✅ Gestion du menu (ajout, modification, suppression)
- ✅ Gestion des catégories
- ✅ Gestion des villes de livraison
- ✅ Personnalisations des plats
- ✅ Paramètres globaux
- ✅ Notification sonore pour nouvelles commandes

---

## 🎨 Personnaliser le Site

### **Modifier le menu** :
1. Connectez-vous à `/admin`
2. Allez dans "Menu"
3. Ajoutez/modifiez/supprimez des plats

### **Ajouter des villes de livraison** :
1. Allez dans `/admin/delivery-cities`
2. Cliquez sur "Ajouter une ville"
3. Configurez les frais de livraison

### **Personnaliser les plats** :
1. Allez dans `/admin/menu`
2. Cliquez sur "Gérer" pour un plat
3. Ajoutez des personnalisations (sauces, suppléments, etc.)

---

## 🔧 Résolution de Problèmes

### **Le serveur ne démarre pas** :
```bash
# Vérifiez que le port 3000 n'est pas utilisé
npx kill-port 3000
# Relancez
npm run dev
```

### **Erreur de connexion MongoDB** :
- Vérifiez que votre URL MongoDB dans `.env.local` est correcte
- Vérifiez que votre IP est dans la whitelist MongoDB Atlas

### **Les emails ne s'envoient pas** :
- Vérifiez `EMAIL_USER` et `EMAIL_PASS` dans `.env.local`
- Assurez-vous d'utiliser un mot de passe d'application Gmail (pas votre mot de passe normal)

### **Erreur Prisma** :
```bash
# Régénérer le client Prisma
npx prisma generate
```

---

## 🚀 Déploiement en Production

Quand vous serez prêt à déployer :

1. **Netlify** (recommandé) :
   - Consultez `GUIDE-DEMARRAGE.md`
   - Configurez les variables d'environnement
   - Connectez votre domaine

2. **Vercel** :
   - Push sur GitHub
   - Import dans Vercel
   - Configurez les variables d'environnement

---

## 📚 Documentation Complète

Pour plus de détails, consultez :

- **README.md** : Documentation complète du projet
- **GUIDE-TERMUX-TABLETTE.md** : Configuration pour tablette
- **CONFIG-DOMAINE-PERSONNALISE.md** : Configuration domaine personnalisé
- **docs/** : Guides détaillés pour chaque fonctionnalité

---

## 🎉 Votre Site est Prêt !

Votre site Quarter Fusion est maintenant 100% fonctionnel en local !

**Prochaines étapes** :
1. Tester toutes les fonctionnalités
2. Personnaliser le menu avec vos propres plats
3. Ajouter des images aux plats (via Cloudinary)
4. Configurer l'imprimante (optionnel)
5. Déployer en production quand vous êtes prêt

**Bon courage et bon appétit ! 🍔**
