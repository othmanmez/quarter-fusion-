require('dotenv').config({ path: '.env.local' });
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkBadges() {
  try {
    console.log('🔍 Vérification des plats avec badges...\n');

    const menusWithBadges = await prisma.menu.findMany({
      where: {
        badge: {
          in: ['HOT', 'NEW', 'TOP']
        },
        available: true
      },
      orderBy: [
        { badge: 'asc' },
        { createdAt: 'desc' }
      ]
    });

    console.log(`📊 Total des plats avec badges : ${menusWithBadges.length}\n`);

    menusWithBadges.forEach((menu, index) => {
      console.log(`${index + 1}. ${menu.title}`);
      console.log(`   Badge: ${menu.badge}`);
      console.log(`   Prix: ${menu.price}€`);
      console.log(`   Disponible: ${menu.available ? 'Oui' : 'Non'}`);
      console.log('');
    });

    // Garder seulement les 3 premiers
    if (menusWithBadges.length > 3) {
      console.log(`\n⚠️  Il y a ${menusWithBadges.length} plats avec badges.`);
      console.log(`Les 3 premiers seront affichés comme best sellers :\n`);

      for (let i = 0; i < 3; i++) {
        console.log(`✅ ${i + 1}. ${menusWithBadges[i].title} (${menusWithBadges[i].badge})`);
      }

      console.log(`\nLes autres plats gardent leur badge mais ne seront pas affichés dans la section Best Sellers de la page d'accueil.`);
    }

  } catch (error) {
    console.error('❌ Erreur:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkBadges();
