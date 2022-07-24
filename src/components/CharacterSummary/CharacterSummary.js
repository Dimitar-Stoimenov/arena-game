import { Bar } from 'components';
import styles from './styles.module.css';

const red = '#821200';
const blue = '#1953cb';

export const CharacterSummary = ({
  team2 = false,
  character,
}) => {
  const { charClass, spec, img, maxHealth, health, maxMana, mana, attack1, special1 } = character;

  return (
    <div
      style={{ backgroundColor: team2 ? red : blue }}
      className={styles.main}
    >
      <div className={styles.imgWrapper}>
        <img className={styles.img} src={img} alt={charClass} />
      </div>
      <div className={styles.charParameters}>
        <div className={styles.info}>
          <div className={styles.charClass}>{charClass}</div>
          <div className={styles.spec}>{spec}</div>
        </div>

        <Bar label="HP" value={health} maxValue={maxHealth} color={red} />
        <Bar label="MP" value={mana} maxValue={maxMana} color={blue} />
      </div>
    </div>
  );
};
