import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('🧹 FORCE SUPPRESSION de tous les menus et personnalisations...\n');

    // Supprimer toutes les personnalisations d'abord
    console.log('🗑️  Suppression des personnalisations...');
    const result1 = await prisma.customization.deleteMany({});
    console.log(`✅ ${result1.count} personnalisations supprimées`);

    // Supprimer tous les menus
    console.log('🗑️  Suppression de tous les menus...');
    const result2 = await prisma.menu.deleteMany({});
    console.log(`✅ ${result2.count} menus supprimés\n`);

    // Vérifier
    const remainingMenus = await prisma.menu.count();
    const remainingCustomizations = await prisma.customization.count();

    console.log(`📊 Vérification finale :`);
    console.log(`  - ${remainingMenus} menus restants`);
    console.log(`  - ${remainingCustomizations} personnalisations restantes\n`);

    if (remainingMenus === 0 && remainingCustomizations === 0) {
      console.log('✅ SUCCÈS ! Tous les menus et personnalisations ont été supprimés.');
    } else {
      console.log('⚠️  ATTENTION : Il reste encore des données.');
    }
  } catch (error: any) {
    console.error('❌ ERREUR:', error.message);
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();

