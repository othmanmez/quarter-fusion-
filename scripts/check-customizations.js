const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  try {
    const items = await prisma.customization.findMany({
      select: { name: true, type: true },
    });
    const byName = {};
    for (const c of items) {
      byName[c.name] = byName[c.name] || {};
      byName[c.name][c.type] = (byName[c.name][c.type] || 0) + 1;
    }
    console.log(byName);
  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
