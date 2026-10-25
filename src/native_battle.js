import {ensureRehearsedFoe,rehearseOpening} from './rehearsed_foe.js';
import {savedBattleLoss} from './defeat_domain.js';
import {check} from './basics.js';
import {rollCombatStrike,mitigateCombatDamageFromStats} from "./combat_math.js";
import {applySimulationEffects} from "./simulation_effects.js";
import {validateExpansionState} from "./expansion_engine.js";
import {ROAD_RIVAL,RIVAL_PURSUIT} from "./frontier_campaign.js";
import {validateNativeBattle} from "./native_battle_contracts.js";
import {xorshift32} from "./seeded_streams.js";
export {validateNativeBattle} from "./native_battle_contracts.js";
import {commitPartyBattleAction,withdrawPartyBattle} from "./party_battle.js";

export function initializeNativeBattle(plan) {
    const session=plan.state.simulation?.sessions.player;
    check(session?.definitionId === "rival.native_duel","No native road encounter.");
    session.nativeBattle ||= {schema:1,seed:(plan.state.simulation.seed ^ plan.state.sequence)>>>0 || 1,actions:0,last:"The agreed duel is ready. Both stop at one HP."};
    ensureRehearsedFoe(plan.state,ROAD_RIVAL);
    validateNativeBattle(session.nativeBattle,session);return plan;
}
export function readNativeFighter(actor) {
    return {stats:{...actor.getFullStats()},attackPower:actor.getAttackPower(),shield:actor.hasShield() ? actor.getBlockStrength() : 0,
        emptyStaminaMultiplier:.5+(actor.getLevelableComponent?.().getTotalLevelBonus("Persistence") || 0),
        shieldSkill:actor.getEquipment()["off-hand"]?.tags.ignore_skill ? 0 : actor.getTotalSkillLevel?.("Shield blocking") || 0};
}

function battlePlan(state,context) {
    return {state:structuredClone(state),external:structuredClone(context.external),gameplay:structuredClone(context.gameplay),
        vitals:structuredClone(context.vitals),acquisitions:[],unlocks:[]};
}
function finish(plan,registry,result) {
    const state=plan.state,s=state.simulation,session=s.sessions.player,cause=`native-battle:${++state.sequence}`;
    const effects=[{type:"fact",scope:"actor",key:"rival.lastResult",value:result},
        {type:"relationship",target:ROAD_RIVAL,axis:result === "won" ? "respect" : "familiarity",amount:1,text:`Road contest ended: ${result}. Injuries and spent stamina remain.`}];
    if(result === "won" && !state.actors.player.facts["rival.resolved"]) effects.push(
        {type:"fact",scope:"actor",key:"rival.resolved",value:true},{type:"source",sourceId:"frontier.rival_insight",operation:"grant",awakened:true,active:true});
    applySimulationEffects(plan,effects,{actorId:"player"},registry,cause);
    const p=s.pursuits[RIVAL_PURSUIT];p.status=result === "withdrawn" ? "withdrawn" : "tested";p.due=null;p.closedAt=state.clock;p.closedBy="player";
    state.actors.player.completed[session.commandId]=(state.actors.player.completed[session.commandId] || 0)+1;
    s.log.push({at:state.clock,text:`Mara's road contest: ${result}.`,cause});s.log=s.log.slice(-100);
    delete s.sessions.player;
}
export function commitNativeBattleStrike(state,registry,{actorId,targetId,attacker,target,fighters},context,expectedSequence=state.sequence) {
    if(state.simulation?.sessions.player?.nativeBattle?.schema === 2) {
        const session=state.simulation.sessions.player;
        return commitPartyBattleAction(state,registry,{type:"strike",actorId,targetId,sequence:expectedSequence,sessionId:session.id,action:session.nativeBattle.actions,fighters:{...fighters,[actorId]:attacker,[targetId]:target}},context);
    }
    check(state.sequence === expectedSequence,"This combat action is stale.");
    const saved=state.simulation?.sessions.player;validateNativeBattle(saved?.nativeBattle,saved);
    check((actorId === "player" && targetId === ROAD_RIVAL) || (actorId === ROAD_RIVAL && targetId === "player"),"Unsupported native battle participant.");
    const plan=battlePlan(state,context),session=plan.state.simulation.sessions.player,battle=session.nativeBattle;
    const random=()=>{battle.seed=xorshift32(battle.seed);return battle.seed/0x100000000;};
    const person=plan.state.simulation.people[actorId],vitals=actorId === "player" ? plan.vitals.player : person.vitals;
    check(vitals?.health > 1,"The fighter needs recovery before another duel.");
    const hadStamina=vitals.stamina > 0;
    const cost=Math.min(vitals.stamina,1/(attacker.stats.stamina_efficiency || 1));
    vitals.stamina=Math.max(0,vitals.stamina-cost);
    const rehearsal=rehearseOpening(plan.state,registry,{actorId,targetId,sessionId:session.id,attacker});
    if(rehearsal.tell)applySimulationEffects(plan,[{type:'knowledge',key:'cheat.rf1.tell',stage:'seen',value:rehearsal.tell}],{actorId},registry,session.id);
    const strike=rollCombatStrike({attackPower:rehearsal.scale*attacker.attackPower*(hadStamina && vitals.stamina === 0 ? (attacker.emptyStaminaMultiplier || .5) : 1),attacker:attacker.stats,target:target.stats,shield:target.shield,shieldSkill:target.shieldSkill,random});
    const victim=targetId === "player" ? plan.vitals.player : plan.state.simulation.people[targetId].vitals;
    check(victim?.health > 1,"The target has already yielded.");
    const damage=strike.kind === "hit" ? mitigateCombatDamageFromStats(strike.values,target.stats,0,attacker.stats.armor_penetration??0) : 0;
    victim.health=Math.max(1,victim.health-damage);battle.actions++;
    battle.last=`${actorId === "player" ? "You" : "Mara"} ${strike.kind === "hit" ? `hit for ${Math.round(damage*10)/10}${strike.critted ? " (critical)" : ""}` : strike.kind === "blocked" ? "met a full block" : "missed"}.`;
    plan.native={hpToFull:plan.vitals.player.max_health-plan.vitals.player.health,staminaToFull:plan.vitals.player.max_stamina-plan.vitals.player.stamina};
    plan.state.sequence++;
    if(victim.health === 1) {finish(plan,registry,targetId === ROAD_RIVAL ? "won" : "lost");if(targetId === "player") plan.defeat=savedBattleLoss(["Mara"]);}
    validateExpansionState(plan.state,registry);return plan;
}
export function withdrawNativeBattle(state,registry,context,expectedSequence=state.sequence) {
    if(state.simulation?.sessions.player?.nativeBattle?.schema === 2)return withdrawPartyBattle(state,registry,context,expectedSequence);
    check(state.sequence === expectedSequence,"This withdrawal is stale.");validateNativeBattle(state.simulation?.sessions.player?.nativeBattle,state.simulation?.sessions.player);
    const plan=battlePlan(state,context);finish(plan,registry,"withdrawn");validateExpansionState(plan.state,registry);return plan;
}
