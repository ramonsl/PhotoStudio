# Troubleshooting: "Failed to upload files" em Produção

## 🔍 Diagnóstico

O erro "Failed to upload files" indica que o upload para o Cloudinary está falhando. As causas mais comuns são:

1. ❌ Variáveis de ambiente não configuradas no Railway
2. ❌ Credenciais incorretas
3. ❌ Cloud name incorreto

---

## ✅ Solução: Verificar Variáveis no Railway

### Passo 1: Acessar Railway Dashboard

1. Acesse: https://railway.app
2. Selecione o projeto **PhotoStudio**
3. Vá em **Settings → Variables**

### Passo 2: Verificar Variáveis Obrigatórias

Certifique-se de que as seguintes variáveis estão configuradas:

```
CLOUDINARY_API_KEY=***REMOVIDO***
CLOUDINARY_API_SECRET=***REMOVIDO***
GEMINI_API_KEY=sua-chave-aqui
```

### Passo 3: Formato Correto

**❌ ERRADO:**
```json
{
  "CLOUDINARY_API_KEY": {
    "value": "***REMOVIDO***"
  }
}
```

**✅ CORRETO (Raw Editor):**
```
CLOUDINARY_API_KEY=***REMOVIDO***
CLOUDINARY_API_SECRET=***REMOVIDO***
GEMINI_API_KEY=sua-chave-aqui
```

**OU (JSON Import):**
```json
{
  "CLOUDINARY_API_KEY": "***REMOVIDO***",
  "CLOUDINARY_API_SECRET": "***REMOVIDO***",
  "GEMINI_API_KEY": "sua-chave-aqui"
}
```

---

## 🔧 Como Configurar no Railway

### Opção 1: Raw Editor (Recomendado)

1. Clique em **"Raw Editor"**
2. Cole:
```
CLOUDINARY_API_KEY=***REMOVIDO***
CLOUDINARY_API_SECRET=***REMOVIDO***
GEMINI_API_KEY=sua-nova-chave
```
3. Clique em **"Update Variables"**

### Opção 2: Adicionar Manualmente

1. Clique em **"+ New Variable"**
2. Adicione uma por uma:
   - Nome: `CLOUDINARY_API_KEY`, Valor: `***REMOVIDO***`
   - Nome: `CLOUDINARY_API_SECRET`, Valor: `***REMOVIDO***`
   - Nome: `GEMINI_API_KEY`, Valor: `sua-nova-chave`

---

## 🧪 Testar Configuração

### Ver Logs do Railway

```bash
railway logs --tail
```

**Logs esperados (SUCESSO):**
```
[INFO] File uploaded to Cloudinary {
  cloudinary_url: 'https://res.cloudinary.com/dmqf55xzl/...'
}
```

**Logs de erro (FALHA):**
```
[WARN] Cloudinary credentials not configured
[ERROR] Error uploading files to Cloudinary
```

---

## 🔍 Verificar Cloudinary Dashboard

1. Acesse: https://cloudinary.com/console
2. Vá em **Settings → Security**
3. Verifique:
   - Cloud Name: `dmqf55xzl` ✅
   - API Key: `***REMOVIDO***` ✅
   - API Secret: `***REMOVIDO***` ✅

---

## 📋 Checklist de Verificação

- [ ] Variáveis configuradas no Railway
- [ ] Cloud name correto (`dmqf55xzl`)
- [ ] API Key correto (`***REMOVIDO***`)
- [ ] API Secret correto (`***REMOVIDO***`)
- [ ] Deploy refeito após adicionar variáveis
- [ ] Logs verificados

---

## 🚨 Erro Comum: Variáveis Não Aplicadas

**Problema:** Variáveis adicionadas mas não aplicadas

**Solução:**
1. Após adicionar variáveis, o Railway deve fazer **redeploy automático**
2. Se não acontecer, force um redeploy:
   - Settings → Deployments → Latest → Redeploy

---

## 🧪 Teste Local vs Produção

### Local (Funcionando)
```bash
# .env.local
CLOUDINARY_API_KEY=***REMOVIDO***
CLOUDINARY_API_SECRET=***REMOVIDO***
```

### Produção (Railway)
```
Mesmas variáveis devem estar em:
Railway → Settings → Variables
```

---

## 📞 Próximos Passos

1. **Configure as variáveis no Railway**
2. **Aguarde o redeploy** (2-3 minutos)
3. **Teste o upload** na URL de produção
4. **Verifique os logs**: `railway logs --tail`

Se o erro persistir após configurar as variáveis, me avise e vou investigar mais a fundo! 🔍
