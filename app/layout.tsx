import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import HydrationFix from "../components/HydrationFix";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ConsoleSignature from "../components/ConsoleSignature";

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
  authors: [
    { name: "Quarter Fusion" },
    { name: "Samy Ajouid - Développeur Full-Stack", url: "https://samy-dev.fr" },
    { name: "Othman Meziane - Développeur", url: "a-rajouter" }
  ],
  creator: "Samy Ajouid & Othman Meziane",
  generator: "Next.js 15 - Développé par Samy Ajouid & Othman Meziane",
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
      {/* 
        Quarter Fusion Restaurant Website
        Développé par Samy Ajouid (https://samy-dev.fr) & Othman Meziane (a-rajouter)
        Équipe: Développeurs Full-Stack
        Stack: Next.js 15, TypeScript, Tailwind CSS, Prisma, MongoDB
        © 2025 - Collaboration technique
      */}
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
      <Navbar />

      <div className="pt-16">
        <Providers>
          <HydrationFix />
          <ConsoleSignature />
          {children}
        </Providers>
      </div>
        <Footer/>
      </body>
    </html>
  );
}
