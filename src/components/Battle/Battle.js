import { useEffect, useState } from 'react';
import { CharacterSummary } from 'components';
import { mageFrost, paladinRetri } from 'shared';
import styles from './styles.module.css';
import { useBattleSequence } from 'hooks/useBattleSequence';

export const Battle = () => {
  const [char1team1, setChar1team1] = useState(paladinRetri);
  const [char2team1, setChar2team1] = useState(paladinRetri);
  const [char3team1, setChar3team1] = useState(mageFrost);
  const [char1team2, setChar1team2] = useState(mageFrost);
  const [char2team2, setChar2team2] = useState(mageFrost);
  const [char3team2, setChar3team2] = useState(paladinRetri);

  const [sequence, setSequence] = useState({});

  const { turn, inSequence, char1team1state, char2team1state, char3team1state, char1team2state, char2team2state, char3team2state } = useBattleSequence(sequence, { char1team1, char2team1, char3team1, char1team2, char2team2, char3team2 });

  const onAction = (action, attackerString, receiverString) => {
    setSequence({ action, attackerString, receiverString });
  };

  useEffect(() => { }, []);

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
        />
        <CharacterSummary
          character={char2team1state.char}
          characterString={'char2team1'}
          hp={char2team1state.hp}
          mp={char2team1state.mp}
          turn={turn}
          charTurn={3}
          onAction={onAction}
        />
        <CharacterSummary
          character={char3team1state.char}
          characterString={'char3team1'}
          hp={char3team1state.hp}
          mp={char3team1state.mp}
          turn={turn}
          charTurn={5}
          onAction={onAction}
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
        />
      </div>
    </>
  );
};
