import test from 'node:test';
import assert from 'node:assert/strict';
import {fresh,run,at,holds,hostOver,I} from './lotm_helpers.js';
import {LOTM_LOCATIONS as L,LOTM_KEYS as K} from '../src/book_world_lotm_ids.js';
import {defineItemIdentity,itemIdentityOf,itemReading,itemReadingLine,projectItemIdentityView} from '../src/item_identity.js';
import {pathwayRows} from '../src/book_world_lotm_rows.js';
// ITM23 / FRC54 (proposal): an item is named by what this character has learned; another character sees it differently.
// Failure scenario guarded: a broker lot or a held dose showing its saved id ("... (Savant line, Sequence 9)") before the
// appraiser has said so, or one actor's verdict naming the item for a different actor.
const start=()=>at(run(fresh(2000),'report_in'),L.docks);
const knows=(p,actor='player')=>p.state.simulation.knowledge[actor]||{};
const read=(p,key,actor)=>itemReading(knows(p,actor),itemIdentityOf(key));
const trade=(p,id)=>hostOver(p).host.view().broker.trades.find(t=>t.id===id);

test('a forged lot: unknown, then the seller\'s word as a guess, then the appraiser\'s verdict proves the guess wrong',()=>{
 let p=start();
 assert.equal(read(p,K.hairs).certainty,'open');assert.equal(read(p,K.hairs).name,'Bundle of hairs');
 p=run(p,'lot_pay_hairs');
 assert.deepEqual([read(p,K.hairs).certainty,read(p,K.hairs).name],['guessed','Bundle sold as rare hairs']);
 assert.equal(trade(p,'hairs').label,'Bundle sold as rare hairs (unchecked)');assert.equal(trade(p,'hairs').certainty,'guessed');
 p=run(p,'lot_verify_hairs');
 assert.deepEqual([read(p,K.hairs).certainty,read(p,K.hairs).name],['known','Forged bundle of hairs']);
 assert.equal(trade(p,'hairs').label,'Forged bundle of hairs');
});

test('the same item reads differently for another character, who holds none of the buyer\'s knowledge',()=>{
 let p=run(run(start(),'lot_pay_frog'),'lot_verify_frog');
 assert.equal(read(p,K.frog).name,'Dried black-spotted frog');
 assert.equal(read(p,K.frog,I.supervisor).certainty,'open');assert.equal(read(p,K.frog,I.broker).name,'Dried frog');
 // A second observer told the seller's word (the one knowledge shape) guesses; it does not inherit the buyer's verdict.
 const told={'book.lotm.lot.frog.held':{stage:'understood',value:'told',at:5,basis:{kind:'instruction'}}};
 assert.deepEqual([itemReading(told,itemIdentityOf(K.frog)).certainty,itemReading(told,itemIdentityOf(K.frog)).provenance],['guessed','You were told']);
});

test('a held market dose is named by the reading, never by its saved id, on every surface that names it',()=>{
 const sv=pathwayRows.find(r=>r.key==='sv');
 let p=start();
 assert.equal(projectItemIdentityView(K.marketSv9,knows(p),{name:JSON.parse(K.marketSv9).id}).name,'Unmarked prepared dose');
 assert.doesNotMatch(projectItemIdentityView(K.marketSv9,knows(p)).description,/Savant/);
 p=run(p,'lot_pay_dose9_sv');
 assert.equal(trade(p,'dose9_sv').label,'Unmarked dose, sold as Sequence 9 (unchecked)');assert.doesNotMatch(trade(p,'dose9_sv').label,/Savant/);
 p=run(run(p,'lot_verify_dose9_sv'),'lot_settle_dose9_sv');assert.equal(holds(p,K.marketSv9),1);
 const view=projectItemIdentityView({id:JSON.parse(K.marketSv9).id},knows(p),{name:'raw'});
 assert.deepEqual([view.name,view.identified,view.certainty],[`${sv.potion} potion, Sequence 9`,true,'known']);
 assert.ok(hostOver(p).host.view().marketHeld.includes(`${sv.potion} potion, Sequence 9`));
});

test('readings: strongest route wins, a cap holds a record down to a guess, unknown items pass through, bad rows fail at load',()=>{
 const id=defineItemIdentity({itemId:'test.item_identity.box',open:{name:'Small box'},routes:[{knowledge:'k.shake',name:'Box that rattles',cap:'guessed'},{knowledge:'k.open',name:'Box of buttons'}]});
 assert.equal(itemReading({'k.shake':{stage:'understood',at:9}},id).certainty,'guessed');
 assert.equal(itemReading({'k.shake':{stage:'understood',at:9},'k.open':{stage:'seen',at:1}},id).name,'Box of buttons');
 assert.equal(itemReading({'k.open':{stage:'interpreted',at:1}},id).certainty,'guessed','an interpreted entry stays a guess on a known route');
 assert.equal(itemReading({'k.open':{stage:'seen',basis:{status:'obscured'}}},id).certainty,'open');
 assert.equal(itemReadingLine(itemReading({},id)),'Small box (unknown)');
 assert.deepEqual(projectItemIdentityView('{"id":"Not registered"}',{},{name:'Kept',description:'d'}),{name:'Kept',description:'d'});
 assert.throws(()=>defineItemIdentity({itemId:'test.item_identity.box',open:{name:'x'}}),/already defined/);
 assert.throws(()=>defineItemIdentity({itemId:'test.item_identity.bad',open:{name:'x'},routes:[{knowledge:'k',name:'y',cap:'open'}]}),/cap/);
});

// BDT86 / SPR31 (proposal): the use route. Failure scenario guarded: using a pale vial names it for everyone (the old view read
// knowledge.player for any seat), or the use teaches a name without spending the charge, or the row does not say it came from use.
import {createExpansionState,advanceSimulation} from '../src/expansion_engine.js';
import {initializeExpedition,expeditionRegistry as fieldRegistry} from '../src/expedition_content.js';
import {beginBodyRecord} from '../src/body_progression.js';
import {beginFeatureObjects,commitFeatureObjectCommand} from '../src/feature_expansion_objects_host.js';
import {enrollReferenceGameplay} from '../src/reference_gameplay_state.js';
import {commitReferenceGameplayCommand} from '../src/reference_gameplay_host.js';
import {commitNethackFieldcraftCommand} from '../src/nethack_fieldcraft_host.js';
import {NETHACK_FIELDCRAFT_KEYS as FK,NETHACK_FIELDCRAFT_IDS as FI} from '../src/nethack_fieldcraft_content.js';
import {projectItemView} from '../src/item_views.js';
import {usedKnowledge} from '../src/item_identity.js';
import {provenanceOf} from '../src/knowledge_view.js';
const body={id:'native.player.body',form:'human',ownerId:'player',controllerId:'player',hands:2,mobile:true};
const fctx=p=>({actorId:'player',external:p.external,gameplay:p.gameplay,vitals:{player:{health:100,max_health:100,stamina:100,max_stamina:100}},
 facts:{location:'Village','village.elderMet':true,'village.craftsmanMet':true,'campaign.anchor':true},nativeBody:body,nativeAlive:true,nativeReady:true});
const fadvance=(p,n)=>{const c=fctx(p);return advanceSimulation(p.state,fieldRegistry,n,p.external,p.gameplay,{player:{...c,vitals:c.vitals.player}});};
const field=(p,id)=>commitNethackFieldcraftCommand(p.state,fieldRegistry,{id},fctx(p));
function boughtVial(){
 let p={state:initializeExpedition(createExpansionState(17)),external:{money:30},gameplay:{player:{inventory:{},skills:{},reputation:{}}}};
 p=beginBodyRecord(p.state,fieldRegistry,fctx(p));p.state.simulation.people.player.body=structuredClone(body);
 p=beginFeatureObjects(p.state,fieldRegistry,fctx(p));p=commitFeatureObjectCommand(p.state,fieldRegistry,{id:'feature_objects.inspect'},fctx(p));p=fadvance(p,2);
 p=enrollReferenceGameplay(p.state,fctx(p));p=commitReferenceGameplayCommand(p.state,fieldRegistry,{id:'reference_gameplay.open'},fctx(p));
 p=field(p,FI.open);return field(p,'nethack_fieldcraft.buy_vial');
}
const vialName=(p,actor)=>itemReading(p.state.simulation.knowledge[actor]||{},itemIdentityOf(FK.vial));

test('using an unknown pale vial names it for the user only, says it was learned by use, and spends the charge',()=>{
 let p=boughtVial();
 assert.equal(p.gameplay.player.inventory[FK.vial],1);
 assert.deepEqual([vialName(p,'player').certainty,vialName(p,'player').name],['open','Unmarked pale vial']);
 assert.equal(projectItemView({id:'Unmarked pale vial'},p.state,{name:'Unmarked pale vial'}).name,'Unmarked pale vial');
 p=fadvance(field(p,FI.assay),3);
 const mine=vialName(p,'player');
 assert.deepEqual([mine.certainty,mine.name,mine.via,mine.provenance],['known','Reed oil vial • 1 charge','used','You used it']);
 assert.equal(projectItemView({id:'Unmarked pale vial'},p.state,{name:'Unmarked pale vial'}).name,'Reed oil vial • 1 charge');
 assert.equal(vialName(p,FI.eda).certainty,'open','Eda watched no use of hers; her reading is unchanged');
 assert.equal(p.gameplay.player.inventory[FK.vial]||0,0,'the use spent the full vial');assert.equal(p.gameplay.player.inventory[FK.empty],1);
});

test('a use teaches only what it showed: plain is known, faint is a guess, none is nothing',()=>{
 const id=defineItemIdentity({itemId:'test.item_identity.tin',open:{name:'Dented tin'},routes:[{knowledge:'k.tin.used',via:'used',name:'Tin of boot grease'}]});
 const row=v=>usedKnowledge({actor:'npc.a',key:'k.tin.used',value:'It softened the leather.',visibility:v});
 assert.deepEqual([row('plain').stage,row('plain').actor,row('plain').basis.route],['understood','npc.a','used']);
 assert.equal(itemReading({'k.tin.used':{...row('faint'),at:1}},id).certainty,'guessed');
 assert.equal(row('none'),null);
 assert.equal(provenanceOf({stage:'understood',basis:row('plain').basis}),'You used it');
 assert.throws(()=>usedKnowledge({key:'k',value:'v',visibility:'loud'}),/visibility/);
 assert.throws(()=>defineItemIdentity({itemId:'test.item_identity.tin2',open:{name:'x'},routes:[{knowledge:'k',name:'y',via:'dreamt'}]}),/way of learning/);
});
