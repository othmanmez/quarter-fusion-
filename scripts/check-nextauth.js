// Script pour vérifier la configuration NextAuth
require('dotenv').config({ path: '.env.local' });

console.log('🔍 Vérification de la configuration NextAuth...\n');

const checks = {
  'NEXTAUTH_URL': process.env.NEXTAUTH_URL,
  'NEXTAUTH_SECRET': process.env.NEXTAUTH_SECRET,
  'DATABASE_URL': process.env.DATABASE_URL ? '✓ Défini' : undefined,
};

let hasErrors = false;

Object.entries(checks).forEach(([key, value]) => {
  if (!value) {
    console.log(`❌ ${key} : NON DÉFINI`);
    hasErrors = true;
  } else {
    if (key === 'DATABASE_URL') {
      console.log(`✅ ${key} : ${value}`);
    } else {
      console.log(`✅ ${key} : ${value}`);
    }
  }
});

console.log('\n---\n');

if (hasErrors) {
  console.log('⚠️  Il manque des variables d\'environnement !');
  console.log('\n📝 Actions requises :');
  console.log('1. Crée/édite le fichier .env.local à la racine du projet');
  console.log('2. Ajoute les variables manquantes (voir env.example)');
  console.log('3. Redémarre le serveur\n');
  process.exit(1);
} else {
  console.log('✅ Configuration NextAuth OK !');
  
  // Vérifier que NEXTAUTH_URL correspond au port par défaut
  if (process.env.NEXTAUTH_URL && !process.env.NEXTAUTH_URL.includes('3000')) {
    console.log('\n⚠️  ATTENTION : Tu utilises un port différent de 3000');
    console.log(`   Port configuré : ${process.env.NEXTAUTH_URL}`);
    console.log('   Assure-toi de lancer le serveur sur ce port !');
    console.log('   Exemple : npm run dev -- -p 3003');
  } else {
    console.log('\n🚀 Lance le serveur avec : npm run dev');
  }
  
  console.log('');
  process.exit(0);
}

