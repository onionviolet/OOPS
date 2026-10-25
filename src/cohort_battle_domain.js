import {cohortFieldRoutes,quoteCohortField} from './cohort_field.js';
import {bookTempering,temperingTerms} from './cohort_tempering.js';
import {bookCohortGear} from './cohort_gear.js';
import {cohortFramePreview} from './cohort_gear_facts.js';
import {drainageRoom} from './drainage_layout.js';
import {registerDomain,domainRegistry} from './domain_registry.js';
import {definePanel} from './panel_kit.js';
import {residenceState} from './home_domain.js';
import {ensureHomeSimulation,stageHomeJob,previewHomeJob} from './home_work.js';
import {commitSimulationCommand,previewSimulationCommand} from './simulation.js';
import {initializeCohortBattle,quoteCohortAdmission} from './cohort_battle.js';
import {COHORT_MEMBERS,COHORT_COACHES,COHORT_ROOM} from './cohort_battle_facts.js';
let ports,panel,selection=new Set(),frontline='player';
export const configureCohort=operations=>{ports=operations;};
function context(){
 const root=ports.root(),body=ports.body(),v=ports.actor().getFullStats();
 return {labels:Object.fromEntries([...COHORT_MEMBERS,...COHORT_COACHES].map(id=>[id,ports.registry.simulation.people.get(id)?.label||'Participant'])),actorId:'player',worldId:'base.frontier',location:ports.location(),facts:{location:ports.location()},body,manorAccess:!!residenceState()?.properties.manor?.access,
  ready:ports.idle()&&ports.writable()&&!ports.blocked()&&ports.actor().is_alive&&body.ownerId==='player'&&body.controllerId==='player'&&body.form==='human'&&(body.hands||0)>=2,
  external:{money:ports.actor().money},vitals:{player:{health:v.health,max_health:v.max_health,stamina:v.stamina,max_stamina:v.max_stamina}},paidHelpReason:domainRegistry.command('pledges','actionReason')?.({kind:'paid-help'})||'',root};
}
function draft(c){
 const p=ports.plan(0);ensureHomeSimulation(p,c.location,c.body);
 // Old household members have no combat-training counter; zero is absence of learning.
 for(const id of COHORT_MEMBERS)if(p.state.actors[id])p.state.actors[id].resources['cohort.training']??=0;
 return p;
}
function jobContext(c,p,actor){return {...c,gameplay:p.gameplay,external:p.external,actorId:actor,facts:{location:c.location,'cohort.recoveryReady':true}};}
function quote(request){
 try{
  const c=context();if(request.type==='field')return quoteCohortField(c.root,request,c);if(request.type==='cancel'){const j=c.root.simulation?.jobs.find(j=>j.id===request.job&&j.commandId.startsWith('cohort.'));if(!j||!c.ready||c.root.simulation.people[j.actorId]?.location!==c.location)throw Error('Meet the free actual appointment here to cancel its reservation.');return {eligible:true,reason:''};}if(!c.manorAccess||c.location!==COHORT_ROOM||c.root.actors.player.worldId!=='base.frontier')throw Error('Meet the willing household cohort at the actual manor.');
  if(request.type==='resume')return {eligible:c.root.simulation?.sessions.player?.nativeBattle?.schema===6&&ports.writable()&&!ports.cohortBattle.running(),reason:''};
  if(!c.ready)throw Error('Use your free supported body in the writable manor.');
  if(c.paidHelpReason)throw Error(c.paidHelpReason);
  const p=draft(c),common={...c,gameplay:p.gameplay,external:p.external};
  if(request.type==='enroll'){
   const q=previewSimulationCommand(p.state,ports.registry,'cohort.enroll',{...common,facts:{location:c.location,'cohort.manorAccess':c.manorAccess,'cohort.freeBody':c.ready}});if(!q.eligible)throw Error(q.reasons.join(' '));
  }else if(request.type==='start'){
   const q=quoteCohortAdmission(p.state,request.members,{...common,frontlineId:request.frontline||'player'});if(!q.eligible)throw Error(q.reasons.join(' '));
  }else if(request.type==='gear'){
   const q=bookCohortGear(p,ports.registry,c,request.actor,request.kind,{preview:true});if(!q.eligible)throw Error(q.reasons.join(' '));
  }else if(request.type==='job'){
   if(!COHORT_MEMBERS.includes(request.actor)&&!COHORT_COACHES.includes(request.actor))throw Error('Choose a known actual participant.');
   const person=p.state.simulation?.people[request.actor],actor=p.state.actors[request.actor];if(!person||person.life!=='alive'||person.location!==COHORT_ROOM)throw Error('Meet the living patient or student here.');
   if(COHORT_MEMBERS.includes(request.actor)&&(!actor.facts['home.employed']||actor.facts['home.leave']))throw Error('This member must willingly be at household work.');
   if(request.kind==='recover'&&!person.vitals)throw Error('Complete physical instruction before assessing this body’s vital recovery.');
   if(request.kind==='recover'&&person.vitals.health>=person.vitals.max_health&&person.vitals.stamina>=person.vitals.max_stamina)throw Error('This body needs no vital recovery.');
   if(request.kind==='temper'){const q=bookTempering(p,ports.registry,c,request.actor,!!request.insured,{preview:true});if(!q.eligible)throw Error(q.reasons.join(' '));return {eligible:true,reason:''};}
   if(!['train','recover','calm'].includes(request.kind))throw Error('Choose instruction, tempering or actual recovery.');
   const q=previewHomeJob(p,{id:'cohort.'+request.kind+'.'+request.actor,actor:request.actor},ports.registry,jobContext(c,p,request.actor));if(!q.eligible)throw Error(q.reasons.join(' '));
  }else if(request.type==='cancel'){
   const j=p.state.simulation?.jobs.find(j=>j.id===request.job&&j.commandId.startsWith('cohort.'));if(!j)throw Error('The actual cohort appointment changed.');
  }else throw Error('Choose a known cohort action.');
  return {eligible:true,reason:''};
 }catch(e){return {eligible:false,reason:e.message};}
}
function run(request){
 const q=quote(request);if(!q.eligible)throw Error(q.reason);const c=context();
 if(request.type==='resume'){ports.cohortBattle.resume();return;}
 let p=draft(c),common={...c,gameplay:p.gameplay,external:p.external};
 if(request.type==='field'){const leg=quoteCohortField(p.state,request,c);stageHomeJob(p,{id:leg.id,actor:request.actor},ports.registry,{...c,facts:{'cohort.fieldReady':true}});}
 else if(request.type==='enroll')p=commitSimulationCommand(p.state,ports.registry,{id:'cohort.enroll'},{...common,facts:{location:c.location,'cohort.manorAccess':true,'cohort.freeBody':true}},p.state.sequence);
 else if(request.type==='start')p=initializeCohortBattle(p.state,ports.registry,request.members,{...common,frontlineId:request.frontline||'player'});
 else if(request.type==='gear')bookCohortGear(p,ports.registry,c,request.actor,request.kind);
 else if(request.type==='job'){if(request.kind==='temper')bookTempering(p,ports.registry,c,request.actor,!!request.insured);else stageHomeJob(p,{id:'cohort.'+request.kind+'.'+request.actor,actor:request.actor},ports.registry,jobContext(c,p,request.actor));}
 else if(request.type==='cancel'){const j=p.state.simulation.jobs.find(j=>j.id===request.job);stageHomeJob(p,{cancel:j.id,actor:j.actorId},ports.registry,jobContext(c,p,j.actorId));}
 ports.commit(p);if(request.type==='start')ports.cohortBattle.resume();panel?.render();
}
function view(){
 if(!ports)return {visible:false};const c=context(),s=c.root,session=s.simulation?.sessions.player,b=session?.nativeBattle;
 return {visible:c.manorAccess&&(c.location===COHORT_ROOM||c.location==='Village'||drainageRoom(c.location)!==null)&&s.actors.player.worldId==='base.frontier',atManor:c.location===COHORT_ROOM,fieldRoutes:cohortFieldRoutes(s,c.location).map(r=>({to:r.to,minutes:r.minutes,label:ports.locations[r.to]?.name||'Observed passage'})),met:s.actors.player.facts['cohort.met']===true,
  members:COHORT_MEMBERS.filter(id=>s.simulation?.people[id]).map(id=>({id,label:ports.registry.simulation.people.get(id)?.label||'Household member',rank:s.actors[id].resources['home.schoolRank']||0,training:s.actors[id].resources['cohort.training']||0,here:s.simulation.people[id].location===c.location,willing:!!s.actors[id].facts['cohort.willing'],energy:s.simulation.people[id].location===c.location?s.actors[id].resources['home.energy']||0:null,vitals:s.simulation.people[id].location===c.location&&s.simulation.people[id].vitals?{...s.simulation.people[id].vitals}:null,exercises:s.actors[id].completed['cohort.start']||0,wins:s.actors[id].resources['cohort.wins']||0})),
  tempering:Object.fromEntries(COHORT_MEMBERS.filter(id=>s.simulation?.people[id]?.location===c.location).map(id=>[id,temperingTerms(s,id)])),
  gear:Object.fromEntries(COHORT_MEMBERS.filter(id=>s.simulation?.people[id]?.location===c.location).map(id=>[id,cohortFramePreview(s,id)])),
  coaches:COHORT_COACHES.filter(id=>s.simulation?.people[id]?.location===c.location).map(id=>({id,label:ports.registry.simulation.people.get(id).label,vitals:{...s.simulation.people[id].vitals},coins:s.actors[id].resources.coins})),
  jobs:(s.simulation?.jobs||[]).filter(j=>j.commandId.startsWith('cohort.')&&s.simulation.people[j.actorId]?.location===c.location).map(j=>({id:j.id,label:ports.registry.simulation.commands.get(j.commandId)?.label||j.label,left:Math.max(0,j.due-s.clock)})),battle:b?.schema===6?ports.cohortBattle.view():null,running:ports.cohortBattle.running(),last:s.actors.player.facts['cohort.lastOutcome']||null};
}
function mount(){
 const root=document.createElement('section');root.id='cohort_battle_panel';root.className='expedition_panel';const heading=document.createElement('h2'),body=document.createElement('div'),notice=document.createElement('p'),arena=document.createElement('section'),attackers=document.createElement('div'),defenders=document.createElement('div');heading.textContent='Household field-forms cohort';notice.setAttribute('role','status');attackers.id='cohort_attackers';defenders.id='cohort_defenders';arena.append(attackers,defenders);root.append(heading,body,arena,notice);
 const n=(tag,text)=>{const e=document.createElement(tag);e.textContent=text;return e;};let signature='';
 const render=()=>{if(!root.isConnected)return;const v=view(),sig=JSON.stringify([v,[...selection],frontline]);if(sig===signature)return;signature=sig;body.replaceChildren();arena.hidden=!v.battle;if(!v.visible)return;
  const action=(label,request,id,parent=body)=>{const q=quote(request),b=n('button',label);b.type='button';b.dataset.cohortAction=id;b.disabled=!q.eligible;b.title=q.reason;b.onclick=()=>{try{run(request);notice.textContent='The actual cohort action is saved.';}catch(e){notice.textContent=e.message;}signature='';render();};parent.append(b);};
  heading.textContent=v.atManor?'Household field-forms cohort':'Household survey companions';
  if(v.atManor){body.append(n('p','Paid group practice uses each participant’s health, stamina and gear. Admission costs two personal coins. Wounds and spent fees remain after withdrawal.'));const terms=n('details','');terms.append(n('summary','Instruction and admission terms'),n('p','Lend two owned survey kits when meeting the instructors. A qualified member needs thirty minutes of instruction, twenty work effort and four estate coins. Training supports at least twenty health and twelve stamina capacity without filling either. Rest with one carried bread before the first bout. Admitted instruction adds two attack power; a bout spends ten work effort per member and pays one coin to each instructor.'));body.append(terms);}
  body.append(n('p','Survey travel costs one personal coin and one companion stamina per adjacent leg. Meet a trained, willing member here to give directions. They travel on their own schedule; travel there yourself to meet them. Return to the manor for household work. Meet in person to assess a companion’s condition.'));
  if(v.met)for(const m of v.members.filter(m=>m.here))for(const r of v.fieldRoutes)action('Book '+m.label+' travel toward '+r.label+' · '+r.minutes+' min, 1 coin, 1 companion stamina',{type:'field',actor:m.id,to:r.to},'field:'+m.id+':'+r.to);
  for(const j of v.jobs){body.append(n('p',`${j.label}: ${j.left} played minutes remain.`));action('Cancel this actual appointment',{type:'cancel',job:j.id},'cancel:'+j.id);}
  if(!v.atManor){for(const m of v.members.filter(m=>m.here))body.append(n('p',m.label+': '+(m.vitals?'health '+m.vitals.health+'/'+m.vitals.max_health+', stamina '+m.vitals.stamina+'/'+m.vitals.max_stamina:'no assessed vital capacity')+'.'));return;}
  if(!v.met){action('Meet the field-forms instructors · 2 actual survey kits',{type:'enroll'},'enroll');return;}
  if(v.battle){const lead=v.battle.admission.frontline,holding=lead&&v.battle.fighters.some(f=>f.id===lead&&f.status==='active')?v.members.find(m=>m.id===lead)?.label:'You';body.append(n('p','Front participant: '+holding+'. If the selected member yields or leaves, you take the front.'),n('p',v.battle.last));if(!v.running)action('Resume this actual native exercise',{type:'resume'},'resume');let guardTests;for(const a of v.battle.actions){let host=body;if(a.group==='guard-test'){if(!guardTests){guardTests=n('details','');guardTests.append(n('summary','Ask an instructor to test a guard'),n('p','Each request resolves an actual strike in this paid exercise, spending the instructor’s own stamina and causing real nonlethal wounds or a block. Automatic exchanges continue.'));body.append(guardTests);}host=guardTests;}const b=n('button',a.label);b.type='button';b.dataset.cohortFight=a.command.type+':'+a.command.actorId+':'+(a.command.targetId||'');b.disabled=!a.eligible;b.title=a.reasons.join(' ');b.onclick=()=>{try{ports.cohortBattle.act(a.command);}catch(e){notice.textContent=e.message;}signature='';render();};host.append(b);}for(const r of v.battle.receipts.slice(-4))body.append(n('p',r.text));}
  else if(v.last)body.append(n('p','Last resolved exercise: '+v.last+'. Wounds and paid terms remain with their actual owners.'));
  for(const m of v.members){const row=n('details',''),summary=n('summary',m.label);row.append(summary,n('p',`Teaching rank ${m.rank}; combat instruction ${m.training}; ${m.here?'work effort '+m.energy:'away from this meeting'}; ${m.vitals?`health ${m.vitals.health}/${m.vitals.max_health}, stamina ${m.vitals.stamina}/${m.vitals.max_stamina}`:m.here?'vital capacity awaits physical instruction':'meet in person for a current vital assessment'}. Actual exercises ${m.exercises}, wins ${m.wins}.`));body.append(row);const label=n('label','Include in the next cohort '),check=document.createElement('input');check.type='checkbox';check.dataset.cohortMember=m.id;check.checked=selection.has(m.id);check.disabled=!!v.battle;check.onchange=()=>{check.checked?selection.add(m.id):selection.delete(m.id);signature='';render();};label.prepend(check);row.append(label);action('Commission '+m.label+' instruction · 30 min, 4 estate coins',{type:'job',kind:'train',actor:m.id},'train:'+m.id,row);action('Rest and tend '+m.label+' · 30 min, 1 carried bread',{type:'job',kind:'recover',actor:m.id},'recover:'+m.id,row);}
  for(const m of v.members.filter(m=>m.here&&m.training>=1)){const t=v.tempering[m.id],d=n('details','');d.append(n('summary',m.label+' · physical tempering '+t.stage+'/3'),n('p',t.stage>=3?`This local curriculum is complete. Retained setback lessons ${t.learning}; current strain ${t.strain}. Further physical methods need their own instruction.`:`Retained setback lessons ${t.learning}; current strain ${t.strain}. Next lean attempt: ${(t.chance*100).toFixed(1)}% success. Success supports at least ${t.health} health and ${t.stamina} stamina capacity without filling either. Lean failure keeps the current stage, causes two health of soreness and adds one lesson plus one strain. The slower patient route removes this procedure’s failure risk.`));body.append(d);if(t.stage<3)for(const insured of [false,true])action(insured?'Patient tempering · 60 min, 5 bread, 8 estate coins':'Lean tempering · 30 min, 1 bread, 4 estate coins',{type:'job',kind:'temper',actor:m.id,insured},'temper:'+m.id+':'+(insured?'patient':'lean'),d);action('Ease one strain · 30 min, 1 bread, 2 estate coins',{type:'job',kind:'calm',actor:m.id},'calm:'+m.id,d);}
  for(const m of v.members.filter(m=>m.here&&m.training>=1)){const g=v.gear[m.id],d=n('details','');d.dataset.cohortGear=m.id;d.append(n('summary',m.label+' · fitted frame'),n('p',`Owned frames ${g.available}. ${g.active?`Fitted: +${g.defenseBonus} defense, ${(100*g.blockChance).toFixed(0)}% block chance, block strength ${g.blockStrength}.`:`Not active. A supported fit would give +${g.fitted.defenseBonus} defense, ${(100*g.fitted.blockChance).toFixed(0)}% block chance and block strength ${g.fitted.blockStrength}.`} ${g.reason}`));for(const q of g.opponents)d.append(n('p',`${q.id==='cohort.ada'?'Ada':'Bren'} demonstrates an ordinary ${q.attack}-power blow: ${q.currentDamage.toFixed(1)} damage with current armor, ${q.fittedDamage.toFixed(1)} with the fitted frame. This comparison assumes a landed noncritical blow before a possible block; actual exchanges vary.`));body.append(d);action('Build and fit · 30 min, 2 kits, 2 logs, 4 estate coins',{type:'gear',actor:m.id,kind:'build'},'gear:'+m.id+':build',d);action('Fit the existing owned frame · 15 min, 2 estate coins',{type:'gear',actor:m.id,kind:'fit'},'gear:'+m.id+':fit',d);action('Unbuckle and retain the frame · 2 min',{type:'gear',actor:m.id,kind:'park'},'gear:'+m.id+':park',d);}
  for(const m of v.coaches){body.append(n('p',`${m.label}: own purse ${m.coins}; health ${m.vitals.health}/${m.vitals.max_health}, stamina ${m.vitals.stamina}/${m.vitals.max_stamina}.`));action('Rest and tend '+m.label+' · 30 min, 1 carried bread',{type:'job',kind:'recover',actor:m.id},'recover:'+m.id);}
  if(!v.battle){if(!selection.has(frontline))frontline='player';const label=n('label','Front participant '),select=document.createElement('select');select.dataset.cohortFront='';for(const id of ['player',...selection]){const option=n('option',id==='player'?'You (ordinary formation)':v.members.find(m=>m.id===id)?.label||'Known participant');option.value=id;select.append(option);}select.value=frontline;select.onchange=()=>{frontline=select.value;signature='';render();};label.append(select);body.append(label,n('p','The willing front participant receives the instructors’ first attacks. If they yield or leave, you take the front. Wounds and spent stamina remain.'));action('Begin the selected actual cohort · 2 personal coins',{type:'start',members:[...selection],frontline},'start');}
 };
 definePanel({id:'household-cohort',title:'Household cohort',role:'actions',node:root,home:document.getElementById('main_content'),defaultDock:'center',discovered:()=>view().visible,eligible:()=>view().visible});render();return {render};
}
registerDomain({id:'cohort',initialState:()=>null,commands:{quote,execute:run,refresh:()=>panel?.render()},projection:view,refresh:()=>panel?.render(),panels:[()=>panel=mount()]});
