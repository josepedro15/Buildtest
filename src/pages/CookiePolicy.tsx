import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Cookie, Shield, BarChart3, Settings, Mail, Phone, Info, CheckCircle, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CookiePolicy() {
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
              <Cookie className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold text-foreground">Política de Cookies</h1>
                <p className="text-sm text-muted-foreground">
                  ConversaFlow Inc. - Como usamos cookies e tecnologias similares
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
              Resumo da Política de Cookies
            </CardTitle>
            <CardDescription>
              Informações essenciais sobre como usamos cookies em nossa plataforma
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-3 bg-primary/5 rounded-lg">
                <CheckCircle className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-semibold text-sm">Cookies Essenciais</p>
                  <p className="text-xs text-muted-foreground">Sempre ativos</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-primary/5 rounded-lg">
                <BarChart3 className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-semibold text-sm">Cookies de Analytics</p>
                  <p className="text-xs text-muted-foreground">Opcionais</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-primary/5 rounded-lg">
                <Settings className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-semibold text-sm">Cookies de Preferências</p>
                  <p className="text-xs text-muted-foreground">Opcionais</p>
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
              <CardTitle>1. O que são Cookies?</CardTitle>
              <CardDescription>
                Última atualização: {lastUpdated} | Data de vigência: {effectiveDate}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Cookies são pequenos arquivos de texto que são armazenados no seu dispositivo 
                (computador, tablet ou smartphone) quando você visita um site. Eles são amplamente 
                utilizados para fazer os sites funcionarem de forma mais eficiente e fornecer 
                informações aos proprietários do site.
              </p>
              <p>
                No <strong>ConversaFlow</strong>, utilizamos cookies e tecnologias similares para 
                melhorar sua experiência, analisar o uso da plataforma e personalizar conteúdo 
                e anúncios.
              </p>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">LGPD</Badge>
                <Badge variant="secondary">GDPR</Badge>
                <Badge variant="secondary">Consentimento</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Types of Cookies */}
          <Card>
            <CardHeader>
              <CardTitle>2. Tipos de Cookies que Utilizamos</CardTitle>
              <CardDescription>
                Categorias de cookies e suas finalidades específicas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Essential Cookies */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Shield className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold flex items-center gap-2">
                      Cookies Essenciais
                      <Badge variant="secondary" className="text-xs">Obrigatório</Badge>
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Necessários para o funcionamento básico do site e não podem ser desativados.
                    </p>
                  </div>
                </div>
                <div className="ml-11 space-y-2">
                  <h5 className="font-medium text-sm">Finalidades:</h5>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    <li>Autenticação e segurança da sessão</li>
                    <li>Preferências de idioma e região</li>
                    <li>Funcionalidades básicas da plataforma</li>
                    <li>Prevenção de fraudes e ataques</li>
                    <li>Carregamento de páginas e navegação</li>
                  </ul>
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-800">
                      <strong>Status:</strong> Sempre ativos - Essenciais para o funcionamento do site
                    </p>
                  </div>
                </div>
              </div>

              {/* Analytics Cookies */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <BarChart3 className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold flex items-center gap-2">
                      Cookies de Analytics
                      <Badge variant="outline" className="text-xs">Opcional</Badge>
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Nos ajudam a entender como você usa nossa plataforma para melhorar nossos serviços.
                    </p>
                  </div>
                </div>
                <div className="ml-11 space-y-2">
                  <h5 className="font-medium text-sm">Finalidades:</h5>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    <li>Análise de tráfego e uso da plataforma</li>
                    <li>Métricas de performance e velocidade</li>
                    <li>Identificação de problemas técnicos</li>
                    <li>Melhorias na experiência do usuário</li>
                    <li>Otimização de funcionalidades</li>
                  </ul>
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Status:</strong> Opcional - Você pode desativar a qualquer momento
                    </p>
                  </div>
                </div>
              </div>

              {/* Preference Cookies */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Settings className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold flex items-center gap-2">
                      Cookies de Preferências
                      <Badge variant="outline" className="text-xs">Opcional</Badge>
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Lembram suas configurações e personalizações para melhorar sua experiência.
                    </p>
                  </div>
                </div>
                <div className="ml-11 space-y-2">
                  <h5 className="font-medium text-sm">Finalidades:</h5>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    <li>Configurações de interface e tema</li>
                    <li>Preferências de idioma e moeda</li>
                    <li>Personalização de conteúdo</li>
                    <li>Lembrança de configurações de filtros</li>
                    <li>Preferências de notificações</li>
                  </ul>
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Status:</strong> Opcional - Você pode desativar a qualquer momento
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Third Party Cookies */}
          <Card>
            <CardHeader>
              <CardTitle>3. Cookies de Terceiros</CardTitle>
              <CardDescription>
                Serviços externos que podem definir cookies em nosso site
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Alguns cookies podem ser definidos por serviços de terceiros que utilizamos 
                para melhorar nossa plataforma:
              </p>
              
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">Google Analytics</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Utilizamos o Google Analytics para analisar o uso do site e melhorar nossos serviços.
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>Finalidade:</span>
                    <Badge variant="outline">Analytics</Badge>
                    <span>Duração:</span>
                    <Badge variant="outline">2 anos</Badge>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">Supabase</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Nossa plataforma de backend utiliza cookies para autenticação e sessão.
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>Finalidade:</span>
                    <Badge variant="secondary">Essencial</Badge>
                    <span>Duração:</span>
                    <Badge variant="outline">Sessão</Badge>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">Vercel</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Nossa plataforma de hospedagem utiliza cookies para performance e segurança.
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>Finalidade:</span>
                    <Badge variant="secondary">Essencial</Badge>
                    <span>Duração:</span>
                    <Badge variant="outline">1 ano</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cookie Management */}
          <Card>
            <CardHeader>
              <CardTitle>4. Gerenciamento de Cookies</CardTitle>
              <CardDescription>
                Como controlar e gerenciar suas preferências de cookies
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Configurações do Navegador</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Você pode controlar cookies através das configurações do seu navegador:
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• <strong>Chrome:</strong> Configurações &gt; Privacidade e Segurança &gt; Cookies</li>
                    <li>• <strong>Firefox:</strong> Opções &gt; Privacidade e Segurança &gt; Cookies</li>
                    <li>• <strong>Safari:</strong> Preferências &gt; Privacidade &gt; Cookies</li>
                    <li>• <strong>Edge:</strong> Configurações &gt; Cookies e Permissões</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3">Nossa Plataforma</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Em nossa plataforma, você pode:
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Acessar configurações de cookies no dashboard</li>
                    <li>• Ativar/desativar cookies opcionais</li>
                    <li>• Visualizar detalhes de cada tipo de cookie</li>
                    <li>• Excluir todos os cookies salvos</li>
                  </ul>
                </div>
              </div>

              <div className="p-4 bg-primary/5 rounded-lg">
                <div className="flex items-start gap-2">
                  <Info className="h-4 w-4 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm font-medium mb-1">Importante</p>
                    <p className="text-sm text-muted-foreground">
                      Desativar cookies essenciais pode afetar o funcionamento da plataforma. 
                      Cookies opcionais podem ser desativados sem impacto na funcionalidade básica.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Retention */}
          <Card>
            <CardHeader>
              <CardTitle>5. Retenção de Dados de Cookies</CardTitle>
              <CardDescription>
                Por quanto tempo mantemos os dados coletados por cookies
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-primary/5 rounded-lg">
                  <h4 className="font-semibold mb-2">Cookies de Sessão</h4>
                  <p className="text-sm text-muted-foreground">
                    Excluídos automaticamente quando você fecha o navegador
                  </p>
                </div>
                
                <div className="p-4 bg-primary/5 rounded-lg">
                  <h4 className="font-semibold mb-2">Cookies Persistentes</h4>
                  <p className="text-sm text-muted-foreground">
                    Mantidos por até 2 anos ou até você excluí-los
                  </p>
                </div>
                
                <div className="p-4 bg-primary/5 rounded-lg">
                  <h4 className="font-semibold mb-2">Dados de Analytics</h4>
                  <p className="text-sm text-muted-foreground">
                    Anonimizados e mantidos por até 26 meses
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Legal Basis */}
          <Card>
            <CardHeader>
              <CardTitle>6. Base Legal para Uso de Cookies</CardTitle>
              <CardDescription>
                Fundamentos legais para o processamento de dados via cookies
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold mb-2">6.1 Cookies Essenciais</h4>
                  <p className="text-sm text-muted-foreground">
                    <strong>Base Legal:</strong> Interesse legítimo - Necessários para o funcionamento 
                    do site e prestação dos serviços contratados.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">6.2 Cookies de Analytics</h4>
                  <p className="text-sm text-muted-foreground">
                    <strong>Base Legal:</strong> Consentimento - Você pode aceitar ou recusar 
                    através de nossas configurações de cookies.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">6.3 Cookies de Preferências</h4>
                  <p className="text-sm text-muted-foreground">
                    <strong>Base Legal:</strong> Consentimento - Você pode aceitar ou recusar 
                    através de nossas configurações de cookies.
                  </p>
                </div>
              </div>

              <div className="p-4 bg-primary/5 rounded-lg">
                <p className="text-sm">
                  <strong>Conformidade:</strong> Nossa política de cookies está em conformidade 
                  com a LGPD (Lei Geral de Proteção de Dados) e GDPR (Regulamento Geral de Proteção de Dados).
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Updates */}
          <Card>
            <CardHeader>
              <CardTitle>7. Atualizações desta Política</CardTitle>
              <CardDescription>
                Como notificamos mudanças na política de cookies
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Podemos atualizar esta Política de Cookies periodicamente para refletir mudanças 
                em nossas práticas ou por outros motivos operacionais, legais ou regulamentares.
              </p>
              
              <p>
                Quando fizermos mudanças significativas, notificaremos você através de:
              </p>
              
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• E-mail para o endereço registrado</li>
                <li>• Notificação na plataforma</li>
                <li>• Atualização da data "Última atualização"</li>
                <li>• Banner de notificação no site</li>
              </ul>
              
              <p className="text-sm">
                <strong>Última atualização:</strong> {lastUpdated}
              </p>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>8. Entre em Contato</CardTitle>
              <CardDescription>
                Como nos contatar sobre questões relacionadas a cookies
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
              Esta política de cookies é parte integrante da nossa Política de Privacidade.
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
