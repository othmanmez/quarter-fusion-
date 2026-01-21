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

async function main() {
  const cat = await prisma.category.findUnique({
    where: { slug: 'sandwichs-normaux' },
  });
  if (!cat) throw new Error("Catégorie 'sandwichs-normaux' introuvable");

  const all = await prisma.menu.findMany({
    where: { categoryId: cat.id },
    select: { id: true, title: true, createdAt: true },
    orderBy: { createdAt: 'asc' },
  });

  if (all.length === 0) {
    console.log('Aucun sandwich normal à nettoyer.');
    return;
  }

  const keepSet = new Set(KEEP_TITLES.map((t) => normalizeTitle(t)));

  // Grouper par titre normalisé
  const byTitle = new Map<string, { id: string; title: string; createdAt: Date }[]>();
  for (const m of all) {
    const key = normalizeTitle(m.title);
    const arr = byTitle.get(key) ?? [];
    arr.push({ id: m.id, title: m.title, createdAt: m.createdAt });
    byTitle.set(key, arr);
  }

  const idsToKeep: string[] = [];
  const idsToDelete: string[] = [];

  // 1) Pour les titres à garder: garder 1 et supprimer les doublons
  for (const desiredTitle of KEEP_TITLES) {
    const key = normalizeTitle(desiredTitle);
    const matches = byTitle.get(key) ?? [];
    if (matches.length === 0) {
      console.warn(`⚠️ Introuvable: ${desiredTitle}`);
      continue;
    }

    // On garde le plus ancien (createdAt asc) pour stabilité
    const [keep, ...dupes] = matches.sort((a, b) => +a.createdAt - +b.createdAt);
    idsToKeep.push(keep.id);
    idsToDelete.push(...dupes.map((d) => d.id));
  }

  // 2) Tout ce qui n'est pas dans la liste KEEP_TITLES = supprimé
  for (const m of all) {
    const key = normalizeTitle(m.title);
    if (!keepSet.has(key)) {
      idsToDelete.push(m.id);
    }
  }

  // Dédupliquer la liste des suppressions et retirer ceux à conserver
  const keepIdSet = new Set(idsToKeep);
  const uniqueDelete = Array.from(new Set(idsToDelete)).filter((id) => !keepIdSet.has(id));

  console.log(`Sandwichs normaux trouvés: ${all.length}`);
  console.log(`À conserver: ${idsToKeep.length}`);
  console.log(`À supprimer: ${uniqueDelete.length}`);

  if (uniqueDelete.length === 0) {
    console.log('Rien à supprimer.');
    return;
  }

  const res = await prisma.menu.deleteMany({
    where: { id: { in: uniqueDelete } },
  });

  console.log(`✅ Supprimé: ${res.count}`);
}

main()
  .catch((e) => {
    console.error('Erreur:', e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

