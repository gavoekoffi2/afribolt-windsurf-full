"use client";

import Link from "next/link";
import {
  Github,
  Twitter,
  Linkedin,
  Mail
} from "lucide-react";

const navigation = {
  produit: [
    { name: "Fonctionnalités", href: "#features" },
    { name: "Agents IA", href: "#agents" },
    { name: "Tarifs", href: "#pricing" },
    { name: "Dashboard", href: "/dashboard" }
  ],
  entreprise: [
    { name: "À propos", href: "#" },
    { name: "Blog", href: "#" },
    { name: "Carrières", href: "#" },
    { name: "Contact", href: "mailto:contact@afribolt.com" }
  ],
  ressources: [
    { name: "Documentation", href: "#" },
    { name: "Guides", href: "#" },
    { name: "Support", href: "mailto:support@afribolt.com" },
    { name: "Status", href: "#" }
  ],
  legal: [
    { name: "Confidentialité", href: "#" },
    { name: "Conditions", href: "#" },
    { name: "Sécurité", href: "#" },
    { name: "RGPD", href: "#" }
  ]
};

const socialLinks = [
  { name: "Twitter", href: "#", icon: Twitter },
  { name: "GitHub", href: "#", icon: Github },
  { name: "LinkedIn", href: "#", icon: Linkedin },
  { name: "Email", href: "mailto:contact@afribolt.com", icon: Mail }
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
              © {new Date().getFullYear()} AFRIBOLT. Tous droits réservés. Fait avec ❤️ en Afrique.
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
