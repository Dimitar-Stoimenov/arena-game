import { useEffect, useState } from 'react';
import { CharacterSummary } from 'components';
import { useBattleSequence } from 'hooks';
import { mageFrost, paladinRetri, priestHoly } from 'shared';
import styles from './styles.module.css';

export const Battle = ({ onGameEnd }) => {
  const [char1team1, setChar1team1] = useState(paladinRetri);
  const [char2team1, setChar2team1] = useState(priestHoly);
  const [char3team1, setChar3team1] = useState(mageFrost);
  const [char1team2, setChar1team2] = useState(mageFrost);
  const [char2team2, setChar2team2] = useState(mageFrost);
  const [char3team2, setChar3team2] = useState(paladinRetri);

  const [sequence, setSequence] = useState({});

  const {
    turn,
    // inSequence,
    char1team1state,
    char2team1state,
    char3team1state,
    char1team2state,
    char2team2state,
    char3team2state,
  } = useBattleSequence(sequence, {
    char1team1,
    char2team1,
    char3team1,
    char1team2,
    char2team2,
    char3team2,
  });

  const onAction = (action, attackerString, receivers) => {
    setSequence({
      action,
      attackerString,
      receivers,
    });
  };

  useEffect(() => {
    if (turn === 1 && char1team1state.dead) {
      onAction({ type: 'dead' });
    }
    if (turn === 2 && char1team2state.dead) {
      onAction({ type: 'dead' });
    }
    if (turn === 3 && char2team1state.dead) {
      onAction({ type: 'dead' });
    }
    if (turn === 4 && char2team2state.dead) {
      onAction({ type: 'dead' });
    }
    if (turn === 5 && char3team1state.dead) {
      onAction({ type: 'dead' });
    }
    if (turn === 6 && char3team2state.dead) {
      onAction({ type: 'dead' });
    }
    if (char1team1state.dead && char2team1state.dead && char3team1state.dead) {
      onGameEnd('team2');
    }
    if (char1team2state.dead && char2team2state.dead && char3team2state.dead) {
      onGameEnd('team1');
    }
  }, [
    turn,
    char1team1state.dead,
    char1team2state.dead,
    char2team1state.dead,
    char2team2state.dead,
    char3team1state.dead,
    char3team2state.dead,
    onGameEnd
  ]);

  return (
    <>
      <div className={styles.gameHeader}>TEAM 1 VS TEAM 2</div>
      <div className={styles.team1}>
        <CharacterSummary
          character={char1team1state.char}
          characterString={'char1team1'}
          hp={char1team1state.hp}
          mp={char1team1state.mp}
          turn={turn}
          charTurn={1}
          onAction={onAction}
          dead={char1team1state.dead}
        />
        <CharacterSummary
          character={char2team1state.char}
          characterString={'char2team1'}
          hp={char2team1state.hp}
          mp={char2team1state.mp}
          turn={turn}
          charTurn={3}
          onAction={onAction}
          dead={char2team1state.dead}
        />
        <CharacterSummary
          character={char3team1state.char}
          characterString={'char3team1'}
          hp={char3team1state.hp}
          mp={char3team1state.mp}
          turn={turn}
          charTurn={5}
          onAction={onAction}
          dead={char3team1state.dead}
        />
      </div>
      <div className={styles.team2}>
        <CharacterSummary
          team2
          character={char1team2state.char}
          characterString={'char1team2'}
          hp={char1team2state.hp}
          mp={char1team2state.mp}
          turn={turn}
          charTurn={2}
          onAction={onAction}
          dead={char1team2state.dead}
        />
        <CharacterSummary
          team2
          character={char2team2state.char}
          characterString={'char2team2'}
          hp={char2team2state.hp}
          mp={char2team2state.mp}
          turn={turn}
          charTurn={4}
          onAction={onAction}
          dead={char2team2state.dead}
        />
        <CharacterSummary
          team2
          character={char3team2state.char}
          characterString={'char3team2'}
          hp={char3team2state.hp}
          mp={char3team2state.mp}
          turn={turn}
          charTurn={6}
          onAction={onAction}
          dead={char3team2state.dead}
        />
      </div>
    </>
  );
};
