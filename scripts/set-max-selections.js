const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  try {
    const names = ['Choix de sauce', 'Choix de sauces', 'Sauces au choix', 'Sauce'];
    const result = await prisma.customization.updateMany({
      where: {
        name: { in: names },
        type: 'MULTIPLE_CHOICE'
      },
      data: { maxSelections: 2 }
    });
    console.log(`✅ ${result.count} personnalisations mises à max 2 choix`);
  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
