import {remainderCombatFitLioSupported,remainderCombatFitHandsUsable} from './audit_remainder_combat_fit_facts.js';
// Original finite preparations/objectives over existing native stock and jobs.
// All balance, stock and fiction are reversible local proposals.
import {FEATURE_OBJECT_IDS} from './feature_expansion_objects.js';
import {featurePowerFacts} from './feature_expansion_powers.js';
import {SKILL_IDS} from './skill_expansion_content.js';
export const REMAINDER_COMBAT_OBJECTIVES = Object.freeze({group:'remainder_combat_objectives',prefix:'remainder_combat_objectives.',
    module:'combat_objectives',world:'base.frontier',owner:FEATURE_OBJECT_IDS.miri,site:FEATURE_OBJECT_IDS.site,
    loan:'remainder_combat_objectives.fitting_custody',profile:'combat_objectives.v1',battleSchema:5});
const I=REMAINDER_COMBAT_OBJECTIVES,key=id=>JSON.stringify({id});
export const REMAINDER_COMBAT_OBJECTIVE_KEYS=Object.freeze({rope:key('Survey rope'),kit:key('Prepared survey kit'),log:key('Rough wood log'),resin:key('Set repair resin'),
    guard:key('Kit brace pad'),traversal:key('Sluice traversal lashing'),fitting:key('Marked sluice fitting'),wrap:key('Learned brace wrap')});
const K=REMAINDER_COMBAT_OBJECTIVE_KEYS;
export const remainderCombatObjectivesItemSpecifications=Object.freeze([
    {id:'Kit brace pad',value:2,description:'One kit worked into a physical self-guard pad. Reserve before an enrolled sluice encounter; one paid guard consumes it for four temporary defense and a four-strength block.'},
    {id:'Sluice traversal lashing',value:2,description:'A worked wooden lashing used with one owned Survey rope. Its single paid escape gains two steps; the same reserved rope returns at settlement.'},
    {id:'Marked sluice fitting',value:1,description:'Eda’s one marked loose fitting at the sluice. Recovery carries her actual item under custody; only exact gate completion and intact handoff teach her recipe.'},
    {id:'Learned brace wrap',value:3,description:'One real log and resin worked using Eda’s earned recipe. Its single paid self guard gives five temporary defense and a five-strength block.'},
]);
export const REMAINDER_SUPPLY_FORBIDDEN_COMMANDS=Object.freeze(['field.pack_focus','field.pack_drive','skills.timber.pack','skills.timber.precise_pack']);
export const remainderCombatObjectivesFeatDefinitions=Object.freeze([{id:'ordinary_supply',label:'Supply through ordinary craft',description:'Deliver three actual kits during an explicitly enrolled ordinary-craft supply attempt. Recognition only; the ordinary six-coin commission remains its own payment.'}]);
export const combatObjectivesModule=state=>state.auditRemainder?.modules?.[I.module];
export const newCombatObjectivesModule=()=>({schema:1,recovery:{next:1,current:null,history:[]},supply:{next:1,current:null,history:[]}});
export const fittingReturnEffect=()=>({type:'custody',from:'player',to:I.owner,key:K.fitting,count:1,loanId:I.loan,returning:true});
export function ownedCombatObjectiveItem(state,context,itemKey){
    return Number.isSafeInteger(context.gameplay?.player?.inventory?.[itemKey])&&context.gameplay.player.inventory[itemKey]>0&&
        !Object.values(state.simulation?.custody||{}).some(c=>c.holder==='player'&&c.key===itemKey)&&
        !Object.values(context.equipment?.player||state.simulation?.equipment?.player||{}).includes(itemKey);
}
export function fittingCarried(state,context){
    const c=state.simulation?.custody?.[I.loan];
    return c?.owner===I.owner&&c.holder==='player'&&c.key===K.fitting&&c.count===1&&(context.gameplay?.player?.inventory?.[K.fitting]||0)>=1;
}
export function remainderMaintainedBraceSupported(state,context={},guard=null){
    const f=featurePowerFacts(state,context),source=state.actors?.player?.sources?.[SKILL_IDS.brace],p=state.simulation?.people?.player;
    const sourceCurrent=!!source&&['trained','acquired'].includes(source.origin)&&(source.expiresAt==null||source.expiresAt>state.clock);
    if(!sourceCurrent||!f[`power.${SKILL_IDS.brace}.owned`]||!f[`faculty.${SKILL_IDS.brace}.active`]||f[`power.${SKILL_IDS.brace}.mastery`]<6||
        f['feature.powers.brace.choice']!=='interpose'||p?.life!=='alive'||state.actors.player.worldId!==I.world||
        (context.facts?.location||p.location)!=='Village'||context.facts?.['body.handsTender']!==false||!Number.isFinite(context.facts?.strength)||context.facts.strength<8||
        !(context.vitals?.player?.health>1)||!remainderCombatFitHandsUsable(state))return false;
    if(guard&&(source.acquiredAt!==guard.sourceAcquiredAt||guard.expiresAt<=state.clock))return false;
    if(guard?.target==='partyPartner'){
        const gear=state.simulation?.equipment?.partyPartner?.field_frame;
        if(!remainderCombatFitLioSupported(state)||typeof gear!=='string'||!(state.simulation?.owners?.partyPartner?.[gear]>0)||
            Object.values(state.simulation?.custody||{}).some(c=>c.holder==='partyPartner'&&c.key===gear))return false;
    }
    return true;
}
export function remainderCombatObjectivesFacts(state,context={},registry){
    const m=combatObjectivesModule(state),a=state.actors?.player,f=a?.facts||{},s=state.simulation,location=context.facts?.location||s?.people?.player?.location;
    const enrolled=state.schema===11&&state.auditRemainder?.schema===1,local=enrolled&&a?.worldId===I.world&&location==='Village'&&s?.people?.player?.life==='alive';
    const supported=local&&context.facts?.['reference.workshop.supported']===true&&context.facts?.['reference.workshop.handsUsable']===true;
    const owner=local&&context.facts?.['featureObjects.miriSupported']===true;
    const stock=(s?.owners?.[I.owner]?.[K.fitting]||0)===1&&!s?.custody?.[I.loan];
    const completed=m?.recovery.history.find(e=>e.status==='completed'&&!e.handoff);
    const foes=['featureBattleShield','featureBattleHook'],foesPresent=local&&foes.every(id=>s?.people?.[id]?.life==='alive'&&s.people[id].location==='Village'&&state.actors?.[id]?.worldId===a?.worldId);
    const practiceConsent=foesPresent&&foes.every(id=>state.actors[id].facts?.['remainder.combat_objectives.practiceConsent']===true);
    return {'remainder.combatObjectives.practiceFoesPresent':foesPresent,'remainder.combatObjectives.practiceConsent':practiceConsent,
        'remainder.combatObjectives.practiceRations':foesPresent&&foes.every(id=>(state.actors[id].resources.watch_rations||0)>=1),
        'remainder.combatObjectives.practiceWatchReady':local&&f['remainder.combat_objectives.practiceWatchReady']===true,
        'remainder.combatObjectives.supported':supported,'remainder.combatObjectives.ownerSupported':owner,
        'remainder.combatObjectives.offerKnown':f['remainder.combat_objectives.recoveryOffered']===true,
        'remainder.combatObjectives.fittingStock':stock,'remainder.combatObjectives.fittingCarried':fittingCarried(state,context),
        'remainder.combatObjectives.recoveryAcceptable':local&&f['feature.battle.seen']===true&&!f['feature.battle.routeCleared']&&f['remainder.combat_objectives.recoveryOffered']===true&&stock&&
            !m?.recovery.current&&(m?.recovery.next||1)<=3&&!m?.recovery.history.some(e=>e.status==='completed'),
        'remainder.combatObjectives.handoffReady':owner&&!!completed&&fittingCarried(state,context)&&f['remainder.combat_objectives.recipeKnown']!==true,
        'remainder.combatObjectives.recipeKnown':f['remainder.combat_objectives.recipeKnown']===true,
        'remainder.combatObjectives.supplyTermsKnown':!!s?.knowledge?.player?.['remainder_combat_objectives.supply_terms'],
        'remainder.combatObjectives.supplyAcceptable':local&&!!s?.knowledge?.player?.['remainder_combat_objectives.supply_terms']&&f['field.supplyAccepted']===true&&f['field.supplyDone']!==true&&!m?.supply.current&&
            (m?.supply.next||1)<=3&&!m?.supply.history.some(e=>e.status==='completed'),
        'remainder.combatObjectives.maintainSupported':remainderMaintainedBraceSupported(state,context)};
}
const eq=(fact,value=true,reason)=>({fact,op:'eq',value,...(reason?{reason}:{})}),all=(...rules)=>({all:rules});
const item=(key,amount,actor='player',reservationReturn=false)=>({type:'item',actor,key,amount,...(reservationReturn?{reservationReturn:true}:{})});
const stamina=amount=>({type:'vital',key:'stamina',amount}),af=(key,value=true)=>({type:'fact',scope:'actor',key:`remainder.combat_objectives.${key}`,value});
const know=(key,value,stage='seen')=>({type:'knowledge',key:`remainder_combat_objectives.${key}`,stage,value});
const enabled=eq('auditRemainder.enrolled'),live=eq('remainder.combatObjectives.supported',true,'Return to Eda’s Village workshop with supported body and recovered hands.');
const command=d=>({revision:1,worldId:I.world,actorId:'player',location:'Village',group:I.group,costs:[],effects:[],...d,requires:all(enabled,d.requires)});
const craft=(id,label,costs,output,duration,extra={})=>command({id:I.prefix+id,label,duration,cancellation:'refund',siteId:I.site,
    visibleWhen:all(enabled,eq('reference.workshop.opened')),requires:live,completionRequires:all(enabled,live),completionFailure:'refund',
    costs:[...costs,stamina(-1)],effects:[item(output,1),know(id,`Completed paid ${label}. The actual native preparation remains separate from choosing and spending it during an enrolled encounter.`)],...extra});
export const remainderCombatObjectivesDefinitions={commands:[
    command({id:I.prefix+'hear_practice',label:'Ask the tollkeepers for a supplied nonlethal practice watch',once:true,targetId:'featureBattleShield',coLocated:true,participants:['featureBattleShield','featureBattleHook'],
        visibleWhen:all(enabled,eq('actor.feature.battle.routeCleared')),requires:all(eq('actor.feature.battle.routeCleared'),eq('remainder.combatObjectives.practiceFoesPresent')),
        effects:['featureBattleShield','featureBattleHook'].map(actor=>({type:'fact',scope:'actor',actor,key:'remainder.combat_objectives.practiceConsent',value:true})).concat([know('practice_terms','Nera and Oren consent to a bounded nonlethal practice using the same fixed bodies and equipment. Each supplied watch consumes one of each tollkeeper’s existing two watch rations, one player stamina and six played minutes. It opens exactly one new encounter, with no repeated passage XP, loot or coins. Your earned guard recipe can be used in that real practice.')])}),
    command({id:I.prefix+'supplied_practice_watch',label:'Prepare one supplied practice watch · 1 stamina + both watch rations + 6 min',duration:6,cancellation:'refund',targetId:'featureBattleShield',coLocated:true,participants:['featureBattleShield','featureBattleHook'],
        visibleWhen:all(enabled,eq('actor.feature.battle.routeCleared'),eq('remainder.combatObjectives.practiceConsent')),
        requires:all(eq('actor.feature.battle.routeCleared'),eq('remainder.combatObjectives.practiceConsent'),eq('remainder.combatObjectives.practiceRations'),eq('remainder.combatObjectives.practiceWatchReady',false)),
        completionRequires:all(enabled,eq('actor.feature.battle.routeCleared'),eq('remainder.combatObjectives.practiceConsent')),completionCoLocated:true,completionFailure:'refund',
        costs:[stamina(-1),...['featureBattleShield','featureBattleHook'].map(actor=>({type:'resource',actor,key:'watch_rations',amount:-1}))],
        effects:[...['featureBattleShield','featureBattleHook'].flatMap(actor=>[{type:'vital',actor,key:'health',amount:actor==='featureBattleShield'?34:24},{type:'vital',actor,key:'stamina',amount:12}]),af('practiceWatchReady'),know('practice_ready','One actual supplied six-minute practice watch completed. Both people consumed their own ration and recovered their own body. Permission opens one new explicitly enrolled native encounter; admission consumes it.')],
        description:'Cancellation or lost co-location returns actual reserved ration and effort, produces no ready watch and grants no new rewards. Existing finite watch stock never refills.'}),
    craft('craft_guard','Work one kit into a guard pad · 1 kit + 1 stamina + 2 min',[item(K.kit,-1)],K.guard,2),
    craft('craft_traversal','Work a traversal lashing · 1 log + 1 stamina + 2 min',[item(K.log,-1)],K.traversal,2),
    command({id:I.prefix+'hear_recovery',label:'Hear Eda’s marked-fitting offer',once:true,targetId:I.owner,coLocated:true,participants:['$target'],
        visibleWhen:all(enabled,eq('actor.feature.battle.seen'),eq('reference.workshop.opened')),requires:all(live,eq('remainder.combatObjectives.ownerSupported'),eq('actor.feature.battle.seen')),
        effects:[item(K.fitting,1,I.owner),af('recoveryOffered'),know('recovery_terms','Eda registers her one marked loose sluice fitting. Accept before a new encounter, recover it for one stamina, and raise the gate to three while carrying it intact. At most three attempts. Victory, bypass, escape and withdrawal do not qualify. Intact qualifying handoff teaches one recipe, without a free item or money. Failed passage returns the same fitting to Eda for any remaining attempt.')],
        description:'A once-only local ownership/permission record for Eda’s existing loose fitting. It cannot replenish on revisit; hearing terms starts no challenge.'}),
    command({id:I.prefix+'accept_recovery',label:'Accept a marked-fitting gate objective',visibleWhen:all(enabled,eq('remainder.combatObjectives.offerKnown')),
        requires:eq('remainder.combatObjectives.recoveryAcceptable',true,'Hear Eda’s offer, return any fitting and inspect the still-held sluice before a new finite attempt.'),
        effects:[know('recovery_acceptance','You deliberately accepted the exact recover-and-raise-gate terms before starting this attempt. Ordinary encounter settlement remains separate.')]}),
    command({id:I.prefix+'handoff_fitting',label:'Return Eda’s exact recovered fitting · learn brace-wrap recipe',once:true,targetId:I.owner,coLocated:true,participants:['$target'],
        visibleWhen:all(enabled,eq('remainder.combatObjectives.offerKnown')),requires:all(live,eq('remainder.combatObjectives.handoffReady')),
        costs:[fittingReturnEffect()],effects:[af('recipeKnown'),know('brace_wrap_recipe','Eda accepted her exact intact fitting after your declared raised-gate objective. You learned the brace-wrap recipe: one log, one Set repair resin, one stamina and two played minutes create one real guard preparation. No free product or repeated payment.', 'understood')]}),
    craft('craft_wrap','Make an earned brace wrap · 1 log + 1 resin + 1 stamina + 2 min',[item(K.log,-1),item(K.resin,-1)],K.wrap,2,
        {visibleWhen:all(enabled,eq('remainder.combatObjectives.recipeKnown')),requires:all(live,eq('remainder.combatObjectives.recipeKnown')),completionRequires:all(enabled,live,eq('remainder.combatObjectives.recipeKnown'))}),
    command({id:I.prefix+'hear_supply',label:'Read the ordinary-craft supply attempt terms',once:true,visibleWhen:all(enabled,eq('actor.field.supplyAccepted')),
        requires:all(eq('actor.field.supplyAccepted'),eq('actor.field.supplyDone',false)),effects:[know('supply_terms',`Up to three optional ordinary-craft attempts. Deliver three actual kits, with normal material/effort/time costs and ordinary six-coin commission payment. Only committed player starts of ${REMAINDER_SUPPLY_FORBIDDEN_COMMANDS.join(', ')} after acceptance violate. Buying, ordinary personal craft, physical sleeve work and the clamping frame remain allowed. There is no deadline, automatic debt, power deletion or extra feat payment.`)]}),
    command({id:I.prefix+'accept_supply',label:'Accept an ordinary-craft supply attempt',visibleWhen:all(enabled,eq('actor.field.supplyAccepted')),
        requires:eq('remainder.combatObjectives.supplyAcceptable',true,'Accept the still-uncompleted association commission first; finish any current attempt.'),
        effects:[know('supply_acceptance',`You accepted these already published terms. Up to three optional ordinary-craft attempts. Deliver three actual kits, with normal material/effort/time costs and ordinary six-coin commission payment. During this attempt only committed player starts of ${REMAINDER_SUPPLY_FORBIDDEN_COMMANDS.join(', ')} violate. Buying, ordinary personal craft, physical sleeve work and the clamping frame are allowed. Preview, rejected work and failed durable publication create no violation. No deadline, debt, power deletion or extra feat payment.`)]})
]};
