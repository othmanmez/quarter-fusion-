# 🔧 Fix : Erreur "i/o error, write" lors du build

## 🎯 Problème identifié

L'erreur `i/o error, write` pendant le build Next.js est causée par :
- **OneDrive** qui synchronise les fichiers pendant le build
- Conflit entre WSL et OneDrive sur les fichiers temporaires

## ✅ Solution 1 : Désactiver OneDrive temporairement (Recommandé)

### Étape 1 : Pause OneDrive
1. Clic droit sur l'icône OneDrive (barre des tâches)
2. **Paramètres** → **Pause sync** → **24 heures**

### Étape 2 : Nettoyer et rebuilder
```bash
# Nettoyer complètement
rm -rf .next node_modules/.cache

# Rebuild
npm run build
```

### Étape 3 : Réactiver OneDrive après le build

---

## ✅ Solution 2 : Déplacer le projet hors de OneDrive

### Créer un nouveau dossier local
```bash
# Créer un dossier hors de OneDrive
mkdir -p /mnt/c/Dev
cd /mnt/c/Dev

# Copier le projet
cp -r "/mnt/c/Users/othma/OneDrive/Bureau/quarter-fusion-" ./quarter-fusion

# Aller dans le nouveau dossier
cd quarter-fusion
```

### Builder depuis le nouveau dossier
```bash
npm run build
```

**Avantage** : Pas de conflit avec OneDrive, build plus rapide

---

## ✅ Solution 3 : Build avec Node.js au lieu de Turbopack

Modifier `package.json` :

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  }
}
```

Puis :
```bash
npm run build
```

---

## ✅ Solution 4 : Exclure les dossiers de OneDrive

### Empêcher OneDrive de synchroniser certains dossiers

1. **Propriétés du dossier** `quarter-fusion-`
2. Onglet **Général**
3. Décocher **"Toujours conserver sur cet appareil"**
4. Exclure les dossiers :
   - `.next`
   - `node_modules`
   - `.vercel`

---

## ✅ Solution 5 : Builder en mode production sans optimisations

Créer un fichier `next.config.js` :

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Désactiver les optimisations problématiques
  swcMinify: true,
  
  // Augmenter la limite de mémoire
  experimental: {
    workerThreads: false,
    cpus: 1
  }
}

module.exports = nextConfig
```

Puis :
```bash
npm run build
```

---

## 🚀 Solution RAPIDE (Pour déployer maintenant)

### Déployez directement sur Vercel sans builder localement

1. **Push sur GitHub** :
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Sur Vercel** :
   - Import from GitHub
   - Vercel fera le build sur ses serveurs
   - Pas de problème de OneDrive !

3. **Configuration Vercel** :
   ```
   Framework Preset: Next.js
   Build Command: npm run build
   Output Directory: .next
   Install Command: npm install
   ```

**Avantage** : Vercel a un environnement optimisé pour Next.js

---

## 🔍 Diagnostic

```bash
# Vérifier l'espace disque
df -h .

# Vérifier les permissions
ls -la .next 2>/dev/null || echo "Dossier .next n'existe pas"

# Vérifier les processus qui utilisent les fichiers
lsof +D . 2>/dev/null | grep -E "(node|next)" || echo "Aucun processus détecté"
```

---

## ⚠️ Ce qui NE fonctionne PAS

- ❌ Builder dans OneDrive avec WSL (conflit)
- ❌ Builder avec le serveur dev en cours
- ❌ Builder avec peu d'espace disque

## ✅ Ce qui fonctionne

- ✅ Déployer sur Vercel (build distant)
- ✅ Builder hors de OneDrive
- ✅ Pause OneDrive pendant le build
- ✅ Builder depuis PowerShell/CMD au lieu de WSL

---

## 🎯 Recommandation finale

**Pour déployer MAINTENANT :**
1. Ne buildez PAS localement
2. Push sur GitHub
3. Laissez Vercel faire le build

**Pour développer localement :**
1. Déplacez le projet dans `C:\Dev\`
2. Excluez-le de OneDrive
3. Utilisez ce dossier pour le développement

---

## 📞 Besoin d'aide ?

Si le problème persiste :
1. Redémarrer l'ordinateur
2. Fermer tous les éditeurs (VS Code, etc.)
3. Essayer depuis PowerShell :
   ```powershell
   cd "C:\Users\othma\OneDrive\Bureau\quarter-fusion-"
   npm run build
   ```

