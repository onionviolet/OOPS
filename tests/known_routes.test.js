import test from 'node:test';
import assert from 'node:assert/strict';
import {projectKnownRoutes, sameKnownRouteQuote} from '../src/known_routes.js';

const current = () => ({known: true, recipientId: 'player', destinationId: 'test.home@Village', destinationLabel: 'Village', commitments: []});
const route = () => ({id: 'test.enter', known: true, recipientId: 'player', currentDestinationId: 'test.home@Village',
    direction: 'onward', destinationLabel: 'Test room', label: 'Enter room', inputFingerprint: 'sequence:7;body:1;cargo:8',
    description: {known: true, text: 'A learned doorway.'}, costText: {known: true, text: '2 focus'},
    blockerText: {known: true, text: 'Finish work first.'}, commitmentText: {known: true, text: 'Keep your loan return duty.'},
    action: {eligible: false, reasons: ['Finish work first.'], command: {kind: 'test.enter', args: {sequence: 7}}}});

test('known routes preserve exact host commands, blockers, costs and eligibility without mutation', () => {
    const input = {current: current(), routes: [route(), {...route(), id: 'test.return', direction: 'return', label: 'Return home'}]};
    const before = structuredClone(input), result = projectKnownRoutes(input);
    assert.equal(result.visible, true); assert.equal(result.section.current, 'Village');
    assert.deepEqual(result.section.routes.map(r => r.direction), ['onward', 'return']);
    const row = result.section.routes[0];
    assert.equal(row.eligible, false); assert.deepEqual(row.reasons, ['Finish work first.']);
    assert.deepEqual(row.command, input.routes[0].action.command); assert.equal(row.costText, '2 focus');
    assert.equal(row.blockerText, 'Finish work first.'); assert.equal(row.commitmentText, 'Keep your loan return duty.');
    assert.deepEqual(projectKnownRoutes(JSON.parse(JSON.stringify(input))), result);
    row.command.args.sequence++; row.reasons.push('changed'); assert.deepEqual(input, before);
});

test('unknown or differently addressed current destinations do not disclose routes', () => {
    assert.deepEqual(projectKnownRoutes(), {visible: false, section: null});
    for (const patch of [{known: false}, {recipientId: 'other'}, {destinationId: ''}, {destinationLabel: ''}]) {
        assert.deepEqual(projectKnownRoutes({current: {...current(), ...patch}, routes: [route()]}), {visible: false, section: null});
    }
});

for (const [name, patch] of [
    ['undiscovered route', {known: false}], ['other recipient', {recipientId: 'other'}],
    ['other origin', {currentDestinationId: 'test.away@Room'}], ['unsupported direction', {direction: 'teleport'}],
    ['absent fingerprint', {inputFingerprint: ''}], ['absent native command', {action: {eligible: true}}]
]) test(`known routes omit ${name}`, () => {
    const result = projectKnownRoutes({current: current(), routes: [{...route(), ...patch}]});
    assert.equal(result.visible, true); assert.deepEqual(result.section.routes, []);
});

test('duplicate route IDs fail closed while independent known rows remain visible', () => {
    const rows = [route(), {...route(), known: false}, {...route(), id: 'test.other'}];
    assert.deepEqual(projectKnownRoutes({current: current(), routes: rows}).section.routes.map(r => r.id), ['test.other']);
});

test('undisclosed text and commitments stay hidden instead of being inferred from eligibility', () => {
    const r = route(); r.description.known = false; r.costText = 'unattributed'; r.blockerText.known = false;
    const c = current(); c.commitments = [{id: 'duty.known', known: true, recipientId: 'player', text: {known: true, text: 'Return goods.'}},
        {id: 'duty.private', known: true, recipientId: 'other', text: {known: true, text: 'Private duty.'}},
        {id: 'duty.unknown', known: false, recipientId: 'player', text: {known: true, text: 'Unknown duty.'}}];
    const view = projectKnownRoutes({current: c, routes: [r]});
    assert.equal(view.section.routes[0].description, ''); assert.equal(view.section.routes[0].costText, '');
    assert.equal(view.section.routes[0].blockerText, '');
    assert.deepEqual(view.section.commitments, [{id: 'duty.known', text: 'Return goods.'}]);
});

test('same-render quote check rejects changed identity, exact host inputs or command payload', () => {
    const left = projectKnownRoutes({current: current(), routes: [route()]}).section.routes[0];
    const right = JSON.parse(JSON.stringify(left)); assert.equal(sameKnownRouteQuote(left, right), true);
    for (const patch of [{id: 'test.other'}, {inputFingerprint: 'sequence:8'}, {command: {kind: 'test.return'}}]) {
        assert.equal(sameKnownRouteQuote(left, {...right, ...patch}), false);
    }
    assert.equal(sameKnownRouteQuote(left, null), false);
});
