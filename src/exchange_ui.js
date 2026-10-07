import {previewSimulationCommand} from './simulation.js';
import {exchangeContext,exchangeView} from './exchange.js';
import {EXCHANGE_CLERK,EXCHANGE_ITEMS,EXCHANGE_SITUATION} from './exchange_content.js';
const node=(tag,text='')=>{const n=document.createElement(tag);n.textContent=text;return n;};
export function createExchangePanel({registry,read,command}) {
 const panel=node('details');panel.id='exchange_panel';panel.className='expedition_panel';const summary=node('summary','A clerk with a damp parcel'),intro=node('p'),records=node('div'),stock=node('p'),status=node('p');status.setAttribute('role','status');panel.append(summary,intro,records,stock,status);
 const controls=new Map();let message='',signature='';
 const run=c=>{try{const snap=read(),job=snap.state.simulation?.jobs.find(j=>j.actorId==='player'&&j.commandId.startsWith('exchange.'));command({...c,jobId:job?.id,sequence:snap.state.sequence});message=c.type==='cancel'?'Reserved work inputs returned. The order remains yours unless you withdraw.':'Progress saved.';}catch(e){message=e.message;}render();};
 for(const d of registry.simulation.commands.values())if(d.group==='exchange') {
  const row=node('div'),button=node('button',d.label),reason=node('p');row.className='expedition_card';button.type='button';button.dataset.exchange=d.id;button.addEventListener('click',()=>run({type:'command',id:d.id,targetId:d.targetId}));row.append(button,reason);panel.append(row);controls.set(d.id,{row,button,reason});
 }
 const cancel=node('button','Cancel reserved work · inputs return');cancel.type='button';cancel.dataset.exchange='cancel';cancel.addEventListener('click',()=>run({type:'cancel'}));panel.append(cancel);
 function render(){
  const focused=document.activeElement,snap=read(),{state,error,canWrite}=snap,context=exchangeContext(state,snap.context),view=exchangeView(state),s=state.simulation,job=s?.jobs.find(j=>j.actorId==='player'&&j.commandId.startsWith('exchange.'));
  panel.hidden=snap.inDialogue||snap.inCombat||!view.introduced&&!context.facts['village.elderMet']||context.facts.location!=='Village'&&!job;
  const situation=s?.situations?.[EXCHANGE_SITUATION];
  intro.textContent=situation?.phase==='offered'?`Iona can wait ${Math.max(0,situation.deadline-state.clock)} played minutes before funding her own parcel. Asking accepts no order.`:view.introduced?'Purchases, tool loans, accepted work and later reports have separate terms.':'A visiting clerk turns a damp wooden blank under a small clamp. Speaking accepts no work.';
  const next=JSON.stringify(view.details);if(next!==signature){signature=next;records.replaceChildren(...view.details.map(r=>node('p',(r.basis?.kind==='instruction'?'Taught pattern: ':'Observed or reported: ')+r.text)));}
  const offered=s?.owners[EXCHANGE_CLERK];stock.hidden=!view.introduced||context.facts.location!=='Village'||!context.facts['exchange.clerkWilling'];
  stock.textContent=offered?`Iona's offered stock: ${offered[EXCHANGE_ITEMS['Wet seal blank']]||0} damp blanks; ${offered[EXCHANGE_ITEMS['Sound seal blank']]||0} sound blanks. Stock stays spent on later visits.`:'';
  for(const [id,c] of controls){
   const d=registry.simulation.commands.get(id);let preview;
   try{preview=s?previewSimulationCommand(state,registry,id,{...context,targetId:d.targetId||null}):id==='exchange.begin'?{visible:true,eligible:!context.busy,reasons:[]}:null;}catch(e){preview={visible:false,reasons:[e.message]};}
   c.row.hidden=id==='exchange.begin'?view.introduced:!view.introduced||!preview?.visible||!!(d.once&&state.actors.player.completed[id]);
   c.button.disabled=!canWrite||!!error||!preview?.eligible;c.reason.textContent=c.row.hidden||!c.button.disabled?'':error||preview?.reasons.join(' ')||'Finish your current activity first.';c.reason.hidden=!c.reason.textContent;
   if(c.row.hidden&&focused===c.button)summary.focus();
  }
  status.textContent=error||(job?`${job.label} · ${Math.max(0,job.due-state.clock)} played minutes remain. Cancel returns its reserved inputs.`:message);status.hidden=!status.textContent;
  cancel.hidden=!job;cancel.disabled=!canWrite||!!error;if(cancel.hidden&&focused===cancel)summary.focus();
 }
 document.getElementById('location_actions_div')?.append(panel);render();return {render};
}
