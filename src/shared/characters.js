export const mageFrost = {
  charClass: 'Mage',
  spec: 'Frost',
  img: '/assets/mage.png',

  maxHealth: 150,
  maxMana: 280,
  action1: {
    name: 'Wand',
    type: 'damage', //damage, heal, cc, stun, buff, multiple
    target: 'enemy', //enemy, friendly, all, self, pseudoSelf(ask for confirm only)
    affectedCharacters: 1, //num
    damage: 12,
    manaCost: 0,
  },
  action2: {
    name: 'Frostbolt',
    type: 'damage',
    target: 'enemy',
    affectedCharacters: 1,
    damage: 28,
    manaCost: 40,
  },
  action3: {
    name: 'Ice Block',
    type: 'buff',
    target: 'self',
    affectedCharacters: 1,
    manaCost: 30,
    turns: 1,
  },
};

export const priestHoly = {
  charClass: 'Priest',
  spec: 'Holy',
  img: '/assets/priest.png',

  maxHealth: 170,
  maxMana: 240,
  action1: {
    name: 'Wand',
    type: 'damage',
    target: 'enemy',
    affectedCharacters: 1,
    damage: 10,
    manaCost: 0,
  },
  action2: {
    name: 'Greater Heal',
    type: 'heal',
    target: 'friendly',
    affectedCharacters: 1,
    healing: 40,
    manaCost: 50,
  },
  action3: {
    name: 'Holy Nova',
    type: 'damageAndHeal',
    target: 'pseudoSelf',
    affectedCharacters: 6,
    manaCost: 60,
    damage: 14,
    healing: 18,
    cooldownTurns: 1,
  },
};

export const paladinRetri = {
  charClass: 'Paladin',
  spec: 'Retribution',
  img: '/assets/paladin.png',

  maxHealth: 220,
  maxMana: 150,
  action1: {
    name: 'Basic Attack',
    type: 'damage',
    target: 'enemy',
    affectedCharacters: 1,
    damage: 15,
    manaCost: 0,
  },
  action2: {
    name: 'Hammer of Wrath',
    type: 'damage',
    target: 'enemy',
    affectedCharacters: 1,
    damage: 23,
    manaCost: 40,
  },
  action3: {
    name: 'Hammer of Justice',
    type: 'stun',
    target: 'enemy',
    affectedCharacters: 1,
    damage: 10,
    manaCost: 30,
    debuff: 'stun',
    effectTurns: 1,
    cooldownTurns: 2,
  },
};
