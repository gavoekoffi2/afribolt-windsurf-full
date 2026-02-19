"use client";

import { motion } from "framer-motion";
import { 
  CpuChipIcon, 
  GlobeAltIcon, 
  ShieldCheckIcon, 
  RocketLaunchIcon,
  SparklesIcon,
  CodeBracketIcon
} from "@heroicons/react/24/outline";

const features = [
  {
    name: "Agents Multi-IA",
    description: "7 agents spécialisés collaboratifs avec des rôles uniques pour couvrir tous les aspects du développement.",
    icon: CpuChipIcon,
    color: "bg-purple-500"
  },
  {
    name: "Multi-LLM Router",
    description: "Support d'OpenAI GPT, Anthropic Claude, Google Gemini avec sélection dynamique du meilleur modèle.",
    icon: SparklesIcon,
    color: "bg-blue-500"
  },
  {
    name: "Architecture Scalable",
    description: "Infrastructure moderne conçue pour grandir avec vos projets, de la startup à l'entreprise.",
    icon: RocketLaunchIcon,
    color: "bg-green-500"
  },
  {
    name: "Sécurité Avancée",
    description: "Authentification JWT, OAuth 2.0, chiffrement de bout en bout et conformité RGPD.",
    icon: ShieldCheckIcon,
    color: "bg-red-500"
  },
  {
    name: "Déploiement Instantané",
    description: "Déployez vos projets en un clic sur Vercel, Render, Railway ou votre propre infrastructure.",
    icon: GlobeAltIcon,
    color: "bg-yellow-500"
  },
  {
    name: "Code de Qualité",
    description: "Génération de code production-ready avec tests intégrés et documentation automatique.",
    icon: CodeBracketIcon,
    color: "bg-indigo-500"
  }
];

export function Features() {
  return (
    <section id="features" className="py-24 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl"
          >
            Fonctionnalités
            <span className="text-gradient"> Puissantes</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-4 text-lg leading-8 text-gray-600 max-w-2xl mx-auto"
          >
            Tout ce dont vous avez besoin pour développer, déployer et scaler vos projets avec l'intelligence artificielle.
          </motion.p>
        </div>

        <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={feature.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="card group hover:shadow-lg transition-all duration-300 cursor-pointer"
            >
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 group-hover:bg-gray-200 transition-colors duration-300 mb-6">
                <feature.icon className="h-8 w-8 text-gray-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {feature.name}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center rounded-full bg-afribolt-100 px-6 py-3 text-base font-medium text-afribolt-800">
            <SparklesIcon className="h-5 w-5 mr-2" />
            Et bien plus de fonctionnalités à découvrir
          </div>
        </motion.div>
      </div>
    </section>
  );
}
