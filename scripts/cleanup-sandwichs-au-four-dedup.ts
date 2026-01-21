import { prisma } from '../lib/prisma';

const KEEP_TITLES = [
  'Sandwich Boursin (au four)',
  'Sandwich Curry (au four)',
  'Sandwich Kebab (au four)',
  'Sandwich Mex (au four)',
  'Sandwich Tandoori (au four)',
  'Sandwich Merguez (au four)',
] as const;

function normalizeTitle(t: string) {
  return t.trim().toLowerCase().replace(/\s+/g, ' ');
}

async function main() {
  const cat = await prisma.category.findUnique({
    where: { slug: 'sandwichs-au-four' },
  });
  if (!cat) throw new Error("Catégorie 'sandwichs-au-four' introuvable");

  const all = await prisma.menu.findMany({
    where: { categoryId: cat.id },
    select: { id: true, title: true, createdAt: true },
    orderBy: { createdAt: 'asc' },
  });

  if (all.length === 0) {
    console.log('Aucun sandwich au four à nettoyer.');
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

  // Garder 1 de chaque titre demandé, supprimer les doublons
  for (const desiredTitle of KEEP_TITLES) {
    const key = normalizeTitle(desiredTitle);
    const matches = byTitle.get(key) ?? [];
    if (matches.length === 0) {
      console.warn(`⚠️ Introuvable: ${desiredTitle}`);
      continue;
    }
    const [keep, ...dupes] = matches.sort((a, b) => +a.createdAt - +b.createdAt);
    idsToKeep.push(keep.id);
    idsToDelete.push(...dupes.map((d) => d.id));
  }

  // Supprimer tout ce qui n'est pas dans la liste KEEP_TITLES
  for (const m of all) {
    const key = normalizeTitle(m.title);
    if (!keepSet.has(key)) {
      idsToDelete.push(m.id);
    }
  }

  const keepIdSet = new Set(idsToKeep);
  const uniqueDelete = Array.from(new Set(idsToDelete)).filter((id) => !keepIdSet.has(id));

  console.log(`Sandwichs au four trouvés: ${all.length}`);
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

