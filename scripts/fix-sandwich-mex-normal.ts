import { prisma } from '../lib/prisma';

type Option = { name: string; priceExtra: number };

function normalizeTitle(t: string) {
  return t.trim().toLowerCase().replace(/\s+/g, ' ');
}

function ensureSuffix(description: string) {
  const base = (description ?? '').trim();
  const suffix = 'avec boisson 33 cl et 1 frite';
  const already =
    /boisson\s*33\s*cl/i.test(base) && /\bfrit(e|es)\b/i.test(base);
  if (already) return base;
  if (!base) return suffix;
  const sep = base.endsWith('.') ? ' ' : ' - ';
  return `${base}${sep}${suffix}`;
}

async function findMexCandidates() {
  // Prisma + Mongo: "mode: 'insensitive'" peut ne pas être supporté selon versions.
  try {
    return await prisma.menu.findMany({
      where: { title: { contains: 'mex', mode: 'insensitive' as any } },
      select: { id: true, title: true, categoryId: true, createdAt: true },
      orderBy: { createdAt: 'asc' },
    });
  } catch {
    const a = await prisma.menu.findMany({
      where: { OR: [{ title: { contains: 'Mex' } }, { title: { contains: 'MEX' } }, { title: { contains: 'mex' } }] },
      select: { id: true, title: true, categoryId: true, createdAt: true },
      orderBy: { createdAt: 'asc' },
    });
    return a;
  }
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
    where: { slug: 'sandwichs-normaux' },
  });
  if (!sandwichCat) throw new Error("Catégorie 'sandwichs-normaux' introuvable");

  const drinksCat = await prisma.category.findUnique({ where: { slug: 'boissons' } });
  if (!drinksCat) throw new Error("Catégorie 'boissons' introuvable");

  const drinks33cl = await prisma.menu.findMany({
    where: { categoryId: drinksCat.id, title: { contains: '33cl' } },
    select: { title: true },
    orderBy: { title: 'asc' },
  });

  const drinkOptions: Option[] =
    drinks33cl.length > 0
      ? drinks33cl.map((d) => ({ name: d.title.replace(/\s*33cl\s*$/i, '').trim(), priceExtra: 0 }))
      : [
          { name: 'Pepsi', priceExtra: 0 },
          { name: 'Ice Tea', priceExtra: 0 },
          { name: 'Coca', priceExtra: 0 },
          { name: '7 Up', priceExtra: 0 },
          { name: 'Fanta', priceExtra: 0 },
        ];

  const candidates = await findMexCandidates();
  const exact = candidates.filter((m) => normalizeTitle(m.title) === 'sandwich mex');

  if (exact.length === 0) {
    console.log('Aucun "Sandwich Mex" trouvé dans la base. Rien à faire.');
    return;
  }

  // Choisir celui à garder: déjà dans sandwichs-normaux si possible, sinon le plus ancien
  const alreadyInCat = exact.find((m) => m.categoryId === sandwichCat.id);
  const keep = alreadyInCat ?? exact[0];
  const toDelete = exact.filter((m) => m.id !== keep.id);

  // Mettre le keep dans la bonne catégorie
  await prisma.menu.update({
    where: { id: keep.id },
    data: { categoryId: sandwichCat.id },
  });

  // Supprimer les doublons exacts "Sandwich Mex"
  if (toDelete.length > 0) {
    await prisma.menu.deleteMany({
      where: { id: { in: toDelete.map((d) => d.id) } },
    });
  }

  // Mettre à jour la description
  const fresh = await prisma.menu.findUnique({
    where: { id: keep.id },
    select: { description: true, title: true },
  });
  if (fresh) {
    await prisma.menu.update({
      where: { id: keep.id },
      data: { description: ensureSuffix(fresh.description) },
    });
  }

  // Appliquer les personnalisations obligatoires pour sandwich normal
  const breadOptions: Option[] = [
    { name: 'Pain normal', priceExtra: 0 },
    { name: 'Tortilla', priceExtra: 0 },
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

  await prisma.menu.update({
    where: { id: keep.id },
    data: { allowDrinkOption: false },
  });

  await upsertCustomization({
    menuId: keep.id,
    name: 'Type de pain',
    type: 'SINGLE_CHOICE',
    required: true,
    maxSelections: null,
    options: breadOptions,
  });
  await upsertCustomization({
    menuId: keep.id,
    name: 'Sauces',
    type: 'MULTIPLE_CHOICE',
    required: true,
    maxSelections: 2,
    options: sauceOptions,
  });
  await upsertCustomization({
    menuId: keep.id,
    name: 'Crudités',
    type: 'MULTIPLE_CHOICE',
    required: true,
    maxSelections: 3,
    options: cruditesOptions,
  });
  await upsertCustomization({
    menuId: keep.id,
    name: 'Boisson 33cl',
    type: 'SINGLE_CHOICE',
    required: true,
    maxSelections: null,
    options: drinkOptions,
  });

  console.log(`✅ Sandwich Mex corrigé. Doublons supprimés: ${toDelete.length}`);
}

main()
  .catch((e) => {
    console.error('Erreur:', e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

