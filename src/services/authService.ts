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

export const checkUserExists = async (email: string): Promise<boolean> => {
  try {
    console.log("Checking if user exists:", email);
    
    // Use the usuarios table to check if a user with this email exists
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

export const registerUser = async (
  name: string, 
  email: string, 
  password: string, 
  role: "franqueadora" | "franqueado",
  businessName: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    console.log(`Starting registration for ${email} as ${role}...`);
    
    // Step 1: Check if the user already exists
    const { data: existingUsers, error: lookupError } = await supabase
      .from("usuarios")
      .select("email")
      .eq("email", email)
      .maybeSingle();
    
    if (lookupError) {
      console.error("Error checking for existing user:", lookupError);
    }
    
    if (existingUsers) {
      console.log("User already exists:", email);
      return { 
        success: false, 
        error: "Este email já está cadastrado. Tente fazer login ou recuperar sua senha." 
      };
    }
    
    // Step 2: Register user with Supabase Auth
    console.log("Creating auth user...");
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
      return {
        success: false,
        error: authError.message || "Erro ao criar conta. Por favor, tente novamente."
      };
    }
    
    if (!authData.user) {
      console.error("No user data returned from auth signup");
      return {
        success: false,
        error: "Dados de usuário não retornados. Por favor, tente novamente."
      };
    }
    
    console.log("Auth user created successfully:", authData.user.id);
    
    // Step 3: Create franqueadora if role is franqueadora
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
        // We don't return here, we continue to register the user but log the error
        console.log("Continuing with user registration despite franqueadora error");
      } else {
        console.log("Franqueadora creation successful:", franqueadoraData);
        franqueadoraId = franqueadoraData.id;
      }
    }
    
    // Step 4: Create user record in usuarios table
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
      
      // Try to cleanup the auth user since we failed to create the database record
      try {
        console.log("Attempting to clean up auth user after database error");
        await supabase.auth.admin.deleteUser(authData.user.id);
      } catch (cleanupError) {
        console.error("Failed to clean up auth user:", cleanupError);
      }
      
      return {
        success: false,
        error: userError.message || "Erro ao criar perfil de usuário. Por favor, tente novamente."
      };
    }
    
    // Step 5: Set up trial period (7 days)
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
      // We don't fail the whole registration for this, but log the error
    }
    
    console.log("Registration process completed successfully!");
    return { success: true };
    
  } catch (error: any) {
    console.error("Registration error:", error);
    return { 
      success: false, 
      error: error.message || "Erro desconhecido ao criar conta. Por favor, tente novamente."
    };
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
