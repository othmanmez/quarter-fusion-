# Exemples d'utilisation des API Routes

## 1. Créer une nouvelle commande

### POST /api/orders

```javascript
// Exemple de création de commande
const orderData = {
  customerName: "Jean Dupont",
  customerEmail: "jean.dupont@email.com",
  customerPhone: "01 23 45 67 89",
  items: [
    {
      title: "Bucket Maxi Fusion",
      quantity: 1,
      price: 24.90,
      description: "8 pièces de poulet + frites + sauces"
    },
    {
      title: "Quarter Crousty",
      quantity: 2,
      price: 8.50,
      description: "Quarter de poulet pané"
    }
  ],
  deliveryAddress: "123 Rue de la Paix",
  city: "Cergy",
  isDelivery: true,
  message: "Livraison à l'étage 3"
};

const response = await fetch('/api/orders', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(orderData)
});

const result = await response.json();
console.log('Commande créée:', result);
```

### Réponse attendue

```json
{
  "success": true,
  "order": {
    "id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "orderNumber": "QF20241201001",
    "total": 41.90,
    "status": "En attente"
  },
  "message": "Commande créée avec succès"
}
```

## 2. Mettre à jour le statut d'une commande

### PUT /api/orders/[id]/status

```javascript
// Exemple de mise à jour du statut
const orderId = "64f8a1b2c3d4e5f6a7b8c9d0";
const statusData = {
  status: "Prête"
};

const response = await fetch(`/api/orders/${orderId}/status`, {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(statusData)
});

const result = await response.json();
console.log('Statut mis à jour:', result);
```

### Réponse attendue

```json
{
  "success": true,
  "order": {
    "id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "orderNumber": "QF20241201001",
    "status": "Prête",
    "updatedAt": "2024-12-01T15:30:00.000Z"
  },
  "message": "Statut de la commande mis à jour vers \"Prête\""
}
```

## 3. Récupérer toutes les commandes

### GET /api/orders

```javascript
const response = await fetch('/api/orders');
const result = await response.json();
console.log('Liste des commandes:', result);
```

### Réponse attendue

```json
{
  "success": true,
  "orders": [
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "orderNumber": "QF20241201001",
      "customerName": "Jean Dupont",
      "customerEmail": "jean.dupont@email.com",
      "customerPhone": "01 23 45 67 89",
      "items": [...],
      "total": 41.90,
      "status": "Prête",
      "createdAt": "2024-12-01T15:00:00.000Z",
      "updatedAt": "2024-12-01T15:30:00.000Z"
    }
  ]
}
```

## 4. Gestion des erreurs

### Erreur de validation

```json
{
  "error": "Données manquantes ou invalides"
}
```

### Erreur de commande non trouvée

```json
{
  "error": "Commande non trouvée"
}
```

### Erreur de statut invalide

```json
{
  "error": "Statut invalide"
}
```

## 5. Statuts disponibles

- `En attente` - Commande reçue, en attente de traitement
- `En préparation` - Commande en cours de préparation
- `Prête` - Commande prête pour retrait/livraison
- `Terminée` - Commande livrée/retirée
- `Annulée` - Commande annulée

## 6. Emails automatiques

### Lors de la création d'une commande :
- Email de confirmation au client
- Email de notification à l'admin

### Lors de la mise à jour du statut :
- Email "Prête" quand le statut passe à "Prête"
- Email "Terminée" quand le statut passe à "Terminée"
- Email générique pour les autres statuts

## 7. Configuration requise

Assurez-vous d'avoir configuré les variables d'environnement dans `.env.local` :

```env
SMTP_HOST="smtp.example.com"
SMTP_PORT=587
SMTP_USER="contact@mon-site.com"
SMTP_PASS="motdepasseSMTP"
SMTP_FROM="Snack Quarter Fusion <contact@mon-site.com>"
MONGODB_URI="mongodb+srv://username:password@cluster.mongodb.net/quarter-fusion"
ADMIN_EMAIL="admin@quarterfusion.fr"
``` 