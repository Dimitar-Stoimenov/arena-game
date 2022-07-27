import { Bar } from 'components';
import styles from './styles.module.css';
import { CharActions } from 'components';

const red = '#ba2e25';
const blue = '#1953cb';

export const CharacterSummary = ({
  team2 = false,
  character,
  characterString,
  hp,
  mp,
  effects,
  turn,
  charTurn,
  onAction,
  dead,
}) => {
  const {
    charClass,
    spec,
    img,
    maxHealth,
    maxMana,
    action1,
    action2,
    action3,
  } = character;

  return (
    <div className={!dead ? styles.wrapper : styles.disabled}>
      <div
        style={{ backgroundColor: team2 ? red : blue }}
        className={styles.effects}
      ></div>
      <div
        style={{ backgroundColor: team2 ? red : blue }}
        className={styles.main}
      >
        <div className={styles.imgWrapper}>
          <img className={styles.img} src={img} alt={charClass} />
        </div>
        <div className={styles.charParameters}>
          <div className={styles.info}>
            <div className={styles.spec}>{spec}</div>
            <div className={styles.charClass}>{charClass}</div>
          </div>

          <Bar label="HP" value={hp} maxValue={maxHealth} color={red} />
          <Bar label="MP" value={mp} maxValue={maxMana} color={blue} />
        </div>
      </div>
      <div className={styles.actions}>
        {charTurn === turn && !dead && (
          <CharActions
            backgroundColor={team2 ? red : blue}
            action1={action1}
            action2={action2}
            action3={action3}
            onAction={onAction}
            characterString={characterString}
            hp={hp}
            mp={mp}
          />
        )}
      </div>
    </div>
  );
};
