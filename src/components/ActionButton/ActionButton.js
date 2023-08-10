import styles from './styles.module.css';

const ActionButton = ({ cooldown, onClick, children, disabled }) => {

    return (
        <>
            <button
                className={!disabled ? styles.actionButton : styles.disabled}
                onClick={onClick}
            >
                {children}{!cooldown ? null : ` CD:${cooldown}`}
            </button>
        </>
    );
};

export default ActionButton;
