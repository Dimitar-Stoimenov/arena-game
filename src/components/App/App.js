import { useState } from 'react';

import { StartMenu, Battle, EndMenu, CharPicker } from 'components';

import styles from './styles.module.css';

export const App = () => {
	const [mode, setMode] = useState('start');
	const [winner, setWinner] = useState(undefined);

	const [char1team1, setChar1team1] = useState(null);
	const [char2team1, setChar2team1] = useState(null);
	const [char3team1, setChar3team1] = useState(null);
	const [char1team2, setChar1team2] = useState(null);
	const [char2team2, setChar2team2] = useState(null);
	const [char3team2, setChar3team2] = useState(null);

	return (
		<div className={styles.main}>
			{mode === 'start' && (
				<StartMenu onStartClick={() => setMode('pick')} />
			)}

			{mode === 'pick' && (
				<CharPicker 
					char1team1={char1team1}
					char2team1={char2team1}
					char3team1={char3team1}
					char1team2={char1team2}
					char2team2={char2team2}
					char3team2={char3team2}
					setChar1team1={setChar1team1}
					setChar2team1={setChar2team1}
					setChar3team1={setChar3team1}
					setChar1team2={setChar1team2}
					setChar2team2={setChar2team2}
					setChar3team2={setChar3team2}
					onStartClick={() => setMode('battle')}
				/>
			)}

			{mode === 'battle' && (
				<Battle
					char1team1={char1team1}
					char2team1={char2team1}
					char3team1={char3team1}
					char1team2={char1team2}
					char2team2={char2team2}
					char3team2={char3team2}
					setChar1team1={setChar1team1}
					setChar2team1={setChar2team1}
					setChar3team1={setChar3team1}
					setChar1team2={setChar1team2}
					setChar2team2={setChar2team2}
					setChar3team2={setChar3team2}
					onGameEnd={winner => {
						setWinner(winner);
						setMode('gameOver');
					}}
				/>
			)}

			{mode === 'gameOver' && (
				<EndMenu
					winner={winner}
					onStartClick={() => {
						setWinner(undefined);
						setMode('battle');
					}}
				/>
			)}
		</div>
	);
};
