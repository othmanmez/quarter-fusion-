'use client';

import { useEffect } from 'react';

export default function HydrationFix() {
  useEffect(() => {
    // Supprimer les attributs DarkReader qui causent les erreurs d'hydratation
    const html = document.documentElement;
    if (html.hasAttribute('data-darkreader-mode')) {
      html.removeAttribute('data-darkreader-mode');
    }
    if (html.hasAttribute('data-darkreader-scheme')) {
      html.removeAttribute('data-darkreader-scheme');
    }
    if (html.hasAttribute('data-darkreader-proxy-injected')) {
      html.removeAttribute('data-darkreader-proxy-injected');
    }
  }, []);

  return null;
}