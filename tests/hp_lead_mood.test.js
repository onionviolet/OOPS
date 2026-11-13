// MND5 second world: Ron's mood from dated notes on the shared reader, and the practice offer it changes (book_world_hp_lead_mood.js).
import test from 'node:test';
import assert from 'node:assert/strict';
import {tieFacts, tieOfferView, tieOfferEffects, tieShownView} from '../src/person_ties.js';
import {hpLeadTieCommands} from '../src/world_packs/book_hp_lead_life_data.js';
import {ronMood, ronThoughts, HP_RON_ID, RON_MOOD} from '../src/book_world_hp_lead_mood.js';
import {structuredActionReasons} from '../src/structured_action_reasons.js';
import {UNMET_REASON} from '../src/player_reasons.js';

const P = 'book.hp.lead', DAY = 1440, PRACTICE = P + '.tie.ron_practice';
const note = at => ({stage: 'seen', value: 'x', at});
// A sorted Gryffindor at minute `clock` with Ron's regard at 2 and the given notes ({key suffix: minute}).
const harry = (clock, notes = {}, traits) => ({clock, actors: {player: {worldId: P + '.world', facts: {'hp.lead.house': 'gryffindor'}}},
    simulation: {people: {[HP_RON_ID]: {traits}}, relationships: {[HP_RON_ID]: {player: {axes: {'tie.affection': 2}, memories: []}}},
        knowledge: {player: Object.fromEntries(Object.entries(notes).map(([k, at]) => [P + '.' + k, note(at)]))}}});
const practice = s => tieOfferView(s).find(o => o.id === PRACTICE);

test('Ron is warm after the Sorting and cross after his feather stays put; the cross mood shuts practice until it passes', () => {
    const t0 = 50 * DAY, charms = t0 + 3 * DAY;
    assert.equal(ronMood(harry(t0, {'tie.ron.sorting': t0})).band, 'warm');
    assert.match(tieShownView(harry(t0, {'tie.ron.sorting': t0}))[0].line, /good humour with you: the hat put you in Gryffindor beside him/);
    let s = harry(charms + 30, {'tie.ron.sorting': t0, 'tie.ron.charms': charms});
    assert.equal(ronMood(s).band, 'sour', 'the Sorting thought has run out; the stuck feather is fresh');
    assert.equal(tieFacts(s)['mood.ron'], -6);
    assert.equal(practice(s).eligible, false);
    assert.match(practice(s).reasons[0], /had enough of that charm for today.*sour mood at the moment: his feather would not leave the desk/);
    assert.throws(() => tieOfferEffects(s, PRACTICE), /had enough of that charm/);
    // Not "short with you": the thought is about the charm, not Harry.
    assert.doesNotMatch(tieShownView(s)[0].line, /short with you/);
    s = harry(charms + DAY, {'tie.ron.sorting': t0, 'tie.ron.charms': charms});
    assert.equal(ronMood(s).rows.length, 0); assert.equal(practice(s).eligible, true, 'a day later Ron practises again');
});

test('the native practice command carries the same mood gate as the panel (one fact, mood.ron)', () => {
    const c = hpLeadTieCommands.find(x => x.id === PRACTICE);
    assert.deepEqual(c.requires.all.find(r => r.fact === 'mood.ron'), {fact: 'mood.ron', op: 'gte', value: -4, reason: 'Ron has had enough of that charm for today. Ask him again once he has cooled off.'});
    // The engine falls back when a command has no top-level reason; the shown reason is the first unmet leaf: regard, then mood.
    assert.equal(c.requires.reason, undefined);
    const base = {'actor.life': 'alive', 'native.ready': true, 'actor.hp.lead.atSchool': true, [`power.${P}.levitation.owned`]: true};
    assert.deepEqual(structuredActionReasons(c, [UNMET_REASON], {...base, 'tie.ron.affection': 2, 'mood.ron': -6}), ['Ron has had enough of that charm for today. Ask him again once he has cooled off.']);
    assert.deepEqual(structuredActionReasons(c, [UNMET_REASON], {...base, 'tie.ron.affection': 1, 'mood.ron': -6}), ['Spend some school time with Ron first.']);
    assert.equal(hpLeadTieCommands.find(x => x.id === P + '.tie.ron_family').requires.all.some(r => r.fact === 'mood.ron'), false, 'the family talk has no mood gate');
});

test('canon landing, varied route: Halloween leaves Ron sour until the troll night, the match leaves him glad', () => {
    const c = 80 * DAY;
    // Straight on to the troll the same evening: the friendship outweighs the correction.
    let s = harry(c + 400, {'w7_halloween.charms.seen': c, 'w7_halloween.thanks.seen': c + 390});
    assert.equal(ronMood(s).total, 2); assert.equal(practice(s).eligible, true);
    // Between the lesson and the troll he is sour, about Hermione, not Harry.
    s = harry(c + 60, {'w7_halloween.charms.seen': c});
    assert.equal(practice(s).eligible, false); assert.match(practice(s).reasons[0], /Hermione corrected his charm/);
    s = harry(c + 2 * DAY, {'w7_halloween.charms.seen': c}); assert.equal(practice(s).eligible, true, 'left alone it passes in two days');
    s = harry(c + 9 * DAY, {'w7_halloween.charms.seen': c, 'w7_halloween.thanks.seen': c + 390, 'w8_quidditch.catch.seen': c + 9 * DAY - 60});
    assert.equal(ronMood(s).band, 'warm'); assert.match(tieShownView(s)[0].line, /good humour with you: you caught the Snitch/);
});

test('Ron\'s own temperament sets how long a hurt stays; rows are rebuilt from notes and keyed by them', () => {
    const c = 80 * DAY, notes = {'tie.ron.charms': c};
    assert.equal(ronMood(harry(c + DAY + 10, notes)).rows.length, 0);
    assert.equal(ronMood(harry(c + DAY + 10, notes, ['grudging'])).band, 'sour', 'a grudging Ron keeps it four times as long');
    const rows = ronThoughts(harry(c, notes)).rows;
    assert.deepEqual(rows.map(r => [r.key, r.at, r.subject]), [[P + '.tie.ron.charms', c, P + '.levitation']]);
    assert.equal(ronMood({...harry(c, notes), actors: {player: {worldId: P + '.world', facts: {}}}}), null, 'not met yet: no mood');
    assert.ok(RON_MOOD.every(r => r.line.length <= 140));
});
