// Styling related imports
import styles from './livesBar.module.css';
import { BsSuitHeart, BsSuitHeartFill } from 'react-icons/bs';


interface LivesBarProps {
  lives: number
}


export default function LivesBar({lives}: LivesBarProps) {
  return (
    <div className={styles.container}>
      {lives >= 1 ? <BsSuitHeartFill/> : <BsSuitHeart/>}
      {lives >= 2 ? <BsSuitHeartFill/> : <BsSuitHeart/>}
      {lives >= 3 ? <BsSuitHeartFill/> : <BsSuitHeart/>}
    </div>
  );
}