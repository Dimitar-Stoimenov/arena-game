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

    const endTurnSequence = stateSetter => {
      if (stateSetter !== 'dead') {
        stateSetter(prev => {
          let newEffects = [];
          let invulnerabilityCheck = null;

          if (prev.effects.length > 0) {
            for (const effect of prev.effects) {
              const newEffectTurns = effect.turns - 1;

              if (newEffectTurns > 0) {
                newEffects.push({ ...effect, turns: newEffectTurns });
              }
            }

            invulnerabilityCheck = newEffects.some(e => e.invulnerable);
          }

          return {
            ...prev,
            cooldowns: { ...prev.cooldowns },
            effects: [...newEffects],
            invulnerable: invulnerabilityCheck ? prev.invulnerable : false,
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

    const startOfTurnSequence = prev => {
      //mana regen
      let newMp = Number;

      if (prev.mp === prev.maxMana) {
        newMp = prev.mp;
      } else {
        newMp = prev.mp + prev.baseManaRegen;

        if (newMp > prev.maxMana) {
          newMp = prev.maxMana;
        }
      }

      //reduce cooldown turns
      let newCooldowns = {
        action1:
          prev.cooldowns.action1 === 0 ||
            prev.cooldowns.action1 === 'available-next-turn'
            ? 0
            : prev.cooldowns.action1 === 1
              ? 'available-next-turn'
              : prev.cooldowns.action1 - 1,
        action2:
          prev.cooldowns.action2 === 0 ||
            prev.cooldowns.action2 === 'available-next-turn'
            ? 0
            : prev.cooldowns.action2 === 1
              ? 'available-next-turn'
              : prev.cooldowns.action2 - 1,
        action3:
          prev.cooldowns.action3 === 0 ||
            prev.cooldowns.action3 === 'available-next-turn'
            ? 0
            : prev.cooldowns.action3 === 1
              ? 'available-next-turn'
              : prev.cooldowns.action3 - 1,
        action4:
          prev.cooldowns.action4 === 0 ||
            prev.cooldowns.action4 === 'available-next-turn'
            ? 0
            : prev.cooldowns.action4 === 1
              ? 'available-next-turn'
              : prev.cooldowns.action4 - 1,
      };

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

      return {
        ...prev,
        mp: newMp,
        cooldowns: newCooldowns,
        effects: prev.effects,
        damageReduceEffect: damageReduceEffectCheck
          ? prev.damageReduceEffect
          : false,
        invulnerable: invulnerabilityCheck ? prev.invulnerable : false,
      };
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

              setReceiver(prev => {
                let damage = action.damage;
                let newShieldAmount = null;

                if (prev.shield) {
                  newShieldAmount = prev.shield;
                  damage = action.damage - Number(prev.shield);

                  if (damage >= 0) {
                    newShieldAmount = 0;
                  } else {
                    damage = 0;
                    newShieldAmount = prev.shield - action.damage;
                  }
                }

                if (prev.damageReduceEffect && action.physical) {
                  damage = Math.floor(
                    action.damage * (1 - prev.damageReduceEffect),
                  );
                }

                if (prev.invulnerable === true) {
                  damage = 0;
                }

                let newHp = prev.hp - Number(damage);

                if (newHp <= 0) {
                  return {
                    ...prev,
                    hp: 0,
                    mp: 0,
                    dead: true,
                  };
                }

                let newEffects = [];
                if (prev.effects.some(e => e.type === 'cc')) {
                  newEffects = prev.effects.filter(e => e.type !== 'cc');
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
                  shield: newShieldAmount
                };
              });
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
                    effects: [...prev.effects]
                  };
                });
                // await wait(200);
              }

              setReceiver(prev => {
                let newHp = prev.hp + Number(action.healing);

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
                  effects: [...prev.effects]
                };
              });
              await wait(1000);

              if (callNextTurnBoolean) {
                endTurnSequence(setAttacker);
                setInSequence(false);
              }
            })();
            break;

          case 'cc':
          case 'stun':
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
                  damageReduceRating: action?.damageReduceRating,
                  invulnerable:
                    action.effect === 'invulnerability' ? true : false,
                };

                let newShieldAmount = action.shieldAmount;
                if (prev.shield) {
                  newShieldAmount += prev.shield;
                }

                return {
                  ...prev,
                  cooldowns: { ...prev.cooldowns },
                  effects: [...prev.effects, newEffect],
                  damageReduceEffect: action?.damageReduceRating,
                  invulnerable:
                    action.effect === 'invulnerability' ? true : false,
                  shield: newShieldAmount,
                };
              });

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

                  setReceiver(prev => {
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

                    return {
                      ...prev,
                      cooldowns: { ...prev.cooldowns },
                      effects: newEffects,
                      shield: newShieldAmount,
                      damageReduceEffect: damageReduceEffectCheck
                        ? prev.damageReduceEffect
                        : false,
                    };
                  });
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

                  setReceiver(prev => {
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

                    return {
                      ...prev,
                      cooldowns: { ...prev.cooldowns },
                      shield: newShieldAmount,
                      effects: newEffects,
                    };
                  });
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
                let damage = action.damage;
                let manaBurned = action.manaburn;

                if (prev.invulnerable === true) {
                  damage = 0;
                  manaBurned = 0;
                }

                let newMp = prev.mp - Number(manaBurned);

                if (newMp < 0) {
                  newMp = 0;
                }

                let newHp = prev.hp - Number(damage);
                if (newHp <= 0) {
                  return {
                    ...prev,
                    hp: 0,
                    mp: 0,
                    dead: true,
                  };
                }

                let newEffects = [];
                if (prev.effects.some(e => e.type === 'cc')) {
                  newEffects = prev.effects.filter(e => e.type !== 'cc');
                } else {
                  newEffects = prev.effects;
                }

                return {
                  ...prev,
                  cooldowns: { ...prev.cooldowns },
                  hp: newHp,
                  mp: newMp,
                  effects: newEffects,
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
                  let newHp = prev.hp + Number(action.healing);

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
                    effects: [...prev.effects]
                  };
                } else {
                  let damage = action.damage;
                  let newShieldAmount = null;

                  if (prev.shield) {
                    newShieldAmount = prev.shield;
                    damage = action.damage - Number(prev.shield);

                    if (damage > 0) {
                      newShieldAmount = 0;
                    } else {
                      damage = 0;
                      newShieldAmount = prev.shield - action.damage;
                    }
                  }

                  if (prev.damageReduceEffect && action.physical) {
                    damage = Math.floor(
                      action.damage * (1 - prev.damageReduceEffect),
                    );
                  }

                  if (prev.invulnerable === true) {
                    damage = 0;
                  }

                  let newHp = prev.hp - Number(damage);

                  if (newHp <= 0) {
                    return {
                      ...prev,
                      hp: 0,
                      mp: 0,
                      dead: true,
                    };
                  }

                  let newEffects = [];
                  if (prev.effects.some(e => e.type === 'cc')) {
                    newEffects = prev.effects.filter(e => e.type !== 'cc');
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
                    shield: newShieldAmount
                  };
                }
              });
              await wait(1000);
            })();

            if (callNextTurnBoolean) {
              endTurnSequence(setAttacker);
              setInSequence(false);
            }
            break;

          case 'skip':
            (async () => {
              setInSequence(true);
              // await wait(200);

              if (callNextTurnBoolean) {
                endTurnSequence(setAttacker);
                setInSequence(false);
              }
            })();
            break;

          case 'turnStartSequence':
            (async () => {
              setInSequence(true);
              // await wait(200);

              setAttacker(prev => startOfTurnSequence(prev));
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