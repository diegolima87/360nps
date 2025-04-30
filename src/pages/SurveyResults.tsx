
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import TrialAlert from "@/components/TrialAlert";
import { FranchiseeResultCard } from "@/components/FranchiseeResultCard";
import { getSurvey, getSurveyResults, getSurveyResultsByFranchisee } from "@/services/surveyService";
import NPSScoreDisplay from "@/components/NPSScoreDisplay";
import { NPSChart } from "@/components/NPSChart";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Calendar, Copy, FileText } from "lucide-react";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { NPSResult } from "@/components/NPSCalculator";

// MOCK - Esta função será substituída por dados reais quando tivermos resultados reais
function calculateMockNpsResult(): NPSResult {
  return {
    score: 42,
    promoters: 15,
    passives: 10,
    detractors: 5,
    totalResponses: 30,
    promotersPercentage: 50,
    passivesPercentage: 33.3,
    detractorsPercentage: 16.7
  };
}

export default function SurveyResults() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [survey, setSurvey] = useState<any>(null);
  const [franchiseeResults, setFranchiseeResults] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("overview");
  
  useEffect(() => {
    const fetchSurveyAndResults = async () => {
      if (!id) {
        navigate("/dashboard");
        return;
      }
      
      try {
        setLoading(true);
        
        // Buscar dados da pesquisa
        const surveyResponse = await getSurvey(id);
        
        if (surveyResponse.success && surveyResponse.data) {
          setSurvey(surveyResponse.data);
          
          // Buscar resultados por franqueado
          const franchiseeResponse = await getSurveyResultsByFranchisee(id);
          if (franchiseeResponse.success && franchiseeResponse.data) {
            setFranchiseeResults(franchiseeResponse.data);
          }
        } else {
          toast.error(`Erro ao carregar pesquisa: ${surveyResponse.error}`);
          navigate("/dashboard");
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        toast.error("Não foi possível carregar os dados da pesquisa");
        navigate("/dashboard");
      } finally {
        setLoading(false);
      }
    };
    
    fetchSurveyAndResults();
  }, [id, navigate]);
  
  const handleCopyLink = () => {
    if (survey?.link) {
      navigator.clipboard.writeText(survey.link);
      toast.success("Link da pesquisa copiado!");
    }
  };
  
  // Dados do gráfico mock - substituir por dados reais quando disponíveis
  const chartData = [
    { name: "Promotores", value: 50, fill: "#4ade80" },
    { name: "Passivos", value: 33.3, fill: "#facc15" },
    { name: "Detratores", value: 16.7, fill: "#f87171" }
  ];
  
  // Dados NPS mock - substituir por dados reais quando disponíveis
  const npsData = calculateMockNpsResult();
  
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
          
          {loading ? (
            <div className="space-y-2">
              <Skeleton className="h-10 w-64" />
              <Skeleton className="h-6 w-80" />
            </div>
          ) : (
            <>
              <h1 className="text-3xl font-bold">{survey?.nome}</h1>
              <div className="flex flex-wrap gap-4 text-muted-foreground">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>
                    {survey && `${format(new Date(survey.data_inicio), "dd/MM/yyyy")} - ${format(new Date(survey.data_fim), "dd/MM/yyyy")}`}
                  </span>
                </div>
                <div className="flex items-center">
                  <FileText className="h-4 w-4 mr-1" />
                  <span>
                    {survey?.publico_alvo === "cliente" ? "Clientes" : "Franqueados"}
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
        
        {!loading && survey && (
          <Card className="mb-6">
            <CardHeader className="pb-0">
              <CardTitle className="text-lg">Link da Pesquisa</CardTitle>
              <CardDescription>
                Compartilhe este link para coletar respostas.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="flex w-full items-center space-x-2">
                <input 
                  className="flex h-10 w-full rounded-md border border-input bg-muted px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={survey.link || "Link não disponível"}
                  readOnly
                />
                <Button variant="outline" onClick={handleCopyLink}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
        
        {loading ? (
          <div className="space-y-6">
            <Skeleton className="h-[400px] w-full" />
          </div>
        ) : (
          <Tabs 
            defaultValue="overview" 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="space-y-4"
          >
            <TabsList className="grid w-full grid-cols-2 md:w-auto">
              <TabsTrigger value="overview">Visão Geral</TabsTrigger>
              <TabsTrigger value="franchisees">Por Franqueado</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Resultados da Pesquisa</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <NPSScoreDisplay data={npsData} />
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
                
                <Card className="md:col-span-2">
                  <CardHeader className="pb-2">
                    <CardTitle>Últimas Respostas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-24">Nota</TableHead>
                          <TableHead>Comentário</TableHead>
                          <TableHead>Data</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {/* Substituir por dados reais */}
                        <TableRow>
                          <TableCell className="font-medium text-nps-promotor">10</TableCell>
                          <TableCell>Excelente atendimento e suporte!</TableCell>
                          <TableCell className="text-muted-foreground">{format(new Date(), "dd/MM/yyyy")}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium text-nps-passivo">8</TableCell>
                          <TableCell>Boa experiência mas poderia melhorar em alguns pontos.</TableCell>
                          <TableCell className="text-muted-foreground">{format(new Date(), "dd/MM/yyyy")}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium text-nps-detrator">4</TableCell>
                          <TableCell>Tive problemas com o sistema e não recebi suporte adequado.</TableCell>
                          <TableCell className="text-muted-foreground">{format(new Date(), "dd/MM/yyyy")}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="franchisees" className="space-y-6">
              {franchiseeResults.length > 0 ? (
                <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2">
                  {franchiseeResults.map((result: any) => (
                    <FranchiseeResultCard
                      key={result.franqueado.id}
                      franqueado={result.franqueado}
                      respostas={result.respostas}
                      mediaNotas={result.mediaNotas}
                    />
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center py-8 text-muted-foreground">
                      <p className="text-lg font-medium mb-2">Nenhum resultado por franqueado disponível</p>
                      <p>As respostas serão exibidas aqui quando estiverem disponíveis.</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        )}
      </main>
      
      <Footer />
    </div>
  );
}
