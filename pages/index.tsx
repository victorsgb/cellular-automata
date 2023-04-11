// Core dependencies
import { Inter } from 'next/font/google';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

// Custom components
import Board from '../components/board';
import Dialog from '../components/dialog';

// Styling related import
import styles from '../styles/Home.module.css'
import { BsFillSuitHeartFill, BsHouseCheckFill } from 'react-icons/bs';
import { GiCat, GiCheeseWedge, GiSeatedMouse } from 'react-icons/gi';
import { GoGear, GoQuestion } from 'react-icons/go';

export interface notificationProps {
  type: 'win' | 'lose' | 'alert'
  message: string;
}

interface localThemeProps {
  theme?: 'light' | 'dark';
}

export interface localLoseProps {
  date: string;
  steps: number;
  reason: 'cat' | 'cell'
}

export interface localWinProps {
  wins?: {
    date: string;
    cheeses: number;
    steps: number;
  }[];
}

const inter = Inter({ subsets: ['latin'] })


export default function Home() {

  const router = useRouter();
  const { locale, asPath } = useRouter();

  const [notification, setNotification] = useState<notificationProps | null>(null);

  const [localTheme, setLocalTheme] = useState<localThemeProps | null>(null);

  function handleShowDoubtModal() {
    const dialog = document.querySelector(`dialog#doubt`) as HTMLDialogElement;
    dialog?.showModal();
  }

  function handleShowConfigModal() {
    const dialog = document.querySelector(`dialog#config`) as HTMLDialogElement;
    dialog?.showModal();
  }

  function storeChosenTheme(theme: 'light' | 'dark') {

    if (localStorage) {
      localStorage.setItem('@app:theme', JSON.stringify({value: theme}));
      setLocalTheme({
        ...localTheme,
        theme
      });
    }
  }

  function changeLanguage(language: 'en-US' | 'pt-BR') {
    
    router.replace(asPath, undefined, {locale: language});  
  }

  useEffect(() => {

    if (localStorage.getItem('@app:theme')) {
      let localTheme = JSON.parse(localStorage.getItem('@app:theme') as string);

      setLocalTheme({
        ...localTheme,
        theme: localTheme.value
      })
    }

  }, [localTheme?.theme]);

  return (
    <>
      <Head>
        <title>Cellular Automaton Game</title>
        <meta name="description" content="Game inspired by a SigmaGeek challenge" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header className={styles.header}>
        <button
          className={styles.button}
          onClick={handleShowDoubtModal}  
        >
          <GoQuestion size={25} className={styles.icon} />
        </button>
        { locale == 'en-US' &&  
          <h3 className={inter.className}>Cellular Automaton Game</h3>
        }
        { locale == 'pt-BR' &&  
          <h3 className={inter.className}>Autômato Celular Game</h3>
        }
        <button
          className={styles.button}
          onClick={handleShowConfigModal}  
        >
          <GoGear size={25} className={styles.icon} />
        </button>
      </header>
      <section className={styles.notify}>
        { notification !== null && locale == 'en-US' &&
          <>
            <h3 className={`
              ${inter.className}
              ${styles.notifyType}
              ${ notification.type == 'lose'
              ? styles.notifyTypeLose
              : notification.type == 'alert'
                ? styles.notifyTypeAlert
                : notification.type == 'win'
                  ? styles.notifyTypeWin
                  : '' }
            `}>
              { notification.type == 'lose'
                ? 'Game Over'
                : notification.type == 'alert'
                  ? 'Alert'
                  : notification.type == 'win'
                    ? 'You win!'
                    : ''
              }
            </h3>          
            <p className={
              `${inter.className}
              ${ notification.type == 'lose'
                    ? styles.notifyLose
                    : notification.type == 'alert'
                      ? styles.notifyAlert
                      : notification.type == 'win'
                        ? styles.notifyWin
                        : '' }
              `}>
              {notification.message}
            </p>
          </>        
        }
        { notification !== null && locale == 'pt-BR' &&
          <>
            <h3 className={`
              ${inter.className}
              ${styles.notifyType}
              ${ notification.type == 'lose'
              ? styles.notifyTypeLose
              : notification.type == 'alert'
                ? styles.notifyTypeAlert
                : notification.type == 'win'
                  ? styles.notifyTypeWin
                  : '' }
            `}>
              { notification.type == 'lose'
                ? 'Fim de Jogo'
                : notification.type == 'alert'
                  ? 'Alerta'
                  : notification.type == 'win'
                    ? 'Você venceu!'
                    : ''
              }
            </h3>          
            <p className={
              `${inter.className}
              ${ notification.type == 'lose'
                    ? styles.notifyLose
                    : notification.type == 'alert'
                      ? styles.notifyAlert
                      : notification.type == 'win'
                        ? styles.notifyWin
                        : '' }
              `}>
              {notification.message}
            </p>
          </>        
        }        
      </section>
      <main className={styles.main}>
        { locale == 'en-US' && 
          <p className={`${inter.className} ${styles.inform}`}>press <kbd>⬅️⬆️⬇️➡️</kbd> to move or <kbd>ENTER</kbd> to restart...</p>
        }
        { locale == 'pt-BR' && 
          <p className={`${inter.className} ${styles.inform}`}>pressione <kbd>⬅️⬆️⬇️➡️</kbd> para se mover ou <kbd>ENTER</kbd> para recomeçar...</p>
        }
        <Board notificationSetter={setNotification} />
      </main>
      <Dialog name='doubt'>
        <article>
          { locale == 'en-US' && 
            <>
              <p className={`${inter.className} ${styles.paragraph}`}>Can you lead your avatar (i.e., <GiSeatedMouse className={styles.player} />) back into the <BsHouseCheckFill className={styles.homeOpen} />? Just use a keyboard to move it by pressing <kbd>⬅️⬆️⬇️➡️</kbd>. Each press in one of these buttons will move the <GiSeatedMouse className={styles.player} /> one step. <strong>Easy, right?</strong></p>
              <br/>
              <p className={`${inter.className} ${styles.paragraph}`}>There are a few drawbacks: you cannot let the <GiCat className={styles.foe} /> hunt you down, and you cannot get back home empty-handed: at least get a <GiCheeseWedge className={styles.cheese} /> along the way! <strong>Walk a little bit till one shows up on the map.</strong></p>
              <br/>
              <p className={`${inter.className} ${styles.paragraph}`}>The major challenge of this game is not the <GiCat className={styles.foe} /> nor finding and catching a <GiCheeseWedge className={styles.cheese} />, but it is the map itself!</p>
              <br/>
              <p className={`${inter.className} ${styles.paragraph}`}><strong>The map is made of cells that represent a cellular automaton.</strong></p>
              <details>
                <summary className={`${inter.className} ${styles.paragraph}`}>
                  A cellular automaton is...
                </summary>
                <p className={`${inter.className} ${styles.paragraph}`}>...a mathematical model consisting of a grid of cells that evolve over time according to a set of simple rules based on the states of neighboring cells. Each cell can have a finite number of states, typically represented by colors, and the rules define how the cells change from one time step to the next. Cellular automata have been used to model a wide range of natural and artificial phenomena, including the behavior of fluids, the growth of plants, and the spread of disease.</p>
              </details>
              <br/>
              <p className={`${inter.className} ${styles.paragraph}`}>Cells in black/white tones represent dead cells, whereas cells in red tones mean live cells. Keep yourself inside dead cells. If you touch a living cell, it's game over.</p>
              <br/>
              <p className={`${inter.className} ${styles.paragraph}`}><strong>It's up to you to investigate how this cellular automaton evolves so you can safely move along the board!</strong></p>
              <br/>
              <em className={`${inter.className} ${styles.paragraph}`}><strong>Are you up to the task?</strong></em>
            </>
          }
          { locale == 'pt-BR' && 
            <>
              <p className={`${inter.className} ${styles.paragraph}`}>Você pode guiar seu avatar (isto é, <GiSeatedMouse className={styles.player} />) de volta à sua <BsHouseCheckFill className={styles.homeOpen} />? Apenas use o teclado para movê-lo pressionando <kbd>⬅️⬆️⬇️➡️</kbd>. Cada tecla pressionada moverá o <GiSeatedMouse className={styles.player} /> em um passo. <strong>Fácil, não?</strong></p>
              <br/>
              <p className={`${inter.className} ${styles.paragraph}`}>Existem algumas desvantagens: você não pode deixar o  <GiCat className={styles.foe} /> te caçar, e você não pode voltar pra casa de mãos vazias: ao menos pegue um <GiCheeseWedge className={styles.cheese} /> durante o percurso! <strong>Ande um pouco até que um pedaço apareça no mapa.</strong></p>
              <br/>
              <p className={`${inter.className} ${styles.paragraph}`}>O maior desafio deste jogo não é o <GiCat className={styles.foe} /> nem mesmo procurar e pegar um pedaço de <GiCheeseWedge className={styles.cheese} />, mas é o próprio mapa em si!</p>
              <br/>
              <p className={`${inter.className} ${styles.paragraph}`}><strong>O mapa é feito de células que representam um autômato celular.</strong></p>
              <details>
                <summary className={`${inter.className} ${styles.paragraph}`}>
                  Um autômato celular é...
                </summary>
                <p className={`${inter.className} ${styles.paragraph}`}>...um modelo matemático que consiste em uma grade de células que evoluem ao longo do tempo de acordo com um conjunto de regras simples baseadas nos estados das células vizinhas. Cada célula pode ter um número finito de estados, geralmente representados por cores, e as regras definem como as células mudam de uma etapa de tempo para a próxima. Autômatos celulares têm sido usados ​​para modelar uma ampla gama de fenômenos naturais e artificiais, incluindo o comportamento de fluidos, o crescimento de plantas e a disseminação de doenças. </p>
              </details>
              <br/>
              <p className={`${inter.className} ${styles.paragraph}`}>Células em tons de branco/preto representam células mortas, enquanto que células em tons de vermelho representam células vivas. Mantenha a si mesmo dentro de células mortas. Se você tocar uma célula viva, é fim de jogo.</p>
              <br/>
              <p className={`${inter.className} ${styles.paragraph}`}><strong>Cabe a você investigar como esse autômato celular evolui para que você possa se mover com segurança pelo tabuleiro!</strong></p>
              <br/>
              <em className={`${inter.className} ${styles.paragraph}`}><strong>Você está pronto para a tarefa?</strong></em>
            </>
          }          
        </article>
      </Dialog>
      <Dialog name='config'>
        <article>
          { locale == 'en-US' && 
            <div className={`${inter.className} ${styles.themeSet}`}>
              <p
                className={`${inter.className} ${styles.themeText}`}>
                  Set theme
              </p>
              <div className={styles.themeSet}>
                <input
                  name='theme'
                  onChange={() => storeChosenTheme('light')}
                  className={styles.inputRadio}
                  id='light'
                  type='radio'
                  checked={ localTheme?.theme
                    ? localTheme.theme == 'light'
                      ? true
                      : false
                    : true }
                />
                <label
                  htmlFor='theme'
                  className={`${inter.className} ${styles.themeText}`}>
                    Light | Dark
                </label>
                <input
                  name='theme'
                  onChange={() => storeChosenTheme('dark')}
                  className={styles.inputRadio}
                  id='dark'
                  type='radio'
                  checked={ localTheme?.theme
                    ? localTheme.theme == 'dark'
                      ? true
                      : false
                    : false }                
                />
              </div>
            </div>
          }
          { locale == 'pt-BR' && 
            <div className={`${inter.className} ${styles.themeSet}`}>
              <p
                className={`${inter.className} ${styles.themeText}`}>
                  Definir tema
              </p>
              <div className={styles.themeSet}>
                <input
                  name='theme'
                  onChange={() => storeChosenTheme('light')}
                  className={styles.inputRadio}
                  id='light'
                  type='radio'
                  checked={ localTheme?.theme
                    ? localTheme.theme == 'light'
                      ? true
                      : false
                    : true }
                />
                <label
                  htmlFor='theme'
                  className={`${inter.className} ${styles.themeText}`}>
                    Claro | Escuro
                </label>
                <input
                  name='theme'
                  onChange={() => storeChosenTheme('dark')}
                  className={styles.inputRadio}
                  id='dark'
                  type='radio'
                  checked={ localTheme?.theme
                    ? localTheme.theme == 'dark'
                      ? true
                      : false
                    : false }                
                />
              </div>
            </div>
          }
          <br/>
          <div className={`${inter.className} ${styles.themeSet}`}>
            <p
              className={`${inter.className} ${styles.themeText}`}>
                {`${locale == 'pt-BR' ? 'Definir idioma' : 'Set language'}`}
            </p>
            <div className={styles.themeSet}>
              <input
                name='language'
                onChange={() => changeLanguage('en-US')}
                className={styles.inputRadio}
                id='en-US'
                type='radio'
                checked={ locale == 'en-US'
                    ? true
                    : false }
              />
              <label
                htmlFor='theme'
                className={`${inter.className} ${styles.themeText}`}>
                  English | Português
              </label>
              <input
                name='language'
                onChange={() => changeLanguage('pt-BR')}
                className={styles.inputRadio}
                id='pt-BR'
                type='radio'
                checked={ locale == 'pt-BR'
                    ? true
                    : false }                
              />
            </div>
          </div>                  
          <br/>
          {/* { localStorage && JSON.parse(localStorage.getItem('@app:loses') as string).map((item: localLoseProps) => (
            <div key={item.date}>
              <p>{item.date}</p>
              <p>{item.reason}</p>
              <p>{item.steps}</p>
            </div>
          ))} */}
          { locale == 'en-US' && 
            <>
              <p className={`${inter.className} ${styles.paragraph}`}>Game inspired <a className={styles.anchor} href="https://sigmageek.com/challenge/stone-automata-maze-challenge">by this SigmaGeek challenge</a>.</p>
              <br/>
              <br/>
              <em className={`${inter.className} ${styles.paragraph}`}>Developed with <BsFillSuitHeartFill /> by <a className={styles.anchor} href="https://github.com/victorsgb">Victor Baptista</a>.</em>
            </>
          }
          { locale == 'pt-BR' && 
            <>
              <p className={`${inter.className} ${styles.paragraph}`}>Jogo inspirado <a className={styles.anchor} href="https://sigmageek.com/challenge/stone-automata-maze-challenge">neste desafio do SigmaGeek</a>.</p>
              <br/>
              <br/>
              <em className={`${inter.className} ${styles.paragraph}`}>Desenvolvido com <BsFillSuitHeartFill /> por <a className={styles.anchor} href="https://github.com/victorsgb">Victor Baptista</a>.</em>
            </>
          }          
        </article>
      </Dialog>      
    </>
  )
}
