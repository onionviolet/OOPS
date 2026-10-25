// Delayed letters use the simulation event director; introductions name the
// willing seller and actual remaining stock, rather than granting cargo.
import {domainRegistry} from './domain_registry.js';
import {eqRaw as eq} from './basics.js';
const S='home.manor.steward',T='home.manor.tutor',M='home.manor.supplier',ROOM='Arlmere family manor';
const res=(actor,key,amount,extra={})=>({type:'resource',actor,key,amount,...extra});
export const REPORT_RETURN='home.contacts.report_return';
export const contactDefinitions={events:[{
 id:REPORT_RETURN,revision:1,label:'Sera sends a note about your estate station report, with one coin from her own earned wages.',mode:'ambient',interval:1440,lifetime:0,automatic:false,public:true,maxOccurrences:1,chance:1,
 requires:{all:[eq('target.life','alive'),eq('target.world','base.frontier'),{fact:'resource.home.wages',op:'gte',value:1}]},
 effects:[res(T,'home.wages',-1),res('player','money',1,{native:true}),res('player','home.receivedReportLetters',1),{type:'relationship',actor:T,target:'player',axis:'gratitude',amount:1,text:'Your actual station report gave Sera a useful comparison; she sent a dated thank-you from her own purse.'}]
}],commands:[{
 id:'home.contacts.mara_trade',revision:1,label:'Buy two meat chunks directly from Mara',worldId:'base.frontier',group:'home_work',actorId:M,targetId:'player',location:'Village',duration:5,participants:[M,'player'],participantsCoLocated:true,completionCoLocated:true,
 cancellation:'refund',reservationReturns:1,completionFailure:'refund',requires:eq('target.life','alive'),completionRequires:eq('target.life','alive'),
 costs:[res('player','money',-3,{native:true}),{type:'item',actor:M,key:JSON.stringify({id:'Rat meat chunks'}),amount:-2}],
 effects:[res(M,'home.wages',3),{type:'item',actor:'player',key:JSON.stringify({id:'Rat meat chunks'}),amount:2}]
}]};
export function contactView(c){
 const trust=domainRegistry.command('social_trust','knownStanding')?.()||{},alive=Object.keys(trust).filter(id=>c.people?.[id]?.life==='alive');
 return {steward:trust[S]||0,total:alive.reduce((n,id)=>n+Math.max(0,trust[id]||0),0),introduced:c.playerFacts?.['home.maraTradeIntroduced']===true,rumor:c.playerFacts?.['home.householdRumorHeard']===true};
}
export function planHomeContacts(s,r,c,out){
 if(!['contacts_introduce','contacts_rumor','contacts_trade','contacts_cancel'].includes(r.type))return false;
 const check=(v,m)=>{if(!v)throw Error('Home: '+m);};check(s.properties.manor?.access&&c.body.form==='human','meet the people who know your household agreement.');
 const v=contactView(c);
 if(r.type==='contacts_cancel'){const j=c.jobs.find(j=>j.id===r.job&&j.commandId==='home.contacts.mara_trade');check(j,'the actual direct purchase changed.');out.job={cancel:j.id,actor:M};out.message='The unfinished direct purchase returns the reserved meat and coins to their actual owners.';return true;}
 if(r.type==='contacts_trade'){
  check(v.introduced,'ask Rowan for an actual introduction before using Mara’s direct contract.');check(c.location==='Village'&&c.people[M]?.life==='alive'&&c.people[M]?.location==='Village','meet Mara in Village after her actual return journey.');
  out.job={id:'home.contacts.mara_trade',actor:M};out.message='Mara reserves two meat chunks from her finite stock for your three actual coins. Both of you spend five played minutes at Village; cancellation returns both reservations.';return true;
 }
 check(c.location===ROOM&&c.people[S]?.life==='alive'&&c.people[S].location===ROOM,'meet Rowan at the manor.');
 if(r.type==='contacts_introduce'){
  check(!v.introduced&&v.steward>=8,'Rowan offers this introduction once you have earned his trusted regard (8).');out.simEffects.push({type:'fact',scope:'actor',actor:'player',key:'home.maraTradeIntroduced',value:true});out.message='Rowan introduces you as a trusted household contact. Mara agrees to a small direct provision contract in Village, from her own finite stock. Other merchants keep their own terms.';
 }else{
  check(!v.rumor&&v.total>=12,'build 12 total positive regard among the living household contacts before comparing their accounts.');out.simEffects.push({type:'fact',scope:'actor',actor:'player',key:'home.householdRumorHeard',value:true});out.message='The household compares its accounts: Mara waits in Village between real deliveries; the released cradle field expires, and circulation students still need their own rest and wages. These named routes can be followed through Homes.';
 }
 return true;
}
export function renderHomeContacts({staff,view,el,action}){
 const c=view.context,v=contactView(c);staff.append(el('h3','Household contacts'),el('p',`Known living household regard ${v.total}. Rowan’s regard ${v.steward}. ${v.introduced?'Mara’s direct provision introduction is retained.':'Rowan can introduce a trusted household contact to Mara.'} Dated report thank-you letters received ${c.resources['home.receivedReportLetters']||0}. Sera can send a coin from her own wages a played day after your personal report; the letter waits for living contacts in the Frontier and actual funds.`));
 action(staff,'contacts_rumor','Compare the household’s accounts · 12 total positive regard',{type:'contacts_rumor'});
 action(staff,'contacts_introduce','Ask Rowan to introduce Mara · trusted regard 8',{type:'contacts_introduce'});
 action(staff,'contacts_trade','Meet Mara in Village · 2 meat, 3 coins, 5 min',{type:'contacts_trade'});
 for(const j of c.jobs.filter(j=>j.commandId==='home.contacts.mara_trade')){staff.append(el('p',`${j.label}: ${Math.max(0,j.due-c.clock)} played minutes remain.`));action(staff,'contacts_cancel:'+j.id,'Cancel the direct purchase',{type:'contacts_cancel',job:j.id});}
}

export function renderVillageContacts({host,view,action}){
 action(host,'contacts_trade','Mara’s introduced direct contract · 2 meat, 3 coins, 5 min',{type:'contacts_trade'});
 for(const j of view.context.jobs.filter(j=>j.commandId==='home.contacts.mara_trade'))action(host,'contacts_cancel:'+j.id,'Cancel the reserved direct purchase',{type:'contacts_cancel',job:j.id});
}
