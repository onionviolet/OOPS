// The shared home overview's world port (worldHomeModel) and its two world consumers: Klein's flat and Harry's guardians' house.
import test from 'node:test';
import assert from 'node:assert/strict';
import {worldHomeModel, homeModelLines} from '../src/home_overview_model.js';
import {hpLeadHomeView} from '../src/hp_lead_home.js';
import {lotmHomeView} from '../src/lotm_home_household.js';

test('the port returns the overview model shape from world data alone', () => {
    const m = worldHomeModel({place: {id: 'w.home', name: 'A room'}, here: true,
        residents: [{name: 'You', self: true}, {name: 'Ann', relation: 'your sister'}, {name: 'Bo'}],
        dues: [{id: 'rent', label: 'Rent', words: 'Rent is due.', warn: true, next: 'Pay it.'}], stores: [{label: 'Bread', count: 2}, {label: 'Salt', count: 0}]});
    for(const k of ['homes', 'header', 'fittings', 'rooms', 'upkeep', 'storage', 'household', 'construction', 'sites', 'next']) assert.ok(k in m, k);
    assert.deepEqual(homeModelLines(m), ['Ann (your sister) and Bo live here with you.', 'Rent is due.', 'Kept here: Bread (2).']);
    assert.deepEqual(m.next, [{id: 'rent', text: 'Pay it.'}]);
    assert.equal(m.storage.used, 2);
    assert.equal(worldHomeModel({}).household[0].text, 'No other residents are known to you.');
});

test('Harry: the house lists the guardians present in the life, and says where he is', () => {
    const people = {player: {location: 'book.hp.lead.cupboard'}, 'book.hp.lead.vernon': {}, 'book.hp.lead.petunia': {}, 'book.hp.lead.dudley': {}};
    const v = hpLeadHomeView({simulation: {people}});
    assert.equal(v.model.world, true);
    assert.deepEqual(v.lines.slice(0, 2), ['You are at home.', 'Your uncle, your aunt and your cousin live here with you.']);
    people.player.location = 'book.hp.lead.school_hall';
    assert.equal(hpLeadHomeView({simulation: {people}}).lines[0], 'You are away from the house.');
});

test('Klein: the flat reads through the same port', () => {
    const v = lotmHomeView({}, {});
    assert.equal(v.model.world, true);
    assert.deepEqual(v.lines, homeModelLines(v.model));
});
