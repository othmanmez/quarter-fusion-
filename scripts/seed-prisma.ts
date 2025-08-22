import { PrismaClient } from '@prisma/client';
import { categories, menuItems } from '../data/menuData';

const prisma = new PrismaClient();

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

    // Créer une map pour retrouver les IDs des catégories
    const categoryMap = new Map();
    createdCategories.forEach((cat) => {
      const originalCategory = categories.find(c => c.name === cat.name);
      if (originalCategory) {
        categoryMap.set(originalCategory.name, cat.id);
      }
    });

    // Créer les menus
    console.log('🍽️ Création des menus...');
    const createdMenus = await Promise.all(
      menuItems.map(async (item) => {
        const categoryId = categoryMap.get(item.category);
        if (!categoryId) {
          throw new Error(`Catégorie non trouvée pour le menu: ${item.title}`);
        }

        return await prisma.menu.create({
          data: {
            title: item.title,
            description: item.description,
            price: item.price,
            image: '/images/placeholder.svg', // Image par défaut
            available: item.available,
            availableForClickAndCollect: true, // Par défaut disponible pour click-and-collect
            availableForDelivery: true, // Par défaut disponible pour livraison
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