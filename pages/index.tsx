// Core dependencies
import { Roboto_Mono } from 'next/font/google';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

// Custom components
import Board from '../components/board';
import ControlPad from '../components/controlPad';
import DateDistance from '../components/dateDistance';
import Dialog from '../components/dialog';

// Styling related import
import styles from '../styles/Home.module.css'
import { BsFillSuitHeartFill, BsHouseCheckFill } from 'react-icons/bs';
import { GiCat, GiCheeseWedge, GiSeatedMouse } from 'react-icons/gi';
import { GoGear, GoInfo, GoQuestion } from 'react-icons/go';

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
}

export interface localWinProps {
  date: string;
  cheeses: number;
  steps: number;
}

export interface localHistoryProps {
  wins: localWinProps[] | null;
  loses: localLoseProps[] | null;
}

export interface localAudioProps {
  active: boolean;
  volume: number;
}

export type buttonValues = 'U' | 'D' | 'L' | 'R' | null;

const roboto_mono = Roboto_Mono({ subsets: ['latin'] });


export default function Home() {

  const router = useRouter();
  const { locale, asPath } = useRouter();

  const [loading, setLoading] = useState<boolean>(false);

  const [backgroundMusic, setBackgroundMusic] = useState<HTMLAudioElement | null >(null);

  const [notification, setNotification] = useState<notificationProps | null>(null);

  const [localTheme, setLocalTheme] = useState<localThemeProps | null>(null);

  const [localHistory, setLocalHistory] = useState<localHistoryProps>({wins: null, loses: null});

  const [localMusic, setLocalMusic] = useState<localAudioProps>({ active: true, volume: 1.0});

  const [localSound, setLocalSound] = useState<localAudioProps>({ active: true, volume: 1.0});

  const [buttonClickValue, setButtonClickValue] = useState<buttonValues>(null);

  function handleShowDoubtModal() {
    const dialog = document.querySelector(`dialog#doubt`) as HTMLDialogElement;
    dialog?.showModal();
  }

  function handleShowConfigModal() {
    const dialog = document.querySelector(`dialog#config`) as HTMLDialogElement;
    dialog?.showModal();
  }

  function handleShowCreditsModal() {
    const dialog = document.querySelector(`dialog#credits`) as HTMLDialogElement;
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

  function storeMusicActivation(active: boolean) {

    if (localStorage) {
      localStorage.setItem('@app:music', JSON.stringify({
        active: active,
        volume: localMusic.volume
      }));
      setLocalMusic({
        ...localMusic,
        active
      });

      if (backgroundMusic) {
        if (!localMusic.active) {
          backgroundMusic.play();
        } else {
          backgroundMusic.pause();
        } 
      }
    }
  }

  function storeSoundActivation(active: boolean) {

    if (localStorage) {
      localStorage.setItem('@app:sound', JSON.stringify({
        active: active,
        volume: localSound.volume
      }));
      setLocalSound({
        ...localSound,
        active
      });
    }
  }

  function storeAudioVolume(event: any) {

    event.preventDefault();

    if (localStorage) {
      localStorage.setItem('@app:music', JSON.stringify({
        active: localMusic.active,
        volume: event.target.value
      }));

      setLocalMusic({
        ...localMusic,
        volume: event.target.value
      });

      localStorage.setItem('@app:sound', JSON.stringify({
        active: localSound.active,
        volume: event.target.value
      }));

      setLocalSound({
        ...localSound,
        volume: event.target.value
      });

      if (backgroundMusic) {      
        backgroundMusic.volume = event.target.value;
      }
    }


  }

  function eraseLocalHistory() {
    if (localHistory) {
      setLocalHistory({
        wins: null,
        loses: null
      });
    }

    if (localStorage) {
      localStorage.removeItem('@app:wins');
      localStorage.removeItem('@app:loses');
    }
  }

  useEffect(() => {

    if (localStorage.getItem('@app:wins') && localStorage.getItem('@app:loses')) {
      let localWins: localWinProps[] = JSON.parse(localStorage.getItem('@app:wins') as string);
      let localLoses: localLoseProps[] = JSON.parse(localStorage.getItem('@app:loses') as string);


      setLocalHistory({
        wins: localWins,
        loses: localLoses    
      });
    }

    else if (localStorage.getItem('@app:wins') && !localStorage.getItem('@app:loses')) {
      let localWins: localWinProps[] = JSON.parse(localStorage.getItem('@app:wins') as string);

      setLocalHistory({
        ...localHistory,
        wins: localWins    
      });
    }

    else if (!localStorage.getItem('@app:wins') && localStorage.getItem('@app:loses')) {
      let localLoses: localLoseProps[] = JSON.parse(localStorage.getItem('@app:loses') as string);

      setLocalHistory({
        ...localHistory,
        loses: localLoses    
      });
    }

  }, []);
  
  useEffect(() => {

    if (localStorage.getItem('@app:theme')) {
      let localTheme = JSON.parse(localStorage.getItem('@app:theme') as string);

      setLocalTheme({
        theme: localTheme.value
      })
    }

  }, [localTheme?.theme]);

  useEffect(() => {

    if (localStorage.getItem('@app:music')) {
      let localMusic = JSON.parse(localStorage.getItem('@app:music') as string);

      setLocalMusic({
        active: localMusic.active,
        volume: localMusic.volume
      })
    }

  }, [localMusic?.active, localMusic?.volume]);

  useEffect(() => {

    if (localStorage.getItem('@app:sound')) {
      let localSound = JSON.parse(localStorage.getItem('@app:sound') as string);

      setLocalSound({
        active: localSound.active,
        volume: localSound.volume
      })
    }

  }, [localSound?.active, localSound?.volume]);

  useEffect(() => {

    if (loading) {
      setTimeout(() => setLoading(false), 500);
    }

  }, [loading]);

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
          { locale == 'en-US' &&
            <span className={`${styles.buttonText} ${roboto_mono.className}`}>Objective</span>
          }
          { locale == 'pt-BR' &&
            <span lang='pt' className={`${styles.buttonText} ${roboto_mono.className}`}>Objetivo</span>
          }          
          <GoQuestion size={25} className={styles.icon} />
        </button>
        { locale == 'en-US' &&  
          <h3 className={roboto_mono.className}>Cellular Automaton Game</h3>
        }
        { locale == 'pt-BR' &&  
          <h3 lang='pt' className={roboto_mono.className}>Jogo do Autômato Celular</h3>
        }
        <button
          className={styles.button}
          onClick={handleShowConfigModal}  
        >
          { locale == 'en-US' &&
            <span className={`${styles.buttonText} ${roboto_mono.className}`}>Config</span>
          }
          { locale == 'pt-BR' &&
            <span lang='pt' className={`${styles.buttonText} ${roboto_mono.className}`}>Ajustes</span>
          }   
          <GoGear size={25} className={styles.icon} />
        </button>
        <button
          className={styles.button}
          onClick={handleShowCreditsModal}  
        >
          { locale == 'en-US' &&
            <span className={`${styles.buttonText} ${roboto_mono.className}`}>Credits</span>
          }
          { locale == 'pt-BR' &&
            <span lang='pt' className={`${styles.buttonText} ${roboto_mono.className}`}>Créditos</span>
          }   
          <GoInfo size={25} className={styles.icon} />
        </button>
      </header>
      <section className={styles.notify}>
        { notification !== null && locale == 'en-US' &&
          <>
            <h3 className={`
              ${roboto_mono.className}
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
              `${roboto_mono.className}
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
            <h3 lang='pt' className={`
              ${roboto_mono.className}
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
            <p lang='pt' className={
              `${roboto_mono.className}
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
          <p className={`${roboto_mono.className} ${styles.inform}`}>click on one of the buttons in the lower left corner or press <kbd>⬅️⬆️⬇️➡️</kbd> to move or <kbd>ENTER</kbd> to restart...</p>
        }
        { locale == 'pt-BR' && 
          <>
            <p lang='pt' className={`${roboto_mono.className} ${styles.inform}`}>clique em um dos botões no canto inferior esquerdo ou pressione <kbd>⬅️⬆️⬇️➡️</kbd> para se mover ou <kbd>ENTER</kbd> para recomeçar...</p>
          </>
        }
        <Board
          notificationSetter={setNotification}
          localHistory={localHistory}
          localHistorySetter={setLocalHistory}
          buttonValue={buttonClickValue}
          buttonValueSetter={setButtonClickValue}
          backgroundMusic={backgroundMusic}
          backgroundMusicSetter={setBackgroundMusic}
          localMusic={localMusic}
          localSound={localSound}
          loading={loading}
          loadingSetter={setLoading}
        />
      </main>
      <Dialog name='doubt'>
        <article>
          { locale == 'en-US' && 
            <>
              <section className={styles.section}>
                <p className={`${roboto_mono.className} ${styles.paragraph}`}>Can you lead your avatar (i.e., <GiSeatedMouse className={styles.player} />) back home (<BsHouseCheckFill className={styles.homeOpen} />)? Just use a keyboard to move it by pressing <kbd>⬅️⬆️⬇️➡️</kbd>. Each press in one of these buttons will move the <GiSeatedMouse className={styles.player} /> one step. <strong>Easy, right?</strong></p>
                <img className={styles.img} src="/section-1.png" alt="" />
              </section>
              <br/>
              <section className={styles.section}>
                <img className={styles.img} src="/section-2.png" alt="" />
                <p className={`${roboto_mono.className} ${styles.paragraph}`}>There are a few drawbacks: you cannot let the cat (<GiCat className={styles.foe} />) hunt you down, and you cannot get back home empty-handed: at least get a piece of cheese (<GiCheeseWedge className={styles.cheese} />) along the way! <strong>Walk a little bit till one shows up on the map.</strong></p>
              </section>
              <br/>
              <p className={`${roboto_mono.className} ${styles.paragraph}`}>The major challenge of this game is not the cat (<GiCat className={styles.foe} />) nor finding and catching a piece of cheese(<GiCheeseWedge className={styles.cheese} />), but it is the map itself!</p>
              <br/>
              <p className={`${roboto_mono.className} ${styles.paragraph}`}><strong>The map is made of cells that represent a cellular automaton.</strong></p>
              <br />
              <details>
                <summary className={`${roboto_mono.className} ${styles.paragraph} ${styles.anchor}`}>
                  A cellular automaton is...
                </summary>
                <section>
                  <p className={`${roboto_mono.className} ${styles.paragraph}`}>...a mathematical model consisting of a grid of cells that evolve over time according to a set of simple rules based on the states of neighboring cells. Each cell can have a finite number of states, typically represented by colors, and the rules define how the cells change from one time step to the next. Cellular automata have been used to model a wide range of natural and artificial phenomena, including the behavior of fluids, the growth of plants, and the spread of disease.</p>
                  <br />
                  <p className={`${roboto_mono.className} ${styles.paragraph}`}>You can learn more about cellular automata, <a className={styles.anchor} href="https://jeremykun.com/2011/06/29/conways-game-of-life/" target='_blank'>on this link.</a></p>
                </section>
              </details>
              <br/>
              <section className={styles.section}>
                <p className={`${roboto_mono.className} ${styles.paragraph}`}>Cells in black/white tones represent dead cells, whereas cells in red tones mean live cells. Keep yourself inside dead cells. If you touch a living cell, your life will be reduced until you eventually lose the game.</p>
                <br/>
                <img className={styles.img} src="/section-3.png" alt="" />
              </section>
              <br />
              <p className={`${roboto_mono.className} ${styles.paragraph}`}><strong>It&apos;s up to you to investigate how this cellular automaton evolves so you can safely move along the board!</strong></p>
              <br/>
              <em className={`${roboto_mono.className} ${styles.paragraph}`}><strong>Are you up to the task?</strong></em>
            </>
          }
          { locale == 'pt-BR' && 
            <>
              <section className={styles.section}>
                <p lang='pt' className={`${roboto_mono.className} ${styles.paragraph}`}>Você pode guiar seu avatar (isto é, <GiSeatedMouse className={styles.player} />) de volta à sua casa (<BsHouseCheckFill className={styles.homeOpen} />)? Apenas use o teclado para movê-lo pressionando <kbd>⬅️⬆️⬇️➡️</kbd>. Cada tecla pressionada moverá o <GiSeatedMouse className={styles.player} /> em um passo. <strong>Fácil, não?</strong></p>
                <img className={styles.img} src="/section-1.png" alt="" />
              </section>
              <br/>
              <section className={styles.section}>
                <img className={styles.img} src="/section-2.png" alt="" />
                <p lang='pt' className={`${roboto_mono.className} ${styles.paragraph}`}>Existem algumas desvantagens: você não pode deixar o gato (<GiCat className={styles.foe} />) te caçar, e você não pode voltar pra casa de mãos vazias: ao menos pegue um pedaço de queijo (<GiCheeseWedge className={styles.cheese} />) durante o percurso! <strong>Ande um pouco até que um pedaço apareça no mapa.</strong></p>
              </section>
              <br/>
              <p lang='pt' className={`${roboto_mono.className} ${styles.paragraph}`}>O maior desafio deste jogo não é o gato (<GiCat className={styles.foe} />) nem mesmo procurar e pegar um pedaço de queijo (<GiCheeseWedge className={styles.cheese} />), mas é o próprio mapa em si!</p>
              <br/>
              <p lang='pt' className={`${roboto_mono.className} ${styles.paragraph}`}><strong>O mapa é feito de células que representam um autômato celular.</strong></p>
              <br />
              <details>
                <summary lang='pt' className={`${roboto_mono.className} ${styles.paragraph} ${styles.anchor}`}>
                  Um autômato celular é...
                </summary>
                <p lang='pt' className={`${roboto_mono.className} ${styles.paragraph}`}>...um modelo matemático que consiste em uma grade de células que evoluem ao longo do tempo de acordo com um conjunto de regras simples baseadas nos estados das células vizinhas. Cada célula pode ter um número finito de estados, geralmente representados por cores, e as regras definem como as células mudam de uma etapa de tempo para a próxima. Autômatos celulares têm sido usados ​​para modelar uma ampla gama de fenômenos naturais e artificiais, incluindo o comportamento de fluidos, o crescimento de plantas e a disseminação de doenças. </p>
              </details>
              <br/>
              <section className={styles.section}>
                <p lang='pt' className={`${roboto_mono.className} ${styles.paragraph}`}>Células em tons de branco/preto representam células mortas, enquanto que células em tons de vermelho representam células vivas. Mantenha a si mesmo dentro de células mortas. Se você tocar uma célula viva, terá sua vida reduzida, até eventualmente morrer de vez.</p>
                <img className={styles.img} src="/section-3.png" alt="" />
              </section>
              <br/>
              <p lang='pt' className={`${roboto_mono.className} ${styles.paragraph}`}><strong>Cabe a você investigar como esse autômato celular evolui para que você possa se mover com segurança pelo tabuleiro!</strong></p>
              <br/>
              <em lang='pt' className={`${roboto_mono.className} ${styles.paragraph}`}><strong>Você está pronto para a tarefa?</strong></em>
            </>
          }          
        </article>
      </Dialog>
      <Dialog name='config'>
        <article>
          { locale == 'en-US' && 
            <div className={`${roboto_mono.className} ${styles.configSet}`}>
              <p
                className={`${roboto_mono.className} ${styles.configText}`}>
                  Set theme
              </p>
              <div className={styles.configSet}>
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
                  className={`${roboto_mono.className} ${styles.configOptions}`}>
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
            <div className={`${roboto_mono.className} ${styles.configSet}`}>
              <p
                lang='pt'
                className={`${roboto_mono.className} ${styles.configText}`}>
                  Definir tema
              </p>
              <div className={styles.configSet}>
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
                  lang='pt'
                  htmlFor='theme'
                  className={`${roboto_mono.className} ${styles.configOptions}`}>
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
          <div className={`${roboto_mono.className} ${styles.configSet}`}>
            <p
              className={`${roboto_mono.className} ${styles.configText}`}>
                {`${locale == 'pt-BR' ? 'Definir idioma' : 'Set language'}`}
            </p>
            <div className={styles.configSet}>
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
                className={`${roboto_mono.className} ${styles.configOptions}`}>
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
          { locale == 'en-US' && 
            <div className={`${roboto_mono.className} ${styles.configSet}`}>
              <p
                className={`${roboto_mono.className} ${styles.configText}`}>
                  Set music
              </p>
              <div className={styles.configSet}>
                <input
                  name='music-active'
                  onChange={() => storeMusicActivation(true)}
                  className={styles.inputRadio}
                  id='on'
                  type='radio'
                  checked={ localMusic && localMusic.active }
                />
                <label
                  htmlFor='music-active'
                  className={`${roboto_mono.className} ${styles.configOptions}`}>
                    On | Off
                </label>
                <input
                  name='music-active'
                  onChange={() => storeMusicActivation(false)}
                  className={styles.inputRadio}
                  id='off'
                  type='radio'
                  checked={ localMusic && !localMusic.active ? true : false }
                />
              </div>
            </div>
          }
          { locale == 'pt-BR' && 
            <div className={`${roboto_mono.className} ${styles.configSet}`}>
              <p
                lang='pt'
                className={`${roboto_mono.className} ${styles.configText}`}>
                  Definir música
              </p>
              <div className={styles.configSet}>
                <input
                  name='music-active'
                  onChange={() => storeMusicActivation(true)}
                  className={styles.inputRadio}
                  id='on'
                  type='radio'
                  checked={ localMusic && localMusic.active }
                />
                <label
                  lang='pt'
                  htmlFor='music-active'
                  className={`${roboto_mono.className} ${styles.configOptions}`}>
                    Ligado | Desligado
                </label>
                <input
                  name='music-active'
                  onChange={() => storeMusicActivation(false)}
                  className={styles.inputRadio}
                  id='off'
                  type='radio'
                  checked={ localMusic && !localMusic.active ? true : false }
                />
              </div>
            </div>
          }
          <br />
          { locale == 'en-US' && 
            <div className={`${roboto_mono.className} ${styles.configSet}`}>
              <p
                className={`${roboto_mono.className} ${styles.configText}`}>
                  Set sounds
              </p>
              <div className={styles.configSet}>
                <input
                  name='sound-active'
                  onChange={() => storeSoundActivation(true)}
                  className={styles.inputRadio}
                  id='on'
                  type='radio'
                  checked={ localSound && localSound.active }
                />
                <label
                  htmlFor='sound-active'
                  className={`${roboto_mono.className} ${styles.configOptions}`}>
                    On | Off
                </label>
                <input
                  name='sound-active'
                  onChange={() => storeSoundActivation(false)}
                  className={styles.inputRadio}
                  id='off'
                  type='radio'
                  checked={ localSound && !localSound.active ? true : false }
                />
              </div>
            </div>
          }
          { locale == 'pt-BR' && 
            <div className={`${roboto_mono.className} ${styles.configSet}`}>
              <p
                lang='pt'
                className={`${roboto_mono.className} ${styles.configText}`}>
                  Definir sons
              </p>
              <div className={styles.configSet}>
                <input
                  name='sound-active'
                  onChange={() => storeSoundActivation(true)}
                  className={styles.inputRadio}
                  id='on'
                  type='radio'
                  checked={ localSound && localSound.active }
                />
                <label
                  lang='pt'
                  htmlFor='sound-active'
                  className={`${roboto_mono.className} ${styles.configOptions}`}>
                    Ligado | Desligado
                </label>
                <input
                  name='sound-active'
                  onChange={() => storeSoundActivation(false)}
                  className={styles.inputRadio}
                  id='off'
                  type='radio'
                  checked={ localSound && !localSound.active ? true : false }
                />
              </div>
            </div>
          }
          <br />
          { locale == 'en-US' && 
            <div className={`${roboto_mono.className} ${styles.configSet}`}>
              <p
                className={`${roboto_mono.className} ${styles.configText}`}>
                  Set volume: {String(Math.floor(localMusic.volume * 100)).padStart(2, '0')}%
              </p>
              <div className={styles.configSet}>
                <input
                  name='audio-volume'
                  onInput={storeAudioVolume}
                  className={styles.inputRange}
                  type='range'
                  min='0'
                  max='1'
                  step='0.01'
                  value={localMusic.volume}
                />
              </div>
            </div>
          }
          { locale == 'pt-BR' && 
            <div className={`${roboto_mono.className} ${styles.configSet}`}>
              <p
                lang='pt'
                className={`${roboto_mono.className} ${styles.configText}`}>
                  Definir volume: {String(Math.floor(localMusic.volume * 100)).padStart(2, '0')}%
              </p>
              <div className={styles.configSet}>
                <input
                  name='audio-volume'
                  onInput={storeAudioVolume}
                  className={styles.inputRange}
                  type='range'
                  min='0'
                  max='1'
                  step='0.01'
                  value={localMusic.volume}
                />
              </div>
            </div>
          }         
        </article>
      </Dialog>
      <Dialog name='credits'>
        <article>
          { localHistory?.wins &&
            <table className={`${styles.table} ${roboto_mono.className}`}>
              { locale == 'en-US' && 
                <>
                  <caption>Five Best Wins</caption>
                  <thead>
                   <tr className={styles.tr}>
                      <th>Date</th>
                      <th>Cheeses</th>
                      <th>Steps</th>
                    </tr>
                  </thead>
                </>
              }
              { locale == 'pt-BR' && 
                <>
                  <caption lang='pt'>Cinco Melhores Vitórias</caption>
                  <thead lang='pt'>
                    <tr className={styles.tr}>
                      <th>Quando</th>
                      <th>Queijos</th>
                      <th>Passos</th>
                    </tr>
                  </thead>
                </>
              }
              <tbody>
                {localHistory.wins.map((item: localWinProps, index) => (
                    <tr key={index} className={styles.tr}>
                      <td><DateDistance baseDate={JSON.parse(item.date)} /></td>
                      <td>{item.cheeses}</td>
                      <td>{item.steps}</td>
                    </tr>
                ))}          
              </tbody>
            </table>
          }
          <br/>
          { localHistory?.loses &&
            <table className={`${styles.table} ${roboto_mono.className}`}>
              { locale == 'en-US' && 
                <>
                  <caption>Five Best Loses</caption>
                  <thead>
                    <tr className={styles.tr}>
                      <th>When</th>
                      <th>Steps</th>
                    </tr>
                  </thead>
                </>
              }
              { locale == 'pt-BR' && 
                <>
                  <caption lang='pt'>Cinco Melhores Derrotas</caption>
                  <thead lang='pt'>
                    <tr className={styles.tr}>
                      <th>Quando</th>
                      <th>Passos</th>
                    </tr>
                  </thead>
                </>
              }
              <tbody>
                {localHistory.loses.map((item: localLoseProps, index) => (
                    <tr key={index} className={styles.tr}>
                      <td><DateDistance baseDate={JSON.parse(item.date)} /></td>
                      <td>{item.steps}</td>
                    </tr>
                ))}          
              </tbody>
            </table>
          }
          <br/>
          { locale == 'en-US' && 
            <>
              <p className={`${roboto_mono.className} ${styles.paragraph}`}>Game inspired <a className={styles.anchor} href="https://sigmageek.com/challenge/stone-automata-maze-challenge">by this SigmaGeek challenge</a>.</p>
              <br />
              <p className={`${roboto_mono.className} ${styles.paragraph}`}>Sound effects by <a className={styles.anchor} href="https://www.kenney.nl">Kenney (www.kenney.nl)</a>.</p>
              <p className={`${roboto_mono.className} ${styles.paragraph}`}>Music by <a className={styles.anchor} href="https://www.soundimage.org">Eric Matyas (www.soundimage.org)</a>.</p>
              <br />
              <p className={`${roboto_mono.className} ${styles.paragraph}`}>We do not perform data collection. The results displayed here are stored in your own browser and you can delete them permanently at any time <button onClick={eraseLocalHistory} className={`${styles.eraseButton} ${roboto_mono.className}`}>by clicking here</button>.</p>
              <br/>
              <em className={`${roboto_mono.className} ${styles.author}`}>Developed with <BsFillSuitHeartFill /> by <a className={styles.anchor} href="https://github.com/victorsgb">Victor Baptista</a></em>
            </>
          }
          { locale == 'pt-BR' && 
            <>
              <p lang='pt' className={`${roboto_mono.className} ${styles.paragraph}`}>Jogo inspirado <a className={styles.anchor} href="https://sigmageek.com/challenge/stone-automata-maze-challenge">neste desafio do SigmaGeek</a>.</p>
              <br />
              <p lang='pt' className={`${roboto_mono.className} ${styles.paragraph}`}>Efeitos sonoros por <a className={styles.anchor} href="https://www.kenney.nl">Kenney (www.kenney.nl)</a>.</p>
              <p className={`${roboto_mono.className} ${styles.paragraph}`}>Música por <a className={styles.anchor} href="https://www.soundimage.org">Eric Matyas (www.soundimage.org)</a>.</p>              
              <br />
              <p lang='pt' className={`${roboto_mono.className} ${styles.paragraph}`}>Não fazemos nenhum tipo de coleta de dados. Os resultados aqui exibidos estão sendo salvos no seu próprio navegador e você apagá-los permanentemente sempre que desejar <button onClick={eraseLocalHistory} className={`${styles.eraseButton} ${roboto_mono.className}`}>clicando aqui</button>.</p>
              <br/>
              <em lang='pt' className={`${roboto_mono.className} ${styles.author}`}>Desenvolvido com <BsFillSuitHeartFill /> por <a className={styles.anchor} href="https://github.com/victorsgb">Victor Baptista</a></em>
            </>
          }          
        </article>
      </Dialog>
      <ControlPad
        buttonValueSetter={setButtonClickValue}
        loading={loading}
      />
      { locale === 'en-US' && 
        <footer className={`${styles.footer} ${roboto_mono.className}`}>&copy; 2023 Victor Baptista - All rights reserved.</footer>      
      }
      { locale === 'pt-BR' && 
        <footer lang='pt' className={`${styles.footer} ${roboto_mono.className}`}>&copy; 2023 Victor Baptista - Todos os direitos reservados.</footer>          
      }
    </>
  )
}
