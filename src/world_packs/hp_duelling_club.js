// Chapter 11 exchanges on the shared engine clock (PC95).
// Durations and effort are authored. The students' exchange starts at
// Rictusempra and ends at Snape's intervention.
import {advanceEngineWorld, applyEngineOps, createEngineWorld, startEngineWorking} from '../engine_world.js';
import {sentenceFromIntent, sharedEffect, speechObstruction, unsteadyFooting} from '../spell_effects.js';
import {labelSpellRow} from '../spell_grammar.js';
import {cancelSpellCast, SPELL_EFFECT_LAW, spellEffectMethod, spellUsesCastingSlot} from '../spell_law.js';
import {HP_SPELL_ROWS, HP_SPELL_WORLD} from '../spell_pack_hogwarts.js';
import {WORLD_PROPERTIES, WORLD_QUANTITIES} from '../world_quantities.js';
import {contestPack} from '../contest_bodies.js';
import {resolveReach, spellContactBarrier, voiceBlocker} from '../world_effects.js';

const spell = id => {
    const row = HP_SPELL_ROWS.find(entry => entry.id === id);
    return {name: row.forms[0], sentence: sentenceFromIntent(labelSpellRow(row, HP_SPELL_WORLD).parts)};
};

export const DUELLING_CLUB_CONFIG = {
    packs: ['a.mind'],
    shared: {
        properties: [...Object.values(WORLD_PROPERTIES).filter(property => !['senses', 'concealed'].includes(property.id)),
            {id: 'duel_called', type: 'flag'}, {id: 'duel_yield_offered', type: 'flag'},
            {id: 'duel_pursuit_lead', type: 'label'}],
        quantities: [...Object.values(WORLD_QUANTITIES), {id: 'stamina', unit: 'effort', min: 0, max: 10}],
        effectKinds: contestPack().publishes,
    },
    host: {
        laws: [SPELL_EFFECT_LAW],
        costs: {accounts: {stamina: {quantity: 'stamina'}}},
        effects: {read: sharedEffect},
    },
};

const body = (id, place) => ({
    id, place, kind: 'body', as: ['creature', 'self', 'effect'],
    quantities: {stamina: 10, vitality: 20}, properties: {mind_awake: true, mind_laughing: false},
});
const wand = (actor, place) => ({
    id: `${actor}-wand`, place, kind: 'thing', properties: {marks: [`grip:${actor}`]},
});

export function startDuellingClub({students = false, disarmDrill} = {}) {
    if (disarmDrill !== undefined && (!students || !['practice', 'escape', 'pursuit'].includes(disarmDrill)))
        throw Error('Unknown student disarm drill.');
    const west = students ? 'harry' : 'snape';
    const east = students ? 'draco' : 'lockhart';
    const proctorPlace = disarmDrill === 'practice' ? 'far-floor' : 'west-platform';
    return createEngineWorld({...DUELLING_CLUB_CONFIG,
        holders: [
            ...['west-platform', 'east-platform', 'far-floor'].map(id => ({id, kind: 'place'})),
            body(west, 'west-platform'), wand(west, 'west-platform'),
            body(east, 'east-platform'), wand(east, 'east-platform'),
            ...(students && (!disarmDrill || disarmDrill === 'practice') ? [body('snape', proctorPlace), wand('snape', proctorPlace)] : []),
            ...(disarmDrill ? [{id: 'doorway', kind: 'place'}] : []),
        ],
        links: [{id: 'platform', kind: 'sightline', from: 'west-platform', to: 'east-platform'},
            ...(disarmDrill ? [{id: 'exit', kind: 'path', from: 'east-platform', to: 'doorway'}] : []),
            ...(disarmDrill === 'pursuit' ? [{id: 'platform-walk', kind: 'path', from: 'west-platform', to: 'east-platform'}] : [])],
    });
}

const casts = {
    disarm: {minutes: 2, contact: {links: 1, kinds: ['sightline'], held: true}, details: {to: 'far-floor', cost: 3}},
    shield: {minutes: 1, requiresFooting: true, details: {cost: 2, minutes: 2, params: {verb: '*', object: 'spell-contact'}}},
    tickle: {minutes: 3, contact: {links: 1, kinds: ['sightline']}, details: {cost: 2, minutes: 2, mind: {faculty: 'laughter'}}},
    dance: {minutes: 1, contact: {links: 1, kinds: ['sightline']}, details: {cost: 2, minutes: 5, mind: {faculty: 'steps'}}},
};

const grip = actor => ({caster: actor, implement: `${actor}-wand`});
const called = engine => engine.world.holders.snape?.properties.duel_called === true;
const duelMethodPrefix = 'hogwarts.duel.';

export function duelShieldOpening(engine, actor) {
    const {world} = engine;
    const shieldAt = world.clock + casts.shield.minutes;
    const expires = shieldAt + casts.shield.details.minutes;
    const needsShield = (sentence, contact, impact) => {
        if (impact <= shieldAt || impact >= expires || !world.holders[contact?.from] ||
            !resolveReach(world, contact).ids.includes(actor)) return false;
        const barrier = spellContactBarrier(world, actor, sentence.verb, sentence.object);
        return !barrier || (barrier.until != null && barrier.until <= impact);
    };
    return Object.values(engine.records.workings).some(({law, payer, record}) => {
        if (law !== SPELL_EFFECT_LAW.ref || payer === actor || record.status !== 'running') return false;
        const step = record.method.steps[record.cursor], due = record.deadlines[record.cursor];
        if (step.op === 'impact') return record.facts.releasedSpell?.some(({sentence, details}) =>
            details.target?.id === actor && needsShield(sentence, details.contact, due));
        // The drill treats an aimed wand movement across an open sightline as
        // telegraphed. Impact still uses the eventual release and live path.
        const caster = record.bindings[step.bindings?.caster]?.id;
        if (!record.method.id.startsWith(duelMethodPrefix) ||
            record.bindings[step.bindings?.target]?.id !== actor || !step.options?.contact ||
            !world.holders[caster] || !resolveReach(world, {from: actor, links: 1, kinds: ['sightline']}).ids.includes(caster))
            return false;
        const impact = step.options.inFlight ? record.deadlines[record.cursor + 1] : due;
        return needsShield(step.options.sentence, {...step.options.contact, from: caster}, impact);
    });
}

export function prepareDuelGuard(engine, actor) {
    let next = engine;
    for (const [id, entry] of Object.entries(engine.records.workings)) {
        if (entry.payer !== actor || !spellUsesCastingSlot(entry, actor)) continue;
        if (!entry.record.method.id.startsWith(duelMethodPrefix) || entry.record.method.id === duelMethodPrefix + 'shield') return null;
        const stopped = cancelSpellCast(next, {id, actor});
        if (!stopped.ok) return null;
        next = stopped.engine;
    }
    return canStartDuelCast(next, actor, 'shield') ? next : null;
}

export function canStartDuelCast(engine, actor, spellId) {
    const {holders} = engine.world;
    const body = holders[actor], wand = holders[grip(actor).implement];
    const cast = casts[spellId];
    return !!cast && body?.kind === 'body' && body.place && wand?.kind === 'thing' && wand.place === body.place &&
        wand.properties.marks?.includes(`grip:${actor}`) === true &&
        !speechObstruction(body.properties, !!voiceBlocker(engine.world, actor)) &&
        (!cast.requiresFooting || !unsteadyFooting(body.properties)) &&
        body.quantities.stamina >= cast.details.cost &&
        !Object.values(engine.records.workings).some(entry => spellUsesCastingSlot(entry, actor));
}

/** The fixture's referee must be at the dropped wand to take custody. */
export function callDisarmDrill(engine) {
    if (called(engine)) return engine;
    const holders = engine.world.holders;
    const dropped = holders['draco-wand'];
    if (!holders.doorway || holders.snape?.place !== 'far-floor' || dropped?.place !== 'far-floor' ||
        !Array.isArray(dropped.properties.marks) || dropped.properties.marks.some(mark => mark.startsWith('grip:')))
        throw Error('The proctor needs the fallen wand to call the drill.');
    engine = applyEngineOps(engine, [
        {op: 'property', holder: dropped.id, property: 'marks', value: [...dropped.properties.marks, 'grip:snape']},
        {op: 'property', holder: 'snape', property: 'duel_called', value: true},
        {op: 'property', holder: 'draco', property: 'agency_goal', value: null},
    ], 'proctor-stop');
    // The students obey the call. Already released magic still meets the
    // world at impact. The proctor's own workings are outside the drill.
    for (const [id, {payer, record}] of Object.entries(engine.records.workings)) {
        if (['harry', 'draco'].includes(payer) && record.method.id.startsWith(duelMethodPrefix))
            engine = cancelSpellCast(engine, {id, actor: payer}).engine;
    }
    return engine;
}

/** Queues a withdrawal; the mind pack decides if the body can cross the exit. */
export function withdrawFromDisarmDrill(engine) {
    if (called(engine)) throw Error('The proctor has ended the exchange.');
    if (!engine.world.holders.doorway || engine.world.holders.draco?.place !== 'east-platform')
        throw Error('There is no withdrawal from here.');
    return applyEngineOps(engine, [{op: 'property', holder: 'draco', property: 'agency_goal', value: 'doorway'}], 'withdraw');
}

export function castAtDuellingClub(engine, {id, actor, spellId, target, minutes, flightMinutes}) {
    const cast = casts[spellId];
    if (!cast || engine.world.holders[actor]?.kind !== 'body') throw Error('Unknown Duelling Club cast.');
    if (called(engine) || engine.records.workings['students.finite']?.record.status === 'complete')
        throw Error('The proctor has ended the exchange.');
    if (spellId === 'shield' && actor !== target) throw Error('This Shield Charm protects its caster.');
    if (Object.values(engine.records.workings).some(entry => entry.law === SPELL_EFFECT_LAW.ref
        ? spellUsesCastingSlot(entry, actor)
        : entry.payer === actor && entry.record.status === 'running'))
        throw Error('Finish the current wand movement before starting another.');
    let details = {...cast.details, working: id};
    if (spellId === 'shield') details.field = id;
    // Draco manages to say the incantation through the laughter in the book.
    if (spellId === 'tickle' && actor === 'harry') details = {...details, minutes: 5,
        mind: {...details.mind, disruptSpeech: false}};
    return startEngineWorking(engine, {
        ...spellEffectMethod([{...cast, ...spell(spellId), minutes: minutes ?? cast.minutes, flightMinutes,
            details, target: {id: target}, requiresSpeech: true, grip: grip(actor)}], {id: duelMethodPrefix + spellId}),
        payer: actor, id,
    });
}

export function stopStudentExchange(engine) {
    // The proctor selects the two effects in this exchange. One release pays
    // once. Each effect carries its own subject and working identity.
    const contact = {links: 1, kinds: ['sightline']};
    const targets = [['draco', 'students.tickle'], ['harry', 'students.dance']];
    const effects = targets.map(([id, working], index) => ({
        ...spell('counter-spell'), target: {id}, grip: grip('snape'), requiresSpeech: true, contact,
        minutes: index === 0 ? 1 : 0, details: {working, ...(index === 0 ? {cost: 2} : {})},
    }));
    return startEngineWorking(engine, {
        ...spellEffectMethod(effects, {id: 'hogwarts.duel.finite'}), id: 'students.finite', payer: 'snape',
    });
}

/** A bounded idle policy for the observed exchange, driven by landed receipts.
 * The caller can restore at any phase and ask the policy to continue. */
export function advanceStudentExchange(engine, to) {
    const tickle = 'students.tickle', dance = 'students.dance', finite = 'students.finite';
    const landed = id => engine.records.workings[id]?.landed.some(row => row.status === 'published');
    const actions = [
        [tickle, () => true, () => castAtDuellingClub(engine, {id: tickle, actor: 'harry', spellId: 'tickle', target: 'draco', minutes: 1})],
        [dance, () => landed(tickle), () => castAtDuellingClub(engine, {id: dance, actor: 'draco', spellId: 'dance', target: 'harry'})],
        [finite, () => landed(dance), () => stopStudentExchange(engine)],
    ];
    let segments = 0;
    for (;;) {
        const next = !called(engine) && actions.find(([id, ready]) => !engine.records.workings[id] && ready());
        if (next) engine = next[2]();
        if (engine.world.clock === to) return {engine, segments, pending: false};
        const deadline = actions.flatMap(([id]) => {
            const record = engine.records.workings[id]?.record;
            return record?.status === 'running' ? [record.deadlines[record.cursor]] : [];
        });
        const stop = Math.min(to, ...deadline);
        const result = advanceEngineWorld(engine, stop);
        engine = result.engine;
        segments += result.segments;
        if (result.pending) return {engine, segments, pending: true};
    }
}
