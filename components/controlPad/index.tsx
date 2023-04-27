// Core dependencies
import { Dispatch, SetStateAction } from 'react';
import { useRouter } from 'next/router';


// Styling related imports
import styles from './controlPad.module.css';
import { IoMdArrowDropup, IoMdArrowDropdown, IoMdArrowDropleft, IoMdArrowDropright } from 'react-icons/io';

// Type imports
import { buttonValues } from '../../pages';


interface ControlPadProps {
  buttonValueSetter: Dispatch<SetStateAction<buttonValues>>;
  loading: boolean;
}

export default function ControlPad({buttonValueSetter, loading}: ControlPadProps) {

  const { locale } = useRouter();

  function setButtonValue(value: buttonValues) {
    buttonValueSetter(value);
  }

  return (
    <div className={styles.container}>
      <div className={styles.row}>
        <button
          disabled={loading}
          className={`${styles.button} ${styles.up}`}
          onClick={() => setButtonValue('U')}
        >
          <IoMdArrowDropup
            className={styles.icon}
            title={locale == 'pt-BR' ? 'Botão para mover seu avatar para cima' : 'Button to move your avatar up'}
          />
        </button>
      </div>
      <div className={styles.row}>
        <button
          disabled={loading}
          className={`${styles.button} ${styles.left}`}
          onClick={() => setButtonValue('L')}
        >
          <IoMdArrowDropleft
            className={styles.icon}
            title={locale == 'pt-BR' ? 'Botão para mover seu avatar para a esquerda' : 'Button to move your avatar to the left'}
          />
        </button>
        <div className={styles.void}></div>
        <button
          disabled={loading}
          className={`${styles.button} ${styles.right}`}
          onClick={() => setButtonValue('R')}
        >
          <IoMdArrowDropright
            className={styles.icon}
            title={locale == 'pt-BR' ? 'Botão para mover seu avatar para a direita' : 'Button to move your avatar to the right'}
          />
        </button>
      </div>
      <div className={styles.row}>
        <button
          disabled={loading}
          className={`${styles.button} ${styles.down}`}
          onClick={() => setButtonValue('D')}
        >
          <IoMdArrowDropdown
            className={styles.icon}
            title={locale == 'pt-BR' ? 'Botão para mover seu avatar para baixo' : 'Button to move your avatar down'}
          />
        </button>      
      </div>
    </div>
  );
}