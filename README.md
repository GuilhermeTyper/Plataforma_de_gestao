# 🌐 PLATAFORMA DE GESTÃO DE EVENTOS 

> A plataforma social focada em compartilhar como você está se sentindo.

---

## 📌 Tabela de Conteúdos
1. [Sobre o Projeto](#-sobre-o-projeto)
2. [Funcionalidades Principais](#-funcionalidades-principais)
3. [Tecnologias Utilizadas](#-tecnologias-utilizadas)
4. [Pré-requisitos](#-pré-requisitos)
5. [Como Instalar e Rodar](#-como-instalar-e-rodar)
6. [Estrutura do Banco de Dados](#-estrutura-do-banco-de-dados)
7. [Como Contribuir](#-como-contribuir)
8. [Licença](#-licença)

---

## 🚀 Sobre o Projeto
O projeto foi desenvolvido para resolver um cenário deficiente administrativo dos eventos. Diferente de outros, o nosso foco é o sentimento dos participantes.

Este projeto é um MVP (Minimum Viable Product) focado em:
*   Usuários engajados.
*   Segurança de dados.
  

---

## ✨ Funcionalidades Principais
*   ✅ **Autenticação Segura:** Cadastro, Login (JWT/OAuth).
*   ✅ **Perfil de Usuário:** Edição, biografia, foto de perfil.
*   ✅ **Feed em Tempo Real:** Postagens de texto e imagem.
*   ✅ **Interações:** Curtidas, comentários e compartilhamentos.
*   ✅ **Sistema de Amizade/Seguidores:** Seguir, unfollow, solicitações.
*   ✅ **Notificações:** Alertas em tempo real.

---

## 🛠️ Tecnologias Utilizadas
A rede social foi construída com o seguinte stack tecnológico:

**Front-end:**
*   [React.js / Next.js / React Native]
*   [Redux / Context API] - Gerenciamento de Estado
*   [Tailwind CSS / Styled Components] - Estilização

**Back-end:**
*   [Node.js / Python / Django]
*   [Socket.io] - Funcionalidades em tempo real
*   [Express]

**Banco de Dados:**
*   [PostgreSQL] - Dados relacionais (usuários, amizades)
*   [MongoDB] - Postagens/Logs

**Serviços/DevOps:**
*   [AWS S3] - Armazenamento de imagens
*   [Docker]
*   [Git/GitHub]

---

## 📋 Pré-requisitos
Antes de começar, você precisará ter instalado em sua máquina:
*   [Node.js (v16+)](https://nodejs.org)
*   [Docker](https://www.docker.com)
*   [Gerenciador de pacotes npm ou yarn]

---

## 🖥️ Como Instalar e Rodar

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com
    ```

2.  **Entre na pasta do projeto:**
    ```bash
    cd PROJETO-REDE-SOCIAL

    ```

3.  **Instale as dependências (Front e Back):**
    ```bash
    npm install
    # ou
    yarn install
    ```

4.  **Configure as variáveis de ambiente (.env):**
    *   Crie um arquivo `.env` na raiz do backend baseado no `.env.example`.

5.  **Suba o banco de dados com Docker:**
    ```bash
    docker-compose up -d
    ```

6.  **Inicie a aplicação:**
    ```bash
    npm start
    # ou
    yarn start
    ```

7.  Acesse `http://localhost:3000` no seu navegador.

---

## 📊 Estrutura do Banco de Dados
O modelo de dados é baseado em um grafo social, focado em interações:

*   **Users:** ID, Nome, Email, Senha, Foto, Bio.
*   **Posts:** ID, UserID, Conteúdo, FotoURL, Timestamp.
*   **Follows/Friends:** FollowerID, FollowingID, Data.
*   **Likes/Comments:** ID, PostID, UserID, Conteúdo.

---

## 🤝 Como Contribuir
Contribuições são o que tornam a comunidade open-source um lugar incrível!

1.  Faça o Fork do projeto.
2.  Crie uma branch para sua funcionalidade (`git checkout -b feature/NovaFuncionalidade`).
3.  Commit suas mudanças (`git commit -m 'Adiciona NovaFuncionalidade'`).
4.  Push para a branch (`git push origin feature/NovaFuncionalidade`).
5.  Abra um Pull Request.

---

## 📜 Licença
Distribuído sob a licença [MIT/Apache/GPL]. Veja `LICENSE` para mais informações.

---
Desenvolvido por [Seu Nome/Nome da Equipe] - [Seu Email/LinkedIn]
