
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Survey, createSurvey, updateSurvey } from "@/services/surveyService";
import { toast } from "sonner";

interface SurveyFormProps {
  initialData?: Survey;
  isEditing: boolean;
}

export default function SurveyForm({ initialData, isEditing }: SurveyFormProps) {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState<Omit<Survey, "id" | "link">>({
    nome: "",
    pergunta: "Em uma escala de 0 a 10, qual a probabilidade de você recomendar nossa franquia?",
    publico_alvo: "cliente",
    data_inicio: new Date().toISOString().split("T")[0],
    data_fim: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split("T")[0],
  });

  useEffect(() => {
    if (initialData && isEditing) {
      setFormData({
        nome: initialData.nome,
        pergunta: initialData.pergunta,
        publico_alvo: initialData.publico_alvo,
        data_inicio: initialData.data_inicio,
        data_fim: initialData.data_fim,
        id_franqueadora: initialData.id_franqueadora,
      });
    }
  }, [initialData, isEditing]);

  const handleChange = (field: keyof typeof formData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleStartDateSelect = (date: Date | undefined) => {
    if (date) {
      handleChange("data_inicio", date.toISOString().split("T")[0]);
    }
  };

  const handleEndDateSelect = (date: Date | undefined) => {
    if (date) {
      handleChange("data_fim", date.toISOString().split("T")[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
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
        toast.error(`Erro ao ${isEditing ? 'atualizar' : 'criar'} pesquisa: ${result.error}`);
      }
    } catch (error) {
      toast.error(`Ocorreu um erro: ${error}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="nome" className="mb-2 block">
          Nome da Pesquisa <span className="text-destructive">*</span>
        </Label>
        <Input
          id="nome"
          placeholder="Ex: Satisfação dos Franqueados Q2 2023"
          value={formData.nome}
          onChange={(e) => handleChange("nome", e.target.value)}
          required
        />
      </div>

      <div>
        <Label className="mb-2 block">
          Público-alvo <span className="text-destructive">*</span>
        </Label>
        <RadioGroup
          value={formData.publico_alvo}
          onValueChange={(value: "cliente" | "franqueado") => handleChange("publico_alvo", value)}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="cliente" id="cliente" />
            <Label htmlFor="cliente">Cliente</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="franqueado" id="franqueado" />
            <Label htmlFor="franqueado">Franqueado</Label>
          </div>
        </RadioGroup>
      </div>

      <div>
        <Label htmlFor="pergunta" className="mb-2 block">
          Pergunta NPS <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id="pergunta"
          value={formData.pergunta}
          onChange={(e) => handleChange("pergunta", e.target.value)}
          className="resize-none"
          required
        />
        <p className="text-xs text-muted-foreground mt-1">
          A escala de 0-10 será exibida automaticamente.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label className="mb-2 block">
            Data de Início <span className="text-destructive">*</span>
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.data_inicio ? 
                  format(new Date(formData.data_inicio), "dd/MM/yyyy") : 
                  "Selecionar data"
                }
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={formData.data_inicio ? new Date(formData.data_inicio) : undefined}
                onSelect={handleStartDateSelect}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div>
          <Label className="mb-2 block">
            Data de Término <span className="text-destructive">*</span>
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.data_fim ? 
                  format(new Date(formData.data_fim), "dd/MM/yyyy") : 
                  "Selecionar data"
                }
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={formData.data_fim ? new Date(formData.data_fim) : undefined}
                onSelect={handleEndDateSelect}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
                disabled={(date) => {
                  // Não permitir selecionar datas anteriores à data de início
                  if (formData.data_inicio) {
                    return date < new Date(formData.data_inicio);
                  }
                  return false;
                }}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="flex gap-3 justify-end pt-4">
        <Button
          type="button" 
          variant="outline" 
          onClick={() => navigate("/dashboard")}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
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
