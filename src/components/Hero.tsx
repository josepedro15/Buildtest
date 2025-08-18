import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BarChart3, TrendingUp, Users, Zap } from "lucide-react";

const Hero = () => {
  return (
    <section className="py-20 lg:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/10"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(34,197,94,0.1),transparent_50%)]"></div>
      <div className="relative z-10">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
            Transforme seus atendimentos do{" "}
            <span className="text-primary">WhatsApp</span> em{" "}
            <span className="text-primary">insights poderosos</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-6 max-w-2xl mx-auto">
            Analise conversas, identifique oportunidades e otimize suas vendas com 
            inteligência artificial. Aumente sua conversão em até 40%.
          </p>
          
          {/* Social Proof */}
          <div className="flex items-center justify-center gap-6 mb-8">
            <div className="flex -space-x-2">
              {[1,2,3,4,5].map(i => (
                <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-primary/80 border-2 border-white shadow-sm" />
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-primary">+500 empresas</span> já confiam em nós
            </p>
          </div>

          {/* Urgency Banner */}
          <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-lg p-4 mb-8 max-w-md mx-auto">
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <p className="text-red-800 text-sm font-medium">
                ⚡ Oferta limitada: Primeiros 50 clientes ganham consultoria gratuita
              </p>
            </div>
          </div>

          <div className="flex justify-center">
            <Button asChild size="lg" className="text-lg px-8 py-6">
              <a href="#contact">Fale Conosco</a>
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          <Card className="p-6 text-center">
            <TrendingUp className="h-8 w-8 text-primary mx-auto mb-3" />
            <div className="text-2xl font-bold text-foreground">+40%</div>
            <div className="text-sm text-muted-foreground">Conversão</div>
          </Card>
          <Card className="p-6 text-center">
            <Zap className="h-8 w-8 text-chart-orange mx-auto mb-3" />
            <div className="text-2xl font-bold text-foreground">-60%</div>
            <div className="text-sm text-muted-foreground">Tempo de Resposta</div>
          </Card>
          <Card className="p-6 text-center">
            <Users className="h-8 w-8 text-chart-blue mx-auto mb-3" />
            <div className="text-2xl font-bold text-foreground">+25%</div>
            <div className="text-sm text-muted-foreground">Satisfação</div>
          </Card>
          <Card className="p-6 text-center">
            <BarChart3 className="h-8 w-8 text-chart-purple mx-auto mb-3" />
            <div className="text-2xl font-bold text-foreground">10x</div>
            <div className="text-sm text-muted-foreground">Insights</div>
          </Card>
        </div>
      </div>
      </div>
    </section>
  );
};

export default Hero;