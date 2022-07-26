import {
	wait,
} from 'shared';

import { useEffect, useState } from 'react';

export const useBattleSequence = (sequence, allPlayers) => {
	const [turn, setTurn] = useState(sequence.turn = 1);
	const [inSequence, setInSequence] = useState(false);
	const { char1team1, char2team1, char3team1, char1team2, char2team2, char3team2 } = allPlayers;

	const [char1team1state, setChar1team1state] = useState({
		char: char1team1,
		hp: char1team1.maxHealth,
		mp: char1team1.maxMana,
		effects: [],
	});
	const [char2team1state, setChar2team1state] = useState({
		char: char2team1,
		hp: char2team1.maxHealth,
		mp: char2team1.maxMana,
		effects: [],
	});
	const [char3team1state, setChar3team1state] = useState({
		char: char3team1,
		hp: char3team1.maxHealth,
		mp: char3team1.maxMana,
		effects: [],
	});
	const [char1team2state, setChar1team2state] = useState({
		char: char1team2,
		hp: char1team2.maxHealth,
		mp: char1team2.maxMana,
		effects: [],
	});
	const [char2team2state, setChar2team2state] = useState({
		char: char2team2,
		hp: char2team2.maxHealth,
		mp: char2team2.maxMana,
		effects: [],
	});
	const [char3team2state, setChar3team2state] = useState({
		char: char3team2,
		hp: char3team2.maxHealth,
		mp: char3team2.maxMana,
		effects: [],
	});

	useEffect(() => {
		const { action, attackerString, receiverString } = sequence;

		const setPlayerState = {
			"char1team1": setChar1team1state,
			"char2team1": setChar2team1state,
			"char3team1": setChar3team1state,
			"char1team2": setChar1team2state,
			"char2team2": setChar2team2state,
			"char3team2": setChar3team2state,
		};

		if (action) {
			const setAttacker = setPlayerState[attackerString];
			const setReceiver = setPlayerState[receiverString];

			switch (action.type) {
				case "damage": {
					(async () => {
						setInSequence(true);
						await wait(200);

						setAttacker(prev => {
							return {
								...prev,
								mp: prev.mp - action.manaCost
							};
						});
						await wait(200);

						setReceiver(prev => {
							let newHp = prev.hp - action.damage;

							//TODO
							if (newHp < 0) {
								alert('character ded');
							}

							return {
								...prev,
								hp: newHp
							};
						});
						await wait(200);

						setTurn((currentTurn) => {
							let newTurn = currentTurn + 1;

							if (newTurn === 7) {
								return 1;
							}

							return newTurn;
						});
						setInSequence(false);
					})();
					break;
				};
				case "heal": {
					(async () => {
						setInSequence(true);
						await wait(200);

						setAttacker(prev => {
							return {
								...prev,
								mp: prev.mp - action.manaCost
							};
						});
						await wait(200);

						setReceiver(prev => {
							let newHp = prev.hp + action.healing;

							//TODO
							if (newHp > prev.maxHealth) {
								newHp = prev.maxHealth;
							}

							return {
								...prev,
								hp: newHp
							};
						});
						await wait(200);

						setTurn((currentTurn) => {
							let newTurn = currentTurn + 1;

							if (newTurn === 7) {
								return 1;
							}

							return newTurn;
						});
						setInSequence(false);
					})();
					break;
				};
				case "cc": {
					break;
				};
				case "buff": {
					break;
				};
				default:
					break;
			}
		}
	}, [sequence]);

	return {
		turn, inSequence, char1team1state, char2team1state, char3team1state, char1team2state, char2team2state, char3team2state
	};
};