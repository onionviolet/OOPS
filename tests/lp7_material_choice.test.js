import test from 'node:test';
import assert from 'node:assert/strict';
import {createExpansionState, loadExpansionState, advanceSimulation} from '../src/expansion_engine.js';
import {initializeExpedition, expeditionRegistry as registry} from '../src/expedition_content.js';
import {beginBodyRecord} from '../src/body_progression.js';
import {beginFeatureObjects, commitFeatureObjectCommand, previewFeatureObjectCommand, fittingChoiceRecords} from '../src/feature_expansion_objects_host.js';
import {FEATURE_OBJECT_KEYS as K, FEATURE_OBJECT_IDS as I} from '../src/feature_expansion_objects.js';
import {cancelSimulationJob} from '../src/simulation.js';

// Controlled SOURCE fixtures, independently complemented by rebuilt UI play.
const body = {id:'native.player.body', form:'human', ownerId:'player', controllerId:'player', hands:2, mobile:true};
const ctx = p => ({actorId:'player', external:p.external, gameplay:p.gameplay, vitals:p.vitals || {player:{health:100,max_health:100,stamina:100,max_stamina:100}},
    nativeBody:body, nativeAlive:true,  facts:{location:'Village','village.craftsmanMet':true,'village.elderMet':true}});
const command = (p,id) => commitFeatureObjectCommand(p.state,registry,{id},ctx(p));
const advance = (p,n) => {const c=ctx(p); return advanceSimulation(p.state,registry,n,p.external,p.gameplay,{player:{...c,vitals:c.vitals.player}});};
const reload = p => ({...structuredClone(p),state:loadExpansionState(JSON.parse(JSON.stringify(p.state)),registry)});
const stock = (p,k) => p.gameplay.player.inventory[k] || 0;
function opened() {
    let p={state:initializeExpedition(createExpansionState(17)),external:{money:20},gameplay:{player:{inventory:{},skills:{Woodworking:{enabled:true,xp:0}},reputation:{}}}};
    p=beginBodyRecord(p.state,registry,ctx(p)); p.state.simulation.people.player.body=structuredClone(body); p=beginFeatureObjects(p.state,registry,ctx(p));
    p.gameplay.player.inventory={[K.sharp]:1,[K.log]:4,[K.sap]:3,[K.sound]:2}; return p;
}
test('LP7 baseline 2 vs stat choice 3 for identical paid cutting inputs',()=>{
    const p=opened(), baseline=advance(command(p,'feature_objects.cut_sharp_own'),4);
    assert.equal(stock(baseline,K.wet),2);
    const pending=command(p,'feature_objects.choose_stat');
    assert.equal(stock(pending,K.sharp),0);assert.equal(stock(pending,K.log),3);assert.equal(stock(pending,K.sap),2);
    assert.equal(pending.vitals.player.stamina,99); assert.equal(stock(pending,K.broad),0);
    let improved=advance(reload(pending),3);assert.equal(stock(improved,K.broad),1);
    improved=advance(command(improved,'feature_objects.cut_broad_own'),4);
    assert.equal(stock(improved,K.wet),3);assert.equal(stock(improved,K.broadDull),1);assert.equal(stock(improved,K.broad),0);
    assert.equal(stock(improved,K.log),2); assert.equal(improved.state.simulation.knowledge.player['feature_objects.method'],undefined);
    const repaired=command(improved,'feature_objects.repair_broad');assert.equal(stock(repaired,K.broad),1);assert.equal(stock(repaired,K.sap),1);
    assert.equal(stock(advance(command(repaired,'feature_objects.cut_broad_own'),4),K.wet),6);
});
test('LP7 function choice supplies guide but never teaches; learned matching produces real distinct output',()=>{
    let p=opened();const guided=advance(command(p,'feature_objects.choose_function'),3);
    assert.equal(stock(guided,K.fine),1);assert.equal(stock(guided,K.broad),0);
    assert.throws(()=>command(guided,'feature_objects.match_fine_own'));
    p=advance(command(p,'feature_objects.inspect'),2);
    p=advance(command(p,'feature_objects.observe_alignment'),2);
    p=advance(command(p,'feature_objects.learn'),3);
    assert.equal(previewFeatureObjectCommand(p.state,registry,'feature_objects.match_fine_own',ctx(p)).eligible,false);
    const broad=advance(command(p,'feature_objects.choose_stat'),3);
    assert.equal(previewFeatureObjectCommand(broad.state,registry,'feature_objects.match_fine_own',ctx(broad)).eligible,false);
    const fine=advance(command(p,'feature_objects.choose_function'),3);
    const matched=advance(command(reload(fine),'feature_objects.match_fine_own'),3);
    assert.equal(stock(matched,K.matched),1);assert.equal(stock(matched,K.sound),1);assert.equal(stock(matched,K.fineDull),1);
    assert.equal(stock(advance(reload(matched),3),K.matched),1);
});
test('LP7 shared single-slot capacity refuses both choices and pending work occupies it',()=>{
    for(const id of ['feature_objects.choose_stat','feature_objects.choose_function']) {
        const p=opened();p.state.simulation.sites[I.site].reservations.other='other';
        const q=previewFeatureObjectCommand(p.state,registry,id,ctx(p));assert.equal(q.eligible,false);assert.match(q.reasons.join(' '),/capacity/);
        assert.throws(()=>command(p,id));
        const pending=command(opened(),id),j=pending.state.simulation.jobs[0];
        assert.equal(pending.state.simulation.sites[I.site].reservations[j.id],'player');
        assert.equal(Object.keys(advance(reload(pending),3).state.simulation.sites[I.site].reservations).length,0);
    }
});
test('LP7 missing, borrowed, equipped and unsupported hands refuse without consuming; refit never stacks',()=>{
    for(const alter of [p=>delete p.gameplay.player.inventory[K.log],p=>delete p.gameplay.player.inventory[K.sap],p=>delete p.gameplay.player.inventory[K.sharp],
        p=>{p.state.simulation.custody.foreign={holder:'player',owner:I.miri,key:K.sharp,count:1};},p=>{p.state.simulation.equipment.player={hand:K.sharp};},p=>{p.state.simulation.people.player.body.hands=1;}]) {
        const p=opened();alter(p);const before=structuredClone(p);assert.throws(()=>command(p,'feature_objects.choose_stat'));assert.deepEqual(p,before);
    }
    for(const id of ['feature_objects.choose_stat','feature_objects.choose_function'])assert.throws(()=>command(advance(command(opened(),id),3),id));
});
test('LP7 pending reload, cancellation and complete reload conserve stock and outputs',()=>{
    for(const id of ['feature_objects.choose_stat','feature_objects.choose_function']) {
        const p=opened(), pending=reload(command(p,id)); assert.deepEqual(reload(pending),pending);
        const cancelled=cancelSimulationJob(pending.state,registry,pending.state.simulation.jobs[0].id,ctx(pending));
        assert.deepEqual(cancelled.gameplay,p.gameplay);assert.equal(cancelled.vitals.player.stamina,100);
        assert.equal(cancelled.state.actors.player.completed[id],undefined);
        const done=advance(pending,3); assert.deepEqual(reload(done),done);
        assert.deepEqual(advance(reload(done),3).gameplay,done.gameplay);
    }
});
test('LP7 old absent and old pending refit saves load unchanged; presentation separates labels and is pure',()=>{
    const absent=initializeExpedition(createExpansionState(17));assert.deepEqual(loadExpansionState(JSON.parse(JSON.stringify(absent)),registry),absent);
    let p=advance(command(opened(),'feature_objects.observe_alignment'),2);p=command(p,'feature_objects.refit_sharp');
    assert.equal(p.state.simulation.jobs[0].siteId,I.site);assert.deepEqual(reload(p),p);
    const oldDone=advance(reload(p),3);assert.equal(stock(oldDone,K.fine),1);
    const before=structuredClone(p),text=fittingChoiceRecords(p.state,ctx(p)).map(r=>r.text).join(' ');
    assert.match(text,/Rarity: Common/);assert.match(text,/Item level: 1/);assert.match(text,/Learned method: Grain matching not learned/);assert.deepEqual(p,before);
});
