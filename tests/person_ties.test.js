// LT8 one person record: engine (person_ties.js) and both lead-life declarations (Klein's captain, Harry's classmate).
import test from 'node:test';
import assert from 'node:assert/strict';
import {registerWorldTies, tieEffects, tieFacts, tieOfferView, tieOfferEffects, tieOfferCommands, worldTies, TIE_KINDS} from '../src/person_ties.js';
import {hpLeadLife, HP_LEAD_TIES, hpLeadTieCommands} from '../src/world_packs/book_hp_lead_life_data.js';

const W = 'test.ties.world';
registerWorldTies({worldId: W, situationId: 'test.ties.situation', kinds: ['trust'], people: {cap: 'test.person.cap'},
    offers: [{id: 'test.tie.ask', alias: 'cap', kind: 'trust', atLeast: 2, label: 'Ask', description: 'Ask the captain.', blocked: 'Not yet.', note: {key: 'test.tie.asked', value: 'He told you.'}}]});
const stateWith = trust => ({actors: {player: {worldId: W}}, simulation: {knowledge: {player: {}}, relationships: trust == null ? {} : {'test.person.cap': {player: {axes: {'tie.trust': trust}, memories: []}}}}});

test('a tie change pairs the hidden regard with an observation the player holds', () => {
    const [rel, seen] = tieEffects(W, {alias: 'cap', kind: 'trust', seen: {key: 'test.tie.seen', value: 'He signed it.'}});
    assert.deepEqual(rel, {type: 'relationship', actor: 'test.person.cap', target: 'player', axis: 'tie.trust', amount: 1});
    assert.equal(seen.actor, 'player');
    assert.deepEqual(seen.basis, {kind: 'observation', attributedTo: 'test.person.cap', situationId: 'test.ties.situation'});
    assert.ok(!JSON.stringify(seen).includes('tie.trust'), 'the note carries no number or axis');
    assert.throws(() => tieEffects(W, {alias: 'cap', kind: 'affection', seen: {key: 'k', value: 'v'}}), /Invalid tie change/);
});

test('facts resolve to 0 before any act and read the holder regard after', () => {
    assert.deepEqual(tieFacts(stateWith(null)), {'tie.cap.trust': 0});
    assert.deepEqual(tieFacts(stateWith(3)), {'tie.cap.trust': 3});
    assert.deepEqual(tieFacts({actors: {player: {worldId: 'elsewhere'}}}), {});
});

test('an offer is shut below the threshold with its reason, open at it, and taken once', () => {
    assert.deepEqual(tieOfferView(stateWith(1)), [{id: 'test.tie.ask', label: 'Ask', description: 'Ask the captain.', eligible: false, reasons: ['Not yet.']}]);
    assert.throws(() => tieOfferEffects(stateWith(1), 'test.tie.ask'), /Not yet/);
    const open = stateWith(2);
    assert.equal(tieOfferView(open)[0].eligible, true);
    const [note] = tieOfferEffects(open, 'test.tie.ask');
    assert.equal(note.key, 'test.tie.asked');
    open.simulation.knowledge.player['test.tie.asked'] = {value: 'He told you.'};
    assert.deepEqual(tieOfferView(open), [{id: 'test.tie.ask', label: 'Ask', taken: true, said: 'He told you.'}]);
    assert.throws(() => tieOfferEffects(open, 'test.tie.ask'), /already/);
});

test('a native offer command gates on the tie fact and keeps the host base gate', () => {
    const [cmd] = tieOfferCommands(W, {requires: {all: [{fact: 'here', op: 'eq', value: true}]}, duration: 5});
    assert.equal(cmd.once, true);
    assert.deepEqual(cmd.requires.all.map(r => r.fact), ['here', 'tie.cap.trust']);
    assert.equal(cmd.effects[0].basis.attributedTo, 'test.person.cap');
});

test('declarations refuse unknown kinds, aliases and offers without a reason', () => {
    assert.throws(() => registerWorldTies({worldId: 'x.w', situationId: 'x.s', kinds: ['love'], people: {a: 'x.p'}}), /Unknown tie kind/);
    assert.throws(() => registerWorldTies({worldId: 'x.w', situationId: 'x.s', people: {}}), /people/);
    assert.throws(() => registerWorldTies({worldId: 'x.w', situationId: 'x.s', kinds: ['trust'], people: {a: 'x.p'}, offers: [{id: 'x.o', alias: 'a', kind: 'trust', atLeast: 1, label: 'L', description: 'D', note: {key: 'x.k', value: 'v'}}]}), /Invalid tie offer/);
    assert.equal(TIE_KINDS.length, 5);
});

test('Harry: Ron is a school person, the Sorting and first Charms raise his regard, and the evening talk needs both', () => {
    assert.equal(worldTies('book.hp.lead.world'), HP_LEAD_TIES);
    const ron = hpLeadLife.simulation.people.find(p => p.id === 'book.hp.lead.ron');
    assert.equal(ron.location, 'book.hp.lead.school_hall');
    const cmd = id => hpLeadLife.simulation.commands.find(c => c.id === id);
    const raises = c => c.effects.filter(e => e.type === 'relationship' && e.actor === 'book.hp.lead.ron' && e.axis === 'tie.affection').length;
    assert.equal(raises(cmd('book.hp.lead.sorting')), 1);
    assert.equal(raises(cmd('book.hp.lead.lesson_charms')), 1);
    assert.equal(hpLeadTieCommands.length, 1);
    const talk = cmd('book.hp.lead.tie.ron_family');
    assert.deepEqual(talk.requires.all.at(-1), {fact: 'tie.ron.affection', op: 'gte', value: 2, reason: HP_LEAD_TIES.offers[0].blocked});
});
