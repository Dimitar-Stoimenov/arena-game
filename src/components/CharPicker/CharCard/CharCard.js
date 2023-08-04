import styles from './styles.module.css';

export const CharCard = ({ className, img, specImg, charClass, spec, onClick, disabled }) => {
	return (
		<div className={className} onClick={!disabled ? (e) => onClick(e, charClass, spec) : null}>
			<div className={!disabled ? styles.imgContainer : `${styles.imgContainer} ${styles.disabled}`}>
				<img className={styles.img} src={img} alt={charClass} />
				<img className={styles.specImg} src={specImg} alt={charClass} />
			</div>
			<div className={styles.classAndSpecNames}>
				{`${charClass} ${spec}`}
			</div>
		</div>
	);
};
