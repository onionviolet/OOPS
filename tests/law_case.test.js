import test from 'node:test';
import assert from 'node:assert/strict';
import {defineLawBook, jurisdictionChain, detect, caseFor, responsesFor, statuteFromRow, lawBookFromRows} from '../src/law_case.js';

// Synthetic, paraphrased fixtures shaped like two unrelated books' merged law rows. No book text, no shared ids.
// Book A: a hidden-school world; rows carry consequences only (no enforcement block, no detection).
const rowA = {id: 'a.law.minor-spell-ban', name: 'Minors may not cast outside school', conditions: ['under age'], who: ['minor'],
    consequences: [{trigger: 'cast in front of a muggle', response: 'warning letter', by: 'Ministry office'}, {trigger: 'repeat', response: 'wand snapped and expelled', by: 'Ministry office'}]};
// Book B: a clan world; enforcement block with free-text detection, no consequences list.
const rowB = {id: 'b.rule.fair-contest', name: 'No poison in a ranked duel', conditions: ['ranked duel'], who: ['clan member'],
    enforcement: {penalty: 'cripple the cultivation', enforcer: 'Elder hall', detection: 'a judge inspects the arena afterwards'}};
const rowNorm = {id: 'a.law.unspoken-custom', name: 'Do not stare', conditions: [], who: [], consequences: []};

const overlays = {
    [rowA.id]: {act: 'cast-in-front-of-outsider', places: ['town'], appliesTo: ['minor'], evidence: ['seen'], penaltyKind: 'warning',
        detection: [{via: 'witness', gives: 'seen'}, {via: 'detector', gives: 'seen'}]},
    [rowB.id]: {act: 'poison-in-duel', places: ['arena'], penaltyKind: 'maiming', evidence: ['residue'],
        detection: [{via: 'trace', gives: 'residue'}], exemptions: [{when: 'duel_to_death', text: 'A death duel waives the rule.'}]},
};
const {statutes, skipped, untyped} = lawBookFromRows([rowA, rowB, rowNorm], overlays);
const parentOf = {town: 'district', district: 'realm', arena: 'sect', sect: 'realm'};

test('the adapter types rows from both shapes and reports what it could not type', () => {
    assert.equal(statutes.length, 2);
    assert.equal(statutes.find(s => s.id === rowA.id).responses.length, 2);
    assert.equal(statutes.find(s => s.id === rowB.id).note, 'a judge inspects the arena afterwards');
    assert.deepEqual(untyped, [rowNorm.id]);
    assert.deepEqual(skipped, []);
    // A typed overlay on a row with no enforcer is skipped with a reason, not given an invented enforcer.
    assert.equal(statuteFromRow(rowNorm, {act: 'stare', places: ['town']}).skipped, rowNorm.id);
});

test('the same engine rules both worlds: detection becomes evidence, then the base ruling applies', () => {
    const seen = caseFor(statutes, 'cast-in-front-of-outsider', 'town', parentOf, {actor: {tags: ['minor']}, scene: {witnesses: [{id: 'w1', saw: true}]}});
    assert.equal(seen.primary.ruling.proven, true);
    assert.equal(seen.primary.ruling.enforcer, 'Ministry office');
    const unseen = caseFor(statutes, 'cast-in-front-of-outsider', 'town', parentOf, {actor: {tags: ['minor']}, scene: {witnesses: [{id: 'w1', saw: false}]}});
    assert.equal(unseen.primary, null);
    assert.deepEqual(unseen.cases[0].ruling.needs, ['seen']);
    const poison = caseFor(statutes, 'poison-in-duel', 'arena', parentOf, {scene: {traces: ['residue']}});
    assert.equal(poison.primary.ruling.penalty.kind, 'maiming');
    assert.equal(caseFor(statutes, 'poison-in-duel', 'arena', parentOf, {scene: {traces: ['residue']}, flags: ['duel_to_death']}).primary, null);
});

test('the actor filter: a statute for minors does not reach an adult', () => {
    const adult = caseFor(statutes, 'cast-in-front-of-outsider', 'town', parentOf, {actor: {tags: ['adult']}, evidence: ['seen']});
    assert.equal(adult.covered, false);
});

test('nested jurisdiction: a realm statute reaches a place that has none of its own, and the local office acts first', () => {
    const realm = defineLawBook([
        {id: 'x.theft-local', act: 'theft', places: ['ward'], enforcer: 'Watch', penalty: {kind: 'fine', text: 'fine'}, evidence: {needs: ['seen'], known: true}},
        {id: 'x.theft-crown', act: 'theft', places: ['kingdom'], enforcer: 'Crown court', penalty: {kind: 'jail', text: 'jail'}, evidence: {needs: ['seen'], known: true}},
    ]);
    const map = {ward: 'kingdom', village: 'kingdom'};
    const inWard = caseFor(realm, 'theft', 'ward', map, {evidence: ['seen']});
    assert.deepEqual(inWard.enforcers, ['Watch', 'Crown court']);
    assert.equal(inWard.primary.statute, 'x.theft-local');
    assert.equal(caseFor(realm, 'theft', 'village', map, {evidence: ['seen']}).primary.statute, 'x.theft-crown');
    assert.deepEqual(jurisdictionChain('a', {a: 'b', b: 'a'}), ['a', 'b']);
    // Strictness can be set per level.
    const weak = caseFor(realm, 'theft', 'ward', map, {evidence: [], strictness: {ward: 1, kingdom: 1}});
    assert.equal(weak.primary, null);
});

test('response ladder lists only the triggers that happened', () => {
    const c = caseFor(statutes, 'cast-in-front-of-outsider', 'town', parentOf, {actor: {tags: ['minor']}, evidence: ['seen']}).primary;
    assert.deepEqual(responsesFor(c, ['repeat']).map(r => r.response), ['wand snapped and expelled']);
    assert.deepEqual(responsesFor(c, []), []);
});

test('detection min needs enough witnesses and a bad detection row is refused', () => {
    const s = {detection: [{via: 'witness', gives: 'seen', min: 2}]};
    assert.deepEqual(detect(s, {witnesses: [{id: 'a', saw: true}]}), []);
    assert.deepEqual(detect(s, {witnesses: [{id: 'a', saw: true}, {id: 'b', saw: true}]}), ['seen']);
    assert.throws(() => defineLawBook([{id: 'bad.row', act: 'x', places: ['p'], enforcer: 'E', penalty: {kind: 'k', text: 't'}, evidence: {needs: []}, detection: [{via: 'magic', gives: 'g'}]}]));
});
