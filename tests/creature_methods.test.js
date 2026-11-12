import assert from 'node:assert/strict';
import test from 'node:test';

import {measureCreatureCapability, planCreatureMethod} from '../src/creature_methods.js';

const capability = (id, unit, combine) => ({id, unit, combine});
const source = (source, unit, value) => ({source, unit, value});

test('fleece properties and load capacities retain different units and sources', () => {
    const fleece = capability('fleece.fineness', 'grade', 'max');
    assert.equal(measureCreatureCapability(fleece, [
        source('lineage.fleece', 'grade', 40), source('care.fleece', 'grade', 65),
    ]).value, 65);
    const carry = capability('travel.carry', 'grams', 'sum');
    const sources = [source('body.frame', 'grams', 400), source('layer.harness', 'grams', 600)];
    assert.deepEqual(measureCreatureCapability(carry, sources), {
        ...{id: carry.id, unit: carry.unit}, value: 1000, contributions: sources,
    });
    assert.throws(() => measureCreatureCapability(carry, [sources[0], sources[0]]), /duplicate/);
    assert.throws(() => measureCreatureCapability(carry, [source('layer.harness', 'grade', 65)]), /invalid/i);
});

test('a local fleece operation binds an individual and publishes a measured item intent', () => {
    const law = 'meadow.v1';
    const method = {id: 'shear', revision: 1, law,
        steps: [{op: 'shear', bindings: {animal: 'ewe'}}]};
    const context = {law, facts: {}, bindings: {ewe: {kind: 'creature', id: 'creature:17',
        traits: {fleece: 'fine'}}}, operations: {
        shear: {roles: {animal: 'creature'}, resolve({bound}) {
            const fineness = measureCreatureCapability(capability('fleece.fineness', 'grade', 'max'),
                [source('lineage.fleece', 'grade', bound.animal.traits.fleece === 'fine' ? 65 : 40)]);
            return {ok: true, facts: {fineness}, effects: [{kind: 'produce', item: 'wool', grade: fineness.value}]};
        }},
    }};
    const fine = planCreatureMethod(method, context);
    assert.equal(fine.effects[0].grade, 65);
    assert.equal(fine.evidence[0].bindings.animal, 'creature:17');
    const ordinary = structuredClone(context.bindings);
    ordinary.ewe.traits.fleece = 'ordinary';
    assert.equal(planCreatureMethod(method, {...context, bindings: ordinary}).effects[0].grade, 40);
    assert.throws(() => planCreatureMethod(method, {...context, bindings: {}}), /incompatible animal/);
});

test('a local delivery can compose attachment and dispatch, with no intents on a failed route', () => {
    const law = 'courier.v1';
    const attach = {op: 'attach', bindings: {kit: 'harness'}};
    const dispatch = {op: 'dispatch', bindings: {parcel: 'parcel', route: 'ford'}};
    const context = {law, facts: {carry: 400},
        bindings: {harness: {kind: 'equipment', id: 'item:harness', support: 600},
            parcel: {kind: 'cargo', id: 'item:medicine', grams: 850}, ford: {kind: 'route', id: 'river:ford', open: true}},
        operations: {
            attach: {roles: {kit: 'equipment'}, resolve({bound, facts}) {
                return {ok: true, facts: {carry: facts.carry + bound.kit.support}, effects: [{kind: 'attach', item: bound.kit.id}]};
            }},
            dispatch: {roles: {parcel: 'cargo', route: 'route'}, resolve({bound, facts}) {
                if (!bound.route.open || bound.parcel.grams > facts.carry) return {ok: false, reason: 'Cannot cross with this parcel.'};
                return {ok: true, facts: {}, effects: [{kind: 'dispatch', item: bound.parcel.id, route: bound.route.id}]};
            }},
        }};
    const method = {id: 'river-delivery', revision: 1, law, steps: [dispatch]};
    assert.equal(planCreatureMethod(method, context).ok, false);
    const altered = {...method, steps: [attach, dispatch]};
    const plan = planCreatureMethod(altered, context);
    assert.equal(plan.facts.carry, 1000);
    assert.deepEqual(plan.effects.map(effect => effect.kind), ['attach', 'dispatch']);
    const closed = {...context, bindings: {...context.bindings, ford: {...context.bindings.ford, open: false}}};
    assert.deepEqual(planCreatureMethod(altered, closed), {ok: false, operation: 'dispatch', reason: 'Cannot cross with this parcel.'});
    assert.equal(context.facts.carry, 400);
});
