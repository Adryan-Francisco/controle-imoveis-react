# 🏡 Controle de Imóveis Rurais

Sistema moderno e robusto para controle de imóveis rurais, desenvolvido com React, Mantine UI e Supabase.

## ✨ Funcionalidades

### 🔐 Autenticação e Segurança
- **Autenticação segura** com Supabase Auth
- **Variáveis de ambiente** para credenciais sensíveis
- **Validação robusta** de dados no frontend
- **Error boundaries** para captura de erros

### 📊 Dashboard Inteligente
- **Estatísticas em tempo real** com cards interativos
- **Gráficos dinâmicos** (pizza e barras) com Recharts
- **Busca em tempo real** com debounce
- **Filtros avançados** por proprietário e sítio

### 🏗️ Arquitetura Moderna
- **Componentes reutilizáveis** e bem organizados
- **Hooks customizados** para lógica de negócio
- **Memoização** para otimização de performance
- **Lazy loading** de componentes pesados

### ♿ Acessibilidade
- **Navegação por teclado** completa
- **ARIA labels** e descrições
- **Alto contraste** e foco visível
- **Suporte a leitores de tela**

### 📱 PWA (Progressive Web App)
- **Instalação offline** no dispositivo
- **Service Worker** para cache inteligente
- **Notificações** de atualizações
- **Funcionalidade offline** básica

### 🧪 Qualidade e Testes
- **Testes unitários** com Vitest
- **Testes de integração** com Testing Library
- **Cobertura de código** configurada
- **Linting** rigoroso com ESLint

## 🚀 Tecnologias

- **React 19** - Framework principal
- **Mantine UI** - Biblioteca de componentes
- **Supabase** - Backend e autenticação
- **Vite** - Build tool e dev server
- **Vitest** - Framework de testes
- **Recharts** - Gráficos e visualizações

## 📦 Instalação

1. **Clone o repositório**
```bash
git clone <repository-url>
cd controle-imoveis-react/frontend
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**
```bash
cp .env.example .env
# Edite o arquivo .env com suas credenciais do Supabase
```

4. **Execute o projeto**
```bash
npm run dev
```

## 🔧 Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Gera build de produção
- `npm run preview` - Preview do build de produção
- `npm run test` - Executa testes em modo watch
- `npm run test:run` - Executa testes uma vez
- `npm run test:coverage` - Executa testes com cobertura
- `npm run test:ui` - Interface visual para testes
- `npm run lint` - Verifica código com ESLint

## 🏗️ Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── StatisticsCards.jsx
│   ├── ChartsSection.jsx
│   ├── ImovelForm.jsx
│   ├── ImovelTable.jsx
│   ├── ErrorBoundary.jsx
│   ├── LoadingSpinner.jsx
│   └── PWA components/
├── hooks/              # Hooks customizados
│   ├── useImoveis.js
│   ├── useStatistics.js
│   ├── useChartsData.js
│   ├── useDebounce.js
│   ├── useErrorHandler.js
│   └── usePWA.js
├── utils/              # Utilitários
│   └── validators.js
├── test/               # Configuração de testes
└── App.jsx            # Componente principal
```

## 🔒 Segurança

- **Credenciais protegidas** em variáveis de ambiente
- **Validação de dados** no frontend e backend
- **Sanitização** de inputs do usuário
- **Error boundaries** para captura de erros
- **Autenticação JWT** com Supabase

## ⚡ Performance

- **Memoização** de componentes pesados
- **Debounce** na busca para reduzir requisições
- **Lazy loading** de componentes
- **Code splitting** automático
- **Cache inteligente** com Service Worker

## 🧪 Testes

O projeto inclui uma suíte completa de testes:

```bash
# Executar todos os testes
npm run test

# Executar com cobertura
npm run test:coverage

# Interface visual
npm run test:ui
```

### Tipos de Testes
- **Testes unitários** para hooks e utilitários
- **Testes de componentes** com Testing Library
- **Testes de integração** para fluxos completos

## 📱 PWA

O aplicativo é uma PWA completa com:

- **Instalação** no dispositivo
- **Funcionalidade offline** básica
- **Cache inteligente** de recursos
- **Notificações** de atualizações
- **Service Worker** configurado

## ♿ Acessibilidade

- **WCAG 2.1 AA** compliance
- **Navegação por teclado** completa
- **ARIA labels** e descrições
- **Alto contraste** configurado
- **Suporte a leitores de tela**

## 🚀 Deploy

O projeto está configurado para deploy no GitHub Pages:

```bash
npm run deploy
```

## 📈 Melhorias Implementadas

### ✅ Segurança
- [x] Variáveis de ambiente para credenciais
- [x] Validação robusta de dados
- [x] Error boundaries
- [x] Sanitização de inputs

### ✅ Organização
- [x] Componentes modulares
- [x] Hooks customizados
- [x] Separação de responsabilidades
- [x] Estrutura escalável

### ✅ Performance
- [x] Memoização de componentes
- [x] Debounce na busca
- [x] Lazy loading
- [x] Otimizações de re-render

### ✅ Acessibilidade
- [x] Navegação por teclado
- [x] ARIA labels
- [x] Alto contraste
- [x] Foco visível

### ✅ PWA
- [x] Service Worker
- [x] Cache offline
- [x] Instalação
- [x] Notificações

### ✅ Testes
- [x] Configuração Vitest
- [x] Testes unitários
- [x] Testes de componentes
- [x] Cobertura de código

### ✅ Validação
- [x] Validação de CPF
- [x] Validação de telefone
- [x] Formatação automática
- [x] Mensagens de erro claras

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

Para suporte, entre em contato através de:
- Email: adryanfrancisco62@gmail.com
- Issues: [GitHub Issues](link-para-issues)

---

**Desenvolvido com ❤️ usando React e Mantine UI**