# Photo Studio POC

Proof of Concept para geração de imagens de estúdio de produtos de vestuário usando Google Gemini AI.

## 🚀 Funcionalidades

- Upload de 1-2 fotos de produtos
- Geração de até 3 tipos de visualizações:
  - **Foto de Frente**: Visualização frontal profissional em estúdio
  - **Foto de Costa**: Visualização traseira do produto
  - **Situação Real**: Produto em uso em contexto real
- Interface moderna e responsiva
- Sistema de prompts otimizados para imagens realistas

## 🛠️ Stack Tecnológica

- **Framework**: Next.js 14 (App Router)
- **Linguagem**: TypeScript
- **Estilização**: Tailwind CSS
- **Ícones**: Lucide React
- **IA**: Google Gemini API
- **Banco de Dados**: PostgreSQL (Neon)
- **Processamento de Imagens**: Sharp

## 📋 Pré-requisitos

- Node.js 18+
- npm ou yarn
- Conta no Neon (PostgreSQL)
- API Key do Google Gemini

## ⚙️ Configuração

1. **Clone o repositório e instale as dependências**:
```bash
npm install
```

2. **Configure as variáveis de ambiente**:

Copie o arquivo `.env.example` para `.env.local`:
```bash
cp .env.example .env.local
```

Edite `.env.local` com suas credenciais:
```env
DATABASE_URL='postgresql://neondb_owner:npg_XJ8PbptmsH9Z@ep-raspy-star-a4u608w3-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'
GEMINI_API_KEY=AIzaSyDfz0hCriKb1bqpTkjnMHEwIZ3-Z99g2hE
```

3. **Execute as migrations do banco de dados**:
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
│   │   ├── upload-product/    # Endpoint de upload
│   │   └── generate-studio/   # Endpoint de geração
│   ├── studio/                # Página principal
│   ├── layout.tsx
│   └── page.tsx              # Landing page
├── components/
│   ├── ImageUploadZone.tsx
│   ├── OutputTypeSelector.tsx
│   └── GeneratedImageGallery.tsx
├── lib/
│   ├── db.ts                 # Configuração do banco
│   ├── gemini.ts             # Cliente Gemini
│   └── logger.ts             # Logger centralizado
├── repositories/
│   └── ImageRepository.ts    # CRUD de imagens
├── services/
│   └── GeminiImageService.ts # Serviço de geração
├── migrations/               # Migrations do banco
├── scripts/
│   ├── create-migration.js
│   └── migrate.js
└── types/
    └── index.ts              # Interfaces TypeScript
```

## 🎯 Como Usar

1. Acesse a página `/studio`
2. Faça upload de 1-2 fotos do produto
3. Descreva o produto em detalhes
4. Selecione os tipos de visualização desejados (até 3)
5. Clique em "Gerar Imagens"
6. Aguarde a geração e faça download das imagens

## 🔧 Scripts Disponíveis

- `npm run dev` - Inicia servidor de desenvolvimento
- `npm run build` - Build de produção
- `npm start` - Inicia servidor de produção
- `npm run migrate:create -- nome` - Cria nova migration
- `npm run migrate:test` - Executa migrations no ambiente de teste
- `npm run migrate:prod` - Executa migrations em produção

## ⚠️ Notas Importantes

- **API do Gemini**: Atualmente usando placeholder images pois a API Gemini não gera imagens diretamente. Para produção, integrar com Imagen API ou similar.
- **Custos**: Monitore o uso da API para controlar custos.
- **Segurança**: Nunca commite o arquivo `.env.local` com credenciais reais.
- **Uploads**: Arquivos são salvos em `public/uploads/` - configure storage em nuvem para produção.

## 📝 Próximos Passos

- [ ] Integrar com API real de geração de imagens (Imagen, DALL-E, Stable Diffusion)
- [ ] Implementar sistema de filas para processamento assíncrono
- [ ] Adicionar autenticação de usuários
- [ ] Implementar storage em nuvem (S3, Cloudinary)
- [ ] Adicionar testes automatizados
- [ ] Implementar rate limiting
- [ ] Melhorar prompts com base em feedback

## 📄 Licença

Este é um projeto POC para demonstração.
