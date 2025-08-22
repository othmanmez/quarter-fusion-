'use client';

import { useEffect } from 'react';

export default function ConsoleSignature() {
  useEffect(() => {
    // Console easter egg pour les développeurs curieux
    console.log(`
%c🍔 Quarter Fusion Restaurant Website%c

%c👨‍💻 Développé par:%c
%c• Samy Ajouid (https://samy-dev.fr)%c
%c• Othman Meziane (a-rajouter)%c

%c💻 Stack: Next.js 15 + TypeScript + Tailwind CSS + Prisma + MongoDB%c
%c🤝 Équipe: Développeurs Full-Stack%c

%cMerci de visiter nos portfolios pour d'autres projets !%c
`, 
      'color: #dc2626; font-size: 18px; font-weight: bold;', '',
      'color: #3b82f6; font-weight: bold;', '',
      'color: #059669;', '',
      'color: #059669;', '',
      'color: #7c3aed;', '',
      'color: #e11d48;', '',
      'color: #dc2626; font-style: italic;', ''
    );
  }, []);

  return null; // Ce composant n'affiche rien visuellement
}