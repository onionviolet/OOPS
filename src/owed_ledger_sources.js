// Host reader for Ledger → Owed (LTU6). Reads only published projections and ports, never a domain's closure, and writes nothing:
// the economy_standing projection (loans, claims, the verge grudge), the household projection and the Village career port.
import {domainRegistry} from './domain_registry.js';
import {readPort} from './ui_ports.js';
import {fromHousehold, fromVillageCareer, obligation} from './obligations_ledger.js';
import {grudgeNow} from './craft_grudge.js';
import {gatherOwed} from './owed_ledger_view.js';

// A kit still out on loan is a duty with a date in words, not coins yet (village_career.js turns an unreturned kit into debt).
export function careerRows(career) {
    const rows = fromVillageCareer(career ?? {});
    if(career?.loan?.status === 'return_due') rows.push(obligation({id: 'career:kitReturn', kind: 'duty', debtor: 'player', creditor: 'village_watch',
        amount: 1, why: 'The patrol kit is lent for the shift and is due back at the watch post', source: 'village_career', carries: false}));
    return rows;
}

export function readOwedLedger() {
    const standing = domainRegistry.project('economy_standing') ?? null;
    const home = domainRegistry.project('household_fortunes')?.household;
    // The projection lists the household ledger newest first; the adapter reads the newest note from the end.
    const fortunes = [...fromHousehold(home ? {resentment: home.resentment, ledger: [...(home.ledger ?? [])].reverse()} : {}), ...careerRows(readPort('villageCareer'))];
    const grudge = standing?.state?.ledger ? grudgeNow(standing.state.ledger, standing.now) : null;
    return gatherOwed({standing, fortunes, grudge});
}
