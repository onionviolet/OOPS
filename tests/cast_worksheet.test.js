import test from 'node:test';
import assert from 'node:assert/strict';
import {buildWorksheets, run} from '../scripts/lead_run/cast_worksheet.mjs';

const crosswalk = {schema: 'cast-crosswalk/1.0', world: 'lotm', mapping: {
    'lotm.person.ada': 'new:lotm.person.ada',
    'lotm.place.home': 'new:lotm.place.home',
    'lotm.organization.guild': 'new:lotm.organization.guild',
    'lotm.item.key': 'new:lotm.item.key',
}, entities: {
    'lotm.person.ada': {kind: 'person'}, 'lotm.place.home': {kind: 'place'},
    'lotm.organization.guild': {kind: 'organization'}, 'lotm.item.key': {kind: 'item'},
}};
const registry = [
    {id: 'lotm.person.ada', kind: 'person', label: 'Ada', aliases: ['Lead'], rung: 'M1', whereabouts: [
        {place: 'lotm.place.home', timeOfDay: 'morning', locator: 'zh 第2章 p8', status: 'present'},
        {place: 'lotm.place.guild', timeOfDay: 'evening', locator: 'zh 第25章 p2', status: 'present'},
    ], schema14Extra: {kept: true}},
    {id: 'lotm.place.home', kind: 'place', label: 'Home', whereabouts: []},
    {id: 'lotm.organization.guild', kind: 'organization', label: 'Guild', whereabouts: []},
    {id: 'lotm.item.key', kind: 'item', label: 'Key'},
];
const scenes = [
    {pov: 'lead', beat: 'beat-1', evidence: [{locator: 'zh 第1章 p4'}], place: 'lotm.place.home', date: {value: 'day-0'},
        touched: [{id: 'lotm.person.ada', kind: 'person', status: 'present'}, {id: 'lotm.organization.guild', kind: 'organization', status: 'partial'}], present: [], outcomes: [{fact: 'Ada opens the door'}],
        choices: [{taken: 'knock'}], motives: [{tag: 'curiosity'}]},
    {pov: 'lead', beat: 'beat-2', evidence: [{locator: 'zh 第3章 p4'}], place: 'lotm.place.home', date: {value: 'day-2'},
        touched: [{id: 'lotm.person.ada', kind: 'person', status: 'partial'}], present: [], outcomes: [], choices: [], motives: []},
    {pov: 'lead', beat: 'late', evidence: [{locator: 'zh 第25章 p1'}], touched: [{id: 'lotm.person.ada', kind: 'person', status: 'present'}]},
];
const extras = [{id: 'lotm.person.ada', extra: 'people', label: 'I', locator: 'zh 第1章 p4',
    routine: [{place: 'lotm.place.home', timeOfDay: 'morning', locator: 'zh 第2章 p9', recurrence: 'daily', custom14: 'kept'},
        {place: 'lotm.place.guild', locator: 'zh 第3章 p8'}],
    relations: [{with: 'lotm.person.bob', kind: 'friend', label: 'T', locator: 'zh 第3章 p9'}],
    knows: [], reacts: [], wants: ['keep the shop'],
}];

test('LOTM worksheets include mapped entities and slice evidence in locator order', () => {
    const sheets = buildWorksheets({registry, scenes, extras, crosswalk, world: 'lotm', from: 'zh 第1章 p1', to: 'zh 第24章 p99999'});
    assert.deepEqual(sheets.map(row => row.id), ['lotm.organization.guild', 'lotm.person.ada', 'lotm.place.home']);
    const ada = sheets.find(row => row.id === 'lotm.person.ada');
    assert.equal(ada.runtimeId, 'new:lotm.person.ada');
    assert.deepEqual(ada.tierHint, {present: 1, partial: 1});
    assert.deepEqual(ada.scenes.map(row => row.beat), ['beat-1', 'beat-2']);
    assert.deepEqual(ada.scenes[0].choices, [{taken: 'knock'}]);
    assert.deepEqual(ada.whereabouts.map(row => row.locator), ['zh 第2章 p8']);
    assert.equal(ada.routine[0].custom14, 'kept');
    assert.equal(ada.sourceRows.extras[0].routine[0].custom14, 'kept');
    assert.equal(ada.sourceRows.registry.schema14Extra.kept, true);
    assert.equal(ada.candidateRows.find(row => row.locator === 'zh 第2章 p9').from, 480);
    assert.equal(ada.candidateRows.find(row => row.locator === 'zh 第2章 p9').to, 720);
    assert.equal(ada.candidateRows.find(row => row.locator === 'zh 第3章 p8').from, null);
    assert.match(ada.candidateRows.find(row => row.locator === 'zh 第3章 p8').gap, /no usable time/);
    assert.deepEqual(ada.wants[0], {value: 'keep the shop', label: 'I', locator: 'zh 第1章 p4'});
    assert.deepEqual(ada.anchors, [{actor: 'lotm.person.ada', place: 'lotm.place.guild', locator: 'zh 第25章 p2'}]);
});

test('rejects wrong world and malformed locator ranges; CLI enforces private roots', () => {
    assert.throws(() => buildWorksheets({registry, scenes, extras, crosswalk: {...crosswalk, world: 'mol'}, world: 'lotm', from: 'zh 第1章 p1', to: 'zh 第24章 p99999'}), /matching/);
    assert.throws(() => buildWorksheets({registry, scenes, extras, crosswalk, world: 'lotm', from: 'zh 第2章 p1', to: 'zh 第1章 p1'}), /ordered/);
    assert.throws(() => run(['tests']), /private directory/);
});

test('MoL worksheets accept a locator range and keep unknown-loop later presences out of forward anchors', () => {
    const molCrosswalk = {schema: 'cast-crosswalk/1.0', world: 'mol', mapping: {'mol.person.zorian': 'mol.person.zorian'}, entities: {
        'mol.person.zorian': {kind: 'person', locators: ['en b1 c5 p3']},
    }, slice: {from: 'en b1 c1 p1', to: 'en b1 c5 p9'}};
    const molRegistry = [{...registry[0], id: 'mol.person.zorian', whereabouts: [
        {place: 'mol.place.room', timeOfDay: 'morning', locator: 'en b1 c5 p11', loop: 'same'},
        {place: 'mol.place.later', timeOfDay: 'morning', locator: 'en b1 c6 p10'},
    ]}];
    const molScenes = [{pov: 'lead', beat: 'mol-early', evidence: [{locator: 'en b1 c5 p3'}],
        touched: [{id: 'mol.person.zorian', kind: 'person', status: 'present'}], present: [], outcomes: []}];
    const molSheets = buildWorksheets({registry: molRegistry, scenes: molScenes, extras: [], crosswalk: molCrosswalk,
        world: 'mol', from: 'en b1 c1 p1', to: 'en b1 c5 p9'});
    assert.equal(molSheets.length, 1);
    assert.deepEqual(molSheets[0].anchors, [{actor: 'mol.person.zorian', place: 'mol.place.room', locator: 'en b1 c5 p11'}]);
    assert.deepEqual(molSheets[0].anchorsOtherLoops, [{actor: 'mol.person.zorian', place: 'mol.place.later', locator: 'en b1 c6 p10', loop: null}]);
});
