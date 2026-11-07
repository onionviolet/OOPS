// Lane E: LOTM livelihood source (civil clerk wage), registered with the LOTM actions, not by the neutral digest.
import {registerLivelihoodSource} from './livelihoods.js';
import {LOTM_PROFILES, weeksOwed} from './book_world_lotm_lives.js';
// Lord of the Mysteries, civil clerk life: the weekly staff wage (book_world_lotm_lives.weeksOwed owns the weeks).
registerLivelihoodSource('book.lotm', state => {
    const civil = LOTM_PROFILES.civil;
    if (state?.lotm?.entryProfile !== civil.id) return [];
    const signed = !!state.simulation?.knowledge?.player?.['book.lotm.contract'], owed = signed ? weeksOwed(state) : 0;
    return [{id: 'lotm.civil_staff_wage', kind: 'wage job', label: 'Civil staff post', stage: signed ? 'running' : 'idea',
        detail: signed ? (owed > 0 ? `${owed} week${owed === 1 ? '' : 's'} of pay uncollected` : 'pay collected') : 'contract not signed',
        income: signed ? {amount: civil.contract.weeklyPence, unit: 'pence', per: 'a week', text: `${civil.contract.weeklyPence / 240} pounds`} : null,
        runBy: 'self',
        obligations: {kind: 'wage-terms', pointer: null, why: `Bound by a ${civil.contract.termYears}-year term and secrecy.`}, authority: {known: true, who: 'the Nighthawk office'}}];
});
