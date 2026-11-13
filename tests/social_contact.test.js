// Gifts, tastes and daily talk as dated thought rows (src/social_contact.js, social_contact_domain.js; first caller book_world_hp_contact.js).
// Failure scenarios guarded: a refused gift writing a feeling, a failed save leaving a feeling behind, a second talk the same day
// counting twice, and rows that never run out (fading is absence: no contact, no rows).
import test from 'node:test';
import assert from 'node:assert/strict';
import {tasteOf, giftThought, talkThought, CONTACT_TIERS, CONTACT_LIMITS} from '../src/social_contact.js';
import {configureSocialContact} from '../src/social_contact_domain.js';
import {RON_TASTES, RON_BIRTHDAY_YEAR_DAY} from '../src/book_world_hp_contact.js';
import {HP_TABLE_FOOD} from '../src/hp_table_food_items.js';
import {HP_LEAD_MAKING_KEYS} from '../src/hp_lead_making.js';
import {readMood} from '../src/mood_thoughts_domain.js';
import {domainRegistry} from '../src/domain_registry.js';

const P = 'book.hp.lead', RON = `${P}.ron`, HALL = `${P}.school_hall`, DAY = 1440;
const TART = JSON.stringify({id: `${P}.food.treacle_tart`}), HUMBUG = JSON.stringify({id: `${P}.food.peppermint_humbug`});
const pronoun = {him: 'him', he: 'he', his: 'his'};
const ask = name => domainRegistry.command('socialContact', name);
let fx, saves;
function fixture({clock = 40 * DAY, at = HALL, held = {}} = {}) {
    const person = location => ({location, inventory: 'simulation', life: 'alive'});
    return {state: {clock, actors: {player: {worldId: `${P}.world`}, [RON]: {worldId: `${P}.world`}},
        simulation: {people: {player: person(at), [RON]: person(HALL)}, owners: {player: {...held}, [RON]: {}}, custody: {}, equipment: {},
            knowledge: {player: {[`${P}.ron_known`]: {stage: 'seen', value: 'Ron'}}}}, worlds: {}}, gameplay: {}};
}
const wire = (commit = plan => { fx = plan; saves++; }) => configureSocialContact({plan: minutes => { const p = structuredClone(fx); p.state.clock += minutes; return p; }, commit, writable: () => true});
const reset = opts => { domainRegistry.load({}); fx = fixture(opts); saves = 0; wire(); };
const ronRows = () => readMood(RON, fx.state.clock).rows.filter(r => r.subject === 'player');

test('tastes: the item row wins, then a tag rule, then neutral; Ron likes sweets and has his own rows (SKR21 labels in the data)', () => {
    assert.deepEqual(tasteOf(RON_TASTES, `${P}.w9_flamel.frog`), {tier: 'love', basis: 'item'});
    assert.deepEqual(tasteOf(RON_TASTES, `${P}.food.treacle_tart`, ['food', 'sweet']), {tier: 'like', basis: 'tag:sweet'});
    assert.equal(tasteOf(RON_TASTES, `${P}.food.peppermint_humbug`, ['food', 'sweet', 'mint']).tier, 'neutral'); // item row beats the tag
    assert.equal(tasteOf(RON_TASTES, JSON.parse(HP_LEAD_MAKING_KEYS.slugs).id).tier, 'dislike');
    assert.deepEqual(tasteOf(RON_TASTES, 'anything.else'), {tier: 'neutral', basis: 'default'});
    assert.equal(HP_TABLE_FOOD.length, 3);
});

test('rows: Stardew tiers over ten, birthday triples within the core cap, keys name the minute or the day', () => {
    assert.deepEqual(Object.values(CONTACT_TIERS).map(t => t.magnitude), [8, 4, 2, -2, -4]);
    const love = giftThought({holder: RON, tier: 'love', phrase: 'a Chocolate Frog', pronoun, now: 100});
    assert.equal(love.magnitude, 8); assert.equal(love.minutes, 6 * DAY); assert.equal(love.source, 'social.gift');
    assert.equal(love.line, 'you gave him a Chocolate Frog, just the thing he likes best');
    const bday = giftThought({holder: RON, tier: 'love', phrase: 'a Chocolate Frog', pronoun, birthday: true, now: 100});
    assert.equal(bday.magnitude, 24); assert.equal(bday.source, 'social.birthday'); assert.match(bday.line, /^on his birthday, you gave him/);
    assert.notEqual(giftThought({holder: RON, tier: 'like', phrase: 'x', pronoun, now: 101}).key, giftThought({holder: RON, tier: 'like', phrase: 'x', pronoun, now: 102}).key);
    assert.equal(talkThought({holder: RON, pronoun, day: 7}).key, `social.talk.${RON}.player.d7`);
    assert.ok(RON_BIRTHDAY_YEAR_DAY === 213);
});

test('give: the thing moves to Ron, time passes, and one row about the player lands after the save', () => {
    reset({held: {[TART]: 1}});
    const v = ask('view')();
    assert.equal(v.people[0].name, 'Ron');
    assert.deepEqual(v.people[0].gifts.map(g => g.key), [TART]);
    const before = fx.state.clock, r = ask('give')({person: RON, key: TART});
    assert.equal(r.tier, 'like');
    assert.equal(fx.state.clock - before, CONTACT_LIMITS.giftMinutes);
    assert.equal(fx.state.simulation.owners.player[TART], undefined);
    assert.equal(fx.state.simulation.owners[RON][TART], 1);
    assert.deepEqual(ronRows().map(x => x.line), ['you gave him a slice of treacle tart, and he was glad of it']);
    assert.equal(ask('view')().people[0].giftReason, 'You are not carrying anything you could give.');
});

test('refusals write nothing: not carrying it, Ron not here, and a save that fails', () => {
    reset({held: {[TART]: 1}});
    assert.throws(() => ask('give')({person: RON, key: HUMBUG}), /not carrying/);
    fx = fixture({held: {[TART]: 1}, at: `${P}.dormitory`});
    assert.throws(() => ask('give')({person: RON, key: TART}), /Great Hall/);
    fx = fixture({held: {[TART]: 1}});
    wire(() => { throw Error('disk full'); });
    assert.throws(() => ask('give')({person: RON, key: TART}), /disk full/);
    assert.equal(ronRows().length, 0);
    assert.equal(fx.state.simulation.owners.player[TART], 1);
});

test('a disliked gift is accepted and sours; talk counts once a day; rows run out with no contact', () => {
    reset({held: {[HP_LEAD_MAKING_KEYS.slugs]: 1}});
    ask('give')({person: RON, key: HP_LEAD_MAKING_KEYS.slugs});
    assert.ok(ronRows()[0].value < 0);
    assert.equal(ask('talk')({person: RON}).counted, true);
    assert.equal(ask('talk')({person: RON}).counted, false);
    assert.equal(ronRows().filter(r => r.line.startsWith('you sat')).length, 1);
    fx.state.clock += 1 * DAY;
    assert.equal(ask('talk')({person: RON}).counted, true);
    fx.state.clock += 10 * DAY; // ten days away from Ron: everything has run out, nothing sour is added for the absence
    assert.equal(ronRows().length, 0);
});

test('take: food from the house table only at the Great Hall, two to a pocket; then it saves and reloads through moodThoughts', () => {
    reset({at: `${P}.dormitory`});
    const id = `take.${P}.food.treacle_tart`;
    assert.match(ask('view')().takeables[0].reason, /Great Hall/);
    fx = fixture();
    ask('take')({id}); ask('take')({id});
    assert.equal(fx.state.simulation.owners.player[TART], 2);
    assert.throws(() => ask('take')({id}), /full/);
    ask('give')({person: RON, key: TART});
    const saved = domainRegistry.save({});
    assert.equal(saved.moodThoughts.rows.length, 1);
    domainRegistry.load({});
    assert.equal(ronRows().length, 0);
    domainRegistry.load(JSON.parse(JSON.stringify(saved)));
    assert.equal(ronRows()[0].line, 'you gave him a slice of treacle tart, and he was glad of it');
});
