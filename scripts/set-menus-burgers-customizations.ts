import { prisma } from '../lib/prisma';

type Option = { name: string; priceExtra: number };

function normalize33clName(title: string) {
  return title.replace(/\s*33cl\s*$/i, '').trim();
}

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

async function main() {
  const burgersCategory = await prisma.category.findUnique({
    where: { slug: 'menus-burgers' },
  });
  if (!burgersCategory) throw new Error("Catégorie 'menus-burgers' introuvable");

  const drinksCategory = await prisma.category.findUnique({
    where: { slug: 'boissons' },
  });
  if (!drinksCategory) throw new Error("Catégorie 'boissons' introuvable");

  const burgerMenus = await prisma.menu.findMany({
    where: { categoryId: burgersCategory.id },
    select: { id: true, title: true },
    orderBy: { title: 'asc' },
  });

  if (burgerMenus.length === 0) {
    console.log('Aucun menu trouvé dans Menus Burgers.');
    return;
  }

  const drinks33cl = await prisma.menu.findMany({
    where: {
      categoryId: drinksCategory.id,
      title: { contains: '33cl' },
    },
    select: { title: true },
    orderBy: { title: 'asc' },
  });

  const drinkOptions: Option[] =
    drinks33cl.length > 0
      ? drinks33cl.map((d) => ({ name: normalize33clName(d.title), priceExtra: 0 }))
      : [
          { name: 'Pepsi', priceExtra: 0 },
          { name: 'Ice Tea', priceExtra: 0 },
          { name: 'Coca', priceExtra: 0 },
          { name: '7 Up', priceExtra: 0 },
          { name: 'Fanta', priceExtra: 0 },
        ];

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

  const cruditesOptions: Option[] = [
    { name: 'Salade', priceExtra: 0 },
    { name: 'Tomate', priceExtra: 0 },
    { name: 'Oignon', priceExtra: 0 },
  ];

  console.log(`Mise à jour des personnalisations pour ${burgerMenus.length} menu(s) burgers...`);
  console.log(`Boissons 33cl trouvées: ${drinkOptions.length}`);

  for (const m of burgerMenus) {
    await upsertCustomization({
      menuId: m.id,
      name: 'Sauces',
      type: 'MULTIPLE_CHOICE',
      required: false,
      maxSelections: 2,
      options: sauceOptions,
    });

    await upsertCustomization({
      menuId: m.id,
      name: 'Boisson 33cl',
      type: 'SINGLE_CHOICE',
      required: true,
      maxSelections: null,
      options: drinkOptions,
    });

    await upsertCustomization({
      menuId: m.id,
      name: 'Crudités',
      type: 'MULTIPLE_CHOICE',
      required: false,
      maxSelections: 3,
      options: cruditesOptions,
    });

    console.log(`✅ ${m.title}`);
  }

  console.log('Terminé.');
}

main()
  .catch((e) => {
    console.error('Erreur:', e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

