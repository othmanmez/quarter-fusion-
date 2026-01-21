const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  try {
    const drinksCategory = await prisma.category.findUnique({
      where: { slug: 'boissons' },
      select: { id: true },
    });

    if (!drinksCategory) {
      console.log('❌ Catégorie "boissons" introuvable.');
      return;
    }

    const result = await prisma.menu.updateMany({
      where: { categoryId: drinksCategory.id },
      data: {
        description: '',
        price: 1.5,
        priceClickAndCollect: 1.5,
        priceDelivery: 2.0,
      },
    });

    console.log(`✅ ${result.count} boissons mises à jour`);
  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
