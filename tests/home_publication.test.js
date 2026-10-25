import test from 'node:test';
import assert from 'node:assert/strict';
import {configureHomes,residenceState} from '../src/home_domain.js';
import {domainRegistry} from '../src/domain_registry.js';
import {HOME_PLACES,HOME_SITE} from '../src/home_content.js';
import {emptyHomes,planHome} from '../src/home_model.js';
test('physical Home publication defers fallible display until the normal post-stock refresh',()=>{
 const availability=()=>{const a={is_unlocked:false};return {isUnlocked:()=>!!a.is_unlocked,getAvailabilityComponent:()=>a};};
 const locations=Object.fromEntries(['Village',HOME_SITE,...Object.values(HOME_PLACES).map(p=>p.location)].map(id=>[id,{...availability(),connected_locations:[],housing:availability(),crafting:availability(),activities:{meditating:availability()}}]));
 const c={clock:0,sequence:0,world:'base.frontier',location:'Hearthside cottage',body:{form:'human',hands:2,mobile:true,ownerId:'player',controllerId:'player'},inventory:{},money:100,fresh:true,ready:true,alive:true};
 const domain=domainRegistry.list().find(d=>d.id==='homes');let stock=1,renders=0,paths=0;
 configureHomes({locations,read:()=>c,pathing:()=>paths++,refreshPlace:()=>{renders++;assert.equal(stock,0,'inventory is published before rendering');throw Error('injected display failure');}});
 const raw={...emptyHomes(),beginning:true},home=planHome(raw,{type:'start',profile:'homeowner'},c).state;
 domain.load(home);assert.equal(renders,0);assert.ok(paths>0,'availability graph still publishes before rendering');
 home.properties.cottage.fixtures.incense={key:'{"id":"Home incense holder"}',owner:'player'};
 domain.load(home);assert.equal(renders,0,'a service change cannot invoke display within publication');stock=0;
 assert.throws(()=>domain.refresh(),/injected display failure/);assert.equal(renders,1);assert.ok(residenceState().properties.cottage.fixtures.incense);
 domain.refresh();assert.equal(renders,1,'the failed pending refresh is not recursively repeated');
});
