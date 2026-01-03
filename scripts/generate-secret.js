// Script pour générer un NEXTAUTH_SECRET sécurisé
const crypto = require('crypto');

console.log('\n🔐 Génération d\'un secret NEXTAUTH_SECRET sécurisé...\n');

const secret = crypto.randomBytes(32).toString('base64');

console.log('✅ Secret généré :\n');
console.log('─'.repeat(60));
console.log(secret);
console.log('─'.repeat(60));
console.log('\n📋 Copie ce secret et ajoute-le dans Vercel :');
console.log('   Vercel → Settings → Environment Variables');
console.log('   Name: NEXTAUTH_SECRET');
console.log('   Value: [colle le secret ci-dessus]');
console.log('\n⚠️  Ne partage JAMAIS ce secret publiquement !\n');



