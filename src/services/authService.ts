
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
    console.log("Starting user registration process...");
    
    // Register with Supabase Auth
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
      toast.error(authError.message);
      console.error("Auth error:", authError);
      return false;
    }
    
    if (!authData.user) {
      toast.error("Erro ao criar usuário");
      console.error("No user returned from signUp");
      return false;
    }

    const userId = authData.user.id;
    console.log("User created in Auth with ID:", userId);
    
    // Create user record in usuarios table
    const { error: userError } = await supabase.from("usuarios").insert({
      id: userId,
      nome: name,
      email,
      senha: "auth_handled", // We don't store actual passwords, auth is handled by Supabase
      role
    });
    
    if (userError) {
      console.error("Error creating user record:", userError);
      toast.error("Erro ao criar perfil de usuário: " + userError.message);
      
      // Attempt to delete the auth user if the profile creation fails
      try {
        await supabase.auth.admin.deleteUser(userId);
        console.log("Deleted auth user due to profile creation failure");
      } catch (deleteError) {
        console.error("Failed to delete auth user:", deleteError);
      }
      
      return false;
    }
    
    console.log("User record created in usuarios table");
    
    // Create franqueadora or franqueado record based on role
    if (role === "franqueadora") {
      const { error: franqueadoraError } = await supabase.from("franqueadoras").insert({
        id: userId,
        nome: businessName
      });
      
      if (franqueadoraError) {
        console.error("Error creating franqueadora record:", franqueadoraError);
        toast.error("Erro ao criar registro de franqueadora: " + franqueadoraError.message);
        return false;
      }
      
      console.log("Franqueadora record created successfully");
      
      // Update the usuario record with the franqueadora ID
      const { error: updateError } = await supabase.from("usuarios")
        .update({ id_franqueadora: userId })
        .eq("id", userId);
        
      if (updateError) {
        console.error("Error updating usuario with franqueadora ID:", updateError);
      }
    } 
    else if (role === "franqueado") {
      const { error: franqueadoError } = await supabase.from("franqueados").insert({
        id: userId,
        nome: businessName,
        email
        // id_franqueadora será definido posteriormente quando for associado a uma franqueadora
      });
      
      if (franqueadoError) {
        console.error("Error creating franqueado record:", franqueadoError);
        toast.error("Erro ao criar registro de franqueado: " + franqueadoError.message);
        return false;
      }
      
      console.log("Franqueado record created successfully");
    }
    
    // Create trial subscription (7 days)
    const now = new Date();
    const trialEnd = new Date();
    trialEnd.setDate(trialEnd.getDate() + 7);
    
    const { error: subscriptionError } = await supabase.from("assinaturas").insert({
      id_usuario: userId,
      data_inicio: now.toISOString(),
      data_fim: trialEnd.toISOString(),
      status: "ativo",
      plano: "freemium"
    });
    
    if (subscriptionError) {
      console.error("Error creating subscription:", subscriptionError);
      toast.error("Erro ao criar assinatura: " + subscriptionError.message);
      // Continue anyway as subscription is not critical for basic functionality
    } else {
      console.log("Trial subscription created successfully");
    }
    
    toast.success("Conta criada com sucesso!");
    return true;
  } catch (error: any) {
    console.error("Registration error:", error);
    toast.error(`Erro ao criar conta: ${error?.message || "Erro desconhecido"}`);
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

export const fetchUserData = async (userId: string): Promise<UserData | null> => {
  try {
    console.log("Fetching user data for ID:", userId);
    
    const { data: userData, error } = await supabase
      .from("usuarios")
      .select("*")
      .eq("id", userId)
      .single();
    
    if (error) {
      console.error("Error fetching user data:", error);
      throw error;
    }
    
    console.log("User data fetched:", userData);
    
    // Check if subscription is active
    const { data: subscriptionData, error: subscriptionError } = await supabase
      .from("assinaturas")
      .select("*")
      .eq("id_usuario", userId)
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
    return {
      id: userId,
      name: userData.nome,
      email: userData.email,
      role: userRole,
      franqueadoraId: userData.id_franqueadora,
      trialEndDate: subscriptionData ? new Date(subscriptionData.data_fim) : new Date(),
    };
  } catch (error) {
    console.error("Error in fetchUserData:", error);
    return null;
  }
};
