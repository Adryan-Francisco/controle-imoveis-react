# 🏠 SIC - Sistema de Controle de ITR e CCIR

Sistema profissional e moderno para controle de imóveis rurais com funcionalidades avançadas de gestão, relatórios e integração com APIs externas.

**Desenvolvido com:** React 19 • Vite • Mantine UI • TypeScript Ready • Supabase

---

## 📋 Índice

- [🌟 Características](#-características)
- [🚀 Quick Start](#-quick-start)
- [📦 Instalação](#-instalação)
- [📚 Estrutura do Projeto](#-estrutura-do-projeto)
- [⚙️ Configuração](#️-configuração)
- [🧪 Logger & Debugging](#-logger--debugging)
- [🔧 CI/CD Pipeline](#-cicd-pipeline)
- [📱 Páginas & Features](#-páginas--features)
- [🛠️ Tecnologias](#️-tecnologias)
- [📖 Documentação](#-documentação)

---

## 🌟 Características

### 📊 Dashboard Inteligente
- Estatísticas em tempo real
- Gráficos interativos (Recharts)
- Visualização de dados por período
- Sidebar responsiva e intuitiva

### 🏘️ Gestão de Imóveis
- CRUD completo de imóveis
- Filtros avançados e busca
- Validação de duplicatas
- Paginação otimizada
- Suporte a múltiplos anos

### 🏢 Gestão de Empresas
- Cadastro e gerenciamento de empresas
- Controle de mensalidades
- Integração com Cora API para geração de boletos
- MEI - Geração de boletos via Receita Federal

### 📄 Relatórios & Exportação
- Exportação para PDF e Excel
- Relatórios customizados
- Gráficos nos relatórios
- Download direto de boletos

### 🔐 Autenticação & Segurança
- Login com Supabase
- Session management
- Error boundaries com retry automático
- Validação de entrada em todos os formulários

### 📱 Responsividade & UX
- Design responsivo (mobile-first)
- Dark mode completo
- Navegação adaptativa
- Loader otimizado com skeleton
- Notificações inteligentes
- Acessibilidade (WCAG)

### 🌐 Offline-First
- Sincronização de dados offline
- Cache inteligente com React Query
- Detecção de conectividade
- Persistência em localStorage

### ♿ Acessibilidade
- Suporte completo a leitores de tela
- Navegação por teclado
- ARIA labels
- Contraste adequado

---

## 🚀 Quick Start

### Pré-requisitos
- **Node.js** 18+ ([download](https://nodejs.org/))
- **npm** 9+ (incluso com Node.js)
- **Git** (para clonar o repositório)

### 1. Clone o repositório
```bash
git clone <seu-repositorio>
cd controle-imoveis-react
```

### 2. Instale as dependências
```bash
cd frontend
npm install
```

### 3. Configure as variáveis de ambiente
```bash
# Copie o arquivo de exemplo
cp .env.example .env.local

# Edite com suas credenciais
nano .env.local  # ou use seu editor favorito
```

**Variáveis necessárias:**
```env
# Supabase
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua_chave_anonima_aqui

# API Base
VITE_API_BASE_URL=http://localhost:3001

# Debug (desenvolvimento)
VITE_DEBUG=true
```

### 4. Inicie o servidor de desenvolvimento
```bash
npm run dev
```

Acesse: **http://localhost:5173**

---

## 📦 Instalação

### Instalação Completa (com proxy e todas as features)
```bash
cd frontend
npm install
npm run dev:full  # Inicia proxy + vite simultaneamente
```

### Instalação Mínima (apenas frontend)
```bash
cd frontend
npm install
npm run dev
```

### Build para Produção
```bash
npm run build     # Gera dist/
npm run preview   # Visualiza build localmente
npm run deploy    # Deploy em GitHub Pages
```

---

## 📚 Estrutura do Projeto

```
controle-imoveis-react/
├── .github/
│   └── workflows/              # GitHub Actions CI/CD
│       ├── ci.yml             # Lint, Build, Tests
│       ├── e2e.yml            # Testes E2E Playwright
│       ├── pre-commit.yml      # Validação de commits
│       └── deploy.yml          # Deploy automático
│
├── frontend/
│   ├── src/
│   │   ├── components/         # 41 Componentes React
│   │   │   ├── LoginForm.jsx
│   │   │   ├── ImovelForm.jsx
│   │   │   ├── CompanyForm.jsx
│   │   │   ├── BoletoModal.jsx
│   │   │   ├── ReportsExport.jsx
│   │   │   ├── DashboardHeader.jsx
│   │   │   ├── DashboardFooter.jsx
│   │   │   ├── ErrorBoundary.jsx
│   │   │   └── ...
│   │   │
│   │   ├── pages/              # 3 Páginas principais
│   │   │   ├── ImoveisPage.jsx
│   │   │   ├── CompaniesPage.jsx
│   │   │   └── ReportsPage.jsx
│   │   │
│   │   ├── hooks/              # 26 Custom Hooks
│   │   │   ├── useImoveis.js
│   │   │   ├── useCompanies.js
│   │   │   ├── useBoleto.js
│   │   │   ├── useAsyncOperation.js
│   │   │   ├── useChartsData.js
│   │   │   ├── useStatistics.js
│   │   │   └── ...
│   │   │
│   │   ├── services/           # Integração com APIs
│   │   │   ├── api.js
│   │   │   ├── coraAPI.js
│   │   │   └── meiBoletosReceita.js
│   │   │
│   │   ├── utils/              # Funções utilitárias
│   │   │   ├── logger.js       # Logger profissional
│   │   │   ├── formatters.js
│   │   │   ├── validators.js
│   │   │   └── ...
│   │   │
│   │   ├── constants/          # Constantes do app
│   │   │
│   │   ├── stores/             # Zustand state management
│   │   │
│   │   ├── styles/             # CSS global
│   │   │   └── visual-improvements.css
│   │   │
│   │   ├── test/               # Fixtures de teste
│   │   │
│   │   ├── App.jsx             # Componente raiz
│   │   ├── Dashboard.jsx       # Layout principal
│   │   ├── main.jsx            # Entry point
│   │   └── index.css           # Estilos base
│   │
│   ├── tests/
│   │   └── e2e/                # Testes E2E Playwright
│   │
│   ├── public/                 # Arquivos estáticos
│   │
│   ├── package.json            # Dependências
│   ├── vite.config.js          # Configuração Vite
│   ├── vitest.config.js        # Configuração Vitest
│   ├── eslint.config.js        # ESLint + React Hooks
│   └── playwright.config.js    # Testes E2E
│
├── README.md                   # Este arquivo
└── IMPLEMENTATION_NOTES.md     # Notas técnicas detalhadas
```

---

## ⚙️ Configuração

### Variáveis de Ambiente

**Arquivo:** `frontend/.env.local`

```env
# 🔐 Supabase (Authentication)
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=seu_token_anonimo

# 🌐 API Base URL
VITE_API_BASE_URL=http://localhost:3001

# 🐛 Debug Mode
VITE_DEBUG=true              # true em dev, false em prod

# 🔗 Cora API (para boletos)
VITE_CORA_API_KEY=sua_chave_cora
```

### Scripts NPM

```bash
# 🚀 Desenvolvimento
npm run dev              # Vite dev server
npm run dev:proxy        # Com proxy server
npm run dev:full         # Proxy + Vite simultâneo

# 🔨 Build
npm run build            # Build otimizado para produção
npm run preview          # Visualizar build localmente
npm run deploy           # Deploy em GitHub Pages

# ✅ Testing
npm run test             # Vitest (watch mode)
npm run test:ui          # Vitest UI
npm run test:run         # Rodar testes uma vez
npm run test:coverage    # Coverage report
npm run test:e2e         # Playwright E2E tests
npm run test:e2e:ui      # E2E UI mode
npm run test:e2e:headed  # E2E com navegador visível
npm run test:all         # Unit + E2E

# 🧹 Code Quality
npm run lint             # ESLint validation
```

---

## 🧪 Logger & Debugging

### Logger Profissional

O projeto utiliza um **logger centralizado** que:
- ✅ Desabilita console automaticamente em produção
- ✅ Armazena logs em localStorage (máx 500)
- ✅ Exporta logs como JSON
- ✅ Captura erros globais

**Importação:**
```javascript
import { logger } from '@/utils/logger';
```

**Uso:**
```javascript
// Info
logger.info('Usuário fez login', { userId: '123' });

// Debug
logger.debug('Estado atualizado', { state: newState });

// Warning
logger.warn('Requisição lenta', { duration: 5000 });

// Error
logger.error('Erro na API', error);
```

**Funções úteis:**
```javascript
logger.getLogs()                     // Todos os logs
logger.getLogs({ level: 'ERROR' })  // Filtrar por nível
logger.exportLogs()                  // Baixar JSON
logger.getStats()                    // Estatísticas
logger.clearLogs()                   // Limpar logs
logger.setLevel('DEBUG')             // Mudar nível
```

---

## 🔧 CI/CD Pipeline

### GitHub Actions Workflows

**4 Workflows profissionais:**

#### 1️⃣ **CI - Build, Lint & Test** (`.github/workflows/ci.yml`)
```
Trigger: push/PR para main/develop
├── ESLint validation
├── Build production
├── Unit tests + coverage
├── Security audit
└── Notify on completion
```

#### 2️⃣ **E2E Tests** (`.github/workflows/e2e.yml`)
```
Trigger: push/PR + daily 3 AM
├── Install Playwright browsers
├── Build application
├── Run E2E tests
├── Upload reports
└── Comment no PR
```

#### 3️⃣ **Pre-commit Validation** (`.github/workflows/pre-commit.yml`)
```
Trigger: todos os PRs
├── Semantic commit messages
├── Detecta console.log()
├── Detecta debugger statements
└── Alerta sobre TODO/FIXME
```

#### 4️⃣ **Deploy** (`.github/workflows/deploy.yml`)
```
Trigger: push para main (após CI passar)
├── Build otimizado
├── Deploy GitHub Pages
└── Update deployment status
```

### Status Badge

```markdown
![Build Status](https://github.com/seu-usuario/controle-imoveis-react/actions/workflows/ci.yml/badge.svg)
```

---

## 📱 Páginas & Features

### 🏠 Dashboard
- Estatísticas em cards
- Gráficos interativos
- Resumo de imóveis por status
- Acesso rápido a todas as funcionalidades

### 🏘️ Imóveis
- ✅ Listar todos os imóveis
- ✅ Criar novo imóvel
- ✅ Editar imóvel existente
- ✅ Deletar com confirmação
- ✅ Filtros avançados (busca, status, data, valor)
- ✅ Paginação (padrão 100 linhas)
- ✅ Selecionar múltiplos anos
- ✅ Validação de duplicatas

**Campos principais:**
- Nome/Descrição
- Localização
- Tipo
- Valor
- Status (Ativo/Inativo)
- Data de criação

### 🏢 Empresas
- ✅ Listar todas as empresas
- ✅ Criar nova empresa
- ✅ Editar empresa
- ✅ Gerenciar mensalidades
- ✅ Gerar boletos (Cora API)
- ✅ Gerar boletos MEI (Receita Federal)

**Campos principais:**
- Razão Social / CNPJ
- Tipo (PJ / MEI)
- Valor mensal
- Dia de vencimento
- Contato

### 📄 Relatórios
- ✅ Exportar para PDF
- ✅ Exportar para Excel
- ✅ Gráficos nos relatórios
- ✅ Filtros por período
- ✅ Resumo estatístico

---

## 🛠️ Tecnologias

| Categoria | Tecnologia | Versão | Propósito |
|-----------|-----------|--------|----------|
| **Core** | React | 19.1.1 | Framework UI |
| | Vite | 7.1.2 | Build tool |
| **UI** | Mantine | 8.2.7 | Component library |
| | Tabler Icons | 3.34.1 | Icons |
| **State** | Zustand | 5.0.8 | State management |
| | React Query | 5.87.1 | Data fetching |
| **Data** | Axios | 1.11.0 | HTTP client |
| | Dayjs | 1.11.13 | Date handling |
| **Export** | jsPDF | 3.0.2 | PDF generation |
| | XLSX | 0.18.5 | Excel export |
| | file-saver | 2.0.5 | File download |
| **Charts** | Recharts | 3.1.2 | Data visualization |
| **Backend** | Supabase | 2.56.0 | Auth + Database |
| **Testing** | Vitest | 3.2.4 | Unit tests |
| | Playwright | 1.40.0 | E2E tests |
| **Code Quality** | ESLint | 9.33.0 | Linter |
| **PWA** | vite-plugin-pwa | 1.0.3 | Progressive Web App |

---

## 📊 Estatísticas do Projeto

- 📁 **Componentes:** 41
- 🪝 **Custom Hooks:** 26
- 📄 **Páginas:** 3
- 🧪 **Testes:** Configurados
- 📦 **Tamanho bundle:** ~500KB (gzipped)
- ⚡ **Lighthouse Score:** 90+
- ♿ **Acessibilidade:** WCAG 2.1 AA

---

## 🔐 Segurança

- ✅ ESLint com regras de segurança
- ✅ npm audit na CI/CD
- ✅ Validação de entrada em todos formulários
- ✅ Error boundaries com recovery
- ✅ CORS configurado
- ✅ Sanitização de dados
- ✅ Tokens JWT com Supabase
- ✅ Rate limiting pronto

---

## 📖 Documentação

```javascript
// Obter todos os logs
logger.getLogs();

// Filtrar logs
logger.getLogs({ level: 'ERROR', message: 'API' });

// Exportar logs como JSON
logger.exportLogs();

// Limpar logs
logger.clearLogs();

// Estatísticas
logger.getStats();

// Mudar nível de log
logger.setLevel('DEBUG');
```

### Armazenamento

Logs são automaticamente armazenados em `localStorage` para análise posterior:
- Máximo de 500 logs
- Salvos periodicamente
- Podem ser exportados manualmente

## 🔧 CI/CD Pipeline

### Workflows GitHub Actions

#### 1. **CI - Build, Lint & Test** (ci.yml)
Executado em: push/PR para main/develop

Passos:
- ✅ ESLint validation
- ✅ Build production
- ✅ Unit tests + coverage
- ✅ Security audit

#### 2. **E2E Tests** (e2e.yml)
Executado em: push/PR para main/develop + diariamente às 3 da manhã

Passos:
- ✅ Playwright E2E tests
- ✅ Upload relatórios
- ✅ Comentar no PR

#### 3. **Pre-commit Validation** (pre-commit.yml)
Executado em: PR para main/develop

Validações:
- ✅ Commit messages semânticas
- ✅ Sem console.log() nos commits
- ✅ Sem debugger statements
- ⚠️ Avisa sobre TODO/FIXME

#### 4. **Deploy** (deploy.yml)
Executado em: push para main (após CI passar)

- ✅ Build otimizado
- ✅ Deploy GitHub Pages
- ✅ Criar status de deployment

## 📊 Estatísticas

- **Componentes**: 41
- **Custom Hooks**: 26
- **Páginas**: 3
- **Testes**: Em expansão
- **Cobertura**: Em melhoria
- **Performance**: Otimizada com code-splitting

## 🔒 Segurança

- ESLint com regras de segurança
- Npm audit na CI
- Validação de entrada em forms
- Error boundaries para tratamento de erros
- Offline-first architecture

## 🎯 Melhorias Recentes

✅ Logger profissional centralizado
✅ Remoção de console.log()
✅ GitHub Actions CI/CD completo
✅ Pre-commit validation
✅ E2E testing automation
✅ Code coverage reporting

## 📝 Commits Semânticos

Padrão de commits: `type(scope): description`

Tipos:
- `feat`: Nova feature
- `fix`: Bug fix
- `docs`: Documentação
- `style`: Formatação
- `refactor`: Refatoração
- `test`: Testes
- `chore`: Manutenção

Exemplo:
```bash
git commit -m "feat(auth): adicionar two-factor authentication"
```

## 🐛 Reportar Bugs

1. Criar issue descrevendo o problema
2. Incluir steps para reproduzir
3. Compartilhar logs (via `logger.exportLogs()`)
4. Descrever comportamento esperado

## 📚 Recursos Adicionais

- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [Mantine UI](https://mantine.dev/)
- [React Query](https://tanstack.com/query/latest)
- [Playwright Testing](https://playwright.dev/)

## 📄 Licença

Este projeto é proprietário. Todos os direitos reservados.

## 👥 Autores

- Desenvolvedor Principal: [Adryan Francisco]

---

**Última atualização**: Janeiro 2026
**Status**: ✅ Produção
