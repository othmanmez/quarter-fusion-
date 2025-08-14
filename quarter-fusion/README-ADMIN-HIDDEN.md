# 🔐 Système d'Administration Caché - Quarter Fusion

## 🎯 Fonctionnalité

Le site Quarter Fusion dispose d'un accès administrateur **caché** accessible uniquement via un mécanisme discret dans le footer.

## 🚀 Comment accéder à l'administration

### Méthode d'accès
1. **Allez sur n'importe quelle page du site public**
2. **Descendez jusqu'au footer**
3. **Cliquez 2 fois rapidement** sur le texte de copyright :
   ```
   © 2025 Quarter Fusion. Tous droits réservés.
   ```
4. **Vous serez automatiquement redirigé** vers `/admin/login`

### Indicateurs visuels
- **Premier clic** : Le texte devient rouge (`text-red-400`)
- **Deuxième clic** : Redirection vers la page de connexion admin
- **Timeout** : Le compteur se réinitialise après 3 secondes d'inactivité

## 🔐 Authentification

### Identifiants de connexion
- **Email** : `quarterfusion@gmail.com`
- **Mot de passe** : `QuarterAdmin2025!`

### Sécurité
- **Session JWT** avec expiration de 24h
- **Middleware de protection** sur toutes les routes `/admin/*`
- **Vérification du rôle** admin sur toutes les actions sensibles

## 📁 Structure des fichiers

### Composants modifiés
```
app/components/Footer.tsx          # Footer avec logique de détection des clics
app/admin/login/page.tsx           # Page de connexion admin
app/admin/login/layout.tsx         # Layout spécifique pour la connexion
app/admin/layout.tsx               # Layout principal admin avec protection
```

### Configuration
```
middleware.ts                      # Protection des routes admin
app/api/auth/[...nextauth]/route.ts # Configuration NextAuth
```

## 🛡️ Sécurité

### Protection des routes
- **Middleware** : Protège toutes les routes `/admin/*`
- **Exception** : `/admin/login` est accessible sans authentification
- **Redirection** : Utilisateurs non authentifiés → `/admin/login`

### Validation
- **Vérification du rôle** admin sur toutes les API routes sensibles
- **Session validation** côté serveur
- **CSRF protection** via NextAuth

## 🎨 Interface utilisateur

### Footer
- **Texte cliquable** : Copyright avec hover effect
- **Feedback visuel** : Changement de couleur au premier clic
- **Tooltip** : "Cliquez 2 fois pour accéder à l'administration"

### Page de connexion
- **Design épuré** : Interface simple et professionnelle
- **Validation** : Messages d'erreur en cas d'échec
- **Redirection** : Vers le dashboard après connexion réussie

## 🔧 Fonctionnalités techniques

### Détection des clics
```typescript
const handleCopyrightClick = useCallback(() => {
  const currentTime = Date.now();
  
  // Réinitialiser le compteur si plus de 3 secondes se sont écoulées
  if (currentTime - lastClickTime > 3000) {
    setClickCount(1);
  } else {
    const newClickCount = clickCount + 1;
    setClickCount(newClickCount);
    
    // Si 2 clics détectés, rediriger vers l'admin
    if (newClickCount === 2) {
      router.push('/admin/login');
      setClickCount(0);
    }
  }
  
  setLastClickTime(currentTime);
}, [clickCount, lastClickTime, router]);
```

### Protection middleware
```typescript
export default withAuth(
  function middleware(req) {
    // Exclure /admin/login de la protection
    if (req.nextUrl.pathname === '/admin/login') {
      return NextResponse.next();
    }
    
    // Vérifier si l'utilisateur est admin
    if (req.nextauth.token?.role !== 'admin') {
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);
```

## 🚀 Déploiement

### Variables d'environnement requises
```bash
# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="quarter-fusion-admin-secret-key-2025"

# Admin Credentials
ADMIN_EMAIL="quarterfusion@gmail.com"
ADMIN_PASSWORD="QuarterAdmin2025!"
```

### Étapes de déploiement
1. **Configurer les variables d'environnement**
2. **Lancer le serveur** : `npm run dev`
3. **Tester l'accès** : Cliquer 2 fois sur le copyright
4. **Se connecter** avec les identifiants admin

## 🧪 Tests

### Page de test
- **URL** : `/admin/test`
- **Fonction** : Vérifier l'authentification admin
- **Accès** : Seulement après connexion réussie

### Scénarios de test
1. **Accès public** : Vérifier que le footer est visible
2. **Premier clic** : Vérifier le changement de couleur
3. **Deuxième clic** : Vérifier la redirection vers `/admin/login`
4. **Connexion** : Tester avec les identifiants admin
5. **Protection** : Vérifier que les routes admin sont protégées

## 🔍 Dépannage

### Problèmes courants
- **Boucle de redirection** : Vérifier la configuration du middleware
- **Session non persistante** : Vérifier NEXTAUTH_SECRET
- **Accès refusé** : Vérifier les identifiants admin

### Logs utiles
- **Console navigateur** : Erreurs JavaScript
- **Console serveur** : Erreurs NextAuth et API
- **Network tab** : Requêtes d'authentification

## 📞 Support

Pour toute question ou problème :
- **Email** : quarterfusion@gmail.com
- **Documentation** : Ce fichier README
- **Logs** : Console du serveur et navigateur

---

**Quarter Fusion Admin Hidden** - Accès administrateur discret et sécurisé 🔐 