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

const siteUrl = "https://www.quarter-fusion.fr";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Quarter Fusion – Snack & Livraison à Cergy (95)",
    template: "%s | Quarter Fusion",
  },
  description: "Quarter Fusion, snack à Cergy (95800) — poulet croustillant, burgers, sandwichs. Commandez en Click & Collect ou en livraison sur Cergy, Jouy-le-Moutier, Osny, Pontoise et environs.",
  keywords: [
    "Quarter Fusion",
    "quarter fusion cergy",
    "snack cergy",
    "restaurant cergy",
    "livraison cergy",
    "poulet croustillant cergy",
    "burger cergy",
    "click and collect cergy",
    "snack 95800",
    "restaurant val d'oise",
    "livraison jouy le moutier",
    "livraison osny",
    "livraison pontoise",
  ],
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [{ url: "/apple-icon.png", type: "image/png", sizes: "180x180" }],
  },
  authors: [{ name: "Quarter Fusion" }],
  creator: "Quarter Fusion",
  manifest: "/manifest.json",
  openGraph: {
    title: "Quarter Fusion – Snack & Livraison à Cergy (95)",
    description: "Poulet croustillant, burgers et sandwichs à Cergy. Commandez en ligne — Click & Collect ou livraison à domicile.",
    type: "website",
    locale: "fr_FR",
    url: siteUrl,
    siteName: "Quarter Fusion",
    images: [
      {
        url: "/images/logo-snack.png",
        width: 1200,
        height: 630,
        alt: "Quarter Fusion – Snack à Cergy",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Quarter Fusion – Snack & Livraison à Cergy (95)",
    description: "Poulet croustillant, burgers et sandwichs à Cergy. Commandez en ligne.",
    images: ["/images/logo-snack.png"],
  },
  alternates: {
    canonical: siteUrl,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FastFoodRestaurant",
            "name": "Quarter Fusion",
            "url": "https://www.quarter-fusion.fr",
            "telephone": "01 30 17 31 78",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "6 passage de l'aurore",
              "addressLocality": "Cergy",
              "postalCode": "95800",
              "addressCountry": "FR"
            },
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": 49.0358,
              "longitude": 2.0752
            },
            "openingHoursSpecification": [
              {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
                "opens": "18:00",
                "closes": "02:00"
              }
            ],
            "servesCuisine": ["Snack", "Fast Food", "Poulet", "Burger"],
            "priceRange": "€",
            "hasMenu": "https://www.quarter-fusion.fr/click-and-collect",
            "acceptsReservations": false,
            "sameAs": [
              "https://www.tiktok.com/@quarter.fusion95",
              "https://www.instagram.com/quarter.fusion"
            ]
          })
        }}
      />
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
