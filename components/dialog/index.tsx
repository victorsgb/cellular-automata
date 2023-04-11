// Styling related imports
import styles from './dialog.module.css';
import { X } from '@phosphor-icons/react';


interface DialogProps {
  name: string;
  children: React.ReactElement
}

export default function Dialog({ name, children }: DialogProps) {

  function handleCloseClick() {
    const dialog = document.querySelector(`dialog#${name}`) as HTMLDialogElement;
    dialog?.close();
  };

  return (
    <dialog id={name} className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <a href="#" onClick={handleCloseClick}>
            <X className={styles.icon} />
          </a>
        </div>
        <div className={styles.body}>{children}</div>
      </div>
    </dialog>
  );
}