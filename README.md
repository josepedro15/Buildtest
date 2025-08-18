# MetricaWhats - Analytics para WhatsApp

Uma plataforma completa de analytics para WhatsApp Business que transforma atendimentos em insights poderosos.

## 🚀 Funcionalidades

- **Dashboard em Tempo Real**: Métricas detalhadas de conversão, abandono e qualidade
- **Análise de Intenções**: Identificação automática de intenções dos clientes
- **Comparação Diária**: Análise comparativa com o dia anterior
- **Exportação de Relatórios**: CSV, Excel e PDF com formatação profissional
- **Filtros Avançados**: Filtros por data e período
- **Automação Inteligente**: Sugestões de automação baseadas em IA
- **Gestão de Equipe**: Comparação de performance entre atendentes

## 🛠️ Tecnologias

- **Frontend**: React 18 + TypeScript + Vite
- **UI**: shadcn/ui + Radix UI + Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth + Real-time)
- **Estado**: TanStack Query + Context API
- **Validação**: Zod
- **Testes**: Vitest + Testing Library
- **Logging**: Sistema de logging centralizado
- **Performance**: Lazy loading + Code splitting

## 🏗️ Arquitetura

### Estrutura do Projeto
```
src/
├── components/          # Componentes reutilizáveis
│   ├── ui/             # Componentes base (shadcn/ui)
│   └── __tests__/      # Testes de componentes
├── contexts/           # Context API otimizado
├── hooks/              # Custom hooks
├── integrations/       # Integrações externas
├── lib/                # Utilitários e configurações
├── pages/              # Páginas da aplicação
└── test/               # Configuração de testes
```

### Melhorias Implementadas

#### 🔒 Segurança
- ✅ Variáveis de ambiente configuradas
- ✅ Validação com Zod em todos os formulários
- ✅ Sanitização de dados
- ✅ Error boundaries para captura de erros

#### ⚡ Performance
- ✅ Lazy loading de componentes
- ✅ Code splitting otimizado
- ✅ Memoização de componentes pesados
- ✅ Bundle size otimizado

#### 🧪 Qualidade
- ✅ Sistema de testes configurado
- ✅ Error boundaries implementados
- ✅ Sistema de logging centralizado
- ✅ TypeScript rigoroso

#### 🎨 UX/UI
- ✅ Loading states melhorados
- ✅ Skeleton loading
- ✅ Animações suaves
- ✅ Responsividade completa

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+
- npm ou yarn

### Instalação
```bash
# Clone o repositório
git clone https://github.com/seu-usuario/metricawhats.git
cd metricawhats

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp env.example .env.local
# Edite .env.local com suas credenciais do Supabase
```

### Desenvolvimento
```bash
# Inicie o servidor de desenvolvimento
npm run dev

# Execute os testes
npm run test

# Execute os testes com UI
npm run test:ui

# Verifique a cobertura de testes
npm run test:coverage
```

### Build
```bash
# Build para produção
npm run build

# Preview do build
npm run preview
```

## 📊 Métricas de Performance

- **Bundle Size**: ~500KB (gzipped)
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **First Input Delay**: < 100ms

## 🧪 Testes

### Executar Testes
```bash
# Todos os testes
npm run test

# Testes com UI
npm run test:ui

# Testes em modo watch
npm run test:watch

# Cobertura de testes
npm run test:coverage
```

### Estrutura de Testes
- **Unit Tests**: Componentes individuais
- **Integration Tests**: Fluxos de usuário
- **E2E Tests**: Cenários completos (planejado)

## 🔧 Configuração

### Variáveis de Ambiente
```env
# Supabase
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# App
VITE_APP_NAME=MetricaWhats
VITE_APP_VERSION=1.0.0
VITE_APP_ENVIRONMENT=development

# Feature Flags
VITE_ENABLE_PWA=true
VITE_ENABLE_OFFLINE_MODE=true
VITE_ENABLE_ANALYTICS=true
```

### TypeScript
- Configuração rigorosa habilitada
- Strict mode ativo
- Validação de tipos em tempo de compilação

### ESLint
- Regras de qualidade de código
- Integração com TypeScript
- Auto-fix disponível

## 📈 Roadmap

### ✅ Concluído
- [x] Sistema de autenticação
- [x] Dashboard com métricas
- [x] Exportação de relatórios
- [x] Filtros por data
- [x] Comparação diária
- [x] Error boundaries
- [x] Sistema de logging
- [x] Testes unitários
- [x] Lazy loading
- [x] Validação com Zod

### 🚧 Em Desenvolvimento
- [ ] PWA completo
- [ ] Service worker
- [ ] Testes E2E
- [ ] CI/CD pipeline
- [ ] Monitoramento de performance

### 📋 Planejado
- [ ] Dark mode
- [ ] Internacionalização
- [ ] Notificações push
- [ ] Integração com outros canais
- [ ] API pública

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📞 Suporte

- **Email**: contato@metricawhats.com
- **Documentação**: [docs.metricawhats.com](https://docs.metricawhats.com)
- **Issues**: [GitHub Issues](https://github.com/seu-usuario/metricawhats/issues)

---

Desenvolvido com ❤️ pela equipe MetricaWhats
