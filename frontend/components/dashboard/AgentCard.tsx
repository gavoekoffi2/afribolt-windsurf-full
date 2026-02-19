"use client";

import { motion } from "framer-motion";

interface AgentCardProps {
  agent: {
    name: string;
    role: string;
    status: "active" | "idle" | "busy";
    lastMessage: string;
    color: string;
  };
}

export function AgentCard({ agent }: AgentCardProps) {
  const statusColors = {
    active: "bg-green-100 text-green-800",
    idle: "bg-gray-100 text-gray-800", 
    busy: "bg-yellow-100 text-yellow-800"
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="card hover:shadow-md transition-all duration-300 cursor-pointer"
    >
      <div className="flex items-center space-x-3">
        <div className={`w-10 h-10 rounded-full ${agent.color} flex items-center justify-center text-white font-bold`}>
          {agent.name[0]}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <h4 className="font-semibold text-gray-900 truncate">{agent.name}</h4>
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[agent.status]}`}>
              {agent.status === "active" ? "Actif" : 
               agent.status === "idle" ? "Inactif" : "Occupé"}
            </span>
          </div>
          <p className="text-sm text-gray-600 truncate">{agent.role}</p>
          <p className="text-xs text-gray-500 truncate mt-1">{agent.lastMessage}</p>
        </div>
      </div>
    </motion.div>
  );
}
