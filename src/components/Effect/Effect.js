import styles from './styles.module.css';

export const Effect = ({ effect }) => {
    return (<div className={styles.effectWrapper}>
        <div className={styles.effectImageWrapper}>
            <img className={styles.effectImage} src={effect.image} alt={effect.name} />
        </div>
        <div className={styles.turnsLeft}>{effect.turns}</div>
    </div>);
};