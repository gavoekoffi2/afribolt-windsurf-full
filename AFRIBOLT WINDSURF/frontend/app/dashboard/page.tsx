"use client";

import { useState, useEffect } from "react";
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
import api from "@/lib/api";

interface Project {
  id: string;
  name: string;
  description: string;
  status: "active" | "planning" | "completed";
  updatedAt: string;
  agents: { name: string; type: string; status: string }[];
  _count?: { sessions: number; histories: number };
}

const DEMO_AGENTS = [
  { name: "EMEFA", role: "Team Lead AI", status: "active" as const, lastMessage: "Coordination du projet terminée", color: "agent-emefa" },
  { name: "KOFFI", role: "Architecte & Stratégie", status: "idle" as const, lastMessage: "Architecture validée", color: "agent-koffi" },
  { name: "DÉDÉ", role: "Backend & Infrastructure", status: "active" as const, lastMessage: "API en développement", color: "agent-dede" },
  { name: "SOLIM", role: "UX / UI Designer", status: "idle" as const, lastMessage: "Wireframes prêts", color: "agent-solim" },
  { name: "AKOFA", role: "Frontend Builder", status: "active" as const, lastMessage: "Components React créés", color: "agent-akofa" },
  { name: "KWAMI", role: "Documentation & Knowledge", status: "idle" as const, lastMessage: "Documentation mise à jour", color: "agent-kwami" },
  { name: "YAOVI", role: "Dev Collaboration", status: "active" as const, lastMessage: "Bug résolu", color: "agent-yaovi" },
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedProject, setSelectedProject] = useState(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await api.get("/api/projects");
      setProjects(response.data?.data?.projects || []);
    } catch {
      // API unavailable - use empty state
      setProjects([]);
    } finally {
      setIsLoading(false);
    }
  };

  const createProject = async () => {
    if (!newProjectName.trim()) return;
    try {
      await api.post("/api/projects", { name: newProjectName.trim() });
      toast.success("Projet créé avec succès!");
      setNewProjectName("");
      setIsCreating(false);
      fetchProjects();
    } catch {
      toast.error("Erreur lors de la création du projet");
    }
  };

  const displayProjects = projects.map((p) => ({
    id: p.id,
    name: p.name,
    description: p.description || "Aucune description",
    status: p.status as "active" | "planning" | "completed",
    lastActivity: new Date(p.updatedAt).toLocaleDateString("fr-FR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }),
    agents: p.agents?.map((a) => a.name) || [],
    progress: p.status === "completed" ? 100 : p.status === "active" ? 50 : 10,
  }));

  const stats = [
    { name: "Projets actifs", value: String(projects.filter(p => p.status === "active").length), icon: CodeBracketIcon },
    { name: "Agents disponibles", value: "7", icon: CpuChipIcon },
    { name: "Sessions", value: String(projects.reduce((sum, p) => sum + (p._count?.sessions || 0), 0)), icon: UserGroupIcon },
    { name: "Historiques", value: String(projects.reduce((sum, p) => sum + (p._count?.histories || 0), 0)), icon: ClockIcon },
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
                  <p className="text-2xl font-semibold text-gray-900 mt-1">
                    {isLoading ? "..." : stat.value}
                  </p>
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
                      {isLoading ? (
                        <div className="flex justify-center py-8">
                          <div className="w-6 h-6 border-2 border-afribolt-600 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      ) : displayProjects.length > 0 ? (
                        <div className="space-y-4">
                          {displayProjects.slice(0, 3).map((project) => (
                            <ProjectCard
                              key={project.id}
                              project={project}
                              onSelect={() => setSelectedProject(project as any)}
                            />
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <CodeBracketIcon className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                          <p>Aucun projet pour le moment.</p>
                          <button
                            onClick={() => { setActiveTab("projects"); setIsCreating(true); }}
                            className="btn-primary mt-4 text-sm"
                          >
                            Créer votre premier projet
                          </button>
                        </div>
                      )}
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Agents disponibles</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {DEMO_AGENTS.filter(a => a.status === "active").map((agent) => (
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
                        onClick={() => setIsCreating(true)}
                      >
                        <PlusIcon className="h-4 w-4 mr-2" />
                        Nouveau projet
                      </button>
                    </div>

                    {isCreating && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border"
                      >
                        <input
                          type="text"
                          value={newProjectName}
                          onChange={(e) => setNewProjectName(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && createProject()}
                          placeholder="Nom du projet..."
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-afribolt-500 focus:border-transparent outline-none text-sm"
                          autoFocus
                        />
                        <button onClick={createProject} className="btn-primary text-sm px-4 py-2">
                          Créer
                        </button>
                        <button
                          onClick={() => { setIsCreating(false); setNewProjectName(""); }}
                          className="text-gray-500 hover:text-gray-700 text-sm"
                        >
                          Annuler
                        </button>
                      </motion.div>
                    )}

                    {isLoading ? (
                      <div className="flex justify-center py-8">
                        <div className="w-6 h-6 border-2 border-afribolt-600 border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    ) : displayProjects.length > 0 ? (
                      <div className="space-y-4">
                        {displayProjects.map((project) => (
                          <ProjectCard
                            key={project.id}
                            project={project}
                            onSelect={() => setSelectedProject(project as any)}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <p>Aucun projet. Cliquez sur &quot;Nouveau projet&quot; pour commencer.</p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "agents" && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Tous les agents</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {DEMO_AGENTS.map((agent) => (
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
