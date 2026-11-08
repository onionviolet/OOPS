import test from 'node:test';
import assert from 'node:assert/strict';
import {reputationView, registerReputationSource} from '../src/reputation_view.js';
import '../src/world_packs/book_hp_lead_life_data.js';
const world='book.hp.lead.world', ron='book.hp.lead.ron';
const state={actors:{player:{worldId:world}},simulation:{relationships:{[ron]:{player:{axes:{'tie.affection':500}}}},knowledge:{player:{}}}};
test('standing never shows unknown audiences, regard totals, or unobserved private reports',()=>{
 assert.deepEqual(reputationView(state),[]);
 const rows=reputationView(state,{known:id=>id===ron});
 assert.equal(rows.length,1);assert.match(rows[0].line,/only just met/);
 assert.ok(!JSON.stringify(rows).includes('500'));
 assert.deepEqual(reputationView(state,{viewerId:'stranger',known:()=>true}),[]);
 registerReputationSource({id:'test.private',worldId:world,owner:'persona',read:()=>[{audienceId:ron,subjectId:'player',line:'secret',observed:false,evidence:'private truth'}]});
 assert.equal(reputationView(state,{known:()=>true}).some(r=>r.line==='secret'),false);
});
test('different audiences retain separate observed accounts with their own owners',()=>{
 registerReputationSource({id:'test.public',worldId:world,owner:'economy',read:()=>[{audienceId:'shop',subjectId:'player',label:'The shop',line:'You paid your account.',observed:true,evidence:'receipt.1'}]});
 const rows=reputationView(state,{known:()=>true});assert.equal(rows.length,2);
 assert.deepEqual(rows.map(r=>r.owner),['person','economy']);
 assert.equal(reputationView(state,{known:id=>id===ron}).length,1);
});
