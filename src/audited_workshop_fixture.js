// Original reversible ITR-P2 choice: a stationary ordinary frame at the
// existing Village fitting bench. Plain definitions and pure facts only.
import {FEATURE_OBJECT_IDS as O, FEATURE_OBJECT_KEYS as OK} from './feature_expansion_objects.js';
import {assert, natural, record} from './simulation_contracts.js';

export const AUDITED_FIXTURE_IDS = Object.freeze({
    world: O.world, eda: O.miri, site: O.site, situation: O.situation,
    group: 'audit_fixture', commandType: 'audit_workshop',
    enroll: 'audit_fixture.enroll', build: 'audit_fixture.build', kits: 'audit_fixture.bind_kits',
});
const I = AUDITED_FIXTURE_IDS, prefix = 'audit_fixture.';
export const AUDITED_FIXTURE_KEYS = Object.freeze({
    log: OK.log, rope: JSON.stringify({id: 'Survey rope'}), sap: OK.sap, sound: OK.sound, kit: OK.kit,
});
const K = AUDITED_FIXTURE_KEYS;
const eq = (fact, value = true, reason) => ({fact, op: 'eq', value, ...(reason ? {reason} : {})});
const all = (...rules) => ({all: rules}), not = rule => ({not: rule});
const af = (key, value = true) => ({type: 'fact', actor: 'player', scope: 'actor', key: `${prefix}${key}`, value});
const wf = (key, value) => ({type: 'world', worldId: I.world, key: `${prefix}${key}`, value});
const item = (key, amount) => ({type: 'item', actor: 'player', key, amount});
const stamina = amount => ({type: 'vital', actor: 'player', key: 'stamina', amount});
const money = amount => ({type: 'resource', actor: 'player', native: true, key: 'money', amount});
const payEda = amount => ({type: 'resource', actor: I.eda, key: 'coins', amount});
const know = (key, text, stage = 'seen', actor = 'player', attributedTo = I.eda, kind = 'instruction') => ({
    type: 'knowledge', actor, key: `${prefix}${key}`, stage, value: text,
    basis: {kind, attributedTo, situationId: I.situation},
});
const live = all(
    eq('reference.workshop.supported', true, 'Return to the Village with your supported living native body, stock and local clock.'),
    eq('reference.workshop.handsUsable', true, 'Recover your actual hands before constructing or using the frame.'),
    {fact: 'vital.health', op: 'gte', value: 2, reason: 'Recover above one HP before bench work.'},
);
const eda = eq('reference.workshop.edaPresent', true, 'Eda must be present and willing, with her own living usable body and free attention.');
const sitePresent = eq('audit.fixture.sitePresent', true, 'Use Eda\'s actual commissioned Village fitting bench.');
const enrolled = eq('audit.fixture.enrolled', true, 'Hear and accept Eda\'s ordinary frame terms first.');
const access = eq('audit.fixture.siteAccess', true, 'Keep the agreed right to use this particular retained fitting bench.');
const unbuilt = not(eq('audit.fixture.built'));
const buildSupport = all(live, enrolled, access, eda, unbuilt);
const kitSupport = all(live, enrolled, access, eq('audit.fixture.built', true, 'Complete the actual frame before binding kits.'));
const command = definition => ({revision: 1, worldId: I.world, actorId: 'player', location: 'Village', group: I.group,
    costs: [], effects: [], ...definition});
const job = (duration, support) => ({duration, cancellation: 'refund', siteId: I.site,
    completionRequires: support, completionFailure: 'refund'});

export const auditedFixtureDefinitions = {
    commands: [
        command({id: I.enroll, label: 'Hear Eda\'s ordinary frame terms · free, optional', once: true,
            targetId: I.eda, coLocated: true, participants: ['$target'], siteId: I.site,
            visibleWhen: eq('actor.feature_objects.jointInspected'),
            requires: all(live, sitePresent, eda, eq('actor.feature_objects.jointInspected'), not(enrolled)),
            effects: [af('enrolled'), af('termsRevision', 1), af('access', I.site),
                know('terms', 'Eda permits one stationary clamping frame at her existing Village fitting bench. Construction reserves two Rough wood logs, one owned Survey rope, three native coins, two of your stamina and five played minutes with Eda. On completion those materials stay in the frame and the three coins enter her purse. Your retained bench right then permits independent ordinary joining: one Tree sap, two Sound repair staves, two stamina and six played minutes make two existing Prepared survey kits. Cancellation or lost completion support returns the actual reserved inputs and creates no result. This explanation supplies neither materials nor an executable cooling source.', 'understood'),
                know('permission', 'I consent to the traveler commissioning one stationary frame at my existing fitting bench for the stated three-coin fee and supplied wood and rope. Once completed, I permit independent ordinary joining at this same bench under the disclosed material and effort terms.', 'seen', I.eda)],
            description: 'Optional free agreement after firsthand joint inspection. The frame stays at this Village bench. Construction is a separate paid choice; ordinary fitting-knife and conserved cooling-sleeve routes remain available.'}),
        command({id: I.build, label: 'Commission the clamping frame · 2 logs + 1 Survey rope + 3 coins + 2 stamina + 5 min', once: true,
            targetId: I.eda, coLocated: true, participants: ['$target'], visibleWhen: all(enrolled, unbuilt),
            requires: buildSupport, ...job(5, buildSupport), completionCoLocated: true,
            costs: [item(K.log, -2), item(K.rope, -1), money(-3), stamina(-2)],
            effects: [payEda(3), wf('frame', I.site), wf('builder', 'player'),
                know('built', 'You and willing Eda completed one clamping frame at her existing Village fitting bench. Two actual Rough wood logs and one owned Survey rope were consumed into that stationary frame. Three native coins entered Eda\'s purse; your two stamina and five played minutes were spent. The agreed bench right now supports independent ordinary joining.', 'seen', 'player', 'player', 'observation'),
                know('commission', 'I completed the traveler\'s agreed Village frame commission. Their two logs and one rope became the frame at my fitting bench, and their three native coins entered my purse. The traveler retains the disclosed independent ordinary-use right.', 'seen', I.eda, I.eda, 'observation')],
            description: 'Reserve the real bench and Eda\'s attention. Completion rechecks both bodies, present consent, co-location and bench access; cancellation or lost support refunds the reserved wood, rope, coins and stamina. Build once; no loose frame item or extra stock is granted.'}),
        command({id: I.kits, label: 'Bind two kits on your ordinary frame · 1 sap + 2 sound staves + 2 stamina + 6 min',
            visibleWhen: all(enrolled, eq('audit.fixture.built')), requires: kitSupport, ...job(6, kitSupport),
            costs: [item(K.sap, -1), item(K.sound, -2), stamina(-2)],
            effects: [item(K.kit, 2), know('kits', 'Your retained Village frame held two actual Sound repair staves while one Tree sap set over six played minutes. You spent two stamina and produced two existing Prepared survey kits. The frame remains at the same fitting bench; these native kits can supply the ordinary field commission, crossing preparation, trade or Eda\'s finite orders.', 'seen', 'player', 'player', 'observation')],
            description: 'Independent ordinary joining uses the completed stationary frame and your current usable hands. This job requires no Eda participation, cooling sleeve, charged source or learned power. Cancellation or lost bench/body support returns the reserved sap, staves and stamina and produces no kits.'}),
    ],
};

// The parent supplies freshly computed reference.workshop.* facts on every
// admission and settlement. Do not import the simulation executor here.
export function auditedFixtureFacts(state, context = {}) {
    const s = state.simulation, actor = state.actors?.player, f = actor?.facts || {}, done = actor?.completed || {};
    const bench = s?.sites?.[I.site], eda = s?.people?.[I.eda];
    const site = !!bench && bench.owner === I.eda && bench.capacity === 1 && eda?.definitionId === I.eda && state.actors?.[I.eda]?.worldId === I.world;
    const terms = s?.knowledge?.player?.[`${prefix}terms`];
    const accepted = f[`${prefix}enrolled`] === true && f[`${prefix}termsRevision`] === 1 && done[I.enroll] === 1 && terms?.stage === 'understood';
    const built = state.worlds?.[I.world]?.facts?.[`${prefix}frame`] === I.site &&
        state.worlds?.[I.world]?.facts?.[`${prefix}builder`] === 'player' && done[I.build] === 1;
    const count = natural(done[I.kits]) ? done[I.kits] : 0;
    return {
        'audit.fixture.sitePresent': site,
        'audit.fixture.enrolled': accepted,
        'audit.fixture.siteAccess': accepted && site && f[`${prefix}access`] === I.site &&
            (context.actorId || 'player') === 'player' && actor?.worldId === I.world,
        'audit.fixture.built': accepted && built,
        'audit.fixture.kitsMade': count <= Number.MAX_SAFE_INTEGER / 2 ? count * 2 : 0,
    };
}

const same = (a, b) => {
    if(a === b) return true;
    if(Array.isArray(a) || Array.isArray(b)) return Array.isArray(a) && Array.isArray(b) && a.length === b.length && a.every((v, i) => same(v, b[i]));
    if(!record(a) || !record(b)) return false;
    const keys = Object.keys(a);
    return keys.length === Object.keys(b).length && keys.every(k => Object.hasOwn(b, k) && same(a[k], b[k]));
};
const count = (done, id) => done[id] == null ? 0 : done[id];
const causeSequence = cause => /^simulation:[1-9][0-9]*$/.test(cause || '') ? Number(cause.slice(11)) : NaN;
const definitionFor = id => auditedFixtureDefinitions.commands.find(d => d.id === id);
function receipt(state, commandId, key, actor = 'player') {
    const expected = definitionFor(commandId).effects.find(e => e.type === 'knowledge' && e.key === `${prefix}${key}` && e.actor === actor);
    const actual = state.simulation?.knowledge?.[actor]?.[`${prefix}${key}`], sequence = causeSequence(actual?.cause);
    assert(actual && actual.stage === expected.stage && actual.value === expected.value && same(actual.basis, expected.basis) &&
        natural(actual.at) && actual.at <= state.clock && natural(sequence) && sequence > 0 && sequence <= state.sequence,
        'The ordinary frame lost its actual attributed completion receipt.');
    return {...actual, sequence};
}

// Bind optional typed facts and exact frozen reservations to their revision1
// commands. Current bag counts may legitimately change after consuming kits;
// they are never reconstructed from receipts or awarded during validation.
export function validateAuditedFixture(state, registry) {
    const s = state.simulation, a = state.actors?.player, f = a?.facts || {}, done = a?.completed || {}, world = state.worlds?.[I.world]?.facts || {};
    const jobs = (s?.jobs || []).filter(j => j.commandId?.startsWith(prefix));
    const actorKeys = Object.keys(f).filter(k => k.startsWith(prefix)), worldKeys = Object.keys(world).filter(k => k.startsWith(prefix));
    const completions = Object.keys(done).filter(k => k.startsWith(prefix));
    const relatedKnowledge = Object.entries(s?.knowledge || {}).flatMap(([actor, entries]) =>
        Object.keys(entries).filter(k => k.startsWith(prefix)).map(key => [actor, key]));
    if(!actorKeys.length && !worldKeys.length && !completions.length && !jobs.length && !relatedKnowledge.length) return;
    assert([9, 10, 11].includes(state.schema) && state.referenceGameplay?.schema === 1 && s?.schema >= 4,
        'Optional ordinary frame work requires its supported expansion9/10 and existing simulation4 reader. Preserve the original save.');
    assert(actorKeys.length === 3 && actorKeys.every(k => ['enrolled', 'termsRevision', 'access'].map(n => `${prefix}${n}`).includes(k)) &&
        f[`${prefix}enrolled`] === true && f[`${prefix}termsRevision`] === 1 && f[`${prefix}access`] === I.site,
        'Unsupported ordinary frame terms or site right.');
    assert(completions.every(id => !!definitionFor(id)) && relatedKnowledge.every(([actor, key]) =>
        (actor === 'player' && ['terms', 'built', 'kits'].includes(key.slice(prefix.length))) ||
        (actor === I.eda && ['permission', 'commission'].includes(key.slice(prefix.length)))), 'Unsupported ordinary frame receipt fields.');
    const enrollCount = count(done, I.enroll), buildCount = count(done, I.build), kitCount = count(done, I.kits);
    assert(enrollCount === 1 && [0, 1].includes(buildCount) && natural(kitCount) && kitCount <= Math.floor(Number.MAX_SAFE_INTEGER / 2),
        'Ordinary frame enrollment and construction are exact once; kit output is two per actual completion.');
    assert(a.worldId && s.people?.[I.eda]?.definitionId === I.eda && s.people[I.eda].inventory === 'simulation' &&
        state.actors?.[I.eda]?.worldId === I.world && record(s.owners?.[I.eda]) && natural(state.actors[I.eda].resources?.coins) &&
        s.sites?.[I.site]?.owner === I.eda && s.sites[I.site].capacity === 1,
        'The ordinary frame requires its retained real Eda stock, purse and Village bench.');
    for(const d of auditedFixtureDefinitions.commands) if(registry) {
        assert(same(registry.simulation?.commands?.get(d.id), d), 'Unsupported current ordinary frame command revision or conserved recipe.');
    }
    const terms = receipt(state, I.enroll, 'terms'), permission = receipt(state, I.enroll, 'permission', I.eda);
    let built;
    assert(terms.cause === permission.cause && terms.at === permission.at && f['feature_objects.jointInspected'] === true,
        'Ordinary frame enrollment requires Eda\'s actual matching permission and the earned firsthand inspection.');
    if(buildCount === 1) {
        assert(worldKeys.length === 2 && world[`${prefix}frame`] === I.site && world[`${prefix}builder`] === 'player',
            'Construction materials must remain in the one actual Village frame.');
        built = receipt(state, I.build, 'built');
        const commission = receipt(state, I.build, 'commission', I.eda);
        assert(built.cause === commission.cause && built.at === commission.at && built.sequence > terms.sequence && built.at >= terms.at + 5,
            'The built frame and Eda\'s paid commission need the same later five-minute completion.');
        if(kitCount > 0) {
            const kits = receipt(state, I.kits, 'kits');
            assert(kits.sequence > built.sequence && kitCount <= Math.floor((kits.at - built.at) / 6),
                'Each ordinary kit completion requires a later paid six-minute frame job.');
        } else assert(!s.knowledge.player?.[`${prefix}kits`], 'Ordinary kits have no completed material transformation.');
    } else assert(!worldKeys.length && kitCount === 0 && !s.knowledge.player?.[`${prefix}built`] &&
        !s.knowledge.player?.[`${prefix}kits`] && !s.knowledge[I.eda]?.[`${prefix}commission`], 'An unfinished frame grants no fixture, paid commission or kits.');
    assert(jobs.length <= 1, 'Only one current player frame job can reserve this bench.');
    for(const j of jobs) {
        const d = definitionFor(j.commandId), participants = j.commandId === I.build ? ['player', I.eda] : ['player'];
        assert(d && j.commandId !== I.enroll && j.revision === 1 && j.actorId === 'player' && j.targetId === (d.targetId || null) &&
            j.siteId === I.site && j.cancellation === 'refund' && j.reservationReturns === 1 && same(j.costs, d.costs) && same(j.effects, d.effects) &&
            same(j.participants, participants) && same(j.context, {actorId: 'player', targetId: d.targetId || null, partyIds: j.context?.partyIds}) &&
            Array.isArray(j.context.partyIds) && natural(j.sequence) && j.sequence <= state.sequence &&
            j.sequence === causeSequence(j.id) && j.sequence > (built?.sequence || terms.sequence) &&
            natural(j.due) && j.due >= state.clock && j.due <= state.clock + d.duration &&
            j.due >= (built?.at ?? terms.at) + d.duration &&
            same(j.completionSupport, {schema: 1, requires: d.completionRequires, coLocated: !!d.completionCoLocated, location: 'Village', failure: 'refund'}) &&
            s.sites[I.site].reservations?.[j.id] === 'player', 'Ordinary frame work lost its exact refundable inputs, conserved result or completion support.');
        assert(j.commandId === I.build ? buildCount === 0 : buildCount === 1, 'Ordinary frame work cannot duplicate construction or use an unfinished fixture.');
    }
}
