"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  PaperAirplaneIcon,
  MicrophoneIcon,
  CpuChipIcon,
  UserGroupIcon
} from "@heroicons/react/24/outline";

interface Message {
  id: string;
  type: "user" | "agent";
  content: string;
  agent?: string;
  timestamp: Date;
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "agent",
      content: "Bonjour! Je suis EMEFA, votre Team Lead AI. Comment puis-je vous aider aujourd'hui?",
      agent: "EMEFA",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState("EMEFA");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const agents = [
    { name: "EMEFA", role: "Team Lead", color: "agent-emefa" },
    { name: "KOFFI", role: "Architecte", color: "agent-koffi" },
    { name: "DÉDÉ", role: "Backend", color: "agent-dede" },
    { name: "SOLIM", role: "Designer", color: "agent-solim" },
    { name: "AKOFA", role: "Frontend", color: "agent-akofa" },
    { name: "KWAMI", role: "Documentation", color: "agent-kwami" },
    { name: "YAOVI", role: "Collaboration", color: "agent-yaovi" }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simuler une réponse de l'agent
    setTimeout(() => {
      const agentResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: "agent",
        content: `Je suis ${selectedAgent}. Je vais analyser votre demande et vous fournir la meilleure réponse possible.`,
        agent: selectedAgent,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, agentResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-[600px] flex flex-col">
      <div className="border-b border-gray-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-900">Chat avec les agents</h3>
          <CpuChipIcon className="h-5 w-5 text-afribolt-600" />
        </div>
        
        <div className="flex flex-wrap gap-2">
          {agents.map((agent) => (
            <button
              key={agent.name}
              onClick={() => setSelectedAgent(agent.name)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                selectedAgent === agent.name
                  ? "bg-afribolt-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {agent.name}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
          >
            <div className={`flex items-start space-x-2 max-w-[80%] ${
              message.type === "user" ? "flex-row-reverse space-x-reverse" : ""
            }`}>
              {message.type === "agent" && (
                <div className={`w-8 h-8 rounded-full ${agents.find(a => a.name === message.agent)?.color} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                  {message.agent?.[0]}
                </div>
              )}
              
              <div className={`rounded-lg px-3 py-2 ${
                message.type === "user"
                  ? "bg-afribolt-600 text-white"
                  : "bg-gray-100 text-gray-900"
              }`}>
                {message.type === "agent" && (
                  <p className="text-xs font-medium mb-1 opacity-75">{message.agent}</p>
                )}
                <p className="text-sm">{message.content}</p>
                <p className={`text-xs mt-1 ${
                  message.type === "user" ? "text-afribolt-200" : "text-gray-500"
                }`}>
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
        
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="flex items-center space-x-2">
              <div className={`w-8 h-8 rounded-full ${agents.find(a => a.name === selectedAgent)?.color} flex items-center justify-center text-white text-xs font-bold`}>
                {selectedAgent[0]}
              </div>
              <div className="bg-gray-100 rounded-lg px-3 py-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-gray-200 p-4">
        <div className="flex items-center space-x-2">
          <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <MicrophoneIcon className="h-5 w-5" />
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={`Message à ${selectedAgent}...`}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-afribolt-500 focus:border-transparent outline-none text-sm"
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || isTyping}
            className="p-2 bg-afribolt-600 text-white rounded-lg hover:bg-afribolt-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <PaperAirplaneIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
