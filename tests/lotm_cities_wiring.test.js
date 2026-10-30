import test from 'node:test';
import assert from 'node:assert/strict';
import {withCities,lotmRegionAt,journeyUnderRestrictions,CITY_PREFIX,TINGEN_STATION} from '../src/book_world_lotm_cities.js';
import {defineJourneys} from '../src/cast_journeys.js';
const city={region:{id:'metro',label:'Metro',era:{},dial:{strictness:1,hazard:1,priceLevel:1},arrival:{id:'metro.in',text:'by rail'},places:[{id:'stn',label:'Metro station'}],institutions:[],offices:[],errands:[],prices:[],customs:[],statutes:[]},
 route:{id:'r',world:'lotm',dial:{hazard:1,priceLevel:1},legs:[{id:'train',from:'tingen',to:'stn',means:'rail',minutes:360,fare:{sum:8},hours:[7,24]}]}};
const pack={places:[{id:'p1'}],journeys:{journeys:[{id:'old'}]}};
test('city legs become journey rows between pack places, starting at the Tingen station', () => {
 const out=withCities(pack,[city]);
 assert.deepEqual(out.places.map(p=>p.id),['p1',TINGEN_STATION.id,`${CITY_PREFIX}metro.stn`]);
 const row=out.journeys.journeys.at(-1);
 assert.equal(row.id,`${CITY_PREFIX}metro.train`);assert.equal(row.from,TINGEN_STATION.id);assert.equal(row.fare,8);
 const [def]=defineJourneys([row],{worldId:'w',group:'g',situationId:'s'});
 assert.equal(def.location,TINGEN_STATION.id);assert.equal(def.duration,360);
 assert.equal(withCities(pack,[{...city,route:null}]),pack,'a city with no route changes nothing');
});
test('the region reads for the place the lead stands in', () => {
 assert.equal(lotmRegionAt('lotm.place.flat',{hour:9,money:5,list:[city]}),null);
 assert.equal(lotmRegionAt(`${CITY_PREFIX}metro.stn`,{hour:9,money:5,list:[city]}).id,'metro');
});
test('a travel halt closes the leg for the day; no restriction leaves it alone', () => {
 const offer={id:`${CITY_PREFIX}metro.train`,means:'rail',eligible:true,reasons:[]};
 assert.equal(journeyUnderRestrictions(offer,[],10),offer);
 const closed=journeyUnderRestrictions(offer,[{kind:'travel_halt',legs:['train'],eventId:'e'}],10);
 assert.equal(closed.eligible,false);assert.match(closed.reasons[0],/Halted/);
});
