import { prisma } from '../lib/prisma';

type Option = { name: string; priceExtra: number };

async function upsertCustomization(params: {
  menuId: string;
  name: string;
  type: 'SINGLE_CHOICE' | 'MULTIPLE_CHOICE' | 'TOGGLE';
  required: boolean;
  maxSelections?: number | null;
  options: Option[];
}) {
  const existing = await prisma.customization.findMany({
    where: { menuId: params.menuId, name: params.name },
    orderBy: { createdAt: 'asc' },
  });

  if (existing.length > 0) {
    const [keep, ...duplicates] = existing;
    if (duplicates.length > 0) {
      await prisma.customization.deleteMany({
        where: { id: { in: duplicates.map((d) => d.id) } },
      });
    }

    return prisma.customization.update({
      where: { id: keep.id },
      data: {
        type: params.type,
        required: params.required,
        maxSelections: params.maxSelections ?? null,
        options: params.options,
      },
    });
  }

  return prisma.customization.create({
    data: {
      menuId: params.menuId,
      name: params.name,
      type: params.type,
      required: params.required,
      maxSelections: params.maxSelections ?? null,
      options: params.options,
    },
  });
}

async function getDrinkOptions120(): Promise<Option[]> {
  const drinksCat = await prisma.category.findUnique({ where: { slug: 'boissons' } });
  if (!drinksCat) return [{ name: 'Coca-Cola', priceExtra: 1.2 }];

  const drinks33 = await prisma.menu.findMany({
    where: { categoryId: drinksCat.id, title: { contains: '33cl' } },
    select: { title: true },
    orderBy: { title: 'asc' },
  });
  if (drinks33.length === 0) return [{ name: 'Coca-Cola', priceExtra: 1.2 }];

  return drinks33.map((d) => ({
    name: d.title.replace(/\s*33cl\s*$/i, '').trim(),
    priceExtra: 1.2,
  }));
}

async function main() {
  const cat = await prisma.category.findUnique({ where: { slug: 'tacos-gratines' } });
  if (!cat) throw new Error("Catégorie 'tacos-gratines' introuvable");

  const title = 'Tacos 2 viandes';
  const existing = await prisma.menu.findFirst({
    where: { categoryId: cat.id, title },
    select: { id: true },
  });

  const baseData = {
    title,
    description: 'Tacos (2 viandes max) - avec frites',
    price: 7.5,
    priceClickAndCollect: 7.5,
    priceDelivery: 8.5,
    image: '/images/placeholder.svg',
    categoryId: cat.id,
    available: true,
    availableForClickAndCollect: true,
    availableForDelivery: true,
    allowDrinkOption: false,
  };

  const menu =
    existing
      ? await prisma.menu.update({ where: { id: existing.id }, data: baseData })
      : await prisma.menu.create({ data: baseData });

  const sauceOptions: Option[] = [
    { name: 'Algérienne', priceExtra: 0 },
    { name: 'Samouraï', priceExtra: 0 },
    { name: 'Ketchup', priceExtra: 0 },
    { name: 'Poivre', priceExtra: 0 },
    { name: 'Blanche', priceExtra: 0 },
    { name: 'Biggy', priceExtra: 0 },
    { name: 'Curry', priceExtra: 0 },
    { name: 'Harissa', priceExtra: 0 },
    { name: 'Mayonnaise', priceExtra: 0 },
  ];

  const meatOptions: Option[] = [
    { name: 'Nugget', priceExtra: 0 },
    { name: 'Viande haché', priceExtra: 0 },
    { name: 'Kebab', priceExtra: 0 },
    { name: 'Escalope', priceExtra: 0 },
    { name: 'Cordon bleu', priceExtra: 0 },
    { name: 'Curry', priceExtra: 0 },
    { name: 'Merguez', priceExtra: 0 },
  ];

  const suppl1e: Option[] = [
    { name: 'CHEDDAR', priceExtra: 1.0 },
    { name: 'CHEVRES', priceExtra: 1.0 },
    { name: 'RACLETTE', priceExtra: 1.0 },
    { name: 'EMMENTAL', priceExtra: 1.0 },
    { name: 'VACHE KI RIT', priceExtra: 1.0 },
    { name: 'BOURSIN', priceExtra: 1.0 },
    { name: 'SALADE', priceExtra: 1.0 },
    { name: 'OIGNONS', priceExtra: 1.0 },
    { name: 'TOMATES', priceExtra: 1.0 },
    { name: 'CHAMPIGNONS', priceExtra: 1.0 },
    { name: 'OEUF', priceExtra: 1.0 },
    { name: 'OLIVES', priceExtra: 1.0 },
    { name: 'POIVRONS', priceExtra: 1.0 },
    { name: 'MAIS', priceExtra: 1.0 },
    { name: 'LARDONS', priceExtra: 1.0 },
    { name: 'JAMBONS DE DINDE', priceExtra: 1.0 },
    { name: 'BACON', priceExtra: 1.0 },
    { name: 'CHORIZO', priceExtra: 1.0 },
    { name: 'SALAMI', priceExtra: 1.0 },
  ];

  const gratineOptions: Option[] = [
    { name: 'CHEDAR', priceExtra: 1.5 },
    { name: 'MOZZARELA', priceExtra: 1.5 },
    { name: 'SAVOYARD', priceExtra: 1.5 },
  ];

  await upsertCustomization({
    menuId: menu.id,
    name: 'Choix des sauces',
    type: 'MULTIPLE_CHOICE',
    required: true,
    maxSelections: 2,
    options: sauceOptions,
  });

  // Viandes: choix multiple, max 2, obligatoire (au moins 1 sélection)
  await upsertCustomization({
    menuId: menu.id,
    name: 'Choix des viandes',
    type: 'MULTIPLE_CHOICE',
    required: true,
    maxSelections: 2,
    options: meatOptions,
  });

  // Boisson: supplément +1,20€ si sélectionné (non obligatoire)
  await prisma.customization.deleteMany({
    where: { menuId: menu.id, name: { in: ['Boisson 33cl', 'Boisson 33cl (+1,20€)'] } },
  });
  await upsertCustomization({
    menuId: menu.id,
    name: 'Boisson 33cl (+1,20€)',
    type: 'SINGLE_CHOICE',
    required: false,
    maxSelections: null,
    options: await getDrinkOptions120(),
  });

  await upsertCustomization({
    menuId: menu.id,
    name: 'Supplément (+1€)',
    type: 'MULTIPLE_CHOICE',
    required: false,
    maxSelections: null,
    options: suppl1e,
  });

  await upsertCustomization({
    menuId: menu.id,
    name: 'Supplément gratiné (+1,50€)',
    type: 'SINGLE_CHOICE',
    required: false,
    maxSelections: null,
    options: gratineOptions,
  });

  console.log(`✅ ${title} créé/mis à jour (${menu.id})`);
}

main()
  .catch((e) => {
    console.error('Erreur:', e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

