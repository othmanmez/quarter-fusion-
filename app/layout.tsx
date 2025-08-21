import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Quarter Fusion - Restaurant de Snack à Paris",
  description: "Découvrez Quarter Fusion, votre restaurant de snack préféré à Paris. Plats délicieux, livraison rapide et service impeccable. Commandez en ligne !",
  keywords: "restaurant, snack, paris, livraison, commande en ligne, poulet, burger, frites",
  authors: [{ name: "Quarter Fusion" }],
  openGraph: {
    title: "Quarter Fusion - Restaurant de Snack à Paris",
    description: "Découvrez Quarter Fusion, votre restaurant de snack préféré à Paris. Plats délicieux, livraison rapide et service impeccable.",
    type: "website",
    locale: "fr_FR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
