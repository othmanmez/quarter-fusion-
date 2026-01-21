import { prisma } from '../lib/prisma';

async function main() {
  const cat = await prisma.category.findUnique({
    where: { slug: 'sandwichs-au-four' },
  });

  if (!cat) {
    console.log("Catégorie 'sandwichs-au-four' introuvable.");
    return;
  }

  const count = await prisma.menu.count({
    where: { categoryId: cat.id },
  });

  if (count === 0) {
    console.log('Aucun sandwich au four à mettre à jour.');
    return;
  }

  const res = await prisma.menu.updateMany({
    where: { categoryId: cat.id },
    data: {
      price: 10,
      priceClickAndCollect: 10,
      priceDelivery: 12,
    },
  });

  console.log(`✅ Prix mis à jour pour ${res.count} sandwich(s) au four (C&C 10€ / Livraison 12€)`);
}

main()
  .catch((e) => {
    console.error('Erreur:', e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

