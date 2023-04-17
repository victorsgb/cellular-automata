# Ideia de projeto

Este projeto é sobre um mini-game de um board 10x10 no qual o usuário deverá mover um robô da casa mais acima e à esquerda até a casa mais abaixo e à direita. Porém, a cada passo, algumas células deverão ficar vivas ou mortas, a depender de um algoritmo de células autômatas que ficará escondido ao usuário.

Cada vez que o usuário andar em uma casa viva, ele "morre", devendo reiniciar do começo. Para conseguir se mover até o final com sucesso, será necessário entender qual a lógica de nascimento, manutenção e morte das células. Essas lógicas dependem unicamente da quantidade de vizinhos vivos ou mortos nas 8 células que rodeiam cada célula. Células de borda são consideradas como células "mortas", para este fim.

Pretendo criar uma única página, o mais rápido e simples possível, para ter o projeto rodando. Não será necessário autenticação, nada do tipo. Apenas o estado atual do usuário e do game board será salvo em localhost, para que não haja perda de dados caso o usuário feche e abra a página novamente.

Todo o processamento rodará no cliente.

## Processo lógico

Ao abrir o site, verifica-se se o game está no começo. Se estiver, calcula-se o estado inicial das células, levando em conta uma seed fixa e determinística (e.g. primeira seed = 0).

- A lógica de atualização das células é determinística, sempre a mesma para uma dada seed. Será a mesma seed responsável por retornar o estado inicial.

- O game certamente estará no começo se não houver dados salvos no localStorage. Se houver dados, daí verifica-se se o game está realmente no começo.

> Posição do player na casa inicial não é garantia de que o game está no começo!

- Se o game não estiver no começo, ao invés de se computar o estado inicial para a seed armazenada, deve-se retornar o estado atual das células, bem como a posição do player.

- Após usuário apertar alguma tecla direcional (setas ou conjunto AWSD), o player se move e o estado das células é atualizado conforme as regras da seed.

> - Se o player parar numa casa com célula viva, não será mais possível se mover, apenas recomeçar o jogo novamente, para a seed salva em localStorage (caso houver), ou seed inicial (caso não houver).
> - Se o player parar numa casa com célula morta, a UI ficará "esperando" sua próxima ação, a fim de atualizar o estado novamente, e assim por diante.
> - Se o player chegar no fim (célula mais abaixo e à direita), aparece um botão permitindo o jogador "passar de fase". Sua pontuação é incrementada, sendo salva em localStorage também, e uma nova seed é computada e salva em localStorage.
> - O cálculo da próxima seed leva em conta a seed atual, de maneira determinística, a fim de que cada qualquer jogador avance pelas mesmas fases, sempre.
> - Daí, começa-se tudo novamente, mas na próxima fase!

A cellular automaton is a mathematical model consisting of a grid of cells that evolve over time according to a set of simple rules based on the states of neighboring cells. Each cell can have a finite number of states, typically represented by colors, and the rules define how the states of the cells change from one time step to the next. Cellular automata have been used to model a wide range of natural and artificial phenomena, including the behavior of fluids, the growth of plants, and the spread of disease.
