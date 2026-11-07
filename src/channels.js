// One vocabulary of channels shared by skills and abilities (FD18 + lane G G-K). World-neutral leaf: a channel says what kind of thing a row
// does and which existing seam owns it; it adds no mechanism, and a row keeps its own world's nouns (AD46). Channels project onto the
// structured-ability `functions` vocabulary (function -> effect types), so a channel is valid only if those pairs exist there.
// A channel with no owner seam says so (status 'unbuilt', no pairs) instead of implying it is data (ABR22).
import {SKILL_CHANNELS, LOTM_ABILITY_CHANNELS, HP_SPELL_CHANNELS} from './channel_map.js';

const entry = (id, label, plain, seam, projects, kinds, status = 'built') => Object.freeze({id, label, plain, seam, projects: Object.freeze(projects.map(p => Object.freeze(p))), kinds: Object.freeze(kinds), status});
const S = ['skill'], A = ['ability'], B = ['skill', 'ability'];

export const CHANNELS = Object.freeze([
    entry('perceive', 'Perceive the hidden', 'It lets you notice what is hidden from ordinary senses.', 'look/seenBy (ABR19), Perception skill', [{fn: 'perception', effects: ['observation', 'knowledge']}], B),
    entry('read_text', 'Read and decode', 'It helps you read text and languages you could not otherwise follow.', 'Literacy skill, language coverage', [{fn: 'perception', effects: ['knowledge']}], S),
    entry('inquire', 'Find out a fact', 'It tells you a fact you can then use, by a quick or a slow method.', 'people_knowledge, claim_runtime, inquiry record', [{fn: 'perception', effects: ['knowledge']}], B),
    entry('read_people', 'Read people', 'It lets you read a person: motive, mood, what they leave unsaid.', 'subtext (K31), FD10', [{fn: 'perception', effects: ['knowledge']}, {fn: 'support', effects: ['relationship']}], B, 'proposal'),
    entry('sway', 'Sway people', 'It helps you bargain, persuade or press someone.', 'trade Haggling, conflict_frame', [{fn: 'support', effects: ['relationship']}], S),
    entry('conceal', 'Conceal', 'It helps you keep a face, a secret or yourself from being read.', 'look/seenBy (ABR19), contest vs Perceive', [{fn: 'physical', effects: ['condition']}, {fn: 'support', effects: ['condition']}], B, 'proposal'),
    entry('make', 'Make and appraise', 'It helps you craft, repair and judge what a thing is.', 'craft engine, item_card', [{fn: 'craft', effects: ['item', 'construct']}], S),
    entry('heal', 'Heal', 'It helps you treat a body or nurse a person.', 'craft_body_treatment, home_medicine', [{fn: 'support', effects: ['vital', 'condition', 'body']}], S),
    entry('travel', 'Travel and find the way', 'It helps you cross ground, find a route and keep going.', 'frontier trail, route legs', [{fn: 'physical', effects: ['relocate', 'condition']}], S),
    entry('impose_condition', 'Change a body or condition', 'It changes your body or your condition for a while, and costs you for it.', 'simulation condition effect, harm_state', [{fn: 'physical', effects: ['condition', 'body']}, {fn: 'support', effects: ['condition', 'body']}], A),
    entry('shift_odds', 'Shift the odds', 'It tilts how likely an attempt is to work.', 'hitModifier family, notch delta, check modifiers', [{fn: 'support', effects: ['condition']}], A, 'proposal'),
    entry('act_first', 'Act first or interrupt', 'It gets you moving before the other side or cuts in on them.', 'tempo ready offsets', [{fn: 'support', effects: ['condition']}], A, 'proposal'),
    entry('change_situation', 'Change the situation', 'It changes the place around you: light, cover, range or noise.', 'conflict frame situation', [{fn: 'physical', effects: ['condition']}], A, 'proposal'),
    entry('alter_stock', 'Alter stock', 'It changes what you carry or have ready.', 'ready_stock effects', [{fn: 'physical', effects: ['item']}, {fn: 'craft', effects: ['item', 'transfer']}], A, 'proposal'),
    entry('change_event', 'Change an event', 'It nudges what happens next in the world.', 'event director (FD16, unbuilt)', [], A, 'unbuilt'),
    entry('bend_time', 'Bend time or save', 'It rewinds or saves a moment at a price.', 'cheat domain (ABR16)', [{fn: 'physical', effects: ['relocate']}], A, 'proposal')
]);

export const CHANNEL_IDS = Object.freeze(CHANNELS.map(c => c.id));
const byId = new Map(CHANNELS.map(c => [c.id, c]));
export const channel = id => byId.get(id) ?? null;

const TABLE = {...SKILL_CHANNELS, ...LOTM_ABILITY_CHANNELS, ...HP_SPELL_CHANNELS};
const keyOf = row => {
    if (!row || typeof row !== 'object') return null;
    if (typeof row.skill_id === 'string') return `skill:${row.skill_id}`;
    const raw = row.key ?? row.id;
    if (typeof raw !== 'string') return null;
    return `ability:${raw.match(/\.ab\.([a-z_0-9]+?)(?:\.row)?(?:\.[a-z_0-9]+)?$/)?.[1] ?? raw}`;
};

/** Channel ids of an ability row ({key|id}) or a native skill ({skill_id}). An explicit `channels` array on the row wins. Unknown rows give []. */
export function channelsOf(row) {
    const own = row?.channels ?? (row?.channel ? [row.channel] : null);
    const ids = Array.isArray(own) ? own : TABLE[keyOf(row)] ?? [];
    return ids.filter(id => byId.has(id));
}

/** Plain words for the holder only. An observer, or anyone who does not hold the row, gets '' so a concealed power shows nothing extra (ABR19). */
export function channelNote(row, {holder = false} = {}) {
    if (!holder) return '';
    const list = channelsOf(row).map(id => byId.get(id));
    return list.length ? `Kind of power: ${list.map(c => c.label).join(', ')}. ${list[0].plain}` : '';
}

/** Coverage printout: which tagged rows each channel has, for a world's own row list. */
export const channelCoverage = rows => Object.fromEntries(CHANNEL_IDS.map(id => [id, rows.filter(r => channelsOf(r).includes(id)).length]));
