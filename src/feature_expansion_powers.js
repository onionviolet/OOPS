// Original, reversible Frontier specializations. Existing power/source/mastery,
// native XP, stock, jobs and the sole durable publisher remain authoritative.
import {SKILL_IDS, skillExpansionFacts} from './skill_expansion_content.js';
export const FEATURE_POWER_WORLD = 'base.frontier';
export const FEATURE_HARNESS = JSON.stringify({id:'Braced field harness'});
export const FEATURE_HOOK_POLE = JSON.stringify({id:'Sluice hook pole'});
export const FEATURE_KIT = JSON.stringify({id:'Prepared survey kit'});
export const FEATURE_LOG = JSON.stringify({id:'Rough wood log'});
export const FEATURE_POWER_ITEMS = [
    {id:'Braced field harness',name:'Braced field harness',description:'A counted frame of sound wood, cord and anchors. Lio can wear his owned frame to receive a guarded blow. It provides no source or learned control.',value:6,tags:{expedition:true}},
    {id:'Sluice hook pole',name:'Sluice hook pole',description:'A local hooked pole used to catch an exposed field frame. Its holder still needs their own body and practiced grip.',value:4,tags:{expedition:true}}
];
export const FEATURE_SPECIALIZATIONS = Object.freeze([
    {id:SKILL_IDS.brace,key:'brace',label:'Brace control',xp:'Equilibrium',choices:[
        {id:'interpose',label:'Shared frame',text:'Guard a real ally; mastery six holds two guarded targets with separately spent stamina.'},
        {id:'redirect',label:'Release pressure',text:'Receive a blow, then exhaust an unanchored attacker. A supported shield stance resists the release.'}]},
    {id:SKILL_IDS.trail,key:'trail',label:'Trail reading',xp:'Perception',choices:[
        {id:'opening',label:'Track the opening',text:'Aim the next native strike at a selected opponent with better hit placement, not invented damage.'},
        {id:'exit',label:'Keep a retreat line',text:'Advance escape by two steps at mastery six; a landed shield rush can still close the line.'}]},
    {id:SKILL_IDS.timber,key:'timber',label:'Timber judgment',xp:'Woodworking',choices:[
        {id:'frame',label:'Load-bearing frame',text:'Cut the same real harness with fewer supplies and lash a spent kit into one temporary guard.'},
        {id:'wedge',label:'Split the support',text:'Spend a real log to break the shield holder’s anchoring and advance the actual gate objective.'}]},
    {id:SKILL_IDS.inquiry,key:'inquiry',label:'Shared inquiry',xp:'Perception',choices:[
        {id:'read',label:'Read a response',text:'Compare an observed opponent’s stance, strip a held guard and expose one or two native strike openings.'},
        {id:'signal',label:'Coordinate the release',text:'Give Lio an agreed signal that reduces his next guard’s stamina cost while still spending his own guard effort.'}]}
]);
const eq=(fact,value=true,reason)=>({fact,op:'eq',value,...(reason?{reason}:{})});
const gte=(fact,value,reason)=>({fact,op:'gte',value,...(reason?{reason}:{})});
const all=(...rules)=>({all:rules});
const af=(key,value=true,actor)=>({type:'fact',scope:'actor',key,value,...(actor?{actor}:{})});
const stamina=(amount,actor)=>({type:'vital',key:'stamina',amount,...(actor?{actor}:{})});
const money=amount=>({type:'resource',native:true,key:'money',amount});
const item=(key,amount,actor)=>({type:'item',key,amount,...(actor?{actor}:{})});
const xp=(skill,amount)=>({type:'xp',skill,amount});
const known=id=>eq(`power.${id}.owned`);
const mature=id=>gte(`power.${id}.mastery`,4,'Complete the basic drill to mastery four first.');
const living=eq('actor.life','alive','Recover before this work.');
const ready=all(eq('skills.lioSupported',true,'Lio needs consent, his current body, acquired control and owned harness.'),eq('actor.party.met'));
const command=d=>({revision:1,worldId:FEATURE_POWER_WORLD,group:'feature_powers',actorId:'player',location:'Village',costs:[],effects:[],...d});
const choices=FEATURE_SPECIALIZATIONS.flatMap(f=>f.choices.map(c=>command({
    id:`feature_powers.${f.key}.${c.id}`,label:`Train ${c.label} · 1 coin + 2 stamina + 6 min`,powerId:f.id,duration:6,cancellation:'refund',
    visibleWhen:all(known(f.id),mature(f.id)),requires:all(living,{not:eq(`feature.powers.${f.key}.choice`,c.id)}),
    costs:[money(-1),stamina(-2)],effects:[af(`feature.powers.${f.key}.choice`,c.id),xp(f.xp,8),
        {type:'knowledge',key:`feature.powers.${f.key}.specialization`,stage:'understood',value:`${c.label}: ${c.text} Retraining changes this method's selected function for future work; it does not replace the learned method or reset mastery.`}],
    description:`${c.text} Choose one function for this method. A later paid retraining can change it; completed training preserves all existing mastery. Cancel refunds supplies and teaches nothing.`
})));
const growth=FEATURE_SPECIALIZATIONS.map(f=>command({id:`feature_powers.${f.key}.sustained`,label:`Refine ${f.label} beyond the basic drill · 3 stamina + 6 min`,
    powerId:f.id,duration:6,cancellation:'forfeit',automatable:true,visibleWhen:all(known(f.id),mature(f.id)),
    requires:all(living,{fact:`power.${f.id}.mastery`,op:'lte',value:7,reason:'This authored sustained drill ends at mastery eight; this is not a universal mastery ceiling.'},
        ...(f.key==='brace'||f.key==='timber'?[eq('body.handsTender',false,'Rest your hands first.')]:[])),
    ...(f.key==='timber'?{siteId:'village.workbench'}:{}),costs:[stamina(-3),...(f.key==='timber'?[item(FEATURE_LOG,-1)]:[])],
    effects:[{type:'power',powerId:f.id,operation:'refine',amount:1},xp(f.xp,10)],
    description:`Spend six played minutes and three stamina${f.key==='timber'?' plus one real log':''} for one mastery and ten native ${f.xp} XP. Mastery six expands this selected function; eight improves its efficiency. Cancellation keeps spent inputs and grants no advancement.`}));
const harnessEffects=[item(FEATURE_HARNESS,1),xp('Woodworking',8)];
export const featurePowerDefinitions={commands:[...choices,...growth,
    command({id:'feature_powers.map_exit',label:'Mark a real retreat line · 2 stamina + 4 min',powerId:SKILL_IDS.trail,duration:4,cancellation:'forfeit',
        visibleWhen:all(known(SKILL_IDS.trail),mature(SKILL_IDS.trail)),requires:all(living,eq('campaign.anchor',true,'Inspect the crossing first.'),eq('actor.feature.battle.routeCleared',false),eq('actor.feature.battle.exitPrepared',false)),
        costs:[stamina(-2)],effects:[af('feature.battle.exitPrepared'),xp('Perception',6)],description:'Your inspected drainage cuts lower the native encounter’s escape requirement from three steps to two. Preparation is consumed when an encounter starts. It grants no hostile position or future result.'}),
    command({id:'feature_powers.harness_ordinary',label:'Build a braced field harness · 2 kits + 2 logs + 6 min',duration:6,cancellation:'refund',siteId:'village.workbench',
        visibleWhen:eq('actor.party.met'),requires:all(living,eq('body.handsTender',false),eq('world.workbench.wet',false)),
        costs:[item(FEATURE_KIT,-2),item(FEATURE_LOG,-2)],effects:harnessEffects,description:'Ordinary apparatus remains viable without a learned method. The counted materials produce one real owned Braced field harness. Equip it on willing Lio before the native encounter.'}),
    command({id:'feature_powers.harness_matched',label:'Match the harness frame · 1 kit + 1 log + 4 min',powerId:SKILL_IDS.timber,duration:4,cancellation:'refund',siteId:'village.workbench',
        visibleWhen:all(known(SKILL_IDS.timber),mature(SKILL_IDS.timber)),requires:all(living,eq('feature.powers.timber.choice','frame'),eq('body.handsTender',false),eq('world.workbench.wet',false)),
        costs:[item(FEATURE_KIT,-1),item(FEATURE_LOG,-1)],effects:harnessEffects,description:'Learned load placement produces the same real frame with one kit and one log. It does not create a new material currency or an invisible combat bonus.'}),
    command({id:'feature_powers.equip_lio',label:'Give Lio one owned braced field harness and fit it · 2 min',targetId:'partyPartner',coLocated:true,participants:['$target'],duration:2,cancellation:'refund',
        visibleWhen:eq('actor.party.met'),requires:all(living,ready,eq('feature.party.harness',false)),costs:[stamina(-1)],effects:[
            {type:'transfer',from:'$actor',to:'$target',key:FEATURE_HARNESS,count:1},{type:'equipment',actor:'$target',slot:'field_frame',key:FEATURE_HARNESS}],
        description:'Transfer one actual player-owned frame to Lio, then mark his own equipped frame. Native combat reads that conserved item for two defense and a four-strength block. It grants no method or player stats.'}),
    command({id:'feature_powers.lio_release_drill',label:'Teach Lio agreed release timing · 1 coin + 2 stamina each + 4 min',powerId:SKILL_IDS.inquiry,targetId:'partyPartner',coLocated:true,participants:['$target'],duration:4,cancellation:'refund',
        visibleWhen:all(eq('actor.party.met'),known(SKILL_IDS.inquiry),mature(SKILL_IDS.inquiry)),requires:all(living,ready,{fact:'feature.party.drills',op:'lte',value:3,reason:'Lio completed these four release lessons.'}),
        costs:[money(-1),stamina(-2),stamina(-2,'$target')],effects:[{type:'resource',actor:'$target',key:'coins',amount:1},
            {type:'progress',actor:'$target',track:'feature_party',field:'release_drills',amount:1},xp('Perception',6)],
        description:'Lio spends his own fatigue and receives the actual coin. His retained release practice lowers guard stamina from two to one after two lessons and enables one fatigue counter after four. He still needs his acquired control, consent, body, stock and guard effort.'})
]};

export function featurePowerFacts(state,context={}) {
    const facts={...skillExpansionFacts(state,context)},a=state.actors[context.actorId||'player'],s=state.simulation;
    for(const f of FEATURE_SPECIALIZATIONS)facts[`feature.powers.${f.key}.choice`]=a?.facts[`feature.powers.${f.key}.choice`]||'none';
    const helper='partyPartner',gear=s?.equipment[helper]?.field_frame;
    facts['feature.party.harness']=gear===FEATURE_HARNESS&&(s?.owners[helper]?.[gear]||0)>0&&!Object.values(s?.custody||{}).some(c=>c.holder===helper&&c.key===gear);
    facts['feature.party.drills']=s?.progression[helper]?.feature_party?.values?.release_drills||0;
    facts['actor.feature.battle.routeCleared']=a?.facts['feature.battle.routeCleared']===true;
    facts['actor.feature.battle.exitPrepared']=a?.facts['feature.battle.exitPrepared']===true;
    return facts;
}
