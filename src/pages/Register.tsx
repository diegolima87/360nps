
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { useSupabaseAuth } from "../contexts/SupabaseAuthContext";
import { UserPlus } from "lucide-react";
import NavBar from "../components/NavBar";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<"franqueadora" | "franqueado">("franqueadora");
  const [businessName, setBusinessName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const { register, loading } = useSupabaseAuth();
  
  // Reset businessName when role changes for better UX
  useEffect(() => {
    setBusinessName("");
  }, [role]);

  // Update loading state based on context
  useEffect(() => {
    setIsLoading(loading);
  }, [loading]);
  
  const validateForm = () => {
    // Simple validation
    if (!name || !email || !password || !confirmPassword || !businessName) {
      setErrorMessage("Por favor, preencha todos os campos.");
      return false;
    }
    
    if (password !== confirmPassword) {
      setErrorMessage("As senhas não coincidem.");
      return false;
    }
    
    if (password.length < 6) {
      setErrorMessage("A senha deve ter pelo menos 6 caracteres.");
      return false;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage("Por favor, forneça um email válido.");
      return false;
    }
    
    // Clear any previous errors
    setErrorMessage(null);
    return true;
  };
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setIsLoading(true);
      console.log("Attempting to register user:", email, "as", role);
      
      const success = await register(name, email, password, role, businessName);
      
      console.log("Registration result:", success);
      
      if (success) {
        navigate("/dashboard");
      }
    } catch (error: any) {
      console.error("Error in registration submit handler:", error);
      setErrorMessage(`Erro ao processar seu cadastro: ${error?.message || "Erro desconhecido"}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <div className="flex-grow flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md shadow-lg animate-fade-in">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-4">
              <div className="h-12 w-12 bg-gradient rounded-full flex items-center justify-center">
                <UserPlus className="h-6 w-6 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl">Crie sua conta</CardTitle>
            <CardDescription>
              Comece seu período de avaliação gratuita de 7 dias
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {errorMessage && (
                <Alert variant="destructive" className="animate-slide-in">
                  <AlertTitle>Erro</AlertTitle>
                  <AlertDescription>{errorMessage}</AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="name">Nome completo</Label>
                <Input 
                  id="name"
                  type="text"
                  placeholder="Seu nome"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={isLoading}
                  className="hover-lift"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  className="hover-lift"
                />
              </div>

              <div className="space-y-2">
                <Label>Tipo de conta</Label>
                <RadioGroup value={role} onValueChange={(value) => setRole(value as "franqueadora" | "franqueado")}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="franqueadora" id="franqueadora" disabled={isLoading} />
                    <Label htmlFor="franqueadora" className="cursor-pointer">Sou Franqueadora</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="franqueado" id="franqueado" disabled={isLoading} />
                    <Label htmlFor="franqueado" className="cursor-pointer">Sou Franqueado</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div className="space-y-2 animate-fade-in">
                <Label htmlFor="businessName">
                  {role === "franqueadora" ? "Nome da Franqueadora" : "Nome da Unidade Franqueada"}
                </Label>
                <Input 
                  id="businessName"
                  type="text"
                  placeholder={role === "franqueadora" ? "Nome da sua franqueadora" : "Nome da sua unidade"}
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  required
                  disabled={isLoading}
                  className="hover-lift"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input 
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  className="hover-lift"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirme sua senha</Label>
                <Input 
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  className="hover-lift"
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button 
                type="submit" 
                className="w-full bg-gradient hover:opacity-90 custom-transition" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                    Cadastrando...
                  </>
                ) : "Criar Conta"}
              </Button>
              <div className="text-center text-sm">
                Já tem uma conta?{" "}
                <Link to="/login" className="text-primary hover:underline">
                  Faça login
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
