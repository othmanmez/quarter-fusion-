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

async function main() {
  const category = await prisma.category.findUnique({
    where: { slug: 'menus-a-partager' },
  });

  if (!category) {
    throw new Error("Catégorie 'menus-a-partager' introuvable");
  }

  const menus = await prisma.menu.findMany({
    where: { categoryId: category.id },
    select: { id: true, title: true },
    orderBy: { title: 'asc' },
  });

  if (menus.length === 0) {
    console.log('Aucun menu trouvé dans Menus à Partager.');
    return;
  }

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

  const drinkOptions: Option[] = [
    { name: 'Pepsi', priceExtra: 0 },
    { name: 'Ice Tea', priceExtra: 0 },
    { name: 'Coca', priceExtra: 0 },
    { name: '7 Up', priceExtra: 0 },
    { name: 'Fanta', priceExtra: 0 },
  ];

  console.log(`Mise à jour des personnalisations pour ${menus.length} menu(s) à partager...`);

  for (const m of menus) {
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
      name: 'Boisson',
      type: 'SINGLE_CHOICE',
      required: true,
      maxSelections: null,
      options: drinkOptions,
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

