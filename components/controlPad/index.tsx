// Core dependencies
import { Dispatch, SetStateAction } from 'react';
import { useRouter } from 'next/router';


// Styling related imports
import styles from './controlPad.module.css';
import { IoMdArrowDropup, IoMdArrowDropdown, IoMdArrowDropleft, IoMdArrowDropright } from 'react-icons/io';

// Type imports
import { buttonValues } from '../../pages';


interface ControlPadProps {
  buttonValueSetter: Dispatch<SetStateAction<buttonValues>>
}

export default function ControlPad({buttonValueSetter}: ControlPadProps) {

  const { locale } = useRouter();

  function setButtonValue(value: buttonValues) {
    buttonValueSetter(value);
  }

  return (
    <>
      { locale === 'pt-BR' && 
        <div className={styles.container}>
          <div className={styles.row}>
            <button
              className={`${styles.button} ${styles.up}`}
              onClick={() => setButtonValue('U')}
            >
              <IoMdArrowDropup
                className={styles.icon}
                title='Botão para mover seu avatar para a cima'
              />
            </button>
          </div>
          <div className={styles.row}>
            <button
              className={`${styles.button} ${styles.left}`}
              onClick={() => setButtonValue('L')}
            >
              <IoMdArrowDropleft
                className={styles.icon}
                title='Botão para mover seu avatar para a esquerda'
              />
            </button>
            <div className={styles.void}></div>
            <button
              className={`${styles.button} ${styles.right}`}
              onClick={() => setButtonValue('R')}
            >
              <IoMdArrowDropright
                className={styles.icon}
                title='Botão para mover seu avatar para a direita'
              />
            </button>
          </div>
          <div className={styles.row}>
            <button
              className={`${styles.button} ${styles.down}`}
              onClick={() => setButtonValue('D')}
            >
              <IoMdArrowDropdown
                className={styles.icon}
                title='Botão para mover seu avatar para baixo'
              />
            </button>      
          </div>
        </div>
      }
      { locale == 'en-US' && 
        <div className={styles.container}>
          <div className={styles.row}>
            <button
              className={`${styles.button} ${styles.up}`}
              onClick={() => setButtonValue('U')}
            >
              <IoMdArrowDropup
                className={styles.icon}
                title='Button to move your avatar up'
              />
            </button>
          </div>
          <div className={styles.row}>
            <button
              className={`${styles.button} ${styles.left}`}
              onClick={() => setButtonValue('L')}
            >
              <IoMdArrowDropleft
                className={styles.icon}
                title='Button to move your avatar to the left'
              />
            </button>
            <div className={styles.void}></div>
            <button
              className={`${styles.button} ${styles.right}`}
              onClick={() => setButtonValue('R')}
            >
              <IoMdArrowDropright
                className={styles.icon}
                title='Button to move your avatar to the right'
              />
            </button>
          </div>
          <div className={styles.row}>
            <button
              className={`${styles.button} ${styles.down}`}
              onClick={() => setButtonValue('D')}
            >
              <IoMdArrowDropdown
                className={styles.icon}
                title='Button to move your avatar down'
              />
            </button>      
          </div>
        </div>
      }
    </>
  );
}