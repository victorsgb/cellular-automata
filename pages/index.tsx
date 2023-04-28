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
        <title>{locale == 'pt-BR' ? 'Jogo do Autômato Celular' : 'Cellular Automaton Game'}</title>
        <meta 
          name='description'
          content={locale == 'pt-BR' ? 'Jogo inspirado em um desafio do Sigma Geek para tratar do tema de autômatos celulares' : 'Game inspired by a Sigma Geek challenge to address the cellular automata subject'}
        />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <header className={styles.header}>
        <button
          title={ locale == 'pt-BR'
            ? 'Botão para exibir o objetivo do jogo'
            : 'Button to exhibit the objective of the game' }
          className={styles.button}
          onClick={handleShowDoubtModal} >
          <span
            lang={locale == 'pt-BR' ? 'pt' : 'en'}
            className={`${styles.buttonText} ${roboto_mono.className}`} >
            {locale == 'pt-BR' ? 'Objetivo' : 'Objective'}
          </span>
          <GoQuestion size={25} className={styles.icon} />
        </button>
        <h3
          lang={locale==='pt-BR' ? 'pt' : 'en'}
          className={roboto_mono.className} >
          { locale == 'pt-BR'
            ? 'Jogo do Autômato Celular'
            : 'Cellular Automaton Game' }
        </h3>
        <button
          title={ locale == 'pt-BR'
            ? 'Botão para exibir as configurações disponíveis, tais como o idioma e tema'
            : 'Button to exhibit the available configurations, such as language and theme' }
          className={styles.button}
          onClick={handleShowConfigModal} >
          <span
            lang={locale == 'pt-BR' ? 'pt' : 'en'}
            className={`${styles.buttonText} ${roboto_mono.className}`} >
            {locale == 'pt-BR' ? 'Ajustes' : 'Config'}
          </span>
          <GoGear size={25} className={styles.icon} />
        </button>
        <button
          title={ locale == 'pt-BR'
            ? 'Botão para exibir os créditos, bem como visualizar suas melhores performances no jogo'
            : 'Button to exhibit credits and also visualize your best performances on the game' }
          className={styles.button}
          onClick={handleShowCreditsModal} >
          <span
            lang={locale == 'pt-BR' ? 'pt' : 'en'}
            className={`${styles.buttonText} ${roboto_mono.className}`} >
            { locale == 'pt-BR' ? 'Créditos' : 'Credits'}
          </span>
          <GoInfo size={25} className={styles.icon} />
        </button>
      </header>
      <section className={styles.notify}>
        { notification !== null &&
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
                  : '' }`} >
              { notification.type == 'lose'
                ? locale == 'pt-BR' ? 'Fim de jogo' : 'Game Over'
                : notification.type == 'alert'
                  ? locale == 'pt-BR' ? 'Alerta' : 'Alert'
                  : notification.type == 'win'
                    ? locale == 'pt-BR' ? 'Você venceu!' : 'You win!'
                    : '' }
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
      </section>
      <main className={styles.main}>
        <p
          lang={locale == 'pt-BR' ? 'pt' : 'en'}
          className={`${roboto_mono.className} ${styles.inform}`} >
          { locale == 'pt-BR'
            ? 'clique em um dos botões no canto inferior esquerdo ou pressione ⬅️⬆️⬇️➡️ para se mover ou ENTER para recomeçar...'
            : 'click on one of the buttons in the lower left corner or press ⬅️⬆️⬇️➡️ to move or ENTER to restart...' }
        </p>
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
        <article lang={locale == 'pt-BR' ? 'pt' : 'en'}>
          <section
            className={styles.section} >
            <p className={`${roboto_mono.className} ${styles.paragraphRightAligned}`}>
              { locale == 'pt-BR'
                ? 'Você pode guiar seu avatar (isto é, '
                : 'Can you lead your avatar (i.e., ' }
              <GiSeatedMouse className={styles.player} />
              { locale == 'pt-BR'
                ? ') de volta à sua casa ('
                : ') back home (' }               
              <BsHouseCheckFill className={styles.homeOpen} />
              { locale == 'pt-BR' 
                ? ')? Apenas use o teclado para movê-lo pressionando ⬅️⬆️⬇️➡️. Cada tecla pressionada moverá o '
                : ')? Just use a keyboard to move it by pressing ⬅️⬆️⬇️➡️. Each press in one of these buttons will move the ' }
              <GiSeatedMouse className={styles.player} />
              { locale == 'pt-BR'
                ? ' one step. '
                : ' em um passo. ' }
              <strong>
                { locale == 'pt-BR'
                  ? 'Fácil, não?'
                  : 'Easy, right?' }
              </strong>
            </p>
            <img
              src={ localTheme && localTheme.theme == 'light'
                ? '/section-1-light.png'
                : '/section-1-dark.png' }
              className={styles.img}
              alt={ locale=='pt-BR'
                ? 'Possíveis movimentos do jogador em direção à casa'
                : 'Possible player movement towards home' }
            />
          </section>
          <br/>
          <section className={styles.section}>
            <img
              src={ localTheme && localTheme.theme == 'light'
              ? '/section-2-light.png'
              : '/section-2-dark.png' }
              className={styles.img}
              alt={ locale=='pt-BR'
                ? 'Jogador em direção ao queijo, evitando ser engolido pelo gato'
                : 'Player going towards the cheese, avoiding being eaten by the cat' }
            />
            <p className={`${roboto_mono.className} ${styles.paragraphLeftAligned}`}>
              { locale == 'pt-BR' 
                ? 'Existem algumas desvantagens: você não pode deixar o gato ('
                : 'There are a few drawbacks: you cannot let the cat (' }
              <GiCat className={styles.foe} />
              { locale == 'pt-BR' 
                ? ') te caçar, e você não pode voltar pra casa de mãos vazias: traga pelo menos um pedaço de queijo ('
                : ') hunt you down, and you cannot get back home empty-handed: at least get a piece of cheese (' }
              <GiCheeseWedge className={styles.cheese} />
              { locale == 'pt-BR' 
                ? ') durante o trajeto! '
                : ') along the way! ' }
              <strong>
                { locale == 'pt-BR' 
                  ? 'Ande um pouco pelo mapa até que um pedaço apareça em algum lugar.'
                  : 'Walk a little bit till one shows up on the map.' }
              </strong>
            </p>
          </section>
          <br/>
          <p className={`${roboto_mono.className} ${styles.paragraph}`}>
            { locale == 'pt-BR' 
              ? 'O maior desafio desse jogo não é o gato ('
              : 'The major challenge of this game is not the cat (' }
            <GiCat className={styles.foe} />
            { locale == 'pt-BR' 
              ? ') nem achar e pegar um pedaço de queijo ('
              : ') nor finding and catching a piece of cheese (' }
            <GiCheeseWedge className={styles.cheese} />
            { locale == 'pt-BR' 
              ? '), mas é o mapa em si mesmo!'
              : '), but it is the map itself!' }
          </p>
          <br/>
          <p className={`${roboto_mono.className} ${styles.paragraph}`}>
            <strong>
              { locale == 'pt-BR' 
                ? 'O mapa é feito de células que representam um autômato celular.'
                : 'The map is made of cells that represent a cellular automaton.' }
            </strong>
          </p>
          <br />
          <details>
            <summary className={`${roboto_mono.className} ${styles.paragraphLeftAligned} ${styles.anchor}`}>
              { locale == 'pt-BR' 
                ? 'Um autômato celular é...'
                : 'A cellular automaton is...' }
            </summary>
            <section>
              <p className={`${roboto_mono.className} ${styles.paragraphLeftAligned}`}>
                { locale == 'pt-BR' 
                  ? '...um modelo matemático que consiste em uma grade de células que evoluem ao longo do tempo de acordo com um conjunto de regras simples baseadas nos estados das células vizinhas. Cada célula pode ter um número finito de estados, geralmente representados por cores, e as regras definem como as células mudam de uma etapa de tempo para a próxima. Autômatos celulares têm sido usados ​​para modelar uma ampla gama de fenômenos naturais e artificiais, incluindo o comportamento de fluidos, o crescimento de plantas e a disseminação de doenças.'
                  : '...a mathematical model consisting of a grid of cells that evolve over time according to a set of simple rules based on the states of neighboring cells. Each cell can have a finite number of states, typically represented by colors, and the rules define how the cells change from one time step to the next. Cellular automata have been used to model a wide range of natural and artificial phenomena, including the behavior of fluids, the growth of plants, and the spread of disease.' }
              </p>
              { locale == 'en-US' && 
                <>
                  <br />
                  <p className={`${roboto_mono.className} ${styles.paragraph}`}>
                    You can learn more about cellular automata <a className={styles.anchor} href="https://jeremykun.com/2011/06/29/conways-game-of-life/" target='_blank'>on this link.</a>
                  </p>
                </>
              }
            </section>
          </details>
          <br/>
          <section className={styles.section}>
            <p className={`${roboto_mono.className} ${styles.paragraphRightAligned}`}>
              { locale == 'pt-BR' 
                ? 'Células em tons de branco/preto representam células mortas, enquanto que células em tons de vermelho representam células vivas. Mantenha a si mesmo dentro de células mortas. Se você tocar uma célula viva, terá sua vida reduzida, até eventualmente morrer de vez.'
                : 'Cells in black/white tones represent dead cells, whereas cells in red tones mean live cells. Keep yourself inside dead cells. If you touch a living cell, your life will be reduced until you eventually lose the game.' }
            </p>
            <br/>
            <img
              src={ localTheme && localTheme.theme == 'light'
              ? '/section-3-light.png'
              : '/section-3-dark.png' }
              className={styles.img}
              alt={ locale=='pt-BR'
                ? 'Exemplos de células vivas e mortas'
                : 'Examples of living and dead cells' }
            />
          </section>
          <br />
          <p className={`${roboto_mono.className} ${styles.paragraph}`}>
            <strong>
              { locale == 'pt-BR' 
                ? 'É seu papel investigar como o autômato celular desse jogo evolui para que possas se mover com segurança pelo mapa!'
                : 'It is up to you to investigate how the cellular automaton from this game evolves so you can safely move along the map!' }
              </strong>
          </p>
          <br/>
          <em className={`${roboto_mono.className} ${styles.paragraph}`}>
            <strong>
              { locale == 'pt-BR' 
                ? 'Você está à altura da tarefa?'
                : 'Are you up to the task?' }
            </strong>
          </em>      
        </article>
      </Dialog>
      <Dialog name='config'>
        <article>
          <div className={`${roboto_mono.className} ${styles. configSet}`}>
            <p
              lang={locale =='pt-BR' ? 'pt' : 'en'}
              className={`${roboto_mono.className} ${styles.configText}`} >
                { locale == 'pt-BR'
                  ? 'Definir tema'
                  : 'Set theme' }
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
                  { locale == 'pt-BR' 
                    ? 'Claro | Escuro'
                    : 'Light | Dark' }
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
          <br/>
          <div className={`${roboto_mono.className} ${styles.configSet}`}>
            <p
              lang={locale =='pt-BR' ? 'pt' : 'en'}
              className={`${roboto_mono.className} ${styles.configText}`} >
                { locale == 'pt-BR'
                  ? 'Definir idioma'
                  : 'Set language' }
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
          <div className={`${roboto_mono.className} ${styles.configSet}`}>
            <p
              lang={locale == 'pt-BR' ? 'pt' : 'en'}
              className={`${roboto_mono.className} ${styles.configText}`} >
                { locale == 'pt-BR' 
                  ? 'Música de fundo'
                  : 'Background music' }
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
                  { locale == 'pt-BR'
                    ? 'Ligado | Desligado'
                    : 'On | Off' }
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
          <br />
          <div className={`${roboto_mono.className} ${styles.configSet}`}>
            <p
              lang={locale == 'pt-BR' ? 'pt' : 'en'}
              className={`${roboto_mono.className} ${styles.configText}`}>
                { locale == 'pt-BR' 
                  ? 'Efeitos sonoros'
                  : 'Sound effects' }
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
                  { locale == 'pt-BR'
                    ? 'Ligado | Desligado'
                    : 'On | Off' }
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
          <br />
          <div className={`${roboto_mono.className} ${styles.configSet}`}>
            <p
              lang={locale == 'pt-BR' ? 'pt' : 'en'}
              className={`${roboto_mono.className} ${styles.configText}`}>
                {locale == 'pt-BR'
                  ? 'Definir volume: '
                  : 'Set volume: ' }
                {String(Math.floor(localMusic.volume * 100)).padStart(2, '0')}%
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
        </article>
      </Dialog>
      <Dialog name='credits'>
        <article lang={locale == 'pt-BR' ? 'pt' : 'en'}>
          { localHistory?.wins &&
            <table className={`${styles.table} ${roboto_mono.className}`}>
              <caption>
                { locale == 'pt-BR'
                  ? 'Cinco Melhores Vitórias'
                  : 'Five Best Wins' }
              </caption>
              <thead>
                <tr className={styles.tr}>
                  <th>
                    { locale == 'pt-BR' ? 'Quando' : 'When' }
                  </th>
                  <th>
                    { locale == 'pt-BR' ? 'Queijos' : 'Cheeses' }
                  </th>
                  <th>
                    { locale == 'pt-BR' ? 'Passos' : 'Steps' }
                  </th>
                </tr>
              </thead>
              <tbody>
                {localHistory.wins.map((item: localWinProps, index) => (
                    <tr key={index} className={styles.tr}>
                      <td><DateDistance baseDate={JSON.parse(item.date)} /></td>
                      <td>{item.cheeses}</td>
                      <td>{item.steps}</td>
                    </tr>
                ))}          
              </tbody>
            </table> }
          <br/>
          { localHistory?.loses &&
            <table className={`${styles.table} ${roboto_mono.className}`}>
              <caption>
                { locale == 'pt-BR'
                  ? 'Cinco Melhores Derrotas'
                  : 'Five Best Loses' }
              </caption>
              <thead>
                <tr className={styles.tr}>
                  <th>
                    { locale == 'pt-BR' ? 'Quando' : 'When' }
                  </th>
                  <th>
                    { locale == 'pt-BR' ? 'Passos' : 'Steps' }
                  </th>
                </tr>
              </thead>
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
          <>
            <p className={`${roboto_mono.className} ${styles.paragraph}`}>
              { locale == 'pt-BR'
                ? 'Jogo inspirado '
                : 'Game inspired ' }
              <a className={styles.anchor} href="https://sigmageek.com/challenge/stone-automata-maze-challenge">
                { locale == 'pt-BR'
                  ? 'neste desafio do Sigma Geek.'
                  : 'by this Sigma Geek challenge.' }
              </a>
            </p>
            <br />
            <p className={`${roboto_mono.className} ${styles.paragraph}`}>
              { locale == 'pt-BR'
                ? 'Efeitos sonoros por '
                : 'Sound effects by ' }
              <a
                className={styles.anchor}
                href="https://www.kenney.nl" >
                Kenney (www.kenney.nl).
              </a>
            <br />
            </p>
            <p className={`${roboto_mono.className} ${styles.paragraph}`}>
              { locale == 'pt-BR'
                  ? 'Música de fundo por '
                  : 'Background music by ' }
              <a
                className={styles.anchor}
                href="https://www.soundimage.org" >
                Eric Matyas (www.soundimage.org).
              </a>
            </p>
            <br />
            <p className={`${roboto_mono.className} ${styles.paragraphLeftAligned}`}>
              { locale == 'pt-BR' 
                ? 'Não fazemos nenhum tipo de coleta de dados. Os resultados aqui exibidos estão sendo salvos no seu próprio navegador ou dispositivo móvel e você, sempre que desejar, poderá apagá-los permanentemente '
                : 'We do not perform data collection. The results displayed here are stored in your own browser or mobile device and you can, at any time, delete them permanently ' }
              <button
                title={ locale == 'pt-BR'
                  ? 'Botão para apagar histórico de vitórias/derrotas do navegador ou dispositivo móvel'
                  : 'Button to clear wins/loses history from browser or mobile device' }
                onClick={eraseLocalHistory}
                className={`${styles.eraseButton} ${roboto_mono.className}`} >
                { locale == 'pt-BR' 
                  ? 'clicando aqui.'
                  : 'by clicking here.' }
              </button>
            </p>
            <br/>
            <em className={`${roboto_mono.className} ${styles.author}`}>
              <span className={styles.paragraphRightAligned}>
                { locale == 'pt-BR' 
                  ? 'Desenvolvido com '
                  : 'Developed with ' }
              </span>
              <BsFillSuitHeartFill />
              { locale == 'pt-BR' 
                ? 'por '
                : 'by ' }
              <a
                className={styles.anchor}
                href="https://github.com/victorsgb">
                  Victor Baptista
              </a>
            </em>
          </>       
        </article>
      </Dialog>
      <ControlPad
        buttonValueSetter={setButtonClickValue}
        loading={loading}
      />
      { locale == 'en-US' && 
        <footer className={`${styles.footer} ${roboto_mono.className}`}>&copy; 2023 Victor Baptista - All rights reserved.</footer>      
      }
      { locale == 'pt-BR' && 
        <footer lang='pt' className={`${styles.footer} ${roboto_mono.className}`}>&copy; 2023 Victor Baptista - Todos os direitos reservados.</footer>          
      }
    </>
  )
}
