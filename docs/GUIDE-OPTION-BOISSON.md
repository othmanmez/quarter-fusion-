# 🥤 Guide de l'option Boisson

## Présentation

L'option Boisson permet aux clients d'ajouter une boisson de leur choix à leur commande pour un prix fixe supplémentaire (par défaut 1,50€).

C'est une fonctionnalité de **formule** qui permet de proposer "Menu + Boisson" à un prix avantageux.

---

## 📋 Comment activer l'option Boisson ?

### Pour l'administrateur :

1. **Connectez-vous à l'interface admin** : `/admin/login`

2. **Allez dans Menus** : `/admin/menu`

3. **Cliquez sur "✏️ Modifier"** pour le menu concerné

4. **Dans le formulaire d'édition** :
   - Faites défiler jusqu'à la section **"Option Formule + Boisson"** 🥤
   - **Cochez la case** "Activer l'option boisson"
   - **Définissez le prix** (par défaut 1,50€)
   - Cliquez sur **"Enregistrer les modifications"**

---

## 🎯 Comment ça marche pour le client ?

### Expérience client :

1. Le client **sélectionne un menu** avec l'option boisson activée

2. Une **fenêtre de personnalisation** s'ouvre

3. Le client voit une **section spéciale** avec :
   - Un encadré bleu "🥤 Ajoutez une boisson"
   - Le texte : "Complétez votre menu avec une boisson pour seulement +1,50€"
   - Une case à cocher : "Oui, j'ajoute une boisson"

4. Si le client **coche la case** :
   - Un menu déroulant apparaît avec **toutes les boissons disponibles**
   - Le client **choisit sa boisson** préférée
   - Le prix de **+1,50€ s'ajoute automatiquement** au total

5. Le client **valide** et ajoute au panier

---

## 💰 Fonctionnement du prix

### Prix fixe avantageux :

- **Prix normal d'une boisson** : Entre 2€ et 4€ (selon la boisson)
- **Prix avec l'option formule** : 1,50€ (configurable)

**Exemple :**
- Burger Quarter Crousty : 8,50€
- Coca-Cola normal : 2,50€
- **Total sans formule** : 11,00€

**Avec la formule :**
- Burger Quarter Crousty : 8,50€
- + Option Boisson : 1,50€
- **Total avec formule** : 10,00€
- **Économie client** : 1,00€ !

---

## ⚙️ Configuration avancée

### Personnalisation du prix :

L'admin peut définir un prix différent pour chaque menu :
- **1,50€** pour les burgers/tacos (recommandé)
- **1,00€** pour les sandwichs
- **2,00€** pour les menus XL
- etc.

### Dans le formulaire d'édition :
```
Option Formule + Boisson
┌─────────────────────────────────────┐
│ ☑ Activer l'option boisson          │
│                                      │
│ Prix de l'option boisson: [1.50] €  │
│ Ex: 1.50 pour ajouter une boisson   │
└─────────────────────────────────────┘
```

---

## 📊 Quels menus doivent avoir l'option ?

### ✅ Recommandé pour :
- **Burgers** (tous)
- **Tacos** (tous)
- **Sandwichs**
- **Paninis**
- **Menus composés**

### ❌ Non recommandé pour :
- **Frites & Accompagnements** (plat d'accompagnement)
- **Desserts** (déjà un complément)
- **Boissons** (c'est déjà une boisson)

---

## 🔍 Exemple pratique complet

### Scénario : Burger Quarter Crousty

**Configuration admin :**
```
Menu: Quarter Crousty
Prix: 8,50€
☑ Activer l'option boisson
Prix option: 1,50€
```

**Expérience client :**

1. Client clique sur "Quarter Crousty"
2. Modal s'ouvre avec :
   - Personnalisations (sauces, suppléments)
   - **Option Boisson** (encadré bleu)
3. Client coche "Oui, j'ajoute une boisson"
4. Client choisit "Coca-Cola 33cl" dans la liste
5. Prix affiché : 
   - Base : 8,50€
   - + Boisson : 1,50€
   - **Total : 10,00€**
6. Client ajoute au panier
7. Dans le panier apparaît :
   ```
   Quarter Crousty
   Personnalisations:
   - Sauce: BBQ
   - Boisson: Coca-Cola 33cl (+1,50€)
   Total: 10,00€
   ```

---

## 🛠️ Technique

### Base de données (Prisma) :

Deux nouveaux champs dans le modèle `Menu` :

```prisma
model Menu {
  // ... autres champs ...
  
  allowDrinkOption Boolean @default(false) // Activer l'option
  drinkPrice       Float   @default(1.5)   // Prix de l'option
}
```

### Fichiers modifiés :

- ✅ `prisma/schema.prisma` : Schéma de base de données
- ✅ `components/admin/EditMenuModal.tsx` : Formulaire admin
- ✅ `app/api/menu/[id]/route.ts` : API mise à jour
- ✅ `components/order/CustomizationModal.tsx` : Modal client
- ✅ `app/admin/menu/page.tsx` : Interface types

---

## 🎉 Avantages

### Pour le restaurant :
- ✅ **Augmentation du panier moyen** : Les clients ajoutent plus facilement une boisson
- ✅ **Image de formule** : Perception de valeur ajoutée
- ✅ **Simplicité** : Un seul bouton pour activer/désactiver
- ✅ **Flexibilité** : Prix configurable par menu

### Pour le client :
- ✅ **Économie** : Prix boisson réduit
- ✅ **Simplicité** : Formule tout-en-un
- ✅ **Choix** : Toutes les boissons disponibles
- ✅ **Clarté** : Prix affiché clairement

---

## 📝 FAQ

### Q: Puis-je avoir des prix différents selon les menus ?
**R:** Oui ! Chaque menu a son propre prix pour l'option boisson.

### Q: Le client peut-il choisir n'importe quelle boisson ?
**R:** Oui, toutes les boissons disponibles dans la catégorie "Boissons" sont proposées.

### Q: Le prix de la boisson change-t-il selon la boisson choisie ?
**R:** Non, le prix est fixe (ex: 1,50€) quelle que soit la boisson choisie. C'est une formule !

### Q: Comment désactiver l'option pour un menu ?
**R:** Décochez simplement la case "Activer l'option boisson" dans l'édition du menu.

### Q: L'option boisson fonctionne-t-elle avec les quantités ?
**R:** Oui ! Si le client commande 2 burgers avec boisson, il paiera 2x le prix de l'option.

### Q: Que se passe-t-il si le client coche "boisson" mais n'en sélectionne pas ?
**R:** Un message d'erreur lui demande de sélectionner une boisson.

---

## 🚀 Conseils d'utilisation

### Stratégie recommandée :

1. **Activez l'option pour TOUS vos burgers et tacos**
   - C'est là que ça marche le mieux

2. **Prix recommandé : 1,50€**
   - Assez bas pour être attractif
   - Assez haut pour rester rentable

3. **Communiquez sur la formule**
   - "Ajoutez une boisson pour seulement 1,50€"
   - "Économisez 1€ avec notre formule"

4. **Surveillez les statistiques**
   - Combien de clients prennent l'option ?
   - Ajustez le prix si nécessaire

---

**Date de création :** Novembre 2024  
**Version :** 1.0

