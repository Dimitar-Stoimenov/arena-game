import { useEffect, useState } from 'react';
import styles from './styles.module.css';

export const CharActions = ({
  backgroundColor,
  action1,
  action2,
  action3,
  action4,
  sendPet,
  onAction,
  characterString,
  hp,
  mp,
  cooldowns,
  characterNamesObject,
  effects,
  petTarget,
  charClass,
  resource
}) => {
  const [actionState, setActionState] = useState(null);
  const red = "#ba2e25";
  const blue = "#1953cb";

  const actionHandler = action => {
    setActionState(() => action);
  };

  const ActionTabs = () => {
    return (
      <div
        className={styles.main}
        style={{ backgroundColor: backgroundColor }}
      >
        {sendPet &&
          <button
            className={styles.actionButton}
            onClick={() => actionHandler(sendPet)}
          >
            {sendPet.name}
          </button>}
        <button
          className={
            (action1.manaCost > mp || cooldowns.action1 !== 0) || (action1.type === 'petAction' && !petTarget)
              ? styles.disabled
              : styles.actionButton
          }
          onClick={() => actionHandler(action1)}
        >
          {action1.name}
        </button>
        <button
          className={
            (action2.manaCost > mp || cooldowns.action2 !== 0) || (action2.type === 'petAction' && !petTarget)
              ? styles.disabled
              : styles.actionButton
          }
          onClick={() => actionHandler(action2)}
        >
          {action2.name}
        </button>
        <button
          className={
            (action3.manaCost > mp || cooldowns.action3 !== 0) || (action3.type === 'petAction' && !petTarget)
              ? styles.disabled
              : styles.actionButton
          }
          onClick={() => actionHandler(action3)}
        >
          {action3.name}
        </button>
        <button
          className={
            (action4.manaCost > mp || cooldowns.action4 !== 0) || (action4.type === 'petAction' && !petTarget)
              ? styles.disabled
              : styles.actionButton
          }
          onClick={() => actionHandler(action4)}
        >
          {action4.name}
        </button>
        {resource === "mana"
          ? <button
            className={styles.actionButton}
            onClick={() =>
              actionHandler({
                target: 'confirm',
                affectedCharacters: 1,
                type: 'skip',
                name: 'Skip Turn',
              })
            }
          >
            Skip Turn
          </button>
          : null
        }
      </div>
    );
  };

  const ActionTargetting = ({ action }) => {
    const [target1String, setTarget1String] = useState('');
    const [target2String, setTarget2String] = useState('');
    const [target3String, setTarget3String] = useState('');
    const [target4String, setTarget4String] = useState('');
    const [target5String, setTarget5String] = useState('');
    const [target6String, setTarget6String] = useState('');

    useEffect(() => {
      if (action.target === 'enemy' || action.target === 'allEnemies') {
        if (
          characterString === 'char1team1' ||
          characterString === 'char2team1' ||
          characterString === 'char3team1'
        ) {
          setTarget1String('char1team2');
          setTarget2String('char2team2');
          setTarget3String('char3team2');
        } else {
          setTarget1String('char1team1');
          setTarget2String('char2team1');
          setTarget3String('char3team1');
        }
      } else if (action.target === 'friendly') {
        if (
          characterString === 'char1team1' ||
          characterString === 'char2team1' ||
          characterString === 'char3team1'
        ) {
          setTarget1String('char1team1');
          setTarget2String('char2team1');
          setTarget3String('char3team1');
        } else {
          setTarget1String('char1team2');
          setTarget2String('char2team2');
          setTarget3String('char3team2');
        }
      } else if (
        action.target === 'all' ||
        action.target === 'pseudoSelf'
      ) {
        if (
          characterString === 'char1team1' ||
          characterString === 'char2team1' ||
          characterString === 'char3team1'
        ) {
          setTarget1String('char1team1');
          setTarget2String('char2team1');
          setTarget3String('char3team1');
          setTarget4String('char1team2');
          setTarget5String('char2team2');
          setTarget6String('char3team2');
        } else {
          setTarget1String('char1team2');
          setTarget2String('char2team2');
          setTarget3String('char3team2');
          setTarget4String('char1team1');
          setTarget5String('char2team1');
          setTarget6String('char3team1');
        }
      } else if (action.target === 'self' || action.target === 'confirm') {
        setTarget1String(characterString);
      }
    }, [action]);

    const onActionHandler = (
      target1String,
      target2String,
      target3String,
      target4String,
      target5String,
      target6String,
    ) => {
      if (actionState.affectedCharacters === 1) {
        if (actionState.type === 'petAction') {
          target1String = petTarget;
        }

        onAction(actionState, characterString, target1String);
        setActionState('finished');
      } else if (actionState.affectedCharacters === 3) {
        onAction(actionState, characterString, [
          target1String,
          target2String,
          target3String,
        ]);
        setActionState('finished');
      } else if (actionState.affectedCharacters === 6) {
        onAction(actionState, characterString, [
          target1String,
          target2String,
          target3String,
          target4String,
          target5String,
          target6String,
        ]);
        setActionState('finished');
      }
    };

    return (
      <div
        className={styles.main}
        style={{ backgroundColor: backgroundColor }}
      >
        <button
          className={styles.actionButton}
          onClick={() => {
            if (actionState.affectedCharacters === 1) {
              onActionHandler(target1String);
            } else if (actionState.affectedCharacters === 3) {
              onActionHandler(target1String, target2String, target3String);
            } else if (actionState.affectedCharacters === 6) {
              onActionHandler(
                target1String,
                target2String,
                target3String,
                target4String,
                target5String,
                target6String,
              );
            }
          }}
        >
          {action.target === 'self'
            ? 'Self'
            : action.target === 'pseudoSelf' || action.target === 'confirm' || action.target === 'allEnemies'
              ? `Confirm ${action.name}`
              : action.target === 'enemy'
                ? `${characterNamesObject[target1String]}`
                : `${characterNamesObject[target1String]}`}
        </button>
        {action.target !== 'self' &&
          action.target !== 'pseudoSelf' &&
          action.target !== 'confirm' &&
          action.target !== 'allEnemies' ? (
          <>
            <button
              className={styles.actionButton}
              onClick={() => {
                if (actionState.affectedCharacters === 1) {
                  onActionHandler(target2String);
                } else if (actionState.affectedCharacters === 3) {
                  onActionHandler(
                    target2String,
                    target1String,
                    target3String,
                  );
                } else if (actionState.affectedCharacters === 6) {
                  onActionHandler(
                    target2String,
                    target1String,
                    target3String,
                    target4String,
                    target5String,
                    target6String,
                  );
                }
              }}
            >
              {action.target === 'enemy'
                ? `${characterNamesObject[target2String]}`
                : `${characterNamesObject[target2String]}`}
            </button>
            <button
              className={styles.actionButton}
              onClick={() => {
                if (actionState.affectedCharacters === 1) {
                  onActionHandler(target3String);
                } else if (actionState.affectedCharacters === 3) {
                  onActionHandler(
                    target3String,
                    target1String,
                    target2String,
                  );
                } else if (actionState.affectedCharacters === 6) {
                  onActionHandler(
                    target3String,
                    target1String,
                    target2String,
                    target4String,
                    target5String,
                    target6String,
                  );
                }
              }}
            >
              {action.target === 'enemy'
                ? `${characterNamesObject[target3String]}`
                : `${characterNamesObject[target3String]}`}
            </button>
          </>
        ) : (
          ''
        )}
        {action.target === 'all' ? (
          <>
            <button
              className={styles.actionButton}
              style={{ backgroundColor: backgroundColor === red ? blue : red }}
              onClick={() => {
                if (actionState.affectedCharacters === 1) {
                  onActionHandler(target4String);
                } else if (actionState.affectedCharacters === 3) {
                  onActionHandler(
                    target4String,
                    target5String,
                    target6String,
                  );
                } else if (actionState.affectedCharacters === 6) {
                  onActionHandler(
                    target4String,
                    target5String,
                    target6String,
                    target1String,
                    target2String,
                    target3String,
                  );
                }
              }}
            >
              {characterNamesObject[target4String]}
            </button>
            <button
              className={styles.actionButton}
              style={{ backgroundColor: backgroundColor === red ? blue : red }}
              onClick={() => {
                if (actionState.affectedCharacters === 1) {
                  onActionHandler(target5String);
                } else if (actionState.affectedCharacters === 3) {
                  onActionHandler(
                    target5String,
                    target4String,
                    target6String,
                  );
                } else if (actionState.affectedCharacters === 6) {
                  onActionHandler(
                    target5String,
                    target4String,
                    target6String,
                    target1String,
                    target2String,
                    target3String,
                  );
                }
              }}
            >
              {characterNamesObject[target5String]}
            </button>
            <button
              className={styles.actionButton}
              style={{ backgroundColor: backgroundColor === red ? blue : red }}
              onClick={() => {
                if (actionState.affectedCharacters === 1) {
                  onActionHandler(target6String);
                } else if (actionState.affectedCharacters === 3) {
                  onActionHandler(
                    target6String,
                    target4String,
                    target5String,
                  );
                } else if (actionState.affectedCharacters === 6) {
                  onActionHandler(
                    target6String,
                    target4String,
                    target5String,
                    target1String,
                    target2String,
                    target3String,
                  );
                }
              }}
            >
              {characterNamesObject[target6String]}
            </button>
          </>
        ) : (
          ''
        )}
        <button
          className={styles.actionButton}
          onClick={() => {
            actionHandler(null);
          }}
        >
          Cancel
        </button>
      </div>
    );
  };

  return actionState === 'finished' ? null : actionState === null ? (
    <ActionTabs />
  ) : (
    <ActionTargetting action={actionState} />
  );
};
