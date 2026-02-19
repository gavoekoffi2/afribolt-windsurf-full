"use client";

import { motion } from "framer-motion";
import { ArrowRightIcon, RocketLaunchIcon } from "@heroicons/react/24/outline";

export function CTA() {
  return (
    <section className="relative py-24 bg-gradient-to-br from-afribolt-600 to-primary-600 overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <RocketLaunchIcon className="h-16 w-16 text-white mx-auto mb-6" />
          
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Prêt à révolutionner votre
            <span className="block">développement avec l'IA ?</span>
          </h2>
          
          <p className="mt-6 text-xl leading-8 text-afribolt-100 max-w-2xl mx-auto">
            Rejoignez des milliers de développeurs qui utilisent déjà AFRIBOLT 
            pour créer plus rapidement, mieux et avec moins d'efforts.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="/auth/register"
              className="bg-white text-afribolt-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors duration-200 flex items-center group shadow-xl"
            >
              Commencer gratuitement
              <ArrowRightIcon className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="/dashboard"
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-afribolt-600 transition-all duration-200"
            >
              Voir le dashboard
            </a>
          </div>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-white">10K+</div>
              <div className="text-sm text-afribolt-100 mt-1">Développeurs actifs</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">50K+</div>
              <div className="text-sm text-afribolt-100 mt-1">Projets créés</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">1M+</div>
              <div className="text-sm text-afribolt-100 mt-1">Lignes de code générées</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
