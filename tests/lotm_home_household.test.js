import test from 'node:test';
import assert from 'node:assert/strict';
const {lotmHomeView} = await import('../src/lotm_home_household.js');

const pack = {
    leadLife: {profile: {start: 'fx.place.flat'}},
    places: [{id: 'fx.place.flat', name: 'Moretti flat'}],
    people: [{id: 'fx.klein', indexId: 'lotm.person.klein-moretti', name: 'Klein Moretti'}, {id: 'fx.benson', indexId: 'lotm.person.benson', name: 'Benson'}, {id: 'fx.melissa', indexId: 'lotm.person.melissa', name: 'Melissa'}],
    householdActs: {stockViews: [{title: 'Groceries', knowledge: 'fx.k', rows: [{label: 'Potatoes', actor: 'player', key: 'potato'}, {label: 'Bread', actor: 'player', key: 'bread'}]}]}
};
const stateOf = (known = [], res = {}) => ({simulation: {knowledge: {player: {'fx.k': {value: 1}, ...Object.fromEntries(known.map(k => [k, {value: 1}]))}}}, actors: {player: {resources: res}}});
const ENGINE = /slice|projection|axis|duty set|standing order/i;

test('residents are filtered by what the player knows', () => {
    let v = lotmHomeView(stateOf(), {pack, duties: {items: []}});
    assert.deepEqual(v.residents.map(r => r.id), ['fx.klein']);
    v = lotmHomeView(stateOf(['book.lotm.cast.known.fx.benson', 'book.lotm.cast.met.fx.melissa']), {pack, duties: {items: []}});
    assert.deepEqual(v.residents.map(r => [r.name, r.relation]), [['Klein Moretti', 'you'], ['Benson', 'your elder brother'], ['Melissa', 'your younger sister']]);
    assert.equal(v.place.name, 'Moretti flat');
});
test('rent line comes from the rent duty item', () => {
    const due = lotmHomeView(stateOf(), {pack, duties: {items: [{id: 'lotm.rent', status: 'due', shutsIn: 2880, missed: 0}]}});
    assert.equal(due.rent.owed, 60); assert.equal(due.rent.dueIn, 2880); assert.match(due.rent.line, /5 soli.*due in 2 days/);
    const behind = lotmHomeView(stateOf(), {pack, duties: {items: [{id: 'lotm.rent', status: 'late', shutsIn: 0, missed: 2, escalation: 'Your landlady knocks.'}]}});
    assert.equal(behind.rent.owed, 120); assert.match(behind.rent.line, /2 weeks behind.*Your landlady knocks/);
    const none = lotmHomeView(stateOf(), {pack, duties: {items: []}});
    assert.equal(none.rent.owed, 0);
});
test('empty stores read sensibly and stocked ones list counts', () => {
    assert.deepEqual(lotmHomeView(stateOf(), {pack, duties: null}).stored, []);
    assert.match(lotmHomeView(stateOf(), {pack}).lines.at(-1), /Nothing is kept here/);
    const v = lotmHomeView(stateOf([], {potato: 3, bread: 0}), {pack});
    assert.deepEqual(v.stored, [{label: 'Potatoes', count: 3}]);
});
test('no pack and no engine words', () => {
    const v = lotmHomeView(stateOf(['book.lotm.cast.known.fx.benson']), {pack, duties: {items: [{id: 'lotm.rent', status: 'due', shutsIn: 90, missed: 1}]}});
    for(const l of v.lines) assert.doesNotMatch(l, ENGINE);
    const bare = lotmHomeView({}, {});
    assert.equal(bare.residents.length, 0); assert.equal(bare.place.name, 'Your rented flat');
});
