import { useEffect, useState } from 'react';

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

	useEffect(() => {
		if (stageNumber > 8) {
			const [char1team1, char2team1, char3team1] = team1chars;
			const [char1team2, char2team2, char3team2] = team2chars;

			setChar1team1(char1team1);
			setChar2team1(char2team1);
			setChar3team1(char3team1);
			setChar1team2(char1team2);
			setChar2team2(char2team2);
			setChar3team2(char3team2);
		}

	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [stageNumber, team1chars, team2chars]);

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

	const team1bansJSX = team1bans.map((char) => {
		return <CharCard key={char.id} className={styles.card} img={char.img} specImg={char.specImg} charClass={char.charClass} spec={char.spec} onClick={null} disabled={false}/>
	})

	const team2bansJSX = team2bans.map((char) => {
		return <CharCard key={char.id} className={styles.card} img={char.img} specImg={char.specImg} charClass={char.charClass} spec={char.spec} onClick={null} disabled={false}/>
	})

	const team1picksJSX = team1chars.map((char) => {
		return <CharCard key={char.id} className={styles.card} img={char.img} specImg={char.specImg} charClass={char.charClass} spec={char.spec} onClick={null} disabled={false}/>
	})

	const team2picksJSX = team2chars.map((char) => {
		return <CharCard key={char.id} className={styles.card} img={char.img} specImg={char.specImg} charClass={char.charClass} spec={char.spec} onClick={null} disabled={false}/>
	})

	const pickJSX = initialCharactersList.map((char) => {
		const indexOfPickedChar = availableCharsList.indexOf(char);
		let disabled = false;
		if (indexOfPickedChar === -1) disabled = true;

		return <CharCard key={char.id} className={styles.card} img={char.img} specImg={char.specImg} charClass={char.charClass} spec={char.spec} onClick={handleClick} disabled={disabled} />
	});

	return (
		<div className={styles.main}>

			<div className={styles.teamsContainer}>
				<div className={styles.team1container}>
					<div className={styles.bannedCharacters}>
						{team1bansJSX}
					</div>
					<div className={styles.pickedCharacters}>
						{team1picksJSX}
					</div>
				</div>
				<div className={styles.team2container}>
					<div className={styles.bannedCharacters}>
						{team2bansJSX}
					</div>
					<div className={styles.pickedCharacters}>
						{team2picksJSX}
					</div>
				</div>
			</div>

			<div className={styles.messageContainer}>{
				stageNumber < 9
				? stageMapping[stageNumber]
				: <button className={styles.startButton} onClick={onStartClick}>Start Game</button>
			}</div>

			<div className={styles.pickOuterContainer}>			
				<div className={styles.pickContainer}>
					{pickJSX}
				</div>
			</div>
		</div>
	);
};
