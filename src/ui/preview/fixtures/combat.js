// RPX16 / LTU7 combat fixtures. Invented names only. Each runs the same adapter the game runs
// (src/ui/combat_situation.js) on a board in the projection shape, so the gallery proves the game's path.
import {fightSituation, chaseSituation} from '../../combat_situation.js';
import {FIGURE_FIXTURES} from '../figure_fixtures.js';

const fact = (label, value, knowledge = 'native') => ({label, value, knowledge});
const opp = (slot, name, hp, max, facts, extra = {}) => ({id: `fx-${slot}`, slot, letter: String.fromCharCode(65 + slot), name, knowledge: 'native', defeated: hp === 0,
    health: {text: `${hp}/${max} hp`, progress: 100 * hp / max, knowledge: 'native'}, cycle: null, facts, ...extra});
const you = (current, extra = {}) => ({name: 'You', health: {current, max: 40}, speed: 0.8, defense: 2, minDamageShare: .05, damageTaken: 1, sideSize: 1, ...extra});

// A duel: one opponent, chances shown in words, and a lethal blow telegraphed.
export const DUEL_BOARD = {source: 'fixture', opponents: [opp(0, 'Ditch reaver', 22, 30, [
    fact('Attack', '9 dmg x2'), fact('Speed', '1.3 /s'), fact('Hit you', '71%'), fact('Evade you', '18%'), fact('Defense', '1'), fact('You hit them', '82%')])]};
export const DUEL_FIXTURE = {...fightSituation(DUEL_BOARD, you(14), {place: 'Reed causeway'}).spec, id: 'fight-duel', title: 'Duel at the causeway'};

// Several opponents: ratings, not chances; one not yet assessed; one down; lethal together.
export const BRAWL_BOARD = {source: 'fixture', opponents: [
    opp(0, 'Mire hound', 0, 12, [fact('Attack', '4 dmg'), fact('Speed', '1.1 /s'), fact('Attack rating', '20'), fact('Evasion rating', '14'), fact('Defense', '0')]),
    opp(1, 'Mire hound', 9, 12, [fact('Attack', '4 dmg'), fact('Speed', '1.1 /s'), fact('Attack rating', '20'), fact('Evasion rating', '14'), fact('Defense', '0')]),
    opp(2, 'Mire hound', 12, 12, [fact('Attack', '4 dmg'), fact('Speed', '1.1 /s'), fact('Attack rating', '20'), fact('Evasion rating', '14'), fact('Defense', '0')]),
    {...opp(3, 'Hooded drover', 0, 1, [fact('Attack', null, 'unknown'), fact('Speed', null, 'unknown')]), defeated: false, knowledge: 'unknown', health: {text: '', progress: null, knowledge: 'unknown'}},
]};
export const BRAWL_FIXTURE = {...fightSituation(BRAWL_BOARD, you(5), {place: 'Sunken lane'}).spec, id: 'fight-brawl', title: 'Brawl in the sunken lane'};

// A chase as stages: the pursuit model has no distance yet.
export const CHASE_VIEW = {definitionId: 'fixture.tollman', label: 'The tollman follows', status: 'contact', text: 'Someone asks to meet you at the old weighbridge.', expiresAt: 610};
export const CHASE_FIXTURE = chaseSituation(CHASE_VIEW);

export const COMBAT_FIXTURES = [DUEL_FIXTURE, BRAWL_FIXTURE, CHASE_FIXTURE];
FIGURE_FIXTURES.push(...COMBAT_FIXTURES);
