// Lord of the Mysteries world pack for the spell grammar (chat S, OS7): divination
// rows and Beyonder abilities as rows of the same parts. Reads the existing
// source-pinned rows (lotm_divination_rows.js, zh chapter locators) without
// changing them. Rite stages (prepare, rite, attempt, interpret) are the execution
// form; ritual condition grading (ritual_conditions.js) is the combination layer
// (SG9). The advancement rites (Priest of Light, Dreamwalker) are crossings that
// chat R owns; S supplies their condition grading, not their outcome.
import {LOTM_DIVINATION_ROWS} from './lotm_divination_rows.js';

// Location searches read a position; the rest ask a question and read an answer.
const SEARCH = new Set(['lotm.div.cane-dowsing', 'lotm.div.altar-search-divination']);
// Authored truth (verb object target time), from each row's question and locator.
const truth = text => { const [verb, object, target, time] = text.split(' '); return Object.freeze({verb, object, target, time, direction: null}); };

export const LOTM_SPELL_WORLD = Object.freeze({world: 'lotm', carrier: 'ritual', cost: 'spirituality', access: 'taught'});

export function lotmDivinationSpellRows(rows = LOTM_DIVINATION_ROWS.queries) {
    return rows.map(q => Object.freeze({id: q.id, family: 'divination', forms: [q.method], roots: [],
        intent: SEARCH.has(q.id) ? 'guide' : 'divine', target: SEARCH.has(q.id) ? 'creature' : 'self', execution: 'rite',
        delivery: q.steps.some(s => s.kind === 'rite') ? 'recitation' : 'statement', gesture: 'unrecorded', locator: q.locator,
        stages: q.steps.map(s => s.kind),
        truth: SEARCH.has(q.id) ? truth('sense position creature timed') : truth('sense answer self timed')}));
}

// Beyonder abilities from lotm_be_spells.js (Seer pathway).
export const LOTM_ABILITY_ROWS = Object.freeze([
    Object.freeze({id: 'lotm.be.spirit_vision', family: 'seer', forms: ['Spirit Vision'], roots: [], intent: 'sense_magic', target: 'self',
        execution: 'sustained', delivery: 'will', gesture: 'unrecorded', carrier: 'ability', cost: 'spirituality', access: 'sequence',
        locator: 'LOTM ch 2 (Seer Sequence 9)', truth: truth('sense magic self sustained')}),
]);
