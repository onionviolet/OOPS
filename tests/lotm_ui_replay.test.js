// Synthetic only: no canon row text or identities.
import test from 'node:test';
import assert from 'node:assert/strict';
import {validateMapping,scoreRows,mergeGapLedger,executeRows,adaptReplayRows,replayWindow} from '../scripts/headless/lead_runs/lotm_ui_replay.mjs';
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
test('generated v2 rows accept band windows and preserve unknown dates as order-only',()=>{
 const {scenes,rows}=fixture();
 const generated=rows.map((r,i)=>({...r,locator:'zh 第1章 p1',time:{value:i===0?'morning':'unstated',date:null},inputs:[],outputs:[]}));
 const mapping={schema:'lead-ui-replay/2',scope:{fromChapter:1,toChapter:1},rows:generated};
 assert.deepEqual(validateMapping(mapping,scenes),{scenes:5,steps:18});
 generated[0]={...generated[0],status:'clean_fold',route:[{actionId:'lotm.move.room',place:'place.room'}],anchors:{place:'place.room'},time:{value:'morning',day:2}};
 const adapted=adaptReplayRows(generated,{maxSteps:2});
 assert.deepEqual(adapted[0].time,{day:2,from:480,to:720});
 assert.equal(adapted[1].time,null);
 assert.deepEqual(replayWindow({time:{value:'06:30',day:1}}),{day:1,from:390,to:391});
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
 // A wrong anchor after the route is a scored gap for that row, not the end of the run.
 const failed=await executeRows({},rows,io),row=failed.receipts.find(r=>r.id===rows[1].id);
 assert.equal(row.status,'gap');assert.match(row.reason,/^replay: /);assert.equal(failed.score.overall.cleanFold,0);
});
