// Effects workshop (PSA24, proposal): one small played scene that shows what each effect pack does
// in a life. A workbench, a pond, a fiendfyre aisle, a Gu adept and a ward, each pack's own law
// running on one engine clock. It is a capability run (capability_runs_domain.js), so the player
// begins it, presses an act and reads what changed. Every number comes from the pack that owns it.
import {advanceEngineWorld, applyEngineOps, createEngineWorld, restoreEngineWorld} from '../engine_world.js';
import {defineWorkingLaw} from '../kernel_working.js';
import {landEffect} from '../effect_host.js';
import {apertureHolder} from '../world_substrate_packs/gu_aperture.js';
import {livingBodyState} from '../world_substrate_packs/living_body.js';
import {EFFECT_GRAMMARS, EFFECT_PACK_IDS, EFFECT_SHARED, HP_KEYS, SUBSTRATE_OWN_PACKS, assemblePotionEffect, derivedFormula,
    guEffectSearch, lotmDerivedCase, searchForActor} from '../world_effect_packs.js';

const LOG = 'workshop.log';
const DONE = 'workshop.done';
const config = {
    ownPacks: [SUBSTRATE_OWN_PACKS.vapor({constituents: {irritant: {harm: 'vapor-irritation'}}, uptakePermille: 500}),
        SUBSTRATE_OWN_PACKS.splash({uptakePermille: 500, response: {part: 'irritant', minimum: 1, form: 'swollen', minutes: 30, priority: 1}}),
        SUBSTRATE_OWN_PACKS.aperture(), SUBSTRATE_OWN_PACKS.protection(), SUBSTRATE_OWN_PACKS.breathing(),
        SUBSTRATE_OWN_PACKS.fiendfyre(), SUBSTRATE_OWN_PACKS.sustain(), SUBSTRATE_OWN_PACKS.form()],
    packs: ['l.living_body', 'a.mind', ...EFFECT_PACK_IDS, 'b.vapor', 'b.splash'].filter((id, i, all) => all.indexOf(id) === i),
    shared: EFFECT_SHARED,
};
// One tiny law so an actor can search for a way to do something (kernel search, PR3): tend a body that is hurt.
const tendLaw = defineWorkingLaw({id: 'workshop.tend', revision: 1, operations: {
    tend: {roles: {patient: 'body'}, settle({bound}) {
        const {patient} = bound;
        if ((patient.quantities.vitality ?? 0) >= 20) return {ok: false, reason: 'Nothing to tend.'};
        return {ok: true, effects: [{op: 'add', holder: patient.holder, quantity: 'vitality', amount: 4}]};
    }},
}});
const tendMethod = {id: 'workshop.tend_body', revision: 1, law: tendLaw.ref, roles: {patient: 'body'},
    steps: [{op: 'tend', bindings: {patient: 'patient'}, minutes: 5}]};
const body = (id, place, {q = {}, p} = {}) => ({id, place, kind: 'body', tags: ['living.body', 'breathes.air', 'splash-exposed'],
    quantities: {satiety: 0, vitality: 20, ...q}, state: {'l.living_body': livingBodyState({species: 'human', rate: 0})}, ...(p ? {properties: p} : {})});

function create() {
    return createEngineWorld({...config, holders: [
        {id: 'bench', kind: 'place'}, {id: 'bank', kind: 'place'}, {id: 'pond', kind: 'place', properties: {submerged: true}},
        {id: 'origin', kind: 'place', as: ['fiendfyre-site']},
        body('brewer', 'bench', {q: {vitality: 12}}), body('diver', 'bank', {q: {breath: 3}}), body('caster', 'bench'),
        body('shield', 'bench', {p: {protectionLayers: ['ward']}}),
        apertureHolder({id: 'adept', place: 'bench', aptitude: 44, essence: 0}),
        {id: 'ward', kind: 'thing', place: 'bench', quantities: {'protection-capacity': 10, 'protection-rating:fire': 10}},
        {id: 'pile', kind: 'thing', place: 'origin', properties: {flammable: true}, quantities: {condition: 3}},
        {id: 'conjured', kind: 'thing', place: 'bench', properties: {sustained_by: 'caster'}},
        {id: 'log', kind: 'thing', place: 'bench'},
    ]});
}

const held = engine => engine.world.holders;
const log = engine => held(engine).log.state[LOG] ?? [];
const done = engine => held(engine).log.state[DONE] ?? {};
const q = (engine, id, name) => held(engine)[id]?.quantities[name] ?? 0;
const sea = engine => Object.entries(held(engine).adept.quantities).filter(([k]) => k.startsWith('energy:')).reduce((n, [, v]) => n + v, 0);
const note = (engine, id, line) => applyEngineOps(engine, [{op: 'state', holder: 'log', pack: LOG, value: [...log(engine), line]},
    {op: 'state', holder: 'log', pack: DONE, value: {...done(engine), [id]: true}}], `workshop:${id}`);
const settle = (engine, minutes) => advanceEngineWorld(engine, engine.world.clock + minutes).engine;
const publish = (engine, kind, detail) => applyEngineOps(engine, [{op: 'publish', kind, place: 'bench', by: 'workshop', detail}], `workshop:${kind}`);

// Land one sentence from a world's grammar on the brewer and say what the world did.
function land(engine, parts, amount, who = 'brewer') {
    const before = q(engine, who, 'vitality');
    const run = landEffect(engine.rules, engine.world, {sentence: parts, details: {target: {shape: 'holder', id: who}, amount}},
        {cause: 'workshop:sentence', by: 'workshop', keys: HP_KEYS});
    const next = {...engine, world: run.world};
    return {engine: next, status: run.status, reason: run.reason, delta: q(next, who, 'vitality') - before};
}

const sentenceText = p => `${p.verb} ${p.object}, ${p.target}, ${p.time}`;
const ACTS = [
    {id: 'vapor', label: 'Let a flask of irritant boil off', detail: 'Release a vapor pulse in the workroom and let the brew vapor pack share it out.',
        run(e) {
            const next = settle(publish(e, 'vapor.released', {constituent: 'irritant', amount: 20}), 3);
            const inbox = held(next).brewer.state['l.living_body'].inbox.reduce((n, row) => n + row.amount, 0);
            return note(next, 'vapor', `Brew vapor · the brewer breathed in ${inbox} units of irritant; the rest hung in the room.`);
        }},
    {id: 'splash', label: 'Spill the flask on the bench', detail: 'The splash pack splits the spill across whoever stands exposed and may change their form for a while.',
        run(e) {
            const next = publish(e, 'brew.splash', {contents: {irritant: 10}});
            const layers = held(next).brewer.properties['temporary-form-layers'] ?? [];
            return note(next, 'splash', `Brew splash · the brewer is ${layers.length ? 'swollen' : 'unchanged'} for ${layers.length ? '30 minutes' : 'now'}.`);
        }},
    {id: 'aperture', label: 'Let the adept’s aperture refill', detail: 'An empty C-grade aperture recovers by its own law over an hour.',
        run(e) {
            const before = sea(e), next = settle(e, 60);
            return note(next, 'aperture', `Gu aperture · the adept’s sea rose by ${sea(next) - before} motes in an hour (a C aperture recovers 4% of 600,000 an hour).`);
        }},
    {id: 'ward', label: 'Strike the ward with fire', detail: 'Four points of fire hit a shield worn over a ten-point ward.',
        run(e) {
            const before = q(e, 'ward', 'protection-capacity');
            const next = publish(e, 'protection.impact', {target: 'shield', type: 'fire', amount: 4});
            return note(next, 'ward', `Ward · the ward took ${before - q(next, 'ward', 'protection-capacity')} of 4 and the wearer lost ${20 - q(next, 'shield', 'vitality')}.`);
        }},
    {id: 'breath', label: 'Send the diver under', detail: 'Five minutes in the pond with no air supply.',
        run(e) {
            const next = settle(applyEngineOps(e, [{op: 'move', holder: 'diver', to: 'pond'}], 'workshop:dive'), 5);
            return note(next, 'breath', `Breathing · the diver’s breath fell from 3 to ${q(next, 'diver', 'breath')}${q(next, 'diver', 'vitality') < 20 ? ` and then it cost ${20 - q(next, 'diver', 'vitality')} vitality` : ''}.`);
        }},
    {id: 'fire', label: 'Light the aisle with Fiendfyre', detail: 'The front burns fuel each minute and spreads along fuel contacts.',
        run(e) {
            const lit = applyEngineOps(e, [{op: 'law_add', field: {id: 'fiendfyre:origin', scope: 'origin', kind: 'fiendfyre-front',
                source: 'workshop', params: {ignitedAt: e.world.clock}}}], 'workshop:ignite');
            const next = settle(lit, 4);
            return note(next, 'fire', `Fiendfyre · the aisle fuel went from 3 to ${q(next, 'pile', 'condition')} in four minutes.`);
        }},
    {id: 'focus', label: 'Let the caster fall asleep', detail: 'A conjured thing lasts while its caster stays awake.',
        run(e) {
            const next = settle(applyEngineOps(e, [{op: 'property', holder: 'caster', property: 'mind_awake', value: false}], 'workshop:sleep'), 2);
            return note(next, 'focus', `Held spell · the caster slept and the conjured thing ${held(next).conjured ? 'held' : 'ended'}.`);
        }},
    {id: 'potion', label: 'Drink a Hogwarts pick-me-up', detail: 'Pepperup Potion, read as an effect sentence by the potion grammar, then landed on the brewer.',
        run(e) {
            const row = EFFECT_GRAMMARS['hp.potion'].sentences.find(s => s.subject === 'pepperup_potion');
            const {engine, status, delta} = land(e, assemblePotionEffect(EFFECT_GRAMMARS['hp.potion'].grammar, row.parts).lowered ? row.parts : null, 3);
            return note(engine, 'potion', `Potion grammar · ${row.title} reads “${sentenceText(row.parts)}”; ${status}, vitality ${delta >= 0 ? '+' : ''}${delta}.`);
        }},
    {id: 'gu', label: 'Feed the brewer a vitality leaf', detail: 'The Vitality Leaf Gu, read through the Gu effect grammar, heals what it touches.',
        run(e) {
            const parts = EFFECT_GRAMMARS.gu.read('vitality-leaf');
            const {engine, status, delta} = land(e, parts, 3);
            return note(engine, 'gu', `Gu grammar · vitality leaf reads “${sentenceText(parts)}”; ${status}, vitality ${delta >= 0 ? '+' : ''}${delta}.`);
        }},
    {id: 'spell', label: 'Cast a healing charm', detail: 'A Hogwarts spell lead, read through the spell grammar and landed on the brewer.',
        run(e) {
            const parts = EFFECT_GRAMMARS.hp.read('Heal the caster');
            const {engine, status, delta} = land(e, parts, 2);
            return note(engine, 'spell', `Spell grammar · “Heal the caster” reads “${sentenceText(parts)}”; ${status}, vitality ${delta >= 0 ? '+' : ''}${delta}.`);
        }},
    {id: 'formula', label: 'Derive a Sequence formula', detail: 'A Lord of the Mysteries formula derived from the rules, read as a power sentence and a hazard sentence.',
        run(e) {
            const {row, sentences} = derivedFormula();
            const steps = lotmDerivedCase(`lotm.derived.${row.id}`).timeline?.length ?? row.method.steps.length;
            return note(e, 'formula', `Derived formula · ${row.name} (${row.pathway} ${row.seq}), ${steps} steps; power: ${sentenceText(sentences[0].parts)}; hazard: ${sentenceText(sentences[1].parts)}.`);
        }},
    {id: 'search', label: 'Ask the Gu grammar for a new effect', detail: 'Say you want to hide an area; the search keeps only wordings the world’s checks allow.',
        run(e) {
            const out = guEffectSearch({verb: 'conceal', object: 'information', target: 'area'});
            const first = out.answers[0];
            return note(e, 'search', first ? `Effect search · ${out.answers.length} wordings fit; the first reads “${sentenceText({...first.parts})}” and the time is unknown to you until you test it.`
                : 'Effect search · no wording fit inside the budget.');
        }},
    {id: 'tend', label: 'Look for someone worth tending', detail: 'The brewer searches the bench for a body they can tend in five minutes, within a small budget.',
        run(e) {
            const ids = ['caster', 'brewer', 'shield', 'diver'];
            const out = searchForActor({actor: 'brewer', at: e.world.clock, known: ref => held(e)[ref.id] ?? null, budget: {trials: 3, steps: 99},
                candidates: ids.map(id => ({law: tendLaw, method: tendMethod, bindings: {patient: {kind: 'body', id}}}))});
            const names = out.options.map(row => ids[row.candidate]);
            return note(e, 'tend', `Search · tried ${out.visited} of ${ids.length}${out.truncated ? ' before the budget ran out' : ''}; ${names.length ? `${names.join(' and ')} could be tended` : 'no one needs tending'}.`);
        }},
];

function actions(engine) {
    const finished = done(engine);
    return ACTS.map(({id, label, detail}) => ({id, label, detail, reason: finished[id] ? 'You have seen this.' : undefined}));
}
function view(engine) {
    const lines = log(engine);
    return {facts: [['Time', `${engine.world.clock} min`], ['Seen', `${lines.length} of ${ACTS.length}`],
        ['Brewer vitality', String(q(engine, 'brewer', 'vitality'))], ['Adept sea', `${sea(engine)} motes`]],
    actions: actions(engine), result: lines.at(-1), history: lines};
}
function act(engine, id) {
    const found = ACTS.find(a => a.id === id);
    if (!found || done(engine)[id]) return engine;
    return found.run(engine);
}

export const effectsWorkshopRun = {
    title: 'Workshop · Effects',
    introduction: 'A bench, a pond, an aisle of old crates, a Gu adept and a ward. Press an act and read what each effect pack does to the world.',
    create, restore: saved => restoreEngineWorld(saved, config), view, act,
};
