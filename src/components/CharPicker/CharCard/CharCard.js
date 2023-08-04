import styles from './styles.module.css';

export const CharCard = ({ className, img, specImg, charClass, spec, onClick }) => {
	return (
		<div className={className} onClick={(e) => onClick(e, charClass, spec)}>
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
