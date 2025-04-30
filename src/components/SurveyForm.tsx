
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useSupabaseAuth } from "@/contexts/SupabaseAuthContext";
import { Survey, createSurvey, updateSurvey } from "@/services/surveyService";
import { toast } from "sonner";
import SurveyFormDetails from "./survey/SurveyFormDetails";
import SurveyDateRange from "./survey/SurveyDateRange";
import { FormErrorAlert } from "./survey/FormErrorAlert";

interface SurveyFormProps {
  initialData?: Survey;
  isEditing: boolean;
}

export default function SurveyForm({ initialData, isEditing }: SurveyFormProps) {
  const navigate = useNavigate();
  const { user } = useSupabaseAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<Omit<Survey, "id" | "link">>({
    nome: "",
    pergunta: "Em uma escala de 0 a 10, qual a probabilidade de você recomendar nossa franquia?",
    publico_alvo: "cliente",
    data_inicio: new Date().toISOString().split("T")[0],
    data_fim: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split("T")[0],
    id_franqueadora: user?.franqueadoraId || undefined
  });

  useEffect(() => {
    if (initialData && isEditing) {
      setFormData({
        nome: initialData.nome,
        pergunta: initialData.pergunta,
        publico_alvo: initialData.publico_alvo,
        data_inicio: initialData.data_inicio,
        data_fim: initialData.data_fim,
        id_franqueadora: initialData.id_franqueadora || user?.franqueadoraId,
      });
    } else if (user?.franqueadoraId) {
      // Set id_franqueadora if user is set but initialData is not
      setFormData(prev => ({
        ...prev,
        id_franqueadora: user.franqueadoraId
      }));
    }
  }, [initialData, isEditing, user]);

  // Log whenever franqueadoraId changes to help debugging
  useEffect(() => {
    console.log("Current franqueadora ID in form:", formData.id_franqueadora);
    console.log("User context franqueadora ID:", user?.franqueadoraId);
  }, [formData.id_franqueadora, user?.franqueadoraId]);

  const handleChange = (field: keyof typeof formData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when form changes
    setError(null);
  };

  const validateForm = (): boolean => {
    if (!user) {
      setError("Você precisa estar logado para criar uma pesquisa.");
      return false;
    }
    
    if (!user.franqueadoraId) {
      setError("Seu usuário não está associado a nenhuma franqueadora. Contate o suporte.");
      return false;
    }
    
    // Ensure id_franqueadora exists
    if (!formData.id_franqueadora) {
      // Use the one from user context if available
      if (user.franqueadoraId) {
        setFormData(prev => ({
          ...prev,
          id_franqueadora: user.franqueadoraId
        }));
      } else {
        setError("Não foi possível identificar sua franqueadora. Por favor, faça login novamente.");
        return false;
      }
    }

    // Check required fields
    if (!formData.nome) {
      setError("O nome da pesquisa é obrigatório");
      return false;
    }

    if (!formData.pergunta) {
      setError("A pergunta NPS é obrigatória");
      return false;
    }

    // Check dates
    if (!formData.data_inicio || !formData.data_fim) {
      setError("As datas de início e término são obrigatórias");
      return false;
    }

    const startDate = new Date(formData.data_inicio);
    const endDate = new Date(formData.data_fim);

    if (endDate < startDate) {
      setError("A data de término não pode ser anterior à data de início");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (!validateForm()) {
        setIsSubmitting(false);
        return;
      }
      
      // Ensure we have the franqueadora ID from the user context
      if (!formData.id_franqueadora && user?.franqueadoraId) {
        formData.id_franqueadora = user.franqueadoraId;
      }
      
      console.log("Submitting form with data:", formData);
      
      let result;
      
      if (isEditing && initialData) {
        result = await updateSurvey(initialData.id, formData);
        if (result.success) {
          toast.success("Pesquisa atualizada com sucesso");
          navigate("/dashboard");
        }
      } else {
        result = await createSurvey(formData);
        if (result.success) {
          toast.success("Pesquisa criada com sucesso");
          navigate("/dashboard");
        }
      }
      
      if (!result.success) {
        console.error("API error response:", result.error);
        toast.error(`Erro ao ${isEditing ? 'atualizar' : 'criar'} pesquisa: ${result.error}`);
        setError(result.error);
      }
    } catch (error: any) {
      console.error("Error submitting form:", error);
      toast.error(`Ocorreu um erro: ${error.message || error}`);
      setError(error.message || "Erro ao processar seu pedido");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check if user is franqueado (they can't create surveys)
  useEffect(() => {
    if (user && user.role === 'franqueado') {
      setError("Apenas franqueadoras podem criar ou editar pesquisas.");
    }
  }, [user]);

  const isUserFranqueado = user?.role === 'franqueado';

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <FormErrorAlert error={error} />}
      
      <SurveyFormDetails 
        formData={formData} 
        handleChange={handleChange} 
        isSubmitting={isSubmitting} 
        isUserFranqueado={isUserFranqueado} 
      />

      <SurveyDateRange
        formData={formData}
        handleChange={handleChange}
        isSubmitting={isSubmitting}
        isUserFranqueado={isUserFranqueado}
      />

      <div className="flex gap-3 justify-end pt-4">
        <Button
          type="button" 
          variant="outline" 
          onClick={() => navigate("/dashboard")}
        >
          Cancelar
        </Button>
        <Button 
          type="submit" 
          disabled={isSubmitting || isUserFranqueado} 
          className="bg-gradient"
        >
          {isSubmitting
            ? "Salvando..."
            : isEditing
            ? "Atualizar Pesquisa"
            : "Criar Pesquisa"}
        </Button>
      </div>
    </form>
  );
}
