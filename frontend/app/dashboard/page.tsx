"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  PlusIcon,
  CpuChipIcon,
  CodeBracketIcon,
  UserGroupIcon,
  ClockIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { Header } from "@/components/layout/Header";
import { AgentCard } from "@/components/dashboard/AgentCard";
import { ProjectCard } from "@/components/dashboard/ProjectCard";
import { ChatInterface } from "@/components/dashboard/ChatInterface";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "react-hot-toast";
import api from "@/lib/api";

interface Project {
  id: string;
  name: string;
  description: string;
  status: "active" | "planning" | "completed";
  createdAt: string;
  updatedAt: string;
  agents: Array<{ id: string; name: string; type: string; status: string }>;
  _count?: { sessions: number; histories: number };
}

export default function Dashboard() {
  const { user, logout } = useAuth(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [showNewProject, setShowNewProject] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDesc, setNewProjectDesc] = useState("");

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await api.get("/api/projects");
      setProjects(response.data.data.projects || []);
    } catch {
      // Use demo data if API is unavailable
      setProjects([
        {
          id: "1",
          name: "E-commerce Platform",
          description: "Plateforme de vente en ligne moderne",
          status: "active",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          agents: [
            { id: "a1", name: "EMEFA", type: "emefa", status: "active" },
            { id: "a2", name: "KOFFI", type: "koffi", status: "idle" },
          ],
        },
        {
          id: "2",
          name: "Mobile Banking App",
          description: "Application bancaire mobile securisee",
          status: "active",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          agents: [
            { id: "a3", name: "SOLIM", type: "solim", status: "active" },
          ],
        },
      ]);
    } finally {
      setLoadingProjects(false);
    }
  };

  const createProject = async () => {
    if (!newProjectName.trim()) {
      toast.error("Le nom du projet est requis");
      return;
    }

    try {
      const response = await api.post("/api/projects", {
        name: newProjectName,
        description: newProjectDesc,
      });
      setProjects((prev) => [response.data.data.project, ...prev]);
      setNewProjectName("");
      setNewProjectDesc("");
      setShowNewProject(false);
      toast.success("Projet cree avec succes!");
    } catch {
      toast.error("Erreur lors de la creation du projet");
    }
  };

  const stats: Array<{
    name: string;
    value: string;
    change: string;
    changeType: "increase" | "decrease" | "neutral";
    icon: typeof CodeBracketIcon;
  }> = [
    {
      name: "Projets actifs",
      value: String(projects.filter((p) => p.status === "active").length),
      change: `${projects.length} total`,
      changeType: "neutral",
      icon: CodeBracketIcon,
    },
    {
      name: "Agents utilises",
      value: "7",
      change: "disponibles",
      changeType: "neutral",
      icon: CpuChipIcon,
    },
    {
      name: "Messages IA",
      value: String(
        projects.reduce((sum, p) => sum + (p._count?.histories || 0), 0)
      ),
      change: "total",
      changeType: "neutral",
      icon: UserGroupIcon,
    },
    {
      name: "Temps economise",
      value: `${projects.length * 4}h`,
      change: "estime",
      changeType: "increase",
      icon: ClockIcon,
    },
  ];

  const agents = [
    { name: "EMEFA", role: "Team Lead AI", status: "active" as const, lastMessage: "Coordination du projet", color: "agent-emefa" },
    { name: "KOFFI", role: "Architecte & Strategie", status: "idle" as const, lastMessage: "Architecture validee", color: "agent-koffi" },
    { name: "DEDE", role: "Backend & Infrastructure", status: "active" as const, lastMessage: "API en developpement", color: "agent-dede" },
    { name: "SOLIM", role: "UX / UI Designer", status: "idle" as const, lastMessage: "Wireframes prets", color: "agent-solim" },
    { name: "AKOFA", role: "Frontend Builder", status: "active" as const, lastMessage: "Components React crees", color: "agent-akofa" },
    { name: "KWAMI", role: "Documentation & Knowledge", status: "idle" as const, lastMessage: "Documentation mise a jour", color: "agent-kwami" },
    { name: "YAOVI", role: "Dev Collaboration", status: "active" as const, lastMessage: "Bug resolu", color: "agent-yaovi" },
  ];

  const projectsForCards = projects.map((p) => ({
    id: p.id,
    name: p.name,
    description: p.description || "",
    status: p.status,
    lastActivity: new Date(p.updatedAt).toLocaleDateString("fr-FR"),
    agents: p.agents?.map((a) => a.name) || [],
    progress: p.status === "completed" ? 100 : p.status === "active" ? 65 : 25,
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-2">
              Bienvenue{user?.name ? `, ${user.name}` : ""} sur votre espace de developpement AI
            </p>
          </div>
          <button
            onClick={logout}
            className="flex items-center text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            <ArrowRightOnRectangleIcon className="h-5 w-5 mr-1" />
            Deconnexion
          </button>
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
                    <span
                      className={`text-sm font-medium ${
                        stat.changeType === "increase"
                          ? "text-green-600"
                          : stat.changeType === "decrease"
                          ? "text-red-600"
                          : "text-gray-500"
                      }`}
                    >
                      {stat.change}
                    </span>
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
                      {tab === "overview"
                        ? "Vue d'ensemble"
                        : tab === "projects"
                        ? "Projets"
                        : "Agents"}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-6">
                {activeTab === "overview" && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Projets recents
                      </h3>
                      {loadingProjects ? (
                        <div className="text-center py-8">
                          <div className="w-8 h-8 border-2 border-afribolt-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                        </div>
                      ) : projectsForCards.length > 0 ? (
                        <div className="space-y-4">
                          {projectsForCards.slice(0, 3).map((project) => (
                            <ProjectCard
                              key={project.id}
                              project={project}
                              onSelect={() =>
                                setSelectedProject(
                                  projects.find((p) => p.id === project.id) || null
                                )
                              }
                            />
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <p>Aucun projet. Creez votre premier projet!</p>
                        </div>
                      )}
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Agents actifs
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {agents
                          .filter((a) => a.status === "active")
                          .map((agent) => (
                            <AgentCard key={agent.name} agent={agent} />
                          ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "projects" && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Tous les projets
                      </h3>
                      <button
                        onClick={() => setShowNewProject(!showNewProject)}
                        className="btn-primary flex items-center text-sm"
                      >
                        <PlusIcon className="h-4 w-4 mr-2" />
                        Nouveau projet
                      </button>
                    </div>

                    {showNewProject && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="card space-y-3"
                      >
                        <input
                          type="text"
                          placeholder="Nom du projet"
                          value={newProjectName}
                          onChange={(e) => setNewProjectName(e.target.value)}
                          className="input-field"
                        />
                        <input
                          type="text"
                          placeholder="Description (optionnel)"
                          value={newProjectDesc}
                          onChange={(e) => setNewProjectDesc(e.target.value)}
                          className="input-field"
                        />
                        <div className="flex gap-2">
                          <button onClick={createProject} className="btn-primary text-sm">
                            Creer
                          </button>
                          <button
                            onClick={() => setShowNewProject(false)}
                            className="btn-secondary text-sm"
                          >
                            Annuler
                          </button>
                        </div>
                      </motion.div>
                    )}

                    <div className="space-y-4">
                      {projectsForCards.map((project) => (
                        <ProjectCard
                          key={project.id}
                          project={project}
                          onSelect={() =>
                            setSelectedProject(
                              projects.find((p) => p.id === project.id) || null
                            )
                          }
                        />
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === "agents" && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Tous les agents
                    </h3>
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
            <ChatInterface projectId={selectedProject?.id} />
          </div>
        </div>
      </main>
    </div>
  );
}
