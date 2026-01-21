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
  const drinksCategory = await prisma.category.findUnique({ where: { slug: 'boissons' } });
  if (!drinksCategory) throw new Error("Catégorie 'boissons' introuvable");

  const drinks33cl = await prisma.menu.findMany({
    where: { categoryId: drinksCategory.id, title: { contains: '33cl' } },
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

  const categories = await prisma.category.findMany({
    where: { slug: { in: ['menus-solo', 'menus-duo'] } },
    select: { id: true, slug: true, name: true },
  });

  if (categories.length === 0) {
    throw new Error("Catégories 'menus-solo' / 'menus-duo' introuvables");
  }

  console.log(`Boissons 33cl trouvées: ${drinkOptions.length}`);

  for (const cat of categories) {
    const menus = await prisma.menu.findMany({
      where: { categoryId: cat.id },
      select: { id: true, title: true },
      orderBy: { title: 'asc' },
    });

    console.log(`\nMise à jour pour ${cat.name} (${cat.slug}) : ${menus.length} menu(s)`);

    for (const m of menus) {
      await upsertCustomization({
        menuId: m.id,
        name: 'Sauces',
        type: 'MULTIPLE_CHOICE',
        required: false,
        maxSelections: 2,
        options: sauceOptions,
      });

      // Menus Duo: 2 boissons 33cl max (choix multiple)
      if (cat.slug === 'menus-duo') {
        // Nettoyage: supprimer l'ancienne personnalisation éventuelle "Boisson 33cl"
        await prisma.customization.deleteMany({
          where: { menuId: m.id, name: 'Boisson 33cl' },
        });

        await upsertCustomization({
          menuId: m.id,
          name: 'Boissons 33cl',
          type: 'MULTIPLE_CHOICE',
          required: true,
          maxSelections: 2,
          options: drinkOptions,
        });
      } else {
        // Menus Solo: 1 boisson 33cl (choix unique)
        await prisma.customization.deleteMany({
          where: { menuId: m.id, name: 'Boissons 33cl' },
        });

        await upsertCustomization({
          menuId: m.id,
          name: 'Boisson 33cl',
          type: 'SINGLE_CHOICE',
          required: true,
          maxSelections: null,
          options: drinkOptions,
        });
      }

      console.log(`✅ ${m.title}`);
    }
  }

  // Cas particulier: "Menu Duo Mixte" si jamais il n'est pas rangé dans la catégorie menus-duo
  const duoMixteCandidates = await prisma.menu.findMany({
    select: { id: true, title: true },
  });
  const duoMixte = duoMixteCandidates.filter((m) =>
    /menu\s+duo\s+mixte/i.test(m.title)
  );

  if (duoMixte.length > 0) {
    console.log(`\nCas particulier: application sur ${duoMixte.length} menu(s) "Menu Duo Mixte"`);
    for (const m of duoMixte) {
      await upsertCustomization({
        menuId: m.id,
        name: 'Sauces',
        type: 'MULTIPLE_CHOICE',
        required: false,
        maxSelections: 2,
        options: sauceOptions,
      });

      await prisma.customization.deleteMany({
        where: { menuId: m.id, name: 'Boisson 33cl' },
      });

      await upsertCustomization({
        menuId: m.id,
        name: 'Boissons 33cl',
        type: 'MULTIPLE_CHOICE',
        required: true,
        maxSelections: 2,
        options: drinkOptions,
      });

      console.log(`✅ ${m.title}`);
    }
  }

  console.log('\nTerminé.');
}

main()
  .catch((e) => {
    console.error('Erreur:', e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

