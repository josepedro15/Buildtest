# Configuração do N8N para Inserir Dados no Supabase

## Problema Resolvido

A tabela `dashboard_data` tinha políticas de segurança (RLS) que impediam inserções via n8n porque não havia usuário autenticado.

## Solução Implementada

Foi criada uma nova política de segurança que permite inserções via **service role key** (chave de serviço) do Supabase.

## Configuração no N8N

### 1. Obter as Chaves do Supabase

No painel do Supabase, vá em **Settings > API** e copie:
- **Project URL**: `https://pabomyvzfjicpkeioncb.supabase.co`
- **Service Role Key** (anon key não funciona para bypass de RLS)

### 2. Configurar o Nó HTTP Request no N8N

```json
{
  "method": "POST",
  "url": "https://pabomyvzfjicpkeioncb.supabase.co/rest/v1/dashboard_data",
  "headers": {
    "apikey": "SUA_SERVICE_ROLE_KEY_AQUI",
    "Authorization": "Bearer SUA_SERVICE_ROLE_KEY_AQUI",
    "Content-Type": "application/json",
    "Prefer": "return=minimal"
  },
  "body": {
    "user_id": "UUID_DO_USUARIO",
    "periodo_inicio": "2024-01-01",
    "periodo_fim": "2024-01-31",
    "total_atendimentos": 1234,
    "taxa_conversao": 24.5,
    "tempo_medio_resposta": 154,
    "nota_media_qualidade": 4.2,
    "intencao_compra": 45.0,
    "intencao_duvida_geral": 25.0,
    "intencao_reclamacao": 15.0,
    "intencao_suporte": 10.0,
    "intencao_orcamento": 5.0,
    "insights_funcionou": [
      "Resposta rápida (< 1min): 87% dos clientes responderam positivamente",
      "Ofertas personalizadas: aumentaram conversão em 34%"
    ],
    "insights_atrapalhou": [
      "Falta de clareza no pagamento: 23% abandonaram nesta etapa",
      "Respostas genéricas: baixa satisfação (2,1/5)"
    ],
    "melhor_atendimento_cliente": "+55 11 9xxxx-8765",
    "melhor_atendimento_observacao": "Resposta em 30s, proposta personalizada, fechamento em 3 mensagens",
    "melhor_atendimento_nota": 5.0,
    "atendimento_critico_cliente": "+55 11 9xxxx-1234",
    "atendimento_critico_observacao": "Demora de 12min, informações confusas, cliente abandonou",
    "atendimento_critico_nota": 1.5,
    "automacao_sugerida": [
      "FAQ Automatizado: 67% das dúvidas são sobre horário de funcionamento",
      "Reengajamento: clientes que enviam apenas 'Oi' e param",
      "Follow-up: lembrete para leads inativos há 3+ dias"
    ],
    "proximas_acoes": [
      "Revisar script de boas-vindas – Pendente (2024-01-20)",
      "Implementar FAQ automatizado – Em andamento (2024-01-25)",
      "Treinamento equipe - objeções – Feito (2024-01-15)"
    ],
    "meta_taxa_conversao": "24,5% / Meta 30% (até março)",
    "meta_tempo_resposta": "2m 34s / Meta < 2m (até fevereiro)",
    "meta_nota_qualidade": "4,2 / Meta 4,5 (até abril)"
  }
}
```

### 3. Campos Obrigatórios

- `user_id`: UUID válido de um usuário existente no sistema
- `periodo_inicio`: Data no formato YYYY-MM-DD
- `periodo_fim`: Data no formato YYYY-MM-DD

### 4. Campos Opcionais

Todos os outros campos são opcionais e podem ser `null` se não aplicáveis.

## Segurança

- ✅ A política permite inserções via service role
- ✅ Usuários autenticados continuam podendo inserir apenas seus próprios dados
- ✅ A service role key deve ser mantida segura e não exposta publicamente
- ✅ Recomenda-se usar variáveis de ambiente no n8n para as chaves

## Teste

Para testar se está funcionando:

1. Execute a migração SQL no Supabase
2. Configure o nó HTTP Request no n8n
3. Execute o workflow
4. Verifique se os dados foram inseridos na tabela `dashboard_data`

## Troubleshooting

Se ainda houver problemas:

1. Verifique se a service role key está correta
2. Confirme se o `user_id` existe na tabela `auth.users`
3. Verifique os logs do Supabase para detalhes do erro
4. Confirme se a migração foi aplicada corretamente
