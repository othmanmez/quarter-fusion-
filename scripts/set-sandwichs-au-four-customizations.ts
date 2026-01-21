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
  const sandwichCat = await prisma.category.findUnique({
    where: { slug: 'sandwichs-au-four' },
  });
  if (!sandwichCat) throw new Error("Catégorie 'sandwichs-au-four' introuvable");

  const drinksCat = await prisma.category.findUnique({ where: { slug: 'boissons' } });
  if (!drinksCat) throw new Error("Catégorie 'boissons' introuvable");

  const drinks33cl = await prisma.menu.findMany({
    where: { categoryId: drinksCat.id, title: { contains: '33cl' } },
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
    { name: 'Oignons', priceExtra: 0 },
  ];

  // Suppléments (non obligatoires)
  const supplFromages: Option[] = [
    { name: 'Cheddar', priceExtra: 1.0 },
    { name: 'Chèvre', priceExtra: 1.0 },
    { name: 'Raclette', priceExtra: 1.0 },
    { name: 'Emmental', priceExtra: 1.0 },
    { name: 'Vache kiri', priceExtra: 1.0 },
    { name: 'Boursin', priceExtra: 1.0 },
  ];

  const supplLegumes: Option[] = [
    { name: 'Salade', priceExtra: 0.5 },
    { name: 'Tomate', priceExtra: 0.5 },
    { name: 'Oignons', priceExtra: 0.5 },
    { name: 'Champignons', priceExtra: 0.5 },
    { name: 'Œuf', priceExtra: 0.5 },
    { name: 'Olive', priceExtra: 0.5 },
    { name: 'Poivrons', priceExtra: 0.5 },
    { name: 'Maïs', priceExtra: 0.5 },
  ];

  const supplViandes: Option[] = [
    { name: 'Lardons', priceExtra: 1.5 },
    { name: 'Jambon de dinde', priceExtra: 1.5 },
    { name: 'Salami', priceExtra: 1.5 },
    { name: 'Chorizo', priceExtra: 1.5 },
  ];

  const sandwiches = await prisma.menu.findMany({
    where: { categoryId: sandwichCat.id },
    select: { id: true, title: true },
    orderBy: { title: 'asc' },
  });

  console.log(`Boissons 33cl trouvées: ${drinkOptions.length}`);
  console.log(`Sandwichs au four trouvés: ${sandwiches.length}`);

  for (const s of sandwiches) {
    // éviter double option boisson
    await prisma.menu.update({
      where: { id: s.id },
      data: { allowDrinkOption: false },
    });

    // Obligatoires
    await upsertCustomization({
      menuId: s.id,
      name: 'Sauces',
      type: 'MULTIPLE_CHOICE',
      required: true,
      maxSelections: 2,
      options: sauceOptions,
    });
    await upsertCustomization({
      menuId: s.id,
      name: 'Crudités',
      type: 'MULTIPLE_CHOICE',
      required: true,
      maxSelections: 3,
      options: cruditesOptions,
    });
    await upsertCustomization({
      menuId: s.id,
      name: 'Boisson 33cl',
      type: 'SINGLE_CHOICE',
      required: true,
      maxSelections: null,
      options: drinkOptions,
    });

    // Suppléments (non obligatoires)
    await upsertCustomization({
      menuId: s.id,
      name: 'Suppléments Fromages (+1€)',
      type: 'MULTIPLE_CHOICE',
      required: false,
      maxSelections: null,
      options: supplFromages,
    });
    await upsertCustomization({
      menuId: s.id,
      name: 'Suppléments (+0,50€)',
      type: 'MULTIPLE_CHOICE',
      required: false,
      maxSelections: null,
      options: supplLegumes,
    });
    await upsertCustomization({
      menuId: s.id,
      name: 'Suppléments (+1,50€)',
      type: 'MULTIPLE_CHOICE',
      required: false,
      maxSelections: null,
      options: supplViandes,
    });

    console.log(`✅ ${s.title}`);
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

