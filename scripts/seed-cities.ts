import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const defaultCities = [
  { name: 'Cergy', postalCode: '95000', deliveryFee: 2.50, minOrder: null },
  { name: 'Pontoise', postalCode: '95300', deliveryFee: 3.00, minOrder: null },
  { name: 'Osny', postalCode: '95520', deliveryFee: 3.00, minOrder: null },
  { name: 'Jouy-le-Moutier', postalCode: '95280', deliveryFee: 2.50, minOrder: null },
  { name: 'Vauréal', postalCode: '95490', deliveryFee: 3.50, minOrder: null },
  { name: 'Éragny', postalCode: '95610', deliveryFee: 3.50, minOrder: null },
  { name: 'Saint-Ouen-l\'Aumône', postalCode: '95310', deliveryFee: 3.00, minOrder: null },
];

async function seedCities() {
  console.log('🚚 Création des villes de livraison par défaut...');

  for (const city of defaultCities) {
    try {
      // Vérifier si la ville existe déjà
      const existingCity = await prisma.deliveryCity.findUnique({
        where: { name: city.name }
      });

      if (existingCity) {
        console.log(`⚠️  ${city.name} existe déjà, on passe...`);
        continue;
      }

      // Créer la ville
      await prisma.deliveryCity.create({
        data: {
          name: city.name,
          postalCode: city.postalCode,
          deliveryFee: city.deliveryFee,
          minOrder: city.minOrder,
          active: true
        }
      });

      console.log(`✅ ${city.name} (${city.postalCode}) - ${city.deliveryFee}€`);
    } catch (error) {
      console.error(`❌ Erreur avec ${city.name}:`, error);
    }
  }

  console.log('\n🎉 Villes de livraison créées avec succès !');
  console.log('\n📍 Villes disponibles :');
  
  const allCities = await prisma.deliveryCity.findMany({
    where: { active: true },
    orderBy: { name: 'asc' }
  });

  allCities.forEach(city => {
    console.log(`   - ${city.name} (${city.postalCode || 'N/A'}) : ${city.deliveryFee.toFixed(2)}€`);
  });
}

seedCities()
  .catch((error) => {
    console.error('❌ Erreur:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

