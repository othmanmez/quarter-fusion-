# 🔴 Guide - Fermer le Restaurant

## ✅ Ce qui a été ajouté

Un système pour **fermer les commandes en ligne** avec un beau message animé pour les clients.

---

## 🎯 Comment ça marche

### **Pour fermer le restaurant :**

1. Allez dans l'admin : `/admin/settings`

2. En haut de la page, vous verrez un **gros interrupteur** :
   - 🟢 **VERT** = Restaurant OUVERT (les clients peuvent commander)
   - 🔴 **ROUGE** = Restaurant FERMÉ (les clients voient un message de fermeture)

3. Cliquez sur l'interrupteur pour fermer

4. **IMMÉDIATEMENT** :
   - Les pages Click & Collect et Livraison affichent un message de fermeture
   - Les clients ne peuvent plus commander
   - Le message est animé et joli

---

## 📱 Ce que voient les clients quand c'est fermé

Quand un client va sur `/click-and-collect` ou `/livraison` :

### ✅ Message affiché :

```
╔═══════════════════════════════════════════╗
║                                           ║
║            🕐 (horloge animée)            ║
║                                           ║
║         Nous sommes FERMÉS                ║
║                                           ║
║       Revenez demain ! 🌙                 ║
║                                           ║
║   Nous serons ravis de vous servir       ║
║   lors de nos prochaines ouvertures      ║
║                                           ║
║   📅 Horaires : Lundi - Dimanche          ║
║        18:00 - 01:00                      ║
║                                           ║
║   [Retour à l'accueil] [Nous contacter]  ║
║                                           ║
╚═══════════════════════════════════════════╝
```

### 🎨 Animations :

- Horloge qui balance
- Cercles flottants en arrière-plan
- Texte "FERMÉS" qui rebondit
- Fond dégradé rouge/orange
- Transitions fluides

---

## 🔄 Utilisation Quotidienne

### **FERMER LE SOIR** (5 secondes) :

1. Allez sur `/admin/settings`
2. Cliquez sur l'interrupteur vert 🟢
3. Il devient rouge 🔴
4. ✅ Les clients voient le message de fermeture

### **OUVRIR LE MATIN** (5 secondes) :

1. Allez sur `/admin/settings`
2. Cliquez sur l'interrupteur rouge 🔴
3. Il devient vert 🟢
4. ✅ Les clients peuvent commander à nouveau

---

## ⚡ Avantages

### **Pour le patron :**
- ✅ **1 clic** pour fermer/ouvrir
- ✅ **Instantané** - effet immédiat
- ✅ **Visible** - gros interrupteur, impossible à rater
- ✅ **Sécurisé** - seul l'admin peut le changer

### **Pour les clients :**
- ✅ Message clair et joli
- ✅ Horaires affichés
- ✅ Boutons pour contacter ou revenir à l'accueil
- ✅ Design professionnel et moderne

---

## 🎬 Démo

### État OUVERT (🟢) :
```
Admin → Settings
┌────────────────────────────────────┐
│ 🟢 Restaurant OUVERT               │
│ ✅ Les clients peuvent commander   │
│                        [    ●]     │ ← Interrupteur vert
└────────────────────────────────────┘
```

### État FERMÉ (🔴) :
```
Admin → Settings
┌────────────────────────────────────┐
│ 🔴 Restaurant FERMÉ                │
│ ⛔ Message de fermeture affiché    │
│ [●    ]                            │ ← Interrupteur rouge
└────────────────────────────────────┘
```

---

## 📋 Checklist

- [x] Composant de fermeture avec animations créé
- [x] Page Click & Collect vérifie si ouvert
- [x] Page Livraison vérifie si ouvert
- [x] Interrupteur dans l'admin
- [x] API settings mise à jour
- [x] Message personnalisé avec horaires
- [x] Boutons de navigation dans le message
- [x] Réseaux sociaux dans le message

---

## 🛠️ Technique

### **Fichiers modifiés :**

1. `components/ClosedMessage.tsx` - Composant du message de fermeture
2. `app/click-and-collect/page.tsx` - Vérifie si ouvert avant d'afficher
3. `app/livraison/page.tsx` - Vérifie si ouvert avant d'afficher
4. `app/admin/settings/page.tsx` - Interrupteur ajouté
5. `app/api/settings/route.ts` - Support du paramètre `restaurantOpen`

### **Fonctionnement :**

1. L'admin clique sur l'interrupteur
2. Appel API PUT `/api/settings` avec `restaurantOpen: true/false`
3. Sauvegarde dans MongoDB (collection `Settings`)
4. Les pages client font un GET `/api/settings`
5. Si `restaurantOpen = false` → Affiche `<ClosedMessage />`
6. Si `restaurantOpen = true` → Affiche le menu normalement

---

## 💡 Astuces

### **Fermeture Automatique ?**

Actuellement, c'est **manuel** (1 clic).

Si vous voulez une fermeture **automatique** (ex: tous les soirs à 01h00) :
- Il faudrait ajouter un cron job
- Ou un système d'horaires automatiques
- **Dites-moi si vous voulez ça !**

### **Personnaliser le Message ?**

Le message est dans `components/ClosedMessage.tsx`.

Vous pouvez modifier :
- Le texte
- Les couleurs
- Les animations
- Les horaires affichés

---

## ✅ Résumé

**Fonctionnalité ajoutée :** Système de fermeture des commandes

**Utilisation :** 1 clic dans `/admin/settings`

**Effet :** Les clients voient un beau message animé au lieu du menu

**Temps requis :** 5 secondes pour fermer/ouvrir

**Parfait pour :** Fermer le soir, ouvrir le matin, ou fermer temporairement (ex: jour férié)

🎉 **C'est prêt et 100% fonctionnel !**
