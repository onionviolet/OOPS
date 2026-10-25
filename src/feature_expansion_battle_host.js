import {check} from './basics.js';
import {cohortFrameFit} from './cohort_gear_facts.js';
import {remainderCombatFitNativeStats} from './audit_remainder_combat_fit_hooks.js';
import {readNativeFighter} from './native_battle.js';
import {featureBattleToken,featureNativeAction,commitFeatureBattleAction,withdrawFeatureBattle,featureBattleView,validateFeatureBattle,
    featureFighterOwnership,featureOwnedGear,FEATURE_BATTLE_SCHEMA,isFeatureBattleSchema,FEATURE_SHIELD,FEATURE_HOOK,FEATURE_HELPER} from './feature_expansion_battle.js';
import {FEATURE_HARNESS,FEATURE_HOOK_POLE,featurePowerFacts} from './feature_expansion_powers.js';
// No timer, inventory or publication owner is created here. Native Combat's
// saved action adapter calls the one durable planner/publisher at each cadence.
export function createFeatureBattleHost({Combat,Enemy,registry,player,getState,getContext,persist,getCombat,setCombat,endCombat,refresh=()=>{},render=()=>{},attackersSlot,defendersSlot}) {
    let fighters={},paused='';
    const nativePlayer={id:'player',name:player.name,tags:{main_character:true},is_alive:true,
        getFullStats:()=>player.getFullStats(),getAttackPower:()=>player.getAttackPower(),getEquipment:()=>player.getEquipment(),
        hasShield:()=>player.hasShield(),getBlockStrength:()=>player.getBlockStrength(),getTotalSkillLevel:id=>player.getTotalSkillLevel(id),
        getStats:()=>player.getStats(),getLevelableComponent:()=>player.getLevelableComponent()};
    function sync(refreshDisplay=true) {
        const state=getState(),b=state.simulation?.sessions.player?.nativeBattle;
        for(const [id,f] of Object.entries(fighters)) {
            if(id!=='player') {
                const p=state.simulation.people[id],stats=f.getFullStats(),cohortFit=b?.schema===6?cohortFrameFit(state,id):null,frame=cohortFit?cohortFit.active:featureOwnedGear(state,id,'field_frame',FEATURE_HARNESS),hook=featureOwnedGear(state,id,'hook_pole',FEATURE_HOOK_POLE);
                const fit=remainderCombatFitNativeStats(state,b,id);
                Object.assign(stats,p.vitals);stats.defense=(p.body.defense||0)+(fit?fit.defenseBonus:frame?2:0);stats.attack_power=(b?.schema===6?f.cohortBaseAttack+2*(b.admission.training[id]||0):p.body.attack)+(hook?1:0);
                stats.block_chance=fit?fit.blockChance:cohortFit?cohortFit.blockChance:frame ? .6 : 0; // Actual owned/equipped physical frame.
            }
            f.is_alive=isFeatureBattleSchema(b?.schema)&&b.fighters[id]?.status==='active';
        }
        if(refreshDisplay)refresh();
    }
    function readBindings() {
        const state=getState(),token=featureBattleToken(state);if(!token||getCombat()?.featureBattleSessionId!==token.sessionId)return {};
        sync(false);return Object.fromEntries(Object.entries(fighters).map(([id,f])=>[id,{...token,ownerId:id,ownership:featureFighterOwnership(state,id),snapshot:readNativeFighter(f)}]));
    }
    function finishOrSync() {
        if(!isFeatureBattleSchema(getState().simulation?.sessions.player?.nativeBattle?.schema)){endCombat();fighters={};}
        else sync();render();
    }
    function act(c) {
        const state=getState(),token=featureBattleToken(state);check(token,'No native sluice encounter.');
        check(c.sessionId===token.sessionId&&c.sequence===token.sequence&&c.action===token.action&&c.seed===token.seed,'This native action is stale. Review the current encounter.');
        if(!['withdraw','release'].includes(c.type))check(getCombat()?.featureBattleSessionId===token.sessionId,'Resume native combat before using this function.');
        const plan=commitFeatureBattleAction(state,registry,c,getContext(),readBindings());persist(plan);paused='';finishOrSync();return plan;
    }
    function resume(quotedToken) {
        const state=getState(),session=state.simulation?.sessions.player,b=session?.nativeBattle;
        validateFeatureBattle(b,session,state);check(!getCombat(),'Finish the current native combat first.');
        const token=featureBattleToken(state);
        check(quotedToken&&['sessionId','sequence','action','seed'].every(key=>quotedToken[key]===token[key]),'This native resume is stale. Review the current encounter.');
        check(!getContext().busy,'Finish the current native activity first.');
        check(getContext().vitals?.player?.health>1,'Recover before resuming the encounter, or withdraw.');
        const attackersUi=typeof attackersSlot==='function'?attackersSlot():attackersSlot||document.getElementById('feature_battle_attackers');
        const defendersUi=typeof defendersSlot==='function'?defendersSlot():defendersSlot||document.getElementById('feature_battle_defenders');
        check(attackersUi&&defendersUi,'The native sluice combat display is unavailable.');
        fighters={player:nativePlayer};nativePlayer.name=player.name;nativePlayer.is_alive=true;
        for(const id of Object.keys(b.fighters).filter(id=>id!=='player')) {
            const p=state.simulation.people[id];check(p?.body&&p?.vitals,'Missing actual native NPC body.');
            const f=new Enemy({id,name:b.schema===6?(registry.simulation.people.get(id)?.label||'Household member'):id===FEATURE_HELPER?'Lio':id===FEATURE_SHIELD?'Nera':'Oren',description:b.schema===6?'A willing participant using their own actual body and paid physical instruction':id===FEATURE_HELPER?'A willing porter using his own body and equipment':'A local sluice tollkeeper',add_to_bestiary:false,tags:['living','person'],
                stats:{...p.body,...(b.schema===6?{attack:p.body.attack??0}:{}),health:p.vitals.max_health,max_stamina:p.vitals.max_stamina}});f.init();if(b.schema===6)f.cohortBaseAttack=p.body.attack??f.getFullStats().strength/10;
            // Enemy remains the native stats owner. Its actual saved equipment
            // supplies a physical block, rather than borrowing player gear.
            const fit=()=>remainderCombatFitNativeStats(getState(),getState().simulation?.sessions.player?.nativeBattle,id);
            f.hasShield=()=>getState().simulation?.sessions.player?.nativeBattle?.schema===6?cohortFrameFit(getState(),id).active:fit()?.hasFrame??featureOwnedGear(getState(),id,'field_frame',FEATURE_HARNESS);
            f.getBlockStrength=()=>fit()?.blockStrength??(f.hasShield()?4:0);
            f.getEquipment=()=>f.hasShield()?{'off-hand':{tags:{ignore_skill:false}}}:{};
            f.getTotalSkillLevel=skill=>skill==='Shield blocking'?(b.schema===6?0:id===FEATURE_HELPER?Math.min(20,featurePowerFacts(getState(),getContext())['feature.party.drills']*5):10):0;
            Object.assign(f.getFullStats(),p.vitals);f.is_alive=b.fighters[id].status==='active';fighters[id]=f;
        }
        const active=Object.keys(b.fighters).filter(id=>b.fighters[id].status==='active');
        const combat=new Combat({attackers:active.filter(id=>b.fighters[id].side==='attackers').map(id=>fighters[id]),defenders:active.filter(id=>b.fighters[id].side==='defenders').map(id=>fighters[id]),
            is_special_combat:true,show_stance_controls:false,
            attackers_ui_slot:attackersUi,defenders_ui_slot:defendersUi,
            actionAdapter:({fighter})=>{
                const current=getState().simulation?.sessions.player;if(current?.id!==session.id||!isFeatureBattleSchema(current.nativeBattle?.schema))return;
                try {
                    const value=featureNativeAction(getState(),getContext(),fighter.id);if(!value)return;
                    act({...featureBattleToken(getState()),...value});
                }catch(error){paused=`Native sluice combat paused before an uncommitted action: ${error.message}`;endCombat();fighters={};render(paused);}
            }});
        combat.featureBattleSessionId=session.id;setCombat(combat);sync(false);paused='';combat.start();sync();render();
    }
    return {resume,act,readBindings,
        withdraw(token){const plan=withdrawFeatureBattle(getState(),registry,getContext(),token);persist(plan);paused='';endCombat();fighters={};render();return plan;},
        view(){return featureBattleView(getState(),registry,getContext(),readBindings());},
        isRunning(){return getCombat()?.featureBattleSessionId===featureBattleToken(getState())?.sessionId&&!!featureBattleToken(getState());},
        pauseReason:()=>paused};
}
