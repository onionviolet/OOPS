// G2 slice 1 (GAP_AUDIT_2026-10-30): quests come from the world's real needs, never from a template bag.
// Pure and stateless. The host passes a needs snapshot (see quest_needs.js adapters); this module scores the
// needs, keeps the few that matter this week and words each as a short card with a cited cause and a route
// into an EXISTING verb (story request take/deliver, Owed settle). It stores nothing: the same world seed,
// week and needs give the same board, so a save, reload or import shows the same quests (FLR5).
// FND1 four lines. Address shape: address('quest', world, need.ref) keys the unit; the week index rotates ties.
// Reader: boardFor(...) / questView(...). Tests: tests/quest_generator.test.js. Budget: O(needs), no I/O.
import {address} from './gen_kit.js';
import {keyedUnitFor} from './keyed_generation.js';

export const NEED_KINDS = Object.freeze(['want', 'shortage', 'rumour', 'debt']);
// Default with a dial and a reason (AD5): how many open leads a world shows at once. A busy world raises it; 0 hides the board.
export const BOARD_DIAL = Object.freeze({limit: 3, jitter: 0.5});
const WEEK = 7;
const fail = message => { throw new Error(message); };

// need: {ref, kind, world, subject, urgency 0..1, label, why, route:{verb, ...ids}}. `ref` must be unique and stable per source.
export function validateNeed(n) {
    typeof n?.ref === 'string' && n.ref || fail('Need: ref required.');
    NEED_KINDS.includes(n.kind) || fail(`Need ${n.ref}: unknown kind ${n.kind}.`);
    Number.isFinite(n.urgency) && n.urgency >= 0 && n.urgency <= 1 || fail(`Need ${n.ref}: urgency must be 0..1.`);
    typeof n.label === 'string' && n.label && typeof n.why === 'string' && n.why || fail(`Need ${n.ref}: label and why required.`);
    typeof n.route?.verb === 'string' || fail(`Need ${n.ref}: route.verb required.`);
    return n;
}

const LEAD = {want: 'Someone asks', shortage: 'Short supply', rumour: 'Word going round', debt: 'You owe'};

export function questFor(need, {world, week}) {
    return {
        id: address('quest', world, need.ref),
        world, week,
        title: need.label,
        lead: LEAD[need.kind],
        // The cause is the need itself: a reader can resolve ref back to the person, row or rumour that raised it.
        cause: {kind: need.kind, ref: need.ref, why: need.why},
        route: {...need.route},
        urgency: need.urgency,
    };
}

// Which needs make the board this week. Urgency decides; a keyed unit (stable per world, need and week) breaks ties and
// rotates equally pressing needs so the board is not the same three leads forever.
export function boardFor({worldSeed, world, day, needs, dial = BOARD_DIAL}) {
    typeof world === 'string' && world || fail('Quests: world required.');
    Number.isInteger(day) && day >= 0 || fail('Quests: day must be a non-negative integer.');
    const week = Math.floor(day / WEEK), seen = new Set();
    const live = needs.filter(n => n.world == null || n.world === world).map(validateNeed).filter(n => !seen.has(n.ref) && seen.add(n.ref));
    const scored = live.map(n => ({n, score: n.urgency + dial.jitter * keyedUnitFor(worldSeed, 'reward', ['quest', world, n.ref, week])}));
    scored.sort((a, b) => b.score - a.score || (a.n.ref < b.n.ref ? -1 : 1));
    return scored.slice(0, dial.limit).map(({n}) => questFor(n, {world, week}));
}

// Every quest must resolve back to a live need, or it has no business on the board.
export const resolveCause = (quest, needs) => needs.find(n => n.ref === quest.cause?.ref && n.kind === quest.cause.kind) ?? null;

// Card form for the UI: short text, no walls (the brief and UR rules).
export const questView = quest => ({id: quest.id, lead: quest.lead, title: quest.title, because: quest.cause.why, verb: quest.route.verb, route: quest.route});
