import { prisma } from '../lib/prisma';

const KEEP_TITLES = [
  'Sandwich Boursin',
  'Sandwich Kebab',
  'Sandwich Mex',
  'Sandwich Curry',
  'Sandwich Tandoori',
  'Sandwich Merguez',
] as const;

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
  // éviter les doublons d'espaces/ponctuation
  const sep = base.endsWith('.') ? ' ' : ' - ';
  return `${base}${sep}${suffix}`;
}

async function main() {
  const cat = await prisma.category.findUnique({
    where: { slug: 'sandwichs-normaux' },
  });
  if (!cat) throw new Error("Catégorie 'sandwichs-normaux' introuvable");

  const keepSet = new Set(KEEP_TITLES.map((t) => normalizeTitle(t)));

  const sandwiches = await prisma.menu.findMany({
    where: { categoryId: cat.id },
    select: { id: true, title: true, description: true },
    orderBy: { title: 'asc' },
  });

  const targets = sandwiches.filter((s) => keepSet.has(normalizeTitle(s.title)));
  console.log(`Sandwichs normaux (cibles) : ${targets.length}`);

  for (const s of targets) {
    const nextDesc = ensureSuffix(s.description);
    if ((s.description ?? '').trim() === nextDesc.trim()) {
      console.log(`↩️  inchangé: ${s.title}`);
      continue;
    }
    await prisma.menu.update({
      where: { id: s.id },
      data: { description: nextDesc },
    });
    console.log(`✅ mis à jour: ${s.title}`);
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

