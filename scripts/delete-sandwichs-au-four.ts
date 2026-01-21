import { prisma } from '../lib/prisma';

async function main() {
  const cat = await prisma.category.findUnique({
    where: { slug: 'sandwichs-au-four' },
  });

  if (!cat) {
    console.log("Catégorie 'sandwichs-au-four' introuvable. Rien à supprimer.");
    return;
  }

  const count = await prisma.menu.count({
    where: { categoryId: cat.id },
  });

  if (count === 0) {
    console.log('Aucun sandwich au four à supprimer.');
    return;
  }

  const res = await prisma.menu.deleteMany({
    where: { categoryId: cat.id },
  });

  console.log(`✅ Sandwichs au four supprimés: ${res.count}`);
}

main()
  .catch((e) => {
    console.error('Erreur:', e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

