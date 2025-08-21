# 🔍 Diagnostic - Page Login Admin Blanche

## 🚨 Problème Identifié

La page de login admin affiche une page blanche. Cela peut être dû à plusieurs raisons :

### 1. **Variables d'Environnement Manquantes**
Le fichier `.env.local` n'existe pas ou ne contient pas les variables NextAuth nécessaires.

### 2. **Erreurs JavaScript**
Des erreurs dans la console peuvent empêcher le rendu de la page.

### 3. **Configuration NextAuth**
L'API NextAuth n'est pas correctement configurée.

## 🔧 Solutions à Appliquer

### **Étape 1 : Créer le fichier .env.local**

Créez un fichier `.env.local` à la racine du projet avec ce contenu :

```bash
# Configuration MongoDB Atlas
MONGODB_URI=mongodb+srv://quarterfusion:Quarter2025%21@cluster0.5brzic0.mongodb.net/quarter-fusion?retryWrites=true&w=majority&appName=Cluster0

# Configuration Email (Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=quarterfusion@gmail.com
EMAIL_PASS=fpcplcoqhgfmlkok
ADMIN_EMAIL=quarterfusion@gmail.com

# Configuration NextAuth (OBLIGATOIRE)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-super-secret-key-change-this-in-production

# Configuration Admin (OBLIGATOIRE)
ADMIN_EMAIL=quarterfusion@gmail.com
ADMIN_PASSWORD=admin123

# Configuration Cloudinary (optionnel)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### **Étape 2 : Redémarrer le serveur**

```bash
# Arrêter le serveur (Ctrl+C)
# Puis redémarrer
npm run dev
```

### **Étape 3 : Vérifier la console**

1. Ouvrez les outils de développement (F12)
2. Allez dans l'onglet "Console"
3. Vérifiez s'il y a des erreurs JavaScript
4. Allez dans l'onglet "Network" pour voir les requêtes

### **Étape 4 : Tester l'accès**

1. Allez sur `http://localhost:3000/admin/login`
2. Vérifiez que la page s'affiche
3. Testez avec les identifiants :
   - Email : `quarterfusion@gmail.com`
   - Mot de passe : `admin123`

## 🐛 Débogage Avancé

### **Si la page reste blanche :**

1. **Vérifiez les logs du serveur** dans le terminal
2. **Testez l'API NextAuth** : `http://localhost:3000/api/auth/providers`
3. **Vérifiez les variables d'environnement** :

```bash
# Dans le terminal, vérifiez que les variables sont chargées
echo $NEXTAUTH_URL
echo $NEXTAUTH_SECRET
```

### **Si vous voyez des erreurs dans la console :**

1. **Erreur "NEXTAUTH_SECRET is not set"** : Vérifiez le fichier `.env.local`
2. **Erreur "NEXTAUTH_URL is not set"** : Vérifiez l'URL dans `.env.local`
3. **Erreur de module** : Redémarrez le serveur

## 🔄 Solution Alternative - Page de Test

Si le problème persiste, créons une page de test simple :

```typescript
// app/admin/login/test/page.tsx
export default function TestPage() {
  return (
    <div className="min-h-screen bg-red-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-red-700 mb-4">
          Test Page - Login Admin
        </h1>
        <p className="text-gray-600">
          Si vous voyez cette page, le problème vient de NextAuth.
        </p>
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <h3 className="font-bold">Variables d'environnement :</h3>
          <p>NEXTAUTH_URL: {process.env.NEXTAUTH_URL || 'Non défini'}</p>
          <p>NEXTAUTH_SECRET: {process.env.NEXTAUTH_SECRET ? 'Défini' : 'Non défini'}</p>
          <p>ADMIN_EMAIL: {process.env.ADMIN_EMAIL || 'Non défini'}</p>
        </div>
      </div>
    </div>
  );
}
```

## ✅ Checklist de Résolution

- [ ] Fichier `.env.local` créé avec toutes les variables
- [ ] Serveur redémarré
- [ ] Console vérifiée (pas d'erreurs)
- [ ] Page `http://localhost:3000/admin/login` accessible
- [ ] Formulaire de login visible
- [ ] Connexion avec les identifiants de test fonctionne

## 🆘 Si le Problème Persiste

1. **Vérifiez la version de Next.js** : `npm list next`
2. **Vérifiez la version de NextAuth** : `npm list next-auth`
3. **Nettoyez le cache** : `rm -rf .next && npm run dev`
4. **Vérifiez les permissions** du fichier `.env.local`

---

## 🎯 Résultat Attendu

Après avoir suivi ces étapes, vous devriez voir :
- ✅ Page de login admin fonctionnelle
- ✅ Formulaire avec champs email et mot de passe
- ✅ Identifiants de test affichés
- ✅ Connexion qui fonctionne
- ✅ Redirection vers le dashboard

Si le problème persiste, partagez les erreurs de la console pour un diagnostic plus précis. 