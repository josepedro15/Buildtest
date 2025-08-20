import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Shield, Eye, Lock, Users, Database, Globe, Mail, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function PrivacyPolicy() {
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
              <Shield className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold text-foreground">Política de Privacidade</h1>
                <p className="text-sm text-muted-foreground">
                  ConversaFlow Inc. - Protegendo seus dados
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
              <Eye className="h-5 w-5 text-primary" />
              Resumo Executivo
            </CardTitle>
            <CardDescription>
              Informações essenciais sobre como protegemos seus dados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-3 bg-primary/5 rounded-lg">
                <Lock className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-semibold text-sm">Dados Protegidos</p>
                  <p className="text-xs text-muted-foreground">Criptografia de ponta</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-primary/5 rounded-lg">
                <Users className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-semibold text-sm">Controle Total</p>
                  <p className="text-xs text-muted-foreground">Você decide o que compartilhar</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-primary/5 rounded-lg">
                <Database className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-semibold text-sm">Conformidade</p>
                  <p className="text-xs text-muted-foreground">LGPD e GDPR</p>
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
              <CardTitle>1. Introdução</CardTitle>
              <CardDescription>
                Última atualização: {lastUpdated} | Data de vigência: {effectiveDate}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                A <strong>ConversaFlow Inc.</strong> ("nós", "nosso", "ConversaFlow") está comprometida em proteger 
                sua privacidade e dados pessoais. Esta Política de Privacidade explica como coletamos, usamos, 
                armazenamos e protegemos suas informações quando você utiliza nossa plataforma de análise de 
                conversas do WhatsApp.
              </p>
              <p>
                Ao usar nossos serviços, você concorda com a coleta e uso de informações de acordo com esta política. 
                Seus dados pessoais são usados apenas para fornecer e melhorar nossos serviços.
              </p>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">LGPD</Badge>
                <Badge variant="secondary">GDPR</Badge>
                <Badge variant="secondary">ISO 27001</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Information We Collect */}
          <Card>
            <CardHeader>
              <CardTitle>2. Informações que Coletamos</CardTitle>
              <CardDescription>
                Tipos de dados que coletamos para fornecer nossos serviços
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-semibold mb-2">2.1 Informações de Conta</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Nome completo e informações de contato</li>
                  <li>Endereço de e-mail e número de telefone</li>
                  <li>Informações da empresa (quando aplicável)</li>
                  <li>Credenciais de login e autenticação</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">2.2 Dados de Conversas do WhatsApp</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Mensagens e conversas analisadas (apenas com sua permissão)</li>
                  <li>Metadados de conversas (horários, duração, participantes)</li>
                  <li>Análises de sentimento e intenção</li>
                  <li>Métricas de performance e engajamento</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">2.3 Dados de Uso</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Logs de acesso e atividade na plataforma</li>
                  <li>Preferências e configurações do usuário</li>
                  <li>Dados de performance e analytics</li>
                  <li>Informações técnicas (IP, navegador, dispositivo)</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* How We Use Information */}
          <Card>
            <CardHeader>
              <CardTitle>3. Como Usamos Suas Informações</CardTitle>
              <CardDescription>
                Propósitos para os quais utilizamos seus dados
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-primary/5 rounded-lg">
                  <h4 className="font-semibold mb-2">Serviços Principais</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Análise de conversas do WhatsApp</li>
                    <li>• Geração de insights e relatórios</li>
                    <li>• Otimização de atendimento</li>
                    <li>• Melhoria de performance</li>
                  </ul>
                </div>
                <div className="p-4 bg-primary/5 rounded-lg">
                  <h4 className="font-semibold mb-2">Melhorias e Desenvolvimento</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Aprimoramento da IA</li>
                    <li>• Desenvolvimento de novos recursos</li>
                    <li>• Correção de bugs e problemas</li>
                    <li>• Pesquisa e inovação</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Sharing */}
          <Card>
            <CardHeader>
              <CardTitle>4. Compartilhamento de Dados</CardTitle>
              <CardDescription>
                Quando e como compartilhamos suas informações
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                <strong>Não vendemos, alugamos ou comercializamos seus dados pessoais.</strong> 
                Compartilhamos informações apenas nas seguintes situações:
              </p>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold">Prestadores de Serviços</h4>
                    <p className="text-sm text-muted-foreground">
                      Parceiros confiáveis que nos ajudam a fornecer nossos serviços 
                      (hospedagem, análise, suporte)
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold">Conformidade Legal</h4>
                    <p className="text-sm text-muted-foreground">
                      Quando exigido por lei, ordem judicial ou autoridade governamental
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold">Proteção de Direitos</h4>
                    <p className="text-sm text-muted-foreground">
                      Para proteger nossos direitos, propriedade ou segurança
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Security */}
          <Card>
            <CardHeader>
              <CardTitle>5. Segurança dos Dados</CardTitle>
              <CardDescription>
                Como protegemos suas informações
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Lock className="h-4 w-4 text-primary" />
                    Medidas de Segurança
                  </h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Criptografia AES-256 para dados em repouso</li>
                    <li>• Criptografia TLS 1.3 para dados em trânsito</li>
                    <li>• Autenticação de dois fatores (2FA)</li>
                    <li>• Monitoramento 24/7 de segurança</li>
                    <li>• Backups automáticos e redundantes</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Shield className="h-4 w-4 text-primary" />
                    Conformidade
                  </h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Conformidade com LGPD (Brasil)</li>
                    <li>• Conformidade com GDPR (Europa)</li>
                    <li>• Certificação ISO 27001</li>
                    <li>• Auditorias regulares de segurança</li>
                    <li>• Política de acesso mínimo</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Your Rights */}
          <Card>
            <CardHeader>
              <CardTitle>6. Seus Direitos</CardTitle>
              <CardDescription>
                Direitos que você tem sobre seus dados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold">Direitos de Acesso</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Acessar seus dados pessoais</li>
                    <li>• Solicitar cópia dos dados</li>
                    <li>• Verificar como usamos seus dados</li>
                    <li>• Obter informações sobre terceiros</li>
                  </ul>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-semibold">Direitos de Controle</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Corrigir dados incorretos</li>
                    <li>• Excluir seus dados</li>
                    <li>• Limitar o processamento</li>
                    <li>• Portabilidade dos dados</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Retention */}
          <Card>
            <CardHeader>
              <CardTitle>7. Retenção de Dados</CardTitle>
              <CardDescription>
                Por quanto tempo mantemos suas informações
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-primary/5 rounded-lg">
                  <h4 className="font-semibold mb-2">Dados de Conta</h4>
                  <p className="text-sm text-muted-foreground">
                    Mantidos enquanto sua conta estiver ativa + 2 anos após cancelamento
                  </p>
                </div>
                
                <div className="p-4 bg-primary/5 rounded-lg">
                  <h4 className="font-semibold mb-2">Dados de Conversas</h4>
                  <p className="text-sm text-muted-foreground">
                    Mantidos por 12 meses ou até você solicitar exclusão
                  </p>
                </div>
                
                <div className="p-4 bg-primary/5 rounded-lg">
                  <h4 className="font-semibold mb-2">Logs de Sistema</h4>
                  <p className="text-sm text-muted-foreground">
                    Mantidos por 90 dias para segurança e auditoria
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cookies */}
          <Card>
            <CardHeader>
              <CardTitle>8. Cookies e Tecnologias Similares</CardTitle>
              <CardDescription>
                Como usamos cookies e tecnologias de rastreamento
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Utilizamos cookies e tecnologias similares para melhorar sua experiência, 
                analisar o uso do site e personalizar conteúdo.
              </p>
              
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold">Cookies Essenciais</h4>
                  <p className="text-sm text-muted-foreground">
                    Necessários para o funcionamento básico do site (autenticação, segurança)
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold">Cookies de Analytics</h4>
                  <p className="text-sm text-muted-foreground">
                    Nos ajudam a entender como você usa nossa plataforma
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold">Cookies de Preferências</h4>
                  <p className="text-sm text-muted-foreground">
                    Lembram suas configurações e preferências
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* International Transfers */}
          <Card>
            <CardHeader>
              <CardTitle>9. Transferências Internacionais</CardTitle>
              <CardDescription>
                Como tratamos dados transferidos internacionalmente
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Seus dados podem ser processados em países diferentes do seu. 
                Garantimos que todas as transferências seguem padrões adequados de proteção:
              </p>
              
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Acordos de proteção de dados adequados</li>
                <li>• Certificações de conformidade internacional</li>
                <li>• Medidas de segurança equivalentes</li>
                <li>• Supervisão regulatória apropriada</li>
              </ul>
            </CardContent>
          </Card>

          {/* Children's Privacy */}
          <Card>
            <CardHeader>
              <CardTitle>10. Privacidade de Menores</CardTitle>
              <CardDescription>
                Como tratamos dados de menores de idade
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                Nossos serviços não são destinados a menores de 18 anos. Não coletamos 
                intencionalmente dados pessoais de menores. Se você é pai/responsável e 
                acredita que seu filho nos forneceu dados, entre em contato conosco.
              </p>
            </CardContent>
          </Card>

          {/* Changes to Policy */}
          <Card>
            <CardHeader>
              <CardTitle>11. Alterações nesta Política</CardTitle>
              <CardDescription>
                Como notificamos mudanças na política de privacidade
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Podemos atualizar esta Política de Privacidade periodicamente. 
                Notificaremos você sobre mudanças significativas através de:
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
                Como nos contatar sobre questões de privacidade
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
                    <strong>Privacidade:</strong> privacy@conversaflow.com<br />
                    <strong>Suporte:</strong> support@conversaflow.com<br />
                    <strong>Legal:</strong> legal@conversaflow.com
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
              Esta política de privacidade é parte dos Termos de Serviço da ConversaFlow Inc.
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
