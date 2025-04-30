
import React, { createContext, useContext, useState, useEffect } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface UserData {
  id: string;
  name: string;
  email: string;
  role: "admin" | "franqueadora" | "franqueado";
  franqueadoraId?: string;
  trialEndDate: Date;
}

interface AuthContextType {
  user: UserData | null;
  session: Session | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  register: (name: string, email: string, password: string, role: "franqueadora" | "franqueado") => Promise<boolean>;
  isTrialActive: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper function to validate user role
const isValidRole = (role: string): role is "admin" | "franqueadora" | "franqueado" => {
  return role === "admin" || role === "franqueadora" || role === "franqueado";
};

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
              const { data: userData, error } = await supabase
                .from("usuarios")
                .select("*")
                .eq("id", session.user.id)
                .single();
              
              if (error) throw error;
              
              // Check if subscription is active
              const { data: subscriptionData, error: subscriptionError } = await supabase
                .from("assinaturas")
                .select("*")
                .eq("id_usuario", session.user.id)
                .single();
              
              if (subscriptionError && subscriptionError.code !== "PGRST116") {
                console.error("Error fetching subscription:", subscriptionError);
              }
              
              // Validate user role
              const userRole = userData.role;
              if (!isValidRole(userRole)) {
                throw new Error(`Invalid user role: ${userRole}`);
              }
              
              // Create user data object
              const userInfo: UserData = {
                id: session.user.id,
                name: userData.nome,
                email: userData.email,
                role: userRole,
                franqueadoraId: userData.id_franqueadora,
                trialEndDate: subscriptionData ? new Date(subscriptionData.data_fim) : new Date(),
              };
              
              setUser(userInfo);
              
              // Check if trial is active
              const isActive = subscriptionData ? new Date() < new Date(subscriptionData.data_fim) : false;
              setIsTrialActive(isActive);
              
              if (!isActive) {
                toast.warning("Seu período de teste expirou. Faça upgrade para continuar usando todos os recursos.", {
                  duration: 10000,
                });
              }
            } catch (error) {
              console.error("Error fetching user data:", error);
              setUser(null);
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
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        toast.error(error.message);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const register = async (name: string, email: string, password: string, role: "franqueadora" | "franqueado"): Promise<boolean> => {
    try {
      // Register with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            name,
            role
          }
        } 
      });
      
      if (authError) {
        toast.error(authError.message);
        return false;
      }
      
      if (authData.user) {
        // Create user record in usuarios table
        const { error: userError } = await supabase.from("usuarios").insert({
          id: authData.user.id,
          nome: name,
          email,
          senha: "auth_handled", // We don't store actual passwords, auth is handled by Supabase
          role
        });
        
        if (userError) {
          console.error("Error creating user record:", userError);
          return false;
        }
        
        // Create trial subscription (7 days)
        const now = new Date();
        const trialEnd = new Date();
        trialEnd.setDate(trialEnd.getDate() + 7);
        
        const { error: subscriptionError } = await supabase.from("assinaturas").insert({
          id_usuario: authData.user.id,
          data_inicio: now.toISOString(),
          data_fim: trialEnd.toISOString(),
          status: "ativo",
          plano: "freemium"
        });
        
        if (subscriptionError) {
          console.error("Error creating subscription:", subscriptionError);
        }
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("Registration error:", error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      toast.success("Você saiu com sucesso.");
    } catch (error) {
      console.error("Logout error:", error);
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
