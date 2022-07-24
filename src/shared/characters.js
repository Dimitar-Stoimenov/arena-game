export const mageFrost = {
  charClass: 'Mage',
  spec: 'Frost',
  img: '/assets/megaman.png',

  maxHealth: 180,
  maxMana: 300,
  attack1: { name: 'wand', type: 'damage', damage: 12, manaCost: 0 },
  special1: { name: 'frostbolt', type: 'damage', damage: 25, manaCost: 40 },
};

export const paladinRetri = {
  charClass: 'Paladin',
  spec: 'Retribution',
  img: '/assets/samus.png',

  maxHealth: 280,
  maxMana: 150,
  attack1: { name: 'basic attack', type: 'damage', damage: 15, manacost: 0 },
  special1: { name: 'hammer of wrath', type: 'damage', damage: 25, manacost: 40 },
};
