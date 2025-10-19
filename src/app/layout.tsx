import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { AuthProvider } from '@/contexts/auth-context'
import { Header } from '@/app/layout/header'
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Éditeur d'Images IA - Transformez vos images instantanément",
  description: "Transformez vos images avec l'intelligence artificielle de pointe. Éditeur d'images IA gratuit, rapide et puissant. Propulsé par Next.js 15, React 19 et Replicate.",
  keywords: ["IA", "intelligence artificielle", "éditeur d'images", "transformation d'images", "AI image editor"],
  authors: [{ name: "AI Image Editor Team" }],
  openGraph: {
    title: "Éditeur d'Images IA",
    description: "Transformez vos images avec l'IA en quelques secondes",
    type: "website",
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
        <AuthProvider>
          <Header />
          {children}
          <Analytics />
          <SpeedInsights />
        </AuthProvider>
      </body>
    </html>
  );
}
