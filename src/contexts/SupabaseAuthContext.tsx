
import React, { createContext, useContext, useState, useEffect } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { AuthContextType, UserData } from "@/types/auth.types";
import { loginUser, logoutUser, registerUser, fetchUserData } from "@/services/authService";
import { toast } from "sonner";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const SupabaseAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isTrialActive, setIsTrialActive] = useState(false);

  // Handle auth state changes
  useEffect(() => {
    console.log("Setting up auth state listener");
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        console.log("Auth state changed:", _event, session?.user?.id);
        setSession(session);
        
        if (session?.user) {
          // Get user data from database - use setTimeout to avoid blocking UI
          setTimeout(async () => {
            try {
              console.log("Fetching user data after auth change");
              const userData = await fetchUserData(session.user.id);
              
              if (userData) {
                console.log("User data loaded:", userData);
                setUser(userData);
                
                // Check if trial is active
                if (userData.trialEndDate) {
                  const isActive = new Date() < new Date(userData.trialEndDate);
                  setIsTrialActive(isActive);
                  console.log("Trial status:", isActive ? "Active" : "Expired", "End date:", userData.trialEndDate);
                } else {
                  setIsTrialActive(false);
                  console.log("No trial end date found, assuming trial is expired");
                }
              } else {
                console.log("No user data found, potentially a new auth user without profile");
                setUser(null);
                setLoading(false);
              }
            } catch (error) {
              console.error("Error in auth state change handler:", error);
              toast.error("Erro ao carregar perfil. Por favor, faça login novamente.");
              setLoading(false);
            }
          }, 0);
        } else {
          console.log("No active session");
          setUser(null);
          setLoading(false);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("Initial session check:", session?.user?.id);
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
    console.log("Login attempt for:", email);
    setLoading(true);
    
    try {
      const success = await loginUser(email, password);
      
      if (success) {
        toast.success("Login realizado com sucesso!");
        return true;
      } else {
        toast.error("Erro ao fazer login. Verifique suas credenciais.");
      }
      
      return success;
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Ocorreu um erro ao processar seu login.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    console.log("Logout initiated");
    setLoading(true);
    try {
      await logoutUser();
      setUser(null);
      window.location.href = "/";
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Erro ao fazer logout.");
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    name: string, 
    email: string, 
    password: string, 
    role: "franqueadora" | "franqueado",
    businessName: string
  ): Promise<boolean> => {
    console.log("Register attempt for:", email, "as", role);
    setLoading(true);
    
    try {
      const { success, error } = await registerUser(name, email, password, role, businessName);
      
      if (!success) {
        console.error("Registration failed:", error);
        toast.error(error || "Falha ao criar conta. Tente novamente.");
        setLoading(false);
        return false;
      }
      
      toast.success("Conta criada com sucesso! Você tem 7 dias de avaliação gratuita.");
      return true;
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Erro inesperado ao criar conta.");
      return false;
    } finally {
      setLoading(false);
    }
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
