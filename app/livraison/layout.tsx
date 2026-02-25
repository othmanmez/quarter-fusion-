import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Livraison à domicile – Cergy, Osny, Pontoise, Jouy-le-Moutier',
  description: 'Commandez Quarter Fusion en livraison à domicile : Cergy, Jouy-le-Moutier, Osny, Pontoise, Saint-Ouen-l\'Aumône, Vauréal, Éragny. Livraison rapide, minimum 20€.',
  keywords: [
    'livraison cergy',
    'livraison quarter fusion',
    'livraison snack cergy',
    'livraison jouy le moutier',
    'livraison osny',
    'livraison pontoise',
    'livraison saint ouen l\'aumone',
    'livraison vaureal',
    'commande en ligne cergy',
  ],
  alternates: {
    canonical: 'https://www.quarterfusion.fr/livraison',
  },
  openGraph: {
    title: 'Livraison à domicile – Quarter Fusion Cergy',
    description: 'Commandez en livraison sur Cergy et ses environs. Poulet croustillant, burgers, sandwichs livrés chez vous.',
    url: 'https://www.quarterfusion.fr/livraison',
  },
};

export default function LivraisonLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
