import "./globals.css";
import { Inter } from "next/font/google";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "AFRIBOLT - Plateforme AI Multi-Agents",
  description: "Alternative africaine premium à MGX, Cursor, Bolt, Lovable. Plateforme AI multi-agents pour le développement moderne.",
  keywords: ["AI", "multi-agents", "développement", "Afrique", "SaaS", "automation"],
  authors: [{ name: "AFRIBOLT Team" }],
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={inter.className}>
      <body className="bg-gray-50 text-gray-900">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}