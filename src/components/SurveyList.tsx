
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { format } from "date-fns";
import { Survey, deleteSurvey } from "@/services/surveyService";
import { toast } from "sonner";
import { Calendar, Eye, MoreHorizontal, Pencil, Trash2 } from "lucide-react";

interface SurveyListProps {
  surveys: Survey[];
  onSurveyDeleted: () => void;
}

export default function SurveyList({ surveys, onSurveyDeleted }: SurveyListProps) {
  const navigate = useNavigate();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [surveyToDelete, setSurveyToDelete] = useState<string | null>(null);
  
  const handleDeleteClick = (id: string) => {
    setSurveyToDelete(id);
    setDeleteDialogOpen(true);
  };
  
  const handleConfirmDelete = async () => {
    if (!surveyToDelete) return;
    
    const { success, error } = await deleteSurvey(surveyToDelete);
    
    if (success) {
      toast.success("Pesquisa excluída com sucesso");
      onSurveyDeleted();
    } else {
      toast.error(`Erro ao excluir pesquisa: ${error}`);
    }
    
    setDeleteDialogOpen(false);
    setSurveyToDelete(null);
  };
  
  const getStatusBadge = (survey: Survey) => {
    const today = new Date();
    const startDate = new Date(survey.data_inicio);
    const endDate = new Date(survey.data_fim);
    
    if (today < startDate) {
      return <Badge variant="outline" className="bg-gray-100">Agendada</Badge>;
    } else if (today > endDate) {
      return <Badge variant="outline" className="bg-gray-200 text-gray-600">Encerrada</Badge>;
    } else {
      return <Badge className="bg-green-500">Ativa</Badge>;
    }
  };

  return (
    <div>
      <Table className="border">
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Público</TableHead>
            <TableHead>Período</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[100px]">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {surveys.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                Nenhuma pesquisa encontrada. Crie sua primeira pesquisa!
              </TableCell>
            </TableRow>
          ) : (
            surveys.map((survey) => (
              <TableRow key={survey.id}>
                <TableCell className="font-medium">{survey.nome}</TableCell>
                <TableCell>
                  {survey.publico_alvo === "cliente" ? "Clientes" : "Franqueados"}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span className="text-sm">
                      {format(new Date(survey.data_inicio), "dd/MM/yyyy")} - {format(new Date(survey.data_fim), "dd/MM/yyyy")}
                    </span>
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(survey)}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <span className="sr-only">Abrir menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => navigate(`/survey-results/${survey.id}`)}>
                        <Eye className="mr-2 h-4 w-4" />
                        Ver Resultados
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate(`/survey-edit/${survey.id}`)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleDeleteClick(survey.id)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta pesquisa? Esta ação não pode ser desfeita e todos os resultados serão perdidos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive text-destructive-foreground">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
