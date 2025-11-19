const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function updateAdmin() {
  try {
    console.log('🔧 Mise à jour du compte administrateur...');
    
    // Supprimer l'ancien utilisateur s'il existe
    const oldUser = await prisma.user.findUnique({
      where: { email: 'samy@quarterfusion.com' }
    });
    
    if (oldUser) {
      await prisma.user.delete({
        where: { email: 'samy@quarterfusion.com' }
      });
      console.log('✅ Ancien utilisateur supprimé');
    }
    
    // Créer ou mettre à jour le nouvel utilisateur
    const hashedPassword = await bcrypt.hash('Issa2025', 12);
    
    const user = await prisma.user.upsert({
      where: { email: 'issa@quarterfusion.com' },
      update: {
        password: hashedPassword,
        role: 'ADMIN',
        active: true,
        name: 'Issa'
      },
      create: {
        email: 'issa@quarterfusion.com',
        password: hashedPassword,
        name: 'Issa',
        role: 'ADMIN',
        active: true
      }
    });
    
    console.log('✅ Compte administrateur configuré !');
    console.log('\n📱 Identifiants de connexion :');
    console.log('Email: issa@quarterfusion.com');
    console.log('Mot de passe: Issa2025');
    console.log('\n🌐 Connexion : http://localhost:3000/admin');
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

updateAdmin();

