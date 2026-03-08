"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import {
  UserCircleIcon,
  KeyIcon,
  BellIcon,
  CpuChipIcon,
} from "@heroicons/react/24/outline";
import api from "@/lib/api";

interface UserProfile {
  id: string;
  email: string;
  name: string | null;
  avatar: string | null;
}

export default function SettingsPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [name, setName] = useState("");
  const [activeSection, setActiveSection] = useState("profile");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get("/api/auth/me");
      const userData = response.data?.data?.user;
      if (userData) {
        setUser(userData);
        setName(userData.name || "");
      }
    } catch {
      // User not authenticated or API unavailable
    } finally {
      setIsLoading(false);
    }
  };

  const sections = [
    { id: "profile", name: "Profil", icon: UserCircleIcon },
    { id: "api-keys", name: "Clés API", icon: KeyIcon },
    { id: "notifications", name: "Notifications", icon: BellIcon },
    { id: "agents", name: "Configuration Agents", icon: CpuChipIcon },
  ];

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-afribolt-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Paramètres</h1>
        <p className="text-gray-600 mt-2">Gérez votre compte et vos préférences</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <nav className="md:w-48 flex-shrink-0">
          <div className="space-y-1">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex items-center gap-3 w-full px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  activeSection === section.id
                    ? "bg-afribolt-50 text-afribolt-700"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <section.icon className="h-5 w-5" />
                {section.name}
              </button>
            ))}
          </div>
        </nav>

        <div className="flex-1">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            {activeSection === "profile" && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900">Profil</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={user?.email || ""}
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-afribolt-500 focus:border-transparent outline-none text-sm"
                      placeholder="Votre nom"
                    />
                  </div>
                  <button
                    onClick={() => toast.success("Profil mis à jour")}
                    className="btn-primary text-sm"
                  >
                    Enregistrer
                  </button>
                </div>
              </div>
            )}

            {activeSection === "api-keys" && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900">Clés API</h2>
                <p className="text-sm text-gray-600">
                  Les clés API sont configurées côté serveur pour la sécurité.
                  Contactez votre administrateur pour modifier les clés.
                </p>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  {["OpenAI (GPT-4)", "Anthropic (Claude)", "Google AI (Gemini)"].map((provider) => (
                    <div key={provider} className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">{provider}</span>
                      <span className="text-xs px-2 py-1 rounded-full bg-gray-200 text-gray-600">
                        Configuré côté serveur
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSection === "notifications" && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
                <div className="space-y-4">
                  {[
                    { label: "Notifications par email", description: "Recevez des mises à jour par email" },
                    { label: "Alertes agents", description: "Notifications quand un agent termine une tâche" },
                    { label: "Résumé hebdomadaire", description: "Résumé de l'activité de la semaine" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{item.label}</p>
                        <p className="text-xs text-gray-500">{item.description}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-9 h-5 bg-gray-200 peer-focus:ring-2 peer-focus:ring-afribolt-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-afribolt-600"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSection === "agents" && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900">Configuration des Agents</h2>
                <p className="text-sm text-gray-600">
                  Personnalisez le comportement des agents IA pour vos projets.
                </p>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Modèle par défaut</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-afribolt-500 focus:border-transparent outline-none text-sm">
                      <option value="gpt-4">GPT-4 (OpenAI)</option>
                      <option value="claude-3-sonnet">Claude 3 Sonnet (Anthropic)</option>
                      <option value="claude-3-opus">Claude 3 Opus (Anthropic)</option>
                      <option value="gemini-pro">Gemini Pro (Google)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Température</label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      defaultValue="0.7"
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Précis (0)</span>
                      <span>Créatif (1)</span>
                    </div>
                  </div>
                  <button
                    onClick={() => toast.success("Configuration mise à jour")}
                    className="btn-primary text-sm"
                  >
                    Enregistrer
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
