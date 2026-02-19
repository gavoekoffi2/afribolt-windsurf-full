"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error("Veuillez entrer votre email");
      return;
    }

    setIsLoading(true);

    try {
      // In production, this would call the backend API
      // await api.post("/api/auth/forgot-password", { email });

      // For now, simulate success
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSent(true);
      toast.success("Email de reinitialisation envoye!");
    } catch {
      toast.error("Erreur lors de l'envoi. Verifiez votre email.");
    } finally {
      setIsLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full space-y-8 text-center"
        >
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Email envoye!</h2>
          <p className="text-gray-600">
            Si un compte existe avec l&apos;adresse <strong>{email}</strong>, vous recevrez un email avec les instructions pour reinitialiser votre mot de passe.
          </p>
          <Link
            href="/auth/login"
            className="inline-flex items-center text-afribolt-600 hover:text-afribolt-500 font-medium"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Retour a la connexion
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8"
      >
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Mot de passe oublie?
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Entrez votre email et nous vous enverrons un lien pour reinitialiser votre mot de passe.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field mt-1"
              placeholder="vous@exemple.com"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full flex justify-center"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              "Envoyer le lien"
            )}
          </button>

          <div className="text-center">
            <Link
              href="/auth/login"
              className="inline-flex items-center text-sm text-afribolt-600 hover:text-afribolt-500"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-1" />
              Retour a la connexion
            </Link>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
