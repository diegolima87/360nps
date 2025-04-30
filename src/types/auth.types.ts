
import { User, Session } from "@supabase/supabase-js";

export interface UserData {
  id: string;
  name: string;
  email: string;
  role: "admin" | "franqueadora" | "franqueado";
  franqueadoraId?: string;
  trialEndDate: string | null;
  subscriptionStatus?: string;
  subscriptionPlan?: string;
}

export interface AuthContextType {
  user: UserData | null;
  session: Session | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  register: (
    name: string, 
    email: string, 
    password: string, 
    role: "franqueadora" | "franqueado",
    businessName: string
  ) => Promise<boolean>;
  isTrialActive: boolean;
}

// Helper function to validate user role
export const isValidRole = (role: string): role is "admin" | "franqueadora" | "franqueado" => {
  return role === "admin" || role === "franqueadora" || role === "franqueado";
};
