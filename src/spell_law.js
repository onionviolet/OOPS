// Spell effect law on the kernel (chat S): any effect sentence, canon or new,
// runs as a K working (PFP16, KW1). One operation per verb and target kind; a
// composed spell (SC6) is a K method with several steps over the same law.
// Settlement reads the bound thing at the step's time (KW3) and lets properties
// decide (PFP22): a ward or counter on the target blocks the verbs it names, a
// mass limit stops a move. World hosts lower the published effects onto their
// own owners (KB7); this law publishes intents only (KW11).
import {defineWorkingLaw, interruptWorking, quoteWorking} from './kernel_working.js';
import {AIRWAY_OBSTRUCTION, EFFECT_VERBS, EFFECT_TARGETS, speechObstruction, unsteadyFooting} from './spell_effects.js';
import {sentenceCosts} from './effect_grammar.js';
import {KNOWLEDGE_KINDS} from './knowledge_record.js';
import {brewDoseContents, brewDoseQuantity, brewFlaskStamp} from './engine_brew_stock.js';
import {storedBrewDose} from './brew_law.js';

function recordInspection({id, thing, caster, at, term, value}) {
    return {op: 'publish', kind: KNOWLEDGE_KINDS.learn, place: caster.place, by: caster.holder,
        detail: {knowledge: {to: caster.holder, record: {
            id, subject: {kind: 'fact', id}, true: {holder: thing.holder, ...term},
            believed: {value}, source: {kind: 'observation', by: caster.holder, at},
        }}}};
}

function inspectComposition({thing, caster, options, at, step}) {
    const observed = {step};
    if (!caster?.holder || !thing.holder || caster.place !== thing.place)
        return {ok: false, reason: 'The sample is out of reach.', observed};
    const costs = sentenceCosts(options.sentence, options.details);
    const observation = {thing, caster, at};
    const effects = [];
    if (!thing.properties.concealed?.includes('composition')) {
        if (options.inspectComposition === 'dose') {
            const stock = brewDoseContents(thing);
            const {dose: {contents}} = storedBrewDose(stock, thing.brewStorage, at);
            observed.doseSample = {observer: caster.holder, sample: thing.holder,
                stamp: brewFlaskStamp(stock, thing.brewFraction, thing.brewOrigins, thing.brewStorage),
                reading: brewFlaskStamp(contents)};
            for (const part of Object.keys(contents).sort()) {
                const quantity = brewDoseQuantity(part);
                effects.push(recordInspection({...observation, id: `assay:${thing.holder}:${at}:${quantity}`,
                    term: {quantity}, value: contents[part]}));
            }
            if (!effects.length) observed.emptySample = {observer: caster.holder, sample: thing.holder};
        } else if (Array.isArray(thing.properties.ingredients)) {
            effects.push(recordInspection({...observation, id: `ingredients:${thing.holder}`,
                term: {property: 'ingredients'}, value: thing.properties.ingredients}));
        }
    }
    return {ok: true, costs, effects, observed: effects.length ? observed : {...observed, seen: 'The spell reveals no ingredients.'}};
}

/** A readable empty sample supersedes older findings without deleting them.
 * Concealed and interrupted casts supply no such observation. */
export function latestEmptyAssay(engine, {observer, sample}) {
    let latest = -1;
    for (const {law, record} of Object.values(engine.records.workings)) {
        if (law !== SPELL_EFFECT_LAW.ref) continue;
        for (const receipt of record.receipts) {
            const empty = receipt.observed?.emptySample;
            if (receipt.ok && empty?.observer === observer && empty.sample === sample)
                latest = Math.max(latest, receipt.at);
        }
    }
    return latest;
}

const speechFailure = {
    unconscious: 'The caster is unconscious.',
    disrupted: 'The caster cannot get the words out through the laughter.',
    airway: 'The caster cannot speak with an obstructed airway.',
    silenced: 'The caster cannot make a sound.',
};

function operation(verb, target, grip = false) {
    return {
        roles: grip ? {target, caster: 'body', implement: 'thing'} : {target}, minutes: 0,
        settle: ({bound, options, step, at}) => {
            const thing = bound.target, sentence = options.sentence;
            // A source record that still needs a ruling does not run until a reviewed ruling resolves it (srd521 README).
            if (options.status && options.status !== 'supported' && !options.ruling)
                return {ok: false, reason: `This spell needs a ruling first: ${(options.unmodeled ?? []).join('; ') || options.status}.`, observed: {step, seen: 'the working is not settled for this world yet'}};
            // EF3: counterplay comes free. A thing that carries a block for this verb or object refuses it.
            const blocker = (thing.blocks ?? []).find(b => b === verb || b === sentence.object || b === 'magic');
            if (blocker) return {ok: false, reason: `${thing.id} is protected against ${blocker}.`, observed: {step, seen: 'the spell met resistance'}};
            // Limits as properties: a move reads mass against the spell's limit (dial per spell, default none).
            if (verb === 'move' && Number.isFinite(options.massLimit) && Number.isFinite(thing.mass) && thing.mass > options.massLimit)
                return {ok: false, reason: `${thing.id} is too heavy for this working.`, observed: {step, seen: 'it strains and does not move'}};
            // The host takes {sentence, details} (PC8). The old kind label stays beside it while consumers migrate.
            const {caster, implement} = bound;
            if (grip && caster.properties?.mind_awake === false)
                return {ok: false, reason: 'The caster is unconscious.', observed: {step}};
            if (grip && options.requiresSpeech) {
                const obstruction = speechObstruction(caster.properties, caster.voiceBlocked);
                if (obstruction) return {ok: false, reason: speechFailure[obstruction], observed: {step}};
            }
            if (grip && options.requiresFooting && unsteadyFooting(caster.properties))
                return {ok: false, reason: 'The caster cannot plant their feet.', observed: {step}};
            if (grip && (!caster.holder || !implement.holder || caster.place !== implement.place ||
                !implement.properties?.marks?.includes(`grip:${caster.holder}`))) {
                return {ok: false, reason: 'The casting implement is out of your hand.', observed: {step}};
            }
            if (verb === 'sense' && sentence.object === 'composition' && options.inspectComposition)
                return inspectComposition({thing, caster, options, at, step});
            const aim = {shape: 'holder', id: thing.holder ?? thing.id};
            const details = grip ? {...options.details, target: aim,
                ...(verb === 'move' && sentence.object === 'position' && sentence.direction === 'toward_caster' &&
                    options.details?.to === undefined ? {to: caster.place} : {}),
                ...(options.contact ? {contact: {...options.contact, from: options.inFlight ? caster.place : caster.holder,
                    ...(options.inFlight && options.contact.reflectable === true ? {releasedBy: caster.holder} : {})}} : {})}
                : options.details ?? {target: {shape: 'holder', id: thing.id}};
            const effect = {kind: `spell.${sentence.verb}.${sentence.object}`, target: thing.id, sentence,
                details: verb === 'release' && sentence.object === 'airway'
                    ? {...details, mark: AIRWAY_OBSTRUCTION, channel: null}
                    : verb === 'release' && sentence.object === 'mark' && sentence.direction === 'ink'
                        ? {...details, channel: 'ink'}
                        : verb === 'block' && sentence.object === 'water'
                            ? {...details, params: {verb: 'add', object: 'humidity'}} : details,
                name: options.name ?? null};
            const observed = {step, seen: options.explain ?? null};
            if (options.odds === undefined && !options.inFlight) return {ok: true, effects: [effect], observed};
            const fault = options.implementFault;
            const faultPresent = fault && implement?.properties?.marks?.includes(fault.mark);
            const odds = faultPresent ? fault.odds : options.odds;

            // A cast that releases pays for the attempt on either branch.
            // Publish that price once through the kernel, independent of impact.
            const {cost, payer, ...impact} = effect.details;
            const released = {...effect, details: impact};
            const deliver = effects => options.inFlight ? {facts: {releasedSpell: effects}} : {effects};
            let miss = {observed: {step, seen: 'The spell fizzles.'}};
            if (options.onMiss === 'backfire') {
                miss = {effects: [{...released, target: caster.id, details: {...impact,
                    target: {shape: 'holder', id: caster.holder}}}],
                    observed: {step, seen: 'The spell turns back on the caster.'}};
            } else if (options.misfireTarget !== undefined) {
                miss = {effects: [{...released, target: options.misfireTarget, details: {...impact,
                    target: {shape: 'holder', id: options.misfireTarget}}}],
                    observed: {step, seen: 'The spell veers away from its aim.'}};
            } else if (options.partialMinutes !== undefined) {
                miss = {effects: [{...released, details: {...impact, minutes: options.partialMinutes}}],
                    observed: {step, seen: 'The spell takes hold briefly.'}};
            }
            const costs = sentenceCosts(sentence, {cost, payer});
            if (options.odds === undefined) return {ok: true, costs, ...deliver([released]), observed};
            return {ok: true, odds, costs, ...deliver([released]), observed,
                miss: {...deliver(miss.effects ?? []), observed: miss.observed}};
        },
    };
}

const operations = {
    'sense.flask.grip': operation('sense', 'flask', true),
    impact: {roles: {}, settle: ({facts}) => ({
        ok: true, effects: facts.releasedSpell ?? [], facts: {releasedSpell: null},
    })},
};
for (const verb of EFFECT_VERBS) for (const target of EFFECT_TARGETS) {
    operations[`${verb}.${target}`] = operation(verb, target);
    operations[`${verb}.${target}.grip`] = operation(verb, target, true);
}
export const SPELL_EFFECT_LAW = defineWorkingLaw({id: 'spell.effect', revision: 1, operations});

/** A flight needs no further wand movement. A composed form can still have
 * unreleased steps, so retain the caster's slot through those steps. */
export function spellUsesCastingSlot({law, record}, actor) {
    if (law !== SPELL_EFFECT_LAW.ref || record.status !== 'running') return false;
    return record.method.steps.slice(record.cursor).some(step =>
        record.bindings[step.bindings?.caster]?.id === actor);
}

/** Stop a caster's pending spell step at the engine clock. A released
 * projectile has its own pending impact and continues to that deadline. */
export function cancelSpellCast(engine, {id, actor}) {
    const entry = Object.hasOwn(engine.records.workings, id) ? engine.records.workings[id] : null;
    if (!entry || entry.law !== SPELL_EFFECT_LAW.ref) return {engine, ok: false, reason: 'no-spell'};
    const {record} = entry;
    if (record.status !== 'running') return {engine, ok: false, reason: 'not-running'};
    const step = record.method.steps[record.cursor];
    // An impact has no caster role; its preceding release supplies the owner.
    const cast = step.op === 'impact' ? record.method.steps[record.cursor - 1] : step;
    const caster = record.bindings[cast?.bindings?.caster];
    if (!caster || caster.id !== actor) return {engine, ok: false, reason: 'not-caster'};
    if (step.op === 'impact' && record.facts.releasedSpell?.length)
        return {engine, ok: false, reason: 'already-released'};
    const stopped = interruptWorking(record, {at: engine.world.clock, reason: 'The caster stopped the working.'});
    return {ok: true, engine: {...engine, records: {...engine.records,
        workings: {...engine.records.workings, [id]: {...entry, record: stopped}},
    }}};
}

// A spell may bind grip: {caster, implement} (holder ids). Its optional contact
// data uses the current caster as origin and the bound target as the aim.
export function spellEffectMethod(spells, {id = 'spell.composed', revision = 1} = {}) {
    if (!Array.isArray(spells) || !spells.length) throw Error('Choose at least one spell.');
    const roles = {}, bindings = {};
    const steps = spells.flatMap((spell, i) => {
        const role = `t${i}`;
        // An explicit flask binding lets the engine supply its storage profile.
        // Older object-bound inspection records still read their stock directly.
        const targetKind = spell.inspectComposition === 'dose' && spell.target.kind === 'flask'
            ? 'flask' : spell.sentence.target;
        roles[role] = targetKind;
        bindings[role] = {kind: targetKind, id: spell.target.id};
        const stepBindings = {target: role};
        if (spell.contact && !spell.grip) throw Error('A contact cast needs a bound caster and implement.');
        if (spell.inspectComposition && (![true, 'dose'].includes(spell.inspectComposition) ||
            spell.sentence.verb !== 'sense' || spell.sentence.object !== 'composition' ||
            !spell.grip || spell.contact || spell.flightMinutes !== undefined || spell.odds !== undefined))
            throw Error('A composition reading needs a local caster and a direct inspection.');
        if (spell.flightMinutes !== undefined && (!spell.contact || spell.contact.held ||
            !Number.isSafeInteger(spell.flightMinutes) || spell.flightMinutes <= 0 || spell.onMiss === 'backfire'))
            throw Error('Spell flight needs direct contact and a positive duration.');
        if (spell.onMiss !== undefined && (spell.onMiss !== 'backfire' || spell.odds === undefined ||
            !spell.contact || spell.contact.held || !spell.grip || !['body', 'creature'].includes(spell.sentence.target)))
            throw Error('A backfire needs a cast with odds and a direct body or creature target.');
        if (spell.misfireTarget !== undefined && (spell.odds === undefined || spell.onMiss !== undefined ||
            !spell.contact || spell.contact.held || !spell.grip || !['body', 'creature'].includes(spell.sentence.target) ||
            typeof spell.misfireTarget !== 'string' || !spell.misfireTarget ||
            [spell.target.id, spell.grip.caster].includes(spell.misfireTarget)))
            throw Error('A stray cast needs odds, a direct target and a different recipient.');
        if (spell.partialMinutes !== undefined && (spell.odds === undefined || spell.onMiss !== undefined ||
            spell.misfireTarget !== undefined ||
            !['timed', 'sustained'].includes(spell.sentence.time) ||
            !Number.isSafeInteger(spell.details?.minutes) || !Number.isSafeInteger(spell.partialMinutes) ||
            spell.partialMinutes <= 0 || spell.partialMinutes >= spell.details.minutes))
            throw Error('A brief effect needs odds and a shorter positive duration.');
        if (spell.implementFault !== undefined) {
            const {mark, odds} = spell.implementFault ?? {};
            if (!spell.grip || !Number.isSafeInteger(spell.odds) || !Number.isSafeInteger(odds) ||
                odds < 0 || odds >= spell.odds || typeof mark !== 'string' || !mark)
                throw Error('An implement fault needs a grip, a condition mark and lower odds.');
        }
        if (spell.grip) {
            for (const [slot, kind] of [['caster', 'body'], ['implement', 'thing']]) {
                const key = `${role}.${slot}`;
                roles[key] = kind;
                bindings[key] = {kind, id: spell.grip[slot]};
                stepBindings[slot] = key;
            }
        }
        const cast = {op: `${spell.sentence.verb}.${targetKind}${spell.grip ? '.grip' : ''}`, bindings: stepBindings, minutes: spell.minutes,
            options: {sentence: spell.sentence, name: spell.name ?? null, massLimit: spell.massLimit, ...(spell.details ? {details: spell.details} : {}), explain: spell.explain ?? null,
                ...(spell.contact ? {contact: spell.contact} : {}),
                ...(spell.flightMinutes === undefined ? {} : {inFlight: true}),
                ...(spell.requiresSpeech ? {requiresSpeech: true} : {}),
                ...(spell.requiresFooting ? {requiresFooting: true} : {}),
                ...(spell.inspectComposition ? {inspectComposition: spell.inspectComposition} : {}),
                ...(spell.odds === undefined ? {} : {odds: spell.odds}),
                ...(spell.onMiss === undefined ? {} : {onMiss: spell.onMiss}),
                ...(spell.misfireTarget === undefined ? {} : {misfireTarget: spell.misfireTarget}),
                ...(spell.partialMinutes === undefined ? {} : {partialMinutes: spell.partialMinutes}),
                ...(spell.implementFault === undefined ? {} : {implementFault: spell.implementFault}),
                status: spell.status ?? null, unmodeled: spell.unmodeled ?? [], ruling: spell.ruling ?? null}};
        return spell.flightMinutes === undefined ? [cast] : [cast, {op: 'impact', minutes: spell.flightMinutes}];
    });
    return {law: SPELL_EFFECT_LAW, method: {id, revision, law: SPELL_EFFECT_LAW.ref, roles, steps}, bindings};
}

// Check 1 of the five (it runs): the same quote canon spells take.
export function quoteSpells(spells, {at = 0, ports = {}, id = 'spell.quote'} = {}) {
    const {law, method, bindings} = spellEffectMethod(spells);
    return quoteWorking(law, method, {bindings, at, ports, id});
}
