# Conexão WhatsApp - MetricsIA

## 📱 Visão Geral

A funcionalidade de conexão WhatsApp permite que os usuários conectem suas instâncias do WhatsApp Business à plataforma MetricsIA para coleta e análise de dados de atendimento.

## 🚀 Como Funcionar

### 1. Acessar a Página de Conexão

- Faça login no sistema
- No dashboard, clique no botão **"Conectar WhatsApp"** (verde)
- Ou navegue para `/whatsapp-connect`

### 2. Criar Nova Instância

1. **Digite o nome da instância**:
   - Use apenas letras minúsculas, números e hífens
   - Exemplos: `lojamoveis`, `empresa-abc`, `vendas2024`
   - Mínimo 3 caracteres, máximo 50

2. **Clique em "Criar Instância"**:
   - O sistema fará uma requisição para a API Evolution
   - URL: `https://api.aiensed.com/instance/connect/`
   - Método: `POST`

3. **Escaneie o QR Code**:
   - Aparecerá um QR Code na tela
   - Abra o WhatsApp Business no seu celular
   - Vá em Configurações > Dispositivos Vinculados
   - Escaneie o código

### 3. Monitoramento do Status

- **Conectando**: QR Code disponível para escaneamento
- **Conectado**: WhatsApp vinculado com sucesso
- **Desconectado**: Conexão perdida
- **Erro**: Problema na conexão

## 🔧 Integração Técnica

### API Evolution

```typescript
// Criar instância
POST https://api.aiensed.com/instance/connect/
{
  "instanceName": "lojamoveis",
  "userId": "user-uuid",
  "email": "user@example.com"
}

// Verificar status
GET https://api.aiensed.com/instance/status/{instanceId}

// Deletar instância
DELETE https://api.aiensed.com/instance/delete/{instanceId}
```

### Banco de Dados (Supabase)

Tabela `whatsapp_instances`:
- `id`: UUID único
- `user_id`: Referência ao usuário
- `instance_name`: Nome amigável
- `instance_id`: ID da API Evolution
- `status`: Status da conexão
- `qr_code`: URL do QR Code
- `phone_number`: Número conectado
- `created_at`: Data de criação
- `updated_at`: Última atualização

### Estrutura de Arquivos

```
src/
├── pages/
│   └── WhatsAppConnect.tsx          # Página principal
├── hooks/
│   └── useWhatsAppInstances.tsx     # Hook para gerenciar instâncias
├── components/
│   └── WhatsAppStatus.tsx           # Componente de status
└── integrations/supabase/
    └── types.ts                     # Tipos atualizados
```

## 🎯 Funcionalidades

### ✅ Implementadas

- [x] Formulário de criação de instância
- [x] Validação de nome da instância
- [x] Integração com API Evolution
- [x] Exibição de QR Code
- [x] Monitoramento de status em tempo real
- [x] Listagem de instâncias existentes
- [x] Deletar instâncias
- [x] Componente de status no dashboard
- [x] Persistência no Supabase
- [x] Row Level Security (RLS)

### 🔄 Em Desenvolvimento

- [ ] Webhook para atualizações de status
- [ ] Notificações push de mudanças
- [ ] Histórico de conexões
- [ ] Métricas por instância
- [ ] Backup automático de dados

## 🛠️ Configuração

### Variáveis de Ambiente

```env
# API Evolution
VITE_EVOLUTION_API_URL=https://api.aiensed.com
VITE_EVOLUTION_API_KEY=your_api_key

# Supabase (já configurado)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Migração do Banco

Execute a migração para criar a tabela:

```bash
supabase db push
```

## 📊 Fluxo de Dados

1. **Usuário cria instância** → Frontend valida → API Evolution
2. **API retorna QR Code** → Salva no Supabase → Exibe para usuário
3. **Usuário escaneia QR** → WhatsApp conecta → API atualiza status
4. **Sistema verifica status** → Atualiza Supabase → Atualiza UI
5. **Dados fluem via N8N** → Processamento → Dashboard

## 🔒 Segurança

- **Autenticação**: Token do usuário em todas as requisições
- **RLS**: Usuários só veem suas próprias instâncias
- **Validação**: Nomes de instância sanitizados
- **HTTPS**: Todas as comunicações criptografadas

## 🐛 Troubleshooting

### Problemas Comuns

1. **QR Code não aparece**:
   - Verifique se a API Evolution está respondendo
   - Confirme se o nome da instância é válido

2. **Status não atualiza**:
   - Verifique a conexão com a API
   - Confirme se o webhook está configurado

3. **Erro de validação**:
   - Use apenas letras minúsculas, números e hífens
   - Nome deve ter entre 3 e 50 caracteres

### Logs

```bash
# Ver logs do frontend
npm run dev

# Ver logs do Supabase
supabase logs

# Ver logs da API Evolution
# (depende da implementação da API)
```

## 📞 Suporte

Para problemas técnicos:
- **Email**: suporte@metricsia.com
- **Documentação**: [docs.metricsia.com](https://docs.metricsia.com)
- **Issues**: [GitHub Issues](https://github.com/seu-usuario/metricsia/issues)

---

**Desenvolvido com ❤️ pela equipe MetricsIA**
