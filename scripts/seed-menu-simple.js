const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createCustomization(menuId, name, type, required, options) {
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
  try {
    console.log('🌱 Création complète du menu...\n');

    // Catégories
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

    console.log('📂 Création des catégories...');
    const categoryMap = new Map();

    for (const cat of categories) {
      let existing = await prisma.category.findUnique({
        where: { slug: cat.slug },
      });

      if (existing) {
        categoryMap.set(cat.slug, existing.id);
        console.log(`  ✓ ${cat.name}`);
      } else {
        const created = await prisma.category.create({
          data: { name: cat.name, slug: cat.slug },
        });
        categoryMap.set(cat.slug, created.id);
        console.log(`  ✅ ${cat.name}`);
      }
    }

    console.log('\n🍽️  Création des menus...\n');

    // MENUS SOLO
    const soloId = categoryMap.get('menus-solo');
    const menu1 = await prisma.menu.create({
      data: {
        title: 'Menu Solo Wings',
        description: 'Wings (6 ou 10 pièces)',
        price: 8.50,
        image: '/images/placeholder.svg',
        categoryId: soloId,
        allowDrinkOption: false,
      },
    });
    await createCustomization(menu1.id, 'Choix de sauce', 'SINGLE_CHOICE', false, [
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

    const menu2 = await prisma.menu.create({
      data: {
        title: 'Menu Solo Tenders',
        description: 'Tenders (5 ou 10 pièces)',
        price: 8.50,
        image: '/images/placeholder.svg',
        categoryId: soloId,
        allowDrinkOption: false,
      },
    });
    await createCustomization(menu2.id, 'Choix de sauce', 'SINGLE_CHOICE', false, [
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

    const menu3 = await prisma.menu.create({
      data: {
        title: 'Menu Solo Mixte',
        description: '3 tenders + 4 wings',
        price: 9.50,
        image: '/images/placeholder.svg',
        categoryId: soloId,
        allowDrinkOption: false,
      },
    });
    await createCustomization(menu3.id, 'Choix de sauce', 'SINGLE_CHOICE', false, [
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

    // MENU DUO
    const duoId = categoryMap.get('menus-duo');
    const menuDuo = await prisma.menu.create({
      data: {
        title: 'Menu Duo',
        description: '12 tenders OU 18 wings OU 8 wings + 6 tenders + 2 frites normales + 2 canettes 33cl',
        price: 19.90,
        image: '/images/placeholder.svg',
        categoryId: duoId,
        allowDrinkOption: false,
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

    // CHICKEN FRIED
    const chickenId = categoryMap.get('chicken-fried');
    const tenders = await prisma.menu.create({
      data: {
        title: 'Tenders',
        description: '6 / 12 / 20 pièces',
        price: 6.50,
        image: '/images/placeholder.svg',
        categoryId: chickenId,
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
        categoryId: chickenId,
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
        categoryId: chickenId,
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

    // SANDWICHS NORMAUX
    const sandwichsNormauxId = categoryMap.get('sandwichs-normaux');
    const sandwichsNormaux = [
      { title: 'Sandwich Curry', desc: 'Poulet curry, crudités, fromage', price: 7.50 },
      { title: 'Sandwich Kebab', desc: 'Viande kebab, crudités, fromage', price: 7.50 },
      { title: 'Sandwich Mex', desc: '3 steaks hachés, œuf, bacon, crudités, fromage', price: 8.50 },
      { title: 'Sandwich Boursin', desc: 'Escalope de poulet, sauce boursin, crudités, fromage', price: 7.90 },
      { title: 'Sandwich Tandoori', desc: 'Poulet tandoori, crudités, fromage', price: 7.50 },
      { title: 'Sandwich Merguez', desc: 'Merguez, crudités, fromage', price: 7.50 },
    ];

    for (const s of sandwichsNormaux) {
      const m = await prisma.menu.create({
        data: {
          title: s.title,
          description: s.desc,
          price: s.price,
          image: '/images/placeholder.svg',
          categoryId: sandwichsNormauxId,
          allowDrinkOption: true,
          drinkPrice: 1.5,
        },
      });
      await createCustomization(m.id, 'Crudités', 'MULTIPLE_CHOICE', false, [
        { name: 'Salade', priceExtra: 0 },
        { name: 'Tomate', priceExtra: 0 },
        { name: 'Oignon', priceExtra: 0 },
      ]);
      await createCustomization(m.id, 'Suppléments', 'MULTIPLE_CHOICE', false, [
        { name: 'Fromage', priceExtra: 1.0 },
        { name: 'Viande', priceExtra: 1.0 },
      ]);
      console.log(`✅ ${s.title}`);
    }

    // SANDWICHS AU FOUR
    const sandwichsFourId = categoryMap.get('sandwichs-au-four');
    const sandwichsFour = [
      { title: 'Sandwich Curry (au four)', desc: 'Poulet curry, crudités, fromage', price: 8.50 },
      { title: 'Sandwich Kebab (au four)', desc: 'Viande kebab, crudités, fromage', price: 8.50 },
      { title: 'Sandwich Mex (au four)', desc: '3 steaks hachés, œuf, bacon, crudités, fromage', price: 9.50 },
      { title: 'Sandwich Boursin (au four)', desc: 'Escalope de poulet, sauce boursin, crudités, fromage', price: 8.90 },
      { title: 'Sandwich Tandoori (au four)', desc: 'Poulet tandoori, crudités, fromage', price: 8.50 },
      { title: 'Sandwich Merguez (au four)', desc: 'Merguez, crudités, fromage', price: 8.50 },
    ];

    for (const s of sandwichsFour) {
      const m = await prisma.menu.create({
        data: {
          title: s.title,
          description: s.desc,
          price: s.price,
          image: '/images/placeholder.svg',
          categoryId: sandwichsFourId,
          allowDrinkOption: true,
          drinkPrice: 1.5,
        },
      });
      await createCustomization(m.id, 'Crudités', 'MULTIPLE_CHOICE', false, [
        { name: 'Salade', priceExtra: 0 },
        { name: 'Tomate', priceExtra: 0 },
        { name: 'Oignon', priceExtra: 0 },
      ]);
      await createCustomization(m.id, 'Suppléments', 'MULTIPLE_CHOICE', false, [
        { name: 'Fromage', priceExtra: 1.0 },
        { name: 'Viande', priceExtra: 1.0 },
      ]);
      console.log(`✅ ${s.title}`);
    }

    // TACOS
    const tacosId = categoryMap.get('tacos-gratines');
    const tacos = await prisma.menu.create({
      data: {
        title: 'Tacos Gratiné',
        description: '1 ou 2 viandes au choix (Tenders, Nuggets, Kebab, Merguez, Steak haché) + Fromage (Cheddar ou Mozzarella) + Sauces au choix',
        price: 9.50,
        image: '/images/placeholder.svg',
        categoryId: tacosId,
        allowDrinkOption: true,
        drinkPrice: 1.5,
      },
    });
    await createCustomization(tacos.id, 'Taille', 'SINGLE_CHOICE', true, [
      { name: '1 viande', priceExtra: 0 },
      { name: '2 viandes', priceExtra: 2.0 },
    ]);
    await createCustomization(tacos.id, 'Viande', 'SINGLE_CHOICE', true, [
      { name: 'Tenders', priceExtra: 0 },
      { name: 'Nuggets', priceExtra: 0 },
      { name: 'Kebab', priceExtra: 0 },
      { name: 'Merguez', priceExtra: 0 },
      { name: 'Steak haché', priceExtra: 0 },
    ]);
    await createCustomization(tacos.id, 'Fromage', 'SINGLE_CHOICE', true, [
      { name: 'Cheddar', priceExtra: 0 },
      { name: 'Mozzarella', priceExtra: 0 },
    ]);
    await createCustomization(tacos.id, 'Sauces au choix', 'MULTIPLE_CHOICE', false, [
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

    // MENUS BURGERS
    const burgersId = categoryMap.get('menus-burgers');
    const menusBurgers = [
      { title: 'Menu A1', desc: 'Cheese Burger + Cheese Burger + Frites normales + Canette 33cl incluse', price: 12.90 },
      { title: 'Menu A2', desc: 'Cheese Burger + Big Fast + Frites normales + Canette 33cl incluse', price: 14.90 },
      { title: 'Menu A3', desc: 'Double Cheese + Tower + Frites normales + Canette 33cl incluse', price: 16.90 },
      { title: 'Menu A4', desc: 'Tenders + Mixto Burger + Frites normales + Canette 33cl incluse', price: 15.90 },
      { title: 'Menu A5', desc: 'Crousty + Double Cheese + Frites normales + Canette 33cl incluse', price: 15.90 },
      { title: 'Menu A6', desc: 'Tower + Big Fast + Frites normales + Canette 33cl incluse', price: 16.90 },
    ];

    for (const m of menusBurgers) {
      const menu = await prisma.menu.create({
        data: {
          title: m.title,
          description: m.desc,
          price: m.price,
          image: '/images/placeholder.svg',
          categoryId: burgersId,
          allowDrinkOption: false,
        },
      });
      await createCustomization(menu.id, 'Crudités', 'MULTIPLE_CHOICE', false, [
        { name: 'Salade', priceExtra: 0 },
        { name: 'Tomate', priceExtra: 0 },
        { name: 'Oignon', priceExtra: 0 },
      ]);
      console.log(`✅ ${m.title}`);
    }

    // MENUS À PARTAGER
    const partagerId = categoryMap.get('menus-a-partager');
    const menusPartager = [
      { title: 'Menu Classique', desc: '25 wings + 4 frites normales + 1 bouteille 1,5L', price: 29.90 },
      { title: 'Menu Méga', desc: '40 wings + 4 frites normales + 1 bouteille 1,5L', price: 39.90 },
      { title: 'Menu Mixte', desc: '35 wings + 2 cheese burgers + 4 frites normales + 1 bouteille 1,5L', price: 34.90 },
      { title: 'Menu Fusion', desc: '15 wings + 15 tenders + 4 frites normales + 1 bouteille 1,5L', price: 32.90 },
      { title: 'Menu Ultra', desc: '60 wings + 4 frites normales + 1 bouteille 1,5L', price: 49.90 },
      { title: 'Menu Big Mixte', desc: '50 wings + 4 cheese burgers + 4 frites normales + 1 bouteille 1,5L', price: 44.90 },
      { title: 'Menu Max Fusion', desc: '25 wings + 25 tenders + 4 frites normales + 1 bouteille 1,5L', price: 39.90 },
      { title: 'Menu Giga', desc: '30 tenders + 4 frites normales + 1 bouteille 1,5L', price: 34.90 },
    ];

    for (const m of menusPartager) {
      await prisma.menu.create({
        data: {
          title: m.title,
          description: m.desc,
          price: m.price,
          image: '/images/placeholder.svg',
          categoryId: partagerId,
          allowDrinkOption: false,
        },
      });
      console.log(`✅ ${m.title}`);
    }

    // BOISSONS
    const boissonsId = categoryMap.get('boissons');
    console.log('\n🥤 Création des boissons...\n');

    const canettes = [
      'Coca-Cola 33cl', 'Coca-Cola Zéro 33cl', 'Coca-Cola Cherry 33cl',
      'Pepsi 33cl', 'Pepsi Max 33cl', 'Fanta Orange 33cl', 'Fanta Citron 33cl',
      'Sprite 33cl', '7Up 33cl', 'Ice Tea Pêche 33cl', 'Ice Tea Citron 33cl', 'Orangina 33cl',
    ];

    for (const c of canettes) {
      await prisma.menu.create({
        data: {
          title: c,
          description: 'Canette 33cl - +1,50€ sur sandwichs et tacos, incluse dans menus burgers et menu duo',
          price: 1.5,
          image: '/images/placeholder.svg',
          categoryId: boissonsId,
          available: true,
          allowDrinkOption: false,
        },
      });
      console.log(`✅ ${c}`);
    }

    const bouteilles = ['Coca-Cola 1,5L', 'Pepsi 1,5L', 'Fanta Orange 1,5L', 'Sprite 1,5L'];
    for (const b of bouteilles) {
      await prisma.menu.create({
        data: {
          title: b,
          description: 'Bouteille 1,5L - Incluse uniquement dans les menus à partager (non vendue à l\'unité)',
          price: 3.5,
          image: '/images/placeholder.svg',
          categoryId: boissonsId,
          available: false,
          allowDrinkOption: false,
        },
      });
      console.log(`✅ ${b} (désactivée)`);
    }

    const eaux = [
      { name: 'Eau minérale 50cl', price: 1.0 },
      { name: 'Eau gazeuse 50cl', price: 1.0 },
    ];
    for (const e of eaux) {
      await prisma.menu.create({
        data: {
          title: e.name,
          description: 'Eau 50cl - Prix modifiable depuis le back-office',
          price: e.price,
          image: '/images/placeholder.svg',
          categoryId: boissonsId,
          available: true,
          allowDrinkOption: false,
        },
      });
      console.log(`✅ ${e.name}`);
    }

    console.log('\n🎉 Tous les menus ont été créés !');
    const total = await prisma.menu.count();
    const totalCustom = await prisma.customization.count();
    console.log(`📊 ${total} menus, ${totalCustom} personnalisations`);
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();

