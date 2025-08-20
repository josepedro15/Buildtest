import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileText, Shield, Users, Globe, Mail, Phone, AlertTriangle, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function TermsOfService() {
  const navigate = useNavigate();

  const lastUpdated = "15 de Janeiro de 2025";
  const effectiveDate = "15 de Janeiro de 2025";

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Button>
            <div className="flex items-center gap-3">
              <FileText className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold text-foreground">Termos de Uso</h1>
                <p className="text-sm text-muted-foreground">
                  ConversaFlow Inc. - Condições de uso da plataforma
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Summary Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Resumo dos Termos
            </CardTitle>
            <CardDescription>
              Informações essenciais sobre o uso da plataforma ConversaFlow
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-3 bg-primary/5 rounded-lg">
                <CheckCircle className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-semibold text-sm">Uso Responsável</p>
                  <p className="text-xs text-muted-foreground">Conformidade com leis</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-primary/5 rounded-lg">
                <Users className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-semibold text-sm">Propriedade Intelectual</p>
                  <p className="text-xs text-muted-foreground">Direitos protegidos</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-primary/5 rounded-lg">
                <Globe className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-semibold text-sm">Jurisdição</p>
                  <p className="text-xs text-muted-foreground">Leis brasileiras</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="space-y-8">
          {/* Introduction */}
          <Card>
            <CardHeader>
              <CardTitle>1. Aceitação dos Termos</CardTitle>
              <CardDescription>
                Última atualização: {lastUpdated} | Data de vigência: {effectiveDate}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Bem-vindo ao <strong>ConversaFlow</strong>, uma plataforma de análise de conversas do WhatsApp 
                desenvolvida pela <strong>ConversaFlow Inc.</strong> ("nós", "nosso", "ConversaFlow").
              </p>
              <p>
                Ao acessar ou usar nossos serviços, você concorda em cumprir e estar vinculado a estes 
                Termos de Uso ("Termos"). Se você não concordar com qualquer parte destes termos, 
                não poderá acessar ou usar nossos serviços.
              </p>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Lei Brasileira</Badge>
                <Badge variant="secondary">Jurisdição Nacional</Badge>
                <Badge variant="secondary">Contrato Eletrônico</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Service Description */}
          <Card>
            <CardHeader>
              <CardTitle>2. Descrição dos Serviços</CardTitle>
              <CardDescription>
                O que oferecemos e como funciona nossa plataforma
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                O ConversaFlow é uma plataforma de inteligência artificial que oferece:
              </p>
              <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                <li>Análise automatizada de conversas do WhatsApp</li>
                <li>Geração de insights e relatórios de performance</li>
                <li>Otimização de atendimento e vendas</li>
                <li>Métricas de engajamento e satisfação</li>
                <li>Recomendações de melhoria baseadas em IA</li>
                <li>Integração com APIs do WhatsApp Business</li>
              </ul>
              <div className="p-4 bg-primary/5 rounded-lg">
                <p className="text-sm">
                  <strong>Importante:</strong> Nossos serviços são destinados exclusivamente para uso 
                  comercial legítimo e em conformidade com as políticas do WhatsApp Business.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* User Accounts */}
          <Card>
            <CardHeader>
              <CardTitle>3. Contas de Usuário</CardTitle>
              <CardDescription>
                Responsabilidades e obrigações dos usuários
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">3.1 Criação de Conta</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Você deve fornecer informações verdadeiras e precisas</li>
                  <li>É responsável pela confidencialidade de suas credenciais</li>
                  <li>Deve notificar imediatamente sobre uso não autorizado</li>
                  <li>Uma conta por pessoa física ou jurídica</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">3.2 Uso Adequado</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Usar apenas para fins legítimos e autorizados</li>
                  <li>Não compartilhar acesso com terceiros</li>
                  <li>Respeitar direitos de propriedade intelectual</li>
                  <li>Não usar para atividades ilegais ou prejudiciais</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">3.3 Suspensão e Cancelamento</h4>
                <p className="text-sm text-muted-foreground">
                  Reservamo-nos o direito de suspender ou cancelar contas que violem estes termos, 
                  sem aviso prévio e sem reembolso.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Acceptable Use */}
          <Card>
            <CardHeader>
              <CardTitle>4. Uso Aceitável</CardTitle>
              <CardDescription>
                O que é permitido e proibido em nossa plataforma
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2 text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    Uso Permitido
                  </h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Análise de conversas próprias</li>
                    <li>• Melhoria de atendimento ao cliente</li>
                    <li>• Otimização de processos de vendas</li>
                    <li>• Geração de relatórios internos</li>
                    <li>• Uso em conformidade com LGPD</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2 text-red-600">
                    <AlertTriangle className="h-4 w-4" />
                    Uso Proibido
                  </h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Análise de conversas de terceiros</li>
                    <li>• Spam ou mensagens não solicitadas</li>
                    <li>• Violação de direitos autorais</li>
                    <li>• Atividades ilegais ou fraudulentas</li>
                    <li>• Compartilhamento não autorizado</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Privacy and Data */}
          <Card>
            <CardHeader>
              <CardTitle>5. Privacidade e Dados</CardTitle>
              <CardDescription>
                Como tratamos seus dados e informações
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Sua privacidade é importante para nós. O uso de nossos serviços está sujeito à nossa 
                <a href="/privacy-policy" className="text-primary hover:underline"> Política de Privacidade</a>, 
                que é incorporada a estes Termos por referência.
              </p>
              
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold">5.1 Dados do Usuário</h4>
                  <p className="text-sm text-muted-foreground">
                    Você mantém a propriedade de seus dados. Nós processamos apenas com seu consentimento 
                    e para fornecer nossos serviços.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold">5.2 Conformidade Legal</h4>
                  <p className="text-sm text-muted-foreground">
                    Nos comprometemos a cumprir a LGPD e outras leis de proteção de dados aplicáveis.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold">5.3 Segurança</h4>
                  <p className="text-sm text-muted-foreground">
                    Implementamos medidas de segurança adequadas para proteger seus dados contra 
                    acesso não autorizado, alteração ou destruição.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Intellectual Property */}
          <Card>
            <CardHeader>
              <CardTitle>6. Propriedade Intelectual</CardTitle>
              <CardDescription>
                Direitos sobre o conteúdo e tecnologia
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">6.1 Nossos Direitos</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  O ConversaFlow, incluindo seu software, design, conteúdo e funcionalidades, 
                  é protegido por direitos autorais, marcas registradas e outras leis de propriedade intelectual.
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Software e algoritmos proprietários</li>
                  <li>Interface e design da plataforma</li>
                  <li>Marca ConversaFlow e logotipos</li>
                  <li>Documentação e materiais de suporte</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">6.2 Seus Direitos</h4>
                <p className="text-sm text-muted-foreground">
                  Você mantém todos os direitos sobre seus dados e conteúdo. Concedemos a você 
                  uma licença limitada para usar nossos serviços conforme estes Termos.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">6.3 Feedback</h4>
                <p className="text-sm text-muted-foreground">
                  Qualquer feedback, sugestão ou ideia que você fornecer pode ser usado por nós 
                  para melhorar nossos serviços, sem obrigação de compensação.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Payment Terms */}
          <Card>
            <CardHeader>
              <CardTitle>7. Termos de Pagamento</CardTitle>
              <CardDescription>
                Informações sobre preços, cobrança e reembolsos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">7.1 Preços e Cobrança</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Preços são exibidos em Reais (BRL)</li>
                  <li>Cobrança automática no início de cada período</li>
                  <li>Taxas podem ser alteradas com aviso prévio de 30 dias</li>
                  <li>Impostos aplicáveis são de responsabilidade do cliente</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">7.2 Cancelamento</h4>
                <p className="text-sm text-muted-foreground">
                  Você pode cancelar sua assinatura a qualquer momento. O acesso será mantido 
                  até o final do período pago.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">7.3 Reembolsos</h4>
                <p className="text-sm text-muted-foreground">
                  Reembolsos são avaliados caso a caso. Não há reembolso por cancelamento 
                  no meio do período, exceto em casos de falha técnica nossa.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Disclaimers */}
          <Card>
            <CardHeader>
              <CardTitle>8. Limitações e Isenções</CardTitle>
              <CardDescription>
                Limitações de responsabilidade e garantias
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">8.1 Disponibilidade do Serviço</h4>
                <p className="text-sm text-muted-foreground">
                  Nos esforçamos para manter nossos serviços disponíveis 24/7, mas não garantimos 
                  disponibilidade ininterrupta. Manutenções programadas podem ocorrer.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">8.2 Limitação de Responsabilidade</h4>
                <p className="text-sm text-muted-foreground">
                  Nossa responsabilidade é limitada ao valor pago pelos serviços nos últimos 12 meses. 
                  Não somos responsáveis por danos indiretos, incidentais ou consequenciais.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">8.3 Garantias</h4>
                <p className="text-sm text-muted-foreground">
                  Os serviços são fornecidos "como estão" e "conforme disponível". 
                  Não oferecemos garantias expressas ou implícitas.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Termination */}
          <Card>
            <CardHeader>
              <CardTitle>9. Rescisão</CardTitle>
              <CardDescription>
                Como e quando o contrato pode ser encerrado
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">9.1 Rescisão pelo Usuário</h4>
                <p className="text-sm text-muted-foreground">
                  Você pode encerrar sua conta a qualquer momento através do painel de controle 
                  ou entrando em contato conosco.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">9.2 Rescisão por Nós</h4>
                <p className="text-sm text-muted-foreground">
                  Podemos encerrar ou suspender sua conta imediatamente se você violar estes Termos, 
                  sem aviso prévio.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">9.3 Efeitos da Rescisão</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Acesso aos serviços será imediatamente encerrado</li>
                  <li>Dados serão excluídos conforme nossa política de retenção</li>
                  <li>Não há reembolso por períodos não utilizados</li>
                  <li>Disposições sobre propriedade intelectual permanecem válidas</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Governing Law */}
          <Card>
            <CardHeader>
              <CardTitle>10. Lei Aplicável e Jurisdição</CardTitle>
              <CardDescription>
                Qual lei se aplica e onde resolver disputas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Estes Termos são regidos pelas leis da República Federativa do Brasil. 
                Qualquer disputa será resolvida nos tribunais da comarca de São Paulo, SP.
              </p>
              
              <div className="p-4 bg-primary/5 rounded-lg">
                <p className="text-sm">
                  <strong>Resolução de Disputas:</strong> Antes de buscar medidas judiciais, 
                  nos comprometemos a tentar resolver disputas através de negociação direta 
                  e mediação, quando apropriado.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Changes to Terms */}
          <Card>
            <CardHeader>
              <CardTitle>11. Alterações nos Termos</CardTitle>
              <CardDescription>
                Como notificamos mudanças nos termos de uso
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Podemos atualizar estes Termos periodicamente. Notificaremos você sobre 
                mudanças significativas através de:
              </p>
              
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• E-mail para o endereço registrado</li>
                <li>• Notificação na plataforma</li>
                <li>• Atualização da data "Última atualização"</li>
              </ul>
              
              <p className="text-sm">
                <strong>Última atualização:</strong> {lastUpdated}
              </p>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>12. Entre em Contato</CardTitle>
              <CardDescription>
                Como nos contatar sobre questões legais
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Mail className="h-4 w-4 text-primary" />
                    E-mail
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    <strong>Legal:</strong> legal@conversaflow.com<br />
                    <strong>Suporte:</strong> support@conversaflow.com<br />
                    <strong>Comercial:</strong> sales@conversaflow.com
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Phone className="h-4 w-4 text-primary" />
                    Telefone
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    <strong>Brasil:</strong> +55 31 99495-9512<br />
                    <strong>Horário:</strong> Seg-Sex, 9h-18h (GMT-3)
                  </p>
                </div>
              </div>
              
              <div className="p-4 bg-primary/5 rounded-lg">
                <h4 className="font-semibold mb-2">Endereço</h4>
                <p className="text-sm text-muted-foreground">
                  <strong>ConversaFlow Inc.</strong><br />
                  Av. Paulista, 1000 - Bela Vista<br />
                  São Paulo - SP, 01310-100<br />
                  Brasil
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t">
          <div className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              Estes termos de uso são parte integrante do contrato entre você e a ConversaFlow Inc.
            </p>
            <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
              <span>© 2025 ConversaFlow Inc.</span>
              <span>•</span>
              <span>Todos os direitos reservados</span>
              <span>•</span>
              <span>Versão 1.0</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
