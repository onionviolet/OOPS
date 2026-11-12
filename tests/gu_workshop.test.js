import assert from 'node:assert/strict';
import test from 'node:test';
import {readFileSync} from 'node:fs';
import {guWorkshopCases, runGuCoordination, runGuWorkshop} from '../src/gu_workshop.js';
import {resolveGuActivation} from '../src/gu_activation.js';
import {searchGuMoves} from '../src/gu_move_search.js';
import {beginSustainedGu, renewSustainedGu} from '../src/gu_sustain.js';
import {beginGuProjection, borrowGuMilestone, invokeProjectedGu, recordGuMilestone} from '../src/gu_projection.js';
import {recordGuAidMilestone, requestProjectedGuAid} from '../src/gu_cooperation.js';
import {detectGuApproach, readGuSignals} from '../src/gu_senses.js';
import {captureFleeingGu, fleeingGu, guFlightStatus, startGuFlight} from '../src/gu_flight.js';
import {observeGuCloak, resolveGuCloak} from '../src/gu_concealment.js';
import {bindGuMove} from '../src/gu_move_roles.js';
import {littleLightMoonblade, littleLightSupport, moonlightBlade} from '../src/gu_ability_profiles.js';
import {restoreCreatureLifecycle} from '../src/creature_lifecycle.js';
import {resolveGuDefense} from '../src/gu_defense.js';
import {deriveGuCondensation} from '../src/gu_condensation.js';
import {castGiantHandVariant, castGiantHandWard, castRevisedGiantHand, prepareGiantHandPhantoms, releasePreparedGiantHand,
    searchGiantHandVariants, searchGiantHandWard} from '../src/gu_giant_hand.js';

const {moves} = JSON.parse(readFileSync(new URL('../docs/research/gu-identity-evidence.json', import.meta.url)));

test('Giant Hand selects distinct Group Strength specimens and rechecks the written pair', () => {
    const groups = [{id: 'first', cost: 1, gather: 2}, {id: 'second', cost: 1, gather: 2}, {id: 'focused', cost: 2, gather: 3}];
    const input = {myriadId: 'myriad', groups, day: 3, essence: 3, beads: 1};
    const options = searchGiantHandVariants(input);
    assert.equal(options.length, 3);
    assert.deepEqual(options.map(row => [row.force, row.essence]).sort(), [[4, 2], [5, 3], [5, 3]]);
    assert.deepEqual(searchGiantHandVariants({...input, groups: [groups[2]]}), []);
    const plan = options.find(row => row.supports.includes('second') && row.supports.includes('focused'));
    assert.equal(castGiantHandVariant({...input, groups: groups.slice(0, 2)}, plan.binding).outcome, 'interrupted');
    const trial = castGiantHandVariant(input, plan.binding);
    assert.equal(trial.effects.at(-1).magnitude, 5);
    const revised = moves.find(row => row.id === 'giant-hand-condensed-core');
    assert.deepEqual([...new Set(trial.activations.map(row => row.kind))], revised.roles.map(role => role.kind));
});

test('Giant Hand ward search quotes a stronger binding only with a funded Self Strength', () => {
    const input = {myriadId: 'myriad', groupIds: ['group-a', 'group-b'], selfId: 'self', day: 3, essence: 2, beads: 2};
    const options = searchGiantHandWard(input).sort((a, b) => a.force - b.force);
    assert.deepEqual(options.map(({force, beads, essence, breaks}) => [force, beads, essence, breaks]),
        [[4, 1, 2, false], [6, 2, 2, true]]);
    assert.deepEqual(searchGiantHandWard({...input, beads: 1}).map(row => row.force), [4]);
    assert.deepEqual(searchGiantHandWard({...input, selfId: null}).map(row => row.force), [4]);
    assert.deepEqual(searchGiantHandWard({...input, groupIds: ['group-a']}), []);
    const result = castGiantHandWard(input, options[1].binding);
    assert.equal(result.effects.at(-1).magnitude, 6);
    assert.equal(result.remaining.player['red-date'], 0);
});

test('Giant Hand gathers phantoms through the same supports in both forms', () => {
    const groupIds = ['group-a', 'group-b'];
    const {held, remaining} = prepareGiantHandPhantoms({selfId: 'self', supportId: 'older-lot', day: 10, essence: 3});
    assert.deepEqual(remaining.player, {'red-date': 0, primeval: 2});
    const request = {held, boundIds: groupIds, groupIds, day: 39, essence: 2};
    const older = releasePreparedGiantHand(request);
    assert.equal(releasePreparedGiantHand({...request, day: 40}).reason, 'held effect expired');
    const missed = releasePreparedGiantHand({...request, groupIds: groupIds.slice(0, 1)});
    assert.equal(missed.outcome, 'interrupted');
    assert.equal(missed.remaining.player.primeval, 2);
    const revised = castRevisedGiantHand({myriadId: 'myriad', groupIds, day: 10, essence: 2});
    assert.deepEqual(older.effects.at(-1), {kind: 'giant-hand', magnitude: 4});
    assert.deepEqual(revised.effects.at(-1), older.effects.at(-1));
    assert.equal(revised.activations[0].id, 'myriad');
    assert.equal(revised.activations[0].cost, 1);
});

test('a condensation profile preserves a measured result within the product’s capacity', () => {
    const profile = {sourceEffect: 'lower-beam', measure: 'load', effect: 'lower-beam', capacity: 2,
        fuel: 'primeval', cost: 2, recipe: {id: 'beam-catch'}};
    const derive = (outcome, load) => deriveGuCondensation({profile, witness: {outcome, effects: [{kind: 'lower-beam', load}]}});
    assert.throws(() => derive('interrupted', 3), /complete the source move/i);
    assert.deepEqual(derive('complete', 1).ability.effect, {kind: 'lower-beam', magnitude: 1});
    assert.deepEqual(derive('complete', 3).ability.effect, {kind: 'lower-beam', magnitude: 2});
});

test('witnessed Gu aid borrows the historical visitor and its single meal', () => {
    const agreement = {actor: 'keeper', body: 'keeper.first-body'};
    const milestone = recordGuAidMilestone({id: 'first-visit', operator: 'keeper', at: 5,
        gu: {id: 7, kind: 'moth', rank: 1}, agreement,
        ability: {fuel: 'meal', cost: 1, effect: {kind: 'light', magnitude: 1}}, reserve: 1});
    const opening = {milestone, operator: 'keeper', anchor: 'seal', now: 5, duration: 10, rankLimit: 1};
    assert.throws(() => borrowGuMilestone(opening), /earlier/);
    const projection = JSON.parse(JSON.stringify(borrowGuMilestone({...opening, now: 6})));
    const request = {projection, operator: 'keeper', anchor: 'seal', now: 6, kind: 'moth'};
    assert.equal(requestProjectedGuAid({...request, visitor: {...agreement, body: 'keeper.second-body'}}), null);
    assert.equal(projection.reserves.meal, 1);
    const result = requestProjectedGuAid({...request, visitor: agreement});
    assert.equal(result.activations[0].id, 7);
    assert.equal(result.projection.reserves.meal, 0);
});
import {runGuProcedureFollowup, searchGuProcedures} from '../src/gu_procedures.js';

test('a held Gu effect reaches the support beat until its exact expiry', () => {
    const recipe = {roles: [{id: 'catch', fn: 'catch'}], beats: [{roles: ['catch']}],
        completion: effects => ({kind: 'lower', load: effects.reduce((sum, row) => sum + row.magnitude, 0)})};
    const stage = {gu: {id: 'woven', kind: 'catch-gu', rank: 1, fedThrough: 20}, operator: 'keeper',
        ability: {fn: 'catch', fuel: 'primeval', cost: 2, effect: {kind: 'support', magnitude: 2}}};
    const request = {recipe, held: {at: 10, expiresAt: 20, effect: {kind: 'core', magnitude: 1}},
        binding: {catch: {id: 'woven', operator: 'keeper'}}, reserves: {keeper: {primeval: 2}}, day: 19};
    const missed = runGuProcedureFollowup({...request, available: []});
    assert.equal(missed.outcome, 'interrupted');
    assert.equal(missed.remaining.keeper.primeval, 2);
    assert.equal(runGuProcedureFollowup({...request, day: 20, available: [stage]}).reason, 'held effect expired');
    const completed = runGuProcedureFollowup({...request, available: [stage]});
    assert.deepEqual(completed.effects.at(-1), {kind: 'lower', load: 3});
    assert.equal(completed.remaining.keeper.primeval, 0);
});

test('optional Gu roles can produce a useful subset or no procedure at all', () => {
    const recipe = {roles: [{id: 'outer', kind: 'water-shield', optional: true}, {id: 'inner', kind: 'white-jade', optional: true}],
        beats: [{roles: ['outer', 'inner']}]};
    const request = {recipe, day: 0, reserves: {keeper: {primeval: 2}}};
    const water = {gu: {id: 'loan', kind: 'water-shield', rank: 2, fedThrough: 0},
        ability: {fuel: 'primeval', cost: 2, effect: {kind: 'guard', magnitude: 5}}, operator: 'keeper'};
    assert.deepEqual(searchGuProcedures({...request, available: []}).options, []);
    const {options} = searchGuProcedures({...request, available: [water]});
    assert.equal(options.length, 1);
    assert.deepEqual(options[0].binding, {outer: {id: 'loan', operator: 'keeper'}, inner: null});
    assert.equal(options[0].result.remaining.keeper.primeval, 0);
});

test('ordered Gu layers share capacity across matching packets and leave uncovered impact intact', () => {
    const damage = [{type: 'lightning', phase: 'blast', amount: 3}, {type: 'lightning', phase: 'blast', amount: 6},
        {type: 'bludgeoning', phase: 'landing', amount: 4}];
    const water = {id: 'water', type: 'lightning', phase: 'blast', capacity: 5, breaks: true};
    const jade = {id: 'jade', type: 'lightning', phase: 'blast', capacity: 2};
    const armor = {id: 'scale', type: 'bludgeoning', phase: 'landing', capacity: 3};
    const layered = resolveGuDefense(damage, [water, jade]);
    assert.deepEqual(layered.remainder.map(packet => packet.amount), [0, 2, 4]);
    assert.deepEqual(layered.layers, [{id: 'water', absorbed: 5, broken: true}, {id: 'jade', absorbed: 2, broken: false}]);
    assert.deepEqual(resolveGuDefense(damage, [water, jade, armor]).remainder.map(packet => packet.amount), [0, 2, 1]);
    assert.deepEqual(resolveGuDefense(damage, [jade]).remainder.map(packet => packet.amount), [1, 6, 4]);
});
import {quoteGuFuel} from '../src/gu_fuel.js';

test('middle-stage green copper changes the Moonblade and keeps its rank-one funding gap on rank two', () => {
    const supply = {pool: 'middle-copper', family: 'primeval', rank: 1, stage: 'middle', source: 'condensed'};
    const result = resolveGuActivation({stages: [{gu: {id: 'moon', kind: 'moonlight', rank: 1, fedThrough: 0},
        operator: 'keeper', ability: moonlightBlade, supply}], reserves: {keeper: {'middle-copper': 1}}, day: 0});
    assert.equal(result.activations[0].cost, 1);
    assert.equal(result.effects[0].magnitude, 2);
    const rankTwo = quoteGuFuel(moonlightBlade, {rank: 2}, supply);
    assert.equal(rankTwo.funding.gap, 1);
    assert.equal(rankTwo.factor, 2);
});

test('Soaring Fighting Spirit can fail after the Fight Gu charge and report damage to the right targets', () => {
    const stage = (id, fuel, cost) => ({
        gu: {id, kind: id, alive: true, fedThrough: 0}, operator: 'fang-yuan', ability: {fuel, cost},
    });
    const supports = [stage('wisdom-support-a', 'primeval', 1), stage('wisdom-support-b', 'primeval', 1)];
    const fight = stage('fight', 'red-date', 3);
    const backlash = [
        ...supports.map(({gu}) => ({kind: 'destroy-gu', target: gu.id})),
        {kind: 'injury', target: 'fang-yuan', aspect: 'soul', severity: 'severe'},
        {kind: 'injury', target: 'fang-yuan', aspect: 'mind', severity: 'severe'},
        {kind: 'injury', target: 'fang-yuan', aspect: 'body', severity: 'mild'},
    ];
    const request = {
        day: 0, reserves: {'fang-yuan': {primeval: 4, 'red-date': 3}},
        beats: [{stages: supports}, {stages: [fight], backlash}], completionEffect: {kind: 'restore-fighting-spirit'},
    };
    const failed = resolveGuActivation({...request, controlFailedAt: 1});
    assert.deepEqual(failed.remaining['fang-yuan'], {primeval: 2, 'red-date': 0});
    assert.deepEqual(failed.effects, []);
    assert.deepEqual(failed.backlash, backlash);
    const interrupted = resolveGuActivation({...request, reserves: {'fang-yuan': {primeval: 4, 'red-date': 2}},
        controlFailedAt: 1});
    assert.equal(interrupted.backlash, undefined);
    assert.equal(interrupted.remaining['fang-yuan']['red-date'], 2);
    const completed = resolveGuActivation(request);
    assert.deepEqual(completed.effects, [{kind: 'restore-fighting-spirit'}]);
    assert.equal(completed.backlash, undefined);
});

test('Rainbow Light with Light Source costs less to sustain and ends when live custody or fuel fails', () => {
    const support = {gu: {id: 'source', kind: 'light-source', holder: 'wei-yang', fedThrough: 0},
        operator: 'wei-yang', ability: {fuel: 'primeval', cost: 1, modifier: {property: 'cost', path: 'light', factor: 0.5}}};
    const core = {gu: {id: 'rainbow', kind: 'rainbow-light', holder: 'wei-yang', fedThrough: 0},
        operator: 'wei-yang', ability: {fuel: 'primeval', cost: 6, path: 'light'}};
    const request = {reserves: {'wei-yang': {primeval: 8}}, day: 0, now: 0, interval: 2, effect: {kind: 'movement'}};
    const unassisted = beginSustainedGu({...request, stages: [core]});
    const supported = beginSustainedGu({...request, stages: [support, core]});
    assert.equal(unassisted.remaining['wei-yang'].primeval, 2);
    assert.equal(supported.remaining['wei-yang'].primeval, 4);
    assert.throws(() => beginSustainedGu({...request, stages: [support, core], active: [supported.session]}), /already sustaining/);
    const gu = [support.gu, core.gu];
    const saved = JSON.parse(JSON.stringify(supported));
    const renewed = renewSustainedGu({...saved, reserves: saved.remaining, gu, day: 0, now: 2});
    assert.equal(renewed.session.due, 4);
    assert.equal(renewed.remaining['wei-yang'].primeval, 0);
    const insufficient = renewSustainedGu({...saved, reserves: {'wei-yang': {primeval: 3}}, gu, day: 0, now: 2});
    assert.equal(insufficient.session, null);
    assert.equal(insufficient.remaining['wei-yang'].primeval, 3);
    const transferred = renewSustainedGu({...saved, reserves: saved.remaining,
        gu: [{...support.gu, holder: 'someone-else'}, core.gu], day: 0, now: 2});
    assert.equal(transferred.session, null);
    assert.equal(transferred.reason, 'Gu unavailable');
});

test('ordered activation keeps each operator and fuel distinct, with no final effect on late interruption', () => {
    const stage = (id, operator, fuel, effect) => ({
        gu: {id, kind: id, fedThrough: 1}, operator, ability: {fuel, cost: 1, effect},
    });
    const stages = [
        stage('mortal-support', 'keeper', 'primeval'),
        stage('immortal-core', 'ally', 'immortal', {kind: 'force', magnitude: 3}),
        stage('mind-core', 'keeper', 'mental', {kind: 'influence', magnitude: 2}),
    ];
    const reserves = {keeper: {primeval: 3, mental: 0}, ally: {immortal: 1}};
    const failed = resolveGuActivation({stages, reserves, day: 1});
    assert.equal(failed.id, 'mind-core');
    assert.deepEqual(failed.effects, []);
    assert.deepEqual(failed.remaining, {keeper: {primeval: 2, mental: 0}, ally: {immortal: 0}});
    assert.equal(reserves.ally.immortal, 1, 'the host owns publication');
    const funded = resolveGuActivation({stages, reserves: {...reserves, keeper: {primeval: 3, mental: 1}}, day: 1});
    assert.deepEqual(funded.effects, [{kind: 'force', magnitude: 3}, {kind: 'influence', magnitude: 2}]);
});

test('three heads six arms requires eighteen Gu of the stated ranks across three operators in one beat', () => {
    const source = moves.find(row => row.id === 'three-heads-six-arms');
    const required = source.requires;
    const {operators} = guWorkshopCases['gu-three-heads-six-arms'];
    const result = runGuCoordination({operators});
    assert.equal(result.activations.length, required.specimens);
    assert.equal(new Set(result.activations.map(row => row.operator)).size, required.operators);
    const ranks = operators.flatMap(row => row.ranks);
    assert.equal(Math.min(...ranks), required.minRank);
    assert.equal(Math.max(...ranks), required.maxRank);
    assert.deepEqual(result.effects, [{
        kind: 'merged-body', participants: operators.map(row => row.id), heads: 3, arms: 6,
    }]);
    assert.ok(Object.values(result.remaining).every(pool => pool.primeval === 0));
    assert.throws(() => runGuCoordination({operators: [{...operators[0], ranks}]}),
        /3 cooperating operators/);
    const wrongRank = [{...operators[0], ranks: [required.minRank - 1, ...operators[0].ranks.slice(1)]}, ...operators.slice(1)];
    assert.throws(() => runGuCoordination({operators: wrongRank}), /activation ranks/);
    const [first, second, third] = operators;
    const redistributed = [{...first, ranks: first.ranks.slice(1)}, {...second, reserve: 14,
        ranks: [...second.ranks, first.ranks[0]]}, third];
    assert.equal(runGuCoordination({operators: redistributed}).activations.length, required.specimens);
    const short = [...operators.slice(0, 2), {...operators[2], reserve: 11}];
    const failed = runGuCoordination({operators: short});
    assert.equal(failed.outcome, 'interrupted');
    assert.deepEqual(failed.activations, []);
    assert.deepEqual(failed.effects, []);
    assert.deepEqual(Object.values(failed.remaining).map(pool => pool.primeval), [12, 12, 11]);
});

test('a failed synchronized beat preserves an earlier debit and makes no debit of its own', () => {
    const stage = id => ({gu: {id, fedThrough: 0}, operator: 'keeper', ability: {fuel: 'primeval', cost: 1}});
    const result = resolveGuActivation({day: 0, reserves: {keeper: {primeval: 2}},
        beats: [{stages: [stage('prepare')]}, {stages: [stage('left'), stage('right')]}]});
    assert.equal(result.id, 'right');
    assert.equal(result.remaining.keeper.primeval, 1);
    assert.deepEqual(result.activations.map(row => row.id), ['prepare']);
});

test('cultivated feed makes the same purchased Gu usable after waiting', () => {
    const {actions} = guWorkshopCases['gu-keeper'];
    const fed = runGuWorkshop({actions});
    assert.deepEqual([fed.state.stones, fed.state.petals, fed.state.targetDamage], [7, 6, 2]);
    const hungry = runGuWorkshop({actions: actions.filter(step => step.action !== 'feed')});
    assert.equal(hungry.trace.at(-1).reason, 'needs feeding');
    assert.equal(hungry.state.targetDamage, 0);
});

test('duplicate support spends essence and saturates power while another support discounts the core', () => {
    const [one, two, mixed] = ['gu-keeper', 'gu-variation', 'gu-experiment']
        .map(name => runGuWorkshop(guWorkshopCases[name]));
    assert.deepEqual([one, two, mixed].map(result => result.trace.at(-1).power), [2, 2, 2]);
    assert.deepEqual([one, two, mixed].map(result => result.state.essence), [7, 6, 8]);
});

test('research recovers the sourced support pair and forecasts an original two-support combination', () => {
    const {actions} = guWorkshopCases['gu-move-research'];
    const result = runGuWorkshop({actions});
    const options = result.trace.at(-1).options;
    const sourced = options.find(option => option.supports.length === 1 && option.source === 'chapter 70');
    assert.deepEqual(sourced.supports, [2]);
    assert.deepEqual(sourced.effects, [{kind: 'damage', magnitude: 2, range: 2}]);
    const original = options.find(option => option.supports.length === 2);
    assert.equal(original.source, 'workshop proposal');
    assert.deepEqual(original.activations.at(-1).adjustments.map(row => [row.sourceId, row.property]), [
        [3, 'cost'], [2, 'magnitude'], [2, 'range'],
    ]);
    assert.equal(result.state.essence, 12, 'research forecasts without debiting the reserve');
    const cast = runGuWorkshop({actions: [...actions, {action: 'cast', core: original.core, supports: original.supports}]});
    assert.equal(cast.state.targetDamage, original.effects[0].magnitude);
    assert.equal(cast.state.essence, original.remaining.keeper.primeval);

    const duplicate = runGuWorkshop({actions: [...actions.slice(0, -1),
        {action: 'buy', kind: 'little-light'}, {action: 'research-move'}]});
    assert.ok(duplicate.trace.at(-1).options.every(option => !(option.supports.includes(2) && option.supports.includes(4))));
});

test('the sourced Moonlight pairing binds one of each kind and pays each Gu while doubling size and reach', () => {
    const stage = (id, kind, ability) => ({gu: {id, kind, fedThrough: 0}, operator: 'keeper', ability});
    const moon = stage('moon', 'moonlight', moonlightBlade);
    const first = stage('first', 'little-light', littleLightSupport);
    const second = stage('second', 'little-light', littleLightSupport);
    const other = stage('other', 'other-light', littleLightSupport);
    const bindings = bindGuMove(littleLightMoonblade, [moon, first, second, other]);
    assert.deepEqual(bindings.map(({stages}) => stages.map(row => row.gu.id)), [['first', 'moon'], ['second', 'moon']]);
    const reserves = {keeper: {primeval: 6}};
    const paired = resolveGuActivation({stages: bindings[0].stages, reserves, day: 0});
    const duplicate = resolveGuActivation({stages: [first, second, moon], reserves, day: 0});
    assert.deepEqual(paired.effects, [{kind: 'damage', magnitude: 2, range: 2}]);
    assert.deepEqual(duplicate.effects, paired.effects);
    assert.equal(paired.remaining.keeper.primeval, 1);
    assert.equal(duplicate.remaining.keeper.primeval, 0);
});

test('bounded move search reports a partial search explicitly', () => {
    const available = [
        {gu: {id: 1, kind: 'core', fedThrough: 0}, operator: 'keeper',
            ability: {fuel: 'primeval', cost: 2, effect: {kind: 'damage', magnitude: 1}}},
        {gu: {id: 2, kind: 'support', fedThrough: 0}, operator: 'keeper',
            ability: {fuel: 'primeval', cost: 1, modifier: {kind: 'core', property: 'magnitude', factor: 2}}},
    ];
    const result = searchGuMoves({available, reserves: {keeper: {primeval: 3}}, day: 0, effect: 'damage', trialLimit: 1});
    assert.deepEqual([result.evaluated, result.truncated, result.options.length], [1, true, 1]);
});

test('refinement consumes the actual instances and exposes the new Gu to the same cast action', () => {
    const result = runGuWorkshop(guWorkshopCases['gu-above-rank']);
    assert.deepEqual(result.state.gu.map(gu => [gu.id, gu.kind]), [[4, 'moonglow']]);
    assert.deepEqual(result.state.guHistory.map(gu => [gu.id, gu.fate]), [[1, 'consumed'], [2, 'consumed'], [3, 'consumed']]);
    assert.equal(result.state.targetDamage, 3);
});

test('Moonglow quotes a grade gap on aperture fuel and spends only matching stored fuel when supplied', () => {
    const {actions} = guWorkshopCases['gu-above-rank'];
    const tooSoon = runGuWorkshop({actions: [...actions.slice(0, -3), {action: 'cast', core: 4}]});
    assert.equal(tooSoon.trace.at(-1).reason, 'needs more essence');
    assert.equal(tooSoon.trace.at(-1).attemptedFunding.cost, 10);
    assert.equal(tooSoon.state.essence, 9);

    const aperture = runGuWorkshop(guWorkshopCases['gu-above-rank']);
    const stored = runGuWorkshop(guWorkshopCases['gu-stored-essence']);
    assert.deepEqual([aperture.state.targetDamage, stored.state.targetDamage], [3, 3]);
    assert.deepEqual([aperture.state.essence, stored.state.essence, stored.state.storedEssence], [2, 9, 0]);
    assert.deepEqual([aperture, stored].map(result => {
        const {cost, funding} = result.trace.at(-1).activations[0];
        return [cost, funding.source, funding.gap, funding.controlRisk];
    }), [[10, 'aperture', 1, 0.25], [5, 'stored', 0, 0]]);
});

test('a paid grade-gap failure is repeatable, injures Moonglow and permits recovery with matching fuel', () => {
    const example = guWorkshopCases['gu-above-rank-recovery'];
    const failedActions = example.actions.slice(0, -3);
    const failed = runGuWorkshop({...example, actions: failedActions});
    assert.equal(failed.state.essence, 2);
    assert.equal(failed.state.targetDamage, 0);
    assert.equal(failed.state.gu[0].injured, true);
    assert.equal(failed.state.controlDraws, 1);
    assert.deepEqual(failed.trace.at(-1).backlash, [{kind: 'injure-gu', target: 4}]);
    const withForecast = runGuWorkshop({...example, actions: [
        ...failedActions.slice(0, -1), {action: 'research-move'}, failedActions.at(-1),
    ]});
    assert.deepEqual(withForecast.state, failed.state);
    const recovered = runGuWorkshop(example);
    assert.equal(recovered.state.controlDraws, 1);
    assert.equal(recovered.state.targetDamage, 3);
    assert.equal(recovered.state.essence, 2);
    assert.equal(recovered.state.storedEssence, 0);
    assert.deepEqual(recovered.state.gu.map(({id, injured}) => [id, injured]), [[4, false]]);
});

test('a failed core activation retains the essence already spent on a support', () => {
    const {actions} = guWorkshopCases['gu-keeper'];
    const result = runGuWorkshop({actions: [
        ...actions.slice(0, -1), {action: 'wait'}, {action: 'wait'}, {action: 'feed', id: 2}, actions.at(-1),
    ]});
    const last = result.trace.at(-1);
    assert.equal(last.outcome, 'interrupted');
    assert.equal(last.id, 1);
    assert.equal(result.state.essence, 11);
    assert.equal(result.state.targetDamage, 0);
});

test('recovery preserves identity while failed fusion removes a participant', () => {
    const result = runGuWorkshop(guWorkshopCases['gu-recovery']);
    assert.equal(result.state.gu[0].origin, 'stall');
    assert.deepEqual(result.state.gu.map(gu => gu.id), [1, 2]);
    assert.equal(result.trace.find(step => step.outcome === 'failed').lost, 3);
    assert.deepEqual(result.state.guHistory.map(gu => [gu.id, gu.fate]), [[3, 'destroyed']]);
    assert.equal(result.trace.find(step => step.outcome === 'interrupted').reason, 'needs recovery');
    assert.equal(result.state.targetDamage, 2);
    assert.ok(result.state.gu.every(gu => !gu.injured));
});

test('the cultivated clan breed has no wild trail, but a captured Liquor Worm can convert essence', () => {
    const blocked = runGuWorkshop({actions: [{action: 'find', kind: 'moonlight'}, {action: 'capture'}]});
    assert.equal(blocked.state.wildSighting, null);
    assert.equal(blocked.state.gu.length, 0);
    assert.equal(blocked.trace[0].outcome, 'stopped');
    const wild = runGuWorkshop(guWorkshopCases['gu-wild']);
    assert.equal(wild.state.gu[0].origin, 'wild capture');
    assert.equal(wild.state.gu[0].kind, 'liquor-worm');
    assert.equal(wild.state.refinedEssence, 1);
    assert.equal(wild.state.essence, 10);
    assert.equal(wild.state.food.wine, 0);
});

test('a fleeing Liquor Worm keeps its identity through pursuit, luring and capture', () => {
    const {actions} = guWorkshopCases['gu-wild'];
    const flight = runGuWorkshop({actions: actions.slice(0, 2)});
    assert.equal(flight.trace.at(-1).outcome, 'fled');
    assert.equal(flight.state.essence, 12);
    assert.deepEqual(flight.state.gu, []);
    assert.equal(flight.state.wildGu[0].id, flight.trace[0].sighting.id);
    const captured = runGuWorkshop({actions: [...actions.slice(0, 8), {action: 'convert-essence', id: 1}]});
    assert.deepEqual(captured.trace.filter(row => row.action === 'find').map(row => row.sighting.id), [1, 1]);
    assert.deepEqual(captured.state.discoveredRefuges, ['hidden cave']);
    assert.equal(captured.state.gu[0].id, 1);
    assert.equal(captured.state.gu[0].wildWill, true);
    assert.deepEqual(captured.state.wildGu, []);
    assert.match(captured.trace.at(-1).reason, /Refine control/);
    assert.equal(captured.state.food.wine, 0);
});

test('the same familiarity makes a bold Worm approachable while a wary Worm still flees', () => {
    const example = guWorkshopCases['gu-familiar-worm'];
    const bold = runGuWorkshop(example);
    const wary = runGuWorkshop({...example, seed: 0});
    assert.deepEqual(bold.trace.filter(row => row.action === 'find').map(row => row.sighting.id), [1, 1]);
    assert.deepEqual([bold.state.gu[0].temperament, bold.state.gu[0].familiarity, bold.state.gu[0].wildWill],
        ['bold', 30, true]);
    assert.equal(bold.state.food.wine, 0);
    assert.deepEqual([wary.state.wildGu[0].temperament, wary.state.wildGu[0].familiarity, wary.trace.at(-1).outcome],
        ['wary', 30, 'fled']);
    const restored = restoreCreatureLifecycle(JSON.parse(JSON.stringify(bold.state.encounterCreatures)));
    assert.equal(restored.individuals[bold.state.gu[0].creatureId].keeper, 'keeper');
    assert.equal(restored.individuals[bold.state.gu[0].creatureId].experience.keeper.bond, 30);
});

test('Future Self enables travel while the real Immortal Gu stays with its current holder', () => {
    const example = guWorkshopCases['gu-future-self'];
    const result = runGuWorkshop({...example, actions: [...example.actions,
        {action: 'projected-travel', destination: 'northern-plains'}]});
    assert.equal(result.trace[1].outcome, 'complete');
    assert.equal(result.state.location, 'southern-border');
    assert.equal(result.state.projection, null);
    assert.deepEqual(result.state.gu, []);
    assert.deepEqual(result.state.otherGu.map(({kind, rank, holder, uniqueKey}) => [kind, rank, holder, uniqueKey]),
        [['fixed-immortal-travel', 7, 'feng-jiu-ge', 'fixed-immortal-travel']]);
    assert.match(result.trace.at(-1).reason, /no longer reachable/);

    const opening = runGuWorkshop({...example, actions: example.actions.slice(0, 2)});
    const restored = JSON.parse(JSON.stringify(opening.state.projection));
    const request = {projection: restored, anchor: opening.state.riverAnchor, operator: 'keeper',
        now: 1, kind: 'fixed-immortal-travel'};
    assert.equal(invokeProjectedGu(request).projection.reserves.immortal, 0);
    assert.throws(() => invokeProjectedGu({...request, anchor: 'changed-river'}), /no longer reachable/);
    assert.throws(() => invokeProjectedGu({...request, operator: 'someone-else'}), /no longer reachable/);
});

test('a marked Moonblade can be borrowed after fusion consumes the original Gu', () => {
    const {actions} = guWorkshopCases['gu-past-moonblade'];
    const result = runGuWorkshop({actions});
    assert.equal(result.trace.at(-1).outcome, 'complete');
    assert.equal(result.state.targetDamage, 1);
    assert.equal(result.state.essence, 12);
    assert.equal(result.state.projection.reserves.primeval, 8);
    assert.deepEqual(result.state.gu.map(({kind}) => kind), ['moonglow']);
    assert.equal(result.state.guHistory.find(gu => gu.id === 1).alive, false);
    assert.equal(result.state.projection.milestone.specimen, 1);
    const expired = runGuWorkshop({actions: [...actions, {action: 'wait'}, {action: 'wait'}, {action: 'past-moonblade'}]});
    assert.match(expired.trace.at(-1).reason, /seal is unavailable/);
    assert.equal(expired.state.projection, null);
});

test('a serialized historical mark keeps its original trait and requires the earlier operator and anchor', () => {
    const gu = {id: 1, kind: 'moonlight', rank: 1, alive: true, holder: 'keeper', fedThrough: 3, traits: {bladeForce: 1}};
    const mark = {id: 'seal', operator: 'keeper', at: 3, gu, ability: moonlightBlade, reserves: {primeval: 4}};
    assert.throws(() => recordGuMilestone({...mark, gu: {...gu, wildWill: true}}), /under your control/);
    const milestone = JSON.parse(JSON.stringify(recordGuMilestone(mark)));
    gu.holder = 'other';
    gu.traits.bladeForce = 3;
    const loan = {milestone, anchor: 'seal', operator: 'keeper', now: 4, duration: 2, rankLimit: 1};
    assert.throws(() => borrowGuMilestone({...loan, now: 3}), /earlier witnessed state/);
    assert.throws(() => borrowGuMilestone({...loan, operator: gu.holder}), /earlier witnessed state/);
    const projection = JSON.parse(JSON.stringify(borrowGuMilestone(loan)));
    const cast = {projection, anchor: 'seal', operator: 'keeper', now: 5, kind: 'moonlight'};
    const outcome = invokeProjectedGu(cast);
    assert.equal(outcome.effects[0].magnitude, 2);
    assert.equal(outcome.projection.reserves.primeval, 0);
    assert.throws(() => invokeProjectedGu({...cast, anchor: 'broken-seal'}), /no longer reachable/);
    assert.throws(() => invokeProjectedGu({...cast, now: 6}), /no longer reachable/);
});

test('projected cooperation spends its own fuel and requires the reached Gu to recognize the actual visitor', () => {
    const witness = {specimen: 'moth-1', agreement: {actor: 'steward', body: 'body-1'}};
    const ability = {fuel: 'meal', cost: 1, effect: {kind: 'light-of-insight', magnitude: 1}};
    const opening = {anchor: 'planned-lesson', operator: 'keeper', now: 5, duration: 10, rankLimit: 1};
    const projection = beginGuProjection({...opening, profile: {rank: 1, reserves: {meal: 1},
        capabilities: [{kind: 'moth', rank: 1, ability, witness}]}});
    const request = {...opening, projection, kind: 'moth', visitor: {...witness.agreement}};
    witness.agreement.body = 'other-body';
    assert.equal(requestProjectedGuAid({...request, visitor: witness.agreement}), null);
    assert.throws(() => invokeProjectedGu(request), /choose to help/);
    const aid = requestProjectedGuAid(request);
    assert.equal(aid.effects[0].kind, 'light-of-insight');
    assert.equal(aid.projection.reserves.meal, 0);
    assert.equal(projection.reserves.meal, 1);
    assert.equal(requestProjectedGuAid({...request, projection: aid.projection}), null);
    assert.throws(() => requestProjectedGuAid({...request, now: 15}), /no longer reachable/);
});

test('ordinary fireflies grow in the habitat and yield separate Gu without Gu parents', () => {
    const {actions} = guWorkshopCases['gu-emergence'];
    const early = runGuWorkshop({actions: [...actions.slice(0, 3), {action: 'collect-colony-gu'}]});
    assert.equal(early.trace.at(-1).outcome, 'stopped');
    assert.equal(early.state.gu.length, 0);
    const result = runGuWorkshop({actions: [...actions, {action: 'collect-colony-gu'}]});
    assert.deepEqual(result.state.gu.map(gu => [gu.id, gu.kind, gu.origin]), [
        [1, 'starlight-firefly', 'colony emergence'], [2, 'starlight-firefly', 'colony emergence'],
    ]);
    assert.equal(result.state.colony.ordinary, 6);
    assert.equal(result.state.colony.emerged, 0);
    assert.equal(result.trace.at(-1).outcome, 'stopped');
});

test('overexposure shrinks the firefly habitat and restoring shade and grass permits emergence again', () => {
    const example = guWorkshopCases['gu-colony-recovery'];
    const damaged = runGuWorkshop({actions: example.actions.slice(0, 11)});
    assert.deepEqual([damaged.state.colony.starGrass, damaged.state.colony.ordinary, damaged.state.colony.emerged], [1, 2, 0]);
    assert.equal(damaged.state.colony.populations.habitats['starlight-colony'].losses, 4);
    const recovered = runGuWorkshop(example);
    assert.equal(recovered.state.colony.ordinary, 5);
    assert.equal(recovered.state.colony.emerged, 0);
    assert.equal(recovered.state.stones, 6);
    assert.equal(recovered.state.gu[0].kind, 'starlight-firefly');
    assert.equal(recovered.trace.at(-1).action, 'collect-colony-gu');
});

test('an escaped specimen can be stronger than clan stock without changing the Gu kind', () => {
    const example = guWorkshopCases['gu-escaped-moonlight'];
    const result = runGuWorkshop({...example, actions: [
        ...example.actions, {action: 'wait'}, {action: 'wait'}, {action: 'find', kind: 'moonlight'},
    ]});
    assert.deepEqual(result.state.gu.map(gu => [gu.kind, gu.origin]), [
        ['moonlight', 'stall'], ['moonlight', 'escaped clan stock'],
    ]);
    assert.deepEqual(result.trace.filter(step => step.action === 'cast').map(step => step.power), [1, 2]);
    assert.equal(result.trace.at(-1).outcome, 'stopped');
});

test('perished food cannot fund upkeep and productive Gu can fund a new support', () => {
    const {actions} = guWorkshopCases['gu-keeper'];
    const result = runGuWorkshop({actions: [
        ...actions.slice(0, 5), ...Array.from({length: 5}, () => ({action: 'wait'})), actions[5],
    ]});
    assert.equal(result.state.petals, 0);
    assert.equal(result.trace.at(-2).spoiledPetals, 12);
    assert.match(result.trace.at(-1).reason, /fresh petals/);
    const funded = runGuWorkshop(guWorkshopCases['gu-cultivation']);
    assert.equal(funded.state.targetDamage, 2);
    assert.equal(funded.trace.find(step => step.action === 'sell-leaf').stonesEarned, 2);
});

test('visual concealment, piercing sight and physical cover change different detection channels', () => {
    const concealment = [{channel: 'sight', magnitude: 2}];
    const ordinary = {sight: {reach: 1}, scent: {reach: 0}};
    assert.equal(detectGuApproach({senses: ordinary, concealment}), null);
    const eye = {...ordinary, sight: {reach: 1, penetration: 2}};
    assert.equal(detectGuApproach({senses: eye, concealment}), 'sight');
    assert.equal(detectGuApproach({senses: eye, concealment, screens: ['sight']}), null);
    assert.equal(detectGuApproach({senses: {...eye, scent: {reach: 1}}, concealment, screens: ['sight']}), 'scent');
});

test('host release keeps independent specimen identities and contact deadlines', () => {
    const flight = startGuFlight({host: 'wolf:3', clock: 5,
        routes: {spark: {site: 'scrub', minutes: 10}, shield: {site: 'ledge', minutes: 22}}});
    const loaded = JSON.parse(JSON.stringify(flight));
    assert.equal(fleeingGu(loaded, 'spark', {site: 'ledge', clock: 7}), null);
    assert.equal(fleeingGu(loaded, 'spark', {site: 'scrub', clock: 14}).id, 'wolf:3.spark');
    assert.equal(fleeingGu(loaded, 'spark', {site: 'scrub', clock: 15}), null);
    assert.equal(guFlightStatus(loaded.gu.spark, 15), 'lost');
    assert.equal(fleeingGu(loaded, 'shield', {site: 'ledge', clock: 15}).id, 'wolf:3.shield');
    assert.throws(() => captureFleeingGu(loaded, 'spark', {site: 'scrub', clock: 15}), /no longer within reach/);
    captureFleeingGu(loaded, 'shield', {site: 'ledge', clock: 15});
    assert.equal(loaded.gu.shield.capturedAt, 15);
    assert.equal(guFlightStatus(loaded.gu.shield, 27), 'captured');
});

test('reconnaissance combines reachable clues without extending either channel', () => {
    const near = {channel: 'sight', distance: 25, text: 'rope'};
    const pack = {channel: 'sound', distance: 93, text: 'wolves'};
    const clues = [near, {channel: 'sight', distance: 26, text: 'fork'}, pack, {channel: 'sound', distance: 201, text: 'echo'}];
    assert.deepEqual(readGuSignals(clues, {sight: 25}), [near]);
    assert.deepEqual(readGuSignals(clues, {sound: 200}), [pack]);
    assert.deepEqual(readGuSignals(clues, {sight: 25, sound: 200}), [near, pack]);
});

test('a Stealth Rock mask leaves clothes visible while the fused profile leaves scent intact', () => {
    const guard = {sight: {reach: 1}, scent: {reach: 0}};
    const rock = resolveGuCloak({gu: {id: 'rock', kind: 'stealth-rock', rank: 1}, clock: 0, reserve: 1});
    assert.deepEqual(observeGuCloak({senses: guard, cloak: rock}), {channel: 'sight', surfaces: ['clothing']});
    const gu = {id: 'fused', kind: 'stealth-scales', rank: 2};
    assert.throws(() => resolveGuCloak({gu, clock: 0, reserve: 1}), /did not respond/);
    const cloak = resolveGuCloak({gu, clock: 0, reserve: 2});
    assert.equal(observeGuCloak({senses: guard, cloak}), null);
    assert.deepEqual(observeGuCloak({senses: {...guard, scent: {reach: 1}}, cloak}), {channel: 'scent', surfaces: []});
    assert.deepEqual(observeGuCloak({senses: {...guard, sight: {reach: 1, penetration: 2}}, cloak}),
        {channel: 'sight', surfaces: ['body', 'clothing']});
});
