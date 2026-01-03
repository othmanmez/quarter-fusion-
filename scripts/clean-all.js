const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('🧹 Suppression de tous les menus et personnalisations...\n');

    // Compter avant
    const menuCount = await prisma.menu.count();
    const customizationCount = await prisma.customization.count();
    console.log(`Avant: ${menuCount} menus, ${customizationCount} personnalisations\n`);

    // Supprimer personnalisations
    const delCustom = await prisma.customization.deleteMany({});
    console.log(`✅ ${delCustom.count} personnalisations supprimées`);

    // Supprimer menus
    const delMenus = await prisma.menu.deleteMany({});
    console.log(`✅ ${delMenus.count} menus supprimés\n`);

    // Vérifier
    const remainingMenus = await prisma.menu.count();
    const remainingCustomizations = await prisma.customization.count();
    console.log(`Après: ${remainingMenus} menus, ${remainingCustomizations} personnalisations\n`);

    if (remainingMenus === 0 && remainingCustomizations === 0) {
      console.log('✅ SUCCÈS ! Base de données vide.');
    } else {
      console.log('⚠️  Il reste encore des données.');
    }
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();

