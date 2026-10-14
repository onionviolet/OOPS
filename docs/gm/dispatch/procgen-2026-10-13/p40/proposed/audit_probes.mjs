// P40 read-only SOURCE probes. Synthetic original data; no DOM, saves, builds,
// main.js import, personal files, or runtime publication. Run from repository root.
import assert from 'node:assert/strict';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
const root=process.cwd(),rows=[];
const moduleAt=(relative)=>import(pathToFileURL(path.join(root,relative)).href);
const {hashStreamSeed,createStreams,rollInt}=await moduleAt('src/seeded_streams.js');
assert.equal(hashStreamSeed(17,'deck:fixture😀'),hashStreamSeed(17,'deck:fixture😁'));
rows.push({id:'AP1',finding:'F15',observed:'Distinct astral suffixes collide in hash input',label:'SOURCE_SYNTHETIC',status:'reproduced'});
const {createMixtureState,resolveMixture,mixtureKey}=await moduleAt('.claude/worktrees/proc-p2-mixing/src/mixture_state.js');
const {stageMixtureAction}=await moduleAt('.claude/worktrees/proc-p2-mixing/src/mixture_native.js');
let owner=createMixtureState(17),inventory=Object.fromEntries(['River bellleaf','Spring water'].map(id=>[JSON.stringify({id}),{count:8}]));
const product=resolveMixture(owner,{'River bellleaf':1,'Spring water':1},'steep');owner.products[product.id]=product;owner.knowledge[product.id]={observed:true,at:0};owner.methods[product.id]={revision:1,inputs:structuredClone(product.inputs),process:product.process};
const initial=stageMixtureAction({owner,inventory,seed:17,money:100,clock:0,request:{type:'repeat',product:product.id,count:3}});
const late=stageMixtureAction({owner:initial.state,inventory:initial.inventory,seed:17,money:100,clock:9,request:{type:'advance'}});
let split=initial;
for(const clock of [3,6,9])split=stageMixtureAction({owner:split.state,inventory:split.inventory,seed:17,money:100,clock,request:{type:'advance'}});
assert.equal(late.inventory[mixtureKey(product)].count,1);assert.equal(split.inventory[mixtureKey(product)].count,3);
rows.push({id:'AP2',finding:'F09',observed:'Late clock 9 gives 1 batch; boundaries 3/6/9 give 3',label:'SOURCE_SYNTHETIC',status:'reproduced; catch-up policy not implemented'});
const {appendStoryOutcome,HISTORY_LIMIT,appliedStoryDeltas}=await moduleAt('.claude/worktrees/proc-p34-spine/src/lore_history_state.js');
const state={clock:0,simulation:{events:{}}};
const record=i=>({operation:`fixture:${i}`,worldId:'base.frontier',actor:'player',issuer:'fixture',targetPerson:null,targetObject:null,targetPlace:'Village',action:'storylet.ambient',result:'fixture',at:0,producer:'P40.fixture',causeRefs:['fixture:cause'],historyCauses:[],audience:['player'],known:{label:'Original synthetic fixture'},applied:[]});
const first=appendStoryOutcome(state,record(0));state.simulation.events.fixture={status:'resolved',historyRef:first.id};
for(let i=1;i<HISTORY_LIMIT;i++)appendStoryOutcome(state,record(i));
assert.throws(()=>appendStoryOutcome(state,record(HISTORY_LIMIT)),/Invalid retained story outcome/);
rows.push({id:'AP3',finding:'F11',observed:'Eviction removes a receipt still referenced by a terminal event; final validation rejects',label:'SOURCE_SYNTHETIC',status:'reproduced'});
const a=appliedStoryDeltas({gameplay:{player:{inventory:{}}}},{gameplay:{player:{inventory:{'fixture:A':1,'fixture:B':1}}}});
const b=appliedStoryDeltas({gameplay:{player:{inventory:{}}}},{gameplay:{player:{inventory:{'fixture:B':1,'fixture:A':1}}}});
assert.notEqual(a.find(r=>r.kind==='item').key,b.find(r=>r.kind==='item').key);
rows.push({id:'AP4',finding:'F06',observed:'Equivalent inventory maps yield different first delta keys',label:'SOURCE_SYNTHETIC',status:'reproduced'});
const {validateSaveEnvelope}=await moduleAt('src/save_files.js');
let error;try{validateSaveEnvelope({'game version':'v999.0',mixtures:{schema:2}},'v0.6.4');}catch(e){error=e;}
assert.match(error.message,/Unsupported mixture owner revision/);
rows.push({id:'AP5',finding:'F13',observed:'Owner validation masks newer-build message; envelope still rejects',label:'SOURCE_SYNTHETIC',status:'reproduced; no import write attempted'});
assert.ok(rollInt(createStreams(17),'deck:fixture','large-span',-Number.MAX_SAFE_INTEGER,Number.MAX_SAFE_INTEGER,{dist:'uniform'}));
rows.push({id:'AP6',finding:'F16',observed:'Integer API admits an unsafe-width span with individually safe endpoints',label:'SOURCE_SYNTHETIC',status:'reproduced API admission; no bad gameplay output claim'});
const {jsonData,stableId}=await moduleAt('src/simulation_contracts.js');
for(const value of [new Map([['fixture',1]]),new Set(['fixture'])]) {jsonData(value);assert.equal(JSON.stringify(value),'{}');}
rows.push({id:'AP7',finding:'F05',observed:'JSON-only validator admits Map and Set; JSON encoding loses their entries',label:'SOURCE_SYNTHETIC',status:'reproduced validator gap; no live saved collection claimed'});
const ids=['village.a','village.A','village.z'];assert.ok(ids.every(stableId));
const en=[...ids].sort((a,b)=>a.localeCompare(b,'en')),da=[...ids].sort((a,b)=>a.localeCompare(b,'da'));
assert.notDeepEqual(en,da);
rows.push({id:'AP8',finding:'F04',observed:'Legal ASCII IDs order differently under English and Danish collation',label:'SOURCE_SYNTHETIC',status:'reproduced locale sensitivity; no natural event divergence claimed'});
console.log(JSON.stringify({proposal:true,checks:rows,passed:rows.length,failed:0},null,2));
