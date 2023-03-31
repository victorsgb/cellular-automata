# Ideia de projeto

Este projeto é sobre um mini-game de um board 10x10 no qual o usuário deverá mover um robô da casa mais acima e à esquerda até a casa mais abaixo e à direita. Porém, a cada passo, algumas células deverão ficar vivas ou mortas, a depender de um algoritmo de células autômatas que ficará escondido ao usuário.

Cada vez que o usuário andar em uma casa viva, ele "morre", devendo reiniciar do começo. Para conseguir se mover até o final com sucesso, será necessário entender qual a lógica de nascimento, manutenção e morte das células. Essas lógicas dependem unicamente da quantidade de vizinhos vivos ou mortos nas 8 células que rodeiam cada célula. Células de borda são consideradas como células "mortas", para este fim.

Pretendo criar uma única página, o mais rápido e simples possível, para ter o projeto rodando. Não será necessário autenticação, nada do tipo. Apenas o estado atual do usuário e do game board será salvo em localhost, para que não haja perda de dados caso o usuário feche e abra a página novamente.

Todo o processamento rodará no cliente.
