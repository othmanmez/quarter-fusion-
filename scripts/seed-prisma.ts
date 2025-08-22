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
    name: "Frites & Accompagnements", 
    slug: "frites-accompagnements",
    description: "Accompagnements croustillants" 
  },
  { 
    name: "Boissons", 
    slug: "boissons",
    description: "Boissons fraîches et chaudes" 
  }
];

const menuItems = [
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
    categorySlug: "frites-accompagnements",
    title: "Frites Maison",
    description: "Frites fraîches coupées sur place",
    price: 4.50,
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