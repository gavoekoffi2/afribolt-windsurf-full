import "./globals.css";
import { Providers } from "./providers";

export const metadata = {
  title: "AFRIBOLT - Plateforme AI Multi-Agents",
  description: "Alternative africaine premium. Plateforme AI multi-agents pour le developpement moderne.",
  keywords: ["AI", "multi-agents", "developpement", "Afrique", "SaaS", "automation"],
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
    <html lang="fr">
      <body className="bg-gray-50 text-gray-900 font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
