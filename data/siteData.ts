// Données centralisées pour le site Quarter Fusion
export const siteData = {
  // Informations du restaurant
  restaurant: {
    name: "Quarter Fusion",
    phone: "01 30 17 31 78",
    address: "6 passage de l'aurore, 95800 Cergy"
  },

  // Horaires d'ouverture
  hours: {
    monday: "18:00 - 02:00",
    tuesday: "18:00 - 02:00", 
    wednesday: "18:00 - 02:00",
    thursday: "18:00 - 02:00",
    friday: "18:00 - 02:00",
    saturday: "18:00 - 02:00",
    sunday: "18:00 - 02:00"
  },

  // Best-sellers (section Hero)
  bestSellers: [
    {
      id: 1,
      badge: "HOT",
      title: "Bucket Maxi Fusion",
      description: "Notre bucket signature avec 8 pièces de poulet croustillant, accompagné de frites et sauces maison",
      price: "24.90€",
      image: "/images/placeholder.svg"
    },
    {
      id: 2,
      badge: "NEW",
      title: "Quarter Crousty",
      description: "Nouveau ! Quarter de poulet pané avec une croûte extra croustillante et épices secrètes",
      price: "8.50€",
      image: "/images/placeholder.svg"
    },
    {
      id: 3,
      badge: "TOP",
      title: "Sandwich au Four",
      description: "Sandwich gourmet avec poulet grillé, fromage fondu et légumes frais",
      price: "12.90€",
      image: "/images/placeholder.svg"
    }
  ],

  // Étapes de préparation
  steps: [
    {
      id: 1,
      title: "Commande",
      description: "Passez votre commande en ligne ou par téléphone",
      image: "/images/placeholder.svg"
    },
    {
      id: 2,
      title: "Préparation",
      description: "Nos chefs préparent votre repas avec des ingrédients frais",
      image: "/images/placeholder.svg"
    },
    {
      id: 3,
      title: "Livraison",
      description: "Livraison rapide à domicile ou retrait en restaurant",
      image: "/images/placeholder.svg"
    }
  ],

  // Conditions de livraison
  delivery: {
    minimum: "20€",
    fee: "à partir de 2.50€",
    time: "30-45 minutes",
    zones: "Cergy et environs"
  },

  // Réseaux sociaux
  socialMedia: [
    {
      name: "TikTok",
      url: "https://www.tiktok.com/@quarter.fusion95?_t=ZN-8yaS2b0fBDi&_r=1",
      icon: "🎵"
    },
    {
      name: "Instagram", 
      url: "https://www.instagram.com/quarter.fusion?igsh=MTd2Nnc2ZDBja2ZubA==",
      icon: "📸"
    },
    {
      name: "Snapchat",
      url: "https://t.snapchat.com/qCBjA7AK", 
      icon: "👻"
    }
  ],

  // Navigation
  navigation: [
    { name: "🏠 Accueil", href: "/" },
    { name: "🍽️ Menu", href: "/click-and-collect" },
    { name: "🚗 Livraison", href: "/livraison" },
    { name: "📞 Contact", href: "/contact" }
  ]
}; 