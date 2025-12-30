# Photo Studio

Aplicação para geração de imagens de estúdio de produtos de vestuário usando **Google Gemini 2.5 Flash Image**.

## 🚀 Funcionalidades

- **Upload Dual de Fotos**: Envie foto de frente (obrigatória) e de costas (opcional)
- **Geração baseada em imagem de referência** (não precisa descrever o produto!)
- **Geração em Lote**: Crie múltiplas visualizações de uma vez
- Tipos de visualização disponíveis:
  - **Manequim**: Produto em manequim profissional (frente e costas)
  - **Situação Real**: Produto sendo usado por modelo (masculino/feminino)
- **Download Multi-Formato**: Baixe imagens otimizadas para Instagram, Mercado Livre, Shopee e Amazon
- **Sistema de Feedback**: Avalie e melhore as gerações
- Interface moderna e responsiva

## 🛠️ Stack Tecnológica

- **Framework**: Next.js 14 (App Router)
- **Linguagem**: TypeScript
- **Estilização**: Tailwind CSS + Lucide Icons
- **IA**: Google Gemini 2.5 Flash Image (v1beta API)
- **Banco de Dados**: PostgreSQL (Neon)
- **Storage**: Cloudinary
- **Processamento de Imagens**: Sharp

## 📋 Pré-requisitos

- Node.js 18+
- npm ou yarn
- **API Key do Google Gemini** (obrigatório)
- **Conta no Cloudinary** (obrigatório para upload)
- Conta no Neon (PostgreSQL) - obrigatório para persistência

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

# Obrigatório: Banco de dados PostgreSQL
# Obtenha em: https://neon.tech
DATABASE_URL='postgresql://user:pass@host.neon.tech/db?sslmode=require'

# Obrigatório: Cloudinary para upload de imagens
# Obtenha em: https://cloudinary.com/console
CLOUDINARY_API_KEY='sua-api-key'
CLOUDINARY_API_SECRET='seu-api-secret'
```

### 3. Execute as migrations

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
│   │   ├── upload-product/      # Upload de fotos (Cloudinary)
│   │   ├── generate-studio/     # Geração de imagens (Gemini)
│   │   ├── resize-image/        # Redimensionamento multi-formato
│   │   ├── feedbacks/           # Sistema de feedback
│   │   └── users/               # Gestão de usuários
│   ├── studio/                  # Página principal
│   └── page.tsx                 # Landing page
├── components/
│   ├── ImageUploadZone.tsx      # Upload dual (frente/costas)
│   ├── OutputTypeSelector.tsx   # Seleção de tipos + gênero
│   ├── GeneratedImageGallery.tsx
│   ├── DownloadModal.tsx        # Download multi-formato
│   └── FeedbackModal.tsx        # Coleta de feedback
├── lib/
│   ├── db.ts                    # Pool PostgreSQL
│   ├── gemini.ts                # Cliente Gemini (v1beta)
│   ├── cloudinary.ts            # Cliente Cloudinary
│   └── logger.ts                # Logger centralizado
├── services/
│   ├── GeminiImageService.ts    # Serviço de geração
│   └── ImageResizeService.ts    # Redimensionamento
├── repositories/
│   ├── ImageRepository.ts       # CRUD de imagens
│   ├── FeedbackRepository.ts    # CRUD de feedbacks
│   └── UserRepository.ts        # CRUD de usuários
├── migrations/                  # Migrations do banco
└── types/
    └── index.ts                 # Interfaces TypeScript
```

## 🎯 Como Usar

1. Acesse a página `/studio`
2. Faça upload da **foto de frente** (obrigatória)
3. Opcionalmente, faça upload da **foto de costas**
4. Escolha o tipo de geração:
   - **Manequim**: Gera frente e costas em manequim
   - **Situação Real**: Escolha o gênero do modelo (masculino/feminino/ambos)
5. Clique em "Gerar Imagens"
6. Aguarde a geração (pode levar alguns segundos por imagem)
7. Visualize os resultados na galeria
8. Baixe as imagens em formatos otimizados para diferentes plataformas
9. Deixe seu feedback para melhorar as gerações futuras

## 🔧 Scripts Disponíveis

- `npm run dev` - Servidor de desenvolvimento
- `npm run build` - Build de produção
- `npm start` - Servidor de produção
- `npm test` - Executar testes (Jest)
- `npm run migrate:create -- nome` - Criar migration
- `npm run migrate:test` - Executar migrations (dev)
- `npm run migrate:prod` - Executar migrations (prod)

## ⚠️ Notas Importantes

### Sobre a API Gemini 2.5 Flash Image

- **Endpoint**: Usa v1beta (pode mudar no futuro)
- **Custos**: ~$0.30/1M tokens de entrada, ~$2.50/1M tokens de saída
- **Limites**: Verifique os limites de requisições da sua conta
- **Qualidade**: A qualidade das imagens depende da qualidade da foto enviada

### Segurança

- ✅ `.env.local` está no `.gitignore` - **nunca commite credenciais**
- ✅ Validação de tipos de arquivo no upload
- ✅ Limite de tamanho de arquivo (10MB)
- ✅ Logs centralizados para debugging
- ✅ Arquitetura SOLID e Clean Code

### Storage

- Uploads são salvos no Cloudinary
- Imagens geradas são armazenadas no PostgreSQL (Neon)
- Sistema de tracking de custos por geração

## 🔮 Próximos Passos

- [ ] Implementar testes automatizados (cobertura 0% atualmente)
- [ ] Atualizar Next.js para versão mais recente (corrigir vulnerabilidades)
- [ ] Implementar sistema de filas para processamento assíncrono
- [ ] Adicionar autenticação de usuários
- [ ] Implementar rate limiting
- [ ] Melhorar prompts com base em feedback coletado
- [ ] Adicionar opção de editar/refinar imagens geradas
- [ ] Suporte a múltiplos idiomas

## 📄 Licença

Este é um projeto POC para demonstração.

## 🤝 Contribuindo

Pull requests são bem-vindos! Para mudanças importantes, abra uma issue primeiro para discutir o que você gostaria de mudar.

