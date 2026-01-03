import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('🧹 Suppression de tous les menus et personnalisations...\n');

    // Compter avant suppression
    const menuCount = await prisma.menu.count();
    const customizationCount = await prisma.customization.count();

    console.log(`📊 Avant suppression :`);
    console.log(`  - ${menuCount} menus`);
    console.log(`  - ${customizationCount} personnalisations\n`);

    // Supprimer toutes les personnalisations d'abord
    console.log('🗑️  Suppression des personnalisations...');
    const deletedCustomizations = await prisma.customization.deleteMany({});
    console.log(`✅ ${deletedCustomizations.count} personnalisations supprimées\n`);

    // Supprimer tous les menus
    console.log('🗑️  Suppression de tous les menus...');
    const deletedMenus = await prisma.menu.deleteMany({});
    console.log(`✅ ${deletedMenus.count} menus supprimés\n`);

    // Vérifier après suppression
    const remainingMenus = await prisma.menu.count();
    const remainingCustomizations = await prisma.customization.count();

    console.log(`📊 Après suppression :`);
    console.log(`  - ${remainingMenus} menus restants`);
    console.log(`  - ${remainingCustomizations} personnalisations restantes\n`);

    if (remainingMenus === 0 && remainingCustomizations === 0) {
      console.log('🎉 Suppression terminée ! Le site est maintenant vide, prêt pour une nouvelle création.');
    } else {
      console.log('⚠️  Il reste encore des données dans la base.');
    }
  } catch (error) {
    console.error('❌ Erreur lors de la suppression:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error('❌ Erreur:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

