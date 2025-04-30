
import { supabase } from "@/integrations/supabase/client";

/**
 * Creates a trial subscription for a new user
 */
export const createTrialSubscription = async (
  userId: string,
  trialDays = 7
): Promise<{ success: boolean; error?: any }> => {
  try {
    console.log("Creating trial subscription for user:", userId);
    
    const today = new Date();
    const trialEndDate = new Date();
    trialEndDate.setDate(today.getDate() + trialDays);
    
    const subscriptionData = { 
      id_usuario: userId,
      data_inicio: today.toISOString().split('T')[0],
      data_fim: trialEndDate.toISOString().split('T')[0],
      plano: "freemium",
      status: "ativo"
    };
    
    console.log("Subscription data to insert:", subscriptionData);
    
    const { error } = await supabase
      .from("assinaturas")
      .insert([subscriptionData]);
    
    if (error) {
      console.error("Subscription creation error:", error);
      return { success: false, error };
    }
    
    console.log("Trial subscription created successfully");
    return { success: true };
  } catch (error) {
    console.error("Error creating trial subscription:", error);
    return { success: false, error };
  }
};
