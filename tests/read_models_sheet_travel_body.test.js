import test from 'node:test';
import assert from 'node:assert/strict';
import {sheetAsOf} from '../src/character_sheets.js';
import {subjectFromDatedSheet, standingRows} from '../src/read_models/character_sheet_bridge.js';
import {defineRoute, quoteRoute} from '../src/travel_legs.js';
import {legsFromRoute, legsFromRoutes} from '../src/read_models/travel_legs_bridge.js';
import {bodyViewFromHarm} from '../src/read_models/body_bridge.js';
import {emptyPersonas, addPersona, changeStanding} from '../src/persona_standing.js';

const e = (v, from, extra = {}) => ({v, from, ev: 'S', loc: 'x', ...extra});
const sheet = {id: 'test.person.a', tier: 'principal',
    identities: [e({name: 'Real Name', kind: 'legal'}, 'b1:1'), e({name: 'Mask', kind: 'persona', persona: 'persona.mask'}, 'b1:1', {view: 'shown'}),
        e({name: 'Secret', kind: 'alias'}, 'b1:1', {gate: 'reveal@b2:1'}), e({name: 'Rumoured', kind: 'alias'}, 'b1:1', {view: 'believed', by: 'obs.me'}),
        e({name: 'Other rumour', kind: 'alias'}, 'b1:1', {view: 'believed', by: 'obs.you'})],
    power: [e({path: 'seer', level: 7}, 'b1:1')],
    stats: [e({axis: 'might', band: 6}, 'b1:1'), e({axis: 'might', band: 2}, 'b1:1', {view: 'shown'}), e({axis: 'mind', band: 8}, 'b1:1')],
    abilities: [e({rule: 'lotm.ability.step', conditions: ['Ready'], costs: ['1 spirit'], limits: []}, 'b1:1')],
    condition: [e({state: 'loss_of_control', severity: 2}, 'b1:1')]};

test('sheet: the observer sees shown over actual, only their own beliefs, and never the hidden count', () => {
    const at = sheetAsOf(sheet, 'b1:5');
    assert.equal(at.hidden, 1);
    const other = subjectFromDatedSheet(at, {observerId: 'obs.me'});
    assert.ok(!JSON.stringify(other).includes('Secret') && !JSON.stringify(other).includes('hidden') && !JSON.stringify(other).includes('Real Name'));
    assert.equal(other.name, 'Mask');   // the displayed face, not the legal name
    assert.deepEqual(other.stats.map(s => [s.id, s.value]), [['might', 2]]);   // a displayed field is seen through the display; actual 6 and 8 are withheld
    assert.ok(!JSON.stringify(other).includes('Other rumour'));
    assert.equal(other.standing.find(r => r.value === 'Mask').public, true);
});

test('sheet: the person themself reads actual values; level words, or a strength dial for descending scales', () => {
    const self = subjectFromDatedSheet(sheetAsOf(sheet, 'b1:5'), {observerId: 'test.person.a', abilityLabels: {'lotm.ability.step': 'Step'}});
    assert.equal(self.name, 'Real Name');
    assert.equal(self.stats.find(s => s.id === 'might').value, 6);
    assert.equal(self.abilities[0].label, 'Step');
    assert.equal(self.abilities[0].desc, 'Ready; Costs 1 spirit');
    assert.equal(self.level, 'Seer 7');
    const dial = subjectFromDatedSheet(sheetAsOf(sheet, 'b1:5'), {observerId: 'test.person.a', powerStrength: p => 9 - p.level});
    assert.deepEqual([dial.level.value, dial.rank], [2, 2]);
    assert.equal(subjectFromDatedSheet(null), null);
});

test('standing rows come from persona standing, with the basis the observer holds', () => {
    let st = addPersona(emptyPersonas(), {id: 'persona.mask', bodyId: 'b', link: 0.5});
    st = changeStanding(st, 'persona.mask', 'tingen', 40);
    const rows = standingRows(st, ['persona.mask', 'persona.none'], {tingen: 'Tingen'});
    assert.equal(rows.length, 1);
    assert.equal(rows[0].desc, 'persona only');
    assert.ok(rows[0].value.length > 0);
});

const route = defineRoute({id: 'r1', world: 'w', legs: [
    {id: 'l1', from: 'a', to: 'b', means: 'rail', minutes: 30, fare: {sum: 5}, hours: [6, 22], hazards: [{id: 'hz', chance: .5, kind: 'theft', result: 'x'}]},
    {id: 'l2', from: 'b', to: 'c', means: 'foot', minutes: 60}]});

test('legs: rep-maps contract fields, unknown places dropped, hazards and hours handled', () => {
    const quote = quoteRoute(route, {money: 3, minuteOfDay: 8 * 60});
    const legs = legsFromRoute(route, quote, {moveIdFor: id => `move.${id}`, labels: {b: 'Station B'}});
    assert.equal(legs.length, 1);   // c is not known to the seat
    const [l] = legs;
    assert.deepEqual([l.to, l.minutes, l.means, l.moveId, l.eligible], ['b', 30, 'rail', 'move.l1', false]);
    assert.match(l.reasons[0], /Needs 5 money/);
    assert.deepEqual([l.cost.amount, l.window.hours], [5, [6, 22]]);
    assert.ok(!JSON.stringify(l).includes('theft'));
    const both = legsFromRoutes([{route, quote}], {labels: {b: 'B', c: 'C'}});
    assert.deepEqual(both.map(x => x.to), ['b', 'c']);
    assert.equal(both[1].cost.stated, false);   // no fare recorded is said, not hidden
});

const harm = {carriers: [{id: 'power', label: 'Power strain', count: 7, stage: 'slipping', stageLabel: 'Slipping', blocked: ['ritual', 'research'], recovers: {rest: .25, treated: 1}},
    {id: 'calm', label: 'Calm', count: 0, stage: 'steady', stageLabel: 'Steady', blocked: [], recovers: {rest: 1, treated: 1}}],
    rung: 'wounded', parts: [{id: 'hands', rung: 'bruised', gates: ['craft', 'fight']}], lastDeath: null};

test('body: harm becomes the bodyViewModel shape; steady carriers stay silent; other seats get nothing', () => {
    const v = bodyViewFromHarm(harm, {partLabels: {hands: 'Hands'}});
    assert.deepEqual(Object.keys(v), ['title', 'glance', 'parts', 'milestones', 'empty']);
    assert.deepEqual(v.parts.map(p => p.slot), ['whole', 'part:hands', 'carrier:power']);
    assert.equal(v.parts[1].now[0].label, 'Bruised hands');
    assert.equal(v.parts[1].now[0].felt, 'Makes craft, fight harder.');
    assert.equal(v.parts[2].now[0].felt, 'Blocks: ritual, research.');
    assert.equal(v.glance.length, 3);
    assert.equal(bodyViewFromHarm(harm, {self: false}), null);
    const clean = bodyViewFromHarm({carriers: [], rung: null, parts: [], lastDeath: null});
    assert.deepEqual([clean.parts, clean.glance], [[], []]);
    assert.ok(clean.empty);
});
