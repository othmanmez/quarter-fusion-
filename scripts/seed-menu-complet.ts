import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Catégories nécessaires
const categories = [
  { name: 'Menus Solo', slug: 'menus-solo' },
  { name: 'Menus Duo', slug: 'menus-duo' },
  { name: 'Chicken Fried', slug: 'chicken-fried' },
  { name: 'Sandwichs Normaux', slug: 'sandwichs-normaux' },
  { name: 'Sandwichs au Four', slug: 'sandwichs-au-four' },
  { name: 'Tacos & Gratinés', slug: 'tacos-gratines' },
  { name: 'Menus Burgers', slug: 'menus-burgers' },
  { name: 'Menus à Partager', slug: 'menus-a-partager' },
  { name: 'Boissons', slug: 'boissons' },
];

// Fonction pour créer une personnalisation
async function createCustomization(
  menuId: string,
  name: string,
  type: 'SINGLE_CHOICE' | 'MULTIPLE_CHOICE' | 'TOGGLE',
  required: boolean,
  options: Array<{ name: string; priceExtra: number }>
) {
  return await prisma.customization.create({
    data: {
      menuId,
      name,
      type,
      required,
      options,
    },
  });
}

async function main() {
  console.log('🌱 Création complète du menu...\n');

  // Créer ou récupérer les catégories
  console.log('📂 Création des catégories...');
  const categoryMap = new Map<string, string>();

  for (const cat of categories) {
    const existing = await prisma.category.findUnique({
      where: { slug: cat.slug },
    });

    if (existing) {
      categoryMap.set(cat.slug, existing.id);
      console.log(`  ✓ ${cat.name} (existant)`);
    } else {
      const created = await prisma.category.create({
        data: { name: cat.name, slug: cat.slug },
      });
      categoryMap.set(cat.slug, created.id);
      console.log(`  ✅ ${cat.name} créé`);
    }
  }

  console.log('\n🍽️  Création des menus...\n');

  // ==================== MENUS SOLO ====================
  const soloCategoryId = categoryMap.get('menus-solo')!;

  const menuSoloWings = await prisma.menu.create({
    data: {
      title: 'Menu Solo Wings',
      description: 'Wings (6 ou 10 pièces)',
      price: 8.50,
      image: '/images/placeholder.svg',
      categoryId: soloCategoryId,
      allowDrinkOption: false,
    },
  });
  await createCustomization(menuSoloWings.id, 'Choix de sauce', 'SINGLE_CHOICE', false, [
    { name: 'Algérienne', priceExtra: 0 },
    { name: 'Samouraï', priceExtra: 0 },
    { name: 'Ketchup', priceExtra: 0 },
    { name: 'Poivre', priceExtra: 0 },
    { name: 'Blanche', priceExtra: 0 },
    { name: 'Biggy', priceExtra: 0 },
    { name: 'Curry', priceExtra: 0 },
    { name: 'Harissa', priceExtra: 0 },
    { name: 'Mayonnaise', priceExtra: 0 },
  ]);
  console.log('✅ Menu Solo Wings');

  const menuSoloTenders = await prisma.menu.create({
    data: {
      title: 'Menu Solo Tenders',
      description: 'Tenders (5 ou 10 pièces)',
      price: 8.50,
      image: '/images/placeholder.svg',
      categoryId: soloCategoryId,
      allowDrinkOption: false,
    },
  });
  await createCustomization(menuSoloTenders.id, 'Choix de sauce', 'SINGLE_CHOICE', false, [
    { name: 'Algérienne', priceExtra: 0 },
    { name: 'Samouraï', priceExtra: 0 },
    { name: 'Ketchup', priceExtra: 0 },
    { name: 'Poivre', priceExtra: 0 },
    { name: 'Blanche', priceExtra: 0 },
    { name: 'Biggy', priceExtra: 0 },
    { name: 'Curry', priceExtra: 0 },
    { name: 'Harissa', priceExtra: 0 },
    { name: 'Mayonnaise', priceExtra: 0 },
  ]);
  console.log('✅ Menu Solo Tenders');

  const menuSoloMixte = await prisma.menu.create({
    data: {
      title: 'Menu Solo Mixte',
      description: '3 tenders + 4 wings',
      price: 9.50,
      image: '/images/placeholder.svg',
      categoryId: soloCategoryId,
      allowDrinkOption: false,
    },
  });
  await createCustomization(menuSoloMixte.id, 'Choix de sauce', 'SINGLE_CHOICE', false, [
    { name: 'Algérienne', priceExtra: 0 },
    { name: 'Samouraï', priceExtra: 0 },
    { name: 'Ketchup', priceExtra: 0 },
    { name: 'Poivre', priceExtra: 0 },
    { name: 'Blanche', priceExtra: 0 },
    { name: 'Biggy', priceExtra: 0 },
    { name: 'Curry', priceExtra: 0 },
    { name: 'Harissa', priceExtra: 0 },
    { name: 'Mayonnaise', priceExtra: 0 },
  ]);
  console.log('✅ Menu Solo Mixte');

  // ==================== MENU DUO ====================
  const duoCategoryId = categoryMap.get('menus-duo')!;

  const menuDuo = await prisma.menu.create({
    data: {
      title: 'Menu Duo',
      description: '12 tenders OU 18 wings OU 8 wings + 6 tenders + 2 frites normales + 2 canettes 33cl',
      price: 19.90,
      image: '/images/placeholder.svg',
      categoryId: duoCategoryId,
      allowDrinkOption: false, // Boissons déjà incluses
    },
  });
  await createCustomization(menuDuo.id, 'Choix de sauces', 'MULTIPLE_CHOICE', false, [
    { name: 'Algérienne', priceExtra: 0 },
    { name: 'Samouraï', priceExtra: 0 },
    { name: 'Ketchup', priceExtra: 0 },
    { name: 'Poivre', priceExtra: 0 },
    { name: 'Blanche', priceExtra: 0 },
    { name: 'Biggy', priceExtra: 0 },
    { name: 'Curry', priceExtra: 0 },
    { name: 'Harissa', priceExtra: 0 },
    { name: 'Mayonnaise', priceExtra: 0 },
  ]);
  console.log('✅ Menu Duo');

  // ==================== CHICKEN FRIED ====================
  const chickenCategoryId = categoryMap.get('chicken-fried')!;

  const tenders = await prisma.menu.create({
    data: {
      title: 'Tenders',
      description: '6 / 12 / 20 pièces',
      price: 6.50,
      image: '/images/placeholder.svg',
      categoryId: chickenCategoryId,
      allowDrinkOption: false,
    },
  });
  await createCustomization(tenders.id, 'Choix de sauce', 'SINGLE_CHOICE', false, [
    { name: 'Algérienne', priceExtra: 0 },
    { name: 'Samouraï', priceExtra: 0 },
    { name: 'Ketchup', priceExtra: 0 },
    { name: 'Poivre', priceExtra: 0 },
    { name: 'Blanche', priceExtra: 0 },
    { name: 'Biggy', priceExtra: 0 },
    { name: 'Curry', priceExtra: 0 },
    { name: 'Harissa', priceExtra: 0 },
    { name: 'Mayonnaise', priceExtra: 0 },
  ]);
  console.log('✅ Tenders');

  const wings = await prisma.menu.create({
    data: {
      title: 'Wings',
      description: '6 / 12 / 20 pièces',
      price: 6.50,
      image: '/images/placeholder.svg',
      categoryId: chickenCategoryId,
      allowDrinkOption: false,
    },
  });
  await createCustomization(wings.id, 'Choix de sauce', 'SINGLE_CHOICE', false, [
    { name: 'Algérienne', priceExtra: 0 },
    { name: 'Samouraï', priceExtra: 0 },
    { name: 'Ketchup', priceExtra: 0 },
    { name: 'Poivre', priceExtra: 0 },
    { name: 'Blanche', priceExtra: 0 },
    { name: 'Biggy', priceExtra: 0 },
    { name: 'Curry', priceExtra: 0 },
    { name: 'Harissa', priceExtra: 0 },
    { name: 'Mayonnaise', priceExtra: 0 },
  ]);
  console.log('✅ Wings');

  const nuggets = await prisma.menu.create({
    data: {
      title: 'Nuggets',
      description: '6 / 12 / 20 pièces',
      price: 6.50,
      image: '/images/placeholder.svg',
      categoryId: chickenCategoryId,
      allowDrinkOption: false,
    },
  });
  await createCustomization(nuggets.id, 'Choix de sauce', 'SINGLE_CHOICE', false, [
    { name: 'Algérienne', priceExtra: 0 },
    { name: 'Samouraï', priceExtra: 0 },
    { name: 'Ketchup', priceExtra: 0 },
    { name: 'Poivre', priceExtra: 0 },
    { name: 'Blanche', priceExtra: 0 },
    { name: 'Biggy', priceExtra: 0 },
    { name: 'Curry', priceExtra: 0 },
    { name: 'Harissa', priceExtra: 0 },
    { name: 'Mayonnaise', priceExtra: 0 },
  ]);
  console.log('✅ Nuggets');

  // ==================== SANDWICHS NORMAUX ====================
  const sandwichsNormauxCategoryId = categoryMap.get('sandwichs-normaux')!;

  const sandwichsNormaux = [
    {
      title: 'Sandwich Curry',
      description: 'Poulet curry, crudités, fromage',
      price: 7.50,
    },
    {
      title: 'Sandwich Kebab',
      description: 'Viande kebab, crudités, fromage',
      price: 7.50,
    },
    {
      title: 'Sandwich Mex',
      description: '3 steaks hachés, œuf, bacon, crudités, fromage',
      price: 8.50,
    },
    {
      title: 'Sandwich Boursin',
      description: 'Escalope de poulet, sauce boursin, crudités, fromage',
      price: 7.90,
    },
    {
      title: 'Sandwich Tandoori',
      description: 'Poulet tandoori, crudités, fromage',
      price: 7.50,
    },
    {
      title: 'Sandwich Merguez',
      description: 'Merguez, crudités, fromage',
      price: 7.50,
    },
  ];

  for (const sandwich of sandwichsNormaux) {
    const menu = await prisma.menu.create({
      data: {
        title: sandwich.title,
        description: sandwich.description,
        price: sandwich.price,
        image: '/images/placeholder.svg',
        categoryId: sandwichsNormauxCategoryId,
        allowDrinkOption: true, // Option boisson +1,50€
        drinkPrice: 1.5,
      },
    });

    // Personnalisation : salade, tomate, oignon (choix multiples)
    await createCustomization(menu.id, 'Crudités', 'MULTIPLE_CHOICE', false, [
      { name: 'Salade', priceExtra: 0 },
      { name: 'Tomate', priceExtra: 0 },
      { name: 'Oignon', priceExtra: 0 },
    ]);

    // Suppléments : Fromage +1€, Viande +1€
    await createCustomization(menu.id, 'Suppléments', 'MULTIPLE_CHOICE', false, [
      { name: 'Fromage', priceExtra: 1.0 },
      { name: 'Viande', priceExtra: 1.0 },
    ]);

    console.log(`✅ ${sandwich.title}`);
  }

  // ==================== SANDWICHS AU FOUR ====================
  const sandwichsFourCategoryId = categoryMap.get('sandwichs-au-four')!;

  const sandwichsFour = [
    {
      title: 'Sandwich Curry (au four)',
      description: 'Poulet curry, crudités, fromage',
      price: 8.50,
    },
    {
      title: 'Sandwich Kebab (au four)',
      description: 'Viande kebab, crudités, fromage',
      price: 8.50,
    },
    {
      title: 'Sandwich Mex (au four)',
      description: '3 steaks hachés, œuf, bacon, crudités, fromage',
      price: 9.50,
    },
    {
      title: 'Sandwich Boursin (au four)',
      description: 'Escalope de poulet, sauce boursin, crudités, fromage',
      price: 8.90,
    },
    {
      title: 'Sandwich Tandoori (au four)',
      description: 'Poulet tandoori, crudités, fromage',
      price: 8.50,
    },
    {
      title: 'Sandwich Merguez (au four)',
      description: 'Merguez, crudités, fromage',
      price: 8.50,
    },
  ];

  for (const sandwich of sandwichsFour) {
    const menu = await prisma.menu.create({
      data: {
        title: sandwich.title,
        description: sandwich.description,
        price: sandwich.price,
        image: '/images/placeholder.svg',
        categoryId: sandwichsFourCategoryId,
        allowDrinkOption: true, // Option boisson +1,50€
        drinkPrice: 1.5,
      },
    });

    // Personnalisation : salade, tomate, oignon (choix multiples)
    await createCustomization(menu.id, 'Crudités', 'MULTIPLE_CHOICE', false, [
      { name: 'Salade', priceExtra: 0 },
      { name: 'Tomate', priceExtra: 0 },
      { name: 'Oignon', priceExtra: 0 },
    ]);

    // Suppléments : Fromage +1€, Viande +1€
    await createCustomization(menu.id, 'Suppléments', 'MULTIPLE_CHOICE', false, [
      { name: 'Fromage', priceExtra: 1.0 },
      { name: 'Viande', priceExtra: 1.0 },
    ]);

    console.log(`✅ ${sandwich.title}`);
  }

  // ==================== TACOS & GRATINÉS ====================
  const tacosCategoryId = categoryMap.get('tacos-gratines')!;

  const tacosGratine = await prisma.menu.create({
    data: {
      title: 'Tacos Gratiné',
      description: '1 ou 2 viandes au choix (Tenders, Nuggets, Kebab, Merguez, Steak haché) + Fromage (Cheddar ou Mozzarella) + Sauces au choix',
      price: 9.50,
      image: '/images/placeholder.svg',
      categoryId: tacosCategoryId,
      allowDrinkOption: true, // Option boisson +1,50€
      drinkPrice: 1.5,
    },
  });

  // Taille : 1 viande ou 2 viandes (obligatoire)
  await createCustomization(tacosGratine.id, 'Taille', 'SINGLE_CHOICE', true, [
    { name: '1 viande', priceExtra: 0 },
    { name: '2 viandes', priceExtra: 2.0 },
  ]);

  // Viande : Tenders, Nuggets, Kebab, Merguez, Steak haché (obligatoire)
  await createCustomization(tacosGratine.id, 'Viande', 'SINGLE_CHOICE', true, [
    { name: 'Tenders', priceExtra: 0 },
    { name: 'Nuggets', priceExtra: 0 },
    { name: 'Kebab', priceExtra: 0 },
    { name: 'Merguez', priceExtra: 0 },
    { name: 'Steak haché', priceExtra: 0 },
  ]);

  // Fromage : Cheddar ou Mozzarella (obligatoire)
  await createCustomization(tacosGratine.id, 'Fromage', 'SINGLE_CHOICE', true, [
    { name: 'Cheddar', priceExtra: 0 },
    { name: 'Mozzarella', priceExtra: 0 },
  ]);

  // Sauces au choix (choix multiples)
  await createCustomization(tacosGratine.id, 'Sauces au choix', 'MULTIPLE_CHOICE', false, [
    { name: 'Algérienne', priceExtra: 0 },
    { name: 'Samouraï', priceExtra: 0 },
    { name: 'Ketchup', priceExtra: 0 },
    { name: 'Poivre', priceExtra: 0 },
    { name: 'Blanche', priceExtra: 0 },
    { name: 'Biggy', priceExtra: 0 },
    { name: 'Curry', priceExtra: 0 },
    { name: 'Harissa', priceExtra: 0 },
    { name: 'Mayonnaise', priceExtra: 0 },
  ]);

  console.log('✅ Tacos Gratiné');

  // ==================== MENUS BURGERS ====================
  const menusBurgersCategoryId = categoryMap.get('menus-burgers')!;

  const menusBurgers = [
    {
      title: 'Menu A1',
      description: 'Cheese Burger + Cheese Burger + Frites normales + Canette 33cl incluse',
      price: 12.90,
    },
    {
      title: 'Menu A2',
      description: 'Cheese Burger + Big Fast + Frites normales + Canette 33cl incluse',
      price: 14.90,
    },
    {
      title: 'Menu A3',
      description: 'Double Cheese + Tower + Frites normales + Canette 33cl incluse',
      price: 16.90,
    },
    {
      title: 'Menu A4',
      description: 'Tenders + Mixto Burger + Frites normales + Canette 33cl incluse',
      price: 15.90,
    },
    {
      title: 'Menu A5',
      description: 'Crousty + Double Cheese + Frites normales + Canette 33cl incluse',
      price: 15.90,
    },
    {
      title: 'Menu A6',
      description: 'Tower + Big Fast + Frites normales + Canette 33cl incluse',
      price: 16.90,
    },
  ];

  for (const menu of menusBurgers) {
    const created = await prisma.menu.create({
      data: {
        title: menu.title,
        description: menu.description,
        price: menu.price,
        image: '/images/placeholder.svg',
        categoryId: menusBurgersCategoryId,
        allowDrinkOption: false, // Boisson déjà incluse
      },
    });

    // Personnalisation : salade, tomate, oignon (choix multiples)
    await createCustomization(created.id, 'Crudités', 'MULTIPLE_CHOICE', false, [
      { name: 'Salade', priceExtra: 0 },
      { name: 'Tomate', priceExtra: 0 },
      { name: 'Oignon', priceExtra: 0 },
    ]);

    console.log(`✅ ${menu.title}`);
  }

  // ==================== MENUS À PARTAGER ====================
  const menusPartagerCategoryId = categoryMap.get('menus-a-partager')!;

  const menusPartager = [
    {
      title: 'Menu Classique',
      description: '25 wings + 4 frites normales + 1 bouteille 1,5L',
      price: 29.90,
    },
    {
      title: 'Menu Méga',
      description: '40 wings + 4 frites normales + 1 bouteille 1,5L',
      price: 39.90,
    },
    {
      title: 'Menu Mixte',
      description: '35 wings + 2 cheese burgers + 4 frites normales + 1 bouteille 1,5L',
      price: 34.90,
    },
    {
      title: 'Menu Fusion',
      description: '15 wings + 15 tenders + 4 frites normales + 1 bouteille 1,5L',
      price: 32.90,
    },
    {
      title: 'Menu Ultra',
      description: '60 wings + 4 frites normales + 1 bouteille 1,5L',
      price: 49.90,
    },
    {
      title: 'Menu Big Mixte',
      description: '50 wings + 4 cheese burgers + 4 frites normales + 1 bouteille 1,5L',
      price: 44.90,
    },
    {
      title: 'Menu Max Fusion',
      description: '25 wings + 25 tenders + 4 frites normales + 1 bouteille 1,5L',
      price: 39.90,
    },
    {
      title: 'Menu Giga',
      description: '30 tenders + 4 frites normales + 1 bouteille 1,5L',
      price: 34.90,
    },
  ];

  for (const menu of menusPartager) {
    await prisma.menu.create({
      data: {
        title: menu.title,
        description: menu.description,
        price: menu.price,
        image: '/images/placeholder.svg',
        categoryId: menusPartagerCategoryId,
        allowDrinkOption: false, // Bouteille déjà incluse
      },
    });
    // Pas de personnalisations pour les menus à partager
    console.log(`✅ ${menu.title}`);
  }

  // ==================== BOISSONS ====================
  const boissonsCategoryId = categoryMap.get('boissons')!;

  console.log('\n🥤 Création des boissons...\n');

  // Canettes 33cl
  const canettes = [
    'Coca-Cola 33cl',
    'Coca-Cola Zéro 33cl',
    'Coca-Cola Cherry 33cl',
    'Pepsi 33cl',
    'Pepsi Max 33cl',
    'Fanta Orange 33cl',
    'Fanta Citron 33cl',
    'Sprite 33cl',
    '7Up 33cl',
    'Ice Tea Pêche 33cl',
    'Ice Tea Citron 33cl',
    'Orangina 33cl',
  ];

  for (const canette of canettes) {
    await prisma.menu.create({
      data: {
        title: canette,
        description: 'Canette 33cl - +1,50€ sur sandwichs et tacos, incluse dans menus burgers et menu duo',
        price: 1.5,
        image: '/images/placeholder.svg',
        categoryId: boissonsCategoryId,
        available: true,
        allowDrinkOption: false,
      },
    });
    console.log(`✅ ${canette}`);
  }

  // Bouteilles 1,5L (désactivées car incluses uniquement dans menus à partager)
  const bouteilles = [
    'Coca-Cola 1,5L',
    'Pepsi 1,5L',
    'Fanta Orange 1,5L',
    'Sprite 1,5L',
  ];

  for (const bouteille of bouteilles) {
    await prisma.menu.create({
      data: {
        title: bouteille,
        description: 'Bouteille 1,5L - Incluse uniquement dans les menus à partager (non vendue à l\'unité)',
        price: 3.5,
        image: '/images/placeholder.svg',
        categoryId: boissonsCategoryId,
        available: false, // Non vendue à l'unité
        allowDrinkOption: false,
      },
    });
    console.log(`✅ ${bouteille} (désactivée)`);
  }

  // Eaux
  const eaux = [
    { name: 'Eau minérale 50cl', price: 1.0 },
    { name: 'Eau gazeuse 50cl', price: 1.0 },
  ];

  for (const eau of eaux) {
    await prisma.menu.create({
      data: {
        title: eau.name,
        description: 'Eau 50cl - Prix modifiable depuis le back-office',
        price: eau.price,
        image: '/images/placeholder.svg',
        categoryId: boissonsCategoryId,
        available: true,
        allowDrinkOption: false,
      },
    });
    console.log(`✅ ${eau.name}`);
  }

  console.log('\n🎉 Tous les menus ont été créés avec succès !');
  console.log('\n📊 Résumé :');
  const totalMenus = await prisma.menu.count();
  const totalCustomizations = await prisma.customization.count();
  console.log(`  - ${totalMenus} menus créés`);
  console.log(`  - ${totalCustomizations} personnalisations configurées`);
  console.log('\n✅ Configuration complète selon vos spécifications !');
}

main()
  .catch((e: any) => {
    console.error('❌ Erreur:', e.message || e);
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

