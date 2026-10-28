import test from 'node:test';
import assert from 'node:assert/strict';
import {contractsFor} from '../scripts/lead_run/conflict_contracts.mjs';
import {afterActions} from '../scripts/lead_run/after_actions.mjs';

test('conflict contracts stay inside LOTM chapters 1-24 and retain evidence locators',()=>{
 const base={pov:'lead',present:['lotm.person.klein-moretti','lotm.person.intruder'],steps:[{class:'fight',verb:'block the door'}],outcomes:[{fact:'intruder retreats'}],evidence:[{locator:'zh 第2章 p10'}],place:'room'};
 const rows=contractsFor([{...base,beat:'in'},{...base,beat:'out',evidence:[{locator:'zh 第25章 p1'}]}]);
 assert.equal(rows.length,1);assert.equal(rows[0].beat,'in');assert.deepEqual(rows[0].locators,['zh 第2章 p10']);assert.equal(rows[0].stakes,null);
});

test('danger cues select null-class steps without treating unrelated scenes as conflicts',()=>{
 const danger={pov:'lead',beat:'danger',steps:[{verb:'hide from police'}],outcomes:[],present:['lotm.person.klein-moretti'],evidence:[{locator:'zh 第3章 p2'}],footprint:{hazards:[]}};
 const safe={...danger,beat:'safe',steps:[{verb:'inspect a mirror'}],evidence:[{locator:'zh 第4章 p2'}]};
 const rows=contractsFor([danger,safe]);assert.equal(rows.length,1);assert.equal(rows[0].beat,'danger');
});

test('option-based after-action pairs retain their basis and the next shared scene',()=>{
 const a={beat:'a',pov:'lead',present:['mol.person.zorian-kazinski','mol.person.kirielle'],evidence:[{locator:'en b1 c1 p1'}],steps:[{class:'socialize',verb:'scold'}],options:[{action:'ask Kirielle to stop',needs:['mol.person.kirielle']}]};
 const b={beat:'b',pov:'lead',present:['mol.person.zorian-kazinski','mol.person.kirielle'],evidence:[{locator:'en b1 c1 p5'}],steps:[{class:'travel'}]};
 const outside={...b,beat:'c',present:['mol.person.zorian-kazinski'],evidence:[{locator:'en b1 c5 p10'}]};
 const rows=afterActions([a,b,outside],'mol').filter(x=>x.basis==='option');assert.equal(rows.length,1);assert.equal(rows[0].basis,'option');assert.equal(rows[0].target,'mol.person.kirielle');assert.equal(rows[0].responseClass,'travel');assert.deepEqual(rows[0].scenes,['a','b']);
});

test('co-presence pairs use the first scene dominant class and later lead scene response',()=>{
 const a={beat:'a',pov:'lead',present:['mol.person.zorian-kazinski','mol.person.kirielle'],evidence:[{locator:'en b1 c1 p1'}],steps:[{verb:'argue',class:null},{verb:'argue',class:null}],options:[]};
 const b={beat:'b',pov:'lead',present:['mol.person.zorian-kazinski','mol.person.kirielle'],evidence:[{locator:'en b1 c1 p5'}],steps:[{verb:'study spell',class:'study'}]};
 const rows=afterActions([a,b],'mol');assert.equal(rows.length,1);assert.equal(rows[0].basis,'copresence');assert.equal(rows[0].triggerClass,'socialize');assert.equal(rows[0].responseClass,'study');
});
