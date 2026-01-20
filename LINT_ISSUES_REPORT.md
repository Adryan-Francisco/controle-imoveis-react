# 🎯 Plano de Ação - Correções Prioritárias

## 📊 Status Atual
- **Total de Erros:** 234 erros + 12 warnings
- **Prioridade:** Alta - Impede build/deploy

---

## 🚨 PRIORIDADE 1 - Críticos (Bloqueadores)

### 1. **React Hooks chamados condicionalmente** (6 erros)
**Arquivos afetados:**
- `src/components/OfflineStatus.jsx` - useEffect condicional
- `src/pages/CompaniesPage.jsx` - useCompanies e useCompaniesSupabase condicionais

**Impacto:** Quebra comportamento do React
**Solução:** Mover hooks para o topo do componente, usar estado para lógica condicional

---

### 2. **Hooks sendo chamados dentro de callbacks** (25 erros)
**Arquivo crítico:** `src/hooks/usePerformanceOptimization.js` (14 erros sozinho!)

**Impacto:** Violação das regras dos hooks
**Solução:** Refatorar para usar hooks no escopo do componente, não dentro de callbacks

---

### 3. **Variáveis globais não definidas** (34 erros)
**Arquivos de teste:**
- `src/test/**` - faltam configurações de globals (describe, test, expect, jest, vi)

**Impacto:** Testes não rodam
**Solução:** Configurar ESLint para ambientes de teste

---

## 🔧 PRIORIDADE 2 - Importantes (7 arquivos)

### Imports não utilizados (50+ erros de no-unused-vars)
**Arquivos com mais problemas:**
- `src/hooks/useCompanies.js` - 3 erros
- `src/hooks/usePerformanceOptimization.js` - múltiplos
- `src/components/AuthProvider.jsx` - Export functions problema

**Solução:** Remover imports não utilizados

---

## 📝 PRIORIDADE 3 - Importantes (Configurações)

### ESLint Config Issues
- `.eslintignore` deprecated - usar `ignores` em `eslint.config.js`
- Falta configuração para globals de teste

---

## 🎁 PRIORIDADE 4 - Melhorias (Limpeza)

### React dependencies warnings
- `useCompaniesSupabase.js` - 7 warnings de missing dependencies
- `ImovelForm.jsx` - missing dependencies
- `useOfflineSync.js` - missing dependencies

---

## 💪 COMEÇANDO AS CORREÇÕES

Vou iniciar por ordem de criticidade. Qual problema você quer que eu corrija primeiro?

1. **Hooks condicionais** (rápido, impacto alto)
2. **usePerformanceOptimization** (muitos erros num só arquivo)
3. **Configuração de testes** (globais ESLint)
4. **Limpeza de imports** (rápido)
5. **Tudo** (correção automática de todos os 246 erros)
