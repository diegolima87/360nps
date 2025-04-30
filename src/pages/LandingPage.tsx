
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import { ChevronRight, BarChart3, MessageCircle, Link as LinkIcon, CheckCircle } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-16 md:py-24">
          <div className="container">
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
              <div className="md:w-1/2 space-y-6">
                <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                  A plataforma <span className="text-gradient">whitelabel</span> para medir a experiência da sua rede de franquias.
                </h1>
                <p className="text-lg text-muted-foreground">
                  Obtenha insights valiosos, aumente a satisfação e impulsione o crescimento da sua rede com pesquisas NPS personalizadas e análises em tempo real.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <Link to="/register">
                    <Button size="lg" className="bg-gradient hover:opacity-90 w-full sm:w-auto">
                      Cadastrar Gratuitamente
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button size="lg" variant="outline" className="w-full sm:w-auto">
                      Login
                    </Button>
                  </Link>
                </div>
                <p className="text-sm text-muted-foreground">
                  Experimente gratuitamente por 7 dias. Sem cartão de crédito.
                </p>
              </div>
              <div className="md:w-1/2">
                <div className="relative">
                  <div className="absolute -top-6 -left-6 w-24 h-24 bg-nps-primary/10 rounded-full blur-xl"></div>
                  <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-nps-secondary/10 rounded-full blur-xl"></div>
                  <div className="bg-white shadow-xl rounded-xl border overflow-hidden">
                    <div className="p-4 bg-gradient">
                      <h3 className="text-white font-semibold">Dashboard de NPS</h3>
                    </div>
                    <img 
                      src="https://placehold.co/600x400/f5f5f5/cccccc?text=Dashboard+Preview" 
                      alt="Dashboard Preview" 
                      className="w-full" 
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Benefits Section */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Benefícios da plataforma</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Gerenciar o NPS da sua rede de franquias nunca foi tão fácil. Veja como podemos ajudar.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md border">
                <div className="mb-4 h-12 w-12 rounded-full bg-nps-primary/10 flex items-center justify-center">
                  <MessageCircle className="h-6 w-6 text-nps-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Coleta Rápida</h3>
                <p className="text-muted-foreground">
                  Crie pesquisas personalizadas em minutos e compartilhe facilmente com sua rede de franqueados ou clientes.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md border">
                <div className="mb-4 h-12 w-12 rounded-full bg-nps-primary/10 flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-nps-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Painel em Tempo Real</h3>
                <p className="text-muted-foreground">
                  Acompanhe resultados em tempo real com gráficos e métricas claras para tomar decisões baseadas em dados.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md border">
                <div className="mb-4 h-12 w-12 rounded-full bg-nps-primary/10 flex items-center justify-center">
                  <LinkIcon className="h-6 w-6 text-nps-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Link Personalizado</h3>
                <p className="text-muted-foreground">
                  Compartilhe pesquisas com a aparência da sua marca, criando uma experiência consistente para seus respondentes.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* How It Works Section */}
        <section className="py-16">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Como funciona</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Siga estes simples passos para começar a coletar feedback valioso.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-nps-primary/10 flex items-center justify-center relative">
                  <span className="text-xl font-bold text-nps-primary">1</span>
                </div>
                <h3 className="font-semibold mb-2">Cadastro</h3>
                <p className="text-sm text-muted-foreground">
                  Crie sua conta gratuitamente e configure o perfil da sua franquia.
                </p>
              </div>
              
              <div className="text-center">
                <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-nps-primary/10 flex items-center justify-center">
                  <span className="text-xl font-bold text-nps-primary">2</span>
                </div>
                <h3 className="font-semibold mb-2">Crie Pesquisas</h3>
                <p className="text-sm text-muted-foreground">
                  Personalize suas pesquisas NPS com a marca da sua franquia.
                </p>
              </div>
              
              <div className="text-center">
                <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-nps-primary/10 flex items-center justify-center">
                  <span className="text-xl font-bold text-nps-primary">3</span>
                </div>
                <h3 className="font-semibold mb-2">Compartilhe</h3>
                <p className="text-sm text-muted-foreground">
                  Envie o link personalizado para seus franqueados ou clientes.
                </p>
              </div>
              
              <div className="text-center">
                <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-nps-primary/10 flex items-center justify-center">
                  <span className="text-xl font-bold text-nps-primary">4</span>
                </div>
                <h3 className="font-semibold mb-2">Analise Resultados</h3>
                <p className="text-sm text-muted-foreground">
                  Visualize os dados em tempo real no dashboard intuitivo.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 bg-gradient">
          <div className="container">
            <div className="text-center text-white">
              <h2 className="text-3xl font-bold mb-4">Pronto para melhorar a experiência da sua rede?</h2>
              <p className="max-w-2xl mx-auto mb-8 opacity-90">
                Comece a coletar feedback valioso hoje mesmo. Experimente gratuitamente por 7 dias.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link to="/register">
                  <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                    Cadastrar Gratuitamente
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
              <div className="mt-8 flex flex-col sm:flex-row justify-center gap-6">
                <div className="flex items-center justify-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  <span>Sem cartão de crédito</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  <span>Acesso completo por 7 dias</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  <span>Cancelamento fácil</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
