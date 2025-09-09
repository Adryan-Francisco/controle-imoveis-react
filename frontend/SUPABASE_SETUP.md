# Configuração do Supabase

## 🔧 **Passos para Resolver os Erros de CORS**

### **1. Configurar CORS no Supabase Dashboard**

1. Acesse o [Supabase Dashboard](https://supabase.com/dashboard)
2. Selecione seu projeto
3. Vá em **Settings** > **API**
4. Na seção **CORS**, adicione as seguintes URLs:
   ```
   http://localhost:5173
   http://localhost:3000
   http://127.0.0.1:5173
   http://127.0.0.1:3000
   ```

### **2. Configurar Row Level Security (RLS)**

1. No Supabase Dashboard, vá em **Authentication** > **Policies**
2. Crie uma política para a tabela `ControleImoveisRurais`:

```sql
-- Política para SELECT
CREATE POLICY "Users can view their own imoveis" ON "public"."ControleImoveisRurais"
FOR SELECT USING (auth.uid() = user_id);

-- Política para INSERT
CREATE POLICY "Users can insert their own imoveis" ON "public"."ControleImoveisRurais"
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Política para UPDATE
CREATE POLICY "Users can update their own imoveis" ON "public"."ControleImoveisRurais"
FOR UPDATE USING (auth.uid() = user_id);

-- Política para DELETE
CREATE POLICY "Users can delete their own imoveis" ON "public"."ControleImoveisRurais"
FOR DELETE USING (auth.uid() = user_id);
```

### **3. Habilitar RLS na Tabela**

```sql
ALTER TABLE "public"."ControleImoveisRurais" ENABLE ROW LEVEL SECURITY;
```

### **4. Configurar Variáveis de Ambiente**

Crie um arquivo `.env` na pasta `frontend` com:

```env
VITE_SUPABASE_URL=https://ylfmefcvwkaxqrmugwjm.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlsZm1lZmN2d2theHFybXVnd2ptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUyNjE5MzAsImV4cCI6MjA3MDgzNzkzMH0.uEEdwKyJccQbVof1z3dgqnEXCVySWE0DA1jr5h-s_mk
```

### **5. Verificar Configurações de Autenticação**

1. No Supabase Dashboard, vá em **Authentication** > **Settings**
2. Verifique se **Enable email confirmations** está desabilitado para desenvolvimento
3. Verifique se **Enable phone confirmations** está desabilitado
4. Em **Site URL**, adicione: `http://localhost:5173`

### **6. Testar a Conexão**

Após fazer essas configurações:

1. Reinicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

2. Abra o console do navegador (F12)
3. Verifique se os erros de CORS desapareceram

## 🚨 **Se os Erros Persistirem**

### **Opção 1: Usar Proxy no Vite**

Adicione no `vite.config.js`:

```javascript
export default defineConfig({
  // ... outras configurações
  server: {
    proxy: {
      '/api': {
        target: 'https://ylfmefcvwkaxqrmugwjm.supabase.co',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
```

### **Opção 2: Desabilitar CORS no Navegador (Apenas para Desenvolvimento)**

⚠️ **ATENÇÃO: Use apenas para desenvolvimento!**

Inicie o Chrome com:
```bash
chrome.exe --user-data-dir="C:/Chrome dev session" --disable-web-security --disable-features=VizDisplayCompositor
```

## ✅ **Verificação Final**

Após seguir todos os passos, você deve ver:

1. ✅ Sem erros de CORS no console
2. ✅ Autenticação funcionando
3. ✅ Dados carregando corretamente
4. ✅ Sem erros 403 Forbidden

## 📞 **Suporte**

Se ainda houver problemas, verifique:

1. Se as credenciais do Supabase estão corretas
2. Se a tabela `ControleImoveisRurais` existe
3. Se as políticas RLS estão configuradas corretamente
4. Se o projeto Supabase está ativo e não pausado

