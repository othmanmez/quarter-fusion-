import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { config } from 'dotenv';

// Charger les variables d'environnement
config({ path: '.env.local' });

const prisma = new PrismaClient();

async function createAdminUser() {
  try {
    console.log('🔧 Création du compte administrateur...');

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email: 'Issa2025' }
    });

    if (existingUser) {
      console.log('⚠️  L\'utilisateur existe déjà !');
      
      // Mettre à jour le mot de passe
      const hashedPassword = await bcrypt.hash('quarterfusion', 12);
      await prisma.user.update({
        where: { email: 'Issa2025' },
        data: { 
          password: hashedPassword,
          role: 'ADMIN',
          active: true,
          name: 'quarterfusion'
        }
      });
      console.log('✅ Mot de passe mis à jour !');
    } else {
      // Créer le nouvel utilisateur
      const hashedPassword = await bcrypt.hash('quarterfusion', 12);
      
      const newUser = await prisma.user.create({
        data: {
          email: 'Issa2025',
          password: hashedPassword,
          name: 'quarterfusion',
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
    console.log('2. Email: Issa2025');
    console.log('3. Mot de passe: quarterfusion');

  } catch (error) {
    console.error('❌ Erreur lors de la création:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdminUser();