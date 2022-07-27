import { useEffect, useState } from 'react';
import styles from './styles.module.css';

export const CharActions = ({
  backgroundColor,
  action1,
  action2,
  action3,
  onAction,
  characterString,
  hp,
  mp
}) => {
  const [actionState, setActionState] = useState(null);

  const actionHandler = action => {
    setActionState(() => action);
  };

  const ActionTabs = () => {
    return (
      <div
        className={styles.main}
        style={{ backgroundColor: backgroundColor }}
      >
        <button
          className={action1.manaCost <= mp ? styles.actionButton : styles.disabled}
          onClick={() => actionHandler(action1)}
        >
          {action1.name}
        </button>
        <button
          className={action2.manaCost <= mp ? styles.actionButton : styles.disabled}
          onClick={() => actionHandler(action2)}
        >
          {action2.name}
        </button>
        <button
          className={action3.manaCost <= mp ? styles.actionButton : styles.disabled}
          onClick={() => actionHandler(action3)}
        >
          {action3.name}
        </button>
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
      if (action.target === 'enemy') {
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
      } else if (action.target === 'self') {
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
            ? 'Target Self'
            : action.target === 'pseudoSelf'
              ? `Confirm ${action.name}`
              : action.target === 'enemy'
                ? 'Target Enemy 1'
                : 'Target Friend 1'}
        </button>
        {action.target !== 'self' && action.target !== 'pseudoSelf' ? (
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
                ? 'Target Enemy 2'
                : 'Target Friend 2'}
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
                ? 'Target Enemy 3'
                : 'Target Friend 3'}
            </button>
          </>
        ) : (
          ''
        )}
        {action.target === 'all' ? (
          <>
            <button
              className={styles.actionButton}
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
              Target Enemy 1
            </button>
            <button
              className={styles.actionButton}
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
              Target Enemy 2
            </button>
            <button
              className={styles.actionButton}
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
              Target Enemy 3
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
