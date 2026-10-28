// Synthetic only: no canon row text or identities.
import test from 'node:test';
import assert from 'node:assert/strict';
import {validateMapping,scoreRows,mergeGapLedger,executeRows} from '../scripts/headless/lead_runs/lotm_ui_replay.mjs';
const fixture = () => {
 const scenes=Array.from({length:5},(_,s)=>({pov:'lead',beat:`s${s}`,order:s,evidence:[{locator:'zh 第1章 p1'}],steps:Array.from({length:s<3?4:3},()=>({verb:'walk',object:'threshold'}))}));
 const rows=scenes.flatMap(s=>s.steps.map((step,i)=>({id:`${s.beat}#${i+1}`,scene:s.beat,...step,class:'travel',place:'place.room',time:{day:1,from:0,to:60},inputs:[],outputs:[],locator:'zh 第1章 p1',status:'gap',gapKind:'missing verb',loses:[],reason:'Synthetic absent action',codes:['CL162']})));
 return {scenes,rows};
};
test('CLR2 and total coverage reject thin inputs, duplicate rows and changed order',()=>{
 const {scenes,rows}=fixture(); assert.deepEqual(validateMapping({rows},scenes),{scenes:5,steps:18});
 assert.throws(()=>validateMapping({rows:rows.slice(1)},scenes),/every source step/);
 assert.throws(()=>validateMapping({rows:[...rows,rows[0]]},scenes),/every source step/);
 assert.throws(()=>validateMapping({rows:[...rows].reverse()},scenes),/source order/);
 assert.throws(()=>validateMapping({rows},scenes.slice(0,2)),/under half/);
});
test('a lossy fold remains a typed gap; a route alone is not UI verification',()=>{
 const {scenes,rows}=fixture(); rows[0]={...rows[0],status:'clean_fold',gapKind:null,route:[{actionId:'move.room',place:'place.room'}],anchors:{place:'place.room',purseDelta:0}};
 validateMapping({rows},scenes); assert.equal(scoreRows(rows).overall.pendingUI,1);
 assert.equal(scoreRows(rows,new Set([rows[0].id])).overall.cleanFold,1);
 rows[0].loses=['CL172']; assert.throws(()=>validateMapping({rows},scenes),/lossless/);
 rows[0].loses=[];rows[0].sourceReview={status:'rejected_actor'};
 assert.throws(()=>validateMapping({rows},scenes),/rejected source/);delete rows[0].sourceReview;rows[0].loses=['CL172'];
 rows[0].status='lossy_fold';rows[0].gapKind='missing verb';
 assert.equal(scoreRows(rows).overall.lossyFold,1);assert.equal(scoreRows(rows).overall.gaps,18);
});
test('combined ledger preserves sibling rows and ranks by shared layer without overwriting input',()=>{
 const {rows}=fixture(),prior=[{scene:'earlier',kind:'fixture',layer:'rule',reason:'Keep me',locator:'synthetic'}];
 const merged=mergeGapLedger(rows,prior);
 assert.equal(merged.rows.length,19);assert.equal(merged.rows[0].layer,'verb');
 assert.equal(prior[0].lane,undefined);assert.equal(merged.rows.find(r=>r.lane==='L4b').reason,'Keep me');
});
test('replay calls UI ports in order, logs every gap and asserts actual place, purse and knowledge',async()=>{
 const {rows}=fixture();rows[1]={...rows[1],status:'clean_fold',setup:[{actionId:'move.start',place:'place.start'}],route:[{actionId:'move.room',place:'place.room'}],anchors:{place:'place.room',purseDelta:-1,knowledge:['note.seen']}};
 let state={place:'place.start',cash:10,knowledge:{}},events=[];
 const io={read:async()=>({...state}),waitBand:async()=>events.push('wait'),screenshot:async()=>events.push('screenshot'),move:async(_,leg)=>{events.push(leg.actionId);state={place:leg.place,cash:leg.place==='place.room'?9:10,knowledge:{'note.seen':true}};}};
 const result=await executeRows({},rows,io);assert.equal(result.receipts.length,18);assert.equal(result.score.overall.cleanFold,1);
 assert.deepEqual(events,['move.start','wait','screenshot','move.room','screenshot']);
 state={place:'place.start',cash:10,knowledge:{}};io.move=async()=>{};
 await assert.rejects(executeRows({},rows,io));
});
