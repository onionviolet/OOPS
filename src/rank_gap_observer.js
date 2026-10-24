// HTP49 pilot (proposal, not accepted direction): a Paradise-Goa rank-gap and
// observer table with ONE action, "Watch a working", whose verb changes with
// the gap. Tiers and dials are AUTHORED original-branch numbers (no canon
// claim). Pure functions over a namespaced slice `rankGapObserver`; nothing
// here reads or edits home state, Paradise campaign state or main.js.
// Credential facts mirror book_world_paradise_actions.js (localPermit,
// palaceAccess, the physical Goa duty copy). Wiring release: see HTP49 report.
const copy=x=>structuredClone(x);
export const RANK_GAP_SLICE='rankGapObserver';

// Default, dial, in-world reason and cost for each knob.
export const RANK_GAP_DIALS=Object.freeze({
  harmGap:{default:2,dial:'gap at which watching harms the watcher',reason:'A form well past your own tier is felt before it is understood; the body reads it as a threat.',cost:'strain and stamina lost; the blurred sighting is still recorded'},
  blindGap:{default:3,dial:'gap at which a watcher cannot witness at all',reason:'Nothing in the watcher\'s senses has a hook for it; they see an ordinary person or nothing.',cost:'time and attention spent, nothing learned'},
  watchMinutes:{default:2,dial:'played minutes one watch takes',reason:'Reading a working takes sustained attention, not a glance.',cost:'the watch clock advances; strain recovers only with clock time'},
  staminaCost:{default:1,dial:'stamina per watch',reason:'Holding attention is tiring.',cost:'stamina'},
  glimpseExtraStamina:{default:1,dial:'extra stamina when the look is a glimpse',reason:'Looking away from something you cannot hold costs effort on top of the watch.',cost:'stamina; the quote for an unresolved subject is a range, the gate uses the true cost'},
  strainLimit:{default:3,dial:'strain that closes the watcher\'s sight for a while',reason:'Repeated hard looks leave the watcher dazzled.',cost:'sight closed until strain recovers'},
  wardGlimpses:{default:3,dial:'palace-tier glimpses endured before the watcher\'s sight hardens into a soul ward',reason:'Enduring hard looks without turning away trains the watcher to feel a crystal bearer instead of seeing nothing.',cost:'the strain and stamina of each glimpse; the ward turns blind into glimpse, never into witness'},
  strainRecoverPerMinute:{default:0.25,dial:'strain recovered per played minute',reason:'Eyes and nerves settle with rest.',cost:'waiting'}
});

// Authored Goa-branch tiers. "civil" ladder only; it is not a Hunter license.
export const TIERS=Object.freeze({
  0:{id:'civilian',label:'Civilian'},
  1:{id:'duty',label:'Guard or contractor on duty'},
  2:{id:'palace',label:'Palace-linked'},
  3:{id:'soul',label:'Soul-crystal bearer'}
});
// Subjects use the immutable Paradise ids; tiers are authored dials.
export const SUBJECTS=Object.freeze({
  'book.paradise.mia':{label:'Mia',tier:0},
  'book.paradise.hank':{label:'Hank',tier:1},
  'book.paradise.philip_herbert':{label:'Philip Herbert',tier:2},
  'book.paradise.su_xiao':{label:'Su Xiao',tier:3}
});
// Observer means: who can perceive a tier by what route. `reach` is the highest
// tier the means can resolve exactly; the means never shows a tier above it.
export const MEANS=Object.freeze({
  sight:{id:'sight',label:'Plain sight',reach:0,needs:null,reason:'Bearing and kit of ordinary people are plain.'},
  duty_copy:{id:'duty_copy',label:'Checking the Goa duty copy against a badge',reach:1,needs:{item:'Goa duty copy'},reason:'The copy lists duty marks, so a guard\'s tier can be read.'},
  local_permit:{id:'local_permit',label:'Palace-approach admission',reach:2,needs:{fact:'book.paradise.localPermit'},reason:'Admission puts you where palace liveries and seals can be read.'},
  soul_ward:{id:'soul_ward',label:'Warded sight (soul crystal sense)',reach:3,needs:{fact:'book.paradise.soulWard'},reason:'Only someone holding a crystal sense can resolve a crystal bearer; authored, needs a source.'}
});

export function defaultSlice(){return {version:1,clock:0,earned:{},observers:{}};}
// Legacy saves have no slice; normalising never invents data.
export function loadSlice(raw){
  if(!raw||typeof raw!=='object')return defaultSlice();
  const s=defaultSlice();s.clock=Number.isFinite(raw.clock)?raw.clock:0;s.earned=copy(raw.earned||{});
  for(const [id,o] of Object.entries(raw.observers||{}))s.observers[id]={strain:Math.max(0,+o.strain||0),strainAt:Number.isFinite(o.strainAt)?o.strainAt:s.clock,closedUntil:Number.isFinite(o.closedUntil)?o.closedUntil:null,sightings:copy(o.sightings||{}),glimpses:Math.max(0,+o.glimpses||0)};
  return s;
}
const obs=(s,id)=>s.observers[id]||={strain:0,strainAt:s.clock,closedUntil:null,sightings:{},glimpses:0};
function settle(s,id,dials){const o=obs(s,id);const rec=Math.max(0,(s.clock-o.strainAt)*dials.strainRecoverPerMinute);o.strain=Math.max(0,o.strain-rec);o.strainAt=s.clock;if(o.closedUntil!=null&&o.strain<dials.strainLimit&&s.clock>=o.closedUntil)o.closedUntil=null;return o;}

export const dialValues=(over={})=>Object.fromEntries(Object.entries(RANK_GAP_DIALS).map(([k,v])=>[k,over[k]??v.default]));

// True stamina for a verb; preview, gate and commit all use this one number.
export const watchCost=(verb,dials=dialValues())=>dials.staminaCost+(verb==='glimpse'?dials.glimpseExtraStamina:0);

// The verb depends on the gap, not just its size: witness (learn), glimpse
// (harm, blurred), blind (cannot witness).
export function gapVerb(observerTier,subjectTier,dials=dialValues()){
  const gap=subjectTier-observerTier;
  if(gap<dials.harmGap)return 'witness';
  if(gap<dials.blindGap)return 'glimpse';
  return 'blind';
}
// A soul ward turns "blind" into "glimpse": you feel it and it hurts.
export function watchVerb(ctx,sub,meansId,dials){const v=gapVerb(ctx.observerTier??0,sub.tier,dials);return v==='blind'&&meansId==='soul_ward'?'glimpse':v;}
export function meansAvailable(ctx,meansId){
  const m=MEANS[meansId];if(!m)return {ok:false,reason:'Unknown means.'};
  if(!m.needs)return {ok:true};
  if(m.needs.item&&(ctx.items?.[m.needs.item]||0)<1)return {ok:false,reason:`Needs the physical ${m.needs.item}.`};
  if(m.needs.fact&&!ctx.facts?.[m.needs.fact])return {ok:false,reason:'Needs the matching credential or sense.'};
  return {ok:true};
}
// Observer-only readout: what THIS observer can resolve by THIS means. A
// subject above the means' reach is reported only as "beyond what you can read".
export function perceive(observerTier,subjectId,meansId){
  const sub=SUBJECTS[subjectId],m=MEANS[meansId];
  if(!sub||!m)return {resolved:false,text:'Nothing readable.'};
  if(sub.tier<=m.reach)return {resolved:true,tier:sub.tier,text:`${sub.label}: ${TIERS[sub.tier].label}.`};
  return {resolved:false,text:`${sub.label} reads as someone beyond what ${m.label.toLowerCase()} can resolve.`};
}

// ONE action: clock (watchMinutes), cost (stamina, strain), consequence (the
// verb result, a closed-sight state, a recorded sighting).
export function previewWatch(slice,ctx,{observerId='player',subjectId,meansId},over={}){
  const dials=dialValues(over),s=loadSlice(slice),reasons=[];
  const sub=SUBJECTS[subjectId];if(!sub)reasons.push('No such subject here.');
  const mean=meansAvailable(ctx,meansId);if(!mean.ok)reasons.push(mean.reason);
  const o=settle(s,observerId,dials);
  if(o.closedUntil!=null&&s.clock<o.closedUntil)reasons.push('Your sight is dazzled; rest before watching again.');
  const verb=sub?watchVerb(ctx,sub,meansId,dials):null,stamina=watchCost(verb,dials);
  if((ctx.stamina??0)<stamina)reasons.push('Too tired to hold attention.');
  return {eligible:!reasons.length,reasons,verb,minutes:dials.watchMinutes,costs:{stamina}};
}
export function commitWatch(slice,ctx,args,over={}){
  const p=previewWatch(slice,ctx,args,over);if(!p.eligible)return {ok:false,reasons:p.reasons,slice:loadSlice(slice)};
  const dials=dialValues(over),s=loadSlice(slice),{observerId='player',subjectId,meansId}=args,sub=SUBJECTS[subjectId];
  s.clock+=dials.watchMinutes;const o=settle(s,observerId,dials);
  const verb=p.verb;let result;
  if(verb==='witness'){const r=perceive(ctx.observerTier??0,subjectId,meansId);
    o.sightings[subjectId]={verb,at:s.clock,tier:r.resolved?r.tier:null};result={verb,text:r.text,harm:0,stamina:p.costs.stamina};}
  else if(verb==='glimpse'){const harm=1+Math.min(1,Math.max(0,sub.tier-(ctx.observerTier??0)-dials.harmGap));o.strain+=harm;o.glimpses+=1;if(o.glimpses>=dials.wardGlimpses&&!s.earned.soulWard)s.earned.soulWard={at:s.clock};
    o.sightings[subjectId]={verb,at:s.clock,tier:null};result={verb,text:`You look at ${sub.label} and it hurts to keep looking; the shape slides away.`,harm,stamina:p.costs.stamina};
    if(o.strain>=dials.strainLimit){o.closedUntil=s.clock+Math.ceil((o.strain-dials.strainLimit+1)/dials.strainRecoverPerMinute);}}
  else{o.sightings[subjectId]={verb,at:s.clock,tier:null};result={verb,text:`You watch ${sub.label} for ${dials.watchMinutes} minutes and see nothing you can name.`,harm:0,stamina:p.costs.stamina};}
  return {ok:true,verb,result,slice:s};
}
// What the observer holds; never lists subject tiers they did not resolve.
export function observerView(slice,observerId='player'){
  const o=loadSlice(slice).observers[observerId];if(!o)return [];
  return Object.entries(o.sightings).map(([id,x])=>({subject:SUBJECTS[id]?.label||id,verb:x.verb,tier:x.tier==null?null:TIERS[x.tier].label}));
}
