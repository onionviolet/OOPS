import {legacyCommands} from './home_personal_legacy.js';
import {warehouseCommands} from './home_warehouse.js';
import {contactDefinitions} from './home_contacts.js';
import {schoolCommands} from './home_school_content.js';
import {cultivationDefinitions} from './home_cultivation_content.js';
import {TUTOR,SUPPLIER,HOUSEHOLD_TERMS as TERMS} from './home_household_content.js';
import {HOME_PLACES as P,HOME_BUILDINGS as B,HOME_SITE,HOME_WORLD,homeKey as k} from './home_content.js';
export const BUILDER='home.hired_builder',STEWARD='home.manor.steward',COOK='home.manor.cook',KEEPER='home.manor.keeper';
export const progressKey=(home,kind)=>`home.work.${home}.${kind}`;
export const permitKey=(home,kind)=>`home.permit.${home}.${kind}`;
const eq=(fact,value)=>({fact,op:'eq',value});
const res=(actor,key,amount)=>({type:'resource',actor,key,amount});
const item=(actor,id,amount)=>({type:'item',actor,key:k(id),amount});
const def=(id,label,extra)=>({id,revision:1,label,worldId:HOME_WORLD,group:'home_work',duration:5,cancellation:'refund',reservationReturns:1,completionFailure:'refund',costs:[],effects:[],...extra});
export const homeWorkDefinitions={people:[
    [BUILDER,'Ada, contract builder','Village'],[STEWARD,'Rowan, family steward',P.manor.location],[COOK,'Iven, household cook',P.manor.location],[KEEPER,'Toma, estate caretaker',P.manor.location],[TUTOR,'Sera, reading tutor',P.manor.location],[SUPPLIER,'Mara, Village provisioner','Village'],
].map(([id,label,location])=>({id,revision:1,label,location,worldId:HOME_WORLD,inventory:'simulation',provision:false,body:{id:`native.person.${id}.body`,form:'human',hands:2,mobile:true,ownerId:id,controllerId:id}})),commands:[...legacyCommands,...cultivationDefinitions.commands,...schoolCommands,...contactDefinitions.commands,...warehouseCommands],events:contactDefinitions.events,conditions:cultivationDefinitions.conditions};
for(const [home,p]of Object.entries(P))if(!p.legacy)for(const kind of ['build','repair','weatherproof']) {
    if(kind==='build'&&!B[home])continue;
    const location=kind==='build'?HOME_SITE:p.location,key=progressKey(home,kind),permission=eq('actor.'+permitKey(home,kind),true);
    for(const mode of ['solo','shared','rain','shared_rain']) {
        const shared=mode.startsWith('shared'),rain=mode.includes('rain');
        const manipulator=home==='nest'?{any:[eq('body.beak',true),{fact:'body.hands',op:'gte',value:1}]}:home==='burrow'?{any:[{fact:'body.paws',op:'gte',value:2},{fact:'body.hands',op:'gte',value:1}]}:{fact:'body.hands',op:'gte',value:1};
        const support={all:[permission,manipulator,...(shared?[{fact:'target.body.hands',op:'gte',value:1}]:[])]};
        homeWorkDefinitions.commands.push(def(`${key}.${mode}`,`${kind==='build'?B[home].name:kind==='repair'?'Repair '+p.name:'Weatherproof '+p.name} · ${shared?'shared':'individual'} contribution`,{
            actorId:'player',location,duration:rain?10:5,visibleWhen:permission,requires:support,completionRequires:{all:[support,eq('location',location)]},completionCoLocated:true,
            ...(shared?{participants:['player',BUILDER],participantsCoLocated:true,targetId:BUILDER}:{}),
            costs:shared?[{type:'resource',actor:'player',native:true,key:'money',amount:-2}]:[],
            effects:[res('player',key,shared?10:5),...(shared?[res(BUILDER,'home.wages',2)]:[])],
        }));
    }
}
homeWorkDefinitions.commands.push(
    def('home.staff.cook','Iven prepares two meals',{actorId:COOK,location:P.manor.location,duration:10,requires:eq('actor.home.employed',true),completionRequires:eq('actor.home.employed',true),
        costs:[item(COOK,'Rat meat chunks',-2),item(COOK,'Rough wood log',-1),res(STEWARD,'home.estateFunds',-2)],effects:[item(COOK,'Roasted rat meat',2),res(COOK,'home.wages',2)]}),
    def('home.staff.repair','Toma patches the estate roof',{actorId:KEEPER,location:P.manor.location,duration:15,requires:eq('actor.home.employed',true),completionRequires:eq('actor.home.employed',true),
        costs:[item(KEEPER,'Rough wood log',-1),item(KEEPER,'Home dry grass',-2),res(STEWARD,'home.estateFunds',-3)],effects:[res('player','home.repair.manor',25),res(KEEPER,'home.wages',3)]}),
    def('home.staff.gather','Toma gathers deadfall and dry grass on the estate grounds',{actorId:KEEPER,location:P.manor.location,duration:30,requires:eq('actor.home.employed',true),completionRequires:eq('actor.home.employed',true),
        costs:[res(STEWARD,'home.estateFunds',-2)],effects:[item(KEEPER,'Rough wood log',2),item(KEEPER,'Home dry grass',3),res(KEEPER,'home.wages',2)]}),
    def('home.staff.dry','Toma dries the room and bedding',{actorId:KEEPER,location:P.manor.location,duration:10,requires:eq('actor.home.employed',true),completionRequires:eq('actor.home.employed',true),
        costs:[item(KEEPER,'Rough wood log',-1),res(STEWARD,'home.estateFunds',-2)],effects:[res('player','home.dry.manor',40),res(KEEPER,'home.wages',2)]}),
);

const consent=id=>({all:[eq('actor.home.employed',true),{not:eq('actor.home.leave',true)},{fact:'resource.home.energy',op:'gte',value:20}]});
for(const command of homeWorkDefinitions.commands.filter(d=>d.id.startsWith('home.staff.'))){
 command.requires=consent(command.actorId);command.costs.push(res(command.actorId,'home.energy',-20));
}
const lessonSupport={all:[eq('actor.home.teachesLiteracy',true),eq('actor.home.employed',true),{fact:'target.body.hands',op:'gte',value:1}]};
homeWorkDefinitions.commands.push(
 def('home.household.lesson','Read the household primer with Sera',{actorId:TUTOR,location:P.manor.location,duration:TERMS.lessonMinutes,targetId:'player',participants:[TUTOR,'player'],participantsCoLocated:true,
  requires:{all:[lessonSupport,consent(TUTOR),{fact:'target.resource.home.readingPractice',op:'lte',value:TERMS.lessonCap-TERMS.lessonXP}]},completionRequires:lessonSupport,completionCoLocated:true,
  costs:[res(STEWARD,'home.estateFunds',-4),res(TUTOR,'home.energy',-20)],effects:[res(TUTOR,'home.wages',4),res('player','home.readingPractice',TERMS.lessonXP),{type:'unlock',actor:'player',kind:'skill',id:'Literacy'},{type:'xp',actor:'player',skill:'Literacy',amount:TERMS.lessonXP}]}),
 def('home.household.duty','Check the household ledger with Rowan',{actorId:'player',location:P.manor.location,duration:15,targetId:STEWARD,participants:['player',STEWARD],participantsCoLocated:true,
  requires:{all:[eq('actor.home.familyDutyAccepted',true),{not:eq('actor.home.familyDutyKept',true)},{fact:'body.hands',op:'gte',value:1},eq('target.life','alive'),{fact:'target.resource.home.energy',op:'gte',value:20}]},
  completionRequires:{all:[eq('actor.home.familyDutyAccepted',true),{fact:'body.hands',op:'gte',value:1},eq('target.life','alive')]},completionCoLocated:true,costs:[res(STEWARD,'home.energy',-20)],effects:[{type:'fact',scope:'actor',actor:'player',key:'home.familyDutyKept',value:true}]}),
 def('home.household.return','Mara returns to Village',{actorId:SUPPLIER,location:P.manor.location,duration:10,requires:eq('actor.home.employed',true),completionRequires:{all:[eq('actor.home.employed',true),eq('location',P.manor.location)]},effects:[{type:'relocate',actor:SUPPLIER,location:'Village'}]}),
 def('home.household.pantry','Mara delivers reserved Village provisions',{actorId:STEWARD,location:P.manor.location,duration:20,targetId:SUPPLIER,participants:[STEWARD,SUPPLIER],requires:{all:[consent(STEWARD),eq('target.location','Village')]},completionRequires:{all:[eq('actor.home.employed',true),eq('target.life','alive'),eq('target.location','Village')]},
  costs:[res(STEWARD,'home.estateFunds',-8),res(STEWARD,'home.energy',-20),item(SUPPLIER,'Rat meat chunks',-4),item(SUPPLIER,'Rough wood log',-2)],
  effects:[{type:'relocate',actor:SUPPLIER,location:P.manor.location},res(SUPPLIER,'home.wages',8),item(COOK,'Rat meat chunks',4),item(COOK,'Rough wood log',2)]}),
);
// One projection of a command's own frozen terms, so a request label cannot
// promise anything other than what dispatch reserves and completion settles.
export function staffQuote(id){
 const d=homeWorkDefinitions.commands.find(c=>c.id===id);if(!d)throw Error('Home: unknown staff service');
 const sum=(list,type,key)=>list.filter(e=>e.type===type&&e.key===key).reduce((n,e)=>n+e.amount,0);
 return {minutes:d.duration,funds:-sum(d.costs,'resource','home.estateFunds'),energy:-sum(d.costs,'resource','home.energy'),
  yields:d.effects.filter(e=>e.type==='item'&&e.amount>0).map(e=>({key:e.key,count:e.amount,holder:e.actor})),
  uses:d.costs.filter(e=>e.type==='item').map(e=>({key:e.key,count:-e.amount}))};
}
// E5b: the pantry office's standing order. One variant per person who can hold
// the office; each spends the holder's office funds, never their own wages.
export const OFFICE_HOLDERS=[STEWARD,KEEPER];
{const pantry=homeWorkDefinitions.commands.find(d=>d.id==='home.household.pantry');
 for(const holder of OFFICE_HOLDERS){const swap=e=>({...e,...(e.actor===STEWARD?{actor:holder}:{}),...(e.key==='home.estateFunds'?{key:'home.officeFunds'}:{})});
  homeWorkDefinitions.commands.push({...structuredClone(pantry),id:`home.office.restock.${holder}`,label:'Standing order: Mara delivers Village provisions',actorId:holder,participants:[holder,SUPPLIER],
   requires:{all:[consent(holder),eq('actor.home.officeHolder',true),eq('target.location','Village')]},costs:pantry.costs.map(swap),effects:pantry.effects.map(swap)});}}

// W2 qualified delegation is earned by a real shared appointment, not a title.
homeWorkDefinitions.commands.push(def('home.office.instruction','Study the provision office with Rowan',{actorId:KEEPER,location:P.manor.location,duration:10,targetId:STEWARD,participants:[KEEPER,STEWARD],participantsCoLocated:true,
 requires:{all:[consent(KEEPER),eq('target.life','alive')]},completionRequires:{all:[eq('actor.home.employed',true),eq('target.life','alive')]},completionCoLocated:true,
 costs:[res(KEEPER,'home.energy',-20),res(STEWARD,'home.energy',-20)],effects:[{type:'fact',actor:KEEPER,scope:'actor',key:'home.officeQualified',value:true}]}));
