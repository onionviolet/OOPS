import {partnerCommands} from './party_partner_content.js';
import {PARTY_HELPER,PARTY_METHOD} from './native_battle_contracts.js';
const wood=JSON.stringify({id:'Rough wood log'}),kit=JSON.stringify({id:'Prepared survey kit'});
const eq=(fact,value=true)=>({fact,op:'eq',value});
const fact=(key,value=true,actor)=>({type:'fact',scope:'actor',key,value,...(actor?{actor}:{})});
const command=d=>({revision:1,worldId:'base.frontier',actorId:'player',location:'Village',group:'party',costs:[],effects:[],...d});
export const partySources=[{id:PARTY_METHOD,revision:1,label:'Braced interposition',kind:'knowledge',grants:[]}];
export const partyDefinitions={
    people:[{id:PARTY_HELPER,revision:1,label:'Lio, association porter',worldId:'base.frontier',location:'Village',inventory:'simulation',provision:false,
        resources:{brace_effort:4,coins:0},vitals:{health:28,max_health:28,stamina:12,max_stamina:12},
        body:{can_brace:true,attack:3,agility:6,dexterity:8,intuition:7,attack_speed:1.2,defense:3,crit_rate:0,crit_multiplier:1,attack_count:1}}],
    commands:[...partnerCommands,
        command({id:'party.meet',label:'Meet Lio, the association porter',once:true,visibleWhen:eq('actor.field.member'),requires:eq('actor.field.member'),
            effects:[{type:'spawn',personId:PARTY_HELPER,definitionId:PARTY_HELPER},fact('party.met'),fact('party.willing',true,PARTY_HELPER),
                {type:'item',actor:PARTY_HELPER,key:kit,amount:1},{type:'source',actor:PARTY_HELPER,sourceId:PARTY_METHOD,operation:'grant',origin:'trained',awakened:true,active:true},
                {type:'knowledge',key:'party.lio',stage:'seen',value:'Lio offers braced support for an agreed contest. He reports 28 HP, 12 stamina and four guard efforts, and offers to keep his condition visible during this agreed contest. He uses his own harness and trained control; he will stop when exhausted or wounded.'}]}),
        command({id:'party.prepare',label:'Prepare a peaceful settlement kit · 1 log + 2 stamina + 3 min',duration:3,cancellation:'refund',visibleWhen:eq('actor.party.met'),requires:eq('actor.field.member'),
            costs:[{type:'item',key:wood,amount:-1},{type:'vital',key:'stamina',amount:-2}],effects:[{type:'item',key:kit,amount:1},fact('party.prepared')]}),
        command({id:'party.rest',label:'Help Lio rest and re-rig one guard · 1 kit + 3 min',targetId:PARTY_HELPER,coLocated:true,participants:['$target'],duration:3,cancellation:'refund',visibleWhen:eq('actor.party.met'),requires:eq('actor.party.met'),
            costs:[{type:'item',key:kit,amount:-1}],effects:[{type:'vital',actor:PARTY_HELPER,key:'health',amount:28},{type:'vital',actor:PARTY_HELPER,key:'stamina',amount:12},
                {type:'resource',actor:PARTY_HELPER,key:'brace_effort',amount:1,capacity:4},{type:'relationship',target:PARTY_HELPER,axis:'trust',amount:1,text:'Supplied a kit and time for actual rest and harness work.'}]})
    ]
};
