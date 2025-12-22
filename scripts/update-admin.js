require('dotenv').config({ path: '.env.local' });
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function updateAdmin() {
  try {
    console.log('🔧 Mise à jour du compte administrateur...');

    const adminEmail = process.env.ADMIN_EMAIL || 'quarterfusion@gmail.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

    // Supprimer les anciens utilisateurs s'ils existent
    const oldUsers = ['samy@quarterfusion.com', 'issa@quarterfusion.com'];
    for (const email of oldUsers) {
      const oldUser = await prisma.user.findUnique({
        where: { email }
      });

      if (oldUser && email !== adminEmail) {
        await prisma.user.delete({
          where: { email }
        });
        console.log(`✅ Ancien utilisateur ${email} supprimé`);
      }
    }

    // Créer ou mettre à jour le compte administrateur
    const hashedPassword = await bcrypt.hash(adminPassword, 12);

    const user = await prisma.user.upsert({
      where: { email: adminEmail },
      update: {
        password: hashedPassword,
        role: 'ADMIN',
        active: true,
        name: 'Admin'
      },
      create: {
        email: adminEmail,
        password: hashedPassword,
        name: 'Admin',
        role: 'ADMIN',
        active: true
      }
    });

    console.log('✅ Compte administrateur configuré !');
    console.log('\n📱 Identifiants de connexion :');
    console.log(`Email: ${adminEmail}`);
    console.log(`Mot de passe: ${adminPassword}`);
    console.log('\n🌐 Connexion : http://localhost:3000/admin');

  } catch (error) {
    console.error('❌ Erreur:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

updateAdmin();

