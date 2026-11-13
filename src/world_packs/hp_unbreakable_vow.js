// PC95 / KW36–KW39. The ritual checks the participants; the engine owns
// the accepted duty, its making price and its later settlement.
import {makeEngineBinding} from '../engine_world.js';
import {sameStructural} from '../basics.js';
import {sentenceFromIntent, speechObstruction} from '../spell_effects.js';
import {labelSpellRow} from '../spell_grammar.js';
import {HP_SPELL_ROWS, HP_SPELL_WORLD} from '../spell_pack_hogwarts.js';
import {voiceBlocker} from '../world_effects.js';
import {WORLD_QUANTITIES} from '../world_quantities.js';

export function sealVowClause(engine, {proposer, vower, bonder, wand, clause, assent}) {
    const {world} = engine;
    const participants = [proposer, vower, bonder];
    const people = participants.map(id => world.holders[id]);
    const refuse = reason => ({engine, ok: false, reason});
    if (new Set(participants).size !== 3 ||
        people.some(body => body?.kind !== 'body' || !body.place || body.place !== people[0]?.place ||
            body.properties.mind_awake !== true || body.properties.alive === false || body.quantities.vitality <= 0))
        return refuse('participants-unavailable');
    if (!clause || assent?.by !== vower || assent.accepted !== true || !sameStructural(assent.clause, clause))
        return refuse('clause-not-assented');
    if (people.slice(0, 2).some(body => speechObstruction(body.properties, !!voiceBlocker(world, body.id))))
        return refuse('speech-obstructed');
    const implement = world.holders[wand];
    if (implement?.kind !== 'thing' || implement.place !== people[2].place ||
        !implement.properties.marks?.includes(`grip:${bonder}`))
        return refuse('bonder-wand-unavailable');
    if (engine.records.bindings.some(binding => binding.id === clause.id)) return refuse('clause-already-sealed');
    // A local ritual dial. Check that this participant can pay the making
    // price before calling the shared binding owner, whose default can settle debt.
    const effort = 2;
    if (!(people[2].quantities.stamina >= effort)) return refuse('bonder-effort-unavailable');
    if (!Number.isSafeInteger(people[1].quantities.vitality) || !Number.isSafeInteger(clause.by) || clause.by <= world.clock ||
        typeof clause.match?.method !== 'string' || !Object.values(clause.match.roles ?? {}).includes(vower))
        return refuse('duty-unavailable');
    return {ok: true, engine: makeEngineBinding(engine, {
        id: clause.id, sides: {a: vower, b: proposer}, enforce: 'penalize',
        standing: {start: 1, max: 1, breachLoss: 'all'},
        price: {cause: 'unbreakable-vow-sealed', effects: [], costs: [{quantity: 'stamina', amount: effort}]},
        terms: [{id: 'duty', owes: 'a', kind: 'require', match: clause.match, by: clause.by,
            penalty: {cause: 'unbreakable-vow-broken', effects: [
                {op: 'set', holder: vower, quantity: 'vitality', amount: 0},
                {op: 'property', holder: vower, property: 'alive', value: false},
                {op: 'property', holder: vower, property: 'mind_awake', value: false},
            ]}}],
    }, {by: bonder})};
}

export function coverageCase(id) {
    if (id !== 'vow') throw Error(`Unknown Vow case ${id}.`);
    const body = id => ({id, kind: 'body', place: 'room',
        properties: {mind_awake: true}, quantities: {stamina: 6, vitality: 10}});
    const clause = (id, method, by) => ({id, match: {method, op: 'add.implement.grip', roles: {'t0.caster': 'vower'}}, by});
    const seal = (clause, accepted) => ({proposer: 'proposer', vower: 'vower', bonder: 'bonder', wand: 'wand',
        clause, assent: {by: 'vower', clause: structuredClone(clause), accepted}});
    const lumos = HP_SPELL_ROWS.find(row => row.id === 'light');
    const light = {family: 'spell', id: 'light', method: 'vow.light', payer: 'vower', spells: [{
        sentence: sentenceFromIntent(labelSpellRow(lumos, HP_SPELL_WORLD).parts),
        grip: {caster: 'vower', implement: 'vower-wand'}, target: {id: 'vower-wand'}, minutes: 1, requiresSpeech: true,
        details: {amount: 20, cost: 1},
    }]};
    const stamina = (holder, to) => ({holder, quantity: 'stamina', direction: 'down', to});
    const vitality = (direction, to) => ({holder: 'vower', quantity: 'vitality', direction, to});
    return {basis: 'authored',
        world: {holders: [{id: 'room', kind: 'place'}, body('proposer'), body('vower'), body('bonder'),
            {id: 'wand', kind: 'thing', place: 'room', properties: {marks: ['grip:bonder']}},
            {id: 'vower-wand', kind: 'thing', as: ['implement'], place: 'room',
                properties: {marks: ['grip:vower']}, quantities: {'light:wand': 0}}]},
        engine: {packs: ['a.mind'],
            shared: {quantities: [
                {id: 'stamina', unit: 'effort', min: 0, max: 10},
                ...Object.values(WORLD_QUANTITIES),
            ]}, host: {keys: {light: 'wand'}, costs: {accounts: {stamina: {quantity: 'stamina'}}}}},
        timeline: [
            {id: 'refuse', sealVowClause: seal(clause('refused', 'vow.unspoken', 2), false), refusal: 'clause-not-assented'},
            {id: 'agree', sealVowClause: seal(clause('agreed', 'vow.light', 3), true), expect: [stamina('bonder', 4)]},
            {id: 'restore-agreement', restore: true},
            {id: 'second-agreement', sealVowClause: seal(clause('second', 'vow.second', 5), true), expect: [stamina('bonder', 2)]},
            {id: 'light', working: light},
            {id: 'first-deadline', advanceTo: 3, expect: [stamina('vower', 5), vitality('unchanged', 10)]},
            {id: 'restore-before-breach', restore: true},
            {id: 'missed-duty', advanceTo: 5, expect: [vitality('down', 0)]},
            {id: 'restore-after-breach', restore: true},
            {id: 'after', working: {...light, id: 'after-breach'}},
            {id: 'attempt', advanceTo: 9, interruption: {working: 'after-breach', reason: 'The caster is unconscious.'},
                expect: [vitality('unchanged', 0), {holder: 'vower', quantity: 'stamina', direction: 'unchanged', to: 5}]},
        ],
        expect: [stamina('bonder', 2), stamina('vower', 5), vitality('down', 0),
            {holder: 'vower', property: 'alive', direction: 'changed', to: false},
            {holder: 'vower', property: 'mind_awake', direction: 'changed', to: false},
            {holder: 'vower-wand', quantity: 'light:wand', direction: 'up', to: 20}],
    };
}
