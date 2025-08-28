# controle-imoveis-react
Aplicação para controle de imóveis rurais feita em React com Supabase.

📝 Sobre o Projeto
Esta é uma aplicação web completa para o controlo e gestão de imóveis rurais. O sistema permite que os utilizadores se registem, façam login e administrem os seus próprios registos de propriedades de forma segura e privada.

O projeto foi construído com tecnologias modernas, focando numa interface rápida, responsiva e numa experiência de utilizador agradável.

Veja a demonstração ao vivo: https://adryan-francisco.github.io/controle-imoveis-react/

✨ Funcionalidades Principais
Autenticação de Utilizadores: Sistema completo de cadastro e login com e-mail e palavra-passe.

Gestão de Dados (CRUD): Funcionalidades completas para Criar, Ler, Atualizar e Apagar registos de imóveis.

Segurança de Dados: Cada utilizador tem acesso apenas aos imóveis que ele mesmo cadastrou, graças à Row Level Security (RLS) do Supabase.

Interface Moderna: Design limpo e responsivo, construído com a biblioteca de componentes Mantine UI.

Busca em Tempo Real: Filtre e encontre imóveis facilmente pelo nome do proprietário ou do sítio.

Tema Claro e Escuro: Botão para alternar entre os modos de visualização.

Notificações: Feedback visual para o utilizador após cada ação (sucesso ou erro).

🚀 Tecnologias Utilizadas
Este projeto foi construído com a seguinte stack:

Frontend
React (com Vite)

Mantine UI (Biblioteca de Componentes)

Supabase Client (para comunicação com o backend)

Backend (BaaS - Backend as a Service)
Supabase

PostgreSQL Database: Para armazenamento dos dados.

Supabase Auth: Para gestão de utilizadores e autenticação.

API Automática: Para a comunicação segura entre o frontend e a base de dados.

⚙️ Como Executar o Projeto Localmente
Para executar este projeto no seu ambiente de desenvolvimento, siga estes passos:

Clone o repositório:

git clone https://github.com/seu-usuario/controle-imoveis-react.git

Navegue para a pasta do projeto:

cd controle-imoveis-react/frontend

Instale as dependências:

npm install

Configure as suas chaves do Supabase:

Crie um ficheiro chamado .env na raiz da pasta frontend.

Adicione as suas chaves do Supabase a este ficheiro:

VITE_SUPABASE_URL=SUA_URL_DO_PROJETO
VITE_SUPABASE_ANON_KEY=SUA_CHAVE_ANON_PUBLICA

Inicie o servidor de desenvolvimento:

npm run dev

A aplicação estará disponível em http://localhost:5173.