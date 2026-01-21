const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createCustomization(menuId, name, type, required, options) {
  const existing = await prisma.customization.findFirst({
    where: { menuId, name },
  });
  if (existing) return existing;
  
  return await prisma.customization.create({
    data: { menuId, name, type, required, options },
  });
}

async function createMenuIfNotExists(data, customizations) {
  const existing = await prisma.menu.findFirst({
    where: { title: data.title, categoryId: data.categoryId },
  });
  
  if (existing) {
    console.log(`  ⚠️  ${data.title} existe déjà`);
    return existing;
  }
  
  const menu = await prisma.menu.create({ data });
  
  for (const cust of customizations) {
    await createCustomization(menu.id, cust.name, cust.type, cust.required, cust.options);
  }
  
  console.log(`✅ ${data.title}`);
  return menu;
}

async function main() {
  try {
    console.log('🌱 Complétion du menu...\n');

    // Récupérer les catégories
    const cats = await prisma.category.findMany();
    const categoryMap = new Map();
    cats.forEach(c => categoryMap.set(c.slug, c.id));

    // MENUS BURGERS
    const burgersId = categoryMap.get('menus-burgers');
    if (burgersId) {
      const menusBurgers = [
        { title: 'Menu A1', desc: 'Cheese Burger + Cheese Burger + Frites normales + Canette 33cl incluse', price: 12.90 },
        { title: 'Menu A2', desc: 'Cheese Burger + Big Fast + Frites normales + Canette 33cl incluse', price: 14.90 },
        { title: 'Menu A3', desc: 'Double Cheese + Tower + Frites normales + Canette 33cl incluse', price: 16.90 },
        { title: 'Menu A4', desc: 'Tenders + Mixto Burger + Frites normales + Canette 33cl incluse', price: 15.90 },
        { title: 'Menu A5', desc: 'Crousty + Double Cheese + Frites normales + Canette 33cl incluse', price: 15.90 },
        { title: 'Menu A6', desc: 'Tower + Big Fast + Frites normales + Canette 33cl incluse', price: 16.90 },
      ];

      for (const m of menusBurgers) {
        await createMenuIfNotExists({
          title: m.title,
          description: m.desc,
          price: m.price,
          image: '/images/placeholder.svg',
          categoryId: burgersId,
          allowDrinkOption: false,
        }, [{
          name: 'Crudités',
          type: 'MULTIPLE_CHOICE',
          required: false,
          options: [
            { name: 'Salade', priceExtra: 0 },
            { name: 'Tomate', priceExtra: 0 },
            { name: 'Oignon', priceExtra: 0 },
          ],
        }]);
      }
    }

    // MENUS À PARTAGER
    const partagerId = categoryMap.get('menus-a-partager');
    if (partagerId) {
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
        await createMenuIfNotExists({
          title: m.title,
          description: m.desc,
          price: m.price,
          image: '/images/placeholder.svg',
          categoryId: partagerId,
          allowDrinkOption: false,
        }, []);
      }
    }

    // BOISSONS
    const boissonsId = categoryMap.get('boissons');
    if (boissonsId) {
      const canettes = [
        'Coca-Cola 33cl', 'Coca-Cola Zéro 33cl', 'Coca-Cola Cherry 33cl',
        'Pepsi 33cl', 'Pepsi Max 33cl', 'Fanta Orange 33cl', 'Fanta Citron 33cl',
        'Sprite 33cl', '7Up 33cl', 'Ice Tea Pêche 33cl', 'Ice Tea Citron 33cl', 'Orangina 33cl',
      ];

      for (const c of canettes) {
        await createMenuIfNotExists({
          title: c,
          description: 'Canette 33cl - +1,50€ sur sandwichs et tacos, incluse dans menus burgers et menu duo',
          price: 1.5,
          image: '/images/placeholder.svg',
          categoryId: boissonsId,
          available: true,
          allowDrinkOption: false,
        }, []);
      }

      const bouteilles = ['Coca-Cola 1,5L', 'Pepsi 1,5L', 'Fanta Orange 1,5L', 'Sprite 1,5L'];
      for (const b of bouteilles) {
        await createMenuIfNotExists({
          title: b,
          description: 'Bouteille 1,5L - Incluse uniquement dans les menus à partager (non vendue à l\'unité)',
          price: 3.5,
          image: '/images/placeholder.svg',
          categoryId: boissonsId,
          available: false,
          allowDrinkOption: false,
        }, []);
      }

      const eaux = [
        { name: 'Eau minérale 50cl', price: 1.0 },
        { name: 'Eau gazeuse 50cl', price: 1.0 },
      ];
      for (const e of eaux) {
        await createMenuIfNotExists({
          title: e.name,
          description: 'Eau 50cl - Prix modifiable depuis le back-office',
          price: e.price,
          image: '/images/placeholder.svg',
          categoryId: boissonsId,
          available: true,
          allowDrinkOption: false,
        }, []);
      }
    }

    console.log('\n🎉 Complétion terminée !');
    const total = await prisma.menu.count();
    const totalCustom = await prisma.customization.count();
    console.log(`📊 ${total} menus, ${totalCustom} personnalisations`);
  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();

