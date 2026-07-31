import type { Metadata } from "next";
import { Literata, Manrope } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";

const literata = Literata({
  variable: "--font-fraunces",
  subsets: ["latin", "cyrillic"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  title: "Life Map — биографии на карте",
  description:
    "Waypoints: исследуйте жизненный путь на карте с фото и фильтрами по типам мест.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={`${literata.variable} ${manrope.variable} h-full`}>
      <body className="min-h-full antialiased">
        <Suspense fallback={<div className="p-6 text-sm text-ink/60">Загрузка…</div>}>
          {children}
        </Suspense>
      </body>
    </html>
  );
}
