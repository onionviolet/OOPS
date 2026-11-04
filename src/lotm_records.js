// R6 reading of sealed records (ch65 P052, MR/AR1-AR16, AD38, AD43). Pure compiler like lotm_act_engine: a stack of document pages
// plus an authored binding becomes native commands. Means are earned, not granted: Dunn's note (a grant fact the arc earned), the
// custodian fetching the stack from its archive (minutes), the stack read in the room only (it goes back), and per-page clearance
// from LOTM_RECORDS_CLEARANCE. A page above the lead's clearance is refused with the table's reason; nothing is charged.
// Nothing here registers commands or holds state: reads are actor facts and knowledge, so the save envelope is unchanged. A page and a link
// are `once` (their read fact is the retained result); the stack fact is true while it is on the table and false once handed back.
import {validateSimulationEffect} from './simulation_contracts.js';
import {evaluateRule} from './rules.js';
import {LOTM_RECORDS_CLEARANCE as TABLE} from './book_world_lotm_clearance.js';
const id=x=>typeof x==='string'&&/^[a-z][a-z0-9_.:-]*$/i.test(x)&&!['__proto__','constructor','prototype'].includes(x);
const pos=x=>Number.isSafeInteger(x)&&x>0;
const eq=(fact,value,reason)=>({fact,op:'eq',value,...(reason?{reason}:{})});
const all=(...r)=>({all:r.filter(Boolean)});
export const recordKeys={read:p=>`lotm.records.read.${p}`,stack:s=>`lotm.records.stack.${s}`,link:k=>`lotm.records.link.${k}`};
// binding: {place, custodian, grants:{cleared_7:fact, captain?:fact}, fetchMinutes, minutes:{[pageId]}, evidence?:{[linkId]:fact}}.
// rows: {id, label, archive, locators, pages:[{id,label,grade,seq,text,pathway}], links?:[{id,label,needs:[pageId],evidence?,text}]}.
export const levelFrom=(facts,binding)=>binding.grants.captain&&facts[binding.grants.captain]?'captain':facts[binding.grants.cleared_7]?'cleared_7':'uncleared';
const gateFact=(page,binding)=>binding.grants[TABLE.grades[page.grade].needs.atLeast];
function problems(row,b){
 const out=[];
 if(!b||!id(b.place)||!id(b.custodian))out.push('Binding needs a place and a custodian.');
 else{
  if(!pos(b.fetchMinutes))out.push('Binding needs fetch minutes.');
  if(!b.grants?.cleared_7)out.push('Binding needs the grant fact that opens Sequence 7.');
  for(const p of row.pages){if(!TABLE.grades[p.grade])out.push(`Page ${p.id} has no clearance grade.`);if(!pos(b.minutes?.[p.id]))out.push(`Page ${p.id} needs minutes.`);}
 }
 return out;
}
export function defineLotmRecords(rows,bindings,{worldId,actorId='player',group,situationId,resolvePlace=x=>x}={}){
 if(![worldId,actorId,group,situationId].every(id))throw Error('Invalid records binding.');
 const commands=[],unbound=[];
 for(const row of rows){
  const b=bindings?.[row.archive],why=problems(row,b);
  if(why.length){unbound.push({id:row.id,reasons:why});continue;}
  const here=eq(`actor.${recordKeys.stack(row.id)}`,true,'The custodian has not brought the stack up.');
  const base={revision:1,worldId,actorId,group,location:resolvePlace(b.place),targetId:b.custodian,coLocated:true,once:false,cancellation:'refund',completionCoLocated:true,completionFailure:'refund',costs:[]};
  const know=(key,value)=>({type:'knowledge',actor:actorId,key,stage:'seen',value,basis:{kind:'observation',attributedTo:actorId,situationId,actId:row.id,at:row.locators?.[0]}});
  const fact=(key,value)=>({type:'fact',scope:'actor',actor:actorId,key,value});
  const noted=eq(`actor.${b.grants.cleared_7}`,true,'You hold no signed note for the records.');
  const defs=[];
  defs.push({...base,id:`${row.id}.fetch`,label:`${row.label}: have it brought up`,description:`The custodian goes to the archive and brings a stack, which is read here and goes back.`,duration:b.fetchMinutes,
   visibleWhen:eq('actor.life','alive'),requires:all(noted),completionRequires:all(noted),
   effects:[fact(recordKeys.stack(row.id),true),know(`lotm.records.${row.id}.fetch`,`The stack from ${row.archive} is on the table. It is read here only and goes back when you are done.`)],records:{rowId:row.id,kind:'fetch'}});
  for(const p of row.pages){
   const g={fact:gateFact(p,b)},read=recordKeys.read(p.id);
   defs.push({...base,id:`${row.id}.${p.id}`,label:`${row.label}: ${p.label}`,description:p.text,duration:b.minutes[p.id],once:true,
    visibleWhen:eq('actor.life','alive'),requires:all(noted,g.fact?eq(`actor.${g.fact}`,true,TABLE.grades[p.grade].line):eq('actor.lotm.records.never',true,TABLE.grades[p.grade].line),here),
    completionRequires:all(here),
    effects:[fact(read,true),know(`lotm.records.${p.id}`,p.text)],records:{rowId:row.id,kind:'page',pageId:p.id,grade:p.grade,seq:p.seq,pathway:p.pathway}});
  }
  for(const l of row.links||[]){
   const ev=b.evidence?.[l.id];
   defs.push({...base,id:`${row.id}.link.${l.id}`,label:`${row.label}: ${l.label}`,description:l.text,duration:l.minutes||5,once:true,
    visibleWhen:eq('actor.life','alive'),requires:all(...l.needs.map(n=>eq(`actor.${recordKeys.read(n)}`,true,'Read the page it rests on first.')),ev?eq(`actor.${ev}`,true,'You have nothing from outside the papers to match them against.'):null,),
    completionRequires:all(),effects:[fact(recordKeys.link(l.id),true),know(`lotm.records.link.${l.id}`,l.text)],records:{rowId:row.id,kind:'link',linkId:l.id}});
  }
  defs.push({...base,id:`${row.id}.return`,label:`${row.label}: hand the stack back`,description:'The custodian takes the stack back to its archive. Pages you have read stay read; another look needs it fetched again.',duration:2,
   visibleWhen:eq('actor.life','alive'),requires:all(here),completionRequires:all(),effects:[fact(recordKeys.stack(row.id),false)],records:{rowId:row.id,kind:'return'}});
  for(const d of defs){d.effects.forEach(validateSimulationEffect);commands.push(d);}
 }
 return {commands,unbound};
}
// The read model P3 shows: one row per page with a status the player can act on, and the reason when it cannot run.
// status: read | ready | needs-stack | withheld (clearance) | blocked (other). `known` false shows the table's vague line.
// The simulation reports one generic line when an `all` rule fails, so the quote names each unmet leaf itself from `facts`.
export const unmetReasons=(rule,facts)=>!rule?[]:rule.all?rule.all.flatMap(r=>unmetReasons(r,facts)):evaluateRule(rule,facts).met?[]:[rule.reason||'Something this needs is missing.'];
export function quoteLotmRecords(commands,preview,{actorFacts={},facts=null,known=true}={}){
 return commands.flatMap(d=>{
  const q0=preview(d);if(!q0.visible)return [];
  const scopedFacts=!q0.eligible&&facts?(typeof facts==='function'?facts(d):facts):null;
  const q=scopedFacts?{...q0,reasons:[...unmetReasons(d.requires,scopedFacts),...(q0.reasons||[]).filter(r=>r!=='The required knowledge, means or circumstances are missing.')]}:q0;
  const m=d.records,done=m.kind==='page'?actorFacts[recordKeys.read(m.pageId)]===true:m.kind==='link'?actorFacts[recordKeys.link(m.linkId)]===true:false;
  const grade=m.grade?TABLE.grades[m.grade]:null,withheld=!!grade&&!done&&(q.reasons||[]).some(r=>r===grade.line);
  const status=done?'read':q.eligible?'ready':withheld?'withheld':(q.reasons||[]).some(r=>/stack up/.test(r))?'needs-stack':'blocked';
  return [{id:d.id,rowId:m.rowId,kind:m.kind,pageId:m.pageId,label:d.label,duration:q.duration??d.duration,costText:'No stock spent; the time and the custodian\'s attention.',
   status,eligible:!!q.eligible,reasons:withheld&&!known?[grade.vague]:(q.reasons||[]),...(m.seq?{seq:m.seq}:{})}];
 });
}
