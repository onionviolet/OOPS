import {previewSimulationCommand} from './simulation.js';
import {observationView,LENS} from './observation_content.js';
import {exchangeContext} from './exchange.js';
const node=(tag,text='')=>{const n=document.createElement(tag);n.textContent=text;return n;};
export function createObservationPanel({registry,read,command}){
 const panel=node('details');panel.id='observation_panel';panel.className='expedition_panel';const summary=node('summary','The glass answers back'),intro=node('p'),records=node('div'),status=node('p');status.setAttribute('role','status');panel.append(summary,intro,records,status);
 let message='',signature='';const controls=new Map();
 const run=c=>{try{const snap=read();command({...c,sequence:snap.state.sequence});message=c.id==='observation.replay'?'You read the stored impression. No live sampling or new detection occurred.':'Progress saved.';}catch(e){message=e.message;}render();};
 const open=node('button','Look through the paired glass · anonymous live view');open.type='button';open.dataset.observation='open';open.addEventListener('click',()=>run({type:'open'}));panel.append(open);
 for(const d of registry.simulation.commands.values())if(d.actorId==='player'&&d.group==='observation'&&!['observation.prepare','observation.open'].includes(d.id)){
  const row=node('div'),b=node('button',d.label),reason=node('p');row.className='expedition_card';b.type='button';b.dataset.observation=d.id;b.addEventListener('click',()=>run({type:'command',id:d.id,targetId:d.targetId}));row.append(b,reason);panel.append(row);controls.set(d.id,{row,b,reason});
 }
 function render(){const focused=document.activeElement,snap=read(),{state,error,canWrite}=snap,base=exchangeContext(state,snap.context),context={...base,facts:{...base.facts,'observation.handsUsable':base.facts['exchange.handsUsable']}},view=observationView(state);
  panel.hidden=!state.simulation?.knowledge.player?.['exchange.lens_lead']||snap.inDialogue||snap.inCombat||context.facts.location!=='Village';
  intro.textContent=['open','answered'].includes(view.phase)?`The live image has ${Math.max(0,view.deadline-state.clock)} played minutes before the preset shutter. Pictures and messages can return; a body cannot pass through this instrument.`:view.introduced?'The same visitor and his possessions persist after the stream closes. Reading old impressions is separate from sampling him now.':'Iona pointed out a public viewing instrument. A visitor behind a screen sometimes writes into its image.';
  const next=JSON.stringify(view.details);if(next!==signature){signature=next;records.replaceChildren(...view.details.map(r=>node('p',r.text)));}
  open.hidden=view.introduced;open.disabled=!canWrite||!!error||!!context.busy;if(open.hidden&&focused===open)summary.focus();
  for(const [id,c] of controls){let preview;try{preview=state.simulation?previewSimulationCommand(state,registry,id,{...context,targetId:registry.simulation.commands.get(id).targetId||null}):null;}catch(e){preview={visible:false,reasons:[e.message]};}
   c.row.hidden=!view.introduced||!preview?.visible||!!(registry.simulation.commands.get(id).once&&state.actors.player.completed[id]);c.b.disabled=!canWrite||!!error||!preview?.eligible;
   c.reason.textContent=c.row.hidden||!c.b.disabled?'':error||preview?.reasons.join(' ')||'This viewing action is unavailable.';c.reason.hidden=!c.reason.textContent;if(c.row.hidden&&focused===c.b)summary.focus();}
  status.textContent=error||message;status.hidden=!status.textContent;
 }
 document.getElementById('location_actions_div')?.append(panel);render();return {render};
}
