"use client";

import { motion } from "framer-motion";
import { 
  UserGroupIcon,
  CpuChipIcon,
  ServerIcon,
  PaintBrushIcon,
  DevicePhoneMobileIcon,
  BookOpenIcon,
  PencilSquareIcon
} from "@heroicons/react/24/outline";

const agents = [
  {
    name: "EMEFA",
    role: "Team Lead AI",
    description: "Manager général qui coordonne tous les agents, planifie les projets et valide la qualité.",
    icon: UserGroupIcon,
    color: "agent-emefa",
    capabilities: ["Coordination", "Planification", "Qualité", "Décisions"]
  },
  {
    name: "KOFFI", 
    role: "Architecte & Stratégie",
    description: "Conçoit l'architecture applicative, structure les projets et définit les choix technologiques.",
    icon: CpuChipIcon,
    color: "agent-koffi",
    capabilities: ["Architecture", "Scalabilité", "Technologies", "Strategy"]
  },
  {
    name: "DÉDÉ",
    role: "Backend & Infrastructure", 
    description: "Développe le backend, les APIs, gère les bases de données et assure la sécurité.",
    icon: ServerIcon,
    color: "agent-dede",
    capabilities: ["Backend", "APIs", "Base de données", "Sécurité"]
  },
  {
    name: "SOLIM",
    role: "UX / UI Designer",
    description: "Crée des designs professionnels, wireframes et interfaces utilisateur élégantes.",
    icon: PaintBrushIcon,
    color: "agent-solim", 
    capabilities: ["Design", "UX/UI", "Wireframes", "Accessibilité"]
  },
  {
    name: "AKOFA",
    role: "Frontend Builder",
    description: "Implémente les interfaces, compose le fonctionnement et rend le produit utilisable.",
    icon: DevicePhoneMobileIcon,
    color: "agent-akofa",
    capabilities: ["Frontend", "React", "Responsive", "Performance"]
  },
  {
    name: "KWAMI",
    role: "Documentation & Knowledge",
    description: "Rédige la documentation, crée les guides et organise la connaissance technique.",
    icon: BookOpenIcon,
    color: "agent-kwami",
    capabilities: ["Documentation", "Guides", "README", "Knowledge"]
  },
  {
    name: "YAOVI",
    role: "Dev Collaboration",
    description: "Aide au bug fixing, assure la cohérence et améliore les processus de développement.",
    icon: PencilSquareIcon,
    color: "agent-yaovi",
    capabilities: ["Bug fixing", "Collaboration", "Processus", "Optimisation"]
  }
];

export function Agents() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl"
          >
            Les Agents
            <span className="text-gradient"> AFRIBOLT</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-4 text-lg leading-8 text-gray-600 max-w-2xl mx-auto"
          >
            7 agents IA spécialisés avec des personnalités uniques, travaillant en collaboration pour transformer vos idées en réalité.
          </motion.p>
        </div>

        <div className="mt-16">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {agents.map((agent, index) => (
              <motion.div
                key={agent.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group"
              >
                <div className="card h-full hover:shadow-xl transition-all duration-300 cursor-pointer">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className={`w-12 h-12 rounded-full ${agent.color} flex items-center justify-center text-white font-bold text-lg`}>
                      {agent.name[0]}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{agent.name}</h3>
                      <p className="text-sm text-gray-600">{agent.role}</p>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    {agent.description}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {agent.capabilities.map((capability) => (
                      <span
                        key={capability}
                        className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800"
                      >
                        {capability}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center rounded-full bg-afribolt-100 px-6 py-3 text-base font-medium text-afribolt-800">
            <UserGroupIcon className="h-5 w-5 mr-2" />
            Collaboration intelligente entre agents
          </div>
        </motion.div>
      </div>
    </section>
  );
}
