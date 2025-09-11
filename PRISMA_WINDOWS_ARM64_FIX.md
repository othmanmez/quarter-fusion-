# Guide de résolution : Prisma sur Windows ARM64

## 🔴 Le Problème

Sur Windows ARM64, Prisma génère cette erreur lors du démarrage :

```
Error: Unable to require(`...\node_modules\.prisma\client\query_engine-windows.dll.node`).
The Prisma engines do not seem to be compatible with your system.
Details: ...query_engine-windows.dll.node is not a valid Win32 application.
```

### Pourquoi cette erreur ?

- Prisma ne compile ses binaires **que pour x86_64 sur Windows**, pas pour ARM64
- Votre PC Windows ARM64 essaie de charger un binaire x86_64 en mode natif, ce qui échoue
- Le mode par défaut `library` charge le binaire directement dans le processus Node.js

## ✅ La Solution Rapide

### Étape 1 : Modifier le schéma Prisma

Dans votre fichier `prisma/schema.prisma`, ajoutez `engineType = "binary"` :

```prisma
generator client {
  provider = "prisma-client-js"
  engineType = "binary"  // ← Ajouter cette ligne
}
```

### Étape 2 : Variables d'environnement

Ajoutez dans vos fichiers `.env` ET `.env.local` :

```env
# Force binary engine for Windows ARM64 compatibility
PRISMA_CLIENT_ENGINE_TYPE=binary
```

### Étape 3 : Régénérer Prisma

```bash
# Nettoyer l'ancien client
rm -rf node_modules/.prisma
rm -rf node_modules/@prisma/client

# Réinstaller Prisma (avec npm de préférence)
npm install @prisma/client prisma

# Générer le nouveau client avec le mode binary
npx prisma generate
```

### Étape 4 : Vérifier

Lors de la génération, vous devriez voir :
```
✔ Generated Prisma Client (vX.X.X, engine=binary) to .\node_modules\@prisma\client
                                    ^^^^^^^^^^^^^^
```

## 🔧 Commandes de dépannage

Si le problème persiste :

```bash
# 1. Nettoyer complètement
npm cache clean --force
rm -rf node_modules
rm -rf .next
rm package-lock.json

# 2. Réinstaller avec npm (pas pnpm/yarn sur ARM64)
npm install

# 3. Forcer la génération
PRISMA_CLIENT_ENGINE_TYPE=binary npx prisma generate

# 4. Lancer l'application
npm run dev
```

## 📝 Checklist de vérification

- [ ] `engineType = "binary"` dans schema.prisma
- [ ] `PRISMA_CLIENT_ENGINE_TYPE=binary` dans .env
- [ ] `PRISMA_CLIENT_ENGINE_TYPE=binary` dans .env.local  
- [ ] Client généré avec `engine=binary` (vérifier le message)
- [ ] Utilisation de npm (pas pnpm qui peut causer des problèmes)

## 🎯 Pour vos autres projets

### Script de migration rapide

Créez ce script `fix-prisma-arm64.js` dans vos projets :

```javascript
#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔧 Configuration de Prisma pour Windows ARM64...\n');

// 1. Modifier schema.prisma
const schemaPath = path.join(process.cwd(), 'prisma', 'schema.prisma');
if (fs.existsSync(schemaPath)) {
  let schema = fs.readFileSync(schemaPath, 'utf8');
  
  // Ajouter engineType si absent
  if (!schema.includes('engineType')) {
    schema = schema.replace(
      'generator client {',
      'generator client {\n  engineType = "binary"'
    );
    fs.writeFileSync(schemaPath, schema);
    console.log('✅ schema.prisma modifié');
  } else {
    console.log('⚠️  engineType déjà présent dans schema.prisma');
  }
}

// 2. Ajouter variables d'environnement
const envFiles = ['.env', '.env.local'];
const envLine = '\n# Windows ARM64 fix\nPRISMA_CLIENT_ENGINE_TYPE=binary\n';

envFiles.forEach(file => {
  const envPath = path.join(process.cwd(), file);
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    if (!content.includes('PRISMA_CLIENT_ENGINE_TYPE')) {
      fs.appendFileSync(envPath, envLine);
      console.log(`✅ ${file} mis à jour`);
    }
  }
});

// 3. Régénérer Prisma
console.log('\n🔄 Régénération du client Prisma...');
try {
  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log('\n✅ Configuration terminée ! Relancez votre serveur.');
} catch (error) {
  console.error('❌ Erreur lors de la génération Prisma');
}
```

### Utilisation du script :

```bash
# Dans n'importe quel projet avec Prisma
node fix-prisma-arm64.js
```

## 💡 Explication technique

**Mode library (défaut - ne fonctionne PAS sur ARM64) :**
- Le query engine est chargé comme une DLL directement dans le processus Node.js
- Node.js ARM64 ne peut pas charger une DLL x86_64

**Mode binary (solution qui FONCTIONNE) :**
- Le query engine s'exécute comme un processus séparé
- Windows utilise la traduction binaire (émulation x86_64) pour ce processus
- Node.js ARM64 communique avec ce processus via IPC

## 🔗 Ressources

- [Issue GitHub officielle #25206](https://github.com/prisma/prisma/issues/25206)
- [Issue GitHub #15306 - Support ARM64](https://github.com/prisma/prisma/issues/15306)
- [Documentation Prisma sur les engines](https://www.prisma.io/docs/concepts/components/prisma-engines)

## ⚠️ Notes importantes

1. **Performance** : Le mode binary peut être légèrement plus lent (processus séparé + émulation)
2. **Alternative** : Utiliser Node.js x86_64 au lieu d'ARM64 (mais moins optimal)
3. **Futur** : Prisma travaille sur le support natif ARM64 pour Windows

---

**Dernière mise à jour :** Septembre 2025
**Testé avec :** Prisma 5.22.0, Node.js 22.x, Windows 11 ARM64