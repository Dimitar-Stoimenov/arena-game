const baseManaRegen = 14;
const baseSpells = {
  baseDamageOverTime: 7,
  wandDamage: 9,
  lowSpellDamage: 14,
  midSpellDamage: 25,
  bigSpellDamage: 36,
}; //11 diff
const baseHeals = {
  smallHeal: 13,
  midHeal: 23,
  bigHeal: 38,
};
const basePhysical = {
  oneHandPhysicalDamage: 13, //one-handed and ranged
  physicalAoeAbility: 10,
  physicalDamage: 16, //two-handed
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
  midMana: 210,
  highMana: 260,
}; //50 diff
const baseManaCost = {
  lowManaCost: 20,
  midManaCost: 35,
  bigManaCost: 52,
}; //15 diff ++

const mageFrost = {
  id: 1,
  charClass: 'Mage',
  img: '/assets/mage.png',
  spec: 'Frost',
  specImg: '/assets/frost-mage.png',

  maxHealth: baseHealth.lowHealth + 5,
  maxMana: baseMana.highMana,
  baseManaRegen: baseManaRegen + 4,
  action1: {
    ref: 'action1',
    name: 'Wand',
    type: 'damage', //damage, heal, cc, stun, buff
    target: 'enemy', //enemy, friendly, all, self, allEnemies, pseudoSelf(ask for confirm only)
    affectedCharacters: 1, //num
    damage: baseSpells.wandDamage,
    manaCost: 0,
    cooldown: 0,
  },
  action2: {
    ref: 'action2',
    name: 'Frostbolt',
    type: 'damage',
    target: 'enemy',
    affectedCharacters: 1,
    damage: baseSpells.midSpellDamage + 5,
    manaCost: baseManaCost.bigManaCost - 4,
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
    cooldown: 6,
    effect: 'invulnerability',
    effectTurns: 2,
    effectImage: '/assets/iceblock.png',
    dispellable: false,
    //TODO: maybe add a slight heal on using Ice Block?
  },
  action4: {
    ref: 'action4',
    name: 'Polymorph',
    type: 'debuff',
    effect: 'cc',
    target: 'enemy',
    affectedCharacters: 1,
    manaCost: baseManaCost.lowManaCost + 5,
    effectTurns: 1,
    effectImage: '/assets/polymorph.png',
    cooldown: 4,
    dispellable: true,
    description: 'CC target and restore 25% of their max health',
  },
};

const priestHoly = {
  id: 2,
  charClass: 'Priest',
  img: '/assets/priest.png',
  spec: 'Holy',
  specImg: '/assets/holy-priest.png',

  maxHealth: baseHealth.lowHealth + 10,
  maxMana: baseMana.midMana + 20,
  baseManaRegen: baseManaRegen,
  action1: {
    ref: 'action1',
    name: 'PW: Shield',
    type: 'buff',
    effect: 'shield',
    effectTurns: 3,
    effectImage: '/assets/pw-shield.png',
    target: 'friendly',
    shieldAmount: baseSpells.bigSpellDamage - 3,
    affectedCharacters: 1,
    manaCost: baseManaCost.midManaCost - 4,
    cooldown: 2,
    dispellable: true,
  },
  action2: {
    ref: 'action2',
    name: 'Greater Heal',
    type: 'heal',
    target: 'friendly',
    affectedCharacters: 1,
    healing: baseHeals.bigHeal,
    manaCost: baseManaCost.bigManaCost + 6,
    cooldown: 0,
  },
  action3: {
    ref: 'action3',
    name: 'Holy Nova',
    type: 'damageAndHeal',
    target: 'pseudoSelf',
    affectedCharacters: 6,
    manaCost: baseManaCost.bigManaCost + 15,
    damage: baseSpells.lowSpellDamage - 2,
    healing: baseHeals.smallHeal + 3,
    cooldown: 2,
  },
  action4: {
    ref: 'action4',
    name: 'Dispel',
    type: 'dispel',
    target: 'all',
    affectedCharacters: 1,
    manaCost: baseManaCost.lowManaCost,
    cooldown: 2,
  },
};

const priestDisc = {
  id: 3,
  charClass: 'Priest',
  img: '/assets/priest.png',
  spec: 'Disc',
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
    effectImage: '/assets/pw-shield.png',
    target: 'friendly',
    shieldAmount: baseSpells.bigSpellDamage - 3,
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
    healing: baseHeals.midHeal + 3,
    manaCost: baseManaCost.midManaCost + 2,
    cooldown: 0,
  },
  action3: {
    ref: 'action3',
    name: 'Mana Burn',
    type: 'manaburn',
    target: 'enemy',
    affectedCharacters: 1,
    manaCost: baseManaCost.midManaCost - 7,
    damage: baseSpells.lowSpellDamage - 2,
    manaburn: baseManaCost.midManaCost - 2,
    cooldown: 3,
  },
  action4: {
    ref: 'action4',
    name: 'Dispel',
    type: 'dispel',
    target: 'all',
    affectedCharacters: 1,
    manaCost: baseManaCost.lowManaCost,
    cooldown: 2,
  },
};

const paladinRetri = {
  id: 4,
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
    damage: basePhysical.physicalAbilityDamage + 2,
    physical: true,
    manaCost: baseManaCost.midManaCost + 7,
    cooldown: 2,
  },
  action3: {
    ref: 'action3',
    name: 'Hammer of Justice',
    type: 'debuff',
    effect: 'stun',
    target: 'enemy',
    affectedCharacters: 1,
    manaCost: baseManaCost.midManaCost - 3,
    effectTurns: 1,
    effectImage: '/assets/hoj.png',
    cooldown: 3,
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
    cooldown: 2,
    dispellable: true,
  },
};

const paladinHoly = {
  id: 5,
  charClass: 'Paladin',
  img: '/assets/paladin.png',
  spec: 'Holy',
  specImg: '/assets/holy-paladin.png',

  maxHealth: baseHealth.highHealth - 20,
  maxMana: baseMana.midMana,
  baseManaRegen: baseManaRegen - 1,
  action1: {
    ref: 'action1',
    name: 'Hammer of Justice',
    type: 'debuff',
    effect: 'stun',
    target: 'enemy',
    affectedCharacters: 1,
    manaCost: baseManaCost.midManaCost - 3,
    effectTurns: 1,
    effectImage: '/assets/hoj.png',
    cooldown: 3,
    dispellable: true,
  },
  action2: {
    ref: 'action2',
    name: 'Holy Light',
    type: 'heal',
    target: 'friendly',
    affectedCharacters: 1,
    healing: baseHeals.bigHeal,
    manaCost: baseManaCost.bigManaCost + 5,
    cooldown: 0,
  },
  action3: {
    ref: 'action3',
    name: 'Holy Shock',
    type: 'damageOrHeal',
    target: 'all',
    affectedCharacters: 1,
    damage: baseSpells.lowSpellDamage,
    healing: baseHeals.midHeal - 2,
    manaCost: baseManaCost.lowManaCost,
    cooldown: 2,
  },
  action4: {
    ref: 'action4',
    name: 'Cleanse',
    type: 'dispel',
    target: 'friendly',
    affectedCharacters: 1,
    manaCost: baseManaCost.lowManaCost,
    cooldown: 2,
  },
};

const hunterBeast = {
  id: 6,
  charClass: 'Hunter',
  img: '/assets/hunter.png',
  spec: 'Beast',
  specImg: '/assets/beast-hunter.png',
  petOwnerString: 'beast-hunter',
  maxHealth: baseHealth.midHealth,
  maxMana: baseMana.lowMana,
  baseManaRegen: baseManaRegen - 3,
  action1: {
    ref: 'action1',
    name: 'Ranged Attack',
    type: 'damage',
    target: 'enemy',
    affectedCharacters: 1,
    damage: basePhysical.oneHandPhysicalDamage - 3,
    physical: true,
    manaCost: 0,
    cooldown: 0,
  },
  action2: {
    ref: 'action2',
    name: 'Multi-Shot',
    type: 'damage',
    target: 'allEnemies',
    affectedCharacters: 3,
    damage: basePhysical.physicalAoeAbility,
    physical: true,
    manaCost: baseManaCost.lowManaCost,
    cooldown: 2,
  },
  action3: {
    ref: 'action3',
    name: 'Intimidation',
    type: 'petAction',
    petAction: 'stun',
    effect: 'stun',
    target: 'pseudoSelf',
    affectedCharacters: 1,
    manaCost: baseManaCost.lowManaCost + 5,
    effectTurns: 1,
    effectImage: '/assets/intimidation.png',
    cooldown: 4,
    dispellable: false,
  },
  action4: {
    ref: 'action4',
    name: 'Kill Command',
    type: 'petAction',
    petAction: 'damage',
    target: 'pseudoSelf',
    affectedCharacters: 1,
    physical: true,
    damage: basePhysical.physicalAbilityDamage - 5,
    manaCost: baseManaCost.midManaCost - 2,
    cooldown: 4,
  },
  sendPet: {
    ref: 'sendPet',
    name: "Send Pet",
    type: 'debuff',
    target: 'enemy',
    damageOverTime: basePhysical.oneHandPhysicalDamage - 1,
    physical: true,
    affectedCharacters: 1,
    manaCost: 0,
    effect: 'pet',
    effectTurns: 9999,
    effectImage: '/assets/beast-hunter-pet.png',
    petOwner: 'beast-hunter',
    dispellable: false,
  }
};

const hunterMarks = {
  id: 7,
  charClass: 'Hunter',
  img: '/assets/hunter.png',
  spec: 'Marks',
  specImg: '/assets/marks-hunter.png',
  petOwnerString: 'marks-hunter',
  maxHealth: baseHealth.midHealth,
  maxMana: baseMana.lowMana + 25,
  baseManaRegen: baseManaRegen - 2,
  action1: {
    ref: 'action1',
    name: 'Ranged Attack',
    type: 'damage',
    target: 'enemy',
    affectedCharacters: 1,
    damage: basePhysical.oneHandPhysicalDamage - 2,
    physical: true,
    manaCost: 0,
    cooldown: 0,
  },
  action2: {
    ref: 'action2',
    name: 'Arcane Shot',
    type: 'damageAndPurge',
    target: 'enemy',
    affectedCharacters: 1,
    damage: baseSpells.lowSpellDamage,
    physical: false,
    manaCost: baseManaCost.lowManaCost,
    cooldown: 2,
  },
  action3: {
    ref: 'action3',
    name: 'Aimed Shot',
    type: 'debuff',
    target: 'enemy',
    affectedCharacters: 1,
    physical: true,
    manaCost: baseManaCost.midManaCost + 6,
    damage: basePhysical.physicalAbilityDamage - 3,
    effect: 'healingReduction',
    effectTurns: 2,
    effectImage: '/assets/aimed-shot.png',
    healingReductionRating: 0.5,
    cooldown: 4,
    dispellable: false,
  },
  action4: {
    ref: 'action4',
    name: 'Viper Sting',
    type: 'debuff',
    target: 'enemy',
    affectedCharacters: 1,
    effect: 'viperSting',
    effectTurns: 3,
    effectImage: '/assets/viper-sting.png',
    poison: true,
    manaCost: baseManaCost.midManaCost - 3,
    cooldown: 4,
    manaburn: baseSpells.lowSpellDamage - 1,
    dispellable: false,
    description: 'breaks cc, can be dispelled by cleanse only',
  },
  sendPet: {
    ref: 'sendPet',
    name: "Send Pet",
    type: 'debuff',
    target: 'enemy',
    damageOverTime: basePhysical.oneHandPhysicalDamage - 6,
    physical: true,
    affectedCharacters: 1,
    manaCost: 0,
    effect: 'pet',
    effectTurns: 9999,
    effectImage: '/assets/marks-hunter-pet.png',
    petOwner: 'marks-hunter',
    dispellable: false,
  }
};

const hunterSurv = {
  id: 8,
  charClass: 'Hunter',
  img: '/assets/hunter.png',
  spec: 'Surv',
  specImg: '/assets/surv-hunter.png',
  petOwnerString: 'surv-hunter',
  maxHealth: baseHealth.midHealth + 15,
  maxMana: baseMana.lowMana + 25,
  baseManaRegen: baseManaRegen - 2,
  action1: {
    ref: 'action1',
    name: 'Ranged Attack',
    type: 'damage',
    target: 'enemy',
    affectedCharacters: 1,
    damage: basePhysical.oneHandPhysicalDamage - 3,
    physical: true,
    manaCost: 0,
    cooldown: 0,
  },
  action2: {
    ref: 'action2',
    name: 'Scatter Shot',
    type: 'debuff',
    effect: 'cc',
    target: 'enemy',
    affectedCharacters: 1,
    manaCost: baseManaCost.midManaCost + 5,
    physical: true,
    initialDamage: basePhysical.oneHandPhysicalDamage - 3,
    effectTurns: 1,
    effectImage: '/assets/scatter-shot.png',
    cooldown: 4,
    dispellable: false,
    description: 'Can not be dispelled, breaks on damage',
  },
  action3: {
    ref: 'action3',
    name: 'Freezing Trap',
    type: 'debuff',
    effect: 'cc',
    target: 'enemy',
    affectedCharacters: 1,
    manaCost: baseManaCost.lowManaCost + 5,
    effectTurns: 1,
    effectImage: '/assets/polymorph.png',
    cooldown: 4,
    dispellable: true,
    description: 'Dispellable',
  },
  action4: {
    ref: 'action4',
    name: 'Viper Sting',
    type: 'debuff',
    target: 'enemy',
    affectedCharacters: 1,
    effect: 'viperSting',
    effectTurns: 3,
    effectImage: '/assets/viper-sting.png',
    poison: true,
    manaCost: baseManaCost.midManaCost - 3,
    cooldown: 4,
    manaburn: baseSpells.lowSpellDamage - 1,
    dispellable: false,
    description: 'breaks cc, can be dispelled by cleanse only',
  },
  sendPet: {
    ref: 'sendPet',
    name: "Send Pet",
    type: 'debuff',
    target: 'enemy',
    damageOverTime: basePhysical.oneHandPhysicalDamage - 4,
    physical: true,
    affectedCharacters: 1,
    manaCost: 0,
    effect: 'pet',
    effectTurns: 9999,
    effectImage: '/assets/surv-hunter-pet.png',
    petOwner: 'surv-hunter',
    dispellable: false,
  }
};

const warlockDemon = {
  id: 9,
  charClass: 'Warlock',
  img: '/assets/warlock.png',
  spec: 'Demon',
  specImg: '/assets/demon-warlock.png',
  petOwnerString: 'demon-warlock',
  maxHealth: baseHealth.midHealth,
  maxMana: baseMana.midMana,
  baseManaRegen: baseManaRegen + 1,
  action1: {
    ref: 'action1',
    name: 'Wand',
    type: 'damage',
    target: 'enemy',
    affectedCharacters: 1,
    damage: baseSpells.wandDamage,
    manaCost: 0,
    cooldown: 0,
  },
  action2: {
    ref: 'action2',
    name: 'Corruption',
    type: 'debuff',
    target: 'enemy',
    affectedCharacters: 1,
    manaCost: baseManaCost.midManaCost,
    cooldown: 0,
    effect: 'damageOverTime',
    damageOverTime: baseSpells.baseDamageOverTime,
    effectTurns: 3,
    effectImage: '/assets/corruption.png',
    dispellable: true,
  },
  action3: {
    ref: 'action3',
    name: 'Intercept',
    type: 'petAction',
    petAction: 'stun',
    effect: 'stun',
    target: 'pseudoSelf',
    affectedCharacters: 1,
    manaCost: baseManaCost.lowManaCost + 5,
    effectTurns: 1,
    effectImage: '/assets/intimidation.png',
    cooldown: 4,
    dispellable: false,
  },
  action4: {
    ref: 'action4',
    name: 'Cleave',
    type: 'damage',
    // petAction: 'damage',
    target: 'allEnemies',
    affectedCharacters: 3,
    physical: true,
    damage: basePhysical.physicalAoeAbility - 2,
    manaCost: baseManaCost.midManaCost - 2,
    cooldown: 3,
  },
  sendPet: {
    ref: 'sendPet',
    name: "Send Pet",
    type: 'debuff',
    target: 'enemy',
    damageOverTime: basePhysical.oneHandPhysicalDamage - 4,
    physical: true,
    affectedCharacters: 1,
    manaCost: 0,
    effect: 'pet',
    effectTurns: 9999,
    effectImage: '/assets/demon-warlock-pet.png',
    petOwner: 'demon-warlock',
    dispellable: false,
  }
};

const warlockAffliction = {
  id: 10,
  charClass: 'Warlock',
  img: '/assets/warlock.png',
  spec: 'Affliction',
  specImg: '/assets/affliction-warlock.png',
  petOwnerString: "affliction-warlock",
  maxHealth: baseHealth.midHealth - 20,
  maxMana: baseMana.midMana + 20,
  baseManaRegen: baseManaRegen + 2,
  action1: {
    ref: 'action1',
    name: 'Unstable Affliction',
    type: 'debuff',
    target: 'enemy',
    affectedCharacters: 1,
    manaCost: baseManaCost.midManaCost + 5,
    cooldown: 2,
    effect: 'damageOverTime',
    unstableAffliction: true,
    unstableAfflictionStunDuration: 1,
    damageOverTime: baseSpells.baseDamageOverTime,
    effectTurns: 3,
    effectImage: '/assets/unstable-affliction.png',
    dispellable: true,
  },
  action2: {
    ref: 'action2',
    name: 'Corruption',
    type: 'debuff',
    target: 'enemy',
    affectedCharacters: 1,
    manaCost: baseManaCost.midManaCost,
    cooldown: 0,
    effect: 'damageOverTime',
    damageOverTime: baseSpells.baseDamageOverTime,
    effectTurns: 3,
    effectImage: '/assets/corruption.png',
    dispellable: true,
  },
  action3: {
    ref: 'action3',
    name: 'Death Coil',
    type: 'debuff',
    target: 'enemy',
    affectedCharacters: 1,
    physical: false,
    manaCost: baseManaCost.midManaCost,
    damage: baseSpells.midSpellDamage - 5,
    selfHeal: baseSpells.midSpellDamage - 5,
    effect: 'stun',
    effectTurns: 1,
    effectImage: '/assets/death-coil.png',
    cooldown: 4,
    dispellable: true,
  },
  action4: {
    ref: 'action4',
    name: 'Dispel',
    type: 'dispel',
    target: 'all',
    affectedCharacters: 1,
    manaCost: baseManaCost.lowManaCost,
    cooldown: 2,
  },
  sendPet: {
    ref: 'sendPet',
    name: "Send Pet",
    type: 'debuff',
    target: 'enemy',
    damageOverTime: basePhysical.oneHandPhysicalDamage - 8,
    physical: true,
    affectedCharacters: 1,
    manaCost: 0,
    effect: 'pet',
    effectTurns: 9999,
    effectImage: '/assets/affliction-warlock-pet.png',
    petOwner: 'affliction-warlock',
    dispellable: false,
  }
};

const rogueSub = {
  id: 11,
  charClass: "Rogue",
  img: '/assets/rogue.png',
  spec: "Subtlety",
  specImg: '/assets/subtlety.png',
  maxHealth: baseHealth.midHealth - 20,
  maxMana: 100,
  baseManaRegen: 20,
  action1: {
    ref: 'action1',
    name: 'Basic Attack',
    type: 'damage',
    target: 'enemy',
    affectedCharacters: 1,
    damage: basePhysical.oneHandPhysicalDamage - 3,
    physical: true,
    manaCost: 0,
    cooldown: 0,
  },
  action2: {
    ref: 'action2',
    name: 'Shiv',
    type: 'debuff',
    target: 'enemy',
    affectedCharacters: 1,
    physical: true,
    manaCost: 25,
    damage: basePhysical.oneHandPhysicalDamage,
    effect: 'healingReduction',
    poison: true,
    effectTurns: 2,
    effectImage: '/assets/wound-poison.jpg',
    healingReductionRating: 0.5,
    cooldown: 0,
    dispellable: false,
  },
  action3: {
    ref: 'action3',
    name: 'Backstab',
    type: 'damage',
    target: 'enemy',
    affectedCharacters: 1,
    damage: basePhysical.physicalBigAbilityDamage - 5,
    physical: true,
    manaCost: 50,
    cooldown: 0,
  },
  action4: {
    ref: 'action4',
    name: 'Blind',
    type: 'debuff',
    effect: 'cc',
    target: 'enemy',
    affectedCharacters: 1,
    manaCost: 10,
    effectTurns: 1,
    effectImage: "/assets/blind.png",
    cooldown: 4,
    dispellable: false,
    description: 'CC target - not dispellable',
  }
};

const priestShadow = {
  id: 12,
  charClass: 'Priest',
  img: '/assets/priest.png',
  spec: 'Shadow',
  specImg: '/assets/shadow-priest.png',

  maxHealth: baseHealth.lowHealth + 30,
  maxMana: baseMana.midMana,
  baseManaRegen: baseManaRegen,
  action1: {
    ref: 'action1',
    name: 'Wand',
    type: 'damage',
    target: 'enemy',
    affectedCharacters: 1,
    damage: baseSpells.wandDamage,
    manaCost: 0,
    cooldown: 0,
  },
  action2: {
    ref: 'action2',
    name: 'PW: Shield',
    type: 'buff',
    effect: 'shield',
    effectTurns: 3,
    effectImage: '/assets/pw-shield.png',
    target: 'friendly',
    shieldAmount: baseSpells.midSpellDamage,
    affectedCharacters: 1,
    manaCost: baseManaCost.midManaCost - 5,
    cooldown: 2,
    dispellable: true,
  },
  action3: {
    ref: 'action3',
    name: 'Mind Blast',
    type: 'damage',
    target: 'enemy',
    affectedCharacters: 1,
    damage: baseSpells.midSpellDamage + 5,
    manaCost: baseManaCost.bigManaCost - 5,
    cooldown: 2,
  },
  action4: {
    ref: 'action4',
    name: 'Psychic Scream',
    type: 'debuff',
    effect: 'cc',
    target: 'allEnemies',
    affectedCharacters: 3,
    manaCost: baseManaCost.midManaCost,
    effectTurns: 1,
    effectImage: '/assets/psychic-scream.png',
    cooldown: 6,
    dispellable: true,
  }
};

export const characters = {
  priestDisc,
  priestHoly,
  priestShadow,
  mageFrost,
  paladinHoly,
  paladinRetri,
  hunterBeast,
  hunterMarks,
  hunterSurv,
  warlockDemon,
  warlockAffliction,
  rogueSub
};