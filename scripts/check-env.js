#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Diagnostic des Variables d\'Environnement\n');

// Vérifier si .env.local existe
const envPath = path.join(__dirname, '..', '.env.local');
const envExists = fs.existsSync(envPath);

console.log(`📁 Fichier .env.local : ${envExists ? '✅ Existe' : '❌ Manquant'}`);

if (!envExists) {
  console.log('\n🚨 SOLUTION : Créez le fichier .env.local avec ce contenu :\n');
  console.log(`# Configuration MongoDB Atlas
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
CLOUDINARY_API_SECRET=your-api-secret`);
} else {
  console.log('\n📋 Contenu du fichier .env.local :\n');
  const content = fs.readFileSync(envPath, 'utf8');
  console.log(content);
  
  // Vérifier les variables importantes
  const lines = content.split('\n');
  const requiredVars = ['NEXTAUTH_URL', 'NEXTAUTH_SECRET', 'ADMIN_EMAIL', 'ADMIN_PASSWORD'];
  
  console.log('\n🔍 Vérification des variables requises :');
  requiredVars.forEach(varName => {
    const hasVar = lines.some(line => line.startsWith(varName + '='));
    console.log(`${varName}: ${hasVar ? '✅ Présent' : '❌ Manquant'}`);
  });
}

console.log('\n📝 Étapes pour résoudre le problème :');
console.log('1. Créez le fichier .env.local à la racine du projet');
console.log('2. Ajoutez toutes les variables ci-dessus');
console.log('3. Redémarrez le serveur : npm run dev');
console.log('4. Testez : http://localhost:3000/admin/login');
console.log('5. Si problème persiste, testez : http://localhost:3000/admin/login/simple');

console.log('\n🔗 Pages de test disponibles :');
console.log('- http://localhost:3000/admin/login/test (diagnostic)');
console.log('- http://localhost:3000/admin/login/simple (version simple)');
console.log('- http://localhost:3000/admin/login (version NextAuth)'); 