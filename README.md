# 🇺🇲 English version

Personal web page project developed with React.js and Next.js. It is a mini-game that addresses the concept of automata cells, inspired by the first step of  [this challenge by Sigma Geek](https://sigmageek.com/challenge/stone-automata-maze-challenge).

[Project demonstration running on the web!](https://cellular-automata-beryl.vercel.app)

## 🔥 Main features

- ✅ Project split into React.js components
- ✅ Use of *useContext* to directly pass the current state of each pixel of the automata cell to all other components
- ✅ Logic for automatically moving the cat, anticipating the next generations of the state of the automaton cell to decide where to go, with the goal of reaching the same position as the avatar representing the player
- ✅ Allows the use of keyboard and mouse for better accessibility
- ✅ Use of HTML *dialogs* to create three modals: one to inform about the goal of the game, another to show the settings, and another to show the credits and the history of victories/defeats stored in *localStorage*
- ✅ Customizable page theme (between light/dark)
- ✅ Applied internationalization (default: en-US, but also localized in pt- BR )
- ✅ Customizable background music and sound effects (between on/off and volume control)
- ✅ Semantic HTML, animations via CSS, and more...

## External dependencies

![Dependencies](https://victorsgb.github.io/cellular-automata/public/dependencies.png "Dependencies")

## Languages and tools

<p align="left">
  <a href="https://nextjs.org/" target="_blank" rel="noreferrer"> <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original-wordmark.svg" alt="next" width="40" height="40"/> </a>
  <a href="https://react.dev/" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original.svg" alt="react" width="40" height="40"/> </a> 
  <a href="https://www.typescriptlang.org/" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/typescript/typescript-original.svg" alt="typescript" width="40" height="40"/> </a> 
  <a href="https://developer.mozilla.org/en-US/docs/Web/Html" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/html5/html5-original.svg" alt="html5" width="40" height="40"/> </a>
  <a href="https://developer.mozilla.org/en-US/docs/Web/Css" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/css3/css3-original.svg" alt="css3" width="40" height="40"/> </a>
</p>  

## Folders structure

![Project structure](https://victorsgb.github.io/cellular-automata/public/project_structure.png "Project structure")

## How to run this project locally

Presuming you already have `git` and `npm` on your local machine, you should follow these simple steps. First, change to the directory you are interested in and clone the repository:

> `git clone https://github.com/victorsgb/cellular-automata`

Then, go to the newly created folder containing your new local repository:

> `cd cellular-automata`

Install the project's dependencies (assuming you have the `npm` package installed on your machine):

> `npm install`

And that's it! You can now run the project in a developer environment. The server will start on port 3000 after you run the following command:

> `npm run dev`

The application is expected to be running normally in your default browser.

---

# 🇧🇷 Versão em português

Projeto pessoal de página web desenvolvida com React.js e Next.js. Trata-se de um mini-game que aborda o conceito de células autômatas, inspirado na primeira etapa [deste desafio do Sigma Geek](https://sigmageek.com/challenge/stone-automata-maze-challenge).

[Uma demonstração do projeto rodando na web!](https://cellular-automata-beryl.vercel.app)

## 🔥 Principais recursos

- ✅ Projeto separado em componentes do React.js
- ✅ Uso do *useContext* para o compartilhamento direto do estado corrente de cada pixel da célula autômata por todos os demais componentes
- ✅ Lógica para movimentação automática do gato, que antecipa as próximas gerações de estado da célula autômata para decidir para onde ir, visando atingir a mesma posição do avatar representando o jogador
- ✅ Permitido o uso de keyboard e mouse para maior acessibilidade
- ✅ Uso de *dialogs* do HTML para construção de três modais: um para informar o objetivo do jogo, outro para exibir as configurações, e outro para exibir os créditos e histórico de vitórias/derrotas armazenado em *localStorage*
- ✅ Tema da página customizável (entre claro/escuro)
- ✅ Internacionalização aplicada (padrão: en-US, mas localizada também em pt-BR)
- ✅ Música de fundo e efeitos sonoros ajustáveis (entre ligado/desligado e ajuste de volume)
- ✅ HTML semântico, animações via CSS, dentre outras...

## Dependências externas

![Dependências do projeto](https://victorsgb.github.io/cellular-automata/public/dependencies.png "Dependências do projeto")

## Linguagens e ferramentas

<p align="left">
  <a href="https://nextjs.org/" target="_blank" rel="noreferrer"> <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original-wordmark.svg" alt="next" width="40" height="40"/> </a>
  <a href="https://react.dev/" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original.svg" alt="react" width="40" height="40"/> </a> 
  <a href="https://www.typescriptlang.org/" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/typescript/typescript-original.svg" alt="typescript" width="40" height="40"/> </a> 
  <a href="https://developer.mozilla.org/en-US/docs/Web/Html" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/html5/html5-original.svg" alt="html5" width="40" height="40"/> </a>
  <a href="https://developer.mozilla.org/en-US/docs/Web/Css" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/css3/css3-original.svg" alt="css3" width="40" height="40"/> </a>
</p>  

## Estrutura das pastas

![Estrutura do projeto](https://victorsgb.github.io/cellular-automata/public/project_structure.png "Estrutura do projeto")

## Como rodar este projeto localmente

Presumindo que você já tenha `git` e `npm` instalados na sua máquina local, você deve seguir estes simples exemplos práticos. Primeiro, vá para um diretório de seu interesse e faça uma clonagem deste repositório:

> `git clone https://github.com/victorsgb/cellular-automata`

Então, acesse esta nova pasta recém-criada:

> `cd cellular-automata`

Instale as dependências de projeto:

> `npm install`

E é isso! Você pode agora rodar o projeto em ambiente de desenvolvimento. O servidor irá iniciar na porta 3000 após o seguinte comando:

> `npm run dev`

Espera-se que a aplicação rode normalmente no seu navegador padrão.
