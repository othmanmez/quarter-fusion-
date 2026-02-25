import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🥤 Début de la création des boissons...\n');

  // Créer ou récupérer la catégorie Boissons
  let boissonsCategory = await prisma.category.findUnique({
    where: { slug: 'boissons' },
  });

  if (!boissonsCategory) {
    boissonsCategory = await prisma.category.create({
      data: {
        name: 'Boissons',
        slug: 'boissons',
      },
    });
    console.log('✅ Catégorie "Boissons" créée');
  } else {
    console.log('✓ Catégorie "Boissons" existe déjà');
  }

  const categoryId = boissonsCategory.id;

  console.log('\n📦 Création des boissons...\n');

  // ==================== CANETTES 33CL ====================
  console.log('🥤 Canettes 33cl :');
  
  const canettes = [
    { name: 'Coca-Cola 33cl', price: 1.5, image: '/images/boissons/coca-cola-33cl.png' },
    { name: 'Coca-Cola Zéro 33cl', price: 1.5, image: '/images/boissons/coca-cola-zero-33cl.png' },
    { name: 'Coca-Cola Cherry 33cl', price: 1.5, image: '/images/boissons/coca-cola-cherry-33cl.png' },
    { name: 'Pepsi 33cl', price: 1.5, image: '/images/boissons/pepsi-33cl.png' },
    { name: 'Pepsi Max 33cl', price: 1.5, image: '/images/boissons/pepsi-max-33cl.png' },
    { name: 'Fanta Orange 33cl', price: 1.5, image: '/images/boissons/fanta-orange-33cl.png' },
    { name: 'Fanta Citron 33cl', price: 1.5, image: '/images/boissons/fanta-citron-33cl.png' },
    { name: 'Sprite 33cl', price: 1.5, image: '/images/boissons/sprite-33cl.png' },
    { name: '7Up 33cl', price: 1.5, image: '/images/boissons/7up-33cl.png' },
    { name: 'Ice Tea Pêche 33cl', price: 1.5, image: '/images/boissons/ice-tea-peche-33cl.png' },
    { name: 'Ice Tea Citron 33cl', price: 1.5, image: '/images/boissons/ice-tea-citron-33cl.png' },
    { name: 'Orangina 33cl', price: 1.5, image: '/images/boissons/orangina-33cl.png' },
  ];

  for (const canette of canettes) {
    // Vérifier si la boisson existe déjà
    const existing = await prisma.menu.findFirst({
      where: {
        title: canette.name,
        categoryId: categoryId,
      },
    });

    if (existing) {
      console.log(`  ⚠️  ${canette.name} existe déjà, mise à jour...`);
      await prisma.menu.update({
        where: { id: existing.id },
        data: {
          description: 'Canette 33cl - Incluse dans les menus burgers et duo, ou en supplément à +1,50€ sur sandwichs et tacos',
          price: canette.price,
          image: canette.image,
          available: true,
          availableForClickAndCollect: true,
          availableForDelivery: true,
        },
      });
    } else {
      await prisma.menu.create({
        data: {
          title: canette.name,
          description: 'Canette 33cl - Incluse dans les menus burgers et duo, ou en supplément à +1,50€ sur sandwichs et tacos',
          price: canette.price,
          image: canette.image,
          categoryId: categoryId,
          available: true,
          availableForClickAndCollect: true,
          availableForDelivery: true,
          // Les boissons ne peuvent pas être personnalisées
          allowDrinkOption: false,
        },
      });
      console.log(`  ✅ ${canette.name}`);
    }
  }

  // ==================== BOUTEILLES 1,5L ====================
  console.log('\n🍾 Bouteilles 1,5L :');
  
  const bouteilles = [
    { name: 'Coca-Cola 1,5L', price: 3.5, image: '/images/boissons/coca-cola-1-5l.png' },
    { name: 'Pepsi 1,5L', price: 3.5, image: '/images/boissons/pepsi-1-5l.png' },
    { name: 'Fanta Orange 1,5L', price: 3.5, image: '/images/boissons/fanta-orange-1-5l.png' },
    { name: 'Sprite 1,5L', price: 3.5, image: '/images/boissons/sprite-1-5l.png' },
  ];

  for (const bouteille of bouteilles) {
    const existing = await prisma.menu.findFirst({
      where: {
        title: bouteille.name,
        categoryId: categoryId,
      },
    });

    if (existing) {
      console.log(`  ⚠️  ${bouteille.name} existe déjà, mise à jour...`);
      await prisma.menu.update({
        where: { id: existing.id },
        data: {
          description: 'Bouteille 1,5L - Incluse uniquement dans les menus à partager (non vendue à l\'unité)',
          price: bouteille.price,
          image: bouteille.image,
          available: false, // Non vendue à l'unité
          availableForClickAndCollect: false,
          availableForDelivery: false,
        },
      });
    } else {
      await prisma.menu.create({
        data: {
          title: bouteille.name,
          description: 'Bouteille 1,5L - Incluse uniquement dans les menus à partager (non vendue à l\'unité)',
          price: bouteille.price,
          image: bouteille.image,
          categoryId: categoryId,
          available: false, // Non vendue à l'unité
          availableForClickAndCollect: false,
          availableForDelivery: false,
          allowDrinkOption: false,
        },
      });
      console.log(`  ✅ ${bouteille.name}`);
    }
  }

  // ==================== EAU ====================
  console.log('\n💧 Eau :');
  
  const eaux = [
    { name: 'Eau minérale 50cl', price: 1.0, image: '/images/boissons/eau-minerale-50cl.png' },
    { name: 'Eau gazeuse 50cl', price: 1.0, image: '/images/boissons/eau-gazeuse-50cl.png' },
  ];

  for (const eau of eaux) {
    const existing = await prisma.menu.findFirst({
      where: {
        title: eau.name,
        categoryId: categoryId,
      },
    });

    if (existing) {
      console.log(`  ⚠️  ${eau.name} existe déjà, mise à jour...`);
      await prisma.menu.update({
        where: { id: existing.id },
        data: {
          description: 'Eau 50cl - Prix modifiable depuis le back-office',
          price: eau.price,
          image: eau.image,
          available: true,
          availableForClickAndCollect: true,
          availableForDelivery: true,
        },
      });
    } else {
      await prisma.menu.create({
        data: {
          title: eau.name,
          description: 'Eau 50cl - Prix modifiable depuis le back-office',
          price: eau.price,
          image: eau.image,
          categoryId: categoryId,
          available: true,
          availableForClickAndCollect: true,
          availableForDelivery: true,
          allowDrinkOption: false,
        },
      });
      console.log(`  ✅ ${eau.name}`);
    }
  }

  console.log('\n🎉 Toutes les boissons ont été créées avec succès !');
  console.log('\n📊 Résumé :');
  const totalBoissons = await prisma.menu.count({
    where: { categoryId: categoryId },
  });
  console.log(`  - ${totalBoissons} boissons dans la catégorie "Boissons"`);
  console.log('\n📝 Notes importantes :');
  console.log('  - Les canettes 33cl sont disponibles à l\'unité (1,50€)');
  console.log('  - Les bouteilles 1,5L sont désactivées (incluses uniquement dans menus à partager)');
  console.log('  - Les prix peuvent être modifiés depuis l\'interface admin');
  console.log('  - Les boissons ne peuvent pas être personnalisées');
}

main()
  .catch((e) => {
    console.error('❌ Erreur:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

