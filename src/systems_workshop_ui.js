import {previewSimulationCommand} from './simulation.js';
import {SW,SWK,APPRENTICE} from './systems_workshop_content.js';
const node=(tag,text)=>{const n=document.createElement(tag);if(text)n.textContent=text;return n;};
export function createSystemsWorkshopPanel({read,act,parent,registry}) {
 const panel=node('details');panel.id='systems_workshop_panel';panel.className='expedition_panel';
 panel.append(node('summary','Iona’s work ledger · systems and workshop'));const body=node('div'),intro=node('p'),status=node('p'),notice=node('p'),controls=node('div'),records=node('details'),recordBody=node('div');records.append(node('summary','Terms and observed workshop records'),recordBody);panel.append(body);body.append(intro,status,notice,records,controls);
 intro.textContent='Original local prototype. Earn authority-backed points through real work, keep permanent learning, or lease guidance. Optional workshop chance and a represented irrigation experiment share your actual inventory. Only played time advances work.';
 let message='',sig='';
 const run=id=>{const r=read();try{act({id,sequence:r.state.sequence});message='Progress saved.';}catch(e){message=e.message;}sig='';render();};
 const buttons=new Map();const add=(id,label)=>{const b=node('button',label);b.type='button';b.dataset.systems=id;b.addEventListener('click',()=>run(id));controls.append(b);buttons.set(id,b);};
 add('enroll','Follow local people and work');
 for(const d of registry.simulation.commands.values())if(d.group===SW&&!d.id.includes('.settle_')&&!d.id.includes('.apply_model_'))add(d.id,d.label);
 add('continue','Continue sealed draw · settle once');add('apply_model','Apply tested routing · log → real fittings · 2 min');add('cancel','Cancel reserved workshop job · return inputs');
 parent.append(panel);
 function render(){
  const r=read(),{state,context}=r,f=state.actors.player.facts,s=state.simulation;
  if(panel.parentElement!==parent)parent.append(panel);
  panel.hidden=state.actors.player.worldId!=='base.frontier'||context.facts.location!=='Village'||r.inDialogue||r.inCombat;
  const data=[state.sequence,state.clock,r.enabled,r.error,context.busy,r.inDialogue,r.inCombat];const next=JSON.stringify(data);if(next===sig)return;sig=next;
  notice.textContent=message||r.error||'';
  recordBody.replaceChildren();for(const [id,k] of Object.entries(s?.knowledge.player||{}))if(id.startsWith(SW+'.'))recordBody.append(node('p',k.value));
  const own=r.context.gameplay?.player.inventory||{},points=state.actors.player.resources[SW+'.points']||0,ren=state.actors[APPRENTICE];
  status.textContent=!s?'Following creates no past history.':f[SW+'.joined']?
   `${s.titles.player?.[SW+'.commissioner']?'Iona recognizes you as a proven ledger craftsperson. ':''}Points ${points}. Ledger ${f[SW+'.connected']?'connected':'disconnected'}. Permanent method ${f[SW+'.learned']?'learned':'unlearned'}. Assistance ${state.actors.player.sources[SW+'.assist']?'leased':'absent'}. Module ${f[SW+'.upgraded']?'parcel guidance':'preparation'}. Sealed draw ${f[SW+'.round']==='open'?'awaits your fold or continue decision':f[SW+'.round']||'not entered'}. `+
   (f[SW+'.modeled']?`Represented model v1: ${f[SW+'.modelLayout']}, inlet ${f[SW+'.modelInlet']}, harvest ${f[SW+'.modelHarvest']} (represented only); recommended ${f[SW+'.modelBest']}. `:'')+
   (ren?.facts[SW+'.taught']?`Ren has learned your method; ${s.owners[APPRENTICE]?.[SWK.kit]||0} own finished kits await trade. `:'')+
   `Your carried stock: ${Object.entries(SWK).filter(([,k])=>own[k]).map(([name,k])=>name+' '+own[k]).join(', ')||'none'}. `+
   (s.jobs.find(j=>j.actorId==='player'&&j.commandId.startsWith(SW+'.'))?.label||'No reserved workshop job.'):'Meet Iona to hear exact grant and work terms.';
  for(const [id,b] of buttons){
   if(id==='enroll'){b.hidden=!!s;b.disabled=!r.enabled||!!context.busy;continue;}
   if(id==='cancel'){const j=s?.jobs.find(j=>j.actorId==='player'&&j.commandId.startsWith(SW+'.'));b.hidden=!j;b.disabled=!r.enabled;continue;}
   if(!s){b.hidden=true;continue;}
   const actual=id==='continue'?SW+'.settle_'+f[SW+'.draw']:id==='apply_model'?SW+'.apply_model_'+(f[SW+'.modelLayout']===f[SW+'.modelBest']?'recommended':'trial'):id;
   const d=registry.simulation.commands.get(actual);
   if(!d){b.hidden=true;continue;}
   const p=previewSimulationCommand(state,registry,actual,{...context,targetId:d.targetId||null});
   b.hidden=!p.visible||!!(d.once&&state.actors.player.completed[actual])||!!(d.claim&&s.claims[d.claim])||id==='continue'&&f[SW+'.round']!=='open';
   b.disabled=!r.enabled||!p.eligible;b.title=p.reasons.join(' ');
  }
 }
 render();return {render};
}
