import styles from './styles.module.css';

export const CharCard = ({ className, img, specImg, charClass, spec }) => {
	return (
		<div className={className}>
			<div className={styles.imgContainer}>
				<img className={styles.img} src={img} alt={charClass} />
				<img className={styles.specImg} src={specImg} alt={charClass} />
			</div>
			<div className={styles.classAndSpecNames}>
				{`${charClass} ${spec}`}
			</div>
		</div>
	);
};
