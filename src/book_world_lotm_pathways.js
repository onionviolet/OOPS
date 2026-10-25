// Pathway factory (B2, 2026-10-23): one function set turns a pathway row (book_world_lotm_rows.js) into its
// commands, flags, facts, state assertions, dose accounting, descriptor and view. The Seer stays hand-authored
// (lesson, spirituality, sample bench); every other pathway is data. Source ids and doses are separate per
// pathway, so a wrong-pathway or second-pathway potion stays a stated cause of loss of control (LTS, L7).
import {LOTM_IDS as I,LOTM_LOCATIONS as L,LOTM_KEYS as K,LOTM_SWITCH_NOTICE} from './book_world_lotm_ids.js';
import {eq,gte,all,not,af,has,no,item,attention,know,cmd} from './book_world_lotm_kit.js';
import {causeHeld} from './book_world_lotm_causes.js';
import {definePath,pathView} from './ascension_paths.js';
import {lotmRoleOf} from './book_world_lotm_clearance.js';
import {allRows,pathwayRows,seerRow} from './book_world_lotm_rows.js';
export const flagOf=(row,name)=>row.prefix?`${row.prefix}.${name}`:name;
const U='understood',grant=(sourceId)=>({type:'source',actor:'player',sourceId,operation:'grant',origin:'acquired',awakened:true,active:true});
const knowRow=(row,which,stage)=>{const [key,text,kind]=row.know[which];return know(key,text,'player','player',kind,stage||U);};
const lowFlag=row=>flagOf(row,'allocated');
// Commands: accept, ingest, the acts, the assessment, the next ingest. Every doses is issued from stores, so no save holds one early.
export function pathwayCommands(row){
 const p=row.key,f=n=>flagOf(row,n),h=row.holds,place=row.place||L.workroom,officer=row.officerId||I.supervisor,here=officer===I.supervisor?{}:{officer:true};
 const supported=`lotm.${p}Supported`,undigested=not(gte(`lotm.${p}.acting`,row.digest)),attn=gte(officer===I.supervisor?'lotm.supervisorAttention':'lotm.officerAttention',1);
 const acted={type:'resource',actor:'player',key:`book.lotm.${p}.acting`,amount:1};
 const target={targetId:officer,...here};
 return [
  cmd(row.ids.accept,row.labels.accept,place,{...target,visibleWhen:all(row.officerId===I.supervisor?eq('lotm.ready'):eq('lotm.readyAtOfficer'),eq('lotm.beyonderTrack'),eq(`lotm.home.${row.church}`),no(f('allocated')),no(f('ingested')),eq('lotm.ingestedAny',false)),
   requires:all(eq('lotm.beyonderTrack'),eq(`lotm.home.${row.church}`),eq('lotm.pathChosen',false)),effects:[af(f('allocated')),item('player',K[h.base],1),knowRow(row,'accept')]}),
  cmd(row.ids.ingest,row.labels.ingest,place,{...target,requires:all(has(f('allocated')),no(f('ingested')),gte(`lotm.holds.${h.base}`,1),eq(`lotm.block.${row.pid}.wrongPotion`,false)),costs:[item('player',K[h.base],-1)],
   effects:[grant(row.base),af(f('ingested')),af(f('stabilized')),knowRow(row,'ingest')]}),
  ...row.acts.map(a=>cmd(a.id,a.label,place,{...target,...(a.once===false?{once:false}:{}),
   requires:all(eq(supported),has(f('stabilized')),...(a.flag?[no(f(a.flag))]:[]),undigested,attn),duration:a.minutes,cancellation:'forfeit',
   costs:[attention(-1,officer)],effects:[...(a.flag?[af(f(a.flag))]:[]),acted,know(a.know[0],a.know[1],'player','player','observation',U)]})),
  cmd(row.ids.assess,row.labels.assess,place,{...target,requires:all(eq(`lotm.${p}.digested`),no(f('assessed')),no(f('promoted')),attn),costs:[attention(-1,officer)],
   effects:[af(f('assessed')),...(row.exam?.legacyRelease?[af(f('exam.required'))]:[]),...(row.exam?[]:[item('player',K[h.next],1)]),knowRow(row,'assess')]}),
  ...(row.exam&&!row.exam.legacyRelease?[cmd(row.exam.id,row.exam.askLabel,place,{targetId:row.exam.examinerId,alone:true,visibleWhen:all(eq('lotm.enrolled'),has(f('assessed')),no(f('examined'))),
   requires:all(has(f('assessed')),no(f('examined')),no(f('promoted')),eq(`lotm.${p}.waited`),gte(`lotm.attention.${row.exam.examinerId}`,1)),duration:row.exam.minutes,cancellation:'forfeit',
   costs:[attention(-1,row.exam.examinerId)],effects:[af(f('examined')),item('player',K[h.next],1),knowRow(row,'exam')]})]:[]),
  cmd(row.ids.promote,row.labels.promote,place,{...target,requires:all(...(row.exam?.legacyRelease?[eq(`lotm.exam.${p}.released`)]:[has(f(row.exam?'examined':'assessed'))]),no(f('promoted')),eq(`lotm.${p}.digested`),eq(supported),gte(`lotm.holds.${h.next}`,1),eq(`lotm.block.${row.pid}.wrongPotion`,false)),costs:[item('player',K[h.next],-1)],
   effects:[grant(row.nextSource),af(f('promoted')),knowRow(row,'promote','understood')]})];
}
export const pathwayFlags=row=>['allocated','ingested','stabilized','assessed','promoted',...(row.exam?['examined',...(row.exam.legacyRelease?['exam.required']:[])]:[]),...row.acts.filter(a=>a.flag).map(a=>a.flag)].map(n=>flagOf(row,n));
export const pathwaySources=row=>[['base',row.base],['next',row.nextSource]].map(([w,id])=>({id,revision:1,label:row.sources[w].label,kind:'trait',origin:'acquired',grants:[],bioDetail:row.sources[w].bioDetail,...(row.sources[w].look?{look:row.sources[w].look}:{})}));
export const pathwayItems=row=>row.items||[];
// Facts: support, acting count, digestion and the held doses. Seer's own are emitted in actions.js.
export function pathwayFacts(row,state,f,{inv,flag}){
 const s=state.simulation||{},p=s.people?.player,a=state.actors?.player,k=row.key;
 const enrolled=f['lotm.enrolled'],src=a?.sources?.[row.base],fac=s.faculties?.player?.[row.base];
 f[`lotm.${k}Supported`]=enrolled&&!!src&&(src.expiresAt==null||src.expiresAt>state.clock)&&fac?.awakened===true&&fac.active===true&&!fac.suppressed;
 const n=a?.resources?.[`book.lotm.${k}.acting`]||0;
 f[`lotm.${k}.acting`]=n;f[`lotm.${k}.digested`]=n>=row.digest;
 if(row.exam)examFacts(row,state,f);
 f[`lotm.holds.${row.holds.base}`]=inv[K[row.holds.base]]||0;f[`lotm.holds.${row.holds.next}`]=inv[K[row.holds.next]]||0;
}
// State assertions for a non-Seer row, mirroring the Seer's: a source needs its recorded ingestion, acting stays within the count, and so on.
export function pathwayAssertions(row,{a,has,assert,natural}){
 const f=n=>flagOf(row,n),src=a.player.sources?.[row.base],nxt=a.player.sources?.[row.nextSource],n=a.player.resources?.[`book.lotm.${row.key}.acting`],name=row.potion;
 assert(!has(f('ingested'))||has(f('allocated'))&&!!src&&has(f('stabilized')),`A ${name} source needs its allocation and recorded ingestion.`);
 assert(!src||has(f('ingested')),`A ${name} source needs its recorded ingestion.`);
 assert(n===undefined||natural(n)&&n<=row.digest&&has(f('ingested')),`Acting as a ${name} needs the source and stays within the digestion count.`);
 for(const act of row.acts.filter(x=>x.flag))assert(!has(f(act.flag))||has(f('ingested')),`A ${act.flag} needs the ${name} source.`);
 assert(!has(f('assessed'))||n===row.digest,`A ${name} assessment needs a digested potion.`);
 assert(!row.exam?.legacyRelease||!has(f('exam.required'))||has(f('assessed')),`An exam requirement needs its pre-screen.`);
 assert(!row.exam||!has(f('examined'))||has(f('assessed')),`An examination needs the pre-screen.`);
 assert(!has(f('promoted'))||((row.exam?.legacyRelease?has(f('assessed'))&&(!has(f('exam.required'))||has(f('examined'))):has(f(row.exam?'examined':'assessed')))||causeHeld(has,'skip'))&&!!src,`A ${row.next} promotion needs the assessment and the ${name} source.`);
 assert(!!nxt===has(f('promoted')),`The ${row.next} source exists exactly when the promotion is recorded.`);
}
// Dose accounting for the save envelope: only the allocated and assessed windows hold a dose.
export function pathwayDoses(row,{count,reserved,state,f,assert}){
 const own=name=>count('main_character',K[name])+count(row.officerId||I.supervisor,K[name])+(row.officerId&&row.officerId!==I.supervisor?count(I.supervisor,K[name]):0)+reserved(state,K[name]);
 const g=n=>f[`book.lotm.${flagOf(row,n)}`]===true;
 assert(own(row.holds.base)===(g('allocated')&&!g('ingested')?1:0),`The allocated ${row.potion} dose must be held exactly once until it is taken.`);
 assert(own(row.holds.next)===((row.exam?.legacyRelease?g('assessed')&&(!g('exam.required')||g('examined')):g(row.exam?'examined':'assessed'))&&!g('promoted')?1:0),`The released ${row.next} dose must be held exactly once until it is drunk.`);
}
export function pathwayDescriptor(row){
 const t=row.potion,o=row.prescreener||'Warden Hale',h=row.holds;
 return definePath({id:`lotm.${row.slug||row.key}`,world:I.world,label:`${t} pathway`,shape:'ladder',stages:[
  {id:'ordinary',label:'Ordinary clerk',crossings:[],grants:['No Beyonder source']},
  {id:'seq9',label:`Sequence 9 · ${t}`,crossings:[{id:`${row.key}_dose`,type:'ingest',label:`Hold the allocated ${t} dose, then drink it${row.ladder.ingestNote||''}`,fact:'heldBase',need:true,irreversible:true}],grants:row.ladder.s9},
  {id:'seq8',label:`Sequence 8 · ${row.next}`,crossings:[
   {id:'acting',type:'digest',label:`Acts performed in the ${t} role`,fact:'acting',need:row.digest},
   {id:'assessment',type:'recognition',label:`${o} assesses the digestion`,fact:'assessed',need:true},
   ...(row.exam?[{id:'exam',type:'trial',label:row.exam.label,fact:'examined',need:true}]:[]),
   {id:`${row.next.toLowerCase().replace(/[^a-z]+/g,'_')}_dose`,type:'ingest',label:`Hold the released ${row.next} dose, then drink it`,fact:'heldNext',need:true,irreversible:true}],
   grants:row.ladder.s8,failure:row.ladder.failure},
  {id:'seq7',label:'Sequence 7',crossings:[{id:'unknown',type:'ingest',label:'Not offered in this slice',fact:'never',need:true}],grants:[]}]});
}
const SETTLE=['unsettled','settling','settled'];
const descriptors=new Map();const descriptor=row=>{if(!descriptors.has(row.key))descriptors.set(row.key,pathwayDescriptor(row));return descriptors.get(row.key);};
export const rowDescriptor=descriptor;
export function pathwayView(row,f,flag){
 const k=row.key,position=flag(flagOf(row,'promoted'))?2:flag(flagOf(row,'ingested'))?1:0;
 const facts={heldBase:(f[`lotm.holds.${row.holds.base}`]||0)>0,acting:f[`lotm.${k}.acting`]||0,assessed:flag(flagOf(row,'assessed')),examined:flag(flagOf(row,'examined'))||row.exam?.legacyRelease&&flag(flagOf(row,'assessed'))&&!flag(flagOf(row,'exam.required')),heldNext:(f[`lotm.holds.${row.holds.next}`]||0)>0};
 const v=pathView(descriptor(row),position,facts,{known:3,ceiling:2});
 const felt=position!==1?null:f[`lotm.${k}.digested`]?SETTLE[2]:(f[`lotm.${k}.acting`]||0)>0?SETTLE[1]:SETTLE[0];
 const historical=row.exam?.legacyRelease&&flag(flagOf(row,'assessed'))&&!flag(flagOf(row,'exam.required'));
 return {...v,crossings:v.crossings.map(c=>historical&&c.id==='exam'?{...c,label:'Historical promotion-dose release retained'}:c),felt,potion:row.potion};
}

// Q6: successor exams share data-driven role, presence and completion requirements. Original
// timed definitions above remain available to load admitted jobs, but their old wait fact is
// false for new admission. No saved job is rewritten and no historical release is revoked.
export function examFacts(row,state,f){
 const e=row.exam,k=row.key,people=state.simulation?.people||{},person=people[e.examinerId],player=people.player;
 const role=lotmRoleOf(state,e.examinerId);
 const supported=!!state.lotm&&state.actors?.[e.examinerId]?.worldId===I.world&&person?.life==='alive'&&person.body?.form==='human'&&person.body.mobile===true&&(person.body.hands??0)>=2&&person.location===player?.location&&role===e.role;
 const ingestKey=row.know.ingest[0],note=state.simulation?.knowledge?.player?.[`book.lotm.${ingestKey}`];
 f[`lotm.exam.${k}.supported`]=supported;
 f[`lotm.exam.${k}.waited`]=!!note&&state.clock-note.at>=e.waitMinutes;
 f[`lotm.${k}.waited`]=false; // old command ids are retained for jobs, not newly admitted
 const flag=n=>state.actors?.player?.facts?.[`book.lotm.${flagOf(row,n)}`]===true;
 f[`lotm.exam.${k}.released`]=flag('assessed')&&(flag('examined')||e.legacyRelease&&!flag('exam.required'));
}
export function examinationCommand(row){
 const e=row.exam,f=n=>flagOf(row,n),k=row.key;
 const support=eq(`lotm.exam.${k}.supported`);support.reason='The appointed senior deacon must be alive, able to examine, and here in this world with that role.';
 const command=cmd(e.currentId||e.id,`${e.askLabel} · interruption returns reserved attention`,row.place||L.workroom,{targetId:e.examinerId,alone:true,
  visibleWhen:all(eq('lotm.enrolled'),has(f('assessed')),no(f('examined')),...(e.legacyRelease?[has(f('exam.required'))]:[])),
  requires:all(has(f('assessed')),no(f('examined')),no(f('promoted')),support,eq(`lotm.exam.${k}.waited`),gte(`lotm.attention.${e.examinerId}`,1)),
  duration:e.minutes,cancellation:'refund',completionRequires:all(support,eq(row.supported||`lotm.${k}Supported`),eq(row.digestedFact||`lotm.${k}.digested`),has(f('assessed')),no(f('promoted'))),completionCoLocated:true,completionFailure:'refund',
  costs:[attention(-1,e.examinerId)],effects:[af(f('examined')),item('player',K[row.holds.next],1),knowRow(row,'exam')]});
 command.requires.reason='Finish digestion and the local pre-screen, then meet the appointed senior deacon here with attention available. The examiner must still hold that role.';
 return command;
}
