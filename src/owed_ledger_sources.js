// Host reader for Ledger → Owed (LTU6). Reads only published projections and ports, never a domain's closure, and writes nothing:
// the economy_standing projection (loans, claims, the verge grudge), the household projection and the Village career port.
import {homePurchaseRows} from './home_purchase.js';
import {domainRegistry} from './domain_registry.js';
import {readPort} from './ui_ports.js';
import {fromHousehold, fromVillageCareer, obligation} from './obligations_ledger.js';
import {grudgeNow} from './craft_grudge.js';
import {gatherOwed} from './owed_ledger_view.js';
import {DIALS, TIERS, DEEDS} from './economy_standing.js';
import {fineQuotes} from './heat.js';

const TERMS = Object.freeze({tiers: TIERS.map(t => t.label), cuts: DIALS.tierCuts.value, grace: DIALS.graceDays.value, ratchet: DIALS.ratchet.value,
    defaulted: -DEEDS.defaulted.amount, paid: DEEDS.paid_debt.amount});

// AT10: recurring duties (the weekly claim, rent) are one more source line: the duties projection's rows, derived and never stored here.
// A kit still out on loan is a duty with a date in words, not coins yet (village_career.js turns an unreturned kit into debt).
export function careerRows(career) {
    const rows = fromVillageCareer(career ?? {});
    if(career?.loan?.status === 'return_due') rows.push(obligation({id: 'career:kitReturn', kind: 'duty', debtor: 'player', creditor: 'village_watch',
        amount: 1, why: 'The patrol kit is lent for the shift and is due back at the watch post', source: 'village_career', carries: false}));
    return rows;
}

// Settle one row through the owning domain's own command, the one Standing's Repay button calls. Returns coins paid.
export function settleOwed(settle) {
    const command = domainRegistry.command(settle?.domain ?? 'economy_standing', settle?.command);
    if(typeof command !== 'function') throw Error('That account cannot be settled here.');
    return command(settle.factionId, settle.owed);
}

export function readOwedLedger() {
    const standing = domainRegistry.project('economy_standing') ?? null;
    const home = domainRegistry.project('household_fortunes')?.household;
    const residences=domainRegistry.project('homes');
    // The projection lists the household ledger newest first; the adapter reads the newest note from the end.
    const fortunes = [...homePurchaseRows(residences?.state,{clock:residences?.context?.clock,displayClock:standing?.now??0}), ...fromHousehold(home ? {resentment: home.resentment, ledger: [...(home.ledger ?? [])].reverse()} : {}), ...careerRows(readPort('villageCareer')), ...(domainRegistry.project('duties')?.rows ?? [])];
    const grudge = standing?.state?.ledger ? grudgeNow(standing.state.ledger, standing.now) : null;
    // OB2: fines levied by an authority are one more source; the heat domain owns the record, this only lists it with its Settle quote.
    const fines = fineQuotes(), owed = gatherOwed({standing, fortunes: [...fortunes, ...fines.rows], grudge, terms: TERMS});
    Object.assign(owed.live, fines.live);
    for(const r of fortunes)if(r.source==='homes')owed.labels[r.creditor]=r.creditorLabel;
    for(const h of Object.values(residences?.state?.properties||{}))if(h.purchase?.balance>0){const left=h.purchase.due-(residences.context?.clock||0);owed.live[`home:${h.id}`]={amount:h.purchase.balance,due:{daysLeft:Math.ceil(left/1440),overdue:left<0}};}
    return owed;
}
