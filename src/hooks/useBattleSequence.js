import { useCallback, useEffect, useState } from 'react';
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

  const reduceCooldowns = useCallback((prev) => {
    return {
      action1:
        prev.cooldowns.action1 === 0 ||
          prev.cooldowns.action1 === 'final-turn-on-cd'
          ? 0
          : prev.cooldowns.action1 === 1
            ? 'final-turn-on-cd'
            : prev.cooldowns.action1 - 1,
      action2:
        prev.cooldowns.action2 === 0 ||
          prev.cooldowns.action2 === 'final-turn-on-cd'
          ? 0
          : prev.cooldowns.action2 === 1
            ? 'final-turn-on-cd'
            : prev.cooldowns.action2 - 1,
      action3:
        prev.cooldowns.action3 === 0 ||
          prev.cooldowns.action3 === 'final-turn-on-cd'
          ? 0
          : prev.cooldowns.action3 === 1
            ? 'final-turn-on-cd'
            : prev.cooldowns.action3 - 1,
      action4:
        prev.cooldowns.action4 === 0 ||
          prev.cooldowns.action4 === 'final-turn-on-cd'
          ? 0
          : prev.cooldowns.action4 === 1
            ? 'final-turn-on-cd'
            : prev.cooldowns.action4 - 1,
    };
  }, []);

  const removePetFromTarget = (prev, petOwner) => {
    let newEffects = prev.effects.filter(e => e.petOwner !== petOwner);

    return {
      ...prev,
      cooldowns: { ...prev.cooldowns },
      effects: newEffects,
    };
  };

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

    const endTurnSequence = (stateSetter, skipTurnBoolean = false) => {
      if (stateSetter !== 'dead') {
        stateSetter(prev => {
          let newEffects = [];
          let invulnerabilityCheck = null;
          let damageReduceEffectCheck = null;

          if (prev.effects.length > 0) {
            for (const effect of prev.effects) {
              const newEffectTurns = effect.turns - 1;

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

          //reduce cooldown turns
          const newCooldowns = reduceCooldowns(prev);

          //regen mana on turn skip, if there is no pet
          let newMp = prev.mp;
          if (skipTurnBoolean) {
            let petCheck = prev.effects.some(e => e.effect === 'pet');
            if (!petCheck) {
              newMp += Math.floor(0.3 * prev.baseManaRegen);
            }
          }

          return {
            ...prev,
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
        newEffects = prev.effects;
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

    const healCaseReceiverSequence = prev => {
      let healingAmount = action.healing;

      if (prev.effects.some(e => e.effect === "healingReduction")) {
        healingAmount = Math.floor(healingAmount * (1 - prev.healingReductionEffect));
      }

      let newHp = prev.hp + Number(healingAmount);

      if (prev.dead) {
        return prev;
      }

      if (newHp > prev.maxHealth) {
        newHp = prev.maxHealth;
      }

      return {
        ...prev,
        cooldowns: { ...prev.cooldowns },
        hp: newHp,
        // effects: [...prev.effects]
      };
    };

    const startOfTurnSequence = prev => {
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

      if (!viperStingCheck) {
        if (prev.mp === prev.maxMana) {
          newMp = prev.mp;
        } else {
          newMp = prev.mp + prev.baseManaRegen;

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
            newMp = prev.mp + prev.baseManaRegen - viperStingBurnAmount;

            if (newMp > prev.maxMana) {
              newMp = prev.maxMana - viperStingBurnAmount;
            }
          }
        } else {
          if (prev.mp === prev.maxMana) {
            newMp = prev.mp;
          } else {
            newMp = prev.mp + prev.baseManaRegen;

            if (newMp > prev.maxMana) {
              newMp = prev.maxMana;
            }
          }
        }
      }

      //do pet damage and dot damage
      let petCheck = prev.effects.some(e => e.effect === 'pet');
      let stateAfterPetDamage = null;

      if (petCheck) {
        let petEffectArray = prev.effects.filter(e => e.effect === 'pet');

        let petDamage = 0;
        for (const effect of petEffectArray) {
          petDamage += effect.damageOverTime;
        }

        stateAfterPetDamage = damageCaseReceiverSequence(prev, { damage: petDamage, physical: true });
      } else {
        stateAfterPetDamage = prev;
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

      return {
        ...stateAfterDot,
        mp: newMp,
        cooldowns: { ...stateAfterDot.cooldowns },
        effects: stateAfterDot.effects,
        damageReduceEffect: damageReduceEffectCheck
          ? stateAfterDot.damageReduceEffect
          : false,
        invulnerable: invulnerabilityCheck ? stateAfterDot.invulnerable : false,
      };
    };

    const purgeReceiver = prev => {
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

    const debuffReceiver = prev => {
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
        physical: action.physical,
        healingReductionRating: action?.healingReductionRating,
        manaburn: action?.manaburn,
        petOwner: action?.petOwner,
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

      if (prev.dead) {
        return {
          ...prev,
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

        return {
          ...newState,
          cooldowns: { ...newState.cooldowns },
          effects: [...newState.effects, newEffect],
          healingReductionEffect: action?.healingReductionRating
        };
      } else {
        let modifiedEffects = [...prev.effects];
        if (removePetEffectBoolean) {
          modifiedEffects = modifiedEffects.filter(e => e !== effectToBeRemoved);
        }

        if (removeDuplicateDotBoolean) {
          modifiedEffects = modifiedEffects.filter(e => e !== dotToBeRemoved);
        }

        return {
          ...prev,
          hp: newEffect.name === 'Polymorph' ? newHp : prev.hp,
          mp: newEffect.effect === 'viperSting' ? prev.mp - newEffect.manaburn : prev.mp,
          cooldowns: { ...prev.cooldowns },
          effects: [...modifiedEffects, newEffect],
          healingReductionEffect: action?.healingReductionRating
        };
      }
    };

    const executeAction = callNextTurnBoolean => {
      if (attackerString === 'dead') {
        // dead turn skipper
        return (async () => {
          setInSequence(true);
          // await wait(200);

          endTurnSequence('dead');

          setInSequence(false);
        })();
      } else if (attackerString === 'stun' || attackerString === 'cc') {
        // stun/cc turn skipper
        return (async () => {
          setInSequence(true);
          // await wait(200);

          setReceiver(prev => startOfTurnSequence(prev));

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
                    // effects: [...prev.effects]
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
                let newEffect = {
                  type: action.type,
                  turns: action.effectTurns,
                  name: action.name,
                  image: action.effectImage,
                  buff: Boolean(action.type === 'buff'),
                  debuff: Boolean(action.type !== 'buff'),
                  dispellable: action.dispellable,
                  shieldAmount: action?.shieldAmount,
                  effect: action.effect,
                  damageReduceRating: action.damageReduceRating,
                  invulnerable:
                    action.effect === 'invulnerability' ? true : false,
                };

                let newShieldAmount = action.shieldAmount ? action.shieldAmount : 0;
                if (prev.shield) {
                  newShieldAmount += prev.shield;
                }

                let filteredEffects = [];
                if (action.effect === 'invulnerability') {
                  filteredEffects = prev.effects.filter(e => !e.debuff || e.effect === 'pet');
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

                return {
                  ...prev,
                  cooldowns: { ...prev.cooldowns },
                  effects:
                    action.effect === 'invulnerability'
                      ? [...filteredEffects, newEffect]
                      : [...prev.effects, newEffect],
                  damageReduceEffect: action.damageReduceRating ? calculatedDamageReduceRating : prev.damageReduceEffect,
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

                  return {
                    ...prev,
                    cooldowns: { ...prev.cooldowns },
                    mp: newMp,
                    effects: [...prev.effects],
                    petTarget: action.name === 'Send Pet' ? receiverString : prev.petTarget,
                    //SETTING PET TARGET
                  };
                });
                // await wait(200);
              }

              setReceiver(prev => debuffReceiver(prev));
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

                  setReceiver(prev => {
                    let newEffects = [];
                    if (
                      prev.effects.some(e => e.dispellable && e.debuff)
                    ) {
                      const shuffledArray = prev.effects.sort(
                        () => 0.5 - Math.random(),
                      );
                      let effectToBeRemoved = shuffledArray.find(
                        e => e.dispellable && e.debuff,
                      );

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
                  });
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

                  setReceiver(prev => purgeReceiver(prev));
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

                  setReceiver(prev => {
                    let newEffects = [];

                    if (prev.effects.some(e => (e.dispellable && e.debuff) || e.effect === 'viperSting')) {
                      let newArray = [];

                      prev.effects.forEach(e => {
                        if (e.dispellable && e.debuff) {
                          newArray.push(e);
                        } else if (e.effect === 'viperSting') {
                          newArray.push(e);
                        }
                      });

                      const shuffledArray = newArray.sort(
                        () => 0.5 - Math.random(),
                      );
                      let effectToBeRemoved = shuffledArray[0];

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
                  });
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

                  setReceiver(prev => purgeReceiver(prev));
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
                if (newStateAfterDamage.invulnerable === true) {
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
                let newStateAfterPurge = purgeReceiver(prev);
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
                    effects: [...prev.effects, newEffect],
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

              setAttacker(prev => startOfTurnSequence(prev));
              await wait(1000);

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
  }, [sequence, reduceCooldowns]);

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