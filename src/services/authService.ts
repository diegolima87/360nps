import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { isValidRole, UserData } from "@/types/auth.types";

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

export const registerUser = async (
  name: string, 
  email: string, 
  password: string, 
  role: "franqueadora" | "franqueado",
  businessName: string
): Promise<boolean> => {
  try {
    // Step 1: Register user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          role,
          businessName
        }
      }
    });
    
    if (authError) {
      console.error("Auth registration error:", authError);
      throw authError;
    }
    
    console.log("Auth registration successful:", authData);
    
    if (!authData.user) {
      throw new Error("User data not returned from auth signup");
    }
    
    // Step 2: Create franqueadora if role is franqueadora
    let franqueadoraId: string | null = null;
    
    if (role === "franqueadora") {
      console.log("Creating franqueadora record");
      const { data: franqueadoraData, error: franqueadoraError } = await supabase
        .from("franqueadoras")
        .insert([
          { nome: businessName }
        ])
        .select()
        .single();
      
      if (franqueadoraError) {
        console.error("Franqueadora creation error:", franqueadoraError);
        throw franqueadoraError;
      }
      
      console.log("Franqueadora creation successful:", franqueadoraData);
      franqueadoraId = franqueadoraData.id;
    }
    
    // Step 3: Create user record in usuarios table
    console.log("Creating usuario record");
    const { error: userError } = await supabase
      .from("usuarios")
      .insert([
        { 
          id: authData.user.id,
          nome: name,
          email,
          role,
          senha: password, // Note: This is not secure, but follows the current app architecture
          id_franqueadora: franqueadoraId
        }
      ]);
    
    if (userError) {
      console.error("User creation error:", userError);
      throw userError;
    }
    
    // Step 4: Set up trial period (7 days)
    const today = new Date();
    const trialEndDate = new Date();
    trialEndDate.setDate(today.getDate() + 7); // Set trial for 7 days
    
    console.log("Creating assinatura record for 7-day trial");
    const { error: assinaturaError } = await supabase
      .from("assinaturas")
      .insert([
        { 
          id_usuario: authData.user.id,
          data_inicio: today.toISOString().split('T')[0],
          data_fim: trialEndDate.toISOString().split('T')[0],
          plano: "freemium",
          status: "ativo"
        }
      ]);
    
    if (assinaturaError) {
      console.error("Assinatura creation error:", assinaturaError);
      throw assinaturaError;
    }
    
    console.log("Registration process completed successfully!");
    return true;
    
  } catch (error) {
    console.error("Registration error:", error);
    return false;
  }
};

export const logoutUser = async (): Promise<void> => {
  try {
    await supabase.auth.signOut();
    toast.success("Você saiu com sucesso.");
  } catch (error) {
    console.error("Logout error:", error);
  }
};

export const fetchUserData = async (userId: string) => {
  try {
    console.log("Fetching user data for:", userId);
    
    // Get user data from usuarios table
    const { data: userData, error: userError } = await supabase
      .from("usuarios")
      .select("*")
      .eq("id", userId)
      .single();
    
    if (userError) {
      console.error("Error fetching user data:", userError);
      throw userError;
    }
    
    if (!userData) {
      console.error("No user data found for ID:", userId);
      return null;
    }
    
    console.log("User data retrieved:", userData);
    
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
    
    // Format and return user data with subscription info
    return {
      id: userData.id,
      name: userData.nome,
      email: userData.email,
      role: userData.role as "franqueadora" | "franqueado",
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
