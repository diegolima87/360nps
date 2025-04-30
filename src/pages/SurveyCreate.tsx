
import { Card, CardContent } from "@/components/ui/card";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import TrialAlert from "../components/TrialAlert";
import SurveyForm from "../components/SurveyForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function SurveyCreate() {
  const navigate = useNavigate();
  
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
          <h1 className="text-3xl font-bold">Criar Nova Pesquisa</h1>
          <p className="text-muted-foreground">Configure sua pesquisa NPS personalizada</p>
        </div>
        
        <Card>
          <CardContent className="pt-6">
            <SurveyForm isEditing={false} />
          </CardContent>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
}
