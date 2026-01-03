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
    { name: 'Coca-Cola 33cl', price: 1.5 },
    { name: 'Coca-Cola Zéro 33cl', price: 1.5 },
    { name: 'Coca-Cola Cherry 33cl', price: 1.5 },
    { name: 'Pepsi 33cl', price: 1.5 },
    { name: 'Pepsi Max 33cl', price: 1.5 },
    { name: 'Fanta Orange 33cl', price: 1.5 },
    { name: 'Fanta Citron 33cl', price: 1.5 },
    { name: 'Sprite 33cl', price: 1.5 },
    { name: '7Up 33cl', price: 1.5 },
    { name: 'Ice Tea Pêche 33cl', price: 1.5 },
    { name: 'Ice Tea Citron 33cl', price: 1.5 },
    { name: 'Orangina 33cl', price: 1.5 },
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
          image: '/images/placeholder.svg',
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
    { name: 'Coca-Cola 1,5L', price: 3.5 },
    { name: 'Pepsi 1,5L', price: 3.5 },
    { name: 'Fanta Orange 1,5L', price: 3.5 },
    { name: 'Sprite 1,5L', price: 3.5 },
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
          image: '/images/placeholder.svg',
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
    { name: 'Eau minérale 50cl', price: 1.0 },
    { name: 'Eau gazeuse 50cl', price: 1.0 },
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
          image: '/images/placeholder.svg',
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

