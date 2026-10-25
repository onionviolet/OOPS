import {intentEffects} from './cultivation_intents.js';
// Original Frontier site. World facts own its physical truth and depletion;
// existing actor knowledge owns observations. No extra bag, RNG or clock.
import {check,natural} from './basics.js';
import {mix32,streamSeed,drawUnit,scopedStream} from './seeded_streams.js';
import {applySimulationEffects} from './simulation_effects.js';
import {ensureHomeSimulation} from './home_work.js';
import {applyGameplayEffect} from './gameplay_transactions.js';
import {assertNativeItemDisposition} from './native_gameplay_adapter.js';
import {DRAINAGE_WORLD,DRAINAGE_PREFIX,drainageLocation,drainageRoom,drainageLayout,drainageGate} from './drainage_layout.js';
export {DRAINAGE_WORLD,DRAINAGE_PREFIX,drainageLocation,drainageRoom,drainageLayout,drainageGate} from './drainage_layout.js';
const key=id=>JSON.stringify({id}),WOOD=key('Rough wood log'),COAL=key('Charcoal'),ROPE=key('Survey rope'),KIT=key('Prepared survey kit'),ORE=key('Iron ore');
const prefix='drainage.',fkey=id=>prefix+id;
export const DRAINAGE_SITUATION=Object.freeze({id:'drainage.site',revision:1,label:'Riverside gallery survey',context:{worldId:DRAINAGE_WORLD,instanceId:'frontier.main',continuityId:'frontier.branch',eraId:'frontier.present',regionId:'frontier.village.riverbank'},initialPhase:'observed',phases:['observed'],privateTruth:{origin:'original.riverside.service_gallery'},participants:['player']});
const facts=s=>s.worlds[DRAINAGE_WORLD].facts;
const known=(s,id)=>s.simulation?.knowledge?.player?.[fkey(id)];
const get=(s,id)=>facts(s)[fkey(id)];
export function drainageRevealed(s){return Array.from({length:6},(_,i)=>i).filter(i=>known(s,'route.'+i));}
export function validateDrainage(s){
 const f=s.worlds?.[DRAINAGE_WORLD]?.facts||{},entries=Object.keys(f).filter(k=>k.startsWith(prefix));if(!entries.length)return;
 check(entries.sort().join(',')===['seed','crate','brace','rope','remaining','removed','washed','searches'].map(fkey).sort().join(','),'Unsupported drainage truth.');
 check(s.simulation?.situations?.[DRAINAGE_SITUATION.id]?.context.worldId===DRAINAGE_WORLD&&known(s,'route.0'),'The drainage history needs its actual survey context and entrance observation.');
 drainageLayout(f[fkey('seed')]);check(natural(f[fkey('crate')])&&f[fkey('crate')]<6&&typeof f[fkey('brace')]==='boolean'&&typeof f[fkey('rope')]==='boolean','Invalid drainage mechanisms.');
 check(['remaining','removed','washed','searches'].every(id=>natural(f[fkey(id)])&&f[fkey(id)]<=4)&&f[fkey('remaining')]+f[fkey('removed')]+f[fkey('washed')]===4&&f[fkey('searches')]<=f[fkey('removed')]+f[fkey('washed')],'Invalid finite drainage deposit.');
}
function observedRoom(s,room){return !!known(s,'room.'+room);}
export function quoteDrainage(s,request,c){
 const q={request,minutes:0,stamina:0,spend:[],risk:0,reward:0};try{
  check(c.world===DRAINAGE_WORLD&&c.alive&&c.ready&&c.body.ownerId==='player'&&c.body.controllerId==='player','Use your living controlled body, free attention and writable Frontier save.');
  const room=drainageRoom(c.location),hands=(c.body.hands||0)>0&&c.body.mobile!==false;
  const take=(item,n)=>{check((c.inventory[item]||0)>=n,'Carry the actual owned supplies named by this action.');assertNativeItemDisposition(s,item);q.spend.push({key:item,count:n});};
  if(request.id==='scout'){check(c.location==='Village'&&get(s,'seed')===undefined,'Inspect the public riverside lead from Village.');take(COAL,1);q.minutes=5;q.stamina=1;}
  else{
   check(room!==null&&get(s,'seed')!==undefined,'Visit the actual drainage gallery.');
   const layout=drainageLayout(get(s,'seed')),kind=layout.rooms[room].kind;
   if(request.id==='inspect'){check(c.body.can_see!==false,'Use sight or a fitting perception route for this visual survey.');q.minutes=2;}
   else{check(observedRoom(s,room),'Inspect the actual room before committing this work.');
    if(request.id==='watch'){check(!known(s,'flowLesson'),'This local flow lesson is already recorded.');q.minutes=10;}
    else if(request.id==='rest'){check(kind==='dry','Find actual dry footing before taking this sheltered rest.');q.minutes=5;}
    else{
     check(hands,'This handling work needs a usable hand and movement.');
     if(request.id==='push'){
      check(get(s,'crate')===room,'Meet the movable object here.');check(natural(request.to)&&layout.edges.some(([a,b])=>a===room&&b===request.to||b===room&&a===request.to)&&known(s,'route.'+request.to)&&(request.to!==5||drainageGate(s)),'Use an observed, physically open adjacent passage.');q.minutes=Math.max(1,Math.ceil(24/Math.max(1,c.stats.strength||1)));q.stamina=q.minutes;
     }else if(['brace','rope','recover_rope'].includes(request.id)){
      check(kind==='mechanism','Work at the actual lifting mechanism.');q.minutes=request.id==='brace'?8:3;q.stamina=2;
      if(request.id==='brace'){check(!get(s,'brace'),'This support is already installed.');take(WOOD,2);}
      else if(request.id==='rope'){check(!get(s,'rope'),'A rope is already installed.');take(ROPE,1);}
      else check(get(s,'rope'),'There is no installed rope to recover.');
     }else if(request.id==='search'){
      check(kind==='deposit'&&get(s,'remaining')>0,'Investigate an observed deposit that still holds material.');
      check(['careful','quick'].includes(request.approach),'Choose the disclosed working pace.');const careful=request.approach==='careful';take(COAL,careful?2:1);if(request.kit)take(KIT,1);
      q.minutes=careful?12:6;q.stamina=3+Math.floor(get(s,'searches')/2);q.reward=Math.min(get(s,'remaining'),1+Math.floor(get(s,'searches')/2));
      const learning=(c.trialLearning||0)+(s.actors.player.resources['cultivation.fieldFailures']||0);
      q.risk=Math.max(0,Math.min(45,10+10*get(s,'searches')-5*Math.min(10,learning)-2*(c.channels||0)-(careful?20:0)-(request.kit?15:0)-(known(s,'flowLesson')?5:0)-intentEffects(s).searchRisk));
     }else check(false,'Choose a supported site action.');
    }
   }
  }
  check(c.stats.stamina>=q.stamina,'Recover the actual stamina this work spends.');q.eligible=true;
 }catch(e){q.eligible=false;q.reason=e.message;}return q;
}
function apply(plan,effects,c,registry){
 ensureHomeSimulation(plan,c.location,c.body);plan.acquisitions ||= [];plan.unlocks ||= [];
 applySimulationEffects(plan,effects,{actorId:'player',worldId:DRAINAGE_WORLD,external:plan.external,gameplay:plan.gameplay},registry,`drainage:${plan.state.sequence}`);
}
export function stageDrainage(plan,request,c,registry){
 const q=quoteDrainage(c.root,request,c);check(q.eligible,q.reason);check(plan.state.clock-c.clock===q.minutes,'Finish the intervening local decision before this work.');
 check(plan.state.actors.player.worldId===DRAINAGE_WORLD&&plan.state.chronicle?.life.endedAt==null&&(!plan.state.simulation?.people.player||plan.state.simulation.people.player.life==='alive')&&(!plan.nativeLocation||plan.nativeLocation===c.location),'The acting life or place changed during this work.');
 for(const row of q.spend)applyGameplayEffect(plan.gameplay,{type:'item',key:row.key,amount:row.count},'player',true);
 const s=plan.state,f=facts(s),write=(id,value)=>{f[fkey(id)]=value;},note=(id,text,stage='seen')=>({type:'knowledge',actor:'player',key:fkey(id),stage,value:text,basis:{kind:'observation',attributedTo:'player',situationId:DRAINAGE_SITUATION.id}}),effects=[];let message='';plan.state.sequence++;
 const id=request.id,room=drainageRoom(c.location);
 if(id==='scout'){
  write('seed',streamSeed(s,scopedStream('world.events:drainage'), 'drainage.layout'));for(const [k,v]of Object.entries({crate:1,brace:false,rope:false,remaining:4,removed:0,washed:0,searches:0}))write(k,v);
  effects.push({type:'situation',situationId:DRAINAGE_SITUATION.id,operation:'begin'},note('route.0','Your Village survey records the actual riverside drain entrance.'));message='Your light reveals an old service-gallery entrance by the river. Its interior is still unsurveyed. Native travel now reaches the entrance; return travel remains available.';
 }else if(id==='inspect'){
  const layout=drainageLayout(get(s,'seed')),kind=layout.rooms[room].kind,first=!observedRoom(s,room);
  const text={entry:'A drained service entrance has dry steps back toward Village.',mechanism:'A lifting loop, a weighted gate and old guide timbers remain accessible. Weight, a tied line or fitted supports could hold the mechanism.',passage:'Scuffed level flagstones connect the service passages; a heavy object could be shifted along their open edges.',pressure:'A broad floor lever has a surviving mechanical connection. Its support moves under weight.',dry:'A raised, dry loading niche offers footing for a short rest.',rubble:'This side niche is choked with collapsed brick; it offers no dry resting shelf.',deposit:'A muddy mineral deposit remains in the former loading area. Light and deliberate digging can free real ore; each disturbance loosens the next working face.'}[kind];
  effects.push(note('room.'+room,text));for(const [a,b]of layout.edges)if(a===room||b===room)effects.push(note('route.'+(a===room?b:a),`You observed an adjoining passage from gallery marker ${room+1}.`));
  if(first){effects.push({type:'unlock',actor:'player',kind:'skill',id:'Perception'});if(plan.gameplay.player.skills.Perception?.enabled)effects.push({type:'xp',actor:'player',skill:'Perception',amount:3});}message=text;
  s.actors.player.resources['drainage.surveys']=(s.actors.player.resources['drainage.surveys']||0)+1;
 }else if(id==='push'){write('crate',request.to);effects.push(note('object','You shifted the waterlogged object into gallery marker '+(request.to+1)+'.'));message='The object moves through the observed passage. Its physical weight remains where you put it.';}
 else if(id==='brace'){write('brace',true);message='Your two real logs remain fitted as supports. The lifting mechanism holds without continued pressure.';}
 else if(id==='rope'){write('rope',true);message='Your actual survey rope remains tied into the lifting mechanism, out of your carried bag.';}
 else if(id==='recover_rope'){write('rope',false);applyGameplayEffect(plan.gameplay,{type:'item',key:ROPE,amount:1},'player');message='The same installed rope returns to your bag. Other actual support decides whether the gate remains held.';}
 else if(id==='rest'){plan.native={...plan.native,staminaToFull:Math.max(0,(plan.native?.staminaToFull??c.stats.max_stamina-c.stats.stamina)-3)};message='You spend five actual played minutes on the observed dry footing and recover three stamina.';}
 else if(id==='watch'){
  const resources=s.actors.player.resources,n=(resources['drainage.observationMinutes']||0)+10;resources['drainage.observationMinutes']=n;
  const learned=n>=30||drawUnit(s,scopedStream('discovery:drainage'),'flow.'+n)<.25;
  if(learned)effects.push(note('flowLesson','Repeated attended observations taught a steadier way to handle the mineral face. Future searches here reduce fumble risk by five percentage points.','understood'));
  message=learned?'Your actual observations support a steadier local handling method.':'Ten attended minutes add to your local observation record. The next comparison still needs time in these galleries.';
 }else if(id==='search'){
  const failed=drawUnit(s,scopedStream('interaction:drainage'),'search.'+(get(s,'searches')+1))<q.risk/100;
  write('searches',get(s,'searches')+1);const n=failed?1:q.reward;write('remaining',get(s,'remaining')-n);write(failed?'washed':'removed',get(s,failed?'washed':'removed')+n);
  if(failed){s.actors.player.resources['cultivation.fieldFailures']=(s.actors.player.resources['cultivation.fieldFailures']||0)+1;const harm=Math.min(c.stats.health-1,1+Math.floor(get(s,'searches')/2));plan.native={...plan.native,hpToFull:Math.min(c.stats.max_health-1,(plan.native?.hpToFull??c.stats.max_health-c.stats.health)+Math.max(0,harm))};message='Loose material washes into the drain. You keep the actual strain and one field-failure lesson; the material is no longer in this working face.';}
  else{applyGameplayEffect(plan.gameplay,{type:'item',key:ORE,amount:n},'player');message=`Your work frees ${n} actual Iron ore. The remaining face stays depleted; return or reload does not replace it.`;}
  effects.push(note('lastSearch',message));
 }
 if(q.stamina)plan.native={...plan.native,staminaToFull:Math.min(c.stats.max_stamina,(plan.native?.staminaToFull??c.stats.max_stamina-c.stats.stamina)+q.stamina)};
 if(effects.length)apply(plan,effects,c,registry);validateDrainage(s);return {plan,message,quote:q};
}
export function drainageView(s,c){
 const present=get(s,'seed')!==undefined,room=drainageRoom(c.location),revealed=drainageRevealed(s),inspected=room!==null&&observedRoom(s,room),layout=present?drainageLayout(get(s,'seed')):null,kind=inspected?layout.rooms[room].kind:null;
 const actions=[{id:'scout',label:'Survey the riverside lead · 1 charcoal, 5 min, 1 stamina'}];
 if(room!==null){actions.length=0;actions.push({id:'inspect',label:'Inspect this actual room · 2 min'});if(inspected){actions.push({id:'watch',label:'Watch the local flow · 10 attended min'});if(kind==='dry')actions.push({id:'rest',label:'Rest on the dry shelf · 5 min, recover 3 stamina'});
  if(get(s,'crate')===room)for(const [a,b]of layout.edges)if(a===room||b===room){const to=a===room?b:a;if(revealed.includes(to))actions.push({id:'push',to,label:`Shift the object toward marker ${to+1} · effort follows actual strength`});}
  if(kind==='mechanism')actions.push({id:'brace',label:'Fit supports · 2 logs, 8 min, 2 stamina'},{id:'rope',label:'Tie your owned survey rope · 3 min, 2 stamina'},{id:'recover_rope',label:'Recover the installed rope · 3 min, 2 stamina'});
  if(kind==='deposit'&&get(s,'remaining')>0)for(const approach of ['careful','quick'])for(const kit of [false,true])actions.push({id:'search',approach,kit,label:`${approach==='careful'?'Deliberate':'Quick'} mineral search${kit?' with one actual survey kit':''}`});
 }}
 return {visible:c.location==='Village'||room!==null,present,room,description:inspected?known(s,'room.'+room).value:room!==null?'These surfaces have not yet been inspected.':'An original Frontier river-gallery lead. Its physical layout is seeded once; observations and depletion persist.',
  map:{id:'frontier.drainage.onsite_sketch',world:DRAINAGE_WORLD,source:'your own onsite observations',frame:'local gallery markers in this Frontier history',edition:s.actors.player.resources['drainage.surveys']||0,nodes:present?layout.rooms.filter(r=>revealed.includes(r.id)).map(r=>({id:r.id,x:r.x,y:r.y,inspected:observedRoom(s,r.id),at:known(s,'room.'+r.id)?.at??known(s,'route.'+r.id)?.at})):[],edges:present?layout.edges.filter(([a,b])=>revealed.includes(a)&&revealed.includes(b)):[]},
  objectHere:inspected&&get(s,'crate')===room,plateBody:kind==='pressure'&&(c.body.massKg??(c.body.form==='human'?70:0))>=20,gateKnown:kind==='mechanism',gate:kind==='mechanism'?drainageGate(s):null,remaining:kind==='deposit'?get(s,'remaining'):null,cleared:kind==='deposit'?get(s,'remaining')===0:null,
  observedMinutes:s.actors.player.resources['drainage.observationMinutes']||0,lesson:!!known(s,'flowLesson'),fieldLearning:s.actors.player.resources['cultivation.fieldFailures']||0,actions:actions.map(r=>({...r,quote:quoteDrainage(s,r,c)}))};
}
