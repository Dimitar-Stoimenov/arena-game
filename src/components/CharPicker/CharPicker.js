import { useState } from 'react';

import { CharCard } from './CharCard';

import { characters } from "shared";

import styles from './styles.module.css';

const initialCharactersList = Object.keys(characters)
	.map((key) => (characters[key])
);

const stageMapping = {
	1: "Team 1 Ban",
	2: "Team 2 Ban",
	3: "Team 1 - First Pick",
	4: "Team 2 - First Pick",
	5: "Team 2 - Second Pick",
	6: "Team 1 - Second Pick",
	7: "Team 1 - Third Pick",
	8: "Team 2 - Third Pick"
}

export const CharPicker = ({
	setChar1team1,
	setChar2team1,
	setChar3team1,
	setChar1team2,
	setChar2team2,
	setChar3team2,
	onStartClick
}) => {	
	const [availableCharsList, setAvailableCharslist] = useState(initialCharactersList);
	const [stageNumber, setStageNumber] = useState(1);
	const [team1chars, setTeam1chars] = useState([]);
	const [team1bans, setTeam1bans] = useState([]);
	const [team2chars, setTeam2chars] = useState([]);
	const [team2bans, setTeam2bans] = useState([]);

	const handleClick = (e, charClass, spec) => {
		const pickedChar = availableCharsList.filter((char) => char.charClass === charClass).find((char) => char.spec === spec);
		if (stageNumber === 1) {
			let arr = [...team1bans];
			arr.push(pickedChar);

			setTeam1bans(arr);
		}

		if (stageNumber === 2) {
			let arr = [...team2bans];
			arr.push(pickedChar);

			setTeam2bans(arr);
		}

		if (stageNumber === 3 || stageNumber === 6 || stageNumber === 7) {
			let arr = [...team1chars];
			arr.push(pickedChar);

			setTeam1chars(arr);
		}

		if (stageNumber === 4 || stageNumber === 5 || stageNumber === 8) {
			let arr = [...team2chars];
			arr.push(pickedChar);

			setTeam2chars(arr);
		}
		
		const indexOfPickedChar = availableCharsList.indexOf(pickedChar);

		if (indexOfPickedChar !== -1) {
			const newList = availableCharsList.filter((char) => char !== pickedChar);			
			setAvailableCharslist(newList);
			setStageNumber((prev) => prev + 1);
		} else {
			// show error?
		}		
	}

	return (
		<div className={styles.main}>

			<div className={styles.teamsContainer}>
				<div className={styles.team1container}>
					<div className={styles.bannedCharacters}></div>
					<div className={styles.pickedCharacters}></div>
				</div>
				<div className={styles.team2container}>
					<div className={styles.bannedCharacters}></div>
					<div className={styles.pickedCharacters}></div>
				</div>
			</div>

			<div className={styles.messageContainer}>{
				stageNumber < 9
				? stageMapping[stageNumber]
				: <button className={styles.startButton} onClick={onStartClick}>Start Game</button>
			}</div>

			<div className={styles.pickOuterContainer}>			
				<div className={styles.pickContainer}>
					{initialCharactersList.map((char) => {
						return <CharCard key={char.id} className={styles.card} img={char.img} specImg={char.specImg} charClass={char.charClass} spec={char.spec} onClick={handleClick}/>
					})}
				</div>
			</div>
		</div>
	);
};
