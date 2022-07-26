import { useEffect, useState } from 'react';
import styles from './styles.module.css';

export const CharActions = ({
  backgroundColor,
  action1,
  action2,
  action3,
  onAction,
  characterString
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
          className={styles.actionButton}
          onClick={() => actionHandler(action1)}
        >
          {action1.name}
        </button>
        <button
          className={styles.actionButton}
          onClick={() => actionHandler(action2)}
        >
          {action2.name}
        </button>
        <button
          className={styles.actionButton}
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

    useEffect(() => {
      if (action.target === 'enemy') {
        if (characterString === "char1team1" || characterString === "char2team1" || characterString === "char3team1") {
          setTarget1String('char1team2');
          setTarget2String('char2team2');
          setTarget3String('char3team2');
        } else {
          setTarget1String('char1team1');
          setTarget2String('char2team1');
          setTarget3String('char3team1');
        }
      } else if (action.target === 'friendly') {
        if (characterString === "char1team1" || characterString === "char2team1" || characterString === "char3team1") {
          setTarget1String('char1team1');
          setTarget2String('char2team1');
          setTarget3String('char3team1');
        } else {
          setTarget1String('char1team2');
          setTarget2String('char2team2');
          setTarget3String('char3team2');
        }
      }
    }, [action]);

    return (
      <div
        className={styles.main}
        style={{ backgroundColor: backgroundColor }}
      >
        <button
          className={styles.actionButton}
          onClick={() => {
            onAction(actionState, characterString, target1String);
            setActionState('finished');
          }}
        >
          Target 1
        </button>
        <button
          className={styles.actionButton}
          onClick={() => {
            onAction(actionState, characterString, target2String);
            setActionState('finished');
          }}
        >
          Target 2
        </button>
        <button
          className={styles.actionButton}
          onClick={() => {
            onAction(actionState, characterString, target3String);
            setActionState('finished');
          }}
        >
          Target 3
        </button>
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

  return actionState === 'finished'
    ? null
    : actionState === null
      ? <ActionTabs />
      : <ActionTargetting action={actionState} />
    ;
};
