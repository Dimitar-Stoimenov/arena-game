import styles from './styles.module.css';

export const StartMenu = props => {
  return (
    <div className={styles.main}>
      <button className={styles.startButton} onClick={props.onStartClick}>
        Start Game
      </button>
    </div>
  );
};
