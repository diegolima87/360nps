
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

export default function ThankYouPage() {
  const { toast } = useToast();
  
  // Auto-redirect after 10 seconds
  useEffect(() => {
    // Toast notification to inform user about redirect
    toast({
      title: "Redirecionamento automático",
      description: "Esta página será fechada em 10 segundos",
      duration: 5000,
    });
    
    const timer = setTimeout(() => {
      window.close(); // Try to close the window first
      // If window.close() is blocked by the browser, redirect to the landing page
      setTimeout(() => {
        window.location.href = "/";
      }, 500);
    }, 10000);
    
    return () => clearTimeout(timer);
  }, [toast]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.2,
        delay: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  const circleVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        delay: 0.4 
      } 
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-white to-gray-50">
      <motion.div 
        className="max-w-md w-full text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div 
          className="bg-green-100 rounded-full p-3 w-20 h-20 mx-auto mb-6 flex items-center justify-center"
          variants={circleVariants}
        >
          <CheckCircle size={40} className="text-green-600" />
        </motion.div>
        
        <motion.h1 
          className="text-3xl font-bold mb-4"
          variants={itemVariants}
        >
          Obrigado pelo seu feedback!
        </motion.h1>
        
        <motion.p 
          className="text-lg text-muted-foreground mb-8"
          variants={itemVariants}
        >
          Sua opinião é muito importante para nós. Suas respostas ajudarão a melhorar a experiência.
        </motion.p>
        
        <motion.div 
          className="space-y-4"
          variants={itemVariants}
        >
          <Button 
            className="w-full bg-gradient hover:opacity-90"
            onClick={() => window.close()}
          >
            Fechar
          </Button>
          
          <motion.p 
            className="text-sm text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            Esta janela será fechada automaticamente em 10 segundos.
          </motion.p>
        </motion.div>
      </motion.div>
    </div>
  );
}
