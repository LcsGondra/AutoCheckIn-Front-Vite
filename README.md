# Nome do Projeto

Aplicativo de Questionário React

## Descrição

Este projeto é um aplicativo de questionário desenvolvido em React usando Vite como ferramenta de construção. O objetivo do aplicativo é permitir que os usuários preencham um questionário após se registrarem. O questionário contém várias perguntas que podem ter diferentes tipos de resposta, como rádio, dropdown, texto, checkbox e data. Além disso, o aplicativo possui uma lógica de dependência para certas perguntas, exibindo perguntas adicionais com base nas respostas fornecidas.

## Tecnologias Utilizadas

- **React**
- **Vite**
- **React Router**
- **CSS**

## Funcionalidades

- Registro de usuário
- Preenchimento de questionário com múltiplos tipos de perguntas
- Lógica de dependência para perguntas
- Validação de formulário
- Exibição de uma imagem no questionário com base em uma resposta específica
- Termo de consentimento antes do envio do questionário

## Estrutura do Projeto

```
my-project/
├── src/
│ └── assets/Abdomen.png
│ ├── components/
│ │ ├── Registration.css
│ │ ├── Registration.jsx
│ │ ├── Questionnaire.css
│ │ └── Questionnaire.jsx
│ ├── App.css
│ ├── App.jsx
│ ├── main.jsx
│ └── index.css
├── .gitignore
├── index.html
├── package.json
├── README.md
└── vite.config.js
```

## Instalação

1. Clone o repositório para sua máquina local:

    ```sh
    git clone https://github.com/LcsGondra/AutoCheckIn-Front-Vite.git
    ```

2. Navegue até o diretório do projeto:

    ```sh
    cd autocheckin-front-vite
    ```

3. Instale as dependências:

    ```sh
    npm install
    ```

## Uso

1. Inicie o servidor de desenvolvimento:

    ```sh
    npm run dev
    ```

2. Abra seu navegador e acesse `http://localhost:5173/` para ver o aplicativo em execução.

3. Para ter toda a funcionalidade precisa ter tambem conexao com o Backend, nesse Repositorio:
https://github.com/LcsGondra/AutoCheckIn/

## Como Funciona

### Registro

A página de registro permite que o usuário insira suas informações pessoais. Após o registro, o usuário é redirecionado para a página do questionário.

### Questionário

A página do questionário apresenta uma série de perguntas. Dependendo das respostas fornecidas, perguntas adicionais podem ser exibidas. O questionário também inclui um termo de consentimento que deve ser aceito antes do envio.

### Envio do Questionário

Quando o usuário envia o questionário, as respostas são processadas e exibidas na tela, juntamente com a prioridade e o tipo de emergência, se aplicável.
