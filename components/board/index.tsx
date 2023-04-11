// Core dependencies
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Inter } from 'next/font/google';
import { useRouter } from 'next/router';

// Custom components
import Cell from '../cell';

// Custom hooks
import { useData } from '../../hooks/data';

// Custom utils
import { getRandomInt } from '../../utils/helpers';
import Matrix from '../../utils/matrix';

// Styling related import
import styles from './board.module.css';
import { GiCheeseWedge } from 'react-icons/gi';

// Type imports
import { localLoseProps, localWinProps, notificationProps } from '../../pages';


const inter = Inter({ subsets: ['latin'] })

interface cheeseProps {
  visible: boolean;
  cell_id: number;
}

interface playerProps {
  cheeses: number;
  cell_id: number;
  position: number[];
}

interface foeProps {
  cell_id: number;
  position: number[];
  breakingPoints: string[];
  stepsAhead: number;
}

interface exitProps {
  cell_id: number;
}

interface BoardProps {
  notificationSetter: Dispatch<SetStateAction<notificationProps | null>>
}

export default function Board({ notificationSetter }: BoardProps){

  const { locale } = useRouter();

  // Grid size related variables
  let { 
    matrix,
    triggerMatrixUpdate,
    triggerMatrixRestart
  } = useData();

  const [stepsCount, setStepsCount] = useState<number>(0);

  // Cheese related code
  const [cheese, setCheese] = useState<cheeseProps>({
    visible: false,
    cell_id: 0
  });

  // Player related code
  const [player, setPlayer] = useState<playerProps>({
    cheeses: -1,
    cell_id: 0,
    position: [0, 0]
  })

  // Foe related code
  const [foe, setFoe] = useState<foeProps>({
    cell_id: 88,
    position: [8, 8],
    breakingPoints: [],
    stepsAhead: 5
  })

  const [exit, setExit] = useState<exitProps>({
    cell_id: 99
  })

  const [gameOver, setGameOver] = useState<boolean>(false);

  let mx = Matrix();

  function handleKeyDown(event: any) {
    if (event.defaultPrevented) {
      return; // Do nothing if the event was already processed
    }
    
    if (gameOver) {
      return;
    }

    let newPlayerPosition: number[] | null = null;

    switch (event.key) {
      case "Enter":
        handleRestart();
        { locale == 'en-US' && 
          notificationSetter({
            type: 'alert',
            message: 'You restarted the game!'
          });
        }
        { locale == 'pt-BR' && 
          notificationSetter({
            type: 'alert',
            message: 'Você recomeçou o jogo!'
          });
        }
        break;
      case "ArrowDown":
        newPlayerPosition = mx.movePlayer(matrix.values, player.position, 'D');
        break;
      case "ArrowUp":
        newPlayerPosition = mx.movePlayer(matrix.values, player.position, 'U');
        break;
      case "ArrowLeft":
        newPlayerPosition = mx.movePlayer(matrix.values, player.position, 'L');
        break;
      case "ArrowRight":
        newPlayerPosition = mx.movePlayer(matrix.values, player.position, 'R');
        break;
      default:
        return; // Quit when this doesn't handle the key event.
    }
  
    // Cancel the default action to avoid it being handled twice
    event.preventDefault();

    if (newPlayerPosition !== null) {
      notificationSetter(null);
      // Moving player...
      setPlayer({
        ...player,
        position: newPlayerPosition,
        cell_id: matrix.ids[newPlayerPosition[0]][newPlayerPosition[1]]
      });

      // Moving foe...
      let { nextPosition, breakingPoints } = mx.moveFoe(
        player.position,
        foe.breakingPoints,
        matrix.values,
        foe.position,
        stepsCount
      );

      if (nextPosition !== null) {
        setFoe({
          ...foe,
          position: nextPosition,
          cell_id: matrix.ids[nextPosition[0]][nextPosition[1]],
          breakingPoints
        });
      }

      // Updating matrix...
      triggerMatrixUpdate();

      let matrixValuesUpdated = mx.updateMatrix(matrix.values);

      if (matrixValuesUpdated[newPlayerPosition[0]][newPlayerPosition[1]]) {
        // Condition to lose by stepping on a living cell
              // Condition to lose by foe!
        setGameOver(true);
        { locale == 'en-US' && 
          notificationSetter({
            type: 'lose',
            message: 'Whoa... You touched a living cell!'
          });
        }
        { locale == 'pt-BR' && 
          notificationSetter({
            type: 'lose',
            message: 'Ops... Você tocou uma célula viva!'
          });
        }
        if (localStorage) {
          let loseHistory: localLoseProps[] = JSON.parse(localStorage.getItem('@app:loses') as string);

          if (loseHistory) {
            localStorage.setItem('@app:loses', JSON.stringify(
              [...loseHistory, {
                date: new Date(),
                steps: stepsCount,
                reason: 'cell'
              }]
            ))
          } else {
            localStorage.setItem('@app:loses', JSON.stringify([{
              date: new Date(),
              steps: stepsCount,
              reason: 'cell'
            }]));
          }
        }
      }

      setStepsCount(stepsCount + 1);
    }
  }

  function spawnCheese() {

    if (!cheese.visible) {
      setCheese({
        ...cheese,
        visible: true,
      })
    }
  }

  function handleRestart() {
    setPlayer({
      cheeses: -1,
      cell_id: 0,
      position: [0, 0]
    });

    setCheese({
      visible: false,
      cell_id: 0
    });

    setFoe({
      cell_id: 88,
      position: [8, 8],
      breakingPoints: [],
      stepsAhead: 5
    });

    setStepsCount(0);
    triggerMatrixRestart();

    setGameOver(false);
    notificationSetter(null);

    if (document) {
      document.getElementById('board')?.focus();
    }

  }

  useEffect(() => {

    if (stepsCount === 2) {
      spawnCheese();
    }

    if (getRandomInt(10) > 7) {
      spawnCheese();
    }

  }, [stepsCount]);

  useEffect(() => {

    if (player.cell_id === cheese.cell_id) {
      // Condition to get a new cheese
      setPlayer({
        ...player,
        cheeses: player.cheeses + 1
      });

      // Update cheese data
      setCheese({
        ...cheese,
        visible: false,
        cell_id: getRandomInt(
          matrix.ids[0].length * matrix.ids[1].length - 1
        )
      });
    }

    if (player.cell_id === foe.cell_id) {
      // Condition to lose by foe!
      setGameOver(true);
      { locale == 'en-US' && 
        notificationSetter({
          type: 'lose',
          message: 'Oh no... You got eaten by the cat!'
        });
      }
      { locale == 'pt-BR' && 
        notificationSetter({
          type: 'lose',
          message: 'Oh, não... Você foi engolido pelo gato!'
        });
      }
      if (localStorage) {
        let loseHistory: localLoseProps[] = JSON.parse(localStorage.getItem('@app:loses') as string);

        if (loseHistory) {
          localStorage.setItem('@app:loses', JSON.stringify(
            [...loseHistory, {
              date: new Date(),
              steps: stepsCount,
              reason: 'cat'
            }]
          ))
        } else {
          localStorage.setItem('@app:loses', JSON.stringify([{
            date: new Date(),
            steps: stepsCount,
            reason: 'cat'
          }]));
        }
      }
    }

    if (player.cell_id === exit.cell_id && player.cheeses > 0) {
      // Condition to win the game!
      setGameOver(true);
      { locale == 'en-US' && 
        notificationSetter({
          type: 'win',
          message: 'Congrats! Try taking more cheese next time!'
        });
      }
      { locale == 'pt-BR' && 
        notificationSetter({
          type: 'win',
          message: 'Parabéns! Tente trazer mais queijos para casa da próxima vez!'
        });
      }
      if (localStorage) {
        let winHistory: localWinProps[] = JSON.parse(localStorage.getItem('@app:wins') as string);

        if (winHistory) {
          localStorage.setItem('@app:wins', JSON.stringify(
            [...winHistory, {
              date: new Date(),
              cheeses: player.cheeses,
              steps: stepsCount
            }]
          ))
        } else {
          localStorage.setItem('@app:wins', JSON.stringify([{
            date: new Date(),
            cheeses: player.cheeses,
            steps: stepsCount
          }]));
        }
      }
    }

  }, [player.cell_id])

  return (
    <div 
      id='board'
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className={styles.board}
    >
      <div className={styles.statusBar}>
        <p className={inter.className}>{
          player.cheeses > 0
            ? player.cheeses > 1
              ? <div className={styles.cheeseCount}><GiCheeseWedge /><strong> x {player.cheeses}</strong></div>
              : <GiCheeseWedge />
            : ''
        }</p>
        { locale == 'en-US' && 
          <p className={inter.className}>{`${stepsCount > 0 ? stepsCount : 'No'} step${stepsCount > 1  ? 's' : ''}`}</p>
        }
        { locale == 'pt-BR' && 
          <p className={inter.className}>{`${stepsCount > 0 ? stepsCount : 'Nenhum'} passo${stepsCount > 1  ? 's' : ''}`}</p>
        }
      </div>
      { matrix.ids[0].map((_row, index_row) => (
        <div key={index_row} className={styles.row}>
          { matrix.ids[1].map((_col, index_col) => (
            <Cell
              key={matrix.ids[index_row][index_col]}
              alive={matrix.values[index_row][index_col]}
              hasCheese={matrix.ids[index_row][index_col] === cheese.cell_id && cheese.visible}
              hasPlayer={matrix.ids[index_row][index_col] === player.cell_id}
              hasCat={matrix.ids[index_row][index_col] === foe.cell_id}
              hasHouse={matrix.ids[index_row][index_col] === exit.cell_id}
              playerGotACheese={player.cheeses > 0}
            />
          )) }
        </div>
      )) }
      <div className={styles.restartButtonDiv}>
        { gameOver && locale == 'en-US'&&
          <button autoFocus onClick={handleRestart}>
            Restart!
          </button>
        }
        { gameOver && locale == 'pt-BR'&&
          <button autoFocus onClick={handleRestart}>
            Recomeçar!
          </button>
        }
      </div>
    </div>
  )
} 