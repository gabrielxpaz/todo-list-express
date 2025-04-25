# To-Do List API com Express

![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)

API de lista de tarefas desenvolvida com Express.js para prática de desenvolvimento backend.

## ✨ Funcionalidades

- **Autenticação de usuários**
  - Registro de novos usuários
  - Login com JWT (JSON Web Token)
  
- **Gestão de tarefas**
  - ✅ Adicionar novas tarefas
  - ✏️ Editar tarefas existentes
  - ❌ Remover tarefas
  - ✔️ Marcar tarefas como concluídas
  - 📋 Listar todas as tarefas do usuário

## ⚠️ Observação

O front-end deste projeto não foi o foco principal e pode estar incompleto. Me concentrei a aprender e desenvolver o backend.

## 🛠 Tecnologias Utilizadas

- Node.js
- Express.js
- MySQL

## 🚀 Como executar o projeto

```bash
1. Primeiro, clone o repositório:

git clone https://github.com/gabrielxpaz/todo-list-express.git
cd todo-list-express

2. Instale as dependências:

npm install dotenv express nodemon mysql2 bcryptjs cors

3. Configure o ambiente (crie um arquivo .env baseado no .env original):

[Edite o arquivo .env com suas configurações]

4. Inicie o servidor:

npm start

```
## 🌐 Rotas da API

### Autenticação
- POST /auth/register - Registrar novo usuário
- POST /auth/login - Fazer login

### Tarefas (requer autenticação)
- GET /tasks - Listar tarefas do usuário
- POST /tasks - Criar nova tarefa
- PUT /tasks/:id - Atualizar tarefa / Concluir tarefa
- DELETE /tasks/:id - Remover tarefa

## 🤝 Como contribuir

1. Faça um fork do projeto
2. Crie uma branch para sua feature (git checkout -b minha-feature)
3. Commit suas mudanças (git commit -m 'Minha nova feature')
4. Push para a branch (git push origin minha-feature)
5. Abra um Pull Request

## 📄 Licença
MIT