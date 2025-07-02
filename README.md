# Facebook Ads Miner - Backend Node.js

Minerador de Anúncios Facebook Ads via API com dashboard HTML integrado.

## 🚀 Instalação Rápida

### 1. Clone e Configure
\`\`\`bash
git clone <repo>
cd facebook-ads-miner
npm install
\`\`\`

### 2. Configure o .env
\`\`\`bash
cp .env.example .env
\`\`\`

Edite o `.env` com suas credenciais:
\`\`\`env
FACEBOOK_ACCESS_TOKEN=seu_token_aqui
FACEBOOK_AD_ACCOUNT_ID=act_sua_conta_aqui
API_SECRET_KEY=sua_chave_secreta
\`\`\`

### 3. Execute
\`\`\`bash
# Windows
start.bat

# Linux/Mac
npm start
\`\`\`

## 📊 Como Obter Token do Facebook

### 1. Acesse Facebook Developers
- Vá para: https://developers.facebook.com/
- Crie um app ou use existente

### 2. Adicione Marketing API
- No painel do app, adicione "Marketing API"
- Configure permissões: `ads_read`, `ads_management`

### 3. Gere Access Token
- Vá em Tools > Graph API Explorer
- Selecione seu app
- Gere token com permissões necessárias
- **Importante**: Converta para Long-Lived Token

### 4. Obtenha Ad Account ID
- Vá para: https://business.facebook.com/settings/ad-accounts
- Copie o ID da conta (formato: act_123456789)

## 🔧 Estrutura do Projeto

\`\`\`
src/
├── controllers/     # Lógica de negócio
├── services/        # Integração com APIs
├── routes/          # Rotas da API
├── middleware/      # Middlewares (auth, error)
├── utils/           # Utilitários e formatadores
└── server.js        # Servidor principal

public/
├── index.html       # Dashboard HTML
└── js/app.js        # Frontend JavaScript
\`\`\`

## 📡 Endpoints da API

### GET /api/health
Verificar status do servidor e conexão com Facebook API

### GET /api/mineracao
Buscar campanhas mineradas com filtros:
- `?status=scaling` - Filtrar por status
- `?formato=video` - Filtrar por formato
- `?ticket=alto` - Filtrar por ticket

### GET /api/mineracao/:id
Detalhes de uma campanha específica

### POST /api/mineracao/refresh
Atualizar cache manualmente

## 🎯 Status das Campanhas

O sistema classifica automaticamente as campanhas:

- **Validando** (cinza): ROAS < 1.5 ou spend < R$ 500
- **Pré-Escala** (laranja): ROAS 1.5-3.0 com conversões
- **Escalando** (vermelho): ROAS ≥ 3.0 e spend ≥ R$ 1.000
- **Otimizando** (azul): Outros casos

## 🔒 Autenticação

Configure `API_SECRET_KEY` no .env para proteger a API:

\`\`\`bash
# Requisição com header
curl -H "X-API-Key: sua_chave" http://localhost:3000/api/mineracao

# Ou query parameter
curl http://localhost:3000/api/mineracao?api_key=sua_chave
\`\`\`

## 📦 Cache

- Cache automático de 5 minutos (configurável)
- Evita rate limiting da API do Facebook
- Limpar cache: POST /api/mineracao/refresh

## 🚀 Deploy

### VPS/Servidor
\`\`\`bash
# Instalar PM2
npm install -g pm2

# Executar em produção
NODE_ENV=production pm2 start src/server.js --name "ads-miner"
\`\`\`

### Render/Heroku
- Configure as variáveis de ambiente
- Use `npm start` como comando de build

## 🐛 Troubleshooting

### Erro de Token
- Verifique se o token não expirou
- Confirme permissões `ads_read`
- Use Long-Lived Token

### Erro de Ad Account
- Confirme formato: `act_123456789`
- Verifique acesso à conta no Business Manager

### Rate Limiting
- O cache reduz requisições
- Facebook permite ~200 req/hora por token

## 📝 Logs

Logs são salvos em:
- `logs/combined.log` - Todos os logs
- `logs/error.log` - Apenas erros
- Console com cores para desenvolvimento

## 🔧 Personalização

### Adicionar Novos Filtros
Edite `src/controllers/mineracaoController.js`:

\`\`\`javascript
aplicarFiltros(dados, filtros) {
  // Adicione sua lógica aqui
}
\`\`\`

### Modificar Status
Edite `src/utils/dataFormatter.js`:

\`\`\`javascript
function calculateStatus(metricas) {
  // Customize a lógica de status
}
\`\`\`

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique os logs em `logs/`
2. Teste health check: `/api/health`
3. Confirme configuração do .env

---

**Desenvolvido para mineração profissional de anúncios Facebook Ads** 🚀
