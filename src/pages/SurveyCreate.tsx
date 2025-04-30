
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { toast } from "sonner";
import { Calendar as CalendarIcon, ArrowLeft, ArrowRight, Eye } from "lucide-react";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import TrialAlert from "../components/TrialAlert";
import { cn } from "@/lib/utils";

export default function SurveyCreate() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    targetAudience: "cliente",
    question: "Em uma escala de 0 a 10, qual a probabilidade de você recomendar nossa franquia?",
    startDate: new Date(),
    endDate: new Date(new Date().setDate(new Date().getDate() + 30)),
    primaryColor: "#1a73e8",
    logoUrl: "",
    previewMode: false
  });
  
  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };
  
  const handleNext = () => {
    if (currentStep === 1) {
      // Validate step 1
      if (!formData.name || !formData.question) {
        toast.error("Preencha todos os campos obrigatórios.");
        return;
      }
    }
    
    setCurrentStep((prev) => prev + 1);
  };
  
  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
  };
  
  const handleSubmit = () => {
    // In a real app, this would save the survey to the database
    toast.success("Pesquisa criada com sucesso!");
    navigate("/dashboard");
  };
  
  const togglePreview = () => {
    handleChange("previewMode", !formData.previewMode);
  };
  
  // Preview component
  const SurveyPreview = () => (
    <div className="border rounded-lg overflow-hidden" style={{ backgroundColor: formData.previewMode ? "#f5f5f5" : "transparent" }}>
      {formData.previewMode ? (
        <div className="w-full animate-fade-in">
          <div className="p-4 text-white" style={{ backgroundColor: formData.primaryColor }}>
            {formData.logoUrl ? (
              <img src={formData.logoUrl} alt="Logo" className="h-10 mb-2" />
            ) : (
              <div className="h-10 w-32 rounded bg-white/20 mb-2"></div>
            )}
            <h3 className="text-lg font-semibold">Pesquisa de Satisfação</h3>
          </div>
          
          <div className="p-6">
            <h4 className="text-lg font-medium mb-6">{formData.question}</h4>
            
            <div className="mb-8">
              <div className="flex justify-between mb-2">
                <span className="text-sm">Pouco provável</span>
                <span className="text-sm">Muito provável</span>
              </div>
              <div className="flex justify-between">
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                  <div key={num} className="flex flex-col items-center">
                    <button 
                      className="w-8 h-8 rounded-full border-2 flex items-center justify-center mb-1 hover:bg-gray-100"
                      style={{ borderColor: formData.primaryColor }}
                    >
                      {num}
                    </button>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mb-6">
              <Label htmlFor="comment" className="mb-2 block">Por que você deu essa nota? (opcional)</Label>
              <Textarea id="comment" placeholder="Seu comentário..." className="resize-none" />
            </div>
            
            <div className="mb-8">
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="contact-permission" className="rounded" />
                <Label htmlFor="contact-permission">Autorizo ser contatado sobre esta avaliação</Label>
              </div>
            </div>
            
            <Button className="w-full" style={{ backgroundColor: formData.primaryColor }}>
              Enviar Avaliação
            </Button>
          </div>
        </div>
      ) : (
        <div className="w-full h-64 flex items-center justify-center border-2 border-dashed">
          <Button variant="outline" onClick={togglePreview}>
            <Eye className="mr-2 h-4 w-4" />
            Visualizar Pesquisa
          </Button>
        </div>
      )}
    </div>
  );
  
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <main className="flex-grow container py-6">
        <TrialAlert />
        
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="h-4 w-4 mr-1" />
              Voltar para Dashboard
            </Button>
          </div>
          <h1 className="text-3xl font-bold">Criar Nova Pesquisa</h1>
          <p className="text-muted-foreground">Configure sua pesquisa NPS personalizada</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <Card>
              <CardContent className="pt-6">
                {currentStep === 1 && (
                  <div className="space-y-6 animate-fade-in">
                    <div>
                      <Label htmlFor="name" className="mb-2 block">Nome da Pesquisa <span className="text-destructive">*</span></Label>
                      <Input 
                        id="name" 
                        placeholder="Ex: Satisfação dos Franqueados Q2 2023"
                        value={formData.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <Label className="mb-2 block">Público-alvo <span className="text-destructive">*</span></Label>
                      <RadioGroup 
                        value={formData.targetAudience}
                        onValueChange={(value) => handleChange("targetAudience", value)}
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
                      <Label htmlFor="question" className="mb-2 block">Pergunta NPS <span className="text-destructive">*</span></Label>
                      <Textarea
                        id="question"
                        value={formData.question}
                        onChange={(e) => handleChange("question", e.target.value)}
                        className="resize-none"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        A escala de 0-10 será exibida automaticamente.
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label className="mb-2 block">Data de Início <span className="text-destructive">*</span></Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-start text-left font-normal"
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {format(formData.startDate, "dd/MM/yyyy")}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={formData.startDate}
                              onSelect={(date) => date && handleChange("startDate", date)}
                              initialFocus
                              className={cn("p-3 pointer-events-auto")}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      
                      <div>
                        <Label className="mb-2 block">Data de Término <span className="text-destructive">*</span></Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-start text-left font-normal"
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {format(formData.endDate, "dd/MM/yyyy")}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={formData.endDate}
                              onSelect={(date) => date && handleChange("endDate", date)}
                              initialFocus
                              className={cn("p-3 pointer-events-auto")}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                  </div>
                )}
                
                {currentStep === 2 && (
                  <div className="space-y-6 animate-fade-in">
                    <div>
                      <Label htmlFor="primary-color" className="mb-2 block">Cor Primária</Label>
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          id="primary-color"
                          value={formData.primaryColor}
                          onChange={(e) => handleChange("primaryColor", e.target.value)}
                          className="w-10 h-10 rounded overflow-hidden cursor-pointer"
                        />
                        <Input
                          value={formData.primaryColor}
                          onChange={(e) => handleChange("primaryColor", e.target.value)}
                          maxLength={7}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="logo-url" className="mb-2 block">URL do Logo (opcional)</Label>
                      <Input
                        id="logo-url"
                        placeholder="https://sua-franquia.com/logo.png"
                        value={formData.logoUrl}
                        onChange={(e) => handleChange("logoUrl", e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Adicione a URL da sua logo para personalizar o formulário.
                      </p>
                    </div>
                    
                    <div className="pt-4">
                      <h3 className="text-lg font-medium mb-2">Link da Pesquisa</h3>
                      <div className="flex items-center">
                        <Input
                          readOnly
                          value={`https://nps360.app/survey/${Math.random().toString(36).substring(2, 9)}`}
                          className="bg-muted"
                        />
                        <Button variant="outline" className="ml-2" onClick={() => toast.success("Link copiado!")}>
                          Copiar
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        Este link estará ativo de {format(formData.startDate, "dd/MM/yyyy")} até {format(formData.endDate, "dd/MM/yyyy")}.
                      </p>
                    </div>
                  </div>
                )}
                
                <div className="flex justify-between mt-8">
                  {currentStep > 1 && (
                    <Button variant="outline" onClick={handleBack}>
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Voltar
                    </Button>
                  )}
                  
                  {currentStep < 2 ? (
                    <Button className="ml-auto bg-gradient hover:opacity-90" onClick={handleNext}>
                      Próximo
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  ) : (
                    <Button className="ml-auto bg-gradient hover:opacity-90" onClick={handleSubmit}>
                      Criar Pesquisa
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <div className="sticky top-20">
              <h2 className="font-semibold mb-3 flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Prévia da Pesquisa
              </h2>
              <SurveyPreview />
              {!formData.previewMode && (
                <p className="text-center text-sm text-muted-foreground mt-3">
                  Clique no botão acima para visualizar como ficará sua pesquisa
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
