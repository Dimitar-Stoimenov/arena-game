const baseManaRegen = 14;
const baseSpells = {
  wandDamage: 10,
  lowSpellDamage: 14,
  midSpellDamage: 25,
  bigSpellDamage: 36,
}; //11 diff
const baseHeals = {
  smallHeal: 15,
  midHeal: 25,
  bigHeal: 40,
};
const basePhysical = {
  physicalDamage: 15,
  physicalAbilityDamage: 25,
  physicalBigAbilityDamage: 35,
}; //10 diff
const baseHealth = {
  lowHealth: 150,
  midHealth: 190,
  highHealth: 230,
}; //40 diff
const baseMana = {
  lowMana: 160,
  midMana: 220,
  highMana: 280,
}; //60 diff
const baseManaCost = {
  lowManaCost: 20,
  midManaCost: 35,
  bigManaCost: 52,
}; //15 diff

export const mageFrost = {
  charClass: 'Mage',
  img: '/assets/mage.png',
  spec: 'Frost',
  specImg: '/assets/frost-mage.png',

  maxHealth: baseHealth.lowHealth,
  maxMana: baseMana.highMana,
  baseManaRegen: baseManaRegen + 4,
  action1: {
    ref: 'action1',
    name: 'Wand',
    type: 'damage', //damage, heal, cc, stun, buff
    target: 'enemy', //enemy, friendly, all, self, pseudoSelf(ask for confirm only)
    affectedCharacters: 1, //num
    damage: baseSpells.wandDamage + 1,
    manaCost: 0,
    cooldown: 0,
  },
  action2: {
    ref: 'action2',
    name: 'Frostbolt',
    type: 'damage',
    target: 'enemy',
    affectedCharacters: 1,
    damage: baseSpells.midSpellDamage + 2,
    manaCost: baseManaCost.bigManaCost - 5,
    cooldown: 0,
    //TODO: add damage reducing effect to melee attacks (maybe effect: 'slow' property)?
    // effect: 'slow',
    // effectTurns: 2,
    // effectImage: '/assets/frostbolt.png',
    // dispellable: true,
  },
  action3: {
    ref: 'action3',
    name: 'Ice Block',
    type: 'buff',
    target: 'self',
    affectedCharacters: 1,
    manaCost: baseManaCost.lowManaCost + 5,
    cooldown: 4,
    effect: 'invulnerability',
    effectTurns: 2,
    effectImage: '/assets/iceblock.png',
    dispellable: false,
  },
  action4: {
    ref: 'action4',
    name: 'Polymorph',
    type: 'cc',
    target: 'enemy',
    affectedCharacters: 1,
    manaCost: baseManaCost.lowManaCost + 5,
    effectTurns: 1,
    effectImage: '/assets/polymorph.png',
    cooldown: 3,
    dispellable: true,
  },
};

export const priestHoly = {
  charClass: 'Priest',
  img: '/assets/priest.png',
  spec: 'Holy',
  specImg: '/assets/holy-priest.png',

  maxHealth: baseHealth.lowHealth + 10,
  maxMana: baseMana.midMana + 20,
  baseManaRegen: baseManaRegen,
  action1: {
    ref: 'action1',
    name: 'Wand',
    type: 'damage',
    target: 'enemy',
    affectedCharacters: 1,
    damage: baseSpells.wandDamage - 1,
    manaCost: 0,
    cooldown: 0,
  },
  action2: {
    ref: 'action2',
    name: 'Greater Heal',
    type: 'heal',
    target: 'friendly',
    affectedCharacters: 1,
    healing: baseHeals.bigHeal + 2,
    manaCost: baseManaCost.bigManaCost,
    cooldown: 0,
  },
  action3: {
    ref: 'action3',
    name: 'Holy Nova',
    type: 'damageAndHeal',
    target: 'pseudoSelf',
    affectedCharacters: 6,
    manaCost: baseManaCost.bigManaCost + 15,
    damage: baseSpells.lowSpellDamage,
    healing: baseHeals.smallHeal + 3,
    cooldown: 1,
  },
  action4: {
    ref: 'action4',
    name: 'Dispel',
    type: 'dispel',
    target: 'all',
    affectedCharacters: 1,
    manaCost: baseManaCost.lowManaCost,
    cooldown: 1,
  },
};

export const priestDisc = {
  charClass: 'Priest',
  img: '/assets/priest.png',
  spec: 'Discipline',
  specImg: '/assets/disc-priest.png',

  maxHealth: baseHealth.midHealth - 10,
  maxMana: baseMana.midMana + 10,
  baseManaRegen: baseManaRegen + 1,
  action1: {
    ref: 'action1',
    name: 'PW: Shield',
    type: 'buff',
    effect: 'shield',
    effectTurns: 3,
    target: 'friendly',
    shieldAmount: baseSpells.midSpellDamage,
    affectedCharacters: 1,
    manaCost: baseManaCost.midManaCost - 6,
    cooldown: 2,
    dispellable: true,
  },
  action2: {
    ref: 'action2',
    name: 'Flash Heal',
    type: 'heal',
    target: 'friendly',
    affectedCharacters: 1,
    healing: baseHeals.midHeal + 5,
    manaCost: baseManaCost.midManaCost + 3,
    cooldown: 0,
  },
  action3: {
    ref: 'action3',
    name: 'Mana Burn',
    type: 'manaburn',
    target: 'enemy',
    affectedCharacters: 1,
    manaCost: baseManaCost.midManaCost,
    damage: baseSpells.lowSpellDamage - 2,
    manaburn: baseManaCost.midManaCost + 2,
    cooldown: 2,
  },
  action4: {
    ref: 'action4',
    name: 'Dispel',
    type: 'dispel',
    target: 'all',
    affectedCharacters: 1,
    manaCost: baseManaCost.lowManaCost,
    cooldown: 1,
  },
};

export const paladinRetri = {
  charClass: 'Paladin',
  img: '/assets/paladin.png',
  spec: 'Retri',
  specImg: '/assets/retri-paladin.png',

  maxHealth: baseHealth.highHealth - 10,
  maxMana: baseMana.lowMana,
  baseManaRegen: baseManaRegen - 4,
  action1: {
    ref: 'action1',
    name: 'Basic Attack',
    type: 'damage',
    target: 'enemy',
    affectedCharacters: 1,
    damage: basePhysical.physicalDamage,
    physical: true,
    manaCost: 0,
    cooldown: 0,
  },
  action2: {
    ref: 'action2',
    name: 'Crusader Strike',
    type: 'damage',
    target: 'enemy',
    affectedCharacters: 1,
    damage: basePhysical.physicalAbilityDamage + 4,
    physical: true,
    manaCost: baseManaCost.midManaCost + 5,
    cooldown: 1,
  },
  action3: {
    ref: 'action3',
    name: 'Hammer of Justice',
    type: 'stun',
    target: 'enemy',
    affectedCharacters: 1,
    manaCost: baseManaCost.midManaCost - 5,
    effectTurns: 1,
    effectImage: '/assets/hoj.png',
    cooldown: 2,
    dispellable: true,
  },
  action4: {
    ref: 'action4',
    name: 'Devotion Aura',
    type: 'buff',
    target: 'pseudoSelf',
    affectedCharacters: 3,
    manaCost: baseManaCost.lowManaCost + 3,
    effectTurns: 3,
    effectImage: '/assets/devotion-aura.png',
    damageReduceRating: 0.2,
    cooldown: 1,
    dispellable: true,
  },
};

export const paladinHoly = {
  charClass: 'Paladin',
  img: '/assets/paladin.png',
  spec: 'Holy',
  specImg: '/assets/holy-paladin.png',

  maxHealth: baseHealth.highHealth - 20,
  maxMana: baseMana.midMana,
  baseManaRegen: baseManaRegen - 1,
  action1: {
    ref: 'action1',
    name: 'Flash Heal',
    type: 'heal',
    target: 'friendly',
    affectedCharacters: 1,
    healing: baseHeals.midHeal + 2,
    manaCost: baseManaCost.midManaCost,
    cooldown: 0,
  },
  action2: {
    ref: 'action2',
    name: 'Greater Heal',
    type: 'heal',
    target: 'friendly',
    affectedCharacters: 1,
    healing: baseHeals.bigHeal,
    manaCost: baseManaCost.bigManaCost,
    cooldown: 0,
  },
  action3: {
    ref: 'action3',
    name: 'Holy Shock',
    // type: 'stun',
    target: 'all',
    affectedCharacters: 1,
    damage: baseSpells.lowSpellDamage,
    healing: baseHeals.midHeal - 2,
    manaCost: baseManaCost.lowManaCost,
    cooldown: 1,
  },
  action4: {
    ref: 'action4',
    name: 'Cleanse',
    type: 'dispel',
    target: 'friendly',
    affectedCharacters: 1,
    manaCost: baseManaCost.lowManaCost,
    cooldown: 1,
  },
};
