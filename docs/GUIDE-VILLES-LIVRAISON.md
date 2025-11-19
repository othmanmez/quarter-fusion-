# 🚗 Guide : Gestion des villes de livraison

## ✨ Vue d'ensemble

Vous pouvez maintenant gérer les villes de livraison directement depuis l'interface admin, avec des **frais personnalisés** pour chaque ville !

---

## 📋 Fonctionnalités

### **Pour l'administrateur :**

✅ Ajouter/modifier/supprimer des villes de livraison  
✅ Définir des frais de livraison spécifiques par ville  
✅ Définir un montant minimum de commande par ville (optionnel)  
✅ Activer/désactiver temporairement une ville  
✅ Ajouter des codes postaux pour pré-remplir automatiquement  

### **Pour le client :**

✅ Sélection de la ville dans un menu déroulant  
✅ Affichage automatique des frais de livraison selon la ville  
✅ Affichage du montant minimum de commande si configuré  
✅ Blocage de la commande si le minimum n'est pas atteint  
✅ Pré-remplissage automatique du code postal  

---

## 🎯 Comment gérer les villes de livraison

### **1. Accéder à l'interface admin**

1. Connectez-vous à l'admin : `/admin/dashboard`
2. Allez dans **Paramètres** : `/admin/settings`
3. Descendez jusqu'à la section **"🚗 Villes de livraison"**

### **2. Ajouter une nouvelle ville**

1. Cliquez sur le bouton **"+ Ajouter une ville"**
2. Remplissez le formulaire :

   **Champs disponibles :**
   - **Nom de la ville*** (obligatoire) : Ex: `Cergy`
   - **Code postal** (optionnel) : Ex: `95000`
   - **Frais de livraison*** (obligatoire) : Ex: `2.50` €
   - **Commande minimum** (optionnel) : Ex: `20.00` €
   - **Ville active** : Cochez pour activer immédiatement

3. Cliquez sur **"Ajouter"**

**Exemple de configuration :**

```
Ville : Cergy
Code postal : 95000
Frais de livraison : 2,50€
Commande minimum : 20,00€
Active : ✓
```

### **3. Modifier une ville existante**

1. Dans le tableau des villes, cliquez sur **"✏️ Modifier"**
2. Modifiez les champs souhaités
3. Cliquez sur **"Mettre à jour"**

### **4. Activer/Désactiver une ville**

Vous pouvez temporairement désactiver une ville sans la supprimer :

1. Cliquez sur le badge **"✓ Active"** ou **"✗ Inactive"**
2. La ville est instantanément activée/désactivée
3. Les clients ne verront plus les villes inactives

### **5. Supprimer une ville**

⚠️ **Attention** : La suppression est définitive !

1. Cliquez sur **"🗑️ Supprimer"**
2. Confirmez la suppression
3. La ville est supprimée de la base de données

---

## 💡 Exemples de configuration

### **Exemple 1 : Livraison proche**

```
Ville : Cergy
Frais : 2,00€
Minimum : 15,00€
```

### **Exemple 2 : Livraison éloignée**

```
Ville : Pontoise
Frais : 4,50€
Minimum : 25,00€
```

### **Exemple 3 : Livraison gratuite**

```
Ville : Centre-ville Cergy
Frais : 0,00€
Minimum : 20,00€
```

### **Exemple 4 : Pas de minimum**

```
Ville : Cergy
Frais : 3,00€
Minimum : (laissé vide)
```

---

## 👤 Expérience client

### **1. Sélection de la ville**

Lorsqu'un client passe une commande en livraison :

1. Il sélectionne sa ville dans un **menu déroulant**
2. Les frais de livraison s'affichent automatiquement : 
   ```
   Cergy - 2,50€
   Pontoise - 4,50€
   ```

### **2. Affichage des informations**

Après avoir sélectionné une ville, le client voit :

```
✅ Livraison disponible à Cergy
   Frais de livraison : 2,50€
   Commande minimum : 20,00€
```

### **3. Vérification du montant minimum**

Si la commande est inférieure au minimum :

```
⚠️ Commande minimum non atteinte
   Ajoutez encore 5,50€ pour pouvoir commander dans cette ville.
```

Le bouton "Commander" est **désactivé** tant que le minimum n'est pas atteint.

### **4. Calcul automatique du total**

```
Sous-total :                17,50€
Frais de livraison (Cergy):  2,50€
─────────────────────────────────
Total :                     20,00€
```

---

## 🔧 Configuration technique

### **Base de données**

Le modèle `DeliveryCity` contient :

```typescript
{
  id: string            // ID unique
  name: string          // Nom de la ville (unique)
  postalCode: string    // Code postal (optionnel)
  deliveryFee: number   // Frais de livraison (€)
  minOrder: number      // Montant minimum (€, optionnel)
  active: boolean       // Ville active ou non
}
```

### **API Endpoints**

- `GET /api/delivery-cities` - Liste toutes les villes
- `GET /api/delivery-cities?activeOnly=true` - Villes actives seulement
- `POST /api/delivery-cities` - Créer une ville
- `PUT /api/delivery-cities/[id]` - Modifier une ville
- `DELETE /api/delivery-cities/[id]` - Supprimer une ville

---

## 📊 Tableau de gestion

Le tableau affiche pour chaque ville :

| Ville | Code postal | Frais | Commande min. | Statut | Actions |
|-------|-------------|-------|---------------|--------|---------|
| Cergy | 95000 | 2,50€ | 20,00€ | ✓ Active | ✏️ 🗑️ |
| Pontoise | 95300 | 4,50€ | 25,00€ | ✓ Active | ✏️ 🗑️ |
| Osny | 95520 | 3,00€ | - | ✗ Inactive | ✏️ 🗑️ |

---

## ⚡ Bonnes pratiques

### **1. Nommage des villes**

✅ **Bon** : `Cergy`, `Pontoise`, `Osny`  
❌ **Mauvais** : `cergy`, `CERGY`, `Cergy (95000)`

### **2. Frais de livraison**

- Utilisez des montants logiques : `2,50€`, `3,00€`, `4,50€`
- Évitez les frais trop faibles (< 1€) ou trop élevés (> 10€)
- La livraison gratuite est possible : `0,00€`

### **3. Commande minimum**

- Définissez un minimum réaliste : `15€` à `30€`
- Adaptez selon la distance : plus loin = minimum plus élevé
- Laissez vide si vous ne voulez pas de minimum

### **4. Codes postaux**

- Ajoutez-les pour faciliter la saisie du client
- Un code postal = une ville (ne mettez pas de plages)
- Exemple : `95000` pour Cergy

### **5. Activation/Désactivation**

- Désactivez temporairement une ville plutôt que de la supprimer
- Utile pour gérer les périodes de rush ou de congés
- La ville reste dans la base de données

---

## 🛠️ Résolution de problèmes

### ❌ **"Aucune ville de livraison disponible"**

**Causes :**
- Aucune ville n'a été ajoutée
- Toutes les villes sont désactivées

**Solution :**
1. Allez dans `/admin/settings`
2. Ajoutez au moins une ville avec le statut "Active"

### ❌ **Le client ne voit pas sa ville**

**Causes :**
- La ville n'est pas dans la liste
- La ville est désactivée

**Solution :**
1. Ajoutez la ville dans l'admin
2. Vérifiez qu'elle est bien activée (✓ Active)

### ❌ **Les frais ne s'actualisent pas**

**Causes :**
- Le client n'a pas rechargé la page
- Cache du navigateur

**Solution :**
1. Demandez au client de rafraîchir la page (F5)
2. Videz le cache du navigateur si nécessaire

### ❌ **"Commande minimum non atteinte" alors que c'est bon**

**Causes :**
- Le montant affiché n'inclut pas les frais de livraison
- Le sous-total seul est comparé au minimum

**Solution :**
C'est le comportement normal ! Le minimum s'applique au **sous-total** (avant frais de livraison).

---

## 🎨 Personnalisation

### **Modifier les messages**

Les messages sont dans `components/OrderForm.tsx` :

```typescript
// Message de succès
<p className="font-medium">Livraison disponible à {selectedCity.name}</p>

// Message d'erreur minimum
<p className="font-medium">Commande minimum non atteinte</p>
<p>Ajoutez encore {(selectedCity.minOrder - totalPrice).toFixed(2)}€</p>
```

### **Modifier les couleurs**

```typescript
// Succès (vert)
className="bg-green-50 border-green-200 text-green-800"

// Avertissement (orange)
className="bg-orange-50 border-orange-200 text-orange-800"

// Erreur (rouge)
className="bg-red-50 border-red-300 text-red-700"
```

---

## 📈 Statistiques (à venir)

Fonctionnalités prévues :
- 📊 Statistiques par ville
- 💰 Revenus par zone
- 📦 Nombre de commandes par ville
- 🗺️ Carte interactive des zones

---

## 🔐 Sécurité

- ✅ Seuls les admins peuvent modifier les villes
- ✅ Validation des données côté serveur
- ✅ Vérification du montant minimum avant validation
- ✅ Impossible d'avoir deux villes avec le même nom

---

## ✅ Checklist de configuration

- [ ] Au moins 3-5 villes ajoutées
- [ ] Frais de livraison définis pour chaque ville
- [ ] Montants minimums configurés (si souhaité)
- [ ] Codes postaux ajoutés (recommandé)
- [ ] Toutes les villes testées côté client
- [ ] Villes éloignées désactivées si nécessaire

---

## 🆘 Support

### **Besoin d'aide ?**

1. Vérifiez que vous êtes connecté en tant qu'admin
2. Consultez la console développeur (F12) pour les erreurs
3. Vérifiez que la base de données MongoDB est accessible
4. Testez les APIs manuellement avec Postman/Insomnia

---

**Date de création :** Novembre 2024  
**Version :** 1.0  
**Testé avec :** MongoDB, Next.js 14

