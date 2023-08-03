import { useState } from 'react';

import { CharCard } from './CharCard';

import { characters } from "shared";

import styles from './styles.module.css';

const initialCharactersList = Object.keys(characters)
	.map((key) => ({
		[key]: characters[key]
	})
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
						return <CharCard className={styles.card}/>
					})}
				</div>
			</div>
		</div>
	);
};
