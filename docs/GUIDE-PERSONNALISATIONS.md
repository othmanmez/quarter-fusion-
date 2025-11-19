# 🎨 Guide de gestion des personnalisations

## Introduction

Le système de personnalisations permet à l'administrateur de configurer des options pour chaque menu (sauces, suppléments, tailles, etc.). Les clients pourront ensuite personnaliser leurs commandes selon les options configurées.

## ⚠️ Important

**Les boissons ne peuvent pas être personnalisées.** Le bouton de personnalisation est automatiquement désactivé pour la catégorie "Boissons".

---

## 📋 Comment accéder aux personnalisations ?

1. Connectez-vous à l'interface admin : `/admin/login`
2. Allez dans **Menus** : `/admin/menu`
3. Pour chaque menu, cliquez sur le bouton violet **🎨 Personnaliser**
4. Une fenêtre modale s'ouvre avec les options de personnalisation

---

## 🎯 Types de personnalisations

### 1. **Choix unique** (Radio button)
Le client doit choisir **UNE SEULE** option parmi celles proposées.

**Exemples :**
- **Sauce** : Ketchup, Mayonnaise, BBQ, Sauce blanche
- **Taille** : Petite, Moyenne, Grande
- **Cuisson** : Saignant, À point, Bien cuit

**Utilisation :** Quand le client doit faire un seul choix obligatoire ou facultatif.

---

### 2. **Choix multiples** (Checkboxes)
Le client peut choisir **PLUSIEURS** options en même temps.

**Exemples :**
- **Suppléments** : Fromage (+1€), Bacon (+1.50€), Œuf (+1€)
- **Ingrédients à retirer** : Sans oignons, Sans salade, Sans tomates
- **Extras** : Double viande (+3€), Extra frites (+2€)

**Utilisation :** Pour les suppléments payants ou gratuits, ou les retraits d'ingrédients.

---

### 3. **Oui/Non** (Toggle)
Le client peut activer ou désactiver une option simple.

**Exemples :**
- Sans oignons
- Extra sauce
- Pain grillé

**Utilisation :** Pour des options binaires simples (avec/sans quelque chose).

---

## 💰 Gestion des prix supplémentaires

Chaque option peut avoir un **prix supplémentaire** :
- **0€** : Option gratuite (ex: choix de sauce standard)
- **+1€, +1.50€, etc.** : Option payante (ex: supplément fromage)

Le prix sera automatiquement ajouté au total de la commande du client.

---

## 📝 Comment créer une personnalisation ?

### Méthode 1 : Utiliser un modèle rapide (recommandé pour débutants)

Si c'est la première personnalisation du menu, vous verrez des **modèles rapides** :

1. **🍯 Choix de sauce** : Modèle pré-configuré avec 4 sauces gratuites
2. **➕ Suppléments** : Modèle avec des suppléments payants (fromage, bacon, etc.)
3. **🚫 Retirer ingrédient** : Modèle pour retirer des ingrédients

Cliquez sur un modèle, modifiez si nécessaire, puis enregistrez.

---

### Méthode 2 : Créer une personnalisation personnalisée

1. Cliquez sur **+ Ajouter une personnalisation personnalisée**
2. Remplissez le formulaire :

#### **Nom de la personnalisation**
Le nom qui sera affiché au client (ex: "Sauce", "Suppléments", "Taille")

#### **Type**
- Choix unique (radio)
- Choix multiples (checkbox)
- Oui/Non (toggle)

#### **Obligatoire**
Cochez si le client DOIT faire un choix avant de pouvoir commander.

#### **Options disponibles**
Pour chaque option :
- **Nom de l'option** : Ex: "Ketchup", "Fromage"
- **Prix supplémentaire** : 0 pour gratuit, ou montant en euros

Cliquez sur **+ Ajouter une option** pour ajouter plus d'options.

3. Cliquez sur **Ajouter** pour sauvegarder

---

## ✏️ Modifier une personnalisation

1. Dans la liste des personnalisations configurées, cliquez sur **✏️** à côté de la personnalisation
2. Modifiez les champs souhaités
3. Cliquez sur **Enregistrer**

---

## 🗑️ Supprimer une personnalisation

1. Dans la liste des personnalisations configurées, cliquez sur **🗑️** à côté de la personnalisation
2. Confirmez la suppression

⚠️ Cette action est irréversible.

---

## 📊 Visualisation des personnalisations

Dans le tableau des menus, une colonne **"Personnalisations"** affiche :
- Le nombre de personnalisations configurées pour chaque menu
- **"Aucune"** si aucune personnalisation n'est configurée
- **"N/A"** pour les boissons (non personnalisables)

---

## 💡 Exemples pratiques

### Exemple 1 : Burger simple

**Personnalisation 1 : Sauce**
- Type : Choix unique
- Obligatoire : Non
- Options :
  - Ketchup (0€)
  - Mayonnaise (0€)
  - BBQ (0€)

**Personnalisation 2 : Suppléments**
- Type : Choix multiples
- Obligatoire : Non
- Options :
  - Fromage (+1€)
  - Bacon (+1.50€)
  - Oignons (0€)

---

### Exemple 2 : Tacos

**Personnalisation 1 : Taille**
- Type : Choix unique
- Obligatoire : Oui
- Options :
  - Normale (0€)
  - Grande (+2€)
  - XL (+4€)

**Personnalisation 2 : Sauce**
- Type : Choix unique
- Obligatoire : Non
- Options :
  - Blanche (0€)
  - Samouraï (0€)
  - Harissa (0€)

**Personnalisation 3 : Extras**
- Type : Choix multiples
- Obligatoire : Non
- Options :
  - Extra viande (+3€)
  - Extra frites (+1.50€)
  - Sans légumes (0€)

---

## 🚀 Conseils et bonnes pratiques

### ✅ À faire :
- Configurer les personnalisations pour TOUS les plats personnalisables (burgers, tacos, sandwichs, etc.)
- Utiliser des noms clairs et simples pour les options
- Mettre des prix justes pour les suppléments
- Tester les personnalisations en passant une commande test

### ❌ À éviter :
- Ne PAS créer de personnalisations pour les boissons
- Ne PAS mettre trop d'options (max 5-6 par personnalisation)
- Ne PAS oublier de définir les prix supplémentaires pour les extras payants
- Ne PAS créer plusieurs personnalisations avec le même nom

---

## 🔄 Comment les clients verront les personnalisations ?

Quand un client ajoute un plat au panier :
1. Une fenêtre s'ouvre avec toutes les personnalisations configurées
2. Le client choisit ses options
3. Le prix total se met à jour automatiquement en fonction des suppléments
4. Les personnalisations choisies apparaissent dans le récapitulatif de commande
5. Les personnalisations sont visibles dans l'interface admin des commandes

---

## 📞 Support

Si vous avez des questions sur le système de personnalisations, contactez le support technique.

---

**Dernière mise à jour :** Novembre 2024

