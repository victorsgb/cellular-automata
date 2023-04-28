// Core dependencies
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Roboto_Mono } from 'next/font/google';
import { useRouter } from 'next/router';

// Custom components
import Cell from '../cell';
import LivesBar from '../livesBar';

// Custom hooks
import { useData } from '../../hooks/data';

// Custom utils
import { getRandomInt } from '../../utils/helpers';
import Matrix from '../../utils/matrix';

// Styling related import
import styles from './board.module.css';
import { GiCheeseWedge } from 'react-icons/gi';

// Type imports
import { buttonValues, localAudioProps, localHistoryProps, localLoseProps, localWinProps, notificationProps } from '../../pages';


const roboto_mono = Roboto_Mono({ subsets: ['latin'] })

interface cheeseProps {
  visible: boolean;
  cell_id: number;
}

interface playerProps {
  cheeses: number;
  cell_id: number;
  lives: number;
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
  notificationSetter: Dispatch<SetStateAction<notificationProps | null>>;
  localHistory: localHistoryProps;
  localHistorySetter: Dispatch<SetStateAction<localHistoryProps>>;
  buttonValue: buttonValues;
  buttonValueSetter: Dispatch<SetStateAction<buttonValues>>;
  backgroundMusic: HTMLAudioElement | null;
  backgroundMusicSetter: Dispatch<SetStateAction<HTMLAudioElement | null>>;
  localMusic: localAudioProps;
  localSound: localAudioProps;
  loading: boolean;
  loadingSetter: Dispatch<SetStateAction<boolean>>;
}

export default function Board({
  notificationSetter,
  localHistory,
  localHistorySetter,
  buttonValue,
  buttonValueSetter,
  backgroundMusic,
  backgroundMusicSetter,
  localMusic,
  localSound,
  loading,
  loadingSetter
}: BoardProps){

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
    lives: 3,
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
        notificationSetter({
          type: 'alert',
          message: locale == 'pt-BR'
            ? 'Você recomeçou o jogo!'
            : 'You restarted the game!' 
        });
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

    handleConsequencesOfNewPlayerPosition(newPlayerPosition)

  }

  function handleConsequencesOfNewPlayerPosition(newPlayerPosition: number[] | null) {
  
    if (loading) {
      return
    }

    if (backgroundMusic === null && localMusic.active) {
      const music = new Audio('/music/8-Bit-Indigestion_Looping.mp3');
      music.volume = 0.5 * localMusic.volume;
      music.play();
  
      backgroundMusicSetter(music);
    }


    if (newPlayerPosition !== null) {

      loadingSetter(true);

      notificationSetter(null);

      var randomInt = Math.floor(Math.random() * 36) + 1;

      if (localSound.active) {
        var stepSound = new Audio(`/sound/effects/impactGlass_light_00${randomInt % 5}.ogg`);
        stepSound.volume = 0.3 * localSound.volume;
        stepSound.play();
      }


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

      if (nextPosition !== foe.position) {
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

      // Condition to lose a life OR to lose game by touching foe
      if (matrixValuesUpdated[newPlayerPosition[0]][newPlayerPosition[1]]) {

        if (localSound.active) {
          var damageSound = new Audio(`/sound/effects/impactMining_00${randomInt % 5}.ogg`);
          damageSound.volume = localSound.volume;
          damageSound.play();
        }

        if (player.lives - 1 == 2 && backgroundMusic) {
          backgroundMusic.playbackRate = 1.1;

        } else if (player.lives - 1 == 1 && backgroundMusic) {
          backgroundMusic.playbackRate = 1.3;

        } else if (player.lives - 1 == 0 && backgroundMusic) {
          backgroundMusic.playbackRate = 1.0;
        }

        if (player.lives - 1 == 0) {

          // Condition to lose by stepping on a living cell      
          setGameOver(true);
          notificationSetter({
            type: 'lose',
            message: locale == 'pt-BR'
              ? 'Ops... Você tocou uma célula viva!'
              : 'Whoa... You touched a living cell!'
          });

          if (backgroundMusic && localMusic.active) {
            backgroundMusic.pause();
            backgroundMusic.volume = 0.5 * localMusic.volume;
            backgroundMusic.currentTime = 0;
          }

          if (localSound.active) {
            var randomInt = Math.floor(Math.random() * 3);
            var loseSound = new Audio(`/sound/effects/jingles_PIZZI${randomInt}.ogg`);
            loseSound.volume = localSound.volume;
            loseSound.play();
          }

          if (localStorage) {
            let loseHistory: localLoseProps[] = JSON.parse(localStorage.getItem('@app:loses') as string);

            if (loseHistory) {

              let fiveBestLoses: localLoseProps[] = [...loseHistory, {
                date: JSON.stringify(new Date()),
                steps: stepsCount
              }]
                .sort((a, b) => b.steps - a.steps)
                .slice(0, 5) as localLoseProps[];

              localStorage.setItem('@app:loses', JSON.stringify(fiveBestLoses))

              if (localHistory) {
                localHistorySetter({
                  ...localHistory,
                  loses: fiveBestLoses
                })
              }

            } else {

              let localLose: localLoseProps = {
                date: JSON.stringify(new Date()),
                steps: stepsCount
              }

              localStorage.setItem('@app:loses', JSON.stringify([localLose]));

              if (localHistory) {
                localHistorySetter({
                  ...localHistory,
                  loses: [localLose]
                })
              }
            }
          }
        }

        setPlayer({
          ...player,
          position: newPlayerPosition,
          cell_id: matrix.ids[newPlayerPosition[0]][newPlayerPosition[1]],          
          lives: player.lives - 1
        });
  
      } else if (newPlayerPosition[0] === nextPosition[0] && newPlayerPosition[1] === nextPosition[1]) {

        // Condition to lose by foe!
        setGameOver(true);

        if (backgroundMusic && localMusic.active) {
          backgroundMusic.pause();
          backgroundMusic.volume = 0.5 * localMusic.volume;
          backgroundMusic.currentTime = 0;
        }

        if (localSound.active) {
          var randomInt = Math.floor(Math.random() * 3);
          var loseSound = new Audio(`/sound/effects/jingles_PIZZI${randomInt}.ogg`);
          loseSound.volume = localSound.volume;
          loseSound.play();
        }

        notificationSetter({
          type: 'lose',
          message: locale == 'pt-BR'
            ? 'Oh, não... Você foi engolido pelo gato!'
            : 'Oh no... You got eaten by the cat!'
        });
        if (localStorage) {
          let loseHistory: localLoseProps[] = JSON.parse(localStorage.getItem('@app:loses') as string);

          if (loseHistory) {

            let fiveBestLoses: localLoseProps[] = [...loseHistory, {
              date: JSON.stringify(new Date()),
              steps: stepsCount            
            }]
              .sort((a, b) => b.steps - a.steps)
              .slice(0, 5) as localLoseProps[];

            localStorage.setItem('@app:loses', JSON.stringify(fiveBestLoses));

            if (localHistory) {
              localHistorySetter({
                ...localHistory,
                loses: fiveBestLoses
              })
            }

          } else {

            let localLose: localLoseProps = {
              date: JSON.stringify(new Date()),
              steps: stepsCount
            }

            localStorage.setItem('@app:loses', JSON.stringify([localLose]));
            if (localHistory) {
              localHistorySetter({
                ...localHistory,
                loses: [localLose]
              })
            }          
          }
        }

        setPlayer({
          ...player,
          lives: 0,
          position: newPlayerPosition,
          cell_id: matrix.ids[newPlayerPosition[0]][newPlayerPosition[1]]          
        });            
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
      lives: 3,
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

    loadingSetter(false);

    if (document) {
      document.getElementById('board')?.focus();
    }

    if (backgroundMusic && localMusic.active) {
      backgroundMusic.play();
      backgroundMusic.playbackRate = 1.0;
      backgroundMusic.volume = localMusic.volume;
    }

  }

  useEffect(() => {

    if (buttonValue !== null && !gameOver) {
      
      let newPlayerPosition = mx.movePlayer(matrix.values, player.position, buttonValue);

      handleConsequencesOfNewPlayerPosition(newPlayerPosition);

      buttonValueSetter(null);

    }

  }, [buttonValue, gameOver, mx.movePlayer, matrix.values, player.position, handleConsequencesOfNewPlayerPosition, buttonValueSetter]);

  useEffect(() => {

  
    if (stepsCount === 2) {
      spawnCheese();
    }

    if (getRandomInt(10) > 7) {
      spawnCheese();
    }

  }, [stepsCount, spawnCheese]);

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

      if (stepsCount > 0 && localSound.active) {
        var randomInt = Math.floor(Math.random() * 10) + 1;
        var grabCheeseSound = new Audio(`/sound/effects/powerUp${randomInt}.ogg`);
        grabCheeseSound.volume = localSound.volume;
        grabCheeseSound.play();
      }
    }

    if ( 
        player.cell_id === exit.cell_id
        && player.cheeses > 0
        && player.lives > 0
      ) {
      // Condition to win the game!
      setGameOver(true);
      
      if (backgroundMusic && localMusic.active) {
        backgroundMusic.pause();
        backgroundMusic.volume = 0.5 * localMusic.volume;
        backgroundMusic.currentTime = 0;
      }

      if (localSound.active) {
        var winSound = new Audio('/sound/effects/jingles_SAX10.ogg');
        winSound.volume = localSound.volume;
        winSound.play();
      }

      notificationSetter({
        type: 'win',
        message: locale == 'pt-BR'
          ? 'Parabéns! Tente trazer mais queijos para casa da próxima vez!'
          : 'Congrats! Try taking more cheese next time!'
      });
      if (localStorage) {
        let winHistory: localWinProps[] = JSON.parse(localStorage.getItem('@app:wins') as string);

        if (winHistory) {

          let fiveBestWins: localWinProps[] = [...winHistory, {
            date: JSON.stringify(new Date()),
            cheeses: player.cheeses,
            steps: stepsCount
          }].sort((a, b) => a.steps - b.steps)
            .sort((a, b) => b.cheeses - a.cheeses)
            .slice(0, 5) as localWinProps[];

          localStorage.setItem('@app:wins', JSON.stringify(fiveBestWins))

          if (localHistory) {
            localHistorySetter({
              ...localHistory,
              wins: fiveBestWins
            })
          }
          
        } else {

          let localWin: localWinProps = {
            date: JSON.stringify(new Date()),
            cheeses: player.cheeses,
            steps: stepsCount
          }

          localStorage.setItem('@app:wins', JSON.stringify([localWin]));
          if (localHistory) {
            localHistorySetter({
              ...localHistory,
              wins: [localWin]
            })
          }
        }
      }
    }

  }, [player.cell_id, stepsCount]);

  useEffect(() => {

    if (gameOver) {

      let buttonElement: HTMLButtonElement = document.getElementById('restartButton') as HTMLButtonElement;

      buttonElement.focus();
    }


  }, [gameOver]);

  return (
    <div 
      id='board'
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className={styles.board}
    >
      <div className={styles.statusBar}>
        <LivesBar lives={player.lives} />
        <p className={roboto_mono.className}>{
          player.cheeses > 0
            ? player.cheeses > 1
              ? <div className={styles.cheeseCount}><GiCheeseWedge /><strong> x {player.cheeses}</strong></div>
              : <GiCheeseWedge />
            : ''
        }</p>
        <p className={roboto_mono.className}>
          { locale == 'pt-BR'
            ? `${stepsCount > 0 ? stepsCount : 'Nenhum'} passo${stepsCount > 1  ? 's' : ''}`
            : `${stepsCount > 0 ? stepsCount : 'No'} step${stepsCount > 1  ? 's' : ''}` }
        </p>
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
        <button
          disabled={stepsCount == 0}
          id='restartButton'
          title={ locale == 'pt-BR'
            ? 'Botão para reiniciar o jogo'
            : 'Button to restart the game' }
          className={`${styles.restartButton} ${roboto_mono.className}`}
          onClick={handleRestart} >
          { locale == 'pt-BR'
            ? 'Reiniciar!'
            : 'Restart!' }
        </button>
      </div>
    </div>
  )
} 