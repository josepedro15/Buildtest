import { Card } from "@/components/ui/card";
import { 
  BarChart3, 
  Brain, 
  Clock, 
  Target, 
  TrendingUp, 
  Users,
  MessageSquare,
  Settings
} from "lucide-react";

const Benefits = () => {
  const benefits = [
    {
      icon: BarChart3,
      title: "Análise Completa de Atendimentos",
      description: "Veja métricas detalhadas de conversão, abandono, tempo de resposta e qualidade do atendimento em tempo real."
    },
    {
      icon: Brain,
      title: "Inteligência Artificial Avançada",
      description: "IA identifica intenções dos clientes, analisa sentimentos e sugere melhorias automáticas no seu script."
    },
    {
      icon: Target,
      title: "Identificação de Oportunidades",
      description: "Descubra pontos de automação, leads inativos e mensagens que geram mais conversões."
    },
    {
      icon: TrendingUp,
      title: "Otimização de Performance",
      description: "Receba sugestões personalizadas para melhorar tempo de resposta e aumentar vendas."
    },
    {
      icon: Users,
      title: "Gestão de Equipe",
      description: "Compare performance entre atendentes e identifique melhores práticas para replicar."
    },
    {
      icon: Clock,
      title: "Automação Inteligente",
      description: "Sugestões de respostas automáticas e fluxos para reengajamento de clientes inativos."
    },
    {
      icon: MessageSquare,
      title: "Análise de Intenções",
      description: "Categorize automaticamente os tipos de contato: vendas, dúvidas, reclamações e suporte."
    },
    {
      icon: Settings,
      title: "Metas e Acompanhamento",
      description: "Defina objetivos de conversão e acompanhe o progresso da equipe em tempo real."
    }
  ];

  return (
    <section id="benefits" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Por que escolher o WhatsApp Analytics?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Transforme dados em resultados concretos com nossa plataforma completa 
            de análise e otimização de atendimentos.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <Card 
              key={index} 
              className={`p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group relative ${
                index < 3 ? 'border-primary/20 bg-primary/5' : ''
              }`}
            >
              {index < 3 && (
                <div className="absolute -top-2 -right-2 bg-primary text-white px-2 py-1 rounded-full text-xs font-medium">
                  {index === 0 ? 'Mais Popular' : index === 1 ? 'Essencial' : 'Recomendado'}
                </div>
              )}
              <div className="group-hover:scale-110 transition-transform duration-300 mb-4">
                <benefit.icon className={`h-10 w-10 ${index < 3 ? 'text-primary' : 'text-muted-foreground'}`} />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
                {benefit.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {benefit.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Benefits;