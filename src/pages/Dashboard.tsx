
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { Download, FileDown, PlusCircle } from "lucide-react";
import { toast } from "sonner";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import TrialAlert from "../components/TrialAlert";
import NPSScoreDisplay from "../components/NPSScoreDisplay";
import { NPSChart } from "../components/NPSChart";
import { CommentsList } from "../components/CommentsList";
import { NPSRating, calculateNPS, Respondent } from "../components/NPSCalculator";

// Mock data for dashboard
const MOCK_RATINGS: NPSRating[] = [10, 9, 10, 8, 7, 6, 5, 9, 10, 2, 8, 9, 4, 10];

const MOCK_COMMENTS = [
  { id: "1", rating: 10, type: "promotor" as Respondent, text: "Excelente atendimento e suporte da franqueadora!", date: new Date(2023, 3, 15) },
  { id: "2", rating: 8, type: "passivo" as Respondent, text: "Bom serviço, mas poderia ter mais treinamentos.", date: new Date(2023, 3, 14) },
  { id: "3", rating: 4, type: "detrator" as Respondent, text: "Dificuldade em obter suporte quando precisei.", date: new Date(2023, 3, 12) },
  { id: "4", rating: 9, type: "promotor" as Respondent, text: "Muito satisfeito com os processos e materiais oferecidos.", date: new Date(2023, 3, 10) },
  { id: "5", rating: 6, type: "detrator" as Respondent, text: "Precisa melhorar o tempo de resposta.", date: new Date(2023, 3, 5) },
];

export default function Dashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState("all");
  const [activeTab, setActiveTab] = useState("overview");
  
  const npsData = calculateNPS(MOCK_RATINGS);
  
  const chartData = [
    { name: "Promotores", value: Math.round(npsData.promotersPercentage), fill: "#4CAF50" },
    { name: "Passivos", value: Math.round(npsData.passivesPercentage), fill: "#FFC107" },
    { name: "Detratores", value: Math.round(npsData.detractorsPercentage), fill: "#F44336" },
  ];
  
  const handleExport = (format: "excel" | "pdf") => {
    toast.success(`Relatório exportado em formato ${format.toUpperCase()}.`);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <main className="flex-grow container py-6">
        <TrialAlert />
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Acompanhe o desempenho das suas pesquisas NPS</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Select defaultValue={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Selecione o período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os períodos</SelectItem>
                <SelectItem value="week">Última semana</SelectItem>
                <SelectItem value="month">Último mês</SelectItem>
                <SelectItem value="quarter">Último trimestre</SelectItem>
                <SelectItem value="year">Último ano</SelectItem>
              </SelectContent>
            </Select>
            
            <Link to="/survey-create">
              <Button className="bg-gradient hover:opacity-90 w-full sm:w-auto">
                <PlusCircle className="mr-2 h-4 w-4" />
                Nova Pesquisa
              </Button>
            </Link>
          </div>
        </div>
        
        <NPSScoreDisplay data={npsData} />
        
        <Tabs defaultValue="overview" className="mt-8" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="comments">Comentários</TabsTrigger>
            <TabsTrigger value="surveys">Pesquisas</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="grid grid-cols-1 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">Distribuição de Respostas</CardTitle>
                </CardHeader>
                <CardContent>
                  <NPSChart data={chartData} />
                </CardContent>
              </Card>
              
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => handleExport("excel")}>
                  <FileDown className="mr-2 h-4 w-4" />
                  Exportar Excel
                </Button>
                <Button variant="outline" onClick={() => handleExport("pdf")}>
                  <Download className="mr-2 h-4 w-4" />
                  Exportar PDF
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="comments">
            <div className="mb-4">
              <h2 className="text-xl font-semibold mb-4">Comentários dos Respondentes</h2>
              <CommentsList comments={MOCK_COMMENTS} />
            </div>
          </TabsContent>
          
          <TabsContent value="surveys">
            <div className="mb-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Pesquisas Ativas</h2>
                <Link to="/survey-create">
                  <Button size="sm" className="bg-gradient hover:opacity-90">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Nova Pesquisa
                  </Button>
                </Link>
              </div>
              
              {/* Mock survey list */}
              <div className="space-y-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div>
                        <h3 className="font-semibold">Satisfação dos Franqueados Q2 2023</h3>
                        <p className="text-sm text-muted-foreground">14 respostas • Ativa até 15/06/2023</p>
                      </div>
                      <div className="flex gap-2 w-full md:w-auto">
                        <Button variant="outline" className="flex-1 md:flex-none">Ver Detalhes</Button>
                        <Button variant="outline" className="flex-1 md:flex-none">Copiar Link</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="text-center py-4">
                  <p className="text-muted-foreground">Crie sua primeira pesquisa para começar a coletar feedback.</p>
                  <Link to="/survey-create">
                    <Button variant="link" className="mt-2">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Criar Pesquisa
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
      
      <Footer />
    </div>
  );
}
