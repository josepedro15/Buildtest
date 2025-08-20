import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Download, BarChart3, Settings, Zap, CheckCircle, TrendingUp, MessageCircle } from "lucide-react";
import { WHATSAPP_CONTACT } from "@/lib/utils";

const HowItWorks = () => {
  const handleWhatsAppContact = () => {
    window.open(WHATSAPP_CONTACT.link, '_blank');
  };

  const steps = [
    {
      icon: Download,
      number: "01",
      title: "Conecte seu WhatsApp",
      description: "Integração simples e segura com o WhatsApp Business para importar suas conversas automaticamente.",
      color: "text-chart-blue"
    },
    {
      icon: BarChart3,
      number: "02", 
      title: "Análise Inteligente",
      description: "Nossa IA processa todas as conversas identificando padrões, intenções e oportunidades de melhoria.",
      color: "text-chart-green"
    },
    {
      icon: Settings,
      number: "03",
      title: "Receba Insights",
      description: "Dashboard completo com métricas detalhadas, sugestões de automação e pontos de otimização.",
      color: "text-chart-orange"
    },
    {
      icon: Zap,
      number: "04",
      title: "Otimize e Converta",
      description: "Aplique as melhorias sugeridas e acompanhe o aumento da conversão em tempo real.",
      color: "text-chart-purple"
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-accent/10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Como funciona em 4 passos simples
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Configure em minutos e comece a ver resultados no mesmo dia. 
            Sem complicações técnicas ou integrações complexas.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <Card className="p-6 text-center h-full hover:shadow-lg transition-shadow">
                  <div className="relative mb-6">
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent ${step.color} mb-4`}>
                      <step.icon className="h-8 w-8" />
                    </div>
                    <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs font-bold rounded-full w-8 h-8 flex items-center justify-center">
                      {step.number}
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-foreground mb-3">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {step.description}
                  </p>
                </Card>

                {/* Arrow connector (desktop only) */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <ArrowRight className="h-6 w-6 text-primary" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Results Section */}
        <div className="mt-16 bg-gradient-to-r from-primary/5 to-accent/10 rounded-2xl p-8">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Resultados Reais dos Nossos Clientes
            </h3>
            <p className="text-muted-foreground">
              Veja como empresas como a sua estão transformando atendimentos em vendas
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-6 text-center shadow-sm">
              <div className="flex items-center justify-center gap-2 mb-3">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <span className="text-2xl font-bold text-green-600">+45%</span>
              </div>
              <p className="text-sm text-muted-foreground">Aumento na conversão</p>
              <p className="text-xs text-muted-foreground mt-1">E-commerce de roupas</p>
            </div>
            
            <div className="bg-white rounded-lg p-6 text-center shadow-sm">
              <div className="flex items-center justify-center gap-2 mb-3">
                <CheckCircle className="h-5 w-5 text-blue-600" />
                <span className="text-2xl font-bold text-blue-600">-60%</span>
              </div>
              <p className="text-sm text-muted-foreground">Redução no tempo de resposta</p>
              <p className="text-xs text-muted-foreground mt-1">Clínica médica</p>
            </div>
            
            <div className="bg-white rounded-lg p-6 text-center shadow-sm">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Zap className="h-5 w-5 text-orange-600" />
                <span className="text-2xl font-bold text-orange-600">+80%</span>
              </div>
              <p className="text-sm text-muted-foreground">Mais leads qualificados</p>
              <p className="text-xs text-muted-foreground mt-1">Imobiliária</p>
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-6">
            Pronto para transformar seus atendimentos em resultados?
          </p>
          <Button 
            onClick={handleWhatsAppContact}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold"
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Fale Conosco
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;