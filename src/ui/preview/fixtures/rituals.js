// RPX1/RPX2 gallery fixtures: invented bench details run through the same adapter the place panel uses, so the gallery
// proves the game's path, not a hand-drawn copy. Invented names only (CLR3).
import {riteCircleSpec, makingSpec, riskLedger} from '../../rite_figure.js';
import {FIGURE_FIXTURES} from '../figure_fixtures.js';

const rite = (grade, odds, conditions) => ({label: 'Rite of the Still Bell', grade, odds, recoveryDays: 7, conditions});
const bell = {id: 'bell_5', name: 'Bell Warden', seq: 5, pathway: 'Bell', status: 'brewable', minutes: 1440, via: null, ritual: {needed: true, scale: 'solitary', text: 'drink under a silent bell'}};
const mats = (a, b) => [{id: 'main', role: 'main material', name: 'Hush moth wing', need: 1, held: a}, {id: 'aux', role: 'supplementary', name: 'Cold well water', need: 1, held: b}];
const met = (id, label, via) => ({id, label, status: 'met', fit: 1, loss: 0, via});

// Mid-way: formula held, one material short, one condition met, one by a stand-in, one still missing.
export const BENCH_PREPARING = {...bell, formulaKnown: true, brewing: false, ready: false, left: 0, doses: 0, slots: mats(1, 0),
    rite: rite('partial', 62, [
        met('bell', 'Under a silent bell', 'you hold a cracked bell'),
        {id: 'hour', label: 'Before the first bird', status: 'substituted', fit: .5, loss: .5, via: 'a shuttered room by day'},
        {id: 'breath', label: 'Holding one breath', status: 'absent', fit: 0, loss: 1, wanted: 'you practised the long breath today'}])};
// Brewing: materials in the pot, the brew step live, the rite fully met.
export const BENCH_BREWING = {...bell, id: 'bell_5_brewing', formulaKnown: true, brewing: true, ready: false, left: 135, doses: 0, slots: mats(1, 1),
    rite: rite('met', 5, [met('bell', 'Under a silent bell', 'you hold a cracked bell'), met('hour', 'Before the first bird', 'the small hours'),
        met('breath', 'Holding one breath', 'you practised the long breath today')])};

// Round 2 alternative form (item 18): the same conditions as a strip with the ledger's shares in the labels, for comparison
// with the circle. Conditions are unordered, so a strip implies a sequence that is not there; the circle stays the default.
const strip = d => {
    const ledger = riskLedger(d), state = {met: 'done', substituted: 'strained', absent: 'empty'};
    return {id: `${d.id}-strip`, size: 520, title: `${d.rite.label} (alternative: strip)`, summary: ledger.headline,
        tracks: [{id: 'conditions', label: 'Conditions', progress: `${ledger.rows.filter(r => state[r.status] === 'done').length} of ${ledger.rows.length} met`, steps: ledger.rows.map(r => ({label: `${r.label} · ${r.share}%`, state: state[r.status]}))}],
        notes: [{text: ledger.advice}]};
};

export const RITUAL_FIXTURES = [riteCircleSpec(BENCH_PREPARING), makingSpec(BENCH_PREPARING), strip(BENCH_PREPARING), riteCircleSpec(BENCH_BREWING), makingSpec(BENCH_BREWING)];
FIGURE_FIXTURES.push(...RITUAL_FIXTURES);
