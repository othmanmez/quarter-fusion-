// Script pour initialiser le menu avec les données par défaut
// Usage: node scripts/init-menu.js

const fetch = require('node-fetch');

async function initMenu() {
  try {
    console.log('🚀 Initialisation du menu...');
    
    const response = await fetch('http://localhost:3000/api/menu', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();
    
    if (result.success) {
      console.log('✅ Menu initialisé avec succès !');
      console.log(`📊 ${result.count} éléments ajoutés au menu`);
    } else {
      console.log('ℹ️  Le menu existe déjà ou erreur:', result.message);
    }
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation du menu:', error);
  }
}

// Exécuter le script
initMenu(); 