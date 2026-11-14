// Scene layer spike (CBD254). Proposal: headless, no runtime caller, no save slice of its own.
// Design: docs/COMBAT_AND_CONFLICT_CONSIDERATIONS_2026-10-18.md CBD62, CBD69-CBD71, CBD94,
// CBD95, CBD169-CBD171, CBD205, CBD206, CBD239-CBD246. Findings: docs/audits/SCENE_LAYER_SPIKE_2026-11-13.md.
//
// A scene is the near-detail form of a place. Its spots are ordinary place holders,
// joined by ordinary links, and the place's recorded things and people are moved onto
// them. Nothing here applies anything: every function reads a world and returns either
// a plan, a list of world ops for `applyWorldOps`, or an answer.
//
//   planScene      the fresh generation for a place: spots, links, where each holder goes
//   enterSceneOps  ops that unfold the plan, with whatever was kept last time laid over it
//   leaveSceneOps  ops that fold the spots away and keep only what differs from a fresh plan
//   addressable    which of perceive, reach and means fails for an actor, a subject and a verb
//   sceneActions   the verbs a subject's properties offer, each with its addressable answer
//
// What is kept lives in the place holder's own `state.scene` slice, so an unchanged place
// stores nothing. A thing's damage or changed property needs no keeping: it is on the
// thing, which is the world's thing (CBD70).
import {address, drawU32, indexFromU32} from './gen_kit.js';
import {linkReach, normalizeLink, worldLinks} from './world_substrate.js';

export const SCENE_PACK = 'scene';
const byId = (a, b) => a < b ? -1 : a > b ? 1 : 0;
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const fail = message => { throw new Error(`Scene layer: ${message}`); };

// Properties a composing world declares (pass to composeSubstrate `properties`).
// The six thing words are the small shared vocabulary of CBD95; a world adds its own rows.
export const SCENE_PROPERTIES = Object.freeze([
    {id: 'heavy', type: 'flag'},    // too much for one hand: cannot be thrown or pocketed, can be pushed and sheltered behind
    {id: 'fixed', type: 'flag'},    // part of the place: cannot be moved at all
    {id: 'lit', type: 'flag'},      // gives light: seen in the dark, can be snuffed
    {id: 'brittle', type: 'flag'},  // breaks when struck or thrown
    {id: 'liquid', type: 'flag'},   // holds something that pours
    {id: 'hinged', type: 'flag'},   // opens and closes
    {id: 'broken', type: 'flag'},   // condition after breaking; the remains stay in the place
    {id: 'dark', type: 'flag'},     // a spot's condition: works on perceiving (CBD205)
    {id: 'slick', type: 'flag'},    // a spot's condition: recorded and kept; no test reads it yet
    {id: 'scene_kind', type: 'label'},     // on a place: which layout it uses
    {id: 'scene_spot', type: 'label'},     // on a thing or person: the local spot it is recorded at
    {id: 'scene_replaces', type: 'label'}, // on a heavy or fixed thing: the layout spot it stands in for
]);

// One row per place kind. Local ids; a spot's holder id is `<place>.<local>` unless an
// override asks for bare ids. `loose` lists where unpinned things may lie (one keyed draw
// each). `exits` lists the spots the place's own ways out attach to. `maybe` rows are
// spots a keyed draw includes or leaves out, so two lanes need not be the same lane.
const L = (id, kind, from, to, extra = {}) => ({id, kind, from, to, ...extra});
export const SCENE_LAYOUTS = Object.freeze({
    slope: {entry: 'low', loose: ['low', 'high'], exits: ['low', 'high'], anchor: 'low',
        spots: {high: {tags: ['high']}, low: {}, treeline: {tags: ['cover']}},
        links: [L('climb', 'path', 'low', 'high', {cost: 2}), L('overlook', 'sightline', 'high', 'low'),
            L('into-trees', 'path', 'low', 'treeline'), L('through-trees', 'sightline', 'treeline', 'high')]},
    lane: {entry: 'near-end', loose: ['near-end', 'middle', 'far-end'], exits: ['near-end', 'far-end'], anchor: 'middle',
        spots: {'near-end': {}, middle: {tags: ['narrow']}, 'far-end': {}},
        links: [L('near-walk', 'path', 'near-end', 'middle'), L('far-walk', 'path', 'middle', 'far-end'),
            L('along', 'sightline', 'near-end', 'far-end')],
        maybe: [{spot: 'recess', value: {tags: ['cover']}, links: [L('step-aside', 'path', 'middle', 'recess')], oneIn: 2}]},
    hall: {entry: 'doorway', loose: ['floor'], exits: ['doorway'], anchor: 'floor',
        spots: {floor: {}, dais: {tags: ['high']}, doorway: {tags: ['narrow']}},
        links: [L('to-dais', 'path', 'floor', 'dais'), L('to-door', 'path', 'floor', 'doorway'),
            L('across', 'sightline', 'dais', 'doorway')]},
    room: {entry: 'doorway', loose: ['middle', 'corner'], exits: ['doorway'], anchor: 'middle',
        spots: {middle: {}, corner: {}, doorway: {tags: ['narrow']}},
        links: [L('in', 'path', 'doorway', 'middle'), L('aside', 'path', 'middle', 'corner')]},
    // Any place can be looked at closely: a kind with no row is one spot.
    ground: {entry: 'ground', loose: ['ground'], exits: ['ground'], anchor: 'ground', spots: {ground: {}}, links: []},
});

const spotsOf = (world, place) => Object.values(world.holders)
    .filter(h => h.kind === 'place' && h.refs?.scene === place).map(h => h.id).sort(byId);
/** The place whose scene a holder stands in, or its plain place when no scene is open. */
export function sceneOf(world, id) {
    const h = world.holders[id], at = h?.kind === 'place' ? h : world.holders[h?.place];
    return at ? at.refs?.scene ?? at.id : null;
}
export const sceneOpen = (world, place) => spotsOf(world, place).length > 0;
export const readKept = (world, place) => structuredClone(world.holders[place]?.state?.[SCENE_PACK] ?? null);

function layoutFor(place, {layouts = SCENE_LAYOUTS, overrides = {}} = {}) {
    const o = overrides[place.id] ?? {};
    const kind = o.kind ?? place.properties.scene_kind ?? place.tags.find(t => Object.hasOwn(layouts, t)) ?? 'ground';
    return {kind, layout: layouts[kind] ?? fail(`no layout for place kind ${kind}.`), o};
}

/** The fresh generation for a place, from its kind, its recorded things and its ways
 * out. Reads nothing that was kept, so two calls on the same record give the same plan.
 * opts: {root, layouts, overrides: {[placeId]: {kind, ids: 'bare', entry, spots: {local: value | null},
 * rename: {local: local}, links: [...], linksReplace, place: {holderId: local}, exitAt: {linkId: local}}}}. */
export function planScene(world, placeId, opts = {}) {
    const place = world.holders[placeId];
    if (place?.kind !== 'place' || place.refs?.scene) fail(`${placeId} is not a place that can be entered.`);
    const {kind, layout, o} = layoutFor(place, opts), root = opts.root ?? 'scene';
    const draw = (...parts) => drawU32(root, address('scene', placeId, kind, ...parts));
    const rename = o.rename ?? {}, name = local => rename[local] ?? local;
    const id = local => o.ids === 'bare' ? local : `${placeId}.${local}`;

    // 1. The kind's layout, its keyed extras, then the place's own overrides.
    const spots = new Map(), links = new Map();
    const addSpot = (local, value = {}) => spots.set(local, {tags: [...(value.tags ?? [])], properties: {...(value.properties ?? {})}});
    const addLink = l => links.set(l.id, {...l, from: name(l.from), to: name(l.to)});
    for (const [local, value] of Object.entries(layout.spots)) addSpot(name(local), value);
    if (!o.linksReplace) layout.links.forEach(addLink);
    for (const extra of layout.maybe ?? []) {
        if (indexFromU32(draw('maybe', extra.spot), extra.oneIn) !== 0) continue;
        addSpot(name(extra.spot), extra.value);
        if (!o.linksReplace) extra.links.forEach(addLink);
    }
    for (const [local, value] of Object.entries(o.spots ?? {})) value === null ? spots.delete(local) : addSpot(local, value);
    for (const l of o.links ?? []) links.set(l.id, {...l});

    // 2. Who and what is here: holders at the place, or already on one of its spots.
    const open = new Set(spotsOf(world, placeId));
    const here = Object.values(world.holders).filter(h => h.kind !== 'place' && (h.place === placeId || open.has(h.place)))
        .sort((a, b) => byId(a.id, b.id));
    const things = here.filter(h => h.kind === 'thing'), others = here.filter(h => h.kind !== 'thing');
    const big = t => t.properties.heavy === true || t.properties.fixed === true;
    const gripOf = t => (Array.isArray(t.properties.marks) ? t.properties.marks : []).find(m => m.startsWith('grip:'))?.slice(5);

    // 3. Recorded things add or replace spots (CBD69). A heavy or fixed thing is a spot
    // of its own, joined to the spot it is recorded at; with `scene_replaces` it takes
    // over a layout spot and that spot's links.
    const at = {}, anchorOf = {}, by = t => `by-${t.id}`; // the spot beside a big thing
    const pinned = h => { const local = o.place?.[h.id] ?? h.properties.scene_spot; return local != null ? name(local) : null; };
    const entry = name(o.entry ?? layout.entry), anchor = name(layout.anchor);
    for (const t of things.filter(big)) {
        const replaces = t.properties.scene_replaces != null ? name(t.properties.scene_replaces) : null;
        if (replaces && spots.has(replaces) && replaces !== entry) {
            const old = spots.get(replaces);
            spots.delete(replaces);
            spots.set(by(t), {tags: [...new Set([...old.tags, 'cover'])].sort(), properties: old.properties, thing: t.id});
            for (const l of links.values()) { if (l.from === replaces) l.from = by(t); if (l.to === replaces) l.to = by(t); }
        } else {
            spots.set(by(t), {tags: ['cover'], properties: {}, thing: t.id});
            anchorOf[t.id] = pinned(t) ?? anchor;
        }
        at[t.id] = by(t);
    }
    for (const [thing, to] of Object.entries(anchorOf)) {
        const from = spots.has(to) ? to : spots.has(anchor) ? anchor : entry;
        links.set(`${thing}.way`, L(`${thing}.way`, 'path', from, `by-${thing}`));
    }

    // 4. People stand at the entry unless recorded elsewhere; loose things lie at a
    // keyed spot; a held thing goes with the hand that holds it.
    const fallback = spots.has(entry) ? entry : [...spots.keys()].sort(byId)[0];
    const real = local => local != null && spots.has(local) ? local : null;
    for (const h of others) at[h.id] = real(pinned(h)) ?? fallback;
    const loose = (layout.loose ?? []).map(name).filter(local => spots.has(local));
    for (const t of things.filter(t => !big(t))) {
        const holder = gripOf(t);
        at[t.id] = real(pinned(t)) ?? (holder && at[holder]) ??
            (loose.length ? loose[indexFromU32(draw('thing', t.id), loose.length)] : fallback);
    }

    // 5. The place's own ways out attach to exit spots, so a barred door is barred here too.
    const exits = (layout.exits ?? []).map(name).filter(local => spots.has(local));
    const out = [];
    worldLinks(world).filter(l => l.from === placeId || l.to === placeId).forEach((l, i) => {
        const spot = real(o.exitAt?.[l.id]) ?? (exits.length ? exits[i % exits.length] : fallback);
        out.push({...l, id: `${placeId}.out.${l.id}`, [l.from === placeId ? 'from' : 'to']: id(spot), mirrors: l.id});
    });

    const linkRows = [...links.values()].filter(l => spots.has(l.from) && spots.has(l.to))
        .map(l => normalizeLink({...l, id: id(l.id), from: id(l.from), to: id(l.to)}));
    return {
        place: placeId, kind, entry: id(fallback),
        spots: [...spots.entries()].map(([local, s]) => ({id: id(local), kind: 'place', detail: 'near',
            tags: ['scene.spot', ...s.tags].sort(), properties: s.properties,
            refs: {scene: placeId, ...(s.thing ? {thing: s.thing} : {})}})).sort((a, b) => byId(a.id, b.id)),
        links: [...linkRows, ...out.map(({mirrors, ...l}) => normalizeLink(l))].sort((a, b) => byId(a.id, b.id)),
        mirrors: Object.fromEntries(out.map(l => [l.id, l.mirrors])),
        at: Object.fromEntries(Object.entries(at).map(([h, local]) => [h, id(local)]).sort(([a], [b]) => byId(a, b))),
    };
}

const spotShape = s => ({tags: [...s.tags].sort(), properties: s.properties ?? {}});
const LINK_FIELDS = ['kind', 'from', 'to', 'cost', 'state', 'oneWay', 'force', 'note'];
const linkDiff = (now, fresh) => Object.fromEntries(LINK_FIELDS.filter(f => !same(now[f] ?? null, fresh[f] ?? null)).map(f => [f, now[f] ?? null]));

/** Ops that unfold a place into its spots, with last time's kept differences laid over
 * the fresh plan. Apply with `applyWorldOps(rules, world, ops, cause)`. */
export function enterSceneOps(world, placeId, opts = {}) {
    if (sceneOpen(world, placeId)) return [];
    const plan = planScene(world, placeId, opts), kept = readKept(world, placeId) ?? {};
    const spots = new Map(plan.spots.map(s => [s.id, s]));
    for (const [id, k] of Object.entries(kept.spots ?? {})) {
        if (spots.has(id)) spots.set(id, {...spots.get(id), properties: k.properties});
        else if (k.added) spots.set(id, {id, kind: 'place', detail: 'near', tags: k.tags, properties: k.properties, refs: {scene: placeId}});
    }
    const links = new Map(plan.links.map(l => [l.id, l]));
    for (const [id, k] of Object.entries(kept.links ?? {})) {
        if (k === null) links.delete(id);
        else if (links.has(id)) links.set(id, normalizeLink({...links.get(id), ...k, id}));
        else if (k.added) links.set(id, normalizeLink({...k.added, id}));
    }
    const at = {...plan.at};
    for (const [holder, spot] of Object.entries(kept.at ?? {})) if (holder in at && spots.has(spot)) at[holder] = spot;
    return [
        ...[...spots.values()].map(value => ({op: 'holder_add', value})),
        ...[...links.values()].filter(l => (spots.has(l.from) || world.holders[l.from]) && (spots.has(l.to) || world.holders[l.to]))
            .map(link => ({op: 'link_add', link})),
        ...Object.entries(at).map(([holder, to]) => ({op: 'move', holder, to})),
    ];
}

/** Ops that fold a place's spots away. What differs from a fresh plan is kept on the
 * place: a changed spot, a changed, removed or added link, a thing lying somewhere a
 * fresh plan would not put it. A way out changed from inside is written to the world's
 * own link. People are not kept at spots by default (`keepPeople` is the dial). */
export function leaveSceneOps(world, placeId, opts = {}) {
    const ids = spotsOf(world, placeId);
    if (!ids.length) return [];
    const plan = planScene(world, placeId, opts), inScene = new Set(ids);
    const fresh = new Map(plan.spots.map(s => [s.id, s])), kept = {spots: {}, links: {}, at: {}}, ops = [];

    for (const id of ids) {
        const now = world.holders[id], was = fresh.get(id);
        if (!was) kept.spots[id] = {...spotShape(now), added: true};
        else if (!same(now.properties, was.properties)) kept.spots[id] = {properties: now.properties};
    }
    const mine = (world.links ?? []).filter(l => inScene.has(l.from) || inScene.has(l.to));
    const freshLinks = new Map(plan.links.map(l => [l.id, l]));
    for (const now of mine) {
        const was = freshLinks.get(now.id), mirrored = plan.mirrors[now.id];
        if (!was) { const {id, ...added} = now; kept.links[id] = {added}; continue; }
        const diff = linkDiff(now, was);
        if (!Object.keys(diff).length) continue;
        // A way out is the world's link seen from inside: its state goes back to the world.
        if (mirrored) {
            const {from, to, ...world_side} = diff;
            if (Object.keys(world_side).length) ops.push({op: 'link_set', id: mirrored, ...world_side});
        } else kept.links[now.id] = diff;
    }
    for (const id of freshLinks.keys()) if (!mine.some(l => l.id === id) && !plan.mirrors[id]) kept.links[id] = null;

    const present = Object.values(world.holders).filter(h => h.kind !== 'place' && inScene.has(h.place)).sort((a, b) => byId(a.id, b.id));
    for (const h of present) {
        if ((h.kind === 'thing' || opts.keepPeople) && plan.at[h.id] !== h.place) kept.at[h.id] = h.place;
        ops.push({op: 'move', holder: h.id, to: placeId});
    }
    for (const l of mine) ops.push({op: 'link_remove', id: l.id});
    for (const id of ids) ops.push({op: 'holder_remove', holder: id});
    const value = Object.fromEntries(Object.entries(kept).filter(([, rows]) => Object.keys(rows).length));
    const had = world.holders[placeId].state?.[SCENE_PACK] != null;
    if (Object.keys(value).length) ops.push({op: 'state', holder: placeId, pack: SCENE_PACK, value});
    else if (had) ops.push({op: 'state', holder: placeId, pack: SCENE_PACK, value: null});
    return ops;
}

// ---------- what can be done (CBD94, CBD95, CBD169) ----------

// A verb is offered by the subject's properties: `needs` must all hold, `not` must not.
// Rules on properties, never on kinds of thing: the tenth object costs no row (CX3).
export const SCENE_VERBS = Object.freeze({
    take: {not: ['heavy', 'fixed']},
    throw: {not: ['heavy', 'fixed']},
    push: {needs: ['heavy'], not: ['fixed']},
    shelter: {any: ['heavy', 'fixed']},
    snuff: {needs: ['lit']},
    pour: {needs: ['liquid'], not: ['broken']},
    break: {needs: ['brittle'], not: ['broken']},
    open: {needs: ['hinged'], not: ['broken']},
});
// A means says which verbs it carries out, how far it reaches and which of a subject's
// properties it does not mind. Bare hands reach the spot the actor stands on.
export const HANDS = Object.freeze({id: 'hands', verbs: Object.keys(SCENE_VERBS), links: 0, kinds: ['path', 'door']});

const meansFit = (means, verb, subject) => {
    const row = SCENE_VERBS[verb], p = subject.properties, minds = name => !(means.ignores ?? []).includes(name);
    if (!row || !means.verbs.includes(verb)) return {ok: false, why: 'no-means'};
    const lacks = (row.needs ?? []).find(name => p[name] !== true);
    if (lacks) return {ok: false, why: `lacks:${lacks}`};
    if (row.any && !row.any.some(name => p[name] === true)) return {ok: false, why: `lacks:${row.any.join('|')}`};
    const stops = (row.not ?? []).find(name => p[name] === true && minds(name));
    return stops ? {ok: false, why: `is:${stops}`} : {ok: true};
};

/** CBD169 in one answer: can this actor address this subject with this verb, and if
 * not, which of the three tests fails first. Returns {ok, fails, why, link?, tests,
 * means}; `why` is a code for a reason line, not player text. opts: {means: [rows],
 * sight: links a look carries (default 2)}. The same call serves a foe choosing. */
export function addressable(world, {actor, subject, verb}, {means = [HANDS], sight = 2} = {}) {
    const a = world.holders[actor], s = world.holders[subject];
    if (!a || !s || a.kind === 'place' || s.kind === 'place') fail('addressable needs an actor and a subject that are not places.');
    const links = worldLinks(world), held = Array.isArray(s.properties.marks) && s.properties.marks.includes(`grip:${actor}`);
    const tests = {perceive: {ok: true}, reach: {ok: true}, means: {ok: true}};

    // Perceive: a line of open links, and light on the subject unless it gives its own.
    if (!held) {
        const line = a.place === s.place || linkReach(links, a.place, {maxLinks: sight}).has(s.place);
        if (sceneOf(world, actor) !== sceneOf(world, subject) || !line) tests.perceive = {ok: false, why: 'no-line'};
        else if (world.holders[s.place].properties.dark === true && s.properties.lit !== true) tests.perceive = {ok: false, why: 'dark'};
    }

    // Means: some means carries the verb out on a subject with these properties.
    const fits = means.map(m => ({m, fit: meansFit(m, verb, s)}));
    const able = fits.filter(x => x.fit.ok).map(x => x.m);
    if (!able.length) tests.means = {ok: false, why: fits[0]?.fit.why ?? 'no-means'};

    // Reach: an open way within the reach of a means that fits (any means when none fits).
    if (!held && a.place !== s.place) {
        const via = m => ({kinds: m.kinds ?? ['path', 'door'], maxLinks: m.links ?? 0});
        const tried = able.length ? able : means;
        const got = tried.find(m => linkReach(links, a.place, via(m)).has(s.place));
        if (!got) {
            const shut = tried.map(m => linkReach(links, a.place, {...via(m), closed: 'any'}).get(s.place)).find(Boolean);
            tests.reach = shut ? {ok: false, why: 'closed', link: shut.forced[0]} : {ok: false, why: 'apart'};
        } else tests.means.by = got.id;
    }
    if (tests.means.ok && !tests.means.by) tests.means.by = able[0].id;

    const fails = ['perceive', 'reach', 'means'].find(t => !tests[t].ok) ?? null;
    return {ok: !fails, fails, why: fails ? tests[fails].why : null, ...(fails && tests[fails].link ? {link: tests[fails].link} : {}),
        means: fails ? null : tests.means.by, tests};
}

/** Every verb the things in the actor's scene offer by their properties, each with
 * its `addressable` answer. Generated from what is there (CBD94); sorted, so a caller
 * can compare two lists. */
export function sceneActions(world, actor, opts = {}) {
    const scene = sceneOf(world, actor), means = opts.means ?? [HANDS];
    return Object.values(world.holders)
        .filter(h => h.kind === 'thing' && sceneOf(world, h.id) === scene).sort((a, b) => byId(a.id, b.id))
        .flatMap(thing => Object.keys(SCENE_VERBS).filter(verb => means.some(m => meansFit(m, verb, thing).ok))
            .map(verb => ({verb, subject: thing.id, ...addressable(world, {actor, subject: thing.id, verb}, opts)})));
}
