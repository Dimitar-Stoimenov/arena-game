import { CharCard } from 'components/CharPicker/CharCard';

import styles from './styles.module.css';

export const EndMenu = ({
  winner,
  onStartClick,
  char1team1,
  char2team1,
  char3team1,
  char1team2,
  char2team2,
  char3team2
}) => {
  const team1chars = [char1team1, char2team1, char3team1];
  const team2chars = [char1team2, char2team2, char3team2];

  const team1picksJSX = team1chars.map((char) => {
    return <CharCard key={char.id} className={styles.card} img={char.img} specImg={char.specImg} charClass={char.charClass} spec={char.spec} onClick={() => null} disabled={winner === "Team 2"} />;
  });

  const team2picksJSX = team2chars.map((char) => {
    return <CharCard key={char.id} className={styles.card} img={char.img} specImg={char.specImg} charClass={char.charClass} spec={char.spec} onClick={() => null} disabled={winner === "Team 1"} />;
  });

  return (
    <div className={styles.main}>
      <div className={styles.teamsContainer}>
        <div className={styles.singleTeamContainer}>
          <div className={styles.pickedCharacters}>
            {team1picksJSX}
          </div>
        </div>
        <div className={styles.singleTeamContainer}>
          <div className={styles.pickedCharacters}>
            {team2picksJSX}
          </div>
        </div>
      </div>
      <h1>{winner} has won!</h1>
      <button className={styles.startButton} onClick={onStartClick}>
        Play Again
      </button>
    </div>
  );
};
