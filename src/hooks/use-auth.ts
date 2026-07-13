"use client";

import { useEffect, useState, createContext, useContext } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabaseClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  role: "user" | "moderator" | "admin" | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  role: null,
  loading: true,
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<"user" | "moderator" | "admin" | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    // Synchronize initial session footprint natively on mount
    supabaseClient.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserRole(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen to active session changes dynamically
    const { data: { subscription } } = supabaseClient.auth.onAuthStateChange(async (_event, currentSession) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      if (currentSession?.user) {
        await fetchUserRole(currentSession.user.id);
      } else {
        setRole(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function fetchUserRole(userId: string) {
    try {
      const { data, error } = await supabaseClient
        .from("profiles")
        .select("role")
        .eq("id", userId)
        .single();
      
      if (error) throw error;
      setRole(data?.role as any);
    } catch (err) {
      console.error("Failed to fetch authorization profile role context mapping:", err);
      setRole("user");
    } finally {
      setLoading(false);
    }
  }

  const signOut = async () => {
    await supabaseClient.auth.signOut();
    router.push("/login");
  };

  return React.createElement(
    AuthContext.Provider,
    { value: { user, session, role, loading, signOut } },
    children
  );
}

export const useAuth = () => useContext(AuthContext);
