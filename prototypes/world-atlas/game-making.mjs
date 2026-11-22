// Which book workings reached the game. Game rows cite reader rule ids (`sourceIds`); a row the host compiles into a
// command is playable, a row that only sits in a source table is recorded. Playable makers that cite nothing get one
// atlas-authored link below, named as such, so the map never passes a guess off as a citation.
//   node prototypes/world-atlas/game-making.mjs
import {LOTM_ACT_ROWS, defineActs} from '../../src/book_world_lotm_acts_host.js';
import {LOTM_POTION_RULES} from '../../src/lotm_potion_rule_rows.js';
import {LOTM_SUMMONS_ROWS} from '../../src/lotm_summons_rows.js';
import {amuletTrialCommands} from '../../src/lotm_amulet_crafting.js';
import {hpLeadMakingCommands} from '../../src/hp_lead_making.js';

// Playable makers with no sourceIds of their own. `cites` is the atlas's reading, not the row's.
const ATLAS_LINKS = [
    {world: 'lotm', id: 'lotm.seer-brew', label: 'Brew the Seer potion (lotm_seer_brew.js)', file: 'src/lotm_seer_brew.js', cites: ['lotm.potion.seer', 'lotm.potion.seer-sequence']},
    {world: 'hp', id: 'hp.lead.cure-boils', label: 'Brew the Cure for Boils (hp_lead_making.js)', file: 'src/hp_lead_making.js', cites: ['hp.potion.boil-cure'], probe: () => hpLeadMakingCommands.length},
    {world: 'lotm', id: 'lotm.amulet-trial', label: 'Engrave the silver amulet (lotm_amulet_crafting.js)', file: 'src/lotm_amulet_crafting.js', cites: [], probe: () => amuletTrialCommands('atlas').length},
];

export function gameMaking() {
    const bound = new Set(defineActs().commands.map(c => c.lotmAct.rowId));
    const rows = [
        ...LOTM_ACT_ROWS.map(r => ({world: 'lotm', id: r.id, label: r.label, table: 'LOTM rite, craft and aid rows', cites: r.sourceIds || [], playable: bound.has(r.id), how: 'cited'})),
        ...LOTM_POTION_RULES.rows.map(r => ({world: 'lotm', id: r.id, label: r.label, table: 'LOTM potion rules', cites: r.sourceIds || [], playable: false, how: 'cited'})),
        ...LOTM_SUMMONS_ROWS.rows.map(r => ({world: 'lotm', id: r.id, label: r.label, table: 'LOTM summons', cites: r.sourceIds || [], playable: false, how: 'cited'})),
        ...ATLAS_LINKS.map(({probe, ...l}) => ({...l, table: 'Playable maker', playable: probe ? probe() > 0 : true, how: 'atlas link'})),
    ];
    // Per world: rule id -> the game rows citing it, best state first.
    const byWorld = {};
    for (const r of rows) {
        const w = byWorld[r.world] ??= {rows: 0, playable: 0, byRule: {}};
        w.rows++; if (r.playable) w.playable++;
        for (const id of r.cites) (w.byRule[id] ??= []).push({row: r.id, label: r.label, playable: r.playable, how: r.how, table: r.table});
    }
    return {rows, worlds: byWorld};
}

// A reader working's game state: playable beats recorded beats absent.
export const ruleState = links => !links?.length ? 'absent' : links.some(l => l.playable) ? 'playable' : 'recorded';

if (import.meta.main) process.stdout.write(JSON.stringify(gameMaking()));
