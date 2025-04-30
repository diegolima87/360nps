
import { createFranqueadora } from "./franqueadoraService";
import { createTrialSubscription } from "./subscriptionService";
import { checkUserExists, createUserRecord } from "./userDataService";
import { registerAuthUser } from "./authClient";

/**
 * Complete user registration process that handles all the necessary steps
 */
export const registerUser = async (
  name: string, 
  email: string, 
  password: string, 
  role: "franqueadora" | "franqueado",
  businessName: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    console.log(`Starting registration for ${email} as ${role}...`);
    
    // Check if the user already exists
    const userExists = await checkUserExists(email);
    
    if (userExists) {
      console.log("User already exists:", email);
      return { 
        success: false, 
        error: "Este email já está cadastrado. Tente fazer login ou recuperar sua senha." 
      };
    }
    
    // Step 1: Register user with Supabase Auth
    console.log("Creating auth user...");
    const { user: authUser, error: authError } = await registerAuthUser(email, password, {
      name,
      role,
      businessName
    });
    
    if (authError || !authUser) {
      console.error("Auth registration error:", authError);
      return {
        success: false,
        error: authError?.message || "Erro ao criar conta. Por favor, tente novamente."
      };
    }
    
    console.log("Auth user created successfully:", authUser.id);

    // Step 2: Create franqueadora if role is franqueadora
    let franqueadoraId = null;
    
    if (role === "franqueadora") {
      const { id, error: franqueadoraError } = await createFranqueadora(businessName);
      
      if (franqueadoraError || !id) {
        console.error("Franqueadora creation error:", franqueadoraError);
        return { 
          success: false, 
          error: franqueadoraError?.message || "Erro ao criar franqueadora. Por favor, tente novamente." 
        };
      }
      
      franqueadoraId = id;
    }
    
    // Step 3: Create user record in usuarios table
    const { success: userCreated, error: userError } = await createUserRecord(
      authUser.id,
      name,
      email,
      role,
      password,
      franqueadoraId
    );
    
    if (!userCreated) {
      console.error("User creation error:", userError);
      return { 
        success: false, 
        error: userError?.message || "Erro ao criar perfil. Por favor, tente novamente." 
      };
    }
    
    // Step 4: Set up trial period
    const { success: trialCreated, error: trialError } = await createTrialSubscription(authUser.id);
    
    if (!trialCreated) {
      console.error("Trial creation error:", trialError);
      return { 
        success: false, 
        error: trialError?.message || "Erro ao criar período de teste. Por favor, tente novamente."
      };
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
