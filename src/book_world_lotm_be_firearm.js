// BE-seat firearm practice, ammunition and hit chance (AD48 brief B8). The lead's revolver is a held fact; ammunition is two counted
// resources per round kind (carried, and loaded in the chambers); aim is read from the count of practice rounds fired. A shot is a contest on the
// open notch scale of book_world_lotm_bands.js (winChance), never a second combat system: aim and closeness add notches, the target's speed band
// subtracts, and what a hit does is hitsToDown against the target's toughness band with the round's force. Pure data and functions: no state of
// its own, no clock, no save slice. Content acts compose the effect builders below (place-act rows, as for B1-B3); the host reads
// beFirearmFacts. EVERY number is an authored proposal (WPR5/AD49) unless a locator says the text gives it.
import {BE_PROFILE_ID} from './seat_profiles.js';
import {bandFor,subjectOf,winChance,hitsToDown,BAND_DIALS} from './book_world_lotm_bands.js';
export const BE_REVOLVER_FACT='book.lotm.be.revolver';
const RES='book.lotm.be.';
// Round kinds. force is in revolver notches (bands.js: a revolver, force 0, downs an ordinary adult in one head hit). A demon-hunting bullet adds +1
// against a Beyonder (LCD4, LCT5); items are fixed magnitudes. Both kinds lose nothing to age here; the three-month power loss (ch186 P024) is G17's.
export const BE_ROUND_KINDS=Object.freeze({
 ordinary:Object.freeze({id:'ordinary',force:0,vsBeyonderForce:0,label:'Ordinary round',evidence:'ch103 P054, ch165 P040 (fifty ordinary rounds from the armory)'}),
 silver:Object.freeze({id:'silver',force:0,vsBeyonderForce:1,label:'Silver demon-hunting bullet',evidence:'ch103 P054, ch104 P082 (close-range kill), ch74 P035'})});
// Chambers: six (ch141 P061, the hired range revolver). A five-chamber revolver (ch199 P010) is a later row's dial, passed as `chambers`.
export const BE_FIREARM_DIALS=Object.freeze({chambers:6,
 // Aim by practice rounds fired: proposal steps whose last step is the Captain's "basic approval" after over a thousand rounds (ch128 P002). No step
 // lies beyond it: further practice moves no notch until a text shows more (the cap the failure scenario names).
 aimSteps:Object.freeze([{rounds:0,notch:0},{rounds:50,notch:1},{rounds:250,notch:2},{rounds:1000,notch:3}]),
 // Closeness in notches (close range kills, ch104 P082; the first gunfight is close). Far shots penalise an untrained hand most.
 range:Object.freeze({close:0,short:-1,far:-3}),
 // An unaware or helpless target (WA50 hidden-ness, LCD4 bypass: preparation and initiative) adds notches.
 unawareNotches:2});
export const aimNotch=(fired,dials=BE_FIREARM_DIALS)=>dials.aimSteps.reduce((n,s)=>fired>=s.rounds?s.notch:n,0);
export const aimCapRounds=(dials=BE_FIREARM_DIALS)=>dials.aimSteps.at(-1).rounds;
const nat=x=>Number.isSafeInteger(x)&&x>=0;
const key=(base,kind)=>`${RES}${base}.${kind}`;
export const beFirearmKeys=Object.freeze({carried:kind=>key('carried',kind),loaded:kind=>key('loaded',kind),fired:`${RES}practice_fired`});
const kindOf=kind=>{if(!BE_ROUND_KINDS[kind])throw Error(`Unknown round kind ${kind}.`);return kind;};
const res=(k,amount)=>({type:'resource',actor:'player',key:k,amount});
// The revolver is issued or bought: a fact only (the held object). Rounds are separate counts.
export const beFirearmIssueEffects=()=>[{type:'fact',scope:'actor',actor:'player',key:BE_REVOLVER_FACT,value:true}];
// Rounds arrive in the carried count (the armory form, the range hire, a purchase). Money and form are the content act's own costs.
export const beFirearmStockEffects=(kind,n)=>{kindOf(kind);if(!(Number.isInteger(n)&&n>0))throw Error('Stock a positive whole number of rounds.');return [res(key('carried',kind),n)];};
// Load n rounds from the carried count into the chambers. The engine refuses a negative carried count; the capacity is the `free` fact (requires) and the assertion.
export const beFirearmLoadEffects=(kind,n)=>{kindOf(kind);if(!(Number.isInteger(n)&&n>0))throw Error('Load a positive whole number of rounds.');return [res(key('carried',kind),-n),res(key('loaded',kind),n)];};
// Unload returns rounds to the carried count (nothing is lost).
export const beFirearmUnloadEffects=(kind,n)=>{kindOf(kind);return [res(key('loaded',kind),-n),res(key('carried',kind),n)];};
// One shot spends exactly one loaded round. Only a `practice` shot at the range moves the practice count (aim grows from practice, not from fights).
export const beFirearmFireEffects=(kind,{practice=false}={})=>{kindOf(kind);return [res(key('loaded',kind),-1),...(practice?[res(beFirearmKeys.fired,1)]:[])];};
// Predicates for place-act rows.
const gte=(fact,value,reason)=>({fact,op:'gte',value,reason});
export const beFirearmFireRequires=(kind)=>({all:[{fact:'lotm.beFirearm.held',op:'eq',value:true,reason:'You have no revolver.'},gte(`lotm.beFirearm.loaded.${kind}`,1,'The chamber is empty.')]});
export const beFirearmLoadRequires=(kind,n=1)=>({all:[{fact:'lotm.beFirearm.held',op:'eq',value:true,reason:'You have no revolver.'},gte(`lotm.beFirearm.carried.${kind}`,n,'You have too few rounds to load.'),gte('lotm.beFirearm.free',n,'The chambers cannot take more.')]});
export function beFirearmFacts(state,f,{enrolled=true,dials=BE_FIREARM_DIALS}={}){
 const r=state.actors?.player?.resources||{},held=!!enrolled&&state.actors?.player?.facts?.[BE_REVOLVER_FACT]===true;
 let loaded=0;
 for(const kind of Object.keys(BE_ROUND_KINDS)){const l=held||r[key('loaded',kind)]?r[key('loaded',kind)]||0:0;loaded+=l;f[`lotm.beFirearm.loaded.${kind}`]=l;f[`lotm.beFirearm.carried.${kind}`]=r[key('carried',kind)]||0;}
 const fired=r[beFirearmKeys.fired]||0;
 f['lotm.beFirearm.held']=held;f['lotm.beFirearm.loaded']=loaded;f['lotm.beFirearm.free']=Math.max(0,dials.chambers-loaded);
 f['lotm.beFirearm.practiceFired']=fired;f['lotm.beFirearm.aim']=aimNotch(fired,dials);
}
// The hit chance, pure. `target` is a subject id (fightWindow's subjectOf) or a subject object; no band reads as an ordinary adult (speed 0, toughness 0).
// Notches: aim + range + (unaware bonus) - the target's speed band. Returns the chance, the notch delta and the rounds-to-down for this round kind.
export function shotOdds({fired=0,range='close',target=null,kind='ordinary',unaware=false,dials=BE_FIREARM_DIALS,bandDials=BAND_DIALS}={}){
 kindOf(kind);if(!(range in dials.range))throw Error(`Unknown range ${range}.`);
 const subject=typeof target==='string'?subjectOf(target):target,band=subject?bandFor(subject):null,v=band?.values||{},beyonder=!!(subject&&(subject.beyonder||band));
 const aim=aimNotch(fired,dials),delta=aim+dials.range[range]+(unaware?dials.unawareNotches:0)-(v.speed||0);
 const force=beyonder?BE_ROUND_KINDS[kind].vsBeyonderForce:BE_ROUND_KINDS[kind].force;
 return {chance:winChance(delta,bandDials),delta,aim,hitsToDown:hitsToDown(v.toughness||0,force,bandDials),beyonder};
}
// One shot. `facts` is beFirearmFacts output (or any object with the same keys). An empty or unissued revolver cannot hit: it returns fired:false and no
// effects (the click of ch28's bluff is the content act's own). A loaded one returns the roll, the outcome and the effects to commit with the act, so the
// round is spent exactly once, by the same commit that records the shot.
export function resolveShot(facts,{rng,kind='ordinary',practice=false,...odds}){
 if(typeof rng!=='function')throw Error('resolveShot needs the game rng.');
 kindOf(kind);
 if(!facts['lotm.beFirearm.held'])return {fired:false,hit:false,reason:'no_revolver',effects:[]};
 if((facts[`lotm.beFirearm.loaded.${kind}`]||0)<1)return {fired:false,hit:false,reason:'empty',effects:[]};
 const o=shotOdds({fired:facts['lotm.beFirearm.practiceFired']||0,kind,...odds}),roll=rng();
 return {fired:true,hit:roll<o.chance,roll,...o,kind,effects:beFirearmFireEffects(kind,{practice})};
}
export function beFirearmAssertions(state,{a,has,assert,dials=BE_FIREARM_DIALS}){
 const r=a.player.resources||{},held=a.player.facts?.[BE_REVOLVER_FACT]===true,mine=Object.keys(r).filter(k=>k===beFirearmKeys.fired||k.startsWith(RES+'carried.')||k.startsWith(RES+'loaded.'));
 for(const k of mine)assert(nat(r[k]),'Revolver rounds are whole numbers, never negative.');
 assert(!mine.length&&!held||state.lotm.entryProfile===BE_PROFILE_ID,'The book life\'s revolver belongs to the book life.');
 let loaded=0;for(const kind of Object.keys(BE_ROUND_KINDS))loaded+=r[key('loaded',kind)]||0;
 assert(loaded<=dials.chambers,'More rounds are loaded than the revolver holds.');
 assert(held||loaded===0&&!(r[beFirearmKeys.fired]>0),'Loaded rounds and practice need the revolver.');
 for(const k of mine)assert(k===beFirearmKeys.fired||Object.keys(BE_ROUND_KINDS).some(kind=>k===key('carried',kind)||k===key('loaded',kind)),'Unknown revolver count.');
}
