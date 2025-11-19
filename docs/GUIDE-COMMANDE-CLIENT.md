# 📋 Guide du processus de commande client

## ✨ Fonctionnalités implémentées

Le système de commande client est **entièrement fonctionnel** avec collecte des informations et envoi automatique d'emails de confirmation.

---

## 🎯 Processus complet de commande

### 1. **Le client choisit son mode de commande**

#### Click & Collect
- URL : `/click-and-collect`
- Retrait en restaurant
- Pas de frais supplémentaires
- Temps de préparation : 15-20 minutes

#### Livraison à domicile
- URL : `/livraison`
- Livraison dans les zones configurées
- Frais de livraison selon la ville
- Temps de livraison : 30-45 minutes

---

### 2. **Sélection des articles**

Le client :
1. Parcourt le menu par catégories
2. Clique sur un article pour le personnaliser (si activé)
3. Choisit ses options :
   - Personnalisations (sauces, suppléments, etc.)
   - Option boisson (+1,50€)
4. Définit la quantité
5. Ajoute au panier

---

### 3. **Récapitulatif du panier**

Le client voit :
- ✅ Liste de tous les articles
- ✅ Personnalisations de chaque article
- ✅ Quantités et prix unitaires
- ✅ Total du panier
- ✅ Frais de livraison (si applicable)
- ✅ **Total final**

---

### 4. **Formulaire d'informations client** ⭐

Le client **doit obligatoirement renseigner** :

#### Informations personnelles (obligatoires)
- **Prénom** ✓
- **Nom** ✓
- **Email** ✓ (pour recevoir la confirmation)
- **Téléphone** ✓ (pour être contacté)

#### Moyen de paiement
- ☐ Espèces
- ☐ Carte bancaire

#### Pour la livraison uniquement
- **Adresse complète** ✓
- **Ville** ✓ (sélection parmi les villes configurées)
- Code postal (automatique selon la ville)

#### Optionnel
- Notes spéciales (allergies, préférences, etc.)

---

### 5. **Validation et confirmation** 🎉

Quand le client clique sur **"Confirmer la commande"** :

#### a) Sauvegarde en base de données
```javascript
✓ Numéro de commande généré : QF-1234567890
✓ Informations client sauvegardées
✓ Détails de la commande enregistrés
✓ Statut initial : "À PRÉPARER"
```

#### b) Envoi automatique de 2 emails

**Email 1 : Confirmation au CLIENT**
- À : `email@client.com`
- Sujet : "Confirmation de commande - Quarter Fusion"
- Contenu :
  - ✉️ Numéro de commande
  - 📋 Récapitulatif complet des articles
  - 💰 Prix total
  - 📍 Adresse de livraison (si applicable)
  - ⏰ Temps estimé
  - 📞 Coordonnées du restaurant

**Email 2 : Notification à l'ADMIN**
- À : `admin@quarterfusion.com`
- Sujet : "Nouvelle commande reçue - Quarter Fusion"
- Contenu :
  - 🚨 Alerte nouvelle commande
  - 👤 Informations client
  - 📋 Détails de la commande
  - 💵 Montant total
  - 📍 Adresse de livraison (si applicable)

#### c) Modal de confirmation affichée

Le client voit une **belle modal de succès** avec :
- ✅ Icône de validation
- 🎫 Numéro de commande bien visible
- ✉️ Confirmation d'envoi d'email
- ⏰ Temps de préparation estimé
- 📞 Numéro de téléphone du restaurant
- 🔘 Boutons d'action

---

## 📧 Exemple d'email de confirmation client

```html
┌────────────────────────────────────────┐
│  🍔 Quarter Fusion                     │
│  Confirmation de votre commande        │
│                                        │
│  Commande #QF-1701234567890           │
└────────────────────────────────────────┘

Bonjour Jean Dupont,

Nous avons bien reçu votre commande et nous
vous en remercions !

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Informations de commande :
• Type : Click & Collect
• Temps estimé : 15-20 minutes
• Moyen de paiement : Carte bancaire
• Téléphone : 06 12 34 56 78
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Détails de votre commande :

┌────────────────────────────────────────┐
│ Article          | Qté | Prix          │
├────────────────────────────────────────┤
│ Burger Quarter   |  1  | 8,50€         │
│ ├─ Sauce: BBQ                          │
│ ├─ Boisson: Coca-Cola (+1,50€)        │
│                                        │
│ Tacos Mixte      |  2  | 17,00€        │
│ ├─ Sauce: Blanche                     │
└────────────────────────────────────────┘

Total à payer : 27,00€

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Prochaines étapes :
• Notre équipe prépare votre commande
• Rendez-vous en restaurant pour retrait
• Paiement au retrait
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Pour toute question, contactez-nous au
01 30 17 31 78

Merci de votre confiance !
L'équipe Quarter Fusion
```

---

## ⚙️ Configuration requise

### Variables d'environnement (.env)

Pour que l'envoi d'emails fonctionne, configurez :

```env
# Configuration Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=votre-email@gmail.com
EMAIL_PASS=votre-mot-de-passe-app

# Email admin pour recevoir les notifications
ADMIN_EMAIL=admin@quarterfusion.com
```

---

## 🔍 Validation des données

Le formulaire client valide automatiquement :

### Prénom & Nom
- ✓ Ne peut pas être vide
- ✓ Suppression des espaces inutiles

### Email
- ✓ Format valide requis : `user@domain.com`
- ✓ Regex : `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`

### Téléphone
- ✓ Minimum 10 caractères
- ✓ Regex : `/^[0-9\s\-\+\(\)]{10,}$/`
- ✓ Accepte : `01 23 45 67 89`, `+33 1 23 45 67 89`, etc.

### Adresse (livraison uniquement)
- ✓ Ne peut pas être vide
- ✓ Ville doit être sélectionnée parmi la liste

---

## 📊 Suivi de la commande

### Pour le client
1. **Email de confirmation** reçu immédiatement
2. **Appel téléphonique** du restaurant pour confirmation
3. **Retrait/livraison** selon le mode choisi

### Pour l'admin
1. **Email de notification** reçu immédiatement
2. **Commande visible** dans `/admin/orders`
3. **Mise à jour du statut** possible depuis l'admin

---

## 🎨 Interface utilisateur

### Modal de confirmation (après commande)

```
┌──────────────────────────────────────────┐
│           ✅ (icône verte)               │
│                                          │
│      Commande confirmée !                │
│  Votre commande a été enregistrée       │
│                                          │
│  ┌────────────────────────────────────┐ │
│  │  Commande #QF-1701234567890        │ │
│  └────────────────────────────────────┘ │
│                                          │
│  ✉️ Email de confirmation envoyé        │
│  Un email a été envoyé à                │
│  jean.dupont@email.com                  │
│                                          │
│  ⏰ Préparation en cours                 │
│  Vous serez contacté par téléphone      │
│                                          │
│  📞 Besoin d'aide ?                      │
│  Appelez-nous au 01 30 17 31 78         │
│                                          │
│  [  Retour à l'accueil  ]               │
│  [  Commander à nouveau  ]              │
│                                          │
│  💌 Consultez votre boîte mail          │
└──────────────────────────────────────────┘
```

---

## 📝 Fichiers impliqués

### Pages client
- ✅ `app/click-and-collect/page.tsx` - Page Click & Collect
- ✅ `app/livraison/page.tsx` - Page Livraison

### Composants
- ✅ `components/OrderForm.tsx` - Formulaire d'informations
- ✅ `components/order/OrderConfirmationModal.tsx` - Modal de succès
- ✅ `components/order/CustomizationModal.tsx` - Personnalisations

### API
- ✅ `app/api/orders/route.ts` - Sauvegarde commande + envoi emails

### Base de données
- ✅ `prisma/schema.prisma` - Modèle Order avec tous les champs

---

## ✅ Checklist de fonctionnement

- ✅ Formulaire collecte nom, prénom, email, téléphone
- ✅ Validation des champs obligatoires
- ✅ Sauvegarde en base de données
- ✅ Génération numéro de commande unique
- ✅ Envoi email de confirmation au client
- ✅ Envoi email de notification à l'admin
- ✅ Modal de confirmation avec toutes les infos
- ✅ Intégration des personnalisations dans l'email
- ✅ Intégration de l'option boisson dans l'email
- ✅ Gestion des erreurs et messages explicites

---

## 🚀 Pour tester

1. **Allez sur** `/click-and-collect` ou `/livraison`
2. **Ajoutez des articles** au panier
3. **Cliquez sur** "Voir le récapitulatif"
4. **Remplissez le formulaire** avec vos vraies informations
5. **Validez la commande**
6. **Vérifiez votre boîte email** 📧

---

## 💡 Conseils

### Pour un test complet :
- Utilisez votre vraie adresse email
- Vérifiez le dossier spam si vous ne recevez pas l'email
- Testez les deux modes (Click & Collect et Livraison)
- Essayez avec et sans personnalisations
- Testez l'option boisson

### En production :
- Configurez correctement les variables EMAIL_*
- Utilisez un vrai compte SMTP
- Testez l'envoi d'emails avant le lancement
- Surveillez les logs pour les erreurs d'envoi

---

**✨ Le système est 100% fonctionnel et prêt à l'emploi !**

**Date de création :** Novembre 2024  
**Version :** 1.0

