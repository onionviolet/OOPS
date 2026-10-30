// RPX1/RPX2 gallery fixtures: invented bench details run through the same adapter the place panel uses, so the gallery
// proves the game's path, not a hand-drawn copy. Invented names only (CLR3).
import {riteFigureSpec} from '../../rite_figure.js';
import {FIGURE_FIXTURES} from '../figure_fixtures.js';

const rite = (grade, odds, conditions) => ({label: 'Rite of the Still Bell', grade, odds, recoveryDays: 7, conditions});
const bell = {id: 'bell_5', name: 'Bell Warden', seq: 5, pathway: 'Bell', status: 'brewable', minutes: 120, via: null, ritual: {needed: true, scale: 'solitary', text: 'drink under a silent bell'}};
const mats = (a, b) => [{id: 'main', role: 'main material', name: 'Hush moth wing', need: 1, held: a}, {id: 'aux', role: 'supplementary', name: 'Cold well water', need: 1, held: b}];

// Mid-way: formula held, one material short, one condition met, one by a stand-in, one still absent.
export const RITE_PREPARING = riteFigureSpec({...bell, formulaKnown: true, brewing: false, ready: false, left: 0, doses: 0, slots: mats(1, 0),
    rite: rite('partial', 62, [
        {id: 'bell', label: 'Under a silent bell', status: 'met', fit: 1, via: 'you hold a cracked bell'},
        {id: 'hour', label: 'Before the first bird', status: 'substituted', fit: .5, via: 'a shuttered room by day'},
        {id: 'breath', label: 'Holding one breath', status: 'absent', fit: 0, wanted: 'you practised the long breath today'}])});
// Brewing: materials in the pot, the brew step live, the rite fully met.
export const RITE_BREWING = riteFigureSpec({...bell, id: 'bell_5_brewing', formulaKnown: true, brewing: true, ready: false, left: 45, doses: 0, slots: mats(0, 0).map(s => ({...s, held: 1})),
    rite: rite('met', 5, [
        {id: 'bell', label: 'Under a silent bell', status: 'met', fit: 1, via: 'you hold a cracked bell'},
        {id: 'hour', label: 'Before the first bird', status: 'met', fit: 1, via: 'the small hours'},
        {id: 'breath', label: 'Holding one breath', status: 'met', fit: 1, via: 'you practised the long breath today'}])});

export const RITUAL_FIXTURES = [RITE_PREPARING, RITE_BREWING];
FIGURE_FIXTURES.push(...RITUAL_FIXTURES);
