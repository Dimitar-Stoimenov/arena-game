import { useEffect, useState } from 'react';
import { CharacterSummary } from 'components';
import { useBattleSequence } from 'hooks';
import { mageFrost, paladinRetri, priestHoly, wait } from 'shared';
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

  //useEffect to skip turn if a character is dead and to end game if entire team is dead
  //useEffect to reduce cooldowns on turn start
  useEffect(() => {
    if (turn === 1) {
      if (char1team1state.dead) {
        onAction(null, 'dead');
      } else {
        onAction({ type: 'reduceCooldowns' }, 'char1team1');
      }
    }
    if (turn === 2) {
      if (char1team2state.dead) {
        onAction(null, 'dead');
      } else {
        onAction({ type: 'reduceCooldowns' }, 'char1team2');
      }
    }
    if (turn === 3) {
      if (char2team1state.dead) {
        onAction(null, 'dead');
      } else {
        onAction({ type: 'reduceCooldowns' }, 'char2team1');
      }
    }
    if (turn === 4) {
      if (char2team2state.dead) {
        onAction(null, 'dead');
      } else {
        onAction({ type: 'reduceCooldowns' }, 'char2team2');
      }
    }
    if (turn === 5) {
      if (char3team1state.dead) {
        onAction(null, 'dead');
      } else {
        onAction({ type: 'reduceCooldowns' }, 'char3team1');
      }
    }
    if (turn === 6) {
      if (char3team2state.dead) {
        onAction(null, 'dead');
      } else {
        onAction({ type: 'reduceCooldowns' }, 'char3team2');
      }
    }

    if (
      char1team1state.dead &&
      char2team1state.dead &&
      char3team1state.dead
    ) {
      (async () => {
        await wait(1000);
        onGameEnd('Тeam 2');
      })();
    }
    if (
      char1team2state.dead &&
      char2team2state.dead &&
      char3team2state.dead
    ) {
      (async () => {
        await wait(1000);
        onGameEnd('Тeam 1');
      })();
    }
  }, [
    turn,
    char1team1state.dead,
    char1team2state.dead,
    char2team1state.dead,
    char2team2state.dead,
    char3team1state.dead,
    char3team2state.dead,
    onGameEnd,
  ]);

  //TODO: add useEffect to skip turn if character is stunned, and to reduce stun effect duration

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
          effects={char1team1state.effects}
          cooldowns={char1team1state.cooldowns}
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
          effects={char2team1state.effects}
          cooldowns={char2team1state.cooldowns}
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
          effects={char3team1state.effects}
          cooldowns={char3team1state.cooldowns}
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
          effects={char1team2state.effects}
          cooldowns={char1team2state.cooldowns}
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
          effects={char2team2state.effects}
          cooldowns={char2team2state.cooldowns}
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
          effects={char3team2state.effects}
          cooldowns={char3team2state.cooldowns}
        />
      </div>
    </>
  );
};
