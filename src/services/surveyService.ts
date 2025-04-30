
import { supabase } from "@/integrations/supabase/client";
import { NPSRating } from "@/components/NPSCalculator";

// Tipos para pesquisas
export interface Survey {
  id: string;
  nome: string;
  pergunta: string;
  publico_alvo: "cliente" | "franqueado";
  data_inicio: string;
  data_fim: string;
  id_franqueadora?: string;
  link?: string;
}

// Tipos para resultados
export interface SurveyResult {
  id: string;
  nota_nps: number;
  comentario?: string;
  data_envio: string;
  tipo_resposta: "promotor" | "passivo" | "detrator";
  autorizacao: boolean;
  id_franqueado?: string;
  franqueado?: {
    nome: string;
    email: string;
  };
}

// Criar nova pesquisa
export const createSurvey = async (survey: Omit<Survey, "id" | "link">): Promise<{ success: boolean; data?: Survey; error?: string }> => {
  try {
    console.log("Creating survey:", survey);
    
    // Gera um link único para a pesquisa
    const uniqueId = Math.random().toString(36).substring(2, 10);
    const link = `${window.location.origin}/survey/${uniqueId}`;
    
    const { data, error } = await supabase
      .from("pesquisas")
      .insert({
        ...survey,
        link
      })
      .select()
      .single();
      
    if (error) {
      console.error("Error from Supabase:", error);
      throw error;
    }
    
    console.log("Survey created successfully:", data);
    
    // Converter o tipo dos dados para garantir consistência
    const typedData: Survey = {
      ...data,
      publico_alvo: data.publico_alvo as "cliente" | "franqueado"
    };
    
    return { success: true, data: typedData };
  } catch (error: any) {
    console.error("Error creating survey:", error);
    return { success: false, error: error.message };
  }
};

// Listar pesquisas
export const listSurveys = async (): Promise<{ success: boolean; data?: Survey[]; error?: string }> => {
  try {
    console.log("Fetching surveys");
    const { data, error } = await supabase
      .from("pesquisas")
      .select("*")
      .order("data_inicio", { ascending: false });
      
    if (error) {
      console.error("Error from Supabase:", error);
      throw error;
    }
    
    console.log("Surveys fetched successfully:", data);
    
    // Converter o tipo dos dados para garantir consistência
    const typedData: Survey[] = data.map(item => ({
      ...item,
      publico_alvo: item.publico_alvo as "cliente" | "franqueado"
    }));
    
    return { success: true, data: typedData };
  } catch (error: any) {
    console.error("Error listing surveys:", error);
    return { success: false, error: error.message };
  }
};

// Obter detalhes de uma pesquisa
export const getSurvey = async (id: string): Promise<{ success: boolean; data?: Survey; error?: string }> => {
  try {
    const { data, error } = await supabase
      .from("pesquisas")
      .select("*")
      .eq("id", id)
      .single();
      
    if (error) throw error;
    
    // Converter o tipo dos dados para garantir consistência
    const typedData: Survey = {
      ...data,
      publico_alvo: data.publico_alvo as "cliente" | "franqueado"
    };
    
    return { success: true, data: typedData };
  } catch (error: any) {
    console.error("Error getting survey:", error);
    return { success: false, error: error.message };
  }
};

// Atualizar pesquisa
export const updateSurvey = async (id: string, updates: Partial<Omit<Survey, "id" | "link">>): Promise<{ success: boolean; data?: Survey; error?: string }> => {
  try {
    const { data, error } = await supabase
      .from("pesquisas")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
      
    if (error) throw error;
    
    // Converter o tipo dos dados para garantir consistência
    const typedData: Survey = {
      ...data,
      publico_alvo: data.publico_alvo as "cliente" | "franqueado"
    };
    
    return { success: true, data: typedData };
  } catch (error: any) {
    console.error("Error updating survey:", error);
    return { success: false, error: error.message };
  }
};

// Excluir pesquisa
export const deleteSurvey = async (id: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase
      .from("pesquisas")
      .delete()
      .eq("id", id);
      
    if (error) throw error;
    
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting survey:", error);
    return { success: false, error: error.message };
  }
};

// Obter resultados de uma pesquisa
export const getSurveyResults = async (surveyId: string): Promise<{ success: boolean; data?: SurveyResult[]; error?: string }> => {
  try {
    const { data, error } = await supabase
      .from("respostas")
      .select(`
        *,
        franqueado:id_franqueado (
          nome,
          email
        )
      `)
      .eq("id_pesquisa", surveyId)
      .order("data_envio", { ascending: false });
      
    if (error) throw error;
    
    // Converter o tipo dos dados para garantir consistência
    const typedData: SurveyResult[] = data.map(item => ({
      ...item,
      tipo_resposta: (item.tipo_resposta || "detrator") as "promotor" | "passivo" | "detrator"
    }));
    
    return { success: true, data: typedData };
  } catch (error: any) {
    console.error("Error getting survey results:", error);
    return { success: false, error: error.message };
  }
};

// Obter resultados de uma pesquisa agrupados por franqueado
export const getSurveyResultsByFranchisee = async (surveyId: string): Promise<{ 
  success: boolean; 
  data?: { 
    franqueado: { id: string; nome: string; email: string }; 
    respostas: SurveyResult[]; 
    mediaNotas: number 
  }[]; 
  error?: string 
}> => {
  try {
    // Busca todas as respostas da pesquisa com dados do franqueado
    const { data, error } = await supabase
      .from("respostas")
      .select(`
        *,
        franqueado:id_franqueado (
          id,
          nome,
          email
        )
      `)
      .eq("id_pesquisa", surveyId)
      .order("data_envio", { ascending: false });
      
    if (error) throw error;
    
    // Agrupar por franqueado
    const resultsByFranchisee = data.reduce((acc: any[], item: any) => {
      // Se não tem franqueado, não incluir na análise
      if (!item.franqueado) return acc;
      
      const franchiseeId = item.franqueado.id;
      let franchiseeGroup = acc.find(group => group.franqueado.id === franchiseeId);
      
      if (!franchiseeGroup) {
        franchiseeGroup = {
          franqueado: item.franqueado,
          respostas: [],
          mediaNotas: 0
        };
        acc.push(franchiseeGroup);
      }
      
      // Converter o tipo antes de adicionar ao grupo
      franchiseeGroup.respostas.push({
        ...item,
        tipo_resposta: (item.tipo_resposta || "detrator") as "promotor" | "passivo" | "detrator"
      });
      
      return acc;
    }, []);
    
    // Calcular média de notas para cada franqueado
    resultsByFranchisee.forEach(group => {
      const sum = group.respostas.reduce((acc: number, item: SurveyResult) => acc + (item.nota_nps || 0), 0);
      group.mediaNotas = group.respostas.length > 0 ? Math.round((sum / group.respostas.length) * 10) / 10 : 0;
    });
    
    return { success: true, data: resultsByFranchisee };
  } catch (error: any) {
    console.error("Error getting survey results by franchisee:", error);
    return { success: false, error: error.message };
  }
};
