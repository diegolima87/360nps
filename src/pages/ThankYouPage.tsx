
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

export default function ThankYouPage() {
  // Auto-redirect after 10 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      window.close(); // Try to close the window first
      // If window.close() is blocked by the browser, redirect to the landing page
      setTimeout(() => {
        window.location.href = "/";
      }, 500);
    }, 10000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-md w-full text-center">
        <div className="bg-green-100 rounded-full p-3 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
          <CheckCircle size={40} className="text-green-600" />
        </div>
        
        <h1 className="text-3xl font-bold mb-4">Obrigado pelo seu feedback!</h1>
        
        <p className="text-lg text-muted-foreground mb-8">
          Sua opinião é muito importante para nós. Suas respostas ajudarão a melhorar a experiência.
        </p>
        
        <div className="space-y-4">
          <Button 
            className="w-full bg-gradient hover:opacity-90"
            onClick={() => window.close()}
          >
            Fechar
          </Button>
          
          <p className="text-sm text-muted-foreground">
            Esta janela será fechada automaticamente em 10 segundos.
          </p>
        </div>
      </div>
    </div>
  );
}
