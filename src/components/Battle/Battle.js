import styles from './styles.module.css';

import { CharacterSummary } from 'components';
import { mageFrost, paladinRetri } from 'shared';

export const Battle = () => {
    return <>
        <div className={styles.gameHeader}>
            TEAM 1 VS TEAM 2
        </div>
        <div className={styles.team1}>
            <CharacterSummary character={paladinRetri} />
            <CharacterSummary character={mageFrost} />
            <CharacterSummary character={mageFrost} />
        </div>
        <div className={styles.team2}>
            <CharacterSummary team2 character={mageFrost} />
            <CharacterSummary team2 character={mageFrost} />
            <CharacterSummary team2 character={paladinRetri} />
        </div>
    </>;
};