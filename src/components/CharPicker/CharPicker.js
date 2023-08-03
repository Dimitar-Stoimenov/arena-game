import { useState } from 'react';

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
	8: "Team 2 - Third Pick",
	9: "Ready to play!"
}

export const CharPicker = ({
	char1team1,
	char2team1,
	char3team1,
	char1team2,
	char2team2,
	char3team2,
	setChar1team1,
	setChar2team1,
	setChar3team1,
	setChar1team2,
	setChar2team2,
	setChar3team2,
	onStartClick
}) => {
	const [readyToStart, setReadyToStart] = useState(false);	
	const [availableCharsList, setAvailableCharslist] = useState(initialCharactersList);
	const [stageNumber, setStageNumber] = useState(1);
	const [team1chars, setTeam1chars] = useState([]);
	const [team2chars, setTeam2chars] = useState([]);

	return (
		<div className={styles.main}>
			<div className={styles.teamsContainer}>
				<div className={styles.team1container}>team1</div>
				<div className={styles.team2container}>t2</div>
			</div>
			<div className={styles.startButtonContainer}>
				{readyToStart 
					? <button className={styles.startButton} onClick={onStartClick}>Start Game</button> 
					: null
				}
			</div>
		</div>
	);
};
