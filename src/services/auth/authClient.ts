
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Handles direct user authentication with Supabase
 */
export const loginUser = async (email: string, password: string): Promise<boolean> => {
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

/**
 * Handles user sign out
 */
export const logoutUser = async (): Promise<void> => {
  try {
    await supabase.auth.signOut();
    toast.success("Você saiu com sucesso.");
  } catch (error) {
    console.error("Logout error:", error);
  }
};

/**
 * Registers a new user in the Supabase auth system
 */
export const registerAuthUser = async (
  email: string, 
  password: string,
  userData: {
    name: string;
    role: "franqueadora" | "franqueado";
    businessName: string;
  }
): Promise<{ user: any; error: any }> => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: userData.name,
          role: userData.role,
          businessName: userData.businessName
        }
      }
    });

    if (error) {
      return { user: null, error };
    }

    return { user: data.user, error: null };
  } catch (error) {
    console.error("Error registering auth user:", error);
    return { user: null, error };
  }
};
