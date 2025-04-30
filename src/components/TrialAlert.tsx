
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner";

export function TrialAlert() {
  const { user, isTrialActive } = useAuth();
  
  if (isTrialActive || !user) return null;
  
  // Calculate days since trial ended
  const trialEnd = new Date(user.trialEndDate);
  const today = new Date();
  const daysSinceEnd = Math.floor((today.getTime() - trialEnd.getTime()) / (1000 * 60 * 60 * 24));
  
  const handleUpgrade = () => {
    toast("Em breve!", {
      description: "Esta funcionalidade estará disponível nas próximas versões.",
    });
  };
  
  return (
    <Alert variant="destructive" className="mb-6">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Seu período de avaliação expirou!</AlertTitle>
      <AlertDescription className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mt-2">
        <span>
          Seu período de avaliação gratuita terminou há {daysSinceEnd} {daysSinceEnd === 1 ? 'dia' : 'dias'}. Faça upgrade para continuar usando todos os recursos.
        </span>
        <Button onClick={handleUpgrade} className="whitespace-nowrap bg-gradient">
          Fazer Upgrade
        </Button>
      </AlertDescription>
    </Alert>
  );
}

export default TrialAlert;
