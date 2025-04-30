
import { useState } from "react";
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

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<"franqueadora" | "franqueado">("franqueadora");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useSupabaseAuth();
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Simple validation
      if (!name || !email || !password || !confirmPassword) {
        toast.error("Por favor, preencha todos os campos.");
        setIsLoading(false);
        return;
      }
      
      if (password !== confirmPassword) {
        toast.error("As senhas não coincidem.");
        setIsLoading(false);
        return;
      }
      
      if (password.length < 6) {
        toast.error("A senha deve ter pelo menos 6 caracteres.");
        setIsLoading(false);
        return;
      }
      
      const success = await register(name, email, password, role);
      
      if (success) {
        toast.success("Conta criada com sucesso! Você tem 7 dias de avaliação gratuita.");
        navigate("/dashboard");
      } else {
        toast.error("Erro ao criar conta.");
      }
    } catch (error) {
      toast.error("Ocorreu um erro ao processar seu cadastro.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <div className="flex-grow flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md shadow-lg">
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
              <div className="space-y-2">
                <Label htmlFor="name">Nome completo</Label>
                <Input 
                  id="name"
                  type="text"
                  placeholder="Seu nome"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
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
                />
              </div>
              
              <div className="space-y-2">
                <Label>Tipo de conta</Label>
                <RadioGroup defaultValue="franqueadora" onValueChange={(value) => setRole(value as "franqueadora" | "franqueado")}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="franqueadora" id="franqueadora" />
                    <Label htmlFor="franqueadora" className="cursor-pointer">Sou Franqueadora</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="franqueado" id="franqueado" />
                    <Label htmlFor="franqueado" className="cursor-pointer">Sou Franqueado</Label>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full bg-gradient hover:opacity-90" disabled={isLoading}>
                {isLoading ? "Cadastrando..." : "Criar Conta"}
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
