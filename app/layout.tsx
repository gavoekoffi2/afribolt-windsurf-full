import "./globals.css";
import { Providers } from "./providers";

export const metadata = {
  title: "AFRIBOLT - Plateforme AI Multi-Agents",
  description: "Alternative africaine premium à MGX, Cursor, Bolt, Lovable. Plateforme AI multi-agents pour le développement moderne.",
  keywords: ["AI", "multi-agents", "développement", "Afrique", "SaaS", "automation"],
  authors: [{ name: "AFRIBOLT Team" }],
  viewport: "width=device-width, initial-scale=1",
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
