// LP6: reversible original proposal. Reuses Lio, native kits, the shared
// workbench, scheduled participant reservations and directed memories.
import {PARTY_HELPER, PARTY_METHOD} from './native_battle_contracts.js';
const wood=JSON.stringify({id:'Rough wood log'}),kit=JSON.stringify({id:'Prepared survey kit'});
const eq=(fact,value=true,reason)=>({fact,op:'eq',value,...(reason?{reason}:{})});
const gte=(fact,value,reason)=>({fact,op:'gte',value,reason});
const all=(...rules)=>({all:rules}),not=rule=>({not:rule});
const f=(key,value=true)=>({type:'fact',scope:'actor',key:`party.lp6.${key}`,value});
const memory=text=>({type:'relationship',target:PARTY_HELPER,axis:'trust',amount:0,text});
const note=(key,value)=>({type:'knowledge',key:`party.lp6.${key}`,stage:'seen',value});
const met=all(eq('actor.field.member'),eq('actor.party.met'));
const known=all(met,eq('actor.party.lp6.known'));
const waiting=eq('actor.party.lp6.waiting');
const hands=eq('originalFrontier.playerHandsUsable',true,'Packing needs two usable, recovered hands.');
const healthy=gte('vital.health',2,'Recover before handling this load.');
const partnerSupport=all(eq('party.lp6.willing',true,'Lio has withdrawn his consent.'),eq('target.body.can_brace',true,'Lio cannot currently brace.'),
    eq(`target.faculty.${PARTY_METHOD}.active`,true,'Lio needs his own active bracing method.'),
    gte(`target.item.${kit}`,1,'Lio needs his own harness kit.'),gte('target.vital.health',2,'Lio needs recovery first.'));
const c=d=>({revision:1,worldId:'base.frontier',actorId:'player',location:'Village',group:'party',costs:[],effects:[],...d});
const contact={targetId:PARTY_HELPER,coLocated:true,participants:[PARTY_HELPER],participantsCoLocated:true};
const bench={siteId:'village.workbench',cancellation:'refund'};
const completion=requires=>({completionRequires:requires,completionCoLocated:true,completionFailure:'refund'});
export const partnerCommands=[
    c({id:'party.lp6.ask',label:'Ask Lio about bench help (proposal)',...contact,visibleWhen:met,requires:met,
        effects:[f('known'),f('waiting'),note('terms','Lio needs a spare survey kit and three minutes to re-rig. Help him and he will hold your next bench load; decline and he offers a slower solo packing plan. Each batch still uses your log. He stays at the Village workbench, never follows beyond Village, and cannot help while reserved by another job.')]}),
    c({id:'party.lp6.help',label:'Help Lio re-rig · 1 kit + 3 min',...contact,...bench,duration:3,
        visibleWhen:all(known,not(eq('actor.party.lp6.helped'))),requires:all(known,waiting,hands,healthy),
        ...completion(all(hands,healthy)),costs:[{type:'item',key:kit,amount:-1}],
        effects:[f('helped'),f('history','helped'),memory('You supplied a real spare kit and three minutes to re-rig at the Village bench. Lio offered shared packing in return.'),note('cause','Helped: your spare kit and completed re-rig earned Lio’s practical shared-packing offer. No friendship points changed.')]}),
    c({id:'party.lp6.decline',label:'Decline the re-rig favor · ask for the solo plan',...contact,
        visibleWhen:all(known,not(eq('actor.party.lp6.helped')),not(eq('actor.party.lp6.history','declined'))),requires:known,
        effects:[f('history','declined'),memory('You declined the spare-kit favor. Lio respected that choice and offered a solo packing plan instead.'),note('cause','Declined: no kit was supplied and no debt was created. Lio offers a solo plan: your log, two stamina and three minutes. You may later choose to help with the actual re-rig.')]}),
    c({id:'party.lp6.pack_shared',label:'Pack with Lio · 1 log + 1 stamina each + 2 min → 1 kit',...contact,...bench,duration:2,
        visibleWhen:all(known,eq('actor.party.lp6.helped')),requires:all(known,waiting,hands,healthy,partnerSupport,gte('target.vital.stamina',1,'Lio needs rest before another shared load.')),
        ...completion(all(hands,healthy,partnerSupport)),
        costs:[{type:'item',key:wood,amount:-1},{type:'vital',key:'stamina',amount:-1},{type:'vital',actor:PARTY_HELPER,key:'stamina',amount:-1}],
        effects:[{type:'item',key:kit,amount:1},f('waiting',false),f('lastTask','shared'),memory('Lio held a real Village bench load while you packed one survey kit; each spent one stamina. The helped favor caused this offer.')]}),
    c({id:'party.lp6.pack_solo',label:'Use Lio’s solo plan · 1 log + 2 stamina + 3 min → 1 kit',...bench,duration:3,
        visibleWhen:all(known,eq('actor.party.lp6.history','declined')),requires:all(known,waiting,hands,healthy),
        ...completion(all(hands,healthy)),costs:[{type:'item',key:wood,amount:-1},{type:'vital',key:'stamina',amount:-2}],
        effects:[{type:'item',key:kit,amount:1},f('waiting',false),f('lastTask','solo'),note('solo','You used Lio’s declined-favor solo plan to pack one actual survey kit at the Village bench. Lio spent no stamina and was not reserved by this task.')]}),
];
