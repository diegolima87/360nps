
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { NPSResult } from "./NPSCalculator";

interface NPSScoreDisplayProps {
  data: NPSResult;
}

export function NPSScoreDisplay({ data }: NPSScoreDisplayProps) {
  const getNPSColorClass = (score: number): string => {
    if (score >= 50) return "text-nps-promotor";
    if (score >= 0) return "text-nps-passivo";
    return "text-nps-detrator";
  };

  return (
    <div className="animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">NPS Atual</CardTitle>
            <CardDescription>Score baseado em {data.totalResponses} respostas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-6xl font-bold my-4 flex items-center justify-center">
              <span className={getNPSColorClass(data.score)}>
                {data.score}
              </span>
            </div>
            <p className="text-sm text-center text-muted-foreground">
              {data.score >= 75
                ? "Excelente! Sua franquia está gerando muita lealdade."
                : data.score >= 50
                ? "Bom! Sua franquia está no caminho certo."
                : data.score >= 0
                ? "Regular. Há espaço para melhorias."
                : "Atenção! É preciso melhorar a experiência."}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Total de Respostas</CardTitle>
            <CardDescription>Distribuição por categoria</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-nps-promotor">Promotores</span>
                  <span className="text-sm">{data.promoters} ({Math.round(data.promotersPercentage)}%)</span>
                </div>
                <Progress value={data.promotersPercentage} className="h-2 bg-gray-200" indicatorClassName="bg-nps-promotor" />
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-nps-passivo">Passivos</span>
                  <span className="text-sm">{data.passives} ({Math.round(data.passivesPercentage)}%)</span>
                </div>
                <Progress value={data.passivesPercentage} className="h-2 bg-gray-200" indicatorClassName="bg-nps-passivo" />
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-nps-detrator">Detratores</span>
                  <span className="text-sm">{data.detractors} ({Math.round(data.detractorsPercentage)}%)</span>
                </div>
                <Progress value={data.detractorsPercentage} className="h-2 bg-gray-200" indicatorClassName="bg-nps-detrator" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default NPSScoreDisplay;
