// SLC121 slice (proposal, AD32; rows are reversible content): a milestone ladder for Sleeping and Patience, one cross-skill edge,
// one locked row and the reading for the inspector. Pure rules, no DOM, no hero, nothing saved.
// SLC112: a ladder perk is derived from the CURRENT (rusted) level on every read, never stored. The deed title is a separate saved
//   grant in character.titles (titles.js). Rust lowers the perk and leaves the title (SLR42); one effect has one authority (SLR43):
//   the ladder adds only effects the native Sleeping milestones do not already pay.
// SLC113: the edge is one row read by both skill panels. SLC116: a locked row exists only where the native skill really grants
//   something at that level, and its content stays sealed by id until the skill's best level reaches it. SLC118: one "why" line per stat.
import {title_by_id} from './titles.js';

export const LADDER_SKILLS = Object.freeze(['Sleeping', 'Patience']);
export const DEED_TITLE = 'sound_sleeper';
// at: level the row needs. flats: {stat: amount}. xp: {target: multiplier}. All numbers are small on purpose and open to change.
export const LADDER = Object.freeze({
    Sleeping: Object.freeze([
        Object.freeze({id: 'sleeping.3', at: 3, name: 'Easy rest', text: 'Rest settles deeper, so you start each day with more in reserve.', flats: Object.freeze({max_stamina: 5})}),
        Object.freeze({id: 'sleeping.5', at: 5, name: 'Sound sleeper', text: 'You sleep through noise and wake clear-headed, with still more in reserve.', flats: Object.freeze({max_stamina: 5})}),
    ]),
    Patience: Object.freeze([
        Object.freeze({id: 'patience.2', at: 2, name: 'Unhurried', text: 'Sitting still stops itching, so quiet focus comes easier.', xp: Object.freeze({Meditation: 1.05})}),
        Object.freeze({id: 'patience.4', at: 4, name: 'Waits it out', text: 'You ride out long stretches without spending yourself.', flats: Object.freeze({max_stamina: 5})}),
    ]),
});
// One owned row per edge (SLC113). It reads the source's level, not its per-tick gains, and nothing feeds back into the source.
export const EDGES = Object.freeze([Object.freeze({id: 'sleeping>patience', from: 'Sleeping', to: 'Patience', per_level: 0.01})]);

const stat_names = {max_stamina: 'max stamina', max_health: 'max health'};
const num = n => Math.round(n * 1000) / 1000;
const pct = m => `${num((m - 1) * 100)}%`;
const levelOf = (levels, id) => levels?.[id] ?? {native: 0, total: 0};

/** {Sleeping:{native, total}, ...} from a levelable component: native is the best level kept, total adds every bonus and rust. */
export function readLevels(lv) {
    const out = {};
    for(const id of LADDER_SKILLS) {
        const native = lv?.skill_progress?.[id]?.current_level || 0;
        const bonus = Object.values(lv?.bonus_skill_levels?.flat || {}).reduce((sum, piece) => sum + (piece?.[id] || 0), 0);
        out[id] = {native, total: Math.max(0, native + bonus)};
    }
    return out;
}

export const edgeSize = (edge, levels) => 1 + edge.per_level * levelOf(levels, edge.from).total;

/** The perks the ladder pays right now: {flats, xp_multipliers}. A pure function of the levels. */
export function ladderEffects(levels) {
    const flats = {}, xp_multipliers = {};
    for(const [skill, rows] of Object.entries(LADDER)) for(const row of rows) {
        if(levelOf(levels, skill).total < row.at) continue;
        for(const [stat, v] of Object.entries(row.flats || {})) flats[stat] = (flats[stat] || 0) + v;
        for(const [target, v] of Object.entries(row.xp || {})) xp_multipliers[target] = (xp_multipliers[target] || 1) * v;
    }
    for(const edge of EDGES) {
        const size = edgeSize(edge, levels);
        if(size !== 1) xp_multipliers[edge.to] = (xp_multipliers[edge.to] || 1) * size;
    }
    return {flats, xp_multipliers};
}

export function describeEffect(row) {
    const parts = [];
    for(const [stat, v] of Object.entries(row.flats || {})) parts.push(`+${num(v)} ${stat_names[stat] || stat}`);
    for(const [target, v] of Object.entries(row.xp || {})) parts.push(`+${pct(v)} ${target} xp`);
    return parts.join(', ');
}

export function edgeText(edge, levels) {
    const source = levelOf(levels, edge.from);
    return `${edge.from} feeds ${edge.to}: +${pct(edgeSize(edge, levels))} ${edge.to} xp (${num(edge.per_level * 100)}% per ${edge.from} level, now ${source.total}).`;
}

// Locked rows come from the native skill: a milestone that unlocks a recipe is a real grant. The content is withheld by id
// until the skill's best level reaches it, so the view of an unreached row carries a level and nothing else.
export function sealedGrants(milestones = {}) {
    return Object.entries(milestones).filter(([, m]) => m?.unlocks?.recipes?.length).map(([at, m]) => ({at: +at, recipes: m.unlocks.recipes.map(r => r.recipe_id)}));
}

/** Rows for one skill's panel: {rows, edges}. Observer-safe: a sealed row shows its level only (AR8, SLC116). */
export function ladderView(skillId, levels, milestones = {}) {
    const here = levelOf(levels, skillId);
    const rows = (LADDER[skillId] || []).map(row => ({
        id: row.id, at: row.at, name: row.name, text: row.text, effect: describeEffect(row),
        state: here.total >= row.at ? 'active' : here.native >= row.at ? 'rusted' : 'later',
    }));
    for(const grant of sealedGrants(milestones)) {
        const id = `${skillId.toLowerCase()}.${grant.at}`;
        rows.push(here.native >= grant.at
            ? {id, at: grant.at, name: 'Unlocked', text: `Opens ${grant.recipes.join(', ')} for crafting.`, effect: '', state: 'open'}
            : {id, at: grant.at, name: '??????', text: '', effect: '', state: 'sealed'});
    }
    rows.sort((a, b) => a.at - b.at);
    return {skill: skillId, level: here, rows, edges: EDGES.filter(e => e.from === skillId || e.to === skillId).map(e => ({id: e.id, from: e.from, to: e.to, text: edgeText(e, levels)}))};
}

/** Player text for a skill's tooltip (UR70-UR72): meaning first, then effect, then the condition. */
export function ladderPanelText(skillId, levels, milestones) {
    const view = ladderView(skillId, levels, milestones);
    if(!view.rows.length && !view.edges.length) return '';
    const lines = [];
    if(view.level.total !== view.level.native) lines.push(`Rust holds ${skillId} at ${view.level.total} (your best is ${view.level.native}); rows above it rest until you practise.`);
    for(const r of view.rows) {
        if(r.state === 'sealed') { lines.push(`${skillId} ${r.at}: ??????`); continue; }
        const status = r.state === 'active' ? 'active' : r.state === 'rusted' ? `resting while ${skillId} is below ${r.at}` : `needs ${skillId} ${r.at}`;
        lines.push(`${skillId} ${r.at}: ${r.name}. ${r.text}${r.effect ? ` ${r.effect}.` : ''} (${status})`);
    }
    for(const e of view.edges) lines.push(e.text);
    return lines.join('\n');
}

const dayOf = at => Math.floor((at || 0) / 1440) + 1;
const statLabel = stat => stat_names[stat] || stat;

/** SLC118: one line answering "why is this stat / xp rate this value" from every ladder row, edge and title behind it. */
export function whyLines(levels, titles = {}) {
    const fx = ladderEffects(levels), lines = [];
    const held = titles?.[DEED_TITLE] ? `${title_by_id[DEED_TITLE].name} (granted day ${dayOf(titles[DEED_TITLE].at)}) recognizes the deed and adds nothing itself.` : `${title_by_id[DEED_TITLE].name} is not yet held.`;
    for(const stat of Object.keys(fx.flats)) {
        const parts = [];
        for(const [skill, rows] of Object.entries(LADDER)) for(const row of rows) {
            if(row.flats?.[stat] && levelOf(levels, skill).total >= row.at) parts.push(`${skill} ${row.at} ${row.name} +${row.flats[stat]}`);
        }
        lines.push(`Ladder gives ${statLabel(stat)} +${fx.flats[stat]}: ${parts.join('; ')}. ${held}`);
    }
    for(const [target, mult] of Object.entries(fx.xp_multipliers)) {
        const parts = [];
        for(const [skill, rows] of Object.entries(LADDER)) for(const row of rows) {
            if(row.xp?.[target] && levelOf(levels, skill).total >= row.at) parts.push(`${skill} ${row.at} ${row.name} x${row.xp[target]}`);
        }
        for(const edge of EDGES) if(edge.to === target && edgeSize(edge, levels) !== 1) parts.push(`${edge.from} ${levelOf(levels, edge.from).total} feeds ${target} x${num(edgeSize(edge, levels))}`);
        lines.push(`Ladder gives ${target} xp x${num(mult)}: ${parts.join('; ')}.`);
    }
    if(!lines.length) lines.push(`The ladder adds nothing yet. ${held}`);
    return lines;
}

/** Deed counter for the title: the best level kept, never the rusted one. */
export const titleCounters = levels => ({sleeping_level: levelOf(levels, 'Sleeping').native});
