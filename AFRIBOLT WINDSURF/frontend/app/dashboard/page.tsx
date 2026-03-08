"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import {
  PlusIcon,
  CpuChipIcon,
  CodeBracketIcon,
  UserGroupIcon,
  ClockIcon
} from "@heroicons/react/24/outline";
import { AgentCard } from "@/components/dashboard/AgentCard";
import { ProjectCard } from "@/components/dashboard/ProjectCard";
import { ChatInterface } from "@/components/dashboard/ChatInterface";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedProject, setSelectedProject] = useState(null);

  const stats = [
    {
      name: "Projets actifs",
      value: "12",
      change: "+2",
      changeType: "increase",
      icon: CodeBracketIcon
    },
    {
      name: "Agents utilisés",
      value: "7",
      change: "0",
      changeType: "neutral",
      icon: CpuChipIcon
    },
    {
      name: "Messages IA",
      value: "1,234",
      change: "+156",
      changeType: "increase",
      icon: UserGroupIcon
    },
    {
      name: "Temps économisé",
      value: "48h",
      change: "+12h",
      changeType: "increase",
      icon: ClockIcon
    }
  ];

  const recentProjects = [
    {
      id: "1",
      name: "E-commerce Platform",
      description: "Plateforme de vente en ligne moderne",
      status: "active",
      lastActivity: "Il y a 2 heures",
      agents: ["EMEFA", "KOFFI", "DÉDÉ"],
      progress: 75
    },
    {
      id: "2", 
      name: "Mobile Banking App",
      description: "Application bancaire mobile sécurisée",
      status: "active",
      lastActivity: "Il y a 5 heures",
      agents: ["SOLIM", "AKOFA", "YAOVI"],
      progress: 60
    },
    {
      id: "3",
      name: "AI Analytics Dashboard",
      description: "Dashboard d'analyse avec IA intégrée",
      status: "planning",
      lastActivity: "Hier",
      agents: ["KWAMI"],
      progress: 25
    }
  ];

  const agents = [
    {
      name: "EMEFA",
      role: "Team Lead AI",
      status: "active",
      lastMessage: "Coordination du projet terminée",
      color: "agent-emefa"
    },
    {
      name: "KOFFI",
      role: "Architecte & Stratégie",
      status: "idle",
      lastMessage: "Architecture validée",
      color: "agent-koffi"
    },
    {
      name: "DÉDÉ",
      role: "Backend & Infrastructure",
      status: "active",
      lastMessage: "API en développement",
      color: "agent-dede"
    },
    {
      name: "SOLIM",
      role: "UX / UI Designer",
      status: "idle",
      lastMessage: "Wireframes prêts",
      color: "agent-solim"
    },
    {
      name: "AKOFA",
      role: "Frontend Builder",
      status: "active",
      lastMessage: "Components React créés",
      color: "agent-akofa"
    },
    {
      name: "KWAMI",
      role: "Documentation & Knowledge",
      status: "idle",
      lastMessage: "Documentation mise à jour",
      color: "agent-kwami"
    },
    {
      name: "YAOVI",
      role: "Dev Collaboration",
      status: "active",
      lastMessage: "Bug résolu",
      color: "agent-yaovi"
    }
  ];

  return (
    <div>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Bienvenue sur votre espace de développement AI</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="card"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-semibold text-gray-900 mt-1">{stat.value}</p>
                  <div className="flex items-center mt-2">
                    <span className={`text-sm font-medium ${
                      stat.changeType === "increase" ? "text-green-600" : 
                      stat.changeType === "decrease" ? "text-red-600" : "text-gray-500"
                    }`}>
                      {stat.change}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">vs mois dernier</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <stat.icon className="h-6 w-6 text-gray-600" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6" aria-label="Tabs">
                  {["overview", "projects", "agents"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                        activeTab === tab
                          ? "border-afribolt-600 text-afribolt-600"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      {tab === "overview" ? "Vue d'ensemble" : 
                       tab === "projects" ? "Projets" : "Agents"}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-6">
                {activeTab === "overview" && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Projets récents</h3>
                      <div className="space-y-4">
                        {recentProjects.slice(0, 3).map((project) => (
                          <ProjectCard
                            key={project.id}
                            project={project}
                            onSelect={() => setSelectedProject(project)}
                          />
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Agents actifs</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {agents.filter(a => a.status === "active").map((agent) => (
                          <AgentCard key={agent.name} agent={agent} />
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "projects" && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold text-gray-900">Tous les projets</h3>
                      <button
                        className="btn-primary flex items-center text-sm"
                        onClick={() => toast("Création de projet bientôt disponible")}
                      >
                        <PlusIcon className="h-4 w-4 mr-2" />
                        Nouveau projet
                      </button>
                    </div>
                    <div className="space-y-4">
                      {recentProjects.map((project) => (
                        <ProjectCard
                          key={project.id}
                          project={project}
                          onSelect={() => setSelectedProject(project)}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === "agents" && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Tous les agents</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {agents.map((agent) => (
                        <AgentCard key={agent.name} agent={agent} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <ChatInterface />
          </div>
        </div>
      </main>
    </div>
  );
}
