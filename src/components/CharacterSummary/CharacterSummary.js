import { CharActions, EffectsList, Bar } from 'components';
import { memo } from 'react';
import styles from './styles.module.css';

const red = '#ba2e25';
const blue = '#1953cb';

export const CharacterSummaryWithoutMemo = ({
  team2 = false,
  character,
  characterString,
  hp,
  mp,
  turn,
  charTurn,
  onAction,
  dead,
  cooldowns,
  effects,
  characterNamesObject,
  shield,
  petTarget,
  actionDisabled,
  comboPoints
}) => {
  const {
    charClass,
    spec,
    img,
    specImg,
    maxHealth,
    maxMana,
    action1,
    action2,
    action3,
    action4,
    sendPet
  } = character;

  const comboPointsVisibility = comboPoints > 0;

  return (
    <div className={!dead ? styles.wrapper : styles.disabled}>
      <EffectsList
        effects={effects}
        backgroundColor={team2 ? red : blue}
      />

      <div
        style={{ backgroundColor: team2 ? red : blue }}
        className={styles.main}
      >

        {shield > 0 && <div className={styles.shieldBar}><Bar label="shield" value={shield} color={"#DCDCDC"} hideSlash={true} /></div>}

        <div className={styles.imgWrapper}>
          <div className={styles.comboPoints} style={{ visibility: comboPointsVisibility ? "visible" : "hidden" }}>
            <div className={styles.comboText}>
              Combo Points: {comboPoints}
            </div>
          </div>

          <img className={styles.img} src={img} alt={charClass} />
        </div>
        <div className={styles.charParameters}>
          <div className={styles.info}>
            <div className={styles.spec}>
              <img className={styles.specImg} src={specImg} alt={spec} />
            </div>
            <div
              className={styles.charClassSpecText}
            >{`${spec} ${charClass}`}</div>
          </div>

          <Bar label="HP" value={hp} maxValue={maxHealth} color={red} />
          <Bar label="MP" value={mp} maxValue={maxMana} color={blue} />
        </div>
      </div>
      <div className={styles.actions}>
        {charTurn === turn && !dead && !actionDisabled && (
          <CharActions
            backgroundColor={team2 ? red : blue}
            action1={action1}
            action2={action2}
            action3={action3}
            action4={action4}
            sendPet={sendPet}
            onAction={onAction}
            petTarget={petTarget}
            characterString={characterString}
            hp={hp}
            mp={mp}
            cooldowns={cooldowns}
            effects={effects}
            characterNamesObject={characterNamesObject}
            charClass={charClass}
          />
        )}
      </div>
    </div>
  );
};

export const CharacterSummary = memo(CharacterSummaryWithoutMemo);