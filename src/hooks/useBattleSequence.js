import { wait } from 'shared';

import { useEffect, useState } from 'react';

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
    dead: false,
    cooldowns: { action1: 0, action2: 0, action3: 0 },
    effects: [],
  });
  const [char2team1state, setChar2team1state] = useState({
    char: char2team1,
    hp: char2team1.maxHealth,
    mp: char2team1.maxMana,
    maxHealth: char2team1.maxHealth,
    maxMana: char2team1.maxMana,
    dead: false,
    cooldowns: { action1: 0, action2: 0, action3: 0 },
    effects: [],
  });
  const [char3team1state, setChar3team1state] = useState({
    char: char3team1,
    hp: char3team1.maxHealth,
    mp: char3team1.maxMana,
    maxHealth: char3team1.maxHealth,
    maxMana: char3team1.maxMana,
    dead: false,
    cooldowns: { action1: 0, action2: 0, action3: 0 },
    effects: [],
  });
  const [char1team2state, setChar1team2state] = useState({
    char: char1team2,
    hp: char1team2.maxHealth,
    mp: char1team2.maxMana,
    maxHealth: char1team2.maxHealth,
    maxMana: char1team2.maxMana,
    dead: false,
    cooldowns: { action1: 0, action2: 0, action3: 0 },
    effects: [],
  });
  const [char2team2state, setChar2team2state] = useState({
    char: char2team2,
    hp: char2team2.maxHealth,
    mp: char2team2.maxMana,
    maxHealth: char2team2.maxHealth,
    maxMana: char2team2.maxMana,
    dead: false,
    cooldowns: { action1: 0, action2: 0, action3: 0 },
    effects: [],
  });
  const [char3team2state, setChar3team2state] = useState({
    char: char3team2,
    hp: char3team2.maxHealth,
    mp: char3team2.maxMana,
    maxHealth: char3team2.maxHealth,
    maxMana: char3team2.maxMana,
    dead: false,
    cooldowns: { action1: 0, action2: 0, action3: 0 },
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

    const nextTurn = () => {
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

    const executeAction = callNextTurnBoolean => {
      // dead activator
      if (attackerString === 'dead') {
        return (async () => {
          setInSequence(true);
          // await wait(200);

          nextTurn();

          setInSequence(false);
        })();
      }

      if (action) {
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
                  };
                });
                // await wait(200);
              }

              setReceiver(prev => {
                let newHp = prev.hp - Number(action.damage);

                if (newHp <= 0) {
                  return {
                    ...prev,
                    hp: 0,
                    dead: true,
                  };
                }

                return {
                  ...prev,
                  cooldowns: { ...prev.cooldowns },
                  hp: newHp,
                };
              });
              await wait(1000);

              if (callNextTurnBoolean) {
                nextTurn();
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
                };
              });
              await wait(1000);

              if (callNextTurnBoolean) {
                nextTurn();
                setInSequence(false);
              }
            })();
            break;

          case 'cc':
            break;

          case 'stun':
            break;

          case 'buff':
            break;

          case 'reduceCooldowns':
            (async () => {
              setInSequence(true);
              // await wait(200);

              setAttacker(prev => {
                return {
                  ...prev,
                  cooldowns: {
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
                  },
                };
              });

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

    if (typeof receivers === 'string') {
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
      action.type = 'damageAndHeal'; //reset to original action.type to prevent bugs on next usage of the same ability
    } else if (!receivers) {
      if (attackerString === 'dead') {
        // on dead
        executeAction(true);
      } else if (attackerString === 'stun' || attackerString === 'cc') {
        // on stun
        executeAction(true);
      } else {
        executeAction(false);
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
