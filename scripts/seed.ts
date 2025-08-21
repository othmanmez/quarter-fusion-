import connectDB from '../lib/db';
import Category from '../lib/models/Category';
import Settings from '../lib/models/Settings';

async function seed() {
  try {
    console.log('🌱 Début du seeding...');
    
    await connectDB();

    // Créer les catégories par défaut
    const defaultCategories = [
      'Buckets',
      'Quarters', 
      'Sandwiches',
      'Accompagnements',
      'Boissons',
      'Desserts'
    ];

    console.log('📂 Création des catégories...');
    for (const categoryName of defaultCategories) {
      const existingCategory = await Category.findOne({ 
        name: { $regex: new RegExp(`^${categoryName}$`, 'i') } 
      });
      
      if (!existingCategory) {
        await Category.create({ name: categoryName });
        console.log(`✅ Catégorie créée: ${categoryName}`);
      } else {
        console.log(`⏭️  Catégorie existante: ${categoryName}`);
      }
    }

    // Créer les paramètres par défaut
    console.log('⚙️  Création des paramètres...');
    const existingSettings = await Settings.findOne();
    
    if (!existingSettings) {
      await Settings.create({
        orderingOpen: true,
        deliveryCities: [
          'Cergy',
          'Pontoise', 
          'Saint-Ouen-l\'Aumône',
          'Eragny',
          'Vauréal',
          'Jouy-le-Moutier'
        ],
        deliveryFee: 2.50,
        minimumOrder: 20,
        deliveryTime: '30-45 minutes'
      });
      console.log('✅ Paramètres créés');
    } else {
      console.log('⏭️  Paramètres existants');
    }

    console.log('🎉 Seeding terminé avec succès!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors du seeding:', error);
    process.exit(1);
  }
}

seed(); 