const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  try {
    const category = await prisma.category.findUnique({
      where: { slug: 'chicken-fried' },
      select: { id: true },
    });

    if (!category) {
      console.log('❌ Catégorie "chicken-fried" introuvable.');
      return;
    }

    const menus = await prisma.menu.findMany({
      where: { categoryId: category.id },
      select: { id: true },
    });

    const menuIds = menus.map((m) => m.id);

    const result = await prisma.customization.updateMany({
      where: {
        menuId: { in: menuIds },
        name: { in: ['Choix de sauce', 'Sauce'] },
        type: 'MULTIPLE_CHOICE',
      },
      data: { maxSelections: 2 },
    });

    await prisma.menu.updateMany({
      where: { id: { in: menuIds } },
      data: {
        availableForClickAndCollect: true,
        availableForDelivery: true,
      },
    });

    console.log(`✅ Chicken Fried: max 2 sauces appliqué à ${result.count} personnalisations`);
    console.log('✅ Disponibilité Click & Collect + Livraison activée');
  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
