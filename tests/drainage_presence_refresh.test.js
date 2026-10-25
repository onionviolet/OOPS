import test from 'node:test';
import assert from 'node:assert/strict';
import {configureDrainage} from '../src/drainage_site_domain.js';
import {domainRegistry} from '../src/domain_registry.js';
import {drainageLocation} from '../src/drainage_layout.js';
test('a fresh life never refreshes pathing from an unenrolled site; enrolled physical passage changes refresh once',()=>{
 let root={worlds:{'base.frontier':{facts:{}}},actors:{helper:{worldId:'base.frontier'}},simulation:{knowledge:{player:{}},people:{helper:{life:'alive',location:'Village',body:{form:'human'}}}}},refreshes=0;
 class Place{constructor(d){Object.assign(this,d);this.availability={is_unlocked:false};}getAvailabilityComponent(){return this.availability;}}
 const locations={Village:new Place({connected_locations:[]})};configureDrainage({registry:{simulation:{situations:new Map()}},locations,SafeLocation:Place,root:()=>root,refreshScene:()=>refreshes++});
 domainRegistry.tick(5);root.simulation.people.helper.location='Arlmere family manor';domainRegistry.tick(5);assert.equal(refreshes,0,'ordinary native travel caches remain untouched without an enrolled site');
 root.worlds['base.frontier'].facts={'drainage.seed':71,'drainage.brace':false,'drainage.rope':false,'drainage.crate':0};for(let i=0;i<6;i++)root.simulation.knowledge.player['drainage.route.'+i]={value:'Test observation'};domainRegistry.tick(1);assert.equal(refreshes,1);domainRegistry.tick(10);assert.equal(refreshes,1);
 root.simulation.people.helper.location=drainageLocation(3);domainRegistry.tick(1);assert.equal(refreshes,2);assert.equal(locations[drainageLocation(5)].availability.is_unlocked,true);domainRegistry.tick(1);assert.equal(refreshes,2);
 root.simulation.people.helper.location=drainageLocation(2);domainRegistry.tick(1);assert.equal(refreshes,3);assert.equal(locations[drainageLocation(5)].availability.is_unlocked,false);
});
