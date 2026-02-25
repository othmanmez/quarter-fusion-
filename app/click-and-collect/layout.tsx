import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Menu & Click and Collect – Quarter Fusion Cergy',
  description: 'Consultez le menu Quarter Fusion et commandez en Click & Collect. Poulet croustillant, burgers, sandwichs et bien plus. Retirez votre commande au 6 passage de l\'aurore, Cergy.',
  keywords: [
    'menu quarter fusion',
    'click and collect cergy',
    'commander quarter fusion',
    'menu snack cergy',
    'poulet cergy',
    'burger cergy',
    'emporter cergy',
  ],
  alternates: {
    canonical: 'https://www.quarterfusion.fr/click-and-collect',
  },
  openGraph: {
    title: 'Menu & Click and Collect – Quarter Fusion Cergy',
    description: 'Découvrez notre menu et commandez en Click & Collect au 6 passage de l\'aurore, Cergy.',
    url: 'https://www.quarterfusion.fr/click-and-collect',
  },
};

export default function ClickAndCollectLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
