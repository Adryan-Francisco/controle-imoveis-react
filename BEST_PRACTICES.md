# 📋 Guia de Melhores Práticas - Controle de Imóveis React

## 🎯 Objetivo
Melhorar a qualidade, manutenibilidade e performance da aplicação através de padrões e boas práticas estabelecidas.

---

## 📁 Estrutura de Diretórios

```
src/
├── components/        # Componentes React reutilizáveis
├── hooks/            # Custom React hooks
├── pages/            # Páginas/Views da aplicação
├── services/         # Integração com APIs externas
├── stores/           # Estado global (Zustand)
├── utils/            # Funções utilitárias
│   ├── logger.js           # ✨ Logger centralizado
│   ├── formatters.js       # ✨ Formatadores reutilizáveis
│   ├── companyFactory.js   # ✨ Factory para criação de dados
│   └── validation.js       # Validação de dados
├── constants/        # Constantes da aplicação
├── config/          # Configuração da aplicação
└── styles/          # Estilos globais
```

---

## 🔧 Novas Utilidades

### 1. **Logger Centralizado** (`utils/logger.js`)
Centraliza todos os logs da aplicação com suporte a diferentes níveis.

```javascript
import { logger } from '@/utils/logger';

// Diferentes níveis
logger.debug('Mensagem de debug', { dados: true });
logger.info('Informação', { usuário: 'João' });
logger.warn('Aviso importante');
logger.error('Erro crítico', errorObject);
```

**Características:**
- ✅ Armazena histórico de logs
- ✅ Envia erros críticos para monitoramento (pronto para Sentry/LogRocket)
- ✅ Formatação colorida em desenvolvimento
- ✅ Rastreamento de timestamps

---

### 2. **Formatadores Reutilizáveis** (`utils/formatters.js`)
Funções centralizadas para formatação de dados.

```javascript
import { formatCurrency, formatDate, formatCNPJ, formatPhone } from '@/utils/formatters';

formatCurrency(1500)        // R$ 1.500,00
formatDate('2025-01-17')    // 17/01/2025
formatCNPJ('12345678000190') // 12.345.678/0001-90
formatPhone('11987654321')  // (11) 98765-4321
```

---

### 3. **Factory Pattern para Dados** (`utils/companyFactory.js`)
Centraliza a criação de estruturas de dados consistentes.

```javascript
import { createCompany, createBoleto, INITIAL_COMPANIES } from '@/utils/companyFactory';

// Criar empresa com defaults
const newCompany = createCompany({
  name: 'Minha Empresa',
  cnpj: '12.345.678/0001-90'
});

// Criar boleto
const boleto = createBoleto(companyId, {
  amount: 500,
  barcode: '12345...'
});
```

---

### 4. **Hook para Operações Assíncronas** (`hooks/useAsyncOperation.js`)
Gerencia loading, erros e retry automático.

```javascript
import { useAsyncOperation } from '@/hooks/useAsyncOperation';

const { data, loading, error, execute, retry, canRetry } = useAsyncOperation(
  async (id) => {
    const response = await api.get(`/companies/${id}`);
    return response.data;
  },
  (result) => console.log('Sucesso:', result),
  (error) => console.log('Erro:', error)
);

// Executar operação
await execute(123);

// Tentar novamente se falhar
if (error) {
  await retry(123);
}
```

---

## ✅ Checklist de Qualidade

### Para Cada Novo Hook/Utilidade:
- [ ] Usar `logger` para rastrear operações
- [ ] Adicionar validação de entrada
- [ ] Incluir documentação JSDoc
- [ ] Centralizar dados no `factory.js`
- [ ] Usar formatadores de `formatters.js`
- [ ] Tratamento de erro adequado

### Para Cada Componente:
- [ ] Usar `ErrorBoundary` no layout
- [ ] Implementar loading/error states
- [ ] Usar `useAsyncOperation` para requisições
- [ ] Aplicar acessibilidade (aria-labels, etc)
- [ ] Ser responsivo

### Para Cada Função de API:
- [ ] Usar `useAsyncOperation` para requisições
- [ ] Implementar retry automático
- [ ] Logar erros com `logger.error()`
- [ ] Validar response com schemas

---

## 🚀 Melhorias Implementadas

### ✨ Refatoração do `useCompanies.js`
**Antes:**
- Dados iniciais hardcoded no hook
- Logs simples com `console.log()`
- Sem validação de entrada
- Tratamento de erro genérico

**Depois:**
- ✅ Factory centralizado para dados
- ✅ Logger com rastreamento completo
- ✅ Validação de entrada
- ✅ Erros descritivos para o usuário
- ✅ Retry automático nos erros

### 🛡️ Error Boundary Melhorado
- ✅ Retry automático até 3 tentativas
- ✅ Tracking de tentativas com logger
- ✅ UI melhorada com feedback ao usuário
- ✅ Limite de tentativas antes de recarga

### 📊 Constantes Organizadas
- ✅ Status types e labels centralizados
- ✅ Cores para status definidas
- ✅ Regimes de tributação
- ✅ Timeouts para debounce

---

## 🔍 Exemplos de Uso

### Criar Empresa com Validação
```javascript
const addCompany = useCallback((formData) => {
  try {
    validateAndThrow(companySchema, formData);
    const newCompany = addCompany(formData);
    logger.info('Empresa criada', { id: newCompany.id, name: formData.name });
    return newCompany;
  } catch (error) {
    logger.error('Falha ao criar empresa', error);
    throw error;
  }
}, []);
```

### Formatar Valores em Tabela
```javascript
<Table>
  <tbody>
    {companies.map(company => (
      <tr key={company.id}>
        <td>{company.name}</td>
        <td>{formatCNPJ(company.cnpj)}</td>
        <td>{formatCurrency(company.monthlyFee)}</td>
        <td>{formatDate(company.createdAt)}</td>
      </tr>
    ))}
  </tbody>
</Table>
```

### Requisição com Retry
```javascript
const { data, execute, retry, loading, error } = useAsyncOperation(
  async () => {
    return await api.get('/companies');
  }
);

useEffect(() => {
  execute();
}, []);

if (error) {
  return <Button onClick={() => retry()}>Tentar Novamente</Button>;
}
```

---

## 📝 Commits Recomendados

```bash
# Refatoração com melhorias
git commit -m "refactor: melhorar sistema com logger, factory e formatadores centralizados"

# Cada feature/fix específico
git commit -m "feat: adicionar retry automático no ErrorBoundary"
git commit -m "fix: validação de entrada em useCompanies"
```

---

## 🎓 Próximas Melhorias Sugeridas

1. **Testes Automatizados**
   - [ ] Testes unitários para formatadores
   - [ ] Testes para factory
   - [ ] Testes para logger

2. **Monitoramento**
   - [ ] Integração com Sentry
   - [ ] Analytics para rastreamento de erros
   - [ ] Dashboard de métricas

3. **Performance**
   - [ ] Memoização de componentes
   - [ ] Code splitting
   - [ ] Lazy loading de rotas

4. **Documentação**
   - [ ] Storybook para componentes
   - [ ] API docs
   - [ ] Guia de contribuição

---

## 📞 Suporte
Para dúvidas sobre essas boas práticas, refira-se a este documento ou à documentação de cada utilitário.
