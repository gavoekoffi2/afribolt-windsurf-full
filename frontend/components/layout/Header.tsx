"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Bars3Icon, 
  XMarkIcon, 
  UserCircleIcon,
  ArrowRightOnRectangleIcon
} from "@heroicons/react/24/outline";
import Link from "next/link";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navigation = [
    { name: "Fonctionnalités", href: "#features" },
    { name: "Agents", href: "#agents" },
    { name: "Tarifs", href: "#pricing" },
    { name: "Dashboard", href: "/dashboard" }
  ];

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-lg"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Global">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-afribolt-600 to-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">AB</span>
              </div>
              <span className={`font-bold text-xl ${
                scrolled ? "text-gray-900" : "text-white"
              }`}>
                AFRIBOLT
              </span>
            </Link>
          </div>

          <div className="hidden lg:flex lg:items-center lg:space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-sm font-medium transition-colors ${
                  scrolled
                    ? "text-gray-700 hover:text-afribolt-600"
                    : "text-white hover:text-afribolt-200"
                }`}
              >
                {item.name}
              </Link>
            ))}
            <Link
              href="/auth/login"
              className="btn-secondary text-sm px-4 py-2"
            >
              Connexion
            </Link>
            <Link
              href="/auth/register"
              className="btn-primary text-sm px-4 py-2"
            >
              Démarrer
            </Link>
          </div>

          <div className="lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`p-2 rounded-md ${
                scrolled
                  ? "text-gray-700 hover:text-afribolt-600"
                  : "text-white hover:text-afribolt-200"
              }`}
            >
              {isOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="lg:hidden bg-white border-t border-gray-200 shadow-lg"
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-afribolt-600 hover:bg-gray-50"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-4 pb-2 border-t border-gray-200">
                <Link
                  href="/auth/login"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-afribolt-600 hover:bg-gray-50"
                  onClick={() => setIsOpen(false)}
                >
                  Connexion
                </Link>
                <Link
                  href="/auth/register"
                  className="block mx-3 mt-2 btn-primary text-center"
                  onClick={() => setIsOpen(false)}
                >
                  Démarrer
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </nav>
    </header>
  );
}
