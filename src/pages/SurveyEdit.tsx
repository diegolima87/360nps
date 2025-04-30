
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import TrialAlert from "@/components/TrialAlert";
import SurveyForm from "@/components/SurveyForm";
import { Survey, getSurvey } from "@/services/surveyService";
import { ArrowLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

export default function SurveyEdit() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchSurvey = async () => {
      if (!id) {
        navigate("/dashboard");
        return;
      }
      
      try {
        setLoading(true);
        const { success, data, error } = await getSurvey(id);
        
        if (success && data) {
          setSurvey(data);
        } else {
          toast.error(`Erro ao carregar pesquisa: ${error}`);
          navigate("/dashboard");
        }
      } catch (error) {
        console.error("Erro ao carregar pesquisa:", error);
        toast.error("Não foi possível carregar os dados da pesquisa");
        navigate("/dashboard");
      } finally {
        setLoading(false);
      }
    };
    
    fetchSurvey();
  }, [id, navigate]);
  
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
          <h1 className="text-3xl font-bold">Editar Pesquisa</h1>
          <p className="text-muted-foreground">Atualize as informações da sua pesquisa NPS</p>
        </div>
        
        <Card>
          <CardContent className="pt-6">
            {loading ? (
              <div className="space-y-4">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-10 w-full" />
                <div className="grid grid-cols-2 gap-4">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            ) : (
              <SurveyForm initialData={survey || undefined} isEditing={true} />
            )}
          </CardContent>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
}
