// Original Cloudseed beetles. Home custody, existing two-parent genetics and the
// shared played clock own this small imported brood; no creature-side timer.
import {seeded,foundingGenes,member,breed,phenotype,memberView,testMember,validateLineage} from './lineage_traits.js';
import {CLUTCH,QI_FIELD} from './cultivation_items.js';
import {check,natural} from './basics.js';
export const BROOD_TERMS=Object.freeze({capacity:6,incubation:60,maturity:120,rest:120,study:120});
const K='home.manor.keeper',room='Arlmere family manor';
const energyCap=m=>40+10*phenotype(m.genes).wind;
export function freshBrood(seed,clock){return {schema:1,seed:String(seed),clock,next:1,roster:[],food:0,breeding:false,pair:null,active:null,births:0};}
function egg(b,genes,sex,clock){const id=`beetle${b.next++}`;return {member:member(id,`Cloudseed ${id.slice(6)}`,sex,genes,{bornAt:clock}),stage:'egg',incubation:0,age:0,energy:0,practice:0,restUntil:clock};}
export function stockClutch(b){check(b.roster.length+2<=BROOD_TERMS.capacity,'The manor brood chamber needs two free places.');const rng=seeded(`${b.seed}:${b.next}:paid-clutch`);for(const sex of ['m','f'])b.roster.push(egg(b,foundingGenes(rng),sex,b.clock));}
export function validateBrood(b,clock){
 if(b===undefined)return;
 check(b&&b.schema===1&&typeof b.seed==='string'&&b.seed.length<=160&&natural(b.clock)&&b.clock<=clock&&natural(b.next)&&b.next>0&&natural(b.food)&&natural(b.births)&&typeof b.breeding==='boolean'&&Array.isArray(b.roster)&&b.roster.length<=BROOD_TERMS.capacity,'Invalid household brood.');
 validateLineage({schema:1,seed:b.seed,profile:'creature',selfId:null,members:b.roster.map(r=>r.member)});
 for(const r of b.roster)check(['egg','juvenile','adult'].includes(r.stage)&&['incubation','age','energy','practice','restUntil'].every(k=>natural(r[k]))&&r.incubation<=60&&(r.stage!=='egg'||r.incubation<60)&&(r.stage!=='juvenile'||r.age<120)&&r.energy<=energyCap(r.member)&&r.practice<=600&&r.member.bornAt<=b.clock,'Invalid creature growth/rest.');
 check(b.active===null||b.roster.some(r=>r.member.id===b.active&&r.stage==='adult'),'Invalid active household creature.');
 check(b.pair===null||Array.isArray(b.pair)&&b.pair.length===2&&new Set(b.pair).size===2&&b.pair.every(id=>b.roster.some(r=>r.member.id===id)),'Invalid brood pair.');
}
export function broodWindow(c,h){const condition=c.conditions?.[K]?.[QI_FIELD],p=c.people?.[K];if(!h.fixtures.qi||p?.life!=='alive'||p.location!==room||!condition?.intensity||condition.expiresAt==null)return null;return [condition.expiresAt-240,condition.expiresAt];}
function parents(b){const adults=b.roster.filter(r=>r.stage==='adult');if(b.pair)return b.pair.map(id=>adults.find(r=>r.member.id===id));return [adults.find(r=>r.member.sex==='m'),adults.find(r=>r.member.sex==='f')];}
function startBirth(b,window){
 if(!b.breeding||!window||b.clock<window[0]||b.clock>=window[1]||b.food<1||b.roster.length>=BROOD_TERMS.capacity)return false;
 const [sire,dam]=parents(b);if(!sire||!dam||sire.member.sex===dam.member.sex||[sire,dam].some(r=>r.energy<10||r.restUntil>b.clock))return false;
 const rng=seeded(`${b.seed}:birth:${b.births}:${b.next}`),id=`beetle${b.next}`,made=breed(sire.member,dam.member,{rng,id,name:`Cloudseed ${b.next}`,sex:rng()<0.5?'m':'f',bornAt:b.clock,profile:'creature',members:b.roster.map(r=>r.member)});
 b.food--;b.births++;for(const p of [sire,dam]){p.energy-=10;p.restUntil=b.clock+BROOD_TERMS.rest;}
 const row=egg(b,made.child.genes,made.child.sex,b.clock);row.member=made.child;b.roster.push(row);return true;
}
export function advanceBrood(b,clock,window){
 validateBrood(b,clock);check(clock>=b.clock,'The brood cannot go back in time.');
 // Each loop reaches a biological boundary. Capacity and finite food bound
 // births; long periods without a field settle in a single remaining segment.
 for(let guard=0;b.clock<clock;guard++){
  check(guard<128,'Brood boundary budget exceeded.');startBirth(b,window);
  const powered=!!window&&b.clock>=window[0]&&b.clock<window[1];let step=clock-b.clock;
  if(window)for(const at of window)if(at>b.clock)step=Math.min(step,at-b.clock);
  for(const r of b.roster){if(r.stage==='egg'&&powered)step=Math.min(step,60-r.incubation);if(r.stage==='juvenile')step=Math.min(step,120-r.age);if(r.restUntil>b.clock)step=Math.min(step,r.restUntil-b.clock);}
  check(step>0,'Invalid creature boundary.');
  for(const r of b.roster){
   if(r.stage==='egg'){if(powered)r.incubation+=step;}
   else {r.age+=step;r.energy=Math.min(energyCap(r.member),r.energy+step);if(r.stage==='adult'&&powered)r.practice=Math.min(600,r.practice+step);}
  }b.clock+=step;
  for(const r of b.roster){if(r.stage==='egg'&&r.incubation===60){r.stage='juvenile';r.age=0;r.energy=energyCap(r.member);}else if(r.stage==='juvenile'&&r.age>=120)r.stage='adult';}
 }
 startBirth(b,window);validateBrood(b,clock);return b;
}
export function broodPracticeBonus(h,qi){const b=h.brood,r=b?.roster.find(r=>r.member.id===b.active&&r.stage==='adult');if(!r||qi<=0)return 1;return 1+Math.min(1,qi)*(Math.floor(r.practice/120)*0.01+phenotype(r.member.genes).eye*0.005);}
export function planBrood(s,r,c,out){
 if(!r.type.startsWith('brood_'))return false;
 const h=s.properties.manor;check(h?.access&&c.location===room&&c.body.form==='human','Visit the manor brood chamber in a supported body.');
 check(h.fixtures.qi,'Fit a condensate cradle before housing imported beetles.');
 h.brood ||= freshBrood(`${c.clock}:${c.sequence}`,c.clock);const b=h.brood,spend=id=>{const key=JSON.stringify({id});check((c.inventory[key]||0)>0&&!c.unspendable?.includes(key),'Bring one actual owned '+id+'.');out.items.push({key,amount:-1});};
 if(r.type==='brood_stock'){spend(CLUTCH);stockClutch(b);out.message='One paid clutch enters the household brood chamber as two real eggs. It needs sixty powered minutes to hatch and a further 120 ordinary minutes to mature. The brood belongs to this household, alongside its actual room rights.';}
 else if(r.type==='brood_feed'){spend('Stale bread');b.food++;out.message='One carried grain ration is allocated to one future brood pairing. Parents still need their actual maturity, energy, rest, space and field.';}
 else if(r.type==='brood_release'){b.active=null;out.message='The attending creature returns to the brood chamber; its practiced ability remains its own.';}
 else if(r.type==='brood_breed'){b.breeding=!b.breeding;out.message=b.breeding?'The household permits automatic pairing while its actual field, grain, adults, rest and room support it. Each pairing uses one ration and ten energy from each parent.':'Automatic pairing stops. Existing eggs and growing animals continue their own lives.';}
 else if(r.type==='brood_pair'){check(r.sire!==r.dam,'Choose two distinct parents.');const pair=[r.sire,r.dam].map(id=>b.roster.find(v=>v.member.id===id&&v.stage==='adult'));check(pair.every(Boolean)&&pair[0].member.sex!==pair[1].member.sex,'Choose two mature, compatible beetles.');b.pair=[r.sire,r.dam];out.message='The selected actual parents guide future pairings; their existing genes, kinship and mutations govern offspring.';}
 else {const row=b.roster.find(v=>v.member.id===r.id);check(row,'This creature is no longer here.');
  if(r.type==='brood_attend'){check(row.stage==='adult','Let this beetle mature first.');b.active=r.id;out.message='The chosen adult attends circulation by your bed. Its practiced resonance and inherited mist sense affect real Meditation learning when the room’s field reaches it.';}
  else if(r.type==='brood_test'){check(out.money>=6,'A bodily trait test costs six personal coins.');row.member=testMember(row.member);out.money-=6;out.message='The paid examination reveals one previously hidden inherited quality of this individual.';}
  else check(false,'Unknown brood request.');
 }
 validateBrood(b,c.clock);return true;
}
export function broodView(b,c,h){if(!b)return null;const w=broodWindow(c,h),[a,z]=parents(b);return {food:b.food,breeding:b.breeding,active:b.active,births:b.births,pair:b.pair,field:!!w&&c.clock>=w[0]&&c.clock<w[1],stop:b.roster.length>=6?'chamber full':b.food<1?'needs an allocated grain ration':!w||c.clock>=w[1]?'needs the real powered field':!a||!z?'needs two compatible adults':[a,z].some(r=>r.restUntil>c.clock||r.energy<10)?'parents resting':'ready',roster:b.roster.map(r=>({id:r.member.id,name:r.member.name,sex:r.member.sex,stage:r.stage,incubation:r.incubation,age:r.age,energy:r.energy,capacity:r.stage==='egg'?null:energyCap(r.member),rank:1+Math.floor(r.practice/120),rest:Math.max(0,r.restUntil-c.clock),traits:r.stage==='egg'?[]:memberView(r.member)}))};}
