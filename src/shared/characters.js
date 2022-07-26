export const mageFrost = {
	charClass: 'Mage',
	spec: 'Frost',
	img: '/assets/mage.png',

	maxHealth: 150,
	maxMana: 280,
	action1: {
		name: 'wand',
		type: 'damage',
		target: 'enemy', //enemy, friendly, all, self
		damage: 12,
		manaCost: 0
	},
	action2: {
		name: 'frostbolt',
		type: 'damage',
		target: 'enemy',
		damage: 25,
		manaCost: 40
	},
	action3: {
		name: 'ice block',
		type: 'defensive',
		target: 'self',
		manaCost: 30,
		turns: 1,
	},
};

export const paladinRetri = {
	charClass: 'Paladin',
	spec: 'Retribution',
	img: '/assets/paladin.png',

	maxHealth: 220,
	maxMana: 150,
	action1: {
		name: 'basic attack',
		type: 'damage',
		target: 'enemy',
		damage: 152,
		manaCost: 0,
	},
	action2: {
		name: 'hammer of wrath',
		type: 'damage',
		target: 'enemy',
		damage: 25,
		manaCost: 40,
	},
	action3: {
		name: 'hammer of justice',
		type: 'stun',
		target: 'enemy',
		manaCost: 30,
		turns: 1,
	},
};
