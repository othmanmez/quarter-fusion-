const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  try {
    const names = ['Choix de sauce', 'Sauce'];
    const result = await prisma.customization.updateMany({
      where: { name: { in: names } },
      data: { type: 'MULTIPLE_CHOICE' },
    });
    console.log(`✅ ${result.count} personnalisations mises en choix multiple`);
  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
