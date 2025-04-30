
import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { SurveyResult } from "@/services/surveyService";
import { format } from "date-fns";
import { calculateRespondentType, NPSRating } from "@/components/NPSCalculator";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronDown } from "lucide-react";
import { motion } from "framer-motion";

interface FranchiseeResultCardProps {
  franqueado: { id: string; nome: string; email: string };
  respostas: SurveyResult[];
  mediaNotas: number;
  loading?: boolean;
}

export function FranchiseeResultCard({ franqueado, respostas, mediaNotas, loading = false }: FranchiseeResultCardProps) {
  const [expanded, setExpanded] = useState(false);

  const getScoreColor = (score: number) => {
    if (score >= 9) return "text-nps-promotor";
    if (score >= 7) return "text-nps-passivo";
    return "text-nps-detrator";
  };

  const getResponseTypeColor = (type: string | null) => {
    switch (type) {
      case "promotor":
        return "bg-green-100 text-green-800 border-green-300";
      case "passivo":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "detrator":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <Skeleton className="h-5 w-32 mb-1" />
              <Skeleton className="h-4 w-40" />
            </div>
            <div className="flex flex-col items-center">
              <Skeleton className="h-4 w-16 mb-1" />
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="hover:shadow-md transition-shadow duration-200">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start flex-wrap sm:flex-nowrap gap-2">
            <div>
              <CardTitle className="text-lg">{franqueado.nome}</CardTitle>
              <CardDescription className="break-all">{franqueado.email}</CardDescription>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-sm text-muted-foreground">Média NPS</span>
              <motion.span 
                className={`text-2xl font-bold ${getScoreColor(mediaNotas)}`}
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {mediaNotas}
              </motion.span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible>
            <AccordionItem value="responses">
              <AccordionTrigger
                onClick={() => setExpanded(!expanded)}
                className="text-sm"
              >
                <span className="flex items-center">
                  {respostas.length} resposta{respostas.length !== 1 ? "s" : ""}
                  <ChevronDown className={`ml-2 h-4 w-4 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`} />
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 mt-2">
                  {respostas.map((response, index) => {
                    // Garantir que nota_nps seja um NPSRating válido (0-10)
                    const nota = Math.min(Math.max(0, response.nota_nps || 0), 10) as NPSRating;
                    const responseType = response.tipo_resposta || calculateRespondentType(nota);
                    
                    return (
                      <motion.div 
                        key={response.id} 
                        className="border rounded-md p-3 space-y-2"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <div className="flex justify-between items-center flex-wrap gap-2">
                          <div>
                            <span className={`text-xl font-semibold ${getScoreColor(response.nota_nps || 0)}`}>
                              {response.nota_nps}
                            </span>
                            <Badge variant="outline" className={`ml-2 ${getResponseTypeColor(responseType)}`}>
                              {responseType === "promotor" 
                                ? "Promotor" 
                                : responseType === "passivo" 
                                ? "Passivo" 
                                : "Detrator"
                              }
                            </Badge>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(response.data_envio), "dd/MM/yyyy HH:mm")}
                          </span>
                        </div>
                        
                        {response.comentario && (
                          <div className="bg-gray-50 p-2 rounded-md border border-gray-100">
                            <p className="text-sm">{response.comentario}</p>
                          </div>
                        )}
                        
                        {response.autorizacao && (
                          <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-200 text-xs">
                            Autorizou contato
                          </Badge>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </motion.div>
  );
}
