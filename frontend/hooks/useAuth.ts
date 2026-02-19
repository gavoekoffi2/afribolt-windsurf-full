"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

export function useAuth(requireAuth: boolean = true) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchUser = useCallback(async () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("afribolt_token") : null;

    if (!token) {
      setLoading(false);
      if (requireAuth) {
        router.push("/auth/login");
      }
      return;
    }

    try {
      const response = await api.get("/api/auth/me");
      setUser(response.data.data.user);
    } catch {
      localStorage.removeItem("afribolt_token");
      if (requireAuth) {
        router.push("/auth/login");
      }
    } finally {
      setLoading(false);
    }
  }, [requireAuth, router]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const logout = useCallback(() => {
    localStorage.removeItem("afribolt_token");
    setUser(null);
    router.push("/auth/login");
  }, [router]);

  return { user, loading, logout, refetch: fetchUser };
}
