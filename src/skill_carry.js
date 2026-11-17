// WER9 for skills (proposal, 2026-11-16; Weibao's AD11 says memories carry, WER9 says anything else needs a carrier the start names).
// Pure rules, no DOM, no hero, no save. A lead life that begins in a body of its own records here what happens to the Village hero's
// skills that cross into it. Native skill XP stays the only source of a level (skill_records.js says the same): this file only
// decides two derived buckets, a negative bonus level and an XP-gain multiplier, which skill_records_domain.js writes onto the hero.
//
// Default, dial, reason (per start, in CARRY_DIALS):
//   mind skills (reading, patience, craft know-how, noticing) carry as memory: the level stays and works here as it did (AD11).
//   body skills (breath, sight, strength, weapon hands, resistances) are the old body's training. With `keep` 0 none of that level
//   works in this body; `headStart` makes learning it again that much faster, until you are back at the level you brought.
//   Dial: `keep` is the share of a body level that still works (0 to 1); `headStart` the extra learning speed (0 = none);
//   `mind.keep` below 1 would make a world's memory leaky. `window` is how many minutes into the life the crossing is still
//   recorded, so a life already well under way never has its levels cut by a rule added afterwards.
// A start can name a carrier for a body skill (a trainer, a ritual, a gift): `carriers: {skillId: 'what carries it'}` makes that skill
// cross whole, as memory does. No start names one yet.
const MIND_CATEGORIES = new Set(['Character', 'Crafting']);
const MIND_SKILLS = new Set(['Patience', 'Meditation', 'Farming', 'Herbalism', 'Presence sensing', 'Spatial awareness', 'Strength of mind']);
const BODY_SKILLS = new Set(['Breathing', 'Regeneration', 'Poison resistance', 'Gluttony', 'Famine']);

export const CARRY_REASON = Object.freeze({
    mind: 'what you know comes with you (AD11)',
    body: 'a trained body stays with the body that was trained',
});

const DIAL = reason => Object.freeze({
    mind: Object.freeze({keep: 1}),
    body: Object.freeze({keep: 0, headStart: 0.5}),
    window: 120,
    reason,
});
// Keyed by the world the life lives in. Values are proposals pending Weibao's play (AD32).
export const CARRY_DIALS = Object.freeze({
    'book.hp.lead.world': DIAL('Harry is ten: a child\'s body cannot use a grown hero\'s strength or breath, but he remembers how it should feel.'),
    'book.lotm.tingen': DIAL('Klein wakes in a clerk\'s body that never did the Village hero\'s work, but the memory of doing it makes it come back faster.'),
    'book.ri.keeper.world': DIAL('A clan novice\'s body is not the Village hero\'s; knowing the feeling of a trained breath shortens the road back to it.'),
});
export const carryDial = worldId => CARRY_DIALS[worldId] ?? null;

/** 'mind' or 'body' for a native skill (id and category), by the rule above. Every skill has a kind, so a start never leaves one unanswered. */
export function skillKind(id, category) {
    if (BODY_SKILLS.has(id)) return 'body';
    if (MIND_SKILLS.has(id) || MIND_CATEGORIES.has(category)) return 'mind';
    return 'body';
}

/** What the hero brings across: {skillId: level} for the skills the Skills list shows. Only inside the first `window` minutes of the life. */
export function takeCarried(rows, dial, clock) {
    if (!dial || !(clock <= dial.window)) return {};
    return Object.fromEntries(rows.filter(r => r.level >= 1).map(r => [r.id, r.level]));
}

const share = (kind, dial) => dial[kind]?.keep ?? (kind === 'mind' ? 1 : 0);
const lost = (level, kind, dial, id) => dial.carriers?.[id] ? 0 : level - Math.round(level * Math.min(1, Math.max(0, share(kind, dial))));

/**
 * The derived buckets and the fold rows for one life. `carried` {id: level brought}, `levels` {id: current native level},
 * `kinds` {id: 'mind'|'body'}, `names` {id: label}.
 * levels: negative bonus levels (skill_records_domain writes them to flat.carried); xp: extra learning speed (multiplier.carried).
 */
export function carryEffects(carried, dial, levels, kinds, names = {}) {
    const out = {levelBonus: {}, xp: {}, rows: []};
    if (!dial || !carried) return out;
    for (const [id, brought] of Object.entries(carried)) {
        const kind = kinds[id] ?? 'body', now = levels[id] ?? brought, gone = Math.min(lost(brought, kind, dial, id), now), label = names[id] ?? id;
        if (gone > 0) out.levelBonus[id] = -gone;
        const back = now - gone >= brought, boost = kind === 'body' && !back ? dial.body?.headStart ?? 0 : 0;
        if (boost > 0) out.xp[id] = 1 + boost;
        const carrier = dial.carriers?.[id];
        out.rows.push({id, label, kind, level: brought, text: carrier ? `Carried by ${carrier}: all ${brought} levels work here.` : carryText(kind, brought, gone, boost, back, label)});
    }
    return out;
}

function carryText(kind, brought, gone, boost, back, label) {
    if (kind === 'mind') return gone === 0 ? `Memory: you kept all ${brought} levels, and they work here as they did.` : `Memory: ${brought - gone} of ${brought} levels still work here.`;
    if (back) return `Body: you are back at the level you brought (${brought}).`;
    const speed = boost > 0 ? ` Learning it again goes ${Math.round(boost * 100)}% faster until you are back at level ${brought}.` : '';
    return `Body: this body never trained ${label.toLowerCase()}, so ${gone === brought ? 'none of the' : `${gone} of its`} ${brought} levels count here.${speed}`;
}
