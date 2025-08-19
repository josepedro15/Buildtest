# MetricaWhats - Analytics para WhatsApp

Uma plataforma completa de analytics para WhatsApp que transforma conversas em insights poderosos para otimização de vendas e automação inteligente.

## 🚀 Funcionalidades

- **📊 Dashboard Analytics**: Métricas em tempo real de atendimentos
- **🤖 Conexão WhatsApp**: Integração via API Evolution
- **📈 Relatórios Exportáveis**: CSV, Excel e PDF
- **👥 Sistema de Usuários**: Autenticação e autorização
- **🔧 Painel Admin**: Gerenciamento de instâncias
- **📱 Interface Responsiva**: Design moderno e intuitivo

## 🛠️ Tecnologias

- **Frontend**: React 18, TypeScript, Vite
- **UI**: Tailwind CSS, Radix UI, shadcn/ui
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **Estado**: TanStack Query, Context API
- **Validação**: Zod
- **Testes**: Vitest, Testing Library

## 📁 Estrutura do Projeto

```
src/
├── components/
│   ├── ui/                    # Componentes base (shadcn/ui)
│   ├── features/              # Componentes específicos
│   │   └── whatsapp/          # Componentes do WhatsApp
│   └── layout/                # Header, Footer, etc.
├── hooks/
│   ├── features/              # Hooks específicos
│   └── ui/                    # Hooks de UI
├── pages/                     # Páginas da aplicação
├── integrations/              # Integrações externas
│   └── supabase/              # Cliente Supabase
├── lib/                       # Utilitários
├── contexts/                  # Contextos React
└── test/                      # Configuração de testes

database/
├── migrations/                # Migrações do banco
├── functions/                 # Funções SQL
├── policies/                  # Políticas RLS
├── seeds/                     # Dados iniciais
└── supabase/                  # Configuração Supabase

docs/                          # Documentação
```

## 🚀 Instalação

1. **Clone o repositório**
```bash
git clone https://github.com/seu-usuario/metricawhats.git
cd metricawhats
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**
```bash
cp env.example .env.local
```

4. **Configure o Supabase**
- Crie um projeto no [Supabase](https://supabase.com)
- Execute as migrações em `database/supabase/migrations/`
- Configure as políticas em `database/policies/`

5. **Execute a aplicação**
```bash
npm run dev
```

## 📊 Configuração do Banco

### Migrações
```bash
# Execute as migrações
supabase db push
```

### Políticas RLS
```bash
# Aplique as políticas de segurança
psql -h seu-host -U seu-usuario -d seu-banco -f database/policies/admin_policies.sql
```

### Funções Admin
```bash
# Instale as funções administrativas
psql -h seu-host -U seu-usuario -d seu-banco -f database/functions/admin_functions.sql
```

## 🔧 Scripts Disponíveis

```bash
npm run dev          # Desenvolvimento
npm run build        # Build de produção
npm run preview      # Preview do build
npm run test         # Executar testes
npm run test:ui      # Interface de testes
npm run lint         # Linting
```

## 📚 Documentação

- [Setup Inicial](docs/SETUP.md)
- [Configuração WhatsApp](docs/WHATSAPP_CONNECTION.md)
- [Funções Admin](docs/ADMIN_FUNCTIONS_SETUP.md)
- [Melhorias de Exportação](docs/MELHORIAS_EXPORTACAO.md)

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🆘 Suporte

- **Documentação**: [docs/](docs/)
- **Issues**: [GitHub Issues](https://github.com/seu-usuario/metricawhats/issues)
- **Email**: suporte@metricawhats.com

## 🗺️ Roadmap

- [ ] **PWA**: Aplicação Progressive Web App
- [ ] **Notificações**: Push notifications
- [ ] **Analytics Avançados**: Machine Learning
- [ ] **Integrações**: CRM, ERP, etc.
- [ ] **Mobile App**: React Native

---

**MetricaWhats** - Transformando atendimentos em resultados! 🚀
