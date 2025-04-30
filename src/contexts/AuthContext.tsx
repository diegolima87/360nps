
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";

interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "franqueadora" | "franqueado";
  franqueadoraId?: string;
  trialEndDate: Date;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (name: string, email: string, password: string, role: "franqueadora" | "franqueado") => Promise<boolean>;
  isTrialActive: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isTrialActive, setIsTrialActive] = useState(true);

  // Check if user is logged in on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("nps360_user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      
      // Check if trial is active
      const trialEndDate = new Date(parsedUser.trialEndDate);
      const isActive = new Date() < trialEndDate;
      setIsTrialActive(isActive);
      
      if (!isActive) {
        toast.warning("Seu período de teste expirou. Faça upgrade para continuar usando todos os recursos.", {
          duration: 10000,
        });
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    
    try {
      // Mock authentication for now - will be replaced with Supabase auth
      if (email && password) {
        // Create a mock user with a 7-day trial
        const trialEndDate = new Date();
        trialEndDate.setDate(trialEndDate.getDate() + 7);
        
        const mockUser: User = {
          id: "user-" + Math.random().toString(36).substr(2, 9),
          name: email.split('@')[0],
          email,
          role: "franqueadora",
          trialEndDate,
        };
        
        setUser(mockUser);
        localStorage.setItem("nps360_user", JSON.stringify(mockUser));
        setIsTrialActive(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, role: "franqueadora" | "franqueado"): Promise<boolean> => {
    setLoading(true);
    
    try {
      // Mock registration - will be replaced with Supabase auth
      if (name && email && password) {
        // Create a 7-day trial
        const trialEndDate = new Date();
        trialEndDate.setDate(trialEndDate.getDate() + 7);
        
        const mockUser: User = {
          id: "user-" + Math.random().toString(36).substr(2, 9),
          name,
          email,
          role,
          trialEndDate,
        };
        
        setUser(mockUser);
        localStorage.setItem("nps360_user", JSON.stringify(mockUser));
        setIsTrialActive(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Registration error:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("nps360_user");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register, isTrialActive }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  
  return context;
};
