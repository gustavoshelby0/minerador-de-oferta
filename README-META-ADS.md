# Meta Ad Library Integration

## 🔑 Como obter o Meta Token

### 1. Acesse Facebook Developers
- Vá para: https://developers.facebook.com/
- Faça login com sua conta Facebook

### 2. Crie um App
- Clique em "Meus Apps" > "Criar App"
- Escolha "Consumidor" ou "Empresa"
- Preencha os dados do app

### 3. Configure Graph API Explorer
- Vá em "Ferramentas" > "Graph API Explorer"
- Selecione seu app
- Gere um Access Token
- **Importante**: Adicione permissão `ads_read`

### 4. Configure no Projeto
\`\`\`bash
# .env.local
META_TOKEN=EAAKKnvFPAkYBOzIaH9hU34fCVqttOjpN45jwVBsEzhdmNFzW28dZA4BiQ8ZCUlcGNEwBG7qrcoNEM0VmG58cArvnHZBNVrlsSion4LkHpDtIQ0yCtwytDSKZBiFZC8s1eiZCmrocWg69nYee6y9Vrv9p5ljVpBInVO5JziF7j0JMAF8XHweycDaNqQhPGbAvv2qmRVDTfd0Am7kziZBLWor2nrZC
\`\`\`

## 🚀 Deploy

### Vercel
\`\`\`bash
vercel env add META_TOKEN
# Cole seu token quando solicitado
vercel --prod
\`\`\`

### Netlify
\`\`\`bash
netlify env:set META_TOKEN "seu_token_aqui"
netlify deploy --prod
\`\`\`

### Railway/Render
- Adicione META_TOKEN nas variáveis de ambiente
- Deploy automático via Git

## 📊 Funcionalidades

✅ **Busca por palavra-chave**
✅ **Filtro por país (Brasil)**
✅ **Exibição do texto do anúncio**
✅ **Preview em iframe**
✅ **Métricas (impressões, investimento)**
✅ **Status ativo/inativo**
✅ **Link para anúncio original**
✅ **Responsive design**

## 🔍 Exemplos de Busca

- `iphone` - Anúncios sobre iPhone
- `curso` - Cursos online
- `loja` - E-commerce
- `investimento` - Produtos financeiros
- `saúde` - Produtos de saúde

## ⚠️ Limitações da API

- Rate limit: ~200 requests/hora
- Apenas anúncios públicos
- Dados podem ter delay de até 24h
- Alguns anúncios podem não ter preview
\`\`\`

## ✅ **SISTEMA COMPLETO PRONTO!**

### 🎯 **O que foi criado:**

**🔧 Backend:**
- ✅ Rota `/api/meta-ads` para buscar anúncios
- ✅ Integração com Meta Ad Library API
- ✅ Filtros por país e palavra-chave
- ✅ Tratamento de erros completo
- ✅ Teste de conexão com token

**🎨 Frontend:**
- ✅ Interface moderna com cards
- ✅ Busca por palavra-chave
- ✅ Exibição do texto do anúncio
- ✅ Preview em iframe do snapshot
- ✅ Métricas (impressões, investimento)
- ✅ Status de conexão
- ✅ Design responsivo

**🚀 Deploy Ready:**
- ✅ Variável de ambiente META_TOKEN
- ✅ Scripts de deploy
- ✅ Documentação completa
- ✅ Exemplos de configuração

### 🔥 **Como usar:**

1. **Configure o token**: Adicione `META_TOKEN` no `.env`
2. **Teste localmente**: `npm run dev`
3. **Busque anúncios**: Digite "iphone" e clique em buscar
4. **Deploy**: Configure a variável no seu provedor

Agora você tem um **SaaS completo** que consome a Meta Ad Library API e exibe anúncios públicos do Facebook diretamente no seu site!
