/**
 * Script pour mettre à jour les images des menus au poulet
 * avec les images générées IA (box Quarter Fusion)
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const IMAGE_MAPPING: Array<{
  pattern: RegExp | ((title: string) => boolean);
  image: string;
}> = [
  // Menu Duo (box Quarter Fusion)
  { pattern: /^menu duo$/i, image: '/images/menu-duo-quarter-fusion-box.png' },

  // Menus à partager (box Quarter Fusion)
  {
    pattern: (t) => /^menu (fusion|max fusion)$/i.test(t.trim()),
    image: '/images/menu-a-partager-mixte-quarter-fusion-box.png',
  },
  {
    pattern: (t) => /^menu giga$/i.test(t.trim()),
    image: '/images/menu-a-partager-tenders-quarter-fusion-box.png',
  },
  {
    pattern: (t) =>
      /^menu (classique|m[eé]ga|ultra|mixte|big mixte)$/i.test(t.trim()),
    image: '/images/menu-a-partager-wings-quarter-fusion-box.png',
  },

  // Tacos (plateau + vraie canette Coca)
  { pattern: /^tacos gratin[ée]$/i, image: '/images/tacos-plateau-coca.png' },

  // Menus burgers (plateau + vraie canette Coca)
  { pattern: /^menu a[1-6]$/i, image: '/images/menu-burgers-plateau-coca.png' },

  // Menus mixtes solo (wings + tenders) - box Quarter Fusion
  {
    pattern: (t) =>
      /menu solo mixte/i.test(t),
    image: '/images/mixte-quarter-fusion.png',
  },
  // Wings
  { pattern: /wings/i, image: '/images/wings-quarter-fusion.png' },
  // Tenders
  { pattern: /tenders/i, image: '/images/tenders-quarter-fusion.png' },
  // Nuggets
  { pattern: /nuggets/i, image: '/images/nuggets-quarter-fusion.png' },
];

async function main() {
  console.log('🍗 Mise à jour des images des menus au poulet...\n');

  const menus = await prisma.menu.findMany({
    select: { id: true, title: true, image: true },
  });

  let updated = 0;
  for (const menu of menus) {
    for (const { pattern, image } of IMAGE_MAPPING) {
      const matches =
        typeof pattern === 'function'
          ? pattern(menu.title)
          : pattern.test(menu.title);

      if (matches) {
        await prisma.menu.update({
          where: { id: menu.id },
          data: { image },
        });
        console.log(`✅ ${menu.title} → ${image}`);
        updated++;
        break;
      }
    }
  }

  console.log(`\n🎉 ${updated} menus mis à jour avec les images Quarter Fusion`);
}

main()
  .catch((e) => {
    console.error('❌ Erreur:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
