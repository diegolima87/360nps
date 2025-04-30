
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
  businessName: string  // Adicionando o parâmetro de nome do negócio
): Promise<boolean> => {
  try {
    // Register with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        data: {
          name,
          role,
          businessName  // Adicionando ao perfil do usuário
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
        toast.error("Erro ao criar perfil de usuário: " + userError.message);
        return false;
      }
      
      // Create franqueadora record if the role is franqueadora
      if (role === "franqueadora") {
        const { error: franqueadoraError } = await supabase.from("franqueadoras").insert({
          id: authData.user.id,
          nome: businessName,  // Usando o nome da franqueadora fornecido
        });
        
        if (franqueadoraError) {
          console.error("Error creating franqueadora record:", franqueadoraError);
          toast.error("Erro ao criar registro de franqueadora: " + franqueadoraError.message);
          return false;
        }
      }
      // Create franqueado record if the role is franqueado
      else if (role === "franqueado") {
        const { error: franqueadoError } = await supabase.from("franqueados").insert({
          id: authData.user.id,
          nome: businessName,  // Usando o nome da unidade franqueada fornecido
          email: email,
          // id_franqueadora será definido posteriormente quando for associado a uma franqueadora
        });
        
        if (franqueadoError) {
          console.error("Error creating franqueado record:", franqueadoError);
          toast.error("Erro ao criar registro de franqueado: " + franqueadoError.message);
          return false;
        }
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
        toast.error("Erro ao criar assinatura: " + subscriptionError.message);
        return false;
      }
      
      return true;
    }
    
    return false;
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
    const { data: userData, error } = await supabase
      .from("usuarios")
      .select("*")
      .eq("id", userId)
      .single();
    
    if (error) throw error;
    
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
    console.error("Error fetching user data:", error);
    return null;
  }
};
