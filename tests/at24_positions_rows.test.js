// AT24: civil staff (signed contract) are not Nighthawk probationers: no merit assignments or evidence store in Work & merit.
import test from 'node:test';
import assert from 'node:assert/strict';
import {bare,run,hostOver,def,ctx,registry} from './lotm_helpers.js';
import {previewSimulationCommand} from '../src/simulation.js';

const begin=key=>{const o=hostOver(bare(50));o.host.enroll(key);return o;};
const mission=()=>[...registry.simulation.commands.keys()].find(k=>k.startsWith('book.lotm.merit_')&&!k.startsWith('book.lotm.merit_buy_'));

test('a signed civil clerk sees no merit block and cannot take a merit assignment',()=>{
 const o=begin('civil');
 o.box.p=run(run(o.box.p,'report_in'),'sign_contract');
 const v=o.host.view();
 assert.equal(v.merit,null,'no probationer merit rows for civil staff');
 const id=mission(),p=o.box.p,pv=previewSimulationCommand(p.state,registry,id,{...ctx(p,def(id.replace('book.lotm.','')).targetId),targetId:def(id.replace('book.lotm.','')).targetId});
 assert.equal(pv.visible,false);assert.equal(pv.eligible,false);
});
test('a Nighthawk probationer still has the merit block',()=>{
 const o=begin('probationer');
 const m=o.host.view().merit;
 assert.ok(m&&m.missions.length>0&&m.store.length>0);
});
