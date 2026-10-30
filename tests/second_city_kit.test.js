import test from 'node:test';
import assert from 'node:assert/strict';
import {defineRegion, readRegion} from '../src/region_kit.js';
import {defineRoute, quoteRoute, settleRoute} from '../src/travel_legs.js';
import {defineStatutes, rulingFor} from '../src/jurisdiction_rules.js';
import {emptyPersonas, addPersona, changeStanding, attitudeOf, expose} from '../src/persona_standing.js';

// Fixture world, not a book: two cities, one road between them.
const city = (id, extra = {}) => defineRegion({id, world: 'fixture', label: id.toUpperCase(), dial: extra.dial,
    arrival: {id: `${id}.arrive`, from: 'home', text: 'You step off the coach.', evidence: 'I'},
    places: [{id: `${id}.hall`, label: 'Hall', hours: [8, 18]}, {id: `${id}.inn`, label: 'Inn'}],
    institutions: [{id: `${id}.guild`, label: 'Guild', kind: 'guild', place: `${id}.hall`, enforcer: 'wardens',
        services: [{id: 'permit', label: 'Buy a permit', price: 10, unit: 'pence', minRank: 'known_face'}, {id: 'notice', label: 'Read the notice board'}]}],
    offices: [{id: `${id}.clerk`, label: 'Junior clerk', institution: `${id}.guild`, minRank: 'neighbour'}],
    errands: [{id: `${id}.parcel`, label: 'Carry a parcel', institution: `${id}.guild`, pay: 3}],
    prices: [{id: 'bed', label: 'A bed', amount: 2, unit: 'pence', basis: 'quoted'}, {id: 'ship', label: 'Cargo fee', amount: 'unstated', basis: 'proposed'}]});

test('a second city is entered at Stranger and services answer with hours, rank and price', () => {
    const r = city('aster');
    const day = readRegion(r, {reputation: 0, hour: 12, money: 50});
    assert.equal(day.rank.id, 'stranger');
    const permit = day.institutions[0].services.find(s => s.id === 'permit');
    assert.equal(permit.available, false);
    assert.match(permit.reasons.join(' '), /Known Face/);
    assert.equal(day.institutions[0].services.find(s => s.id === 'notice').available, true);
    const known = readRegion(r, {reputation: 12, hour: 12, money: 50});
    assert.equal(known.institutions[0].services.find(s => s.id === 'permit').priceText, '10 pence');
    assert.equal(known.institutions[0].services.find(s => s.id === 'permit').available, true);
    const night = readRegion(r, {reputation: 12, hour: 22, money: 50});
    assert.equal(night.institutions[0].open, false);
    assert.match(night.institutions[0].services[0].reasons.join(' '), /8:00-18:00/);
    assert.equal(readRegion(r, {reputation: 12, hour: 12, money: 4}).institutions[0].services[0].available, false);
    assert.equal(known.offices[0].eligible, false);
    assert.equal(known.priceList.find(p => p.id === 'ship').text, 'price not recorded');
});
test('the price dial scales prices and invalid rows are refused', () => {
    const dear = readRegion(city('bryn', {dial: {priceLevel: 2}}), {reputation: 12});
    assert.equal(dear.priceList[0].amount, 4);
    assert.throws(() => defineRegion({id: 'x', world: 'w', label: 'X', arrival: {id: 'a', text: 't'}, places: [{id: 'p', label: 'P'}], institutions: [{id: 'i', label: 'I', kind: 'k', place: 'nowhere'}]}));
    assert.throws(() => defineRegion({id: 'x', world: 'w', label: 'X'}), /arrival/);
});

const route = defineRoute({id: 'coast', world: 'fixture', legs: [
    {id: 'l1', from: 'aster', to: 'port', means: 'road', minutes: 600, fare: {perKm: 1, km: 30, cap: 20}, hours: [6, 20], hazards: [{id: 'bandits', chance: 0.5, kind: 'ambush', result: 'A band stops the coach.'}]},
    {id: 'l2', from: 'port', to: 'bryn', means: 'sea', minutes: 2880, fare: {unstated: true}}]});

test('a route quotes legs, waits for service windows and charges fares', () => {
    const q = quoteRoute(route, {money: 100, minuteOfDay: 21 * 60, proposedFare: 15});
    assert.equal(q.legs[0].waitMinutes, 9 * 60);
    assert.equal(q.legs[0].fare, 20);
    assert.equal(q.legs[1].fareBasis, 'proposed');
    assert.equal(q.totalFare, 35);
    assert.equal(q.totalDays, Math.ceil(q.totalMinutes / 1440));
    assert.equal(quoteRoute(route, {money: 10, proposedFare: 15}).eligible, false);
    assert.throws(() => defineRoute({id: 'bad', world: 'w', legs: [{id: 'a', from: 'x', to: 'y', means: 'road', minutes: 5}, {id: 'b', from: 'z', to: 'w', means: 'road', minutes: 5}]}));
});
test('settling a trip gives days away, the fare and a hazard that repeats on replay', () => {
    const a = settleRoute(route, {day: 3, minuteOfDay: 8 * 60, seed: 7, money: 100, proposedFare: 15});
    assert.equal(a.arrivedAt, 'bryn');
    assert.equal(a.days, Math.ceil(a.minutes / 1440));
    assert.ok(a.days >= 3);
    assert.equal(a.fareCharged, 35);
    assert.deepEqual(settleRoute(route, {day: 3, minuteOfDay: 8 * 60, seed: 7, money: 100, proposedFare: 15}), a);
    const days = [...Array(40).keys()], hits = days.filter(d => settleRoute(route, {day: d, seed: 7, proposedFare: 0}).events.length);
    assert.ok(hits.length > 5 && hits.length < 35, `hazard fires on some days, not all (${hits.length}/40)`);
    const safe = defineRoute({...route, dial: {hazard: 0}});
    assert.ok(days.every(d => settleRoute(safe, {day: d, seed: 7}).events.length === 0));
    assert.throws(() => settleRoute(route, {money: 1}), /cannot be started/);
});

test('one act gets different rulings in two jurisdictions', () => {
    const t = defineStatutes([
        {id: 's.aster', act: 'carry-blade', places: ['aster'], penalty: {kind: 'fine', amount: 5, text: 'A five pence fine.'}, enforcer: 'wardens', evidence: {needs: ['seen', 'witness']}, exemptions: [{when: 'licensed', text: 'Guild licence holders may carry.'}]},
        {id: 's.bryn', act: 'carry-blade', places: ['bryn'], penalty: {kind: 'seizure', text: 'The blade is taken.'}, enforcer: 'harbour watch', evidence: {needs: ['seen']}}]);
    const a = rulingFor(t, 'carry-blade', 'aster', {evidence: ['seen']});
    const b = rulingFor(t, 'carry-blade', 'bryn', {evidence: ['seen']});
    assert.equal(a.penalty, null); assert.deepEqual(a.needs, ['witness']);
    assert.equal(b.penalty.kind, 'seizure'); assert.equal(b.enforcer, 'harbour watch');
    assert.equal(rulingFor(t, 'carry-blade', 'aster', {evidence: ['seen'], strictness: 2}).penalty.kind, 'fine');
    assert.equal(rulingFor(t, 'carry-blade', 'aster', {flags: ['licensed']}).lawful, true);
    assert.equal(rulingFor(t, 'carry-blade', 'elsewhere').covered, false);
});

test('two personas of one body hold different standing and leak only when linked and exposed', () => {
    let s = addPersona(emptyPersonas(), {id: 'persona.a', bodyId: 'body.x', link: 0.8});
    s = addPersona(s, {id: 'persona.b', bodyId: 'body.x', link: 0});
    s = changeStanding(s, 'persona.a', 'aster', 60);
    assert.equal(attitudeOf(s, 'persona.a', 'aster').id, 'neighbour');
    assert.equal(attitudeOf(s, 'persona.b', 'aster').id, 'stranger');
    const e = expose(s, 'persona.a', 'aster', {observerId: 'npc.1'});
    assert.equal(e.leaked, 30);
    assert.equal(expose(e.state, 'persona.a', 'aster', {observerId: 'npc.1'}).leaked, 0);
    assert.equal(expose(s, 'persona.b', 'aster', {observerId: 'npc.1'}).leaked, 0);
    assert.throws(() => addPersona(s, {id: 'persona.a', bodyId: 'body.x'}));
});
