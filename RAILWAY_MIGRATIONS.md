# Como Aplicar Migrations em Produção (Railway)

## Problema
```
Failed to process user
```

**Causa:** As tabelas `users` e `feedbacks` não existem no banco de produção porque as migrations ainda não foram executadas.

---

## Solução: Aplicar Migrations no Railway

### Opção 1: Via Railway CLI (Recomendado)

1. **Instale o Railway CLI** (se ainda não tiver):
```bash
npm i -g @railway/cli
```

2. **Faça login:**
```bash
railway login
```

3. **Link ao projeto:**
```bash
cd /Users/ramonlummertz/projetos/PhotoStudio
railway link
```

4. **Execute as migrations:**
```bash
railway run npm run migrate:prod
```

---

### Opção 2: Via Railway Dashboard

1. Acesse: https://railway.app
2. Selecione o projeto **PhotoStudio**
3. Vá em **Deployments** → Último deploy
4. Clique em **"View Logs"**
5. Verifique se as migrations foram executadas automaticamente

**Se NÃO foram executadas:**

1. Vá em **Settings** → **Deploy**
2. Adicione um **Build Command**:
```
npm run build && npm run migrate:prod
```

3. Faça um novo deploy (push qualquer mudança ou force redeploy)

---

### Opção 3: Executar Manualmente via Railway Shell

1. No Railway Dashboard, vá em **Settings**
2. Clique em **"Open Shell"** ou **"Connect"**
3. Execute:
```bash
npm run migrate:prod
```

---

## Verificar se Funcionou

### Via Railway Logs:
```
[INFO] Running migrations in PRODUCTION mode...
✅ 1766961170935_create_generated_images_table.js executed
✅ 1767013077519_add_feedback_system.js executed
✅ 1767013447034_add_cost_tracking.js executed
```

### Via Teste na Aplicação:
1. Acesse a URL de produção
2. Vá em `/studio`
3. Tente informar um email
4. Se funcionar, as migrations foram aplicadas! ✅

---

## Script para Verificar Tabelas em Produção

Se tiver acesso ao `DATABASE_URL` de produção, pode verificar localmente:

```bash
# Temporariamente, mude DATABASE_URL no .env.local para o de produção
# Depois execute:
node scripts/check-tables.js
```

**Resultado esperado:**
```
✅ Table "users" exists
✅ Table "feedbacks" exists
✅ Table "generated_images" exists
```

---

## ⚠️ IMPORTANTE

**NUNCA** execute migrations de teste/dev no banco de produção!

Sempre use:
```bash
npm run migrate:prod  # Para produção
npm run migrate:test  # Para desenvolvimento
```

---

## Troubleshooting

### Erro: "DATABASE_URL not set"
**Solução:** O Railway deve configurar automaticamente. Verifique em Settings → Variables.

### Erro: "Migration already executed"
**Solução:** Tudo certo! As migrations já foram aplicadas.

### Erro: "Connection refused"
**Solução:** Verifique se o banco Neon está ativo e acessível.

---

## Próximos Passos

Após aplicar as migrations:

1. ✅ Teste o cadastro de email
2. ✅ Teste a geração de imagens
3. ✅ Teste o feedback
4. ✅ Verifique os logs de custo

**Tudo deve funcionar perfeitamente!** 🚀
