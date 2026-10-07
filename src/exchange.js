import {enrollSimulation,commitSimulationCommand} from './simulation.js';
import {bodyFacts} from './body_progression.js';
import {EXCHANGE_CLERK,EXCHANGE_ITEMS,EXCHANGE_LOAN,EXCHANGE_SITUATION} from './exchange_content.js';
export function exchangeContext(state,context) {
 const inv=context.gameplay?.player?.inventory||{},s=state.simulation,p=s?.people[EXCHANGE_CLERK],loan=s?.custody[EXCHANGE_LOAN],template=EXCHANGE_ITEMS['Sealing template'];
 return {...context,facts:{...context.facts,
  'exchange.handsUsable':(s?.people.player?.body?.hands??2)>=2&&!bodyFacts(state)['body.handsTender'],
  'exchange.clerkWilling':!!p&&p.life==='alive'&&!!state.actors[EXCHANGE_CLERK]?.facts['exchange.willing'],
  'exchange.gaugeAvailable':loan?.owner===EXCHANGE_CLERK&&loan.holder==='player'&&loan.key===EXCHANGE_ITEMS['Parcel gauge']&&inv[loan.key]>=1,
  'exchange.templateAvailable':inv[template]>=1&&!Object.values(s?.custody||{}).some(c=>c.holder==='player'&&c.key===template)}};
}
export function beginExchange(state,registry,context,expectedSequence=state.sequence) {
 if(expectedSequence!==state.sequence)throw Error('This meeting is stale.');
 const p=state.simulation?{state,external:context.external,gameplay:context.gameplay}:enrollSimulation(state,registry,context,expectedSequence);
 const plan=commitSimulationCommand(p.state,registry,{id:'exchange.begin'},exchangeContext(p.state,{...context,external:p.external,gameplay:p.gameplay,targetId:null}));
 plan.state.actors.player.facts['exchange.borrowed']=false;return plan;
}
export function commitExchangeCommand(state,registry,command,context,expectedSequence=state.sequence){return commitSimulationCommand(state,registry,command,exchangeContext(state,context),expectedSequence);}
export function exchangeView(state){const known=state.simulation?.knowledge.player||{};return {introduced:!!known['exchange.meeting'],details:Object.entries(known).filter(([k])=>k.startsWith('exchange.')).map(([key,r])=>({key,text:r.value,at:r.at,basis:r.basis}))};}
export function exchangeQuestView(state){const f=state.actors.player.facts;if(!f['exchange.accepted'])return null;return {name:'A fitted parcel seal',description:'Fit and deliver one sound seal to Iona. Payment: two reserved wooden coins. Return any borrowed gauge before settling; withdrawing releases her payment.',completed:!!(f['exchange.delivered']||f['exchange.withdrawn']),objective:f['exchange.delivered']?'Delivered and paid once. A later meeting can discuss the actual result.':f['exchange.withdrawn']?'Withdrawn; purchases and completed work remain yours.':'Prepare a sound blank, fit it with a kit or your actual practiced control, return the gauge if borrowed, then deliver.'};}
