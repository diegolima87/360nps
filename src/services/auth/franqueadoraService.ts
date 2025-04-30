
import { supabase } from "@/integrations/supabase/client";

/**
 * Creates a new franqueadora record
 */
export const createFranqueadora = async (businessName: string): Promise<{ id: string | null; error: any }> => {
  try {
    console.log("Creating franqueadora record:", businessName);
    
    const franqueadoraData = { 
      nome: businessName,
      cor_primaria: '#00537e', // Default color as requested
      logo_url: '' // Empty value by default
    };
    
    console.log("Franqueadora data to insert:", franqueadoraData);
    
    const { data, error } = await supabase
      .from("franqueadoras")
      .insert([franqueadoraData])
      .select()
      .single();
    
    if (error) {
      console.error("Franqueadora creation error:", error);
      return { id: null, error };
    }
    
    console.log("Franqueadora creation successful:", data);
    return { id: data.id, error: null };
  } catch (error) {
    console.error("Error creating franqueadora:", error);
    return { id: null, error };
  }
};
