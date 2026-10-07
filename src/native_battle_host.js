import {commitNativeBattleStrike,withdrawNativeBattle,readNativeFighter} from './native_battle.js';
import {commitPartyBattleAction} from './party_battle.js';
import {PARTY_HELPER} from './native_battle_contracts.js';
import {ROAD_RIVAL} from './frontier_campaign.js';

// Native Combat owns cadence/display; one saved executor owns every effect.
export function createNativeBattleHost({Combat,Enemy,registry,player,getState,getContext,persist,getCombat,setCombat,endCombat,refresh,render}) {
    const playerFighter={id:'player',name:player.name,tags:{},is_alive:true,
        getFullStats:()=>player.getFullStats(),getAttackPower:()=>player.getAttackPower(),getEquipment:()=>player.getEquipment(),
        hasShield:()=>player.hasShield(),getBlockStrength:()=>player.getBlockStrength(),getTotalSkillLevel:id=>player.getTotalSkillLevel(id),
        getStats:()=>player.getStats(),getLevelableComponent:()=>player.getLevelableComponent()};
    let fighters={};
    const sync=()=>{
        const state=getState(),b=state.simulation?.sessions.player?.nativeBattle;
        for(const [id,fighter] of Object.entries(fighters)) {
            if(id!=='player')Object.assign(fighter.getFullStats(),state.simulation.people[id].vitals);
            fighter.is_alive=!b?.fighters||b.fighters[id]?.status==='active';
        }
        refresh();
    };
    return {
        resume() {
            const state=getState(),session=state.simulation?.sessions.player,b=session?.nativeBattle;
            if(!b)throw new Error('No saved native contest.');
            if(getCombat())throw new Error('Finish the current combat first.');
            if(player.getFullStats().health<=1||state.simulation.people[ROAD_RIVAL].vitals.health<=1)throw new Error('Recover before starting another duel.');
            const ids=b.schema===2?['player',PARTY_HELPER,ROAD_RIVAL]:['player',ROAD_RIVAL];
            fighters={player:playerFighter};playerFighter.name=player.name;playerFighter.is_alive=true;
            for(const id of ids.filter(id=>id!=='player')) {
                const saved=state.simulation.people[id];
                const fighter=new Enemy({id,name:id===ROAD_RIVAL?'Mara':'Lio',description:id===ROAD_RIVAL?'A rival association scout':'A consenting braced porter',add_to_bestiary:false,tags:['living','person'],stats:{...saved.body,health:saved.vitals.max_health,max_stamina:saved.vitals.max_stamina}});
                fighter.init();Object.assign(fighter.getFullStats(),saved.vitals);fighter.is_alive=b.schema===1||b.fighters[id].status==='active';fighters[id]=fighter;
            }
            const attackers=ids.filter(id=>id!==ROAD_RIVAL).map(id=>fighters[id]);
            const combat=new Combat({attackers,defenders:[fighters[ROAD_RIVAL]],is_special_combat:true,show_stance_controls:false,
                attackers_ui_slot:document.getElementById('campaign_attacker_box'),defenders_ui_slot:document.getElementById('campaign_defender_box'),
                actionAdapter:({fighter,target})=>{
                    const current=getState().simulation?.sessions.player,active=current?.nativeBattle;
                    if(!active||current.id!==session.id)return;
                    if(active.schema===2&&active.fighters[fighter.id].status!=='active')return;
                    if(active.schema===2&&fighter.id===PARTY_HELPER&&active.guard)return;
                    try {
                        const next=active.schema===2
                            ?commitPartyBattleAction(getState(),registry,{type:fighter.id===PARTY_HELPER?'guard':'strike',actorId:fighter.id,targetId:fighter.id==='player'?ROAD_RIVAL:'player',
                                sessionId:current.id,sequence:getState().sequence,action:active.actions,fighters:Object.fromEntries(Object.entries(fighters).map(([id,f])=>[id,readNativeFighter(f)]))},getContext())
                            :commitNativeBattleStrike(getState(),registry,{actorId:fighter.id,targetId:target.id,attacker:readNativeFighter(fighter),target:readNativeFighter(target)},getContext());
                        persist(next);
                        if(!getState().simulation.sessions.player?.nativeBattle)endCombat();else sync();
                    }catch(error){endCombat();render(`Native contest paused before an uncommitted action: ${error.message}`);}
                    render();
                }});
            setCombat(combat);combat.start();render();
        },
        release(sequence,action,sessionId) {
            const plan=commitPartyBattleAction(getState(),registry,{type:'release',actorId:PARTY_HELPER,sequence,action,sessionId},getContext());persist(plan);
            if(getCombat())sync();render();
        },
        withdraw(sequence) {const plan=withdrawNativeBattle(getState(),registry,getContext(),sequence);persist(plan);endCombat();render();}
    };
}
