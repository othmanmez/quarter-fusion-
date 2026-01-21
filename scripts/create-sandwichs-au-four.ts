import { prisma } from '../lib/prisma';

type SandwichAuFourSeed = {
  title: string;
  composition: string;
};

const SANDWICHS_AU_FOUR: SandwichAuFourSeed[] = [
  {
    title: 'X-TREME',
    composition: '3 steaks, fromage, dinde, œuf',
  },
  {
    title: 'RADICAL',
    composition: 'cordon bleu, steak, œuf, fromage',
  },
  {
    title: 'INDIANNA',
    composition: 'chicken curry, fromage',
  },
  {
    title: 'CURRY TENDERS',
    composition: 'tenders de poulet, poulet mariné au curry, fromage',
  },
  {
    title: 'ESCALOPE BOURSIN',
    composition: 'poulet, boursin, champignons, fines herbes, fromage',
  },
  {
    title: 'GREC MERGUEZ',
    composition: 'merguez, kebab, fromage',
  },
  {
    title: 'FORESTIER',
    composition: 'escalope, champignons, crème fraîche, fromage, jambon de dinde',
  },
];

async function main() {
  const cat = await prisma.category.findUnique({
    where: { slug: 'sandwichs-au-four' },
  });
  if (!cat) throw new Error("Catégorie 'sandwichs-au-four' introuvable");

  // Référence prix: on copie un sandwich normal (ou n'importe quel menu) pour éviter d'inventer un prix
  const priceRef =
    (await prisma.menu.findFirst({
      where: { category: { slug: 'sandwichs-normaux' } },
      orderBy: { createdAt: 'asc' },
      select: { price: true, priceClickAndCollect: true, priceDelivery: true, image: true },
    })) ??
    (await prisma.menu.findFirst({
      orderBy: { createdAt: 'asc' },
      select: { price: true, priceClickAndCollect: true, priceDelivery: true, image: true },
    }));

  if (!priceRef) throw new Error('Aucun menu existant pour copier les prix.');

  const createdTitles: string[] = [];
  const skippedTitles: string[] = [];

  for (const s of SANDWICHS_AU_FOUR) {
    const fullTitle = `${s.title} (au four)`;
    const existing = await prisma.menu.findFirst({
      where: { categoryId: cat.id, title: fullTitle },
      select: { id: true },
    });
    if (existing) {
      skippedTitles.push(fullTitle);
      continue;
    }

    const description = `${s.composition}, avec frites et 1 boisson 33 cl`;

    await prisma.menu.create({
      data: {
        title: fullTitle,
        description,
        price: priceRef.price,
        priceClickAndCollect: priceRef.priceClickAndCollect,
        priceDelivery: priceRef.priceDelivery,
        image: priceRef.image || '/images/placeholder.svg',
        categoryId: cat.id,
        available: true,
        availableForClickAndCollect: true,
        availableForDelivery: true,
        allowDrinkOption: false,
      },
    });

    createdTitles.push(fullTitle);
  }

  console.log(`✅ Créés: ${createdTitles.length}`);
  for (const t of createdTitles) console.log(`  - ${t}`);

  if (skippedTitles.length > 0) {
    console.log(`↩️ Déjà présents (ignorés): ${skippedTitles.length}`);
    for (const t of skippedTitles) console.log(`  - ${t}`);
  }
}

main()
  .catch((e) => {
    console.error('Erreur:', e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

