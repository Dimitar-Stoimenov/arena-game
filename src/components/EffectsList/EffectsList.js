import { Effect } from 'components';
import styles from './styles.module.css';

export const EffectsList = ({ effects, backgroundColor }) => {
    return <div
        style={{ backgroundColor: backgroundColor }}
        className={styles.effects}
    >
        {effects.map((e, i) => <Effect effect={e} key={i} />)}
    </div>;
};