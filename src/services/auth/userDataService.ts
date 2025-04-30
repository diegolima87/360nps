
import { supabase } from "@/integrations/supabase/client";
import { UserData, isValidRole } from "@/types/auth.types";

/**
 * Checks if a user exists by email in the usuarios table
 */
export const checkUserExists = async (email: string): Promise<boolean> => {
  try {
    console.log("Checking if user exists:", email);
    
    const { data, error } = await supabase
      .from("usuarios")
      .select("email")
      .eq("email", email)
      .maybeSingle();
    
    if (error) {
      console.error("Error checking if user exists:", error);
      return false;
    }
    
    return !!data;
  } catch (error) {
    console.log("Error checking if user exists:", error);
    return false;
  }
};

/**
 * Creates a user record in the usuarios table
 */
export const createUserRecord = async (
  userId: string,
  name: string,
  email: string,
  role: "franqueadora" | "franqueado",
  password: string,
  franqueadoraId: string | null
): Promise<{ success: boolean; error?: any }> => {
  try {
    console.log("Creating user record with ID:", userId);
    
    const userData = { 
      id: userId,
      nome: name,
      email,
      role,
      senha: password,
      id_franqueadora: franqueadoraId,
      data_criacao: new Date().toISOString()
    };
    
    console.log("User data to insert:", {...userData, senha: "[REDACTED]"});
    
    const { error } = await supabase
      .from("usuarios")
      .insert([userData]);
    
    if (error) {
      console.error("User creation error:", error);
      return { success: false, error };
    }
    
    console.log("User record created successfully");
    return { success: true };
  } catch (error) {
    console.error("Error creating user record:", error);
    return { success: false, error };
  }
};

/**
 * Fetches user data from the database
 */
export const fetchUserData = async (userId: string): Promise<UserData | null> => {
  try {
    console.log("Fetching user data for:", userId);
    
    // Get user data from usuarios table
    const { data: userData, error: userError } = await supabase
      .from("usuarios")
      .select("*")
      .eq("id", userId)
      .maybeSingle();
    
    if (userError) {
      console.error("Error fetching user data:", userError);
      throw userError;
    }
    
    if (!userData) {
      console.error("No user data found for ID:", userId);
      return null;
    }
    
    console.log("User data retrieved:", {...userData, senha: "[REDACTED]"});
    
    // Get subscription data
    const { data: subscriptionData, error: subscriptionError } = await supabase
      .from("assinaturas")
      .select("*")
      .eq("id_usuario", userId)
      .order("data_fim", { ascending: false }) // Get the most recent subscription
      .limit(1)
      .maybeSingle();
    
    if (subscriptionError) {
      console.error("Error fetching subscription data:", subscriptionError);
      throw subscriptionError;
    }
    
    console.log("Subscription data retrieved:", subscriptionData);
    
    // Validate role value from database
    const userRole = userData.role;
    if (!isValidRole(userRole)) {
      console.error("Invalid role received from database:", userRole);
      // Default to franqueado if role is not valid
      userData.role = "franqueado";
    }
    
    // Format and return user data with subscription info
    return {
      id: userData.id,
      name: userData.nome,
      email: userData.email,
      role: userData.role as "admin" | "franqueadora" | "franqueado",
      franqueadoraId: userData.id_franqueadora,
      trialEndDate: subscriptionData?.data_fim || null,
      subscriptionStatus: subscriptionData?.status || "inativo",
      subscriptionPlan: subscriptionData?.plano || "none"
    };
    
  } catch (error) {
    console.error("Error in fetchUserData:", error);
    return null;
  }
};
