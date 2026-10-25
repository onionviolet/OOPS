// Orders move the actual household person through the existing simulation job queue.
// The native graph still owns passage; knowledge is checked at departure, never granted by a view.
import {COHORT_MEMBERS,COHORT_ROOM} from './cohort_battle_facts.js';
import {drainageEdges,drainageLayout,drainageLocation,drainageRoom,drainageGate} from './drainage_layout.js';
import {simulationOccupiesActor} from './simulation.js';
const eq=(fact,value=true)=>({fact,op:'eq',value});
const pairs=[[COHORT_ROOM,'Village',5],['Village',drainageLocation(0),5],...Array.from(new Map([...drainageEdges(1),...drainageEdges(2)].map(([a,b])=>[a+':'+b,[drainageLocation(a),drainageLocation(b),2]])).values())];
export const cohortFieldLegs=pairs.flatMap(([a,b,minutes])=>[{from:a,to:b,minutes},{from:b,to:a,minutes}]);
export const cohortFieldId=(actor,from,to)=>'cohort.field.'+actor+'.'+cohortFieldLegs.findIndex(r=>r.from===from&&r.to===to);
export const cohortFieldCommands=COHORT_MEMBERS.flatMap(actor=>cohortFieldLegs.map(({from,to,minutes})=>({id:cohortFieldId(actor,from,to),revision:1,worldId:'base.frontier',group:'cohort_field',actorId:actor,targetId:'player',location:from,coLocated:true,duration:minutes,cancellation:'refund',completionFailure:'refund',label:'Agreed household survey travel',requires:{all:[eq('cohort.fieldReady'),eq('actor.cohort.willing'),eq('actor.home.employed'),{not:eq('actor.home.leave')}]},completionRequires:eq('actor.life','alive'),costs:[{type:'resource',actor:'player',native:true,key:'money',amount:-1},{type:'vital',actor,key:'stamina',amount:-1}],effects:[{type:'relocate',actor,location:to},{type:'resource',actor,key:'home.wages',amount:1}],description:'Directions are given in person before departure. One actual personal coin reserves the member’s wage and one of their own stamina supports this admitted passage. The member occupies their real work queue, arrives after the native route’s played travel time and waits there for another in-person order. Cancellation returns the unused reservation and leaves their position unchanged.'})));
export function cohortFieldRoutes(state,from){
 const seed=state.worlds?.['base.frontier']?.facts?.['drainage.seed'],known=id=>state.simulation?.knowledge?.player?.['drainage.route.'+id];
 return cohortFieldLegs.filter(r=>{if(r.from!==from)return false;const a=drainageRoom(r.from),b=drainageRoom(r.to);if(a===null&&b===null)return true;if(seed===undefined)return false;if(a!==null&&!known(a)||b!==null&&!known(b)||b===5&&!drainageGate(state))return false;if(a!==null&&b!==null&&!drainageLayout(seed).edges.some(([x,y])=>x===a&&y===b||y===a&&x===b))return false;return true;});
}
export function quoteCohortField(state,request,c){
 try{
  if(!c.ready||!c.manorAccess||state.actors.player.worldId!=='base.frontier')throw Error('Use your free supported Frontier body and the agreed household relationship.');
  if(c.paidHelpReason)throw Error(c.paidHelpReason);
  const person=state.simulation?.people?.[request.actor],actor=state.actors[request.actor];
  if(!COHORT_MEMBERS.includes(request.actor)||!person||person.life!=='alive'||person.location!==c.location||actor.worldId!=='base.frontier')throw Error('Meet that actual living household member here to give directions.');
  if(!actor.facts['cohort.willing']||!actor.facts['home.employed']||actor.facts['home.leave']||!(actor.resources['cohort.training']>=1))throw Error('The member must willingly be employed and physically instructed for this outing.');
  if(person.body?.form!=='human'||person.body?.mobile===false||!(person.vitals?.health>1)||!(person.vitals?.stamina>=1))throw Error('This actual supported body needs mobility, health and one stamina for the passage.');
  if(simulationOccupiesActor(state,request.actor))throw Error('Finish or cancel the member’s actual occupied work first.');
  const leg=cohortFieldRoutes(state,c.location).find(r=>r.to===request.to);if(!leg)throw Error('Give directions along an observed, physically open adjacent native passage.');
  if(!(c.external.money>=1))throw Error('Carry the one personal coin reserved for this member’s wage.');
  return {eligible:true,reason:'',id:cohortFieldId(request.actor,c.location,request.to),minutes:leg.minutes};
 }catch(e){return {eligible:false,reason:e.message};}
}
