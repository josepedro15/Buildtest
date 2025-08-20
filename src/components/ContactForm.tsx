import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useContactMessages, CreateContactMessageData } from "@/hooks/useContactMessages";
import { WHATSAPP_CONTACT } from "@/lib/utils";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock,
  Send,
  CheckCircle,
  Shield,
  Star,
  MessageCircle
} from "lucide-react";

const ContactForm = () => {
  const [formData, setFormData] = useState<CreateContactMessageData>({
    name: "",
    email: "",
    company: "",
    phone: "",
    message: ""
  });
  const { toast } = useToast();
  const { createMessage, isCreatingMessage } = useContactMessages();

  const handleWhatsAppContact = () => {
    window.open(WHATSAPP_CONTACT.link, '_blank');
    toast({
      title: "Redirecionando para WhatsApp",
      description: "Você será direcionado para conversar com nosso especialista.",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Iniciando envio do formulário:', formData);
    
    // Validar campos obrigatórios
    if (!formData.name.trim() || !formData.email.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Nome e email são obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Email inválido",
        description: "Por favor, insira um email válido.",
        variant: "destructive"
      });
      return;
    }

    console.log('Dados validados, enviando mensagem...');

    // Enviar mensagem
    createMessage(formData, {
      onSuccess: () => {
        console.log('Mensagem enviada com sucesso!');
        // Limpar formulário após sucesso
        setFormData({
          name: "",
          email: "",
          company: "",
          phone: "",
          message: ""
        });
      },
      onError: (error) => {
        console.error('Erro ao enviar mensagem:', error);
      }
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <section id="contact" className="py-20 bg-accent/10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Pronto para começar?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Fale conosco e descubra como o WhatsApp Analytics pode transformar 
            seus atendimentos em resultados extraordinários.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Form - Agora com foco no WhatsApp */}
          <Card className="p-8">
            {/* Trust Indicators */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-4 w-4 text-blue-600" />
                <span className="font-semibold text-blue-800">100% Seguro</span>
              </div>
              <p className="text-sm text-blue-700">
                Seus dados são protegidos e nunca serão compartilhados
              </p>
            </div>

            {/* WhatsApp Contact Button - Principal */}
            <div className="mb-6">
              <Button
                onClick={handleWhatsAppContact}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4 text-lg"
                size="lg"
              >
                <MessageCircle className="h-5 w-5 mr-2" />
                Falar com Especialista no WhatsApp
              </Button>
              <p className="text-sm text-muted-foreground text-center mt-2">
                Resposta imediata via WhatsApp
              </p>
            </div>

            {/* Alternative Contact Form */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">Ou envie uma mensagem</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Nome completo *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="mt-2"
                    placeholder="Seu nome"
                  />
                </div>
                
                <div>
                  <Label htmlFor="email">E-mail *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="mt-2"
                    placeholder="seu@email.com"
                  />
                </div>

                <div>
                  <Label htmlFor="company">Empresa</Label>
                  <Input
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="mt-2"
                    placeholder="Nome da empresa"
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="mt-2"
                    placeholder="(11) 99999-9999"
                  />
                </div>

                <div>
                  <Label htmlFor="message">Mensagem</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    className="mt-2"
                    placeholder="Conte-nos sobre sua empresa e como podemos ajudar..."
                    rows={4}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={isCreatingMessage}
                  variant="outline"
                >
                  {isCreatingMessage ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Enviar Mensagem
                    </>
                  )}
                </Button>
              </form>
            </div>
          </Card>

          {/* Contact Info */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-semibold text-foreground mb-6">
                Entre em contato
              </h3>
              <p className="text-muted-foreground mb-8">
                Nossa equipe está pronta para ajudar você a implementar a solução 
                perfeita para seu negócio. Resposta garantida em 24 horas.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-green-100 p-3 rounded-lg">
                  <MessageCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">WhatsApp</h4>
                  <p className="text-muted-foreground">{WHATSAPP_CONTACT.phone}</p>
                  <p className="text-sm text-green-600 font-medium">Resposta imediata</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-lg">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">E-mail</h4>
                  <p className="text-muted-foreground">contato@metricawhats.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-lg">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Horário de atendimento</h4>
                  <p className="text-muted-foreground">Segunda a sexta, 9h às 18h</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-lg">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Localização</h4>
                  <p className="text-muted-foreground">São Paulo, SP - Brasil</p>
                </div>
              </div>
            </div>

            <Card className="p-6 bg-green-50 border-green-200">
              <div className="flex items-center gap-3 mb-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <h4 className="font-semibold text-foreground">Resposta Garantida</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Comprometemo-nos a responder todas as mensagens em até 24 horas, 
                incluindo finais de semana e feriados.
              </p>
            </Card>

            {/* Testimonial */}
            <Card className="p-6 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-r from-primary to-primary/80 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold">M</span>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-1 mb-2">
                    {[1,2,3,4,5].map(i => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    "Implementamos o WhatsApp Analytics e em 30 dias nossa conversão aumentou 45%. 
                    A equipe é incrível e o suporte é excepcional!"
                  </p>
                  <p className="text-xs font-semibold text-foreground">
                    Maria Silva, CEO - Fashion Store
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;