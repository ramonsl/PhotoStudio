# Photo Studio POC

Proof of Concept para geração de imagens de estúdio de produtos de vestuário usando **Google Gemini 2.5 Flash Image**.

## 🚀 Funcionalidades

- Upload de 1-2 fotos de produtos (roupas, tênis, acessórios)
- **Geração baseada em imagem de referência** (não precisa descrever o produto!)
- Geração de até 3 tipos de visualizações:
  - **Front**: Produto em manequim profissional (vista frontal)
  - **Back**: Produto em manequim profissional (vista traseira)
  - **Real Situation**: Produto sendo usado por modelo real em ambiente natural
- Interface moderna e responsiva
- Modo display-only (imagens não são salvas no banco)

## 🛠️ Stack Tecnológica

- **Framework**: Next.js 14 (App Router)
- **Linguagem**: TypeScript
- **Estilização**: Tailwind CSS + Lucide Icons
- **IA**: Google Gemini 2.5 Flash Image (v1beta API)
- **Banco de Dados**: PostgreSQL (Neon) - opcional
- **Processamento de Imagens**: Sharp

## 📋 Pré-requisitos

- Node.js 18+
- npm ou yarn
- **API Key do Google Gemini** (obrigatório)
- Conta no Neon (PostgreSQL) - opcional, apenas se quiser persistir imagens

## ⚙️ Configuração

### 1. Clone e instale dependências

```bash
git clone https://github.com/ramonsl/PhotoStudio.git
cd PhotoStudio
npm install
```

### 2. Configure as variáveis de ambiente

Copie o arquivo `.env.example` para `.env.local`:

```bash
cp .env.example .env.local
```

Edite `.env.local` e adicione suas credenciais:

```env
# Obrigatório: API Key do Google Gemini
# Obtenha em: https://aistudio.google.com/app/apikey
GEMINI_API_KEY='sua-chave-aqui'

# Opcional: Banco de dados (apenas se quiser persistir imagens)
# Obtenha em: https://neon.tech
DATABASE_URL='postgresql://user:pass@host.neon.tech/db?sslmode=require'
```

### 3. (Opcional) Execute as migrations

Se você configurou o banco de dados e quer persistir imagens:

```bash
npm run migrate:test
```

## 🚀 Executando o Projeto

### Modo Desenvolvimento

```bash
npm run dev
```

Acesse: http://localhost:3000

### Build de Produção

```bash
npm run build
npm start
```

## 📁 Estrutura do Projeto

```
photostudio/
├── app/
│   ├── api/
│   │   ├── upload-product/    # Upload de fotos
│   │   └── generate-studio/   # Geração de imagens
│   ├── studio/                # Página principal
│   └── page.tsx              # Landing page
├── components/
│   ├── ImageUploadZone.tsx
│   ├── OutputTypeSelector.tsx
│   └── GeneratedImageGallery.tsx
├── lib/
│   ├── gemini.ts             # Cliente Gemini (v1beta)
│   └── logger.ts             # Logger centralizado
├── services/
│   └── GeminiImageService.ts # Serviço de geração
└── types/
    └── index.ts              # Interfaces TypeScript
```

## 🎯 Como Usar

1. Acesse a página `/studio`
2. Faça upload da foto do produto (JPG, PNG, WebP)
3. Selecione os tipos de visualização desejados (até 3)
4. Clique em "Gerar Imagens"
5. Aguarde a geração (pode levar alguns segundos)
6. Visualize e faça download das imagens geradas

## 🔧 Scripts Disponíveis

- `npm run dev` - Servidor de desenvolvimento
- `npm run build` - Build de produção
- `npm start` - Servidor de produção
- `npm run migrate:create -- nome` - Criar migration
- `npm run migrate:test` - Executar migrations (dev)
- `npm run migrate:prod` - Executar migrations (prod)

## ⚠️ Notas Importantes

### Sobre a API Gemini 2.5 Flash Image

- **Endpoint**: Usa v1beta (pode mudar no futuro)
- **Custos**: Monitore o uso da API no Google Cloud Console
- **Limites**: Verifique os limites de requisições da sua conta
- **Qualidade**: A qualidade das imagens depende da qualidade da foto enviada

### Segurança

- ✅ `.env.local` está no `.gitignore` - **nunca commite credenciais**
- ✅ Validação de tipos de arquivo no upload
- ✅ Limite de tamanho de arquivo (10MB)
- ✅ Logs centralizados para debugging

### Storage

- Uploads são salvos em `public/uploads/`
- Para produção, configure storage em nuvem (S3, Cloudinary, etc.)
- Imagens geradas são retornadas como data URLs (base64)

## 🔮 Próximos Passos

- [ ] Implementar sistema de filas para processamento assíncrono
- [ ] Adicionar autenticação de usuários
- [ ] Implementar storage em nuvem
- [ ] Adicionar testes automatizados (Jest)
- [ ] Implementar rate limiting
- [ ] Melhorar prompts com base em feedback
- [ ] Adicionar opção de editar/refinar imagens geradas
- [ ] Suporte a múltiplos idiomas

## 📄 Licença

Este é um projeto POC para demonstração.

## 🤝 Contribuindo

Pull requests são bem-vindos! Para mudanças importantes, abra uma issue primeiro para discutir o que você gostaria de mudar.

