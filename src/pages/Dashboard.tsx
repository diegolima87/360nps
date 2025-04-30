
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import SurveyList from "@/components/SurveyList";
import TrialAlert from "@/components/TrialAlert";
import { Survey, listSurveys } from "@/services/surveyService";
import { useSupabaseAuth } from "@/contexts/SupabaseAuthContext";
import { NPSResult } from "@/components/NPSCalculator";
import { NPSChart } from "@/components/NPSChart";
import NPSScoreDisplay from "@/components/NPSScoreDisplay";
import { Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const mockNpsData: NPSResult = {
  score: 42,
  promoters: 15,
  passives: 10,
  detractors: 5,
  totalResponses: 30,
  promotersPercentage: 50,
  passivesPercentage: 33.3,
  detractorsPercentage: 16.7
};

const chartData = [
  { name: "Promotores", value: 50, fill: "#4ade80" },
  { name: "Passivos", value: 33.3, fill: "#facc15" },
  { name: "Detratores", value: 16.7, fill: "#f87171" }
];

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useSupabaseAuth();
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(true);
  
  const fetchSurveys = async () => {
    setLoading(true);
    
    try {
      const { success, data, error } = await listSurveys();
      
      if (success && data) {
        setSurveys(data);
      } else {
        console.error("Erro ao carregar pesquisas:", error);
      }
    } catch (err) {
      console.error("Erro ao carregar pesquisas:", err);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchSurveys();
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <main className="flex-grow container py-6">
        <TrialAlert />
        
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">
              Bem-vindo, {user?.name}. Gerencie suas pesquisas NPS.
            </p>
          </div>
          <Button onClick={() => navigate("/survey-create")} className="bg-gradient" id="nova-pesquisa">
            <Plus className="mr-2 h-4 w-4" />
            Nova Pesquisa
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Visão Geral NPS</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mb-0">
                  <Card className="border-0 shadow-none">
                    <CardHeader className="pb-2 px-0 pt-0">
                      <CardTitle className="text-xl">NPS Atual</CardTitle>
                      <p className="text-sm text-muted-foreground">Score baseado em {mockNpsData.totalResponses} respostas</p>
                    </CardHeader>
                    <CardContent className="px-0">
                      <div className="text-6xl font-bold my-4 flex items-center justify-center">
                        <span className="text-yellow-400">
                          {mockNpsData.score}
                        </span>
                      </div>
                      <p className="text-sm text-center text-muted-foreground">
                        Regular. Há espaço para melhorias.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Distribuição de Respostas</CardTitle>
            </CardHeader>
            <CardContent>
              <NPSChart data={chartData} />
            </CardContent>
          </Card>
        </div>
        
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-4">Suas Pesquisas</h2>
          {loading ? (
            <div className="space-y-2">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : (
            <SurveyList surveys={surveys} onSurveyDeleted={fetchSurveys} />
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
