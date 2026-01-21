import { prisma } from '../lib/prisma';

async function main() {
  const cat = await prisma.category.findUnique({ where: { slug: 'sandwichs-normaux' } });
  if (!cat) throw new Error("Catégorie 'sandwichs-normaux' introuvable");

  const existing = await prisma.menu.findFirst({
    where: { categoryId: cat.id, title: 'Sandwich Mex' },
    select: { id: true },
  });
  if (existing) {
    console.log('Sandwich Mex existe déjà dans sandwichs-normaux.');
    return;
  }

  // Prix: on copie le prix d'un autre sandwich normal existant (ex: Curry) pour éviter de mettre un prix inventé.
  const ref = await prisma.menu.findFirst({
    where: { categoryId: cat.id },
    orderBy: { createdAt: 'asc' },
    select: { price: true, priceClickAndCollect: true, priceDelivery: true, image: true },
  });
  if (!ref) throw new Error('Aucun sandwich normal existant pour copier le prix.');

  const created = await prisma.menu.create({
    data: {
      title: 'Sandwich Mex',
      description: '3 steaks hachés, œuf, bacon, crudités, fromage - avec boisson 33 cl et 1 frite',
      price: ref.price,
      priceClickAndCollect: ref.priceClickAndCollect,
      priceDelivery: ref.priceDelivery,
      image: ref.image,
      categoryId: cat.id,
      available: true,
      availableForClickAndCollect: true,
      availableForDelivery: true,
      allowDrinkOption: false,
    },
  });

  console.log(`✅ Créé: Sandwich Mex (${created.id})`);
}

main()
  .catch((e) => {
    console.error('Erreur:', e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

