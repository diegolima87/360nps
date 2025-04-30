
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { NPSRating, calculateRespondentType } from "../components/NPSCalculator";

// Mock survey data (in a real app, this would be fetched from API)
const MOCK_SURVEY = {
  id: "survey-123",
  name: "Pesquisa de Satisfação",
  question: "Em uma escala de 0 a 10, qual a probabilidade de você recomendar nossa franquia?",
  franqueadora: {
    name: "Minha Franquia",
    logoUrl: "https://placehold.co/200x80/0057b7/FFF?text=LOGO",
    primaryColor: "#0057b7"
  }
};

export default function SurveyPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [rating, setRating] = useState<NPSRating | null>(null);
  const [comment, setComment] = useState("");
  const [contactPermission, setContactPermission] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Check if survey is valid (in a real app, check against database)
  const isValidSurvey = !!id;
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === null) {
      return; // Rating is required
    }
    
    setIsSubmitting(true);
    
    // In a real app, this would send data to the backend
    setTimeout(() => {
      // Get respondent type (promoter, passive, detractor)
      const respondentType = calculateRespondentType(rating);
      
      console.log({
        surveyId: id,
        rating,
        respondentType,
        comment,
        contactPermission,
        timestamp: new Date()
      });
      
      // Navigate to thank you page after submission
      navigate("/thank-you");
    }, 800);
  };
  
  // Style variables
  const primaryColor = MOCK_SURVEY.franqueadora.primaryColor;
  const primaryColorLight = `${primaryColor}20`; // 20% opacity version of the color
  
  if (!isValidSurvey) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <h1 className="text-2xl font-bold mb-4">Pesquisa não encontrada</h1>
          <p className="text-muted-foreground mb-6">
            Esta pesquisa não existe ou expirou.
          </p>
          <Button onClick={() => window.location.href = "/"}>Voltar para página inicial</Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header with franqueadora branding */}
      <header style={{ backgroundColor: primaryColor }} className="p-4 md:p-6">
        <div className="max-w-3xl mx-auto">
          {MOCK_SURVEY.franqueadora.logoUrl && (
            <img 
              src={MOCK_SURVEY.franqueadora.logoUrl} 
              alt={MOCK_SURVEY.franqueadora.name} 
              className="h-10 mb-2"
            />
          )}
          <h1 className="text-white text-xl font-bold">{MOCK_SURVEY.name}</h1>
        </div>
      </header>
      
      <main className="flex-grow flex items-center justify-center p-4 py-8">
        <div className="max-w-3xl w-full">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <h2 className="text-2xl font-semibold mb-6">{MOCK_SURVEY.question}</h2>
              
              <div className="mb-8">
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Pouco provável</span>
                  <span className="text-sm font-medium">Muito provável</span>
                </div>
                
                <div className="flex justify-between">
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <div key={num} className="flex flex-col items-center">
                      <button
                        type="button"
                        onClick={() => setRating(num as NPSRating)}
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-sm transition-colors ${
                          rating === num
                            ? "text-white"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                        style={{
                          backgroundColor: rating === num ? primaryColor : "transparent",
                          border: `2px solid ${rating === num ? primaryColor : "#d1d5db"}`
                        }}
                      >
                        {num}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div>
              <Label htmlFor="comment" className="text-lg font-medium block mb-2">
                Por que você deu essa nota? (opcional)
              </Label>
              <Textarea 
                id="comment" 
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Compartilhe sua experiência..."
                className="resize-none min-h-[100px]"
              />
            </div>
            
            <div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="contact-permission" 
                  checked={contactPermission}
                  onCheckedChange={(checked) => setContactPermission(checked as boolean)} 
                />
                <Label htmlFor="contact-permission" className="text-sm">
                  Autorizo ser contatado sobre esta avaliação
                </Label>
              </div>
            </div>
            
            <Button 
              type="submit"
              className="w-full md:w-auto py-6 text-base"
              style={{ backgroundColor: primaryColor }}
              disabled={rating === null || isSubmitting}
            >
              {isSubmitting ? "Enviando..." : "Enviar Avaliação"}
            </Button>
          </form>
          
          <div className="mt-12 pt-8 border-t text-center">
            <p className="text-xs text-muted-foreground">
              Suas respostas são anônimas e ajudam a melhorar a experiência.
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Pesquisa administrada por <span className="font-semibold">NPS360</span>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
