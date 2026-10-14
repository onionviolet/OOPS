import assert from 'node:assert/strict';
import {readFileSync, readdirSync, writeFileSync} from 'node:fs';
import {isDeepStrictEqual} from 'node:util';
import vm from 'node:vm';
import {Game_Time, format_time} from '../../../../../src/game_time.js';
import {advancePacing, normalizePacing} from '../../../../../src/absorb_e1/pacing.js';
import {advanceLocalLife, localLifeAction} from '../../../../../src/absorb_c2/local_life.js';
import {createExpansionState, createContentRegistry, commitAction, evaluateAction, advanceSimulation} from '../../../../../src/expansion_engine.js';
import {validateSaveEnvelope, measureSaveSize} from '../../../../../src/save_files.js';
import {rollBaseCombatDamage, nextAttackTiming} from '../../../../../src/combat_math.js';
const rows=[];const emit=(id,result)=>rows.push({id,...result});
const snap=t=>Object.fromEntries(['year','month','day','hour','minute','day_count'].map(k=>[k,t[k]]));
const time={year:999,month:12,day:30,hour:23,minute:59,day_count:360};
for(const minutes of [60,1440,518400]) {const one=new Game_Time(time),split=new Game_Time(time);one.goUp(minutes);for(let i=0;i<minutes;i++)split.goUp(1);assert.deepEqual(snap(one),snap(split));emit('calendar-'+minutes,{equal:true,result:snap(one)});}
const initial=normalizePacing({hungerEnabled:true,weatherEnabled:true});
for(const minutes of [60,480,1440]) {const one=advancePacing(initial,minutes,{homeWorld:true,season:'Summer'});let split=initial;for(let i=0;i<minutes;i++)split=advancePacing(split,1,{homeWorld:true,season:'Summer'});emit('pacing-'+minutes,{equal:isDeepStrictEqual(one,split),one,split,fullnessDelta:split.fullness-one.fullness});}
const frame=clock=>({worldId:'base.frontier',location:'Shack',alive:true,idle:true,clock,calendarMinute:720+clock,perception:0,money:20,foodPoisonRemaining:0});
const searching=localLifeAction(undefined,frame(0),'look').state;
let drawsOne=0,drawsSplit=0;const one=advanceLocalLife(searching,frame(60),()=>{drawsOne++;return .999;});let split=searching;let xp=0;
for(let i=1;i<=60;i++){const p=advanceLocalLife(split,frame(i),()=>{drawsSplit++;return .999;});split=p.state;xp+=p.native.skillXp.Perception||0;}
assert.equal(drawsOne,1);assert.equal(drawsSplit,12);emit('search-60',{equal:isDeepStrictEqual(one.state,split),drawsOne,drawsSplit,missesOne:one.state.searches.Shack.misses,missesSplit:split.searches.Shack.misses,xpOne:one.native.skillXp.Perception,xpSplit:xp});
const action={id:'audit.work',worldId:'base.frontier',revision:1,duration:4,repeatable:false,completionScope:'actor',costs:[],outcomes:[{id:'done',chance:1,effects:[{type:'resource',scope:'external',key:'money',amount:7}]}]};
const registry=createContentRegistry({worlds:[{id:'base.frontier'}],actions:[action],opportunities:[]});
const state=createExpansionState(123),context={actorId:'player',worldId:'base.frontier',external:{money:10},gameplay:{},facts:{}};
const before=structuredClone(state);let randomCalls=0;const priorRandom=Math.random;Math.random=()=>{randomCalls++;return .5;};
try {for(let i=0;i<1000;i++)evaluateAction(state,registry,'audit.work',context);}finally{Math.random=priorRandom;}
assert.deepEqual(state,before);assert.equal(randomCalls,0);emit('preview-1000',{stateEqual:true,nativeRandomCalls:randomCalls,rngBefore:before.rng,rngAfter:state.rng});
const start=commitAction(state,registry,'audit.work',context);const jump=advanceSimulation(start.state,registry,60,start.external,start.gameplay);let ticks=start;
for(let i=0;i<60;i++)ticks=advanceSimulation(ticks.state,registry,1,ticks.external,ticks.gameplay);
assert.deepEqual(jump.state,ticks.state);assert.deepEqual(jump.external,ticks.external);assert.deepEqual(jump.gameplay,ticks.gameplay);emit('scheduler-60',{stateEqual:true,externalEqual:true,gameplayEqual:true,money:jump.external.money,clock:jump.state.clock});
const maxState=createExpansionState(1);maxState.clock=Number.MAX_SAFE_INTEGER;assert.throws(()=>advanceSimulation(maxState,registry,1,{money:0},{}));emit('clock-overflow',{rejected:true});
const fixture=()=>({'game version':'v0.5.5.30','current time':{year:999,month:4,day:1,hour:8,minute:0},'current location':'Village',character:{name:'Synthetic',money:102,xp:{total_xp:0},inventory:{},equipment:{}},skills:{Literacy:{total_xp:0}},locations:{},activities:{},dialogues:{},traders:{}});
for(const [name,value] of [['NaN',NaN],['Infinity',Infinity],['undefined',undefined]]) {const s=fixture();s.character.money=value;let directAccepted=true;try{validateSaveEnvelope(s,'v0.5.5.30');}catch{directAccepted=false;}const round=JSON.parse(JSON.stringify(s));let serializedAccepted=true;try{validateSaveEnvelope(round,'v0.5.5.30');}catch{serializedAccepted=false;}emit('money-'+name,{directAccepted,serializedAccepted,encoded:JSON.stringify({money:value})});}
for(const [name,value] of [['Map',new Map([['earned',3]])],['Set',new Set(['earned'])],['Date',new Date('2026-01-01T00:00:00Z')],['undefined',undefined],['minusZero',-0],['NaN',NaN],['Infinity',Infinity],['BigInt',1n]]) {const s=fixture();s.total_hits_done=value;let encoded;try {encoded=JSON.stringify(s);validateSaveEnvelope(JSON.parse(encoded),'v0.5.5.30');emit('counter-'+name,{accepted:true,keyPresent:Object.hasOwn(JSON.parse(encoded),'total_hits_done'),after:JSON.parse(encoded).total_hits_done??null,retained:Object.hasOwn(JSON.parse(encoded),'total_hits_done')&&isDeepStrictEqual(value,JSON.parse(encoded).total_hits_done)});}catch(e){emit('counter-'+name,{accepted:false,error:e.message});}}
const calendarNaN=new Game_Time(time);calendarNaN.goUp(NaN);emit('calendar-NaN',{minuteIsNaN:Number.isNaN(calendarNaN.minute)});
const badDamage=rollBaseCombatDamage(Infinity,1,1,()=>.5);emit('combat-Infinity',{nonFinite:!Number.isFinite(badDamage[0]),json:JSON.stringify(badDamage)});
emit('wall-jump',{forward:nextAttackTiming(1000,3602000,1000,0,100),backward:nextAttackTiming(1000,-3598000,1000,0,100)});
const misc=readFileSync('src/misc.js','utf8');const fn=misc.match(/function random_range\(min, max\) \{[^}]+\}/)[0];let draw=0;const range=vm.runInNewContext('('+fn+')',{Math:{round:Math.round,random:()=>draw}});const bins=[0,0,0];for(let i=0;i<10000;i++){draw=(i+.5)/10000;bins[range(0,2)]++;}emit('integer-range',{draws:10000,bins,source:'src/misc.js:68-70',method:'actual helper extracted and evaluated; deterministic midpoint grid'});
emit('locale-order',{en:['z','ä','a'].sort((a,b)=>a.localeCompare(b,'en')),sv:['z','ä','a'].sort((a,b)=>a.localeCompare(b,'sv')),idsEn:['a_b','a.b','a-b'].sort((a,b)=>a.localeCompare(b,'en')),idsSv:['a_b','a.b','a-b'].sort((a,b)=>a.localeCompare(b,'sv'))});
const duration={minutes:61};const formatted=format_time({time:duration});emit('formatter-mutation',{formatted,after:duration});
emit('storage-size',{ascii:measureSaveSize('a'),cjk:measureSaveSize('魏'),emoji:measureSaveSize('🐉')});
// Inventory only public source and tests. Never open SECRETS files.
function files(dir){return readdirSync(dir,{withFileTypes:true}).filter(e=>!e.name.startsWith('SECRETS')).flatMap(e=>e.isDirectory()?files(dir+'/'+e.name):e.name.endsWith('.js')?[dir+'/'+e.name]:[]);}
const randomSites=[],localeSites=[],lifecycle=[],testSites=[];
for(const f of files('src'))readFileSync(f,'utf8').split('\n').forEach((line,i)=>{if(line.includes('Math.random'))randomSites.push({file:f,line:i+1,text:line.trim()});if(line.includes('localeCompare'))localeSites.push({file:f,line:i+1,text:line.trim()});if(/pagehide|pageshow|beforeunload|visibilitychange|storage.persist/.test(line))lifecycle.push({file:f,line:i+1,text:line.trim()});});
for(const f of files('tests'))readFileSync(f,'utf8').split('\n').forEach((line,i)=>{if(/Math.random|Date.now|new Date|performance.now|setTimeout/.test(line))testSites.push({file:f,line:i+1,text:line.trim()});});
const survey={randomLineSites:randomSites.length,randomFiles:new Set(randomSites.map(x=>x.file)).size,randomOccurrences:randomSites.reduce((n,x)=>n+[...x.text.matchAll(/Math\.random/g)].length,0),randomSites,localeSites,lifecycle,testSites};
writeFileSync(new URL('./source-survey.json',import.meta.url),JSON.stringify(survey,null,2)+'\n');
writeFileSync(new URL('./results.json',import.meta.url),JSON.stringify({node:process.version,rows,surveyCounts:{randomLineSites:survey.randomLineSites,randomFiles:survey.randomFiles,randomOccurrences:survey.randomOccurrences,localeLines:localeSites.length,testSites:testSites.length}},null,2)+'\n');
console.log(JSON.stringify({node:process.version,rows,surveyCounts:{randomLineSites:survey.randomLineSites,randomFiles:survey.randomFiles,randomOccurrences:survey.randomOccurrences,localeLines:localeSites.length,testSites:testSites.length}},null,2));
