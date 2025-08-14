#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Correction du fichier .env.local\n');

const envPath = path.join(__dirname, '..', '.env.local');

// Variables NextAuth manquantes
const missingVars = [
  '',
  '# Configuration NextAuth (OBLIGATOIRE)',
  'NEXTAUTH_URL=http://localhost:3000',
  'NEXTAUTH_SECRET=your-super-secret-key-change-this-in-production',
  '',
  '# Configuration Admin (OBLIGATOIRE)',
  'ADMIN_PASSWORD=admin123',
  '',
  '# Configuration Cloudinary (optionnel)',
  'CLOUDINARY_CLOUD_NAME=your-cloud-name',
  'CLOUDINARY_API_KEY=your-api-key',
  'CLOUDINARY_API_SECRET=your-api-secret'
];

try {
  // Lire le contenu actuel
  const currentContent = fs.readFileSync(envPath, 'utf8');
  
  // Ajouter les variables manquantes
  const newContent = currentContent + missingVars.join('\n');
  
  // Écrire le nouveau contenu
  fs.writeFileSync(envPath, newContent);
  
  console.log('✅ Variables NextAuth ajoutées avec succès !');
  console.log('\n📋 Variables ajoutées :');
  missingVars.filter(line => line.includes('=')).forEach(line => {
    const [key] = line.split('=');
    console.log(`- ${key}`);
  });
  
  console.log('\n🔄 Étapes suivantes :');
  console.log('1. Redémarrez le serveur : npm run dev');
  console.log('2. Testez : http://localhost:3000/admin/login');
  console.log('3. Identifiants : quarterfusion@gmail.com / admin123');
  
} catch (error) {
  console.error('❌ Erreur lors de la modification du fichier :', error.message);
  console.log('\n📝 Ajoutez manuellement ces lignes à votre fichier .env.local :');
  missingVars.forEach(line => console.log(line));
} 