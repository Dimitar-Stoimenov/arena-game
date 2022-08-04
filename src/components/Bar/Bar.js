import styles from './styles.module.css';

export const Bar = ({ label, value, maxValue, color, hideSlash = false }) => {
  return (
    <div className={styles.main}>
      <div className={styles.label}>{label}</div>
      <div className={styles.max}>
        <div
          className={styles.value}
          style={{ width: `${(value / maxValue) * 100}%`, backgroundColor: color }}
        >
        </div>
        <div className={styles.valueText}>
          {value}{!hideSlash ? '/' : ''}{maxValue}
        </div>
      </div>
    </div>
  );
};
