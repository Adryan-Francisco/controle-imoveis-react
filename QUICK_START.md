# 🚀 Quick Start - Usando as Melhorias

## 1️⃣ Logger - Rastreie tudo

```javascript
import { logger } from '@/utils/logger';

// Em qualquer lugar do código:
logger.debug('Carregando dados...', { userId: 123 });
logger.info('Usuário fez login', { email: 'user@example.com' });
logger.warn('API lenta detectada', { responseTime: 5000 });
logger.error('Falha ao salvar', error);
```

---

## 2️⃣ Formatadores - Use em seus componentes

```jsx
import { 
  formatCurrency, 
  formatDate, 
  formatCNPJ,
  formatPhone,
  statusToLabel 
} from '@/utils/formatters';

// Em componentes React:
<Table>
  <tr>
    <td>{formatCNPJ(company.cnpj)}</td>
    <td>{formatCurrency(company.monthlyFee)}</td>
    <td>{formatDate(company.createdAt)}</td>
    <td>{formatPhone(company.phone)}</td>
    <td>{statusToLabel(boleto.status)}</td>
  </tr>
</Table>
```

---

## 3️⃣ Factory - Crie dados consistentes

```javascript
import { createCompany, createBoleto, INITIAL_COMPANIES } from '@/utils/companyFactory';

// Novo hook com dados iniciais:
export const useCompanies = (useInitialData = false) => {
  const [companies, setCompanies] = useState(() =>
    useInitialData ? INITIAL_COMPANIES : []
  );
};

// Criar nova empresa (sempre com estrutura correta):
const newCompany = createCompany({
  name: 'Minha Empresa',
  cnpj: '12.345.678/0001-90',
  email: 'empresa@example.com'
});

// Criar boleto:
const boleto = createBoleto(companyId, {
  amount: 500,
  barcode: '12345678901234567890123456789012345678901234567',
  dueDate: '2025-02-05'
});
```

---

## 4️⃣ Usar useAsyncOperation em requisições

```javascript
import { useAsyncOperation } from '@/hooks/useAsyncOperation';

export function CompanyList() {
  const { data: companies, loading, error, execute, retry, canRetry } = useAsyncOperation(
    async () => {
      const response = await api.get('/companies');
      return response.data;
    }
  );

  useEffect(() => {
    execute();
  }, []);

  if (loading) return <LoadingSpinner />;
  
  if (error) {
    return (
      <Alert>
        {error}
        {canRetry && <Button onClick={retry}>Tentar Novamente</Button>}
      </Alert>
    );
  }

  return (
    <Table>
      {companies.map(company => (
        <tr key={company.id}>
          <td>{company.name}</td>
        </tr>
      ))}
    </Table>
  );
}
```

---

## 5️⃣ Refatorar hooks existentes

**Passo 1:** Adicionar logger
```javascript
import { logger } from '@/utils/logger';

// Dentro do seu hook:
logger.info('Operação iniciada', { companyId });
```

**Passo 2:** Usar factory para criar dados
```javascript
import { createCompany } from '@/utils/companyFactory';

const newCompany = createCompany(data);
```

**Passo 3:** Adicionar validação
```javascript
if (!data.name || !data.cnpj) {
  throw new Error('Nome e CNPJ são obrigatórios');
}
```

---

## 6️⃣ Usar constantes em vez de valores mágicos

**Antes:**
```javascript
const status = 'pago'; // Mágico!
const regime = 'simples_nacional'; // Mágico!
```

**Depois:**
```javascript
import { BOLETO_STATUS, REGIME_TYPES } from '@/constants';

const status = BOLETO_STATUS.PAGO;
const regime = REGIME_TYPES.SIMPLES_NACIONAL;

// Mesmo com labels:
import { REGIME_LABELS } from '@/constants';
console.log(REGIME_LABELS[regime]); // "Simples Nacional"
```

---

## 🎯 Checklist para Implementar em Novo Código

- [ ] Import `logger` para rastrear operações
- [ ] Usar `formatadores` em displays de data/moeda
- [ ] Usar `factory` para criar novas instâncias
- [ ] Usar `CONSTANTS` em vez de valores mágicos
- [ ] Adicionar validação em inputs críticos
- [ ] Usar `useAsyncOperation` para requisições
- [ ] Tratar erros com mensagens descritivas

---

## 🔍 Debugging

**Ver todos os logs:**
```javascript
import { logger } from '@/utils/logger';

// No console:
console.log(logger.getLogs());
```

**Limpar logs:**
```javascript
logger.clearLogs();
```

---

## 💡 Tips & Tricks

### 1. Formatar múltiplos campos
```javascript
const formattedCompany = {
  name: company.name,
  cnpj: formatCNPJ(company.cnpj),
  phone: formatPhone(company.phone),
  fee: formatCurrency(company.monthlyFee),
  created: formatDate(company.createdAt),
  status: statusToLabel(company.status)
};
```

### 2. Validação em entrada
```javascript
const handleAddCompany = (data) => {
  try {
    if (!data.name?.trim()) throw new Error('Nome obrigatório');
    if (!data.cnpj?.length === 14) throw new Error('CNPJ inválido');
    
    addCompany(data);
    logger.info('Empresa adicionada');
  } catch (err) {
    logger.error('Erro ao adicionar', err);
    showNotification({ type: 'error', message: err.message });
  }
};
```

### 3. Tratamento de erro com retry
```javascript
const handleFetch = async () => {
  try {
    await execute();
  } catch (err) {
    if (canRetry) {
      await retry();
    } else {
      showNotification({ 
        type: 'error', 
        message: 'Falha. Recarregue a página' 
      });
    }
  }
};
```

---

## 📊 Estrutura de Pastas Atualizada

```
src/
├── components/
│   └── ErrorBoundary.jsx ✨ (melhorado com retry)
├── hooks/
│   ├── useCompanies.js ✨ (refatorado)
│   ├── useAsyncOperation.js ✨ (novo)
│   └── ...
├── utils/
│   ├── logger.js ✨ (novo)
│   ├── formatters.js ✨ (novo)
│   ├── companyFactory.js ✨ (novo)
│   ├── validation.js
│   └── ...
├── constants/
│   └── index.js ✨ (melhorado)
└── ...
```

---

## 🆘 Troubleshooting

**Logger não aparece no console?**
- Verifique se `import.meta.env.MODE === 'development'`

**Formatadores retornam undefined?**
- Certifique-se de passar valores válidos (não null/undefined)

**useAsyncOperation não faz retry?**
- Verifique se `canRetry` é true antes de chamar `retry()`

---

## 📞 Referência Rápida

| Utilidade | Import | Uso |
|-----------|--------|-----|
| Logger | `import { logger } from '@/utils/logger'` | `logger.info()` |
| Formatadores | `import { formatCurrency } from '@/utils/formatters'` | `formatCurrency(100)` |
| Factory | `import { createCompany } from '@/utils/companyFactory'` | `createCompany(data)` |
| Async Op | `import { useAsyncOperation } from '@/hooks/useAsyncOperation'` | `useAsyncOperation(fn)` |
| Constants | `import { BOLETO_STATUS } from '@/constants'` | `BOLETO_STATUS.PAGO` |

---

**Perguntas? Consulte `BEST_PRACTICES.md` para documentação completa!**
