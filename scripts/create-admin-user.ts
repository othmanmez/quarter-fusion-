import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { config } from 'dotenv';

// Charger les variables d'environnement
config({ path: '.env.local' });
config({ path: '.env' });

const prisma = new PrismaClient();

async function createAdminUser() {
  try {
    console.log('🔧 Création du compte administrateur...');
    console.log('📡 Connexion à la base de données...');

    // Test de connexion
    await prisma.$connect();
    console.log('✅ Connecté à la base de données !');

    // Vérifier si l'utilisateur existe déjà
    console.log('🔍 Vérification de l\'utilisateur issa@quarterfusion.com...');
    const existingUser = await prisma.user.findUnique({
      where: { email: 'issa@quarterfusion.com' }
    });

    if (existingUser) {
      console.log('⚠️  L\'utilisateur existe déjà !');
      
      // Mettre à jour le mot de passe
      const hashedPassword = await bcrypt.hash('Issa2025', 12);
      await prisma.user.update({
        where: { email: 'issa@quarterfusion.com' },
        data: { 
          password: hashedPassword,
          role: 'ADMIN',
          active: true,
          name: 'Issa'
        }
      });
      console.log('✅ Mot de passe mis à jour !');
    } else {
      // Créer le nouvel utilisateur
      const hashedPassword = await bcrypt.hash('Issa2025', 12);
      
      const newUser = await prisma.user.create({
        data: {
          email: 'issa@quarterfusion.com',
          password: hashedPassword,
          name: 'Issa',
          role: 'ADMIN',
          active: true,
        }
      });

      console.log('✅ Utilisateur administrateur créé avec succès !');
      console.log(`📧 Email: ${newUser.email}`);
      console.log(`👤 Nom: ${newUser.name}`);
      console.log(`🔑 Rôle: ${newUser.role}`);
    }

    console.log('\n🎉 Configuration terminée !');
    console.log('\n📱 Pour accéder au panel admin :');
    console.log('1. Allez sur: http://localhost:3000/admin');
    console.log('2. Email: issa@quarterfusion.com');
    console.log('3. Mot de passe: Issa2025');

  } catch (error) {
    console.error('❌ Erreur lors de la création:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdminUser();