// Fang Yuan's record of each wolf tide (D5 follow-up, lead core-flow audit handover 2026-11-16; proposal under AD32, AD56). The academy
// reads how the wall stands (ri_lead_day_tide.js); this adds what he did there: patrols reported and merit credited at the board, this
// tide and the last ones. The counts are the engine's own completion counts (actors.player.completed, one authority); this domain keeps
// only where each tide's count started and the closed tides, settled in the stage hook every expansion write passes (AR1, AR3).
// Merit is priced from the board's dials (an eye and a tally each pay their dial), so a later dial change re-prices past tides too.
// A tide first seen part-way through (an old save) counts from that write on; nothing before it is guessed.
// Save slice `ri_tide_ledger` = {schema: 1, open: {start, year, base: {patrols, eyes, tallies}} | null, past: [{start, year, patrols, merit}]}.
import {registerDomain} from './domain_registry.js';
import {registerPlaceDescription} from './place_descriptions.js';
import {RI_LEAD_DAY, RI_DAY_DIALS} from './ri_lead_day_facts.js';
import {riWolfTidePhase} from './ri_wolf_tide.js';

const WORLD = 'book.ri.lead.world', ACADEMY = 'book.ri.lead.academy';
// Dial: how many closed tides the ledger keeps (a year each); the readout uses the latest.
export const RI_TIDE_LEDGER_KEEP = 5;
const CMD = {patrols: `${RI_LEAD_DAY}.report`, eyes: `${RI_LEAD_DAY}.hand_in_eye`, tallies: `${RI_LEAD_DAY}.hand_in_tally`};
export const riTideCounts = state => Object.fromEntries(Object.entries(CMD).map(([k, id]) => {
    const n = state?.actors?.player?.completed?.[id]; return [k, Number.isSafeInteger(n) && n > 0 ? n : 0]; }));
const merit = c => c.eyes * RI_DAY_DIALS.eyeMerit.merit + c.tallies * RI_DAY_DIALS.tallyMerit.merit;
const since = (now, base) => ({patrols: now.patrols - base.patrols, eyes: now.eyes - base.eyes, tallies: now.tallies - base.tallies});
const fresh = () => ({open: null, past: []});
let ledger = fresh();

// Pure step, exported for tests: the ledger after a write at `state`.
export function settleTideLedger(prev, state) {
    if(state?.actors?.player?.worldId !== WORLD) return prev;
    let phase; try { phase = riWolfTidePhase(state); } catch { return prev; }
    if(!phase.dated) return prev;
    const now = riTideCounts(state);
    let {open, past} = prev;
    const close = () => { const d = since(now, open.base); past = [...past, {start: open.start, year: open.year, patrols: d.patrols, merit: merit(d)}].slice(-RI_TIDE_LEDGER_KEEP); open = null; };
    if(open && (!phase.active || phase.startDay !== open.start)) close();
    if(phase.active && !open) open = {start: phase.startDay, year: phase.year, base: now};
    return open === prev.open && past === prev.past ? prev : {open, past};
}
// {thisTide: {patrols, merit} | null, lastTide: {patrols, merit, year} | null} for the readout.
export function riTideLedgerView(state, l = ledger) {
    const view = settleTideLedger(l, state), now = riTideCounts(state);
    const d = view.open ? since(now, view.open.base) : null;
    return {thisTide: d ? {patrols: d.patrols, merit: merit(d)} : null, lastTide: view.past.at(-1) ?? null};
}
const patrolWords = n => n === 1 ? 'one patrol' : `${n} patrols`;
export function riTideLedgerLine(state, l = ledger) {
    if(state?.actors?.player?.worldId !== WORLD) return '';
    const v = riTideLedgerView(state, l);
    if(v.thisTide) return v.thisTide.patrols || v.thisTide.merit
        ? `This tide you have reported ${patrolWords(v.thisTide.patrols)} and the board has credited you ${v.thisTide.merit} merit.`
        : 'You have not reported a patrol this tide yet.';
    return v.lastTide ? `Last tide you reported ${patrolWords(v.lastTide.patrols)} and earned ${v.lastTide.merit} merit at the board.` : '';
}
registerPlaceDescription(ACADEMY, state => riTideLedgerLine(state));

const valid = s => s?.schema === 1 && Array.isArray(s.past) && (s.open === null || (Number.isSafeInteger(s.open?.start) && s.open?.base && typeof s.open.base === 'object'));
registerDomain({id: 'ri_tide_ledger', initialState: () => null,
    save: () => !ledger.open && !ledger.past.length ? undefined : {schema: 1, open: ledger.open, past: ledger.past},
    load: slice => { ledger = valid(slice) ? {open: slice.open, past: slice.past.slice(-RI_TIDE_LEDGER_KEEP)} : fresh(); },
    stage: plan => { try { ledger = settleTideLedger(ledger, plan?.state); } catch { /* an unreadable state keeps the ledger as it was */ } }});
