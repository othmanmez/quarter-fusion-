import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Données d'exemple pour le seeding
const categories = [
  { 
    name: "Burgers", 
    slug: "burgers",
    description: "Nos délicieux burgers faits maison" 
  },
  { 
    name: "Tacos", 
    slug: "tacos",
    description: "Tacos généreux garnis à votre goût" 
  },
  { 
    name: "Sandwichs", 
    slug: "sandwichs",
    description: "Sandwichs frais et savoureux" 
  },
  { 
    name: "Paninis", 
    slug: "paninis",
    description: "Paninis grillés chauds" 
  },
  { 
    name: "Frites & Accompagnements", 
    slug: "frites-accompagnements",
    description: "Accompagnements croustillants" 
  },
  { 
    name: "Desserts", 
    slug: "desserts",
    description: "Douceurs pour finir en beauté" 
  },
  { 
    name: "Boissons", 
    slug: "boissons",
    description: "Boissons fraîches et chaudes" 
  }
];

const menuItems = [
  // BURGERS
  {
    categorySlug: "burgers",
    title: "Quarter Crousty",
    description: "Burger au poulet croustillant avec salade et sauce spéciale",
    price: 8.50,
    badge: "HOT",
    available: true,
    availableForClickAndCollect: true,
    availableForDelivery: true
  },
  {
    categorySlug: "burgers", 
    title: "Burger Fusion",
    description: "Notre burger signature avec double steak et sauce fusion",
    price: 12.90,
    badge: "NEW",
    available: true,
    availableForClickAndCollect: true,
    availableForDelivery: true
  },
  {
    categorySlug: "burgers",
    title: "Cheese Burger",
    description: "Burger classique avec fromage fondant",
    price: 7.90,
    badge: null,
    available: true,
    availableForClickAndCollect: true,
    availableForDelivery: true
  },
  {
    categorySlug: "burgers",
    title: "Big Fusion",
    description: "Double steak, double fromage, bacon et sauce BBQ",
    price: 14.50,
    badge: "TOP",
    available: true,
    availableForClickAndCollect: true,
    availableForDelivery: true
  },
  
  // TACOS
  {
    categorySlug: "tacos",
    title: "Tacos Poulet",
    description: "Tacos au poulet mariné, sauce fromagère",
    price: 7.50,
    badge: null,
    available: true,
    availableForClickAndCollect: true,
    availableForDelivery: true
  },
  {
    categorySlug: "tacos",
    title: "Tacos Mixte",
    description: "Viande hachée et poulet, sauce spéciale",
    price: 8.50,
    badge: null,
    available: true,
    availableForClickAndCollect: true,
    availableForDelivery: true
  },
  {
    categorySlug: "tacos",
    title: "Tacos Géant",
    description: "3 viandes au choix, frites, sauce fromagère",
    price: 11.90,
    badge: "HOT",
    available: true,
    availableForClickAndCollect: true,
    availableForDelivery: true
  },
  
  // SANDWICHS
  {
    categorySlug: "sandwichs",
    title: "Sandwich Poulet Grillé",
    description: "Poulet grillé, crudités, sauce blanche",
    price: 6.50,
    badge: null,
    available: true,
    availableForClickAndCollect: true,
    availableForDelivery: true
  },
  {
    categorySlug: "sandwichs",
    title: "Sandwich Kebab",
    description: "Viande kebab, salade, tomates, oignons",
    price: 6.90,
    badge: null,
    available: true,
    availableForClickAndCollect: true,
    availableForDelivery: true
  },
  {
    categorySlug: "sandwichs",
    title: "Sandwich Américain",
    description: "Steak haché, frites, œuf, sauce américaine",
    price: 7.50,
    badge: "NEW",
    available: true,
    availableForClickAndCollect: true,
    availableForDelivery: true
  },
  
  // PANINIS
  {
    categorySlug: "paninis",
    title: "Panini 3 Fromages",
    description: "Mozzarella, cheddar, emmental fondants",
    price: 5.50,
    badge: null,
    available: true,
    availableForClickAndCollect: true,
    availableForDelivery: true
  },
  {
    categorySlug: "paninis",
    title: "Panini Poulet",
    description: "Poulet, fromage, sauce curry",
    price: 6.50,
    badge: null,
    available: true,
    availableForClickAndCollect: true,
    availableForDelivery: true
  },
  
  // FRITES & ACCOMPAGNEMENTS
  {
    categorySlug: "frites-accompagnements",
    title: "Frites Maison",
    description: "Frites fraîches coupées sur place",
    price: 4.50,
    badge: null,
    available: true,
    availableForClickAndCollect: true,
    availableForDelivery: true
  },
  {
    categorySlug: "frites-accompagnements",
    title: "Potatoes",
    description: "Quartiers de pommes de terre épicés",
    price: 5.00,
    badge: null,
    available: true,
    availableForClickAndCollect: true,
    availableForDelivery: true
  },
  {
    categorySlug: "frites-accompagnements",
    title: "Nuggets (6 pièces)",
    description: "Nuggets de poulet croustillants",
    price: 5.50,
    badge: null,
    available: true,
    availableForClickAndCollect: true,
    availableForDelivery: true
  },
  {
    categorySlug: "frites-accompagnements",
    title: "Onion Rings",
    description: "Rondelles d'oignons panées",
    price: 4.90,
    badge: "TOP",
    available: true,
    availableForClickAndCollect: true,
    availableForDelivery: true
  },
  
  // DESSERTS
  {
    categorySlug: "desserts",
    title: "Tiramisu",
    description: "Tiramisu maison au café",
    price: 4.50,
    badge: null,
    available: true,
    availableForClickAndCollect: true,
    availableForDelivery: true
  },
  {
    categorySlug: "desserts",
    title: "Brownie Chocolat",
    description: "Brownie fondant au chocolat",
    price: 4.00,
    badge: null,
    available: true,
    availableForClickAndCollect: true,
    availableForDelivery: true
  },
  
  // BOISSONS
  {
    categorySlug: "boissons",
    title: "Coca-Cola 33cl",
    description: "Canette Coca-Cola fraîche",
    price: 2.50,
    badge: null,
    available: true,
    availableForClickAndCollect: true,
    availableForDelivery: true
  },
  {
    categorySlug: "boissons",
    title: "Orangina 33cl",
    description: "Canette Orangina",
    price: 2.50,
    badge: null,
    available: true,
    availableForClickAndCollect: true,
    availableForDelivery: true
  },
  {
    categorySlug: "boissons",
    title: "Ice Tea Pêche 33cl",
    description: "Canette Ice Tea",
    price: 2.50,
    badge: null,
    available: true,
    availableForClickAndCollect: true,
    availableForDelivery: true
  },
  {
    categorySlug: "boissons",
    title: "Eau Minérale 50cl",
    description: "Bouteille d'eau",
    price: 1.50,
    badge: null,
    available: true,
    availableForClickAndCollect: true,
    availableForDelivery: true
  }
];

async function main() {
  try {
    console.log('🌱 Début du seeding avec Prisma...');

    // Nettoyer les données existantes
    console.log('🧹 Nettoyage des données existantes...');
    await prisma.menu.deleteMany();
    await prisma.category.deleteMany();

    // Créer les catégories
    console.log('📂 Création des catégories...');
    const createdCategories = await Promise.all(
      categories.map(async (category) => {
        return await prisma.category.create({
          data: {
            name: category.name,
            slug: category.slug,
          },
        });
      })
    );

    console.log(`✅ ${createdCategories.length} catégories créées`);

    // Créer une map pour retrouver les IDs des catégories par slug
    const categoryMap = new Map();
    createdCategories.forEach((cat) => {
      categoryMap.set(cat.slug, cat.id);
    });

    // Créer les menus
    console.log('🍽️ Création des menus...');
    const createdMenus = await Promise.all(
      menuItems.map(async (item) => {
        const categoryId = categoryMap.get(item.categorySlug);
        if (!categoryId) {
          throw new Error(`Catégorie non trouvée pour le menu: ${item.title} (slug: ${item.categorySlug})`);
        }

        return await prisma.menu.create({
          data: {
            title: item.title,
            description: item.description,
            price: item.price,
            badge: item.badge,
            image: '/images/placeholder.svg',
            available: item.available,
            availableForClickAndCollect: item.availableForClickAndCollect,
            availableForDelivery: item.availableForDelivery,
            categoryId: categoryId,
          },
        });
      })
    );

    console.log(`✅ ${createdMenus.length} menus créés`);

    // Afficher un résumé
    console.log('\n📊 Résumé du seeding:');
    const totalCategories = await prisma.category.count();
    const totalMenus = await prisma.menu.count();
    
    console.log(`- Catégories: ${totalCategories}`);
    console.log(`- Menus: ${totalMenus}`);

    console.log('\n🎉 Seeding terminé avec succès!');

  } catch (error) {
    console.error('❌ Erreur lors du seeding:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });