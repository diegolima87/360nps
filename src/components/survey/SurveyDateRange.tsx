
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Survey } from "@/services/surveyService";

interface SurveyDateRangeProps {
  formData: Omit<Survey, "id" | "link">;
  handleChange: (field: keyof Omit<Survey, "id" | "link">, value: any) => void;
  isSubmitting: boolean;
  isUserFranqueado: boolean;
}

export default function SurveyDateRange({
  formData,
  handleChange,
  isSubmitting,
  isUserFranqueado
}: SurveyDateRangeProps) {
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

  return (
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
              disabled={isSubmitting || isUserFranqueado}
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
              disabled={isUserFranqueado}
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
              disabled={isSubmitting || isUserFranqueado}
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
                // Don't allow selecting dates before the start date
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
  );
}
