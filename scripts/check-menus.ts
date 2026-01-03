import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    const menuCount = await prisma.menu.count();
    const customizationCount = await prisma.customization.count();
    
    console.log('📊 État actuel de la base de données :');
    console.log(`  - ${menuCount} menus`);
    console.log(`  - ${customizationCount} personnalisations`);
    
    if (menuCount === 0 && customizationCount === 0) {
      console.log('\n✅ La base de données est vide, prête pour une nouvelle création !');
    } else {
      console.log('\n⚠️  Il reste encore des données dans la base.');
    }
  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();

