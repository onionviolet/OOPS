// In-process DOM only. No Chrome and no default checkout build.
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {resolve} from 'node:path';
import {createHash} from 'node:crypto';
import {performance} from 'node:perf_hooks';
import {Session} from 'node:inspector';
import {boot} from '../headless/runner.mjs';
const input=resolve(process.argv[2]||'work/lotm-free-offer-20261125/bakery-with-spare.json');
const out=resolve(process.argv[3]||'docs/representations/evidence/lotm-render-cost-2026-11-26/baseline.json');
const bytes=await readFile(input),save=JSON.parse(bytes),sha=s=>createHash('sha256').update(s).digest('hex');
const t0=performance.now();let game;
try{
 game=await boot(save,{seed:87});
 const bootMs=performance.now()-t0;
 const viewTimes=[];let view;
 const profileEnabled=process.argv[4]==='profile';const inspector=profileEnabled?new Session():null;inspector?.connect();const post=(method,args={})=>new Promise((ok,fail)=>inspector.post(method,args,(e,r)=>e?fail(e):ok(r)));if(inspector){await post('Profiler.enable');await post('Profiler.start');}
 for(let i=0;i<5;i++){const t=performance.now();view=simulationTestHooks.project('lotm');viewTimes.push(performance.now()-t);}
 let profileTop=[];if(inspector){const {profile}=await post('Profiler.stop');inspector.disconnect();const byId=new Map(profile.nodes.map(n=>[n.id,n])),samples=new Map();for(let i=0;i<(profile.samples||[]).length;i++){const n=byId.get(profile.samples[i]);const name=n.callFrame.functionName||'(anonymous)';samples.set(name,(samples.get(name)||0)+(profile.timeDeltas?.[i]||0));}profileTop=[...samples].sort((a,b)=>b[1]-a[1]).slice(0,18).map(([name,us])=>({name,selfMs:us/1000}));}
 const {createLotmPanel}=await import('../../src/book_world_lotm_ui.js');
 const {observerForProfile}=await import('../../src/observer_view.js');
 const before=sha(JSON.stringify(game.snapshot()));
 let creates=0,reads=0;
 const create=game.document.createElement.bind(game.document);game.document.createElement=(...args)=>{creates++;return create(...args);};
 const home=create('div');game.document.body.append(home);
 const t=performance.now();const ui=createLotmPanel({read:()=>{reads++;return view;},observer:()=>observerForProfile(view.entryProfile),discovered:()=>true,act(){},cancel(){},move(){},enroll(){},home,readOwed:()=>({rows:[],live:{},labels:{}})});
 const mountMs=performance.now()-t,mountCreates=creates;
 const panel=home.querySelector('#lotm_panel');
 const counts=()=>({elements:panel.querySelectorAll('*').length,buttons:panel.querySelectorAll('button').length,walkRows:panel.querySelectorAll('[data-walk-place]').length,mapElements:panel.querySelectorAll('[data-walk-map] *').length,allData: [...panel.querySelectorAll('[data-lotm]')].map(n=>n.dataset.lotm)});
 const initial=counts(),renderTimes=[];creates=0;
 for(let i=0;i<5;i++){const t=performance.now();ui.render();renderTimes.push(performance.now()-t);}
 const noChangeCreates=creates;
 const toggleTo=shown=>{if(!!panel.querySelector('[data-walk-map]')!==shown)panel.querySelector('[data-walk-map-toggle]').click();};
 creates=0;const closedAt=performance.now();toggleTo(false);const closeMapMs=performance.now()-closedAt,closed=counts(),closedCreates=creates;creates=0;const openAt=performance.now();toggleTo(true);const reopenMapMs=performance.now()-openAt,reopened=counts();
 const pairs=[];for(let i=0;i<5;i++){const a=performance.now();toggleTo(false);const closeMs=performance.now()-a;const b=performance.now();toggleTo(true);pairs.push({closedMs:closeMs,openMs:performance.now()-b});}
 const smallView={...view,places:view.places.slice(0,8),moves:view.moves.slice(0,8)};const smallHome=create('div');game.document.body.append(smallHome);const smallAt=performance.now();const smallUi=createLotmPanel({read:()=>smallView,observer:()=>observerForProfile(view.entryProfile),discovered:()=>true,act(){},cancel(){},move(){},enroll(){},home:smallHome,readOwed:()=>null});const smallMountMs=performance.now()-smallAt,smallMapShown=!!smallHome.querySelector('[data-walk-map]');const smallCommands=[...smallHome.querySelectorAll('[data-lotm]')].map(n=>n.dataset.lotm);const smallRenders=[];for(let i=0;i<5;i++){const t=performance.now();smallUi.render();smallRenders.push(performance.now()-t);}
 const result={inputSha256:sha(bytes),sourceUiSha256:sha(await readFile('src/book_world_lotm_ui.js')),profile:save.expansion.lotm.entryProfile,bootMs,viewTimes,profileTop,mountMs,mountCreates,noChangeRenderMs:renderTimes,noChangeCreates,readCalls:reads,closeMapMs,closed,closedCreates,reopenMapMs,reopened,pairedMapRenders:pairs,small:{places:smallView.places.length,mountMs:smallMountMs,mapShown:smallMapShown,commands:smallCommands,noChangeRenderMs:smallRenders},viewCounts:Object.fromEntries(['moves','places','objectActs','records','actions'].map(k=>[k,view[k]?.length||0])),initial,...{snapshotUnchanged:before===sha(JSON.stringify(game.snapshot()))}};
 await mkdir(resolve(out,'..'),{recursive:true});await writeFile(out,JSON.stringify(result,null,2));console.log(JSON.stringify(result));
}finally{game?.close();}
