
import { supabase } from "@/integrations/supabase/client";

/**
 * Creates a trial subscription for a new user
 */
export const createTrialSubscription = async (
  userId: string,
  trialDays = 7
): Promise<{ success: boolean; error?: any }> => {
  try {
    const today = new Date();
    const trialEndDate = new Date();
    trialEndDate.setDate(today.getDate() + trialDays);
    
    console.log("Creating assinatura record for trial period");
    const { error } = await supabase
      .from("assinaturas")
      .insert([
        { 
          id_usuario: userId,
          data_inicio: today.toISOString().split('T')[0],
          data_fim: trialEndDate.toISOString().split('T')[0],
          plano: "freemium",
          status: "ativo"
        }
      ]);
    
    if (error) {
      console.error("Assinatura creation error:", error);
      return { success: false, error };
    }
    
    return { success: true };
  } catch (error) {
    console.error("Error creating trial subscription:", error);
    return { success: false, error };
  }
};
