
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Handles direct user authentication with Supabase
 */
export const loginUser = async (email: string, password: string): Promise<boolean> => {
  try {
    console.log("Attempting login for:", email);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
      console.error("Login error:", error);
      toast.error(error.message);
      return false;
    }
    
    console.log("Login successful");
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
    console.log("Logging out user...");
    await supabase.auth.signOut();
    toast.success("Você saiu com sucesso.");
    console.log("Logout successful");
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
    console.log("Registering auth user with email:", email);
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: userData.name,
          role: userData.role,
          businessName: userData.businessName
        },
        emailRedirectTo: window.location.origin + '/dashboard'
      }
    });

    if (error) {
      console.error("Auth user registration error:", error);
      return { user: null, error };
    }

    console.log("Auth user registered successfully:", data.user?.id);
    return { user: data.user, error: null };
  } catch (error) {
    console.error("Error registering auth user:", error);
    return { user: null, error };
  }
};
