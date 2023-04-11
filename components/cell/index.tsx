// Core dependencies
import { useEffect } from 'react';

// Styling related import
import styles from './cell.module.css'
import { BsFillHouseSlashFill, BsHouseCheckFill } from 'react-icons/bs';
import { GiCat, GiCheeseWedge, GiSeatedMouse } from 'react-icons/gi';


interface CellProps {
  alive: boolean;
  hasCheese: boolean;
  hasPlayer: boolean;
  hasCat: boolean;
  hasHouse: boolean;
  playerGotACheese: boolean;
}

export default function Cell({
  alive, hasCheese, hasPlayer, hasCat, hasHouse, playerGotACheese
}: CellProps) {

  useEffect(() => {
    document.getElementById('board')?.focus();
  }, []);

  return (
    <div className={`${styles.cell} ${alive ? styles.alive : styles.dead}`}>
      { hasCat
        ? <GiCat className={styles.foe} />
        : hasPlayer
          ? <GiSeatedMouse className={styles.player} />
          : (hasHouse && !playerGotACheese) 
            ? <BsFillHouseSlashFill className={styles.homeClosed} />
            : (hasHouse && playerGotACheese)
              ? <BsHouseCheckFill className={styles.homeOpen} />
              : hasCheese
                ? <GiCheeseWedge className={styles.cheese} />
                : ''
      }
    </div>
  );
}