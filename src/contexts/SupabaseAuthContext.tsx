
import React, { createContext, useContext, useState, useEffect } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { AuthContextType, UserData } from "@/types/auth.types";
import { loginUser, logoutUser, registerUser, fetchUserData } from "@/services/authService";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const SupabaseAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isTrialActive, setIsTrialActive] = useState(true);

  // Handle auth state changes
  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        
        if (session?.user) {
          // Get user data from database
          setTimeout(async () => {
            try {
              const userData = await fetchUserData(session.user.id);
              
              if (userData) {
                setUser(userData);
                
                // Check if trial is active
                const isActive = new Date() < new Date(userData.trialEndDate);
                setIsTrialActive(isActive);
              } else {
                setUser(null);
              }
            } finally {
              setLoading(false);
            }
          }, 0);
        } else {
          setUser(null);
          setLoading(false);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setSession(session);
        // User data is fetched in onAuthStateChange
      } else {
        setLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    return await loginUser(email, password);
  };

  const logout = async (): Promise<void> => {
    await logoutUser();
    setUser(null);
  };

  const register = async (
    name: string, 
    email: string, 
    password: string, 
    role: "franqueadora" | "franqueado",
    businessName: string // Adicionar o parâmetro de nome do negócio
  ): Promise<boolean> => {
    return await registerUser(name, email, password, role, businessName);
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, login, logout, register, isTrialActive }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useSupabaseAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error("useSupabaseAuth must be used within a SupabaseAuthProvider");
  }
  
  return context;
};
