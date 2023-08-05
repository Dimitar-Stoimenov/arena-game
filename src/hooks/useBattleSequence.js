import { useEffect, useState } from 'react';
import { wait } from 'shared';

export const useBattleSequence = (sequence, allPlayers) => {
  const [turn, setTurn] = useState((sequence.turn = 1));
  const [inSequence, setInSequence] = useState(false);
  const {
    char1team1,
    char2team1,
    char3team1,
    char1team2,
    char2team2,
    char3team2,
  } = allPlayers;

  const [char1team1state, setChar1team1state] = useState({
    char: char1team1,
    hp: char1team1.maxHealth,
    mp: char1team1.maxMana,
    maxHealth: char1team1.maxHealth,
    maxMana: char1team1.maxMana,
    baseManaRegen: char1team1.baseManaRegen,
    dead: false,
    petOwnerString: char1team1.petOwnerString,
    cooldowns: { action1: 0, action2: 0, action3: 0, action4: 0 },
    effects: [],
  });
  const [char2team1state, setChar2team1state] = useState({
    char: char2team1,
    hp: char2team1.maxHealth,
    mp: char2team1.maxMana,
    maxHealth: char2team1.maxHealth,
    maxMana: char2team1.maxMana,
    baseManaRegen: char2team1.baseManaRegen,
    dead: false,
    petOwnerString: char2team1.petOwnerString,
    cooldowns: { action1: 0, action2: 0, action3: 0, action4: 0 },
    effects: [],
  });
  const [char3team1state, setChar3team1state] = useState({
    char: char3team1,
    hp: char3team1.maxHealth,
    mp: char3team1.maxMana,
    maxHealth: char3team1.maxHealth,
    maxMana: char3team1.maxMana,
    baseManaRegen: char3team1.baseManaRegen,
    dead: false,
    petOwnerString: char3team1.petOwnerString,
    cooldowns: { action1: 0, action2: 0, action3: 0, action4: 0 },
    effects: [],
  });
  const [char1team2state, setChar1team2state] = useState({
    char: char1team2,
    hp: char1team2.maxHealth,
    mp: char1team2.maxMana,
    maxHealth: char1team2.maxHealth,
    maxMana: char1team2.maxMana,
    baseManaRegen: char1team2.baseManaRegen,
    dead: false,
    petOwnerString: char1team2.petOwnerString,
    cooldowns: { action1: 0, action2: 0, action3: 0, action4: 0 },
    effects: [],
  });
  const [char2team2state, setChar2team2state] = useState({
    char: char2team2,
    hp: char2team2.maxHealth,
    mp: char2team2.maxMana,
    maxHealth: char2team2.maxHealth,
    maxMana: char2team2.maxMana,
    baseManaRegen: char2team2.baseManaRegen,
    dead: false,
    petOwnerString: char2team2.petOwnerString,
    cooldowns: { action1: 0, action2: 0, action3: 0, action4: 0 },
    effects: [],
  });
  const [char3team2state, setChar3team2state] = useState({
    char: char3team2,
    hp: char3team2.maxHealth,
    mp: char3team2.maxMana,
    maxHealth: char3team2.maxHealth,
    maxMana: char3team2.maxMana,
    baseManaRegen: char3team2.baseManaRegen,
    dead: false,
    petOwnerString: char3team2.petOwnerString,
    cooldowns: { action1: 0, action2: 0, action3: 0, action4: 0 },
    effects: [],
  });

  useEffect(() => {
    const { action, attackerString, receivers } = sequence;

    let receiverString = '';

    const setPlayerState = {
      char1team1: setChar1team1state,
      char2team1: setChar2team1state,
      char3team1: setChar3team1state,
      char1team2: setChar1team2state,
      char2team2: setChar2team2state,
      char3team2: setChar3team2state,
    };


    const reduceCooldowns = (prev) => {
      return {
        action1:
          prev.cooldowns.action1 === 0 || prev.cooldowns.action1 === 1
            ? 0
            : prev.cooldowns.action1 - 1,
        action2:
          prev.cooldowns.action2 === 0 || prev.cooldowns.action2 === 1
            ? 0
            : prev.cooldowns.action2 - 1,
        action3:
          prev.cooldowns.action3 === 0 || prev.cooldowns.action3 === 1
            ? 0
            : prev.cooldowns.action3 - 1,
        action4:
          prev.cooldowns.action4 === 0 || prev.cooldowns.action4 === 1
            ? 0
            : prev.cooldowns.action4 - 1,
      };
    };

    const removePetFromTarget = (prev, petOwner) => {
      let newEffects = prev.effects.filter(e => e.petOwner !== petOwner);

      return {
        ...prev,
        cooldowns: { ...prev.cooldowns },
        effects: newEffects,
      };
    };

    const endTurnSequence = (stateSetter, skipTurnBoolean = false) => {
      if (stateSetter !== 'dead') {
        stateSetter(prev => {
          let newEffects = [];
          let invulnerabilityCheck = null;
          let damageReduceEffectCheck = null;

          if (prev.effects.length > 0) {
            for (const effect of prev.effects) {
              const newEffectTurns = !(effect.effect === "damageOverTime" || effect.type === "buff")
                ? effect.turns - 1
                : effect.turns;

              if (newEffectTurns > 0) {
                newEffects.push({ ...effect, turns: newEffectTurns });
              }
            }

            if (prev.damageReduceEffect) {
              damageReduceEffectCheck = newEffects.some(
                e => e.damageReduceRating,
              );
            }

            invulnerabilityCheck = newEffects.some(e => e.invulnerable);
          }


          //remove shield if shield effect is expired
          let newShieldAmount = prev.shield;
          if (prev.shield) {
            const shieldEffects = newEffects.filter(e => e.effect === "shield");
            let counter = 0;

            for (const effect of shieldEffects) {
              counter += effect.turns;
            }

            counter === 0 ? newShieldAmount = 0 : newShieldAmount = prev.shield;
          }

          //regen mana on turn skip, if there is no pet          
          let newMp = prev.mp;
          if (skipTurnBoolean) {
            let petCheck = prev.effects.some(e => e.effect === 'pet');
            if (!petCheck) {
              newMp += Math.floor(0.5 * prev.baseManaRegen);
            }
          }

          //if somehow you regen more mana than the max - bring it down to the max
          if (newMp > prev.maxMana) newMp = prev.maxMana;

          //reduce cooldown turns
          const newCooldowns = reduceCooldowns(prev);

          return {
            ...prev,
            shield: newShieldAmount,
            cooldowns: newCooldowns,
            mp: newMp,
            effects: [...newEffects],
            invulnerable: invulnerabilityCheck ? prev.invulnerable : false,
            damageReduceEffect: damageReduceEffectCheck
              ? prev.damageReduceEffect
              : false,
          };
        });
      }

      setTurn(currentTurn => {
        let newTurn = currentTurn + 1;

        if (newTurn === 7) {
          return 1;
        }

        return newTurn;
      });
    };

    const setAttacker = setPlayerState[attackerString];
    let setReceiver = null;

    const damageCaseReceiverSequence = (prev, damageObj) => {
      let damage = damageObj ? damageObj.damage : action.damage;
      let newShieldAmount = prev.shield;

      if (prev.invulnerable === true) {
        damage = 0;
      } else if (prev.shield) {
        damage = damage - Number(prev.shield);

        if (damage >= 0) {
          newShieldAmount = 0;
        } else {
          damage = 0;
          newShieldAmount = prev.shield - (damageObj ? damageObj.damage : action.damage);
        }
      }

      let physicalDamageCheck = damageObj ? damageObj.physical : action.physical;
      if (prev.damageReduceEffect && physicalDamageCheck) {
        damage = Math.floor(damage * (1 - prev.damageReduceEffect));
      }

      let newHp = prev.hp - Number(damage);
      if (newHp <= 0) {
        let ownerString = prev.petOwnerString;
        //remove pet from target on death
        if (prev.petTarget) {
          let setTargetPetRemoveState = setPlayerState[prev.petTarget];
          setTargetPetRemoveState(prev => removePetFromTarget(prev, ownerString));
        }

        return {
          ...prev,
          hp: 0,
          mp: 0,
          dead: true,
          effects: [],
          shield: false,
          petTarget: false,
        };
      }

      let newEffects = [];
      if (prev.effects.some(e => e.effect === 'cc')) {
        newEffects = prev.effects.filter(e => e.effect !== 'cc');
      } else {
        newEffects = [...prev.effects];
      }

      if (newShieldAmount <= 0 && newShieldAmount !== null) {
        newEffects = newEffects.filter(e => e.effect !== 'shield');
      }

      return {
        ...prev,
        cooldowns: { ...prev.cooldowns },
        hp: newHp,
        effects: newEffects,
        shield: newShieldAmount,
      };
    };

    const healCaseReceiverSequence = (prev, healObj) => {
      let healingAmount = healObj ? healObj.healing : action.healing;
      if (prev.effects.some(e => e.effect === "healingReduction")) {
        healingAmount = Math.floor(healingAmount * (1 - prev.healingReductionEffect));
      }

      let newHp = prev.hp + Number(healingAmount);

      if (newHp > prev.maxHealth) {
        newHp = prev.maxHealth;
      }

      if (prev.dead) {
        return prev;
      }

      return {
        ...prev,
        cooldowns: { ...prev.cooldowns },
        hp: newHp,
        effects: [...prev.effects]
      };
    };

    const startTurnSequence = prev => {
      //remove cc from effects if it was broken
      if (receiverString === 'ccBreak') {
        prev.effects = prev.effects.filter(e => e.effect !== 'cc');
      }

      //check for damage reduce effect
      let damageReduceEffectCheck = null;
      if (prev.damageReduceEffect) {
        damageReduceEffectCheck = prev.effects.some(
          e => e.damageReduceRating,
        );
      }

      //check for invulnerability
      let invulnerabilityCheck = null;
      if (prev.invulnerable) {
        invulnerabilityCheck = prev.effects.some(e => e.invulnerable);
      }

      //mana regen
      let newMp = Number;
      let viperStingCheck = prev.effects.some(e => e.effect === 'viperSting');
      let currentManaRegenMultiplier = prev?.manaRegenMultiplier ? prev.manaRegenMultiplier : 1;

      if (prev.effects.findIndex((e) => e.effect === "manaRegen") === -1) {
        currentManaRegenMultiplier = 1;
      }

      if (!viperStingCheck) {
        if (prev.mp === prev.maxMana) {
          newMp = prev.mp;
        } else {
          newMp = prev.mp + Math.floor(prev.baseManaRegen * currentManaRegenMultiplier);

          if (newMp > prev.maxMana) {
            newMp = prev.maxMana;
          }
        }
      } else {
        if (!invulnerabilityCheck) { //Viper Sting doesn't work on immune targets
          let viperStingEffect = prev.effects.filter(e => e.effect === 'viperSting');
          let viperStingBurnAmount = viperStingEffect[0].manaburn;
          if (prev.mp === prev.maxMana) {
            newMp = prev.mp - viperStingBurnAmount;
          } else {
            newMp = prev.mp + Math.floor(prev.baseManaRegen * currentManaRegenMultiplier) - viperStingBurnAmount;

            if (newMp > prev.maxMana) {
              newMp = prev.maxMana - viperStingBurnAmount;
            }

            if (newMp < 0) newMp = 0;
          }
        } else {
          if (prev.mp === prev.maxMana) {
            newMp = prev.mp;
          } else {
            newMp = prev.mp + Math.floor(prev.baseManaRegen * currentManaRegenMultiplier);

            if (newMp > prev.maxMana) {
              newMp = prev.maxMana;
            }
          }
        }
      }

      //do heal over time
      let hotCheck = prev.effects.some(e => e.effect === 'healOverTime');
      let stateAfterHot = null;

      if (hotCheck) {
        let hotEffectArray = prev.effects.filter(e => e.effect === 'healOverTime');

        let hotHealing = 0;
        for (const effect of hotEffectArray) {
          hotHealing += effect.healOverTime;
        }

        stateAfterHot = healCaseReceiverSequence(prev, { healing: hotHealing });
      } else {
        stateAfterHot = prev;
      }

      //do pet damage and dot damage
      let petCheck = stateAfterHot.effects.some(e => e.effect === 'pet');
      let stateAfterPetDamage = null;

      if (petCheck) {
        let petEffectArray = stateAfterHot.effects.filter(e => e.effect === 'pet');

        let petDamage = 0;
        for (const effect of petEffectArray) {
          petDamage += effect.damageOverTime;
        }

        stateAfterPetDamage = damageCaseReceiverSequence(stateAfterHot, { damage: petDamage, physical: true });
      } else {
        stateAfterPetDamage = stateAfterHot;
      }

      let dotCheck = stateAfterPetDamage.effects.some(e => e.effect === 'damageOverTime');
      let stateAfterDot = null;

      if (dotCheck) {
        let dotEffectArray = stateAfterPetDamage.effects.filter(e => e.effect === 'damageOverTime');

        let dotDamage = 0;
        for (const effect of dotEffectArray) {
          dotDamage += effect.damageOverTime;
        }

        stateAfterDot = damageCaseReceiverSequence(stateAfterPetDamage, { damage: dotDamage, physical: false }); //dot effects ignore armor anyway, so physical: false is always true
      } else {
        stateAfterDot = stateAfterPetDamage;
      }

      let newEffects = [];
      if (stateAfterDot.effects.length > 0) {
        for (const effect of stateAfterDot.effects) {
          const newEffectTurns = (effect.effect === "damageOverTime" || effect.type === "buff")
            ? effect.turns - 1
            : effect.turns;

          if (newEffectTurns > 0) {
            newEffects.push({ ...effect, turns: newEffectTurns });
          }
        }
      }

      return {
        ...stateAfterDot,
        mp: newMp,
        cooldowns: { ...stateAfterDot.cooldowns },
        effects: newEffects,
        damageReduceEffect: damageReduceEffectCheck
          ? stateAfterDot.damageReduceEffect
          : false,
        invulnerable: invulnerabilityCheck ? stateAfterDot.invulnerable : false,
      };
    };

    const cleansedUnstableAfflictionEffectSequence = (prev, effect) => {
      let unstableAfflictionEffect = effect;
      let stunEffect = {
        type: 'debuff',
        turns: unstableAfflictionEffect.unstableAfflictionStunDuration,
        name: 'Unstable Affliction Stun',
        image: '/assets/unstable-affliction-stun.png',
        debuff: true,
        dispellable: false,
        effect: 'stun',
        physical: false,
      };

      let copiedEffects = [...prev.effects];
      if (prev.effects.some(e => e.name === "Unstable Affliction Stun")) {
        copiedEffects = copiedEffects.filter(e => e.name !== "Unstable Affliction Stun");
      }

      return {
        ...prev,
        cooldowns: { ...prev.cooldowns },
        effects: [...copiedEffects, stunEffect],
      };
    };

    const cleanseCaseReceiverSequence = (prev, isCleanse = false) => {
      let newEffects = [];

      if (
        prev.effects.some(
          (e) => isCleanse
            ? (e.dispellable && e.debuff) || (e.poison && e.debuff)
            : e.dispellable && e.debuff)
      ) {
        const shuffledArray = prev.effects.sort(
          () => 0.5 - Math.random(),
        );
        let effectToBeRemoved = shuffledArray.find(
          (e) => isCleanse
            ? (e.dispellable && e.debuff) || (e.poison && e.debuff)
            : e.dispellable && e.debuff
        );

        if (effectToBeRemoved.name === 'Unstable Affliction') {
          setAttacker(prev => cleansedUnstableAfflictionEffectSequence(prev, effectToBeRemoved));
        };

        newEffects = prev.effects.filter(
          e => e !== effectToBeRemoved,
        );
      } else {
        newEffects = prev.effects;
      }

      return {
        ...prev,
        cooldowns: { ...prev.cooldowns },
        effects: newEffects,
      };
    };

    const purgeCaseReceiverSequence = prev => {
      let newEffects = [];
      let newShieldAmount = prev.shield;

      if (prev.effects.some(e => e.dispellable && e.buff)) {
        const shuffledArray = prev.effects.sort(
          () => 0.5 - Math.random(),
        );
        let effectToBeRemoved = shuffledArray.find(
          e => e.dispellable && e.buff,
        );

        if (effectToBeRemoved.effect === 'shield') {
          newShieldAmount -= effectToBeRemoved.shieldAmount;

          if (newShieldAmount < 0) {
            newShieldAmount = 0;
          }
        }

        newEffects = prev.effects.filter(
          e => e !== effectToBeRemoved,
        );
      } else {
        newEffects = prev.effects;
      }

      let damageReduceEffectCheck = null;
      if (prev.damageReduceEffect) {
        damageReduceEffectCheck = prev.effects.some(
          e => e.damageReduceEffect,
        );
      }

      if (prev.invulnerable) {
        return {
          ...prev,
          cooldowns: { ...prev.cooldowns },
          effects: [...prev.effects]
        };
      }

      return {
        ...prev,
        cooldowns: { ...prev.cooldowns },
        effects: newEffects,
        shield: newShieldAmount,
        damageReduceEffect: damageReduceEffectCheck
          ? prev.damageReduceEffect
          : false,
      };
    };

    const debuffCaseReceiverSequence = prev => {
      const isNotManaUser = prev.char.charClass === "Rogue" || prev.char.charClass === "Warrior";

      let newEffect = {
        type: action.type,
        turns: action.effectTurns,
        name: action.name,
        image: action.effectImage,
        buff: Boolean(action.type === 'buff'),
        debuff: Boolean(action.type !== 'buff'),
        dispellable: action.dispellable,
        effect: action.effect,
        damageOverTime: action.damageOverTime,
        damage: action.damage,
        poison: action.poison,
        physical: action.physical,
        healingReductionRating: action?.healingReductionRating,
        manaburn: isNotManaUser ? 0 : action?.manaburn,
        petOwner: action?.petOwner,
        unstableAffliction: action?.unstableAffliction,
        unstableAfflictionStunDuration: action?.unstableAfflictionStunDuration,
      };

      let removePetEffectBoolean = false;
      let effectToBeRemoved = null;
      if (prev.effects.some(e => e.effect === 'pet') && action.effect === 'pet') {
        let petEffectsArray = prev.effects.filter(e => e.effect === 'pet');
        if (petEffectsArray.find(e => e.petOwner === newEffect.petOwner)) {
          removePetEffectBoolean = true;
          effectToBeRemoved = petEffectsArray.find(e => e.petOwner === newEffect.petOwner);
        }
      }

      let removeDuplicateDotBoolean = false;
      let dotToBeRemoved = null;
      if (prev.effects.some(e => e.effect === 'damageOverTime') && action.effect === 'damageOverTime') {
        let dotEffectsArray = prev.effects.filter(e => e.effect === 'damageOverTime');
        if (dotEffectsArray.find(e => e.name === newEffect.name)) {
          removeDuplicateDotBoolean = true;
          dotToBeRemoved = dotEffectsArray.find(e => e.name === newEffect.name);
        }
      }

      let removeDuplicateHealingReductionDebuff = false;
      let healingReductionDebuffToBeRemoved = null;
      if (prev.effects.some(e => e.effect === 'healingReduction') && action.effect === 'healingReduction') {
        let healingDebuffEffectsArray = prev.effects.filter(e => e.effect === 'healingReduction');
        if (healingDebuffEffectsArray.find(e => e.name === newEffect.name)) {
          removeDuplicateHealingReductionDebuff = true;
          healingReductionDebuffToBeRemoved = healingDebuffEffectsArray.find(e => e.name === newEffect.name);
        }
      }

      let removeDuplicateViperStingDebuff = false;
      let viperStingDebuffToBeRemoved = null;
      if (prev.effects.some(e => e.effect === 'viperSting') && action.effect === 'viperSting') {
        let viperStingEffectsArray = prev.effects.filter(e => e.effect === 'viperSting');
        if (viperStingEffectsArray.find(e => e.name === newEffect.name)) {
          removeDuplicateViperStingDebuff = true;
          viperStingDebuffToBeRemoved = viperStingEffectsArray.find(e => e.name === newEffect.name);
        }
      }


      let newState = null;
      if (action.damage > 0) {
        newState = damageCaseReceiverSequence(prev);
      }

      let newHp = Number;
      if (newEffect.name === 'Polymorph') {
        newHp = Math.floor(prev.hp + (prev.maxHealth * 0.25));
        if (newHp > prev.maxHealth) {
          newHp = prev.maxHealth;
        }
      }

      if (prev.dead || newState?.dead) {
        return {
          ...prev,
          dead: true,
          effects: [],
        };
      }

      if (prev.invulnerable && action.effect !== 'pet') {
        return {
          ...prev,
          cooldowns: { ...prev.cooldowns },
          effects: [...prev.effects]
        };
      }

      if (newState) {
        if (removePetEffectBoolean) {
          newState.effects = newState.effects.filter(e => e !== effectToBeRemoved);
        }

        if (removeDuplicateDotBoolean) {
          newState.effects = newState.effects.filter(e => e !== dotToBeRemoved);
        }

        if (removeDuplicateHealingReductionDebuff) {
          newState.effects = newState.effects.filter(e => e !== healingReductionDebuffToBeRemoved);
        }

        if (removeDuplicateViperStingDebuff) {
          newState.effects = newState.effects.filter(e => e !== viperStingDebuffToBeRemoved);
        }

        return {
          ...newState,
          cooldowns: { ...newState.cooldowns },
          effects: [...newState.effects, newEffect],
          healingReductionEffect: action?.healingReductionRating ? action.healingReductionRating : prev.healingReductionEffect
        };
      } else {
        let modifiedEffects = [...prev.effects];
        if (removePetEffectBoolean) {
          modifiedEffects = modifiedEffects.filter(e => e !== effectToBeRemoved);
        }

        if (removeDuplicateDotBoolean) {
          modifiedEffects = modifiedEffects.filter(e => e !== dotToBeRemoved);
        }

        if (removeDuplicateHealingReductionDebuff) {
          modifiedEffects = modifiedEffects.filter(e => e !== removeDuplicateHealingReductionDebuff);
        }

        if (removeDuplicateViperStingDebuff) {
          modifiedEffects = modifiedEffects.filter(e => e !== viperStingDebuffToBeRemoved);
        }

        let doNotApplyEffect = false;
        if (newEffect.effect === 'viperSting' && isNotManaUser) {
          doNotApplyEffect = true;
        }

        return {
          ...prev,
          hp: newEffect.name === 'Polymorph' ? newHp : prev.hp,
          mp: isNotManaUser
            ? prev.mp
            : newEffect.effect === 'viperSting'
              ? prev.mp - newEffect.manaburn
              : prev.mp,
          cooldowns: { ...prev.cooldowns },
          effects: doNotApplyEffect ? [...modifiedEffects] : [...modifiedEffects, newEffect],
          healingReductionEffect: action?.healingReductionRating ? action.healingReductionRating : prev.healingReductionEffect
        };
      }
    };

    const executeAction = callNextTurnBoolean => {
      if (attackerString === 'dead') {
        // dead turn skipper
        return (async () => {
          setInSequence(true);

          // await wait(2000);

          endTurnSequence('dead');

          setInSequence(false);
        })();
      } else if (attackerString === 'stun' || attackerString === 'cc') {
        // stun/cc turn skipper
        return (async () => {
          setInSequence(true);

          await wait(2000);

          setReceiver(prev => startTurnSequence(prev));

          endTurnSequence(setReceiver);

          setInSequence(false);
        })();
      }

      if (action) {
        let attackerTeam = null;
        let receiverTeam = null;

        if (
          attackerString === 'char1team1' ||
          attackerString === 'char2team1' ||
          attackerString === 'char3team1'
        ) {
          attackerTeam = 1;
        } else if (
          attackerString === 'char1team2' ||
          attackerString === 'char2team2' ||
          attackerString === 'char3team2'
        ) {
          attackerTeam = 2;
        }

        if (
          receiverString === 'char1team1' ||
          receiverString === 'char2team1' ||
          receiverString === 'char3team1'
        ) {
          receiverTeam = 1;
        } else if (
          receiverString === 'char1team2' ||
          receiverString === 'char2team2' ||
          receiverString === 'char3team2'
        ) {
          receiverTeam = 2;
        }

        switch (action.type) {
          case 'damage':
            (async () => {
              setInSequence(true);
              // await wait(200);

              if (callNextTurnBoolean) {
                setAttacker(prev => {
                  let newMp = prev.mp - action.manaCost;

                  return {
                    ...prev,
                    cooldowns: { ...prev.cooldowns },
                    mp: newMp,
                    effects: [...prev.effects]
                  };
                });
                // await wait(200);
              }

              setReceiver(prev => damageCaseReceiverSequence(prev));
              await wait(1000);

              if (callNextTurnBoolean) {
                endTurnSequence(setAttacker);
                setInSequence(false);
              }
            })();
            break;

          case 'heal':
            (async () => {
              setInSequence(true);
              // await wait(200);

              if (callNextTurnBoolean) {
                setAttacker(prev => {
                  let newMp = prev.mp - action.manaCost;

                  return {
                    ...prev,
                    cooldowns: { ...prev.cooldowns },
                    mp: newMp,
                    // effects: [...prev.effects]
                  };
                });
                // await wait(200);
              }

              setReceiver(prev => healCaseReceiverSequence(prev));
              await wait(1000);

              if (callNextTurnBoolean) {
                endTurnSequence(setAttacker);
                setInSequence(false);
              }
            })();
            break;

          case 'buff':
            (async () => {
              setInSequence(true);
              // await wait(200);

              if (callNextTurnBoolean) {
                setAttacker(prev => {
                  let newMp = prev.mp - action.manaCost;

                  return {
                    ...prev,
                    cooldowns: { ...prev.cooldowns },
                    mp: newMp,
                    effects: [...prev.effects]
                  };
                });
                // await wait(200);
              }

              setReceiver(prev => {
                let selfCastCheck = attackerString === receiverString;

                let newEffect = {
                  type: action.type,
                  turns: action.name === "Blessing of Protection" && selfCastCheck ? action.effectTurns + 1 : action.effectTurns,
                  name: action.name,
                  image: action.effectImage,
                  buff: Boolean(action.type === 'buff'),
                  debuff: Boolean(action.type !== 'buff'),
                  dispellable: action.dispellable,
                  shieldAmount: action?.shieldAmount,
                  effect: action.effect,
                  damageReduceRating: action.damageReduceRating,
                  healOverTime: action.healOverTime,
                  healing: action.healing,
                  invulnerable:
                    action.effect === 'invulnerability' ? true : false,
                };

                let removeDuplicateHotBoolean = false;
                let hotToBeRemoved = null;
                if (prev.effects.some(e => e.effect === 'healOverTime') && action.effect === 'healOverTime') {
                  let hotEffectsArray = prev.effects.filter(e => e.effect === 'healOverTime');

                  if (hotEffectsArray.find(e => e.name === newEffect.name)) {
                    removeDuplicateHotBoolean = true;
                    hotToBeRemoved = hotEffectsArray.find(e => e.name === newEffect.name);
                  }
                }

                let modifiedEffects = [...prev.effects];
                if (removeDuplicateHotBoolean) {
                  modifiedEffects = modifiedEffects.filter(e => e !== hotToBeRemoved);
                }

                let newShieldAmount = action.shieldAmount ? action.shieldAmount : 0;
                if (prev.shield) {
                  newShieldAmount += prev.shield;
                }

                let filteredEffects = [];
                if (action.effect === 'invulnerability') {
                  filteredEffects = modifiedEffects.effects.filter(e => !e.debuff || e.effect === 'pet');
                } else {
                  filteredEffects = modifiedEffects;
                }

                let newHp = Number;
                if (action.healing) {
                  if (prev.effects.some(e => e.effect === "healingReduction")) {
                    newHp = prev.hp + (Math.floor(action.healing * (1 - prev.healingReductionEffect)));
                  } else {
                    newHp = prev.hp + action.healing;
                  }
                } else {
                  newHp = prev.hp;
                }

                if (action.effect === 'consumeHots') {
                  const hotEffectsArray = filteredEffects.filter((e) => e.effect === "healOverTime");
                  const totalHealOverTime = hotEffectsArray.reduce((sum, obj) => sum + obj.healOverTime, 0);
                  const finalHeal = totalHealOverTime * action.consumeMultiplier;

                  if (prev.effects.some(e => e.effect === "healingReduction")) {
                    newHp = prev.hp + (Math.floor(finalHeal * (1 - prev.healingReductionEffect)));
                  } else {
                    newHp += finalHeal;
                  }
                  filteredEffects = filteredEffects.filter((e) => e.effect !== "healOverTime");
                }

                let manaRegenMultiplier = 1;
                if (action.effect === 'manaRegen') {
                  manaRegenMultiplier *= action.manaRegenMultiplier;
                }

                if (prev.dead) {
                  return {
                    ...prev,
                    effects: [],
                  };
                }

                let calculatedDamageReduceRating = null;
                if (action.damageReduceRating) {
                  if (action.damageReduceRating < prev.damageReduceEffect) {
                    calculatedDamageReduceRating = prev.damageReduceEffect;
                  } else {
                    calculatedDamageReduceRating = action.damageReduceRating;
                  }
                }

                if (newHp > prev.maxHealth) newHp = prev.maxHealth;

                return {
                  ...prev,
                  hp: newHp,
                  manaRegenMultiplier:
                    action.effect === 'manaRegen' ? manaRegenMultiplier : prev.manaRegenMultiplier,
                  cooldowns: { ...prev.cooldowns },
                  effects: [...filteredEffects, newEffect],
                  damageReduceEffect:
                    action.damageReduceRating ? calculatedDamageReduceRating : prev.damageReduceEffect,
                  invulnerable:
                    action.effect === 'invulnerability' ? true : false,
                  shield: newShieldAmount,
                  healingReductionEffect:
                    action.effect === 'invulnerability' ? false : prev.healingReductionEffect,
                };
              });

              await wait(1000);
            })();

            if (callNextTurnBoolean) {
              endTurnSequence(setAttacker);
              setInSequence(false);
            }
            break;

          case 'debuff':
            (async () => {
              setInSequence(true);
              // await wait(200);

              if (callNextTurnBoolean) {
                setAttacker(prev => {
                  let newMp = prev.mp - action.manaCost;

                  if (prev.petTarget && prev.petTarget !== receiverString && action.name === 'Send Pet') {
                    let petPreviousTarget = prev.petTarget;
                    let setPetPreviousTarget = setPlayerState[petPreviousTarget];
                    setPetPreviousTarget(prev => removePetFromTarget(prev, action.petOwner));
                  }

                  let newHp = prev.hp;
                  if (action.name === 'Death Coil') {
                    newHp += action.selfHeal;

                    if (newHp > prev.maxHealth) {
                      newHp = prev.maxHealth;
                    }
                  }

                  return {
                    ...prev,
                    cooldowns: { ...prev.cooldowns },
                    hp: newHp,
                    mp: newMp,
                    effects: [...prev.effects],
                    petTarget: action.name === 'Send Pet' ? receiverString : prev.petTarget,
                    //SETTING PET TARGET
                  };
                });
                // await wait(200);
              }

              setReceiver(prev => debuffCaseReceiverSequence(prev));
              await wait(1000);
            })();

            if (callNextTurnBoolean) {
              endTurnSequence(setAttacker);
              setInSequence(false);
            }
            break;

          case 'dispel':
            if (action.name === 'Dispel') {
              if (attackerTeam === receiverTeam) {
                (async () => {
                  setInSequence(true);
                  // await wait(200);

                  if (callNextTurnBoolean) {
                    setAttacker(prev => {
                      let newMp = prev.mp - action.manaCost;

                      return {
                        ...prev,
                        cooldowns: { ...prev.cooldowns },
                        mp: newMp,
                        effects: [...prev.effects]
                      };
                    });
                    // await wait(200);
                  }

                  setReceiver(prev => cleanseCaseReceiverSequence(prev));
                  await wait(1000);
                })();
              } else {
                (async () => {
                  setInSequence(true);
                  // await wait(200);

                  if (callNextTurnBoolean) {
                    setAttacker(prev => {
                      let newMp = prev.mp - action.manaCost;

                      return {
                        ...prev,
                        cooldowns: { ...prev.cooldowns },
                        mp: newMp,
                        effects: [...prev.effects]
                      };
                    });
                    // await wait(200);
                  }

                  setReceiver(prev => purgeCaseReceiverSequence(prev));
                  await wait(1000);
                })();
              }

              if (callNextTurnBoolean) {
                endTurnSequence(setAttacker);
                setInSequence(false);
              }
            } else if (action.name === 'Cleanse') {
              if (attackerTeam === receiverTeam) {
                (async () => {
                  setInSequence(true);
                  // await wait(200);

                  if (callNextTurnBoolean) {
                    setAttacker(prev => {
                      let newMp = prev.mp - action.manaCost;

                      return {
                        ...prev,
                        cooldowns: { ...prev.cooldowns },
                        mp: newMp,
                        effects: [...prev.effects]
                      };
                    });
                    // await wait(200);
                  }

                  setReceiver(prev => cleanseCaseReceiverSequence(prev, true));
                  await wait(1000);
                })();
              }

              if (callNextTurnBoolean) {
                endTurnSequence(setAttacker);
                setInSequence(false);
              }
            } else if (action.name === 'Purge') {
              if (attackerTeam !== receiverTeam) {
                (async () => {
                  setInSequence(true);
                  // await wait(200);

                  if (callNextTurnBoolean) {
                    setAttacker(prev => {
                      let newMp = prev.mp - action.manaCost;

                      return {
                        ...prev,
                        cooldowns: { ...prev.cooldowns },
                        mp: newMp,
                        effects: [...prev.effects]
                      };
                    });
                    // await wait(200);
                  }

                  setReceiver(prev => purgeCaseReceiverSequence(prev));
                  await wait(1000);
                })();
              }

              if (callNextTurnBoolean) {
                endTurnSequence(setAttacker);
                setInSequence(false);
              }
            }

            break;

          case 'manaburn':
            (async () => {
              setInSequence(true);
              // await wait(200);

              if (callNextTurnBoolean) {
                setAttacker(prev => {
                  let newMp = prev.mp - action.manaCost;

                  return {
                    ...prev,
                    cooldowns: { ...prev.cooldowns },
                    mp: newMp,
                    effects: [...prev.effects]
                  };
                });
                // await wait(200);
              }

              setReceiver(prev => {
                let newStateAfterDamage = damageCaseReceiverSequence(prev);
                let manaBurned = action.manaburn;
                const isNotManaUser = prev.char.charClass === "Rogue" || prev.char.charClass === "Warrior";

                if (newStateAfterDamage.invulnerable === true || isNotManaUser) {
                  manaBurned = 0;
                }

                let newMp = newStateAfterDamage.mp - Number(manaBurned);
                if (newMp < 0) {
                  newMp = 0;
                }

                if (newStateAfterDamage.dead) {
                  return {
                    ...prev,
                    hp: 0,
                    mp: 0,
                    dead: true,
                  };
                }

                return {
                  ...newStateAfterDamage,
                  mp: newMp
                };
              });
              await wait(1000);

              if (callNextTurnBoolean) {
                endTurnSequence(setAttacker);
                setInSequence(false);
              }
            })();
            break;

          case 'damageOrHeal':
            (async () => {
              setInSequence(true);
              // await wait(200);

              if (callNextTurnBoolean) {
                setAttacker(prev => {
                  let newMp = prev.mp - action.manaCost;

                  return {
                    ...prev,
                    cooldowns: { ...prev.cooldowns },
                    mp: newMp,
                    effects: [...prev.effects]
                  };
                });
                // await wait(200);
              }

              setReceiver(prev => {
                if (attackerTeam === receiverTeam) {
                  return healCaseReceiverSequence(prev);
                } else {
                  return damageCaseReceiverSequence(prev);
                }
              });
              await wait(1000);
            })();

            if (callNextTurnBoolean) {
              endTurnSequence(setAttacker);
              setInSequence(false);
            }
            break;

          case 'damageAndPurge':
            (async () => {
              setInSequence(true);
              // await wait(200);

              if (callNextTurnBoolean) {
                setAttacker(prev => {
                  let newMp = prev.mp - action.manaCost;

                  return {
                    ...prev,
                    cooldowns: { ...prev.cooldowns },
                    mp: newMp,
                  };
                });
                // await wait(200);
              }

              setReceiver(prev => {
                let newStateAfterPurge = purgeCaseReceiverSequence(prev);
                return damageCaseReceiverSequence(newStateAfterPurge);
              });
              await wait(1000);

              if (callNextTurnBoolean) {
                endTurnSequence(setAttacker);
                setInSequence(false);
              }
            })();
            break;

          case 'petAction':
            if (action.petAction === 'damage') {
              (async () => {
                setInSequence(true);
                // await wait(200);

                if (callNextTurnBoolean) {
                  setAttacker(prev => {
                    let newMp = prev.mp - action.manaCost;

                    return {
                      ...prev,
                      cooldowns: { ...prev.cooldowns },
                      mp: newMp,
                    };
                  });
                  // await wait(200);
                }

                setReceiver(prev => damageCaseReceiverSequence(prev));
                await wait(1000);

                if (callNextTurnBoolean) {
                  endTurnSequence(setAttacker);
                  setInSequence(false);
                }
              })();
            } else if (action.petAction === 'stun') {
              (async () => {
                setInSequence(true);
                // await wait(200);

                if (callNextTurnBoolean) {
                  setAttacker(prev => {
                    let newMp = prev.mp - action.manaCost;

                    return {
                      ...prev,
                      cooldowns: { ...prev.cooldowns },
                      mp: newMp,
                      effects: [...prev.effects]
                    };
                  });
                  // await wait(200);
                }

                setReceiver(prev => {
                  let newEffect = {
                    type: action.type,
                    turns: action.effectTurns,
                    name: action.name,
                    image: action.effectImage,
                    buff: Boolean(action.type === 'buff'),
                    debuff: Boolean(action.type !== 'buff'),
                    dispellable: action.dispellable,
                    effect: action.effect,
                  };

                  return {
                    ...prev,
                    cooldowns: { ...prev.cooldowns },
                    effects: prev.invulnerable ? [...prev.effects] : [...prev.effects, newEffect],
                  };
                });
                await wait(100);

                if (callNextTurnBoolean) {
                  endTurnSequence(setAttacker);
                  setInSequence(false);
                }
              })();
            }
            break;

          case 'skip':
            (async () => {
              setInSequence(true);
              // await wait(200);

              if (callNextTurnBoolean) {
                endTurnSequence(setAttacker, true);
                setInSequence(false);
              }
            })();
            break;

          case 'turnStartSequence':
            (async () => {
              setInSequence(true);
              await wait(100);

              setAttacker(prev => startTurnSequence(prev));
              await wait(100);

              setInSequence(false);
            })();
            break;

          default:
            break;
        }
      }

      if (action?.cooldown) {
        setAttacker(prev => {
          return {
            ...prev,
            cooldowns: {
              ...prev.cooldowns,
              [action.ref]: action.cooldown,
            },
          };
        });
      }
    };

    if (attackerString === 'stun' || attackerString === 'cc') {
      receiverString = receivers;
      setReceiver = setPlayerState[receiverString];
      executeAction(true);
    } else if (typeof receivers === 'string') {
      receiverString = receivers;
      setReceiver = setPlayerState[receiverString];
      executeAction(true);
    } else if (Array.isArray(receivers)) {
      let originalType = action.type;
      for (let i = 0; i < receivers.length; i++) {
        if (originalType === 'damageAndHeal') {
          if (i < 3) {
            action.type = 'heal';
          } else {
            action.type = 'damage';
          }
        }

        setReceiver = setPlayerState[receivers[i]];

        if (i === receivers.length - 1) {
          executeAction(true);
        } else {
          executeAction(false);
        }
      }
      action.type = originalType; //reset to original action.type to prevent bugs on next usage of the same ability
    } else if (!receivers) {
      if (attackerString === 'dead') {
        // on dead
        executeAction(true);
      } else {
        executeAction(true);
      }
    }
  }, [sequence]);

  return {
    turn,
    inSequence,
    char1team1state,
    char2team1state,
    char3team1state,
    char1team2state,
    char2team2state,
    char3team2state,
  };
};