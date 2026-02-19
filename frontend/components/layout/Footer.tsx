"use client";

import Link from "next/link";
import { 
  GithubIcon,
  TwitterIcon,
  LinkedinIcon,
  MailIcon
} from "lucide-react";

const navigation = {
  produit: [
    { name: "Fonctionnalités", href: "#features" },
    { name: "Agents IA", href: "#agents" },
    { name: "Tarifs", href: "#pricing" },
    { name: "API", href: "/docs/api" }
  ],
  entreprise: [
    { name: "À propos", href: "/about" },
    { name: "Blog", href: "/blog" },
    { name: "Carrières", href: "/careers" },
    { name: "Presse", href: "/press" }
  ],
  ressources: [
    { name: "Documentation", href: "/docs" },
    { name: "Guides", href: "/guides" },
    { name: "Support", href: "/support" },
    { name: "Status", href: "/status" }
  ],
  legal: [
    { name: "Confidentialité", href: "/privacy" },
    { name: "Conditions", href: "/terms" },
    { name: "Sécurité", href: "/security" },
    { name: "RGPD", href: "/gdpr" }
  ]
};

const socialLinks = [
  { name: "Twitter", href: "#", icon: TwitterIcon },
  { name: "GitHub", href: "#", icon: GithubIcon },
  { name: "LinkedIn", href: "#", icon: LinkedinIcon },
  { name: "Email", href: "mailto:contact@afribolt.com", icon: MailIcon }
];

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-afribolt-600 to-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">AB</span>
              </div>
              <span className="font-bold text-xl">AFRIBOLT</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
              La plateforme AI multi-agents qui révolutionne le développement logiciel. 
              Créée en Afrique, pour le monde entier.
            </p>
            <div className="mt-6 flex space-x-4">
              {socialLinks.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-gray-400 hover:text-white transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <item.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Produit</h3>
            <ul className="space-y-2">
              {navigation.produit.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-gray-400 hover:text-white text-sm transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Entreprise</h3>
            <ul className="space-y-2">
              {navigation.entreprise.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-gray-400 hover:text-white text-sm transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Ressources</h3>
            <ul className="space-y-2">
              {navigation.ressources.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-gray-400 hover:text-white text-sm transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Légal</h3>
            <ul className="space-y-2">
              {navigation.legal.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-gray-400 hover:text-white text-sm transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              {`\u00A9 ${new Date().getFullYear()} AFRIBOLT. Tous droits r\u00E9serv\u00E9s. Fait avec \u2764\uFE0F en Afrique.`}
            </p>
            <div className="mt-4 md:mt-0 flex items-center space-x-6">
              <span className="text-gray-400 text-sm">
                Status: 
                <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-900 text-green-300">
                  Opérationnel
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
