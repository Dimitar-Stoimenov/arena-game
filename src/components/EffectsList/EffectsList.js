import { Effect } from 'components';
import styles from './styles.module.css';

export const EffectsList = ({ effects, backgroundColor }) => {
    const mainEffectsList = effects.slice(0, 4);
    const secondaryEffectsList = effects.slice(4);
    return (
        <>
            <div
                style={{ backgroundColor: backgroundColor }}
                className={styles.effects}
            >
                {mainEffectsList.map((e, i) => <Effect effect={e} key={i} />)}
            </div>
            <div
                style={{
                    backgroundColor: backgroundColor,
                    opacity: effects.length > 4 ? 1 : 0
                }}
                className={styles.effectsOutside}
            >
                {secondaryEffectsList.map((e, i) => <Effect effect={e} key={i} />)}
            </div>
        </>
    );
};