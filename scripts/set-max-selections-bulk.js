const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  try {
    const r1 = await prisma.customization.updateMany({
      where: { type: 'MULTIPLE_CHOICE' },
      data: { maxSelections: 2 },
    });

    const r2 = await prisma.customization.updateMany({
      where: { name: 'Crudités', type: 'MULTIPLE_CHOICE' },
      data: { maxSelections: 3 },
    });

    console.log(`✅ MULTIPLE_CHOICE -> 2 : ${r1.count}`);
    console.log(`✅ Crudités -> 3 : ${r2.count}`);
  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
