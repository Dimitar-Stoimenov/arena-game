import { useCallback, useEffect, useMemo, useState } from 'react';
import { CharacterSummary } from 'components';
import { useBattleSequence } from 'hooks';
import {
  characters,
  wait,
} from 'shared';
import styles from './styles.module.css';

export const Battle = ({ onGameEnd }) => {
  const [char1team1, setChar1team1] = useState(characters.hunterMarks);
  const [char2team1, setChar2team1] = useState(characters.paladinRetri);
  const [char3team1, setChar3team1] = useState(characters.mageFrost);
  const [char1team2, setChar1team2] = useState(characters.hunterBeast);
  const [char2team2, setChar2team2] = useState(characters.mageFrost);
  const [char3team2, setChar3team2] = useState(characters.priestDisc);

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

  const onAction = useCallback((action, attackerString, receivers) => {
    setSequence({
      action,
      attackerString,
      receivers,
    });
  }, []);

  const characterNamesObject = useMemo(() => ({
    char1team1: `${char1team1.spec} ${char1team1.charClass}`,
    char2team1: `${char2team1.spec} ${char2team1.charClass}`,
    char3team1: `${char3team1.spec} ${char3team1.charClass}`,
    char1team2: `${char1team2.spec} ${char1team2.charClass}`,
    char2team2: `${char2team2.spec} ${char2team2.charClass}`,
    char3team2: `${char3team2.spec} ${char3team2.charClass}`,
  }),
    [
      char1team1.spec, char1team1.charClass,
      char2team1.spec, char2team1.charClass,
      char3team1.spec, char3team1.charClass,
      char1team2.spec, char1team2.charClass,
      char2team2.spec, char2team2.charClass,
      char3team2.spec, char3team2.charClass,
    ]);

  //useEffect triggers start of turn sequence
  //useEffect to skip turn if a character is dead
  //useEffect to skip turn if a character is stunned/ccd
  //useEffect to end game when all characters on a team are dead
  useEffect(() => {
    const charStrings = {
      1: 'char1team1',
      2: 'char1team2',
      3: 'char2team1',
      4: 'char2team2',
      5: 'char3team1',
      6: 'char3team2',
    };

    const turnChangeSequence = (turn, state) => {
      if (state.dead) {
        return onAction(null, 'dead');
      } else if (state.effects.some(e => e.effect === 'stun')) {
        return onAction(null, 'stun', charStrings[turn]);
      } else if (state.effects.some(e => e.effect === 'cc')) {
        // checks if target has a DOT or Viper Sting. If it does, breaks CC.
        if (checkTargetForDots(state)) {
          return onAction({ type: 'turnStartSequence' }, charStrings[turn], 'ccBreak');
        } else {
          return onAction(null, 'cc', charStrings[turn]);
        }
      }

      return onAction({ type: 'turnStartSequence' }, charStrings[turn]);
    };

    const checkTargetForDots = (state) => { //also checks for Viper Sting
      if (state.effects.some(e => e.effect === 'viperSting')) {
        return true;
      } else if (state.effects.some(e => e.damageOverTime)) {
        return true;
      } else {
        return false;
      }
    };

    if (turn === 1) {
      return turnChangeSequence(turn, char1team1state);
    }

    if (turn === 2) {
      return turnChangeSequence(turn, char1team2state);
    }

    if (turn === 3) {
      return turnChangeSequence(turn, char2team1state);
    }

    if (turn === 4) {
      return turnChangeSequence(turn, char2team2state);
    }

    if (turn === 5) {
      return turnChangeSequence(turn, char3team1state);
    }

    if (turn === 6) {
      return turnChangeSequence(turn, char3team2state);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    turn,
    char1team1state.dead,
    char1team2state.dead,
    char2team1state.dead,
    char2team2state.dead,
    char3team1state.dead,
    char3team2state.dead,
    onGameEnd,
    onAction
  ]);

  return (
    <>
      <div className={styles.gameHeader}>TEAM 1 VS TEAM 2</div>
      <div className={styles.team1}>
        {char1team1state.dead || char2team1state.dead || char3team1state.dead
          ? <button className={styles.surrenderButton} onClick={() => onGameEnd('Тeam 2')}>Surrender</button>
          : ''}
        <CharacterSummary
          character={char1team1state.char}
          characterString={'char1team1'}
          hp={char1team1state.hp}
          mp={char1team1state.mp}
          shield={char1team1state.shield}
          turn={turn}
          charTurn={1}
          onAction={onAction}
          dead={char1team1state.dead}
          effects={char1team1state.effects}
          cooldowns={char1team1state.cooldowns}
          characterNamesObject={characterNamesObject}
          petTarget={char1team1state.petTarget}
        />
        <CharacterSummary
          character={char2team1state.char}
          characterString={'char2team1'}
          hp={char2team1state.hp}
          mp={char2team1state.mp}
          shield={char2team1state.shield}
          turn={turn}
          charTurn={3}
          onAction={onAction}
          dead={char2team1state.dead}
          effects={char2team1state.effects}
          cooldowns={char2team1state.cooldowns}
          characterNamesObject={characterNamesObject}
          petTarget={char2team1state.petTarget}
        />
        <CharacterSummary
          character={char3team1state.char}
          characterString={'char3team1'}
          hp={char3team1state.hp}
          mp={char3team1state.mp}
          shield={char3team1state.shield}
          turn={turn}
          charTurn={5}
          onAction={onAction}
          dead={char3team1state.dead}
          effects={char3team1state.effects}
          cooldowns={char3team1state.cooldowns}
          characterNamesObject={characterNamesObject}
          petTarget={char3team1state.petTarget}
        />
      </div>
      <div className={styles.team2}>
        {char1team2state.dead || char2team2state.dead || char3team2state.dead
          ? <button className={styles.surrenderButton} onClick={() => onGameEnd('Тeam 1')}>Surrender</button>
          : ''}
        <CharacterSummary
          team2
          character={char1team2state.char}
          characterString={'char1team2'}
          hp={char1team2state.hp}
          mp={char1team2state.mp}
          shield={char1team2state.shield}
          turn={turn}
          charTurn={2}
          onAction={onAction}
          dead={char1team2state.dead}
          effects={char1team2state.effects}
          cooldowns={char1team2state.cooldowns}
          characterNamesObject={characterNamesObject}
          petTarget={char1team2state.petTarget}
        />
        <CharacterSummary
          team2
          character={char2team2state.char}
          characterString={'char2team2'}
          hp={char2team2state.hp}
          mp={char2team2state.mp}
          shield={char2team2state.shield}
          turn={turn}
          charTurn={4}
          onAction={onAction}
          dead={char2team2state.dead}
          effects={char2team2state.effects}
          cooldowns={char2team2state.cooldowns}
          characterNamesObject={characterNamesObject}
          petTarget={char2team2state.petTarget}
        />
        <CharacterSummary
          team2
          character={char3team2state.char}
          characterString={'char3team2'}
          hp={char3team2state.hp}
          mp={char3team2state.mp}
          shield={char3team2state.shield}
          turn={turn}
          charTurn={6}
          onAction={onAction}
          dead={char3team2state.dead}
          effects={char3team2state.effects}
          cooldowns={char3team2state.cooldowns}
          characterNamesObject={characterNamesObject}
          petTarget={char3team2state.petTarget}
        />
      </div>
    </>
  );
};
