---
trigger: always_on
---

# Photo Studio & Guidelines
Este arquivo serve como **fonte de verdade** para agentes de IA (como o Antigravity) entenderem o contexto, arquitetura e padrões do projeto Photo Studio.

---
## 🏢 Visão Geral do Produto
**Nome:** Photo Studio  
**Objetivo:** Gerar imagens de estúdio para divulgação de itens de vestuário (roupas, tênis, raquetes, bolas etc.). O sistema permite que usuários enviem fotos de produtos, que são processadas via API de geração de imagens para criar representações realistas do item vestido em uma pessoa ou manequim, otimizando para marketing e e-commerce.  

**Funcionalidades Principais:**  
- Upload de fotos de produtos via interface web ou WhatsApp.  
- Integração com API de geração de imagens (ex: Stable Diffusion, DALL-E ou similar) para criar composições automáticas.  
- Geração de variações (ex: diferentes poses, fundos de estúdio, iluminação).  
- Armazenamento e gerenciamento de imagens geradas no banco de dados.  

---
## 🛠️ Stack Tecnológica & Infraestrutura
- **Deployment:** Railway (todo desenvolvimento deve considerar compatibilidade com este ambiente, containers efêmeros/stateless).  
- **Framework:** Next.js 14+ (App Router).  
- **Linguagem:** TypeScript.  
- **Banco de Dados:** PostgreSQL (Neon).  
- **ORM/Query:** `pg` (driver nativo com queries SQL manuais ou via QueryBuilder customizado).  
- **Estilização:** Tailwind CSS + Lucide Icons.  
- **WhatsApp:** `whatsapp-web.js` (rodando no backend via Node.js).  
- **Geração de Imagens:** Integração com API externa (ex: Hugging Face, OpenAI, ou self-hosted como ComfyUI). Configurar chaves de API via variáveis de ambiente seguras.  
- **Processamento de Imagens:** Bibliotecas como Sharp ou Pillow para pré-processamento (resize, crop) antes de enviar para a API de IA.  
- **Testes:** Jest (Backend + Frontend).  

### 🌍 Ambientes de Banco de Dados
- **Localhost (Dev):** Usa o banco de **Teste/Dev** (Neon Instance: `ep-winter-wind`).  
  - Configurado em `.env.local` (aponta para Dev).  
- **Produção (Railway):** Usa o banco de **Produção** (Neon Instance: `ep-crimson-dawn`).  
  - Configurado via variáveis de ambiente do Railway.  

### 🔄 Migrações e Schema
- **Fluxo de Mudança:**  
  1. **Toda alteração de banco deve seguir o sistema de migrations.** Nunca altere o schema manualmente ou apenas no `db.ts`.  
  2. Criar migration: `npm run migrate:create -- nome_da_mudanca`.  
  3. Implementar `up` e `down` no arquivo JS gerado em `migrations/`.  
  4. Validar localmente: `npm run migrate:test`.  
  5. **Automação:** Ao mergear para `main`, o CI/CD executa `npm run migrate:prod` automaticamente.  
- **Idempotência:** Sempre use `IF NOT EXISTS` ou a opção `ifNotExists: true` nas migrations.  
- **Aviso:** O arquivo `src/lib/db.ts` contém um snapshot para setups iniciais, mas não deve ser usado para evoluir o schema.  
- **Novas Tabelas Sugeridas:** Adicionar tabela para armazenar metadados de imagens geradas (ex: `generated_images` com campos como `original_photo_url`, `generated_url`, `prompt_used`, `model_api`).

---
## 🏛️ Arquitetura & Padrões
### 1. Estrutura de Pastas
- `/src/lib`: Configurações globais (db, logger, imageGeneratorClient).  
- `/src/repositories`: Acesso a dados. **Sempre use Repositórios**, nunca chame o DB direto dos componentes ou rotas. (Ex: `ImageRepository` para CRUD de imagens).  
- `/src/services`: Regras de negócio puras (ex: `ImageGenerationService` para integração com API de IA, `ContactSyncService`). **Não acople UI aqui.**  
- `/src/hooks`: Lógica de UI reutilizável (ex: `useImageUpload`).  
- `/src/app/api`: Rotas de API (Controllers). Devem ser "magras", apenas recebendo requisição e chamando Serviços/Repos. (Ex: `/api/generate-image` para processar upload e chamar serviço de geração).  

### 2. Princípios de Código (Clean Code & SOLID)
**Obrigatório em todo desenvolvimento:**  
- **Clean Code é premissa.** Código legível, nomes significativos, funções pequenas.  
- **SOLID:**  
  - **SRP:** Separe responsabilidades (UI x Lógica x Dados x Geração de Imagens).  
  - **DIP:** Injete dependências (ex: injete cliente de API de IA nos serviços).  
  - **OCP:** Classes abertas para extensão, fechadas para modificação (ex: permitir troca de API de IA via configuração).  

### 3. Padrões de API
- **Retorno de Erro:** Use a classe padrão `ApiError` (ou o formato `{ error: string, details?: any }`).  
- **Paginação:** Sempre retorne `{ data: [], pagination: { total, page, limit } }`.  
- **Endpoints Específicos para Geração de Imagens:**  
  - POST `/api/upload-product`: Recebe foto, armazena temporariamente e retorna ID.  
  - POST `/api/generate-studio`: Recebe ID da foto, prompt opcional, e retorna URL da imagem gerada.  
  - Use rate limiting para chamadas à API de IA para evitar custos excessivos.  

### 4. Integração com API de Geração de Imagens
- **Fluxo Típico:**  
  1. Usuário envia foto via web ou WhatsApp.  
  2. Pré-processar imagem (resize para otimizar).  
  3. Gerar prompt automático baseado na descrição (ex: "Uma modelo vestindo [produto] em estúdio branco, iluminação natural").  
  4. Chamar API de IA (ex: via fetch para endpoint de geração).  
  5. Armazenar resultado no DB e retornar ao usuário.  
- **Melhores Práticas:**  
  - Use prompts detalhados para qualidade: Inclua estilo (ex: "fotorealista"), ângulo, iluminação.  
  - Suporte a variações: Parâmetros como gênero da pessoa, tipo de manequim, fundo.  
  - Custos: Monitore uso de API e implemente caching para prompts semelhantes.  
  - Erros: Trate falhas de API com retries ou mensagens amigáveis.  

---
## 🚨 Regras de Ouro (Do's & Don'ts)
### ✅ Do (Faça)
- **TESTES SÃO OBRIGATÓRIOS:**  
  - Toda nova funcionalidade **deve** ter testes criados (incluindo mocks para APIs externas).  
  - **Nunca quebre testes existentes.** Rode os testes (`npm test`) antes de finalizar tarefas.  
- Use **English** para nomes de variáveis, funções e arquivos.  
- Use **Português** para textos de UI e comentários explicativos complexos.  
- Use o logger centralizado (`src/lib/logger.ts`) em vez de `console.log`.  
- **MIGRATIONS:** Toda alteração de schema **DEVE** ser feita via migration (`npm run migrate:create`).  
- **Segurança:** Valide uploads de imagens (tamanho, tipo) para evitar abusos.  
- **Otimização:** Use queues (ex: BullMQ) para processar gerações de imagens assincronamente.  

### ❌ Don't (Não Faça)
- Não escreva SQL direto nas rotas `/src/app/api`. Mova para Repositórios.  
- Não use `any`. Defina interfaces em `/src/types` (ex: `ImageGenerationResponse`).  
- Não commite segredos ou chaves de API (use `.env`).  
- Não dependa de APIs externas sem fallbacks ou mocks em dev.  
- Não gere imagens sem consentimento ou para conteúdos inadequados.  

### 🌳 Controle de Versão (Git Flow)
- **Nunca comite diretamente na `main`.**  
- Crie branches separadas para cada tarefa seguindo a convenção:  
  - `feat/nome-da-feature`: Novas funcionalidades (ex: `feat/image-generation-api`).  
  - `fix/nome-do-bug`: Correções de erros.  
  - `chore/nome-da-tarefa`: Limpeza, refatoração ou configuração.  
  - `docs/nome-da-doc`: Atualizações de documentação.  

---
## 📈 Métricas e Monitoramento
- **Rastreie:** Tempo de geração de imagens, taxa de sucesso da API, custos por chamada.  
- **Ferramentas:** Integre com Sentry para erros e New Relic para performance.  

## 📈 Segurança
NUNCA commite arquivos com chaves de API reais
Sempre use .env.local (que está no .gitignore)
Use apenas placeholders no 
.env.example


## 🔮 Próximos Passos e Melhorias
- Suporte a múltiplas APIs de IA para redundância.  
- Integração com IA para detecção automática de produto na foto (ex: via Vision API).  
- UI aprimorada: Preview interativo de prompts antes de gerar.  
- Escalabilidade: Considere serverless para picos de uso.