"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "react-hot-toast";
import api from "@/lib/api";
import { UserCircleIcon } from "@heroicons/react/24/outline";

export default function ProfilePage() {
  const { user, refetch } = useAuth(true);
  const [name, setName] = useState(user?.name || "");
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await api.put("/api/auth/me", { name });
      toast.success("Profil mis a jour!");
      refetch();
    } catch {
      toast.error("Erreur lors de la mise a jour");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-2xl mx-auto px-4 py-8 pt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
        >
          <div className="flex items-center space-x-4 mb-8">
            <div className="w-16 h-16 bg-afribolt-100 rounded-full flex items-center justify-center">
              <UserCircleIcon className="h-10 w-10 text-afribolt-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Mon profil</h1>
              <p className="text-gray-600">{user?.email}</p>
            </div>
          </div>

          <form onSubmit={handleUpdate} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nom complet
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-field mt-1"
                placeholder="Votre nom"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                value={user?.email || ""}
                disabled
                className="input-field mt-1 bg-gray-50 text-gray-500"
              />
              <p className="mt-1 text-xs text-gray-500">
                {"L'email ne peut pas etre modifie"}
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary flex justify-center"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                "Enregistrer"
              )}
            </button>
          </form>
        </motion.div>
      </main>
    </div>
  );
}
