const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
      select: { name: true, slug: true },
    });

    console.log(`Catégories: ${categories.length}`);
    categories.forEach((cat) => console.log(`- ${cat.name} (${cat.slug})`));
  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
