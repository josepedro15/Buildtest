# 🤖 Análise Preditiva - MetricaWhats

## Visão Geral

O sistema de **Análise Preditiva** do MetricaWhats utiliza Machine Learning e algoritmos estatísticos para fornecer insights preditivos sobre o comportamento dos atendimentos do WhatsApp.

## 🚀 Funcionalidades Implementadas

### 1. **Previsões de Métricas**
- **Atendimentos Futuros**: Previsão de volume de atendimentos para próximos dias/semanas
- **Taxa de Conversão**: Previsão de conversão com análise de tendências
- **Tempo de Resposta**: Previsão de tempo médio de resposta
- **Análise de Sentimento**: Classificação automática de sentimento dos clientes

### 2. **Alertas Preditivos**
- **Conversão Baixa**: Alerta quando taxa de conversão está abaixo do esperado
- **Tempo de Resposta Alto**: Alerta para demoras no atendimento
- **Qualidade em Declínio**: Alerta para queda na qualidade do atendimento
- **Pico de Demanda**: Previsão de momentos de alta demanda

### 3. **Recomendações Baseadas em ML**
- **Automação**: Sugestões de automação para otimizar processos
- **Staffing**: Recomendações de alocação de equipe
- **Timing**: Otimização de horários de atendimento
- **Conteúdo**: Melhorias em scripts e respostas
- **Processos**: Otimização de fluxos de trabalho

### 4. **Análise de Padrões Temporais**
- **Padrões Horários**: Análise de atendimentos por hora do dia
- **Padrões Diários**: Análise por dia da semana
- **Sazonalidade**: Detecção de padrões sazonais
- **Tendências**: Identificação de tendências de longo prazo

## 🧠 Algoritmos Implementados

### 1. **Regressão Linear**
```typescript
// Previsão de atendimentos futuros
private linearRegression(x: number[], y: number[]): { slope: number; intercept: number; r2: number }
```

### 2. **Média Móvel Ponderada**
```typescript
// Suavização de dados temporais
private weightedMovingAverage(data: number[], weights: number[]): number
```

### 3. **Detecção de Sazonalidade**
```typescript
// Identificação de padrões repetitivos
private detectSeasonality(data: number[]): number
```

### 4. **Análise de Sentimento**
```typescript
// Classificação de sentimento baseada em palavras-chave
private analyzeSentiment(text: string): { sentiment: 'positive' | 'neutral' | 'negative'; score: number }
```

## 📊 Estrutura de Dados

### Tabelas do Banco de Dados

#### 1. **historical_analytics**
Armazena dados históricos para treinamento dos modelos:
```sql
CREATE TABLE historical_analytics (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  date DATE NOT NULL,
  total_attendances INTEGER,
  conversions INTEGER,
  conversion_rate DECIMAL(5,4),
  average_response_time INTEGER,
  quality_score DECIMAL(3,2),
  sentiment_score DECIMAL(3,2),
  -- ... outros campos
);
```

#### 2. **predictive_alerts**
Armazena alertas gerados pelos modelos:
```sql
CREATE TABLE predictive_alerts (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  alert_type TEXT CHECK (alert_type IN ('low_conversion', 'high_response_time', ...)),
  severity TEXT CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  probability DECIMAL(3,2),
  message TEXT,
  recommended_action TEXT,
  -- ... outros campos
);
```

#### 3. **ml_recommendations**
Armazena recomendações geradas pelo ML:
```sql
CREATE TABLE ml_recommendations (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  recommendation_type TEXT CHECK (recommendation_type IN ('automation', 'staffing', ...)),
  title TEXT,
  description TEXT,
  impact_level TEXT,
  confidence_score DECIMAL(3,2),
  expected_roi DECIMAL(5,4),
  -- ... outros campos
);
```

#### 4. **prediction_models**
Metadados dos modelos de ML:
```sql
CREATE TABLE prediction_models (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  model_name TEXT,
  model_type TEXT CHECK (model_type IN ('attendance', 'conversion', ...)),
  accuracy DECIMAL(5,4),
  mse DECIMAL(10,6),
  mae DECIMAL(10,6),
  r2_score DECIMAL(5,4),
  -- ... outros campos
);
```

#### 5. **predictions**
Armazena as predições geradas:
```sql
CREATE TABLE predictions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  model_id UUID REFERENCES prediction_models(id),
  prediction_date DATE,
  predicted_value DECIMAL(10,4),
  confidence_score DECIMAL(3,2),
  actual_value DECIMAL(10,4),
  -- ... outros campos
);
```

## 🔧 Como Usar

### 1. **Ativar Análise Preditiva**
No Dashboard, clique no botão **"Análise Preditiva"** para ativar a visualização dos insights preditivos.

### 2. **Visualizar Previsões**
- **Métricas Preditivas**: Cards com previsões para o próximo dia
- **Alertas**: Aba com alertas ativos e recomendações
- **Padrões**: Análise de padrões temporais
- **Insights**: Resumo dos principais insights

### 3. **Interagir com Alertas**
- **Visualizar**: Clique nos alertas para ver detalhes
- **Acknowledger**: Marcar alertas como lidos
- **Aplicar**: Implementar recomendações sugeridas

### 4. **Monitorar Performance**
- **Confiabilidade**: Acompanhar a confiabilidade dos modelos
- **Tendências**: Visualizar tendências gerais
- **Validação**: Comparar previsões com valores reais

## 📈 Métricas de Performance

### 1. **Confiabilidade do Modelo**
- **R² Score**: Mede a qualidade do ajuste do modelo
- **MAE**: Erro absoluto médio
- **MSE**: Erro quadrático médio
- **Accuracy**: Precisão geral do modelo

### 2. **Alertas**
- **Precisão**: % de alertas que se confirmaram
- **Recall**: % de eventos reais que foram alertados
- **F1-Score**: Média harmônica entre precisão e recall

### 3. **Recomendações**
- **Taxa de Aplicação**: % de recomendações implementadas
- **ROI Realizado**: Retorno sobre investimento das implementações
- **Satisfação**: Feedback dos usuários sobre as recomendações

## 🔮 Roadmap Futuro

### 1. **Modelos Avançados**
- [ ] **Deep Learning**: Redes neurais para previsões mais complexas
- [ ] **Ensemble Methods**: Combinação de múltiplos modelos
- [ ] **Time Series**: Modelos específicos para séries temporais
- [ ] **NLP**: Processamento de linguagem natural para análise de mensagens

### 2. **Integrações**
- [ ] **APIs Externas**: Dados de clima, eventos, feriados
- [ ] **CRM**: Integração com sistemas de CRM
- [ ] **Marketing**: Dados de campanhas de marketing
- [ ] **Redes Sociais**: Análise de sentimento em redes sociais

### 3. **Automação**
- [ ] **Auto-ML**: Seleção automática de melhores modelos
- [ ] **Hyperparameter Tuning**: Otimização automática de parâmetros
- [ ] **Feature Engineering**: Geração automática de features
- [ ] **Model Retraining**: Retreinamento automático dos modelos

### 4. **Interface Avançada**
- [ ] **Gráficos Interativos**: Visualizações dinâmicas
- [ ] **Drill-Down**: Análise detalhada por segmentos
- [ ] **Comparações**: Comparação entre diferentes períodos
- [ ] **Exportação**: Relatórios preditivos em PDF/Excel

## 🛠️ Desenvolvimento

### 1. **Estrutura de Arquivos**
```
src/
├── types/
│   └── predictive.ts          # Tipos TypeScript
├── services/
│   └── predictiveAnalytics.ts # Serviço de ML
├── hooks/
│   └── usePredictiveAnalytics.tsx # Hook React
└── components/
    └── PredictiveAnalytics.tsx # Componente UI
```

### 2. **Como Contribuir**
1. **Fork** o repositório
2. **Crie** uma branch para sua feature
3. **Implemente** as melhorias
4. **Teste** com dados reais
5. **Submeta** um Pull Request

### 3. **Testes**
```bash
# Executar testes unitários
npm run test

# Executar testes de integração
npm run test:integration

# Verificar cobertura
npm run test:coverage
```

## 📚 Recursos Adicionais

### 1. **Documentação Técnica**
- [Algoritmos de ML](docs/ml-algorithms.md)
- [API Reference](docs/api-reference.md)
- [Database Schema](docs/database-schema.md)

### 2. **Exemplos de Uso**
- [Jupyter Notebooks](examples/notebooks/)
- [API Examples](examples/api/)
- [Dashboard Examples](examples/dashboard/)

### 3. **Comunidade**
- [Discord](https://discord.gg/metricawhats)
- [GitHub Issues](https://github.com/metricawhats/issues)
- [Documentation](https://docs.metricawhats.com)

---

**Desenvolvido com ❤️ pela equipe MetricaWhats**

*Transformando dados em insights preditivos para otimizar seus atendimentos do WhatsApp*
