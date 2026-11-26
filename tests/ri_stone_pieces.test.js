import test from 'node:test';
import assert from 'node:assert/strict';
import {earned,id,stone} from './helpers/ri_lead_fixture.mjs';
import {guHalfStoneKey} from '../src/world_packs/book_gu_lead_half_stone.js';
import {riStonePieces,riSelectedStone,riPieceKey,stageRiStonePieces,validateRiStoneEnvelope,riStoneFacts,riStoneItemView,RI_PIECE_DRAW} from '../src/ri_stone_pieces.js';
import {stageAcquisition} from '../src/acquisition.js';
import {createStructuredPackPanel} from '../src/structured_pack_ui.js';
import {withPanelDom} from './helpers/mini_dom.mjs';
import {persistExpansionPlan} from '../src/expansion_persistence.js';
import {prepareGameplayPublication} from '../src/gameplay_publication.js';
const legacy=()=>{const l=earned();l.act('refinement.draw_stone');l.step(30);l.admit(2);for(const [n,t]of [['leave',20],['buy_wine',5],['lure',180],['follow',35],['take_worm',3],['search_crevice',12],['return_inn',45],['first_night',360],['brother',15]]){l.act('vital.'+n);l.step(t);}return l;};
const pieces=l=>riStonePieces(l.state,l.stock),draw=l=>{l.act('half_stone_piece.draw');l.step(1);};
test('reserved v1 carrier keeps exact contract until cancellation, then receives identity without resetting14',()=>{
 const l=legacy();l.installHalfStone();l.admitHalfStone();l.act('half_stone_use.draw_15');l.step(1);l.act('half_stone_use.draw_14');const old=l.roundTrip();l.installPieces();assert.deepEqual(l.roundTrip(),old);l.cancel();assert.equal(pieces(l)[0].remaining,14);assert.equal(l.stock[guHalfStoneKey(14)],undefined);l.admitPieces();const p=pieces(l)[0];draw(l);assert.equal(pieces(l)[0].id,p.id);assert.equal(pieces(l)[0].key,p.key);assert.equal(pieces(l)[0].remaining,13);l.roundTrip();
});
test('identified piece survives pending save, cancellation, consumption and rollback without new acquisitions',()=>{
 const l=legacy();l.installPieces();l.admitPieces();const p=pieces(l)[0],reserve=l.energy.reserve,whole=l.stock[stone];l.act('half_stone_piece.draw');assert.equal(l.stock[p.key],undefined);l.roundTrip();l.cancel();assert.equal(pieces(l)[0].remaining,p.remaining);assert.equal(pieces(l)[0].id,p.id);draw(l);assert.equal(pieces(l)[0].remaining,p.remaining-1);assert.equal(pieces(l)[0].key,p.key);assert.equal(l.energy.reserve,reserve+1);assert.equal(l.stock[stone],whole);l.roundTrip();
 const v=l.view();assert.equal(v.actions.filter(a=>a.id.startsWith(id('half_stone_use.'))).length,0);assert.equal(v.actions.filter(a=>a.id===RI_PIECE_DRAW).length,1);assert.match(JSON.stringify(v.stonePieces),/estimated parts/);
});
test('legacy multiple same-charge pieces stay distinct and player can choose the second charged piece',()=>{
 const l=legacy();l.stock[guHalfStoneKey(14)]=2;l.stock[guHalfStoneKey(9)]=1;l.installPieces();l.admitPieces();const all=pieces(l),second=all.find((p,i)=>i>0&&p.remaining===14);assert.ok(second);assert.equal(new Set(all.map(p=>p.id)).size,4);l.selectPiece(second.key);assert.equal(riSelectedStone(l.state,l.stock).id,second.id);l.roundTrip();draw(l);const after=pieces(l);assert.equal(after.find(p=>p.id===second.id).remaining,13);for(const p of all.filter(p=>p.id!==second.id))assert.equal(after.find(a=>a.id===p.id).remaining,p.remaining);
});
test('spent legacy piece stays spent, full sea keeps charge and tampered pending binding is refused',()=>{
 const l=legacy();for(const p of pieces(l))delete l.stock[p.key];delete l.stock[guHalfStoneKey(15)];l.stock[guHalfStoneKey(0)]=1;l.installPieces();l.admitPieces();const spent=pieces(l).find(p=>p.remaining===0);l.selectPiece(spent.key);assert.equal(riStoneFacts(l.state,{gameplay:{player:{inventory:l.stock}}})['riStone.held'],true);assert.equal(l.quote('half_stone_piece.draw').eligible,false);
 l.stock[guHalfStoneKey(14)]=1;l.observe();const live=pieces(l).find(p=>p.remaining===14);l.selectPiece(live.key);l.energy.reserve=44;assert.equal(l.quote('half_stone_piece.draw').eligible,false);assert.equal(live.remaining,14);l.energy.reserve=43;l.act('half_stone_piece.draw');const bad=structuredClone(l.state);bad.simulation.jobs[0].effects[0].pieceId=spent.id;assert.throws(()=>l.validateState(bad),/exact pending/);l.cancel();
});
test('materialization retries, custody transfers and return preserve identity; stale or duplicate instances fail',()=>{
 const l=legacy();const plan={state:structuredClone(l.state),gameplay:{player:{inventory:{[guHalfStoneKey(14)]:2}},chest:{inventory:{}}}};stageRiStonePieces(plan);const initial=structuredClone(plan);stageRiStonePieces(plan);assert.deepEqual(plan,initial);const rows=riStonePieces(plan.state,plan.gameplay.player.inventory),p=rows[1];const transfer=stageAcquisition({player:plan.gameplay.player.inventory,chest:{}},{transfers:[{from:'player',to:'chest',key:p.key,count:1}]});plan.gameplay.player.inventory=transfer.player;plan.gameplay.chest.inventory=transfer.chest;stageRiStonePieces(plan);assert.equal(plan.gameplay.chest.inventory[p.key],1);assert.equal(riStonePieces(plan.state,transfer.chest)[0].remaining,14);
 const envelope={expansion:plan.state,inventories:{person:{player:Object.fromEntries(Object.entries(transfer.player).map(([k,count])=>[k,{count}])),chest:{[p.key]:{count:1}}}}};validateRiStoneEnvelope(envelope);const stale=structuredClone(envelope);delete stale.expansion.riStonePieces;assert.throws(()=>validateRiStoneEnvelope(stale),/ledger/);envelope.inventories.person.player[p.key]={count:1};assert.throws(()=>validateRiStoneEnvelope(envelope),/Duplicated/);assert.match(riStoneItemView(p.key,plan.state,{}).name,/Small primeval stone/);
});
test('native panel exposes an accessible deliberate piece selector and preserves focus',()=>withPanelDom(({host,find})=>{
 const requests=[],view={available:true,active:true,title:'Inn',people:[],status:[],jobs:[],actions:[],canWrite:true,stonePieces:[{key:'first',label:'Piece1 ·14 left',selected:true},{key:'second',label:'Piece2 ·9 left',selected:false}]};const panel=createStructuredPackPanel({read:()=>view,command:r=>requests.push(r)});const walk=n=>n.dataset?.structuredStoneSelect!==undefined?n:n.children?.map(walk).find(Boolean);const select=walk(host);assert.ok(select);assert.equal(select.attributes['aria-label'],'Stone to draw from');select.value='second';select.onchange();assert.deepEqual(requests[0],{type:'ri-stone-select',key:'second'});panel.destroy();
}));

test('witnessed pouch piece receives identity before transfer and keeps it after acceptance',()=>{
 const l=earned();l.act('refinement.draw_stone');l.step(30);l.admit(2);l.act('vital.leave');l.step(20);l.setNativeMinute(18*60+39);l.installBreakfast();l.installPieces();l.step(760);l.admitBreakfast();l.act('breakfast.join');l.step(10);
 const pouch=riStonePieces(l.state,l.pocket)[0];assert.equal(pouch.origin,'witnessed-pouch');assert.match(riStoneItemView(pouch.key,l.state,{}).name,/Fang Zheng/);l.act('breakfast.accept');assert.equal(pieces(l)[0].key,pouch.key);assert.equal(pieces(l)[0].id,pouch.id);assert.equal(pieces(l)[0].remaining,15);assert.equal(Object.keys(l.pocket).length,0);l.roundTrip();
});
test('failed storage write leaves live stock and ledger unchanged, retry publishes identical instance keys',()=>{
 const l=legacy(),beforeState=structuredClone(l.state),oldKey=guHalfStoneKey(14),live={[oldKey]:{item:{id:'old'},count:1}},levelable={skill_progress:{}},actor={getItems:()=>live,getLevelableComponent:()=>levelable,reputation:{}};
 const plan={state:structuredClone(l.state),external:{money:0},gameplay:{player:{inventory:{[oldKey]:1},skills:{},reputation:{}}},acquisitions:[]};stageRiStonePieces(plan);const p=riStonePieces(plan.state,plan.gameplay.player.inventory)[0];
 const publication=prepareGameplayPublication(plan.gameplay,{actors:{player:actor},skills:{},getItemFromKey:key=>({getInventoryKey:()=>key})});
 const envelope={character:{money:0},inventories:{person:{main_character:{[oldKey]:{count:1}}}},levels:{person:{main_character:{skill_xp:{}}}},expansion:beforeState};let saved=JSON.stringify(envelope);
 const options={createSave:()=>saved,key:'save',bindings:{player:{category:'person',id:'main_character'}},validateEnvelope:validateRiStoneEnvelope};assert.throws(()=>persistExpansionPlan(plan,{...options,storage:{setItem(){throw Error('write rejected');}}}),/write rejected/);assert.equal(live[oldKey].count,1);assert.equal(live[p.key],undefined);assert.deepEqual(l.state,beforeState);assert.equal(JSON.parse(saved).expansion.riStonePieces?.pieces[p.id],beforeState.riStonePieces?.pieces[p.id]);
 persistExpansionPlan(plan,{...options,storage:{setItem(_key,bytes){saved=bytes;}}});publication.publish();assert.equal(live[p.key].count,1);assert.equal(live[oldKey],undefined);assert.equal(JSON.parse(saved).inventories.person.main_character[p.key].count,1);assert.equal(plan.state.riStonePieces.pieces[p.id].remaining,14);
});
