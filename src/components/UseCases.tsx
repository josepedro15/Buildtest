import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ShoppingCart, 
  HeadphonesIcon, 
  Building2, 
  Stethoscope,
  GraduationCap,
  Home,
  CheckCircle,
  TrendingUp
} from "lucide-react";

const UseCases = () => {
  const cases = [
    {
      icon: ShoppingCart,
      title: "E-commerce & Varejo",
      description: "Analise jornadas de compra, identifique objeções frequentes e otimize o funil de vendas.",
      metrics: [
        "Conversão de carrinho abandonado",
        "Tempo médio até fechamento",
        "Principais objeções de preço"
      ],
      color: "text-chart-green",
      bgColor: "bg-chart-green/10"
    },
    {
      icon: HeadphonesIcon,
      title: "Atendimento ao Cliente",
      description: "Melhore a satisfação identificando problemas recorrentes e automatizando respostas.",
      metrics: [
        "Tempo de resolução",
        "Taxa de satisfação",
        "Casos mais frequentes"
      ],
      color: "text-chart-blue",
      bgColor: "bg-chart-blue/10"
    },
    {
      icon: Building2,
      title: "B2B & Corporativo",
      description: "Qualifique leads, acompanhe ciclos de venda longos e identifique decisores.",
      metrics: [
        "Qualificação de leads",
        "Ciclo de vendas médio", 
        "Taxa de conversão B2B"
      ],
      color: "text-chart-purple",
      bgColor: "bg-chart-purple/10"
    },
    {
      icon: Stethoscope,
      title: "Saúde & Bem-estar",
      description: "Gerencie agendamentos, acompanhe sintomas e melhore a comunicação médico-paciente.",
      metrics: [
        "Taxa de agendamentos",
        "Adesão a tratamentos",
        "Satisfação dos pacientes"
      ],
      color: "text-chart-red",
      bgColor: "bg-chart-red/10"
    },
    {
      icon: GraduationCap,
      title: "Educação & Cursos",
      description: "Aumente matrículas, identifique dúvidas frequentes e melhore o suporte acadêmico.",
      metrics: [
        "Conversão de matrículas",
        "Dúvidas mais comuns",
        "Retenção de alunos"
      ],
      color: "text-chart-orange",
      bgColor: "bg-chart-orange/10"
    },
    {
      icon: Home,
      title: "Imobiliário",
      description: "Qualifique interessados, agende visitas e acompanhe negociações imobiliárias.",
      metrics: [
        "Visitas agendadas",
        "Tempo de negociação",
        "Taxa de fechamento"
      ],
      color: "text-primary",
      bgColor: "bg-primary/10"
    }
  ];

  return (
    <section id="cases" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Casos de uso por segmento
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Veja como diferentes setores estão usando WhatsApp Analytics 
            para melhorar resultados e otimizar atendimentos.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cases.map((useCase, index) => (
            <Card key={index} className="p-6 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group cursor-pointer">
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${useCase.bgColor} mb-4`}>
                <useCase.icon className={`h-6 w-6 ${useCase.color}`} />
              </div>
              
              <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
                {useCase.title}
              </h3>
              
              <p className="text-muted-foreground mb-6 leading-relaxed">
                {useCase.description}
              </p>

              <div className="space-y-2">
                <h4 className="text-sm font-medium text-foreground mb-3">
                  Principais métricas:
                </h4>
                {useCase.metrics.map((metric, metricIndex) => (
                  <Badge 
                    key={metricIndex} 
                    variant="secondary" 
                    className="text-xs mr-2 mb-2"
                  >
                    {metric}
                  </Badge>
                ))}
              </div>

              {/* Resultado Real */}
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle className="h-3 w-3 text-green-600" />
                  <span className="text-xs font-semibold text-green-800">Resultado Real</span>
                </div>
                <p className="text-xs text-green-700">
                  {index === 0 && "Cliente aumentou conversão em 45% em 30 dias"}
                  {index === 1 && "Redução de 60% no tempo de resolução"}
                  {index === 2 && "Qualificação de leads melhorou 80%"}
                  {index === 3 && "Taxa de agendamentos aumentou 70%"}
                  {index === 4 && "Matrículas cresceram 55% no primeiro mês"}
                  {index === 5 && "Fechamento de vendas aumentou 40%"}
                </p>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="bg-accent/20 rounded-lg p-8 max-w-3xl mx-auto">
            <h3 className="text-xl font-semibold text-foreground mb-4">
              Seu segmento não está na lista?
            </h3>
            <p className="text-muted-foreground mb-6">
              O WhatsApp Analytics funciona para qualquer negócio que use WhatsApp. 
              Fale conosco e descubra como adaptar para sua realidade.
            </p>
            <button className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors">
              Falar com Especialista
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UseCases;