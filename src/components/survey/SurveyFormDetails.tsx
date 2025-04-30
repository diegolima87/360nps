
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Survey } from "@/services/surveyService";

interface SurveyFormDetailsProps {
  formData: Omit<Survey, "id" | "link">;
  handleChange: (field: keyof Omit<Survey, "id" | "link">, value: any) => void;
  isSubmitting: boolean;
  isUserFranqueado: boolean;
}

export default function SurveyFormDetails({ 
  formData, 
  handleChange, 
  isSubmitting, 
  isUserFranqueado 
}: SurveyFormDetailsProps) {
  return (
    <>
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
          disabled={isSubmitting || isUserFranqueado}
        />
      </div>

      <div>
        <Label className="mb-2 block">
          Público-alvo <span className="text-destructive">*</span>
        </Label>
        <RadioGroup
          value={formData.publico_alvo}
          onValueChange={(value: "cliente" | "franqueado") => handleChange("publico_alvo", value)}
          disabled={isSubmitting || isUserFranqueado}
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
          disabled={isSubmitting || isUserFranqueado}
        />
        <p className="text-xs text-muted-foreground mt-1">
          A escala de 0-10 será exibida automaticamente.
        </p>
      </div>
    </>
  );
}
