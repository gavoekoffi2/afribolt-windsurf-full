"use client";

import { motion } from "framer-motion";
import { CheckIcon, StarIcon } from "@heroicons/react/24/outline";

const plans = [
  {
    name: "Starter",
    price: "0€",
    description: "Parfait pour découvrir et petits projets",
    features: [
      "3 projets actifs",
      "100 messages IA/mois",
      "Accès aux 7 agents",
      "Support communautaire",
      "Templates de base"
    ],
    featured: false
  },
  {
    name: "Pro",
    price: "49€",
    description: "Pour développeurs et équipes croissantes",
    features: [
      "Projets illimités",
      "1000 messages IA/mois",
      "Tous les agents avancés",
      "Support prioritaire",
      "Export de code",
      "Collaboration d'équipe",
      "API access"
    ],
    featured: true
  },
  {
    name: "Enterprise",
    price: "199€",
    description: "Pour organisations et grands projets",
    features: [
      "Tout le plan Pro",
      "Messages IA illimités",
      "Agents personnalisés",
      "Support dédié 24/7",
      "Onboarding premium",
      "SLA garanti",
      "Infrastructure privée",
      "Formation équipe"
    ],
    featured: false
  }
];

export function Pricing() {
  return (
    <section id="pricing" className="py-24 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl"
          >
            Tarifs
            <span className="text-gradient"> Transparents</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-4 text-lg leading-8 text-gray-600 max-w-2xl mx-auto"
          >
            Choisissez le plan parfait pour vos besoins. Commencez gratuitement, évoluez selon votre croissance.
          </motion.p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative rounded-2xl p-8 ${
                plan.featured
                  ? "bg-afribolt-600 ring-2 ring-afribolt-600 shadow-xl"
                  : "bg-white border border-gray-200 shadow-lg"
              }`}
            >
              {plan.featured && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="inline-flex items-center rounded-full bg-afribolt-100 px-4 py-1 text-sm font-medium text-afribolt-800">
                    <StarIcon className="h-4 w-4 mr-1" />
                    Plus populaire
                  </div>
                </div>
              )}

              <div className="text-center">
                <h3 className={`text-2xl font-bold ${
                  plan.featured ? "text-white" : "text-gray-900"
                }`}>
                  {plan.name}
                </h3>
                <p className={`mt-2 text-sm ${
                  plan.featured ? "text-afribolt-100" : "text-gray-600"
                }`}>
                  {plan.description}
                </p>
                <div className="mt-6">
                  <span className={`text-4xl font-bold ${
                    plan.featured ? "text-white" : "text-gray-900"
                  }`}>
                    {plan.price}
                  </span>
                  <span className={`text-sm ${
                    plan.featured ? "text-afribolt-100" : "text-gray-600"
                  }`}>
                    /mois
                  </span>
                </div>
              </div>

              <ul className={`mt-8 space-y-4 ${
                plan.featured ? "text-afribolt-100" : "text-gray-600"
              }`}>
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start">
                    <CheckIcon className={`h-5 w-5 flex-shrink-0 ${
                      plan.featured ? "text-afribolt-200" : "text-afribolt-600"
                    }`} />
                    <span className="ml-3 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8">
                <button
                  className={`w-full rounded-lg px-4 py-3 text-center font-medium transition-colors ${
                    plan.featured
                      ? "bg-white text-afribolt-600 hover:bg-gray-100"
                      : "btn-primary"
                  }`}
                >
                  {plan.name === "Starter" ? "Commencer gratuit" : "S'abonner"}
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <p className="text-gray-600">
            Tous les plans incluent • Mise à jour automatique • Annulation à tout moment • 
            <span className="text-afribolt-600 font-medium"> 14 jours d'essai gratuit</span>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
