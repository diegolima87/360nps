
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
  const [isTrialActive, setIsTrialActive] = useState(false);

  // Handle auth state changes
  useEffect(() => {
    console.log("Setting up auth state listener");
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        console.log("Auth state changed:", _event, session?.user?.id);
        setSession(session);
        
        if (session?.user) {
          // Get user data from database
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
                console.log("No user data found");
                setUser(null);
              }
            } catch (error) {
              console.error("Error in auth state change handler:", error);
            } finally {
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
    const success = await loginUser(email, password);
    
    // Redirect to dashboard on successful login
    if (success) {
      window.location.href = "/dashboard";
    }
    
    return success;
  };

  const logout = async (): Promise<void> => {
    console.log("Logout initiated");
    await logoutUser();
    setUser(null);
  };

  const register = async (
    name: string, 
    email: string, 
    password: string, 
    role: "franqueadora" | "franqueado",
    businessName: string
  ): Promise<boolean> => {
    console.log("Register attempt for:", email, "as", role);
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
