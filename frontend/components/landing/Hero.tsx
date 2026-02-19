"use client";

import { motion } from "framer-motion";
import { ArrowRightIcon, SparklesIcon } from "@heroicons/react/24/outline";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-afribolt-50 via-white to-primary-50">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-16 sm:pt-24 sm:pb-20">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center rounded-full bg-afribolt-100 px-4 py-2 text-sm font-medium text-afribolt-800 mb-6"
          >
            <SparklesIcon className="h-4 w-4 mr-2" />
            Nouvelle r&#233;volution AI africaine
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl lg:text-7xl"
          >
            <span className="block">{"L'avenir du"}</span>
            <span className="block text-gradient">{"d\u00E9veloppement AI"}</span>
            <span className="block text-2xl sm:text-3xl lg:text-4xl mt-2 text-gray-600">
              est africaine
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600 sm:text-xl"
          >
            {"AFRIBOLT est la plateforme AI multi-agents qui r\u00E9volutionne le d\u00E9veloppement logiciel. 7 agents sp\u00E9cialis\u00E9s collaboratifs pour cr\u00E9er, d\u00E9ployer et scaler vos projets."}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <a
              href="/auth/register"
              className="btn-primary text-lg px-8 py-4 flex items-center group"
            >
              Commencer gratuitement
              <ArrowRightIcon className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="#features"
              className="btn-secondary text-lg px-8 py-4"
            >
              {"D\u00E9couvrir plus"}
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto"
          >
            <div className="text-center">
              <div className="text-3xl font-bold text-afribolt-600">7</div>
              <div className="text-sm text-gray-600 mt-1">{"Agents IA sp\u00E9cialis\u00E9s"}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-afribolt-600">∞</div>
              <div className="text-sm text-gray-600 mt-1">{"Projets illimit\u00E9s"}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-afribolt-600">24/7</div>
              <div className="text-sm text-gray-600 mt-1">{"Disponibilit\u00E9"}</div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-16 relative"
        >
          <div className="relative mx-auto max-w-5xl">
            <div className="absolute inset-0 bg-gradient-to-r from-afribolt-400 to-primary-400 rounded-2xl blur-3xl opacity-20"></div>
            <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-afribolt-600 to-primary-600 px-6 py-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  <span className="ml-4 text-white text-sm font-mono">AFRIBOLT Dashboard</span>
                </div>
              </div>
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                  <div className="space-y-4">
                    <div className="h-4 bg-afribolt-200 rounded w-4/5"></div>
                    <div className="h-4 bg-afribolt-200 rounded w-3/5"></div>
                    <div className="h-4 bg-afribolt-200 rounded w-2/3"></div>
                  </div>
                </div>
                <div className="mt-6 flex space-x-4">
                  <div className="flex-1 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                    <div className="w-12 h-12 bg-afribolt-300 rounded-full"></div>
                  </div>
                  <div className="flex-1 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                    <div className="w-12 h-12 bg-primary-300 rounded-full"></div>
                  </div>
                  <div className="flex-1 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                    <div className="w-12 h-12 bg-green-300 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
