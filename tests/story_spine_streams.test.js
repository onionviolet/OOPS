import test from 'node:test';
import assert from 'node:assert/strict';
import {createStreams} from '../src/seeded_streams.js';
import {createGeneratedPeople} from '../src/generated_people.js';
import {initializeStoryletDecks,advanceStoryletDecks,STORYLET_DECKS} from '../src/storylet_deck.js';
test('new people use isolated saved named stream; old generation remains exact',()=>{
 const a={rng:43,streams:createStreams(43)},b=structuredClone(a);
 assert.deepEqual(createGeneratedPeople(43,0,[],a),createGeneratedPeople(43,0,[],b));assert.deepEqual(a,b);
 assert.ok(a.streams.cells['world.people:village@base.frontier'].n>0);
 assert.deepEqual(createGeneratedPeople(43,0),createGeneratedPeople(43,0));
});
test('new decks consume named cells, restore next draw; old deck cursors stay local',()=>{
 const fixture=named=>({clock:0,rng:43,...(named?{streams:createStreams(43)}:{}),actors:{player:{worldId:'base.frontier',facts:{'storylets.enabled':true}}},simulation:{seed:43,checks:{},events:{},people:{player:{life:'alive'}}}});
 const a=fixture(true),old=fixture(false);initializeStoryletDecks(a);initializeStoryletDecks(old);
 assert.ok(STORYLET_DECKS.every(d=>a.simulation.decks[d.id].randomSource==='named'));
 const registry={simulation:{events:new Map()}},facts=()=>({'actor.location':'Village'});
 a.clock=12;const b=structuredClone(a);advanceStoryletDecks(a,registry,facts,()=>{});advanceStoryletDecks(b,registry,facts,()=>{});assert.deepEqual(a,b);
 assert.ok(a.streams.cells['deck:village.daily@base.frontier']);
 old.clock=12;advanceStoryletDecks(old,registry,facts,()=>{});assert.equal(old.streams,undefined);
});
